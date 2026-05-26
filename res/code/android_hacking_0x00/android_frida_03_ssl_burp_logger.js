'use strict';

/*
 * SSL_read/SSL_write Burp-paste logger.
 *
 * This captures plaintext at the SSL API boundary inside the app process. It is
 * useful when TLS pinning blocks Burp or the app ignores Android proxy settings.
 * It only works when the SSL provider exports SSL_read and SSL_write. Flutter
 * often statically links and strips BoringSSL; in that case you need a per-build
 * internal offset or another capture path.
 */

const MAX_BODY = 64 * 1024;
const SSL_MODULE_ORDER = ['libflutter.so', 'libssl.so', 'libboringssl.so', 'libconscrypt_jni.so'];
let sequence = 0;
const connections = {};

function emit(event) {
    try { send(event); }
    catch (error) { console.log('[ssl-burp] send failed: ' + error); }
}

function pad(number, width) {
    let value = '' + number;
    while (value.length < width) value = '0' + value;
    return value;
}

function isoNow(fileSafe) {
    const now = new Date();
    const separator = fileSafe ? '-' : ':';
    return now.getFullYear() + '-' + pad(now.getMonth() + 1, 2) + '-' + pad(now.getDate(), 2) +
        'T' + pad(now.getHours(), 2) + separator + pad(now.getMinutes(), 2) + separator + pad(now.getSeconds(), 2);
}

function decodeBuffer(buffer, length) {
    try { return buffer.readUtf8String(Math.min(length, MAX_BODY)); } catch (_) {}
    try {
        const bytes = new Uint8Array(buffer.readByteArray(Math.min(length, MAX_BODY)));
        let text = '';
        for (let index = 0; index < bytes.length; index++) {
            const byte = bytes[index];
            text += (byte >= 0x20 && byte < 0x7f) || byte === 0x0a || byte === 0x0d || byte === 0x09
                ? String.fromCharCode(byte)
                : '\\x' + (byte < 16 ? '0' : '') + byte.toString(16);
        }
        return text;
    } catch (_) {
        return null;
    }
}

function parseRequestMeta(text) {
    const lines = text.split(/\r?\n/);
    let host = '';
    let path = '';
    const first = lines[0].match(/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+(\S+)/);
    if (first) path = first[2];
    for (let index = 1; index < lines.length && index < 40; index++) {
        const hostMatch = lines[index].match(/^[Hh]ost:\s*(\S+)/);
        if (hostMatch) {
            host = hostMatch[1];
            break;
        }
        if (lines[index].trim() === '') break;
    }
    return { host, path };
}

function isHttpComplete(buffer, isRequest) {
    const headerEnd = buffer.indexOf('\r\n\r\n');
    if (headerEnd < 0) return false;
    const header = buffer.substring(0, headerEnd);
    const body = buffer.substring(headerEnd + 4);
    const contentLength = header.match(/[Cc]ontent-[Ll]ength:\s*(\d+)/);
    if (contentLength) return body.length >= parseInt(contentLength[1], 10);
    if (/chunked/i.test(header)) return body.indexOf('0\r\n\r\n') >= 0;
    if (isRequest) return /^(GET|HEAD|DELETE|OPTIONS)/.test(buffer);
    return body.length > 0 || /^HTTP\/[^\r\n]+\r\n/.test(buffer);
}

function getConnection(sslPointer) {
    const key = sslPointer.toString();
    if (!connections[key]) {
        connections[key] = { req: '', resp: '', req_ts: null, resp_ts: null };
    }
    return connections[key];
}

function flushConnection(sslKey, reason) {
    const connection = connections[sslKey];
    if (!connection || !connection.req) return;
    sequence += 1;
    const meta = parseRequestMeta(connection.req);
    emit({
        kind: 'pair',
        payload: {
            seq: sequence,
            ts_file: isoNow(true),
            host: meta.host,
            path: meta.path,
            req_ts: connection.req_ts || isoNow(false),
            resp_ts: connection.resp_ts || isoNow(false),
            req: connection.req,
            resp: connection.resp,
            reason,
        },
    });
    delete connections[sslKey];
}

function findSslSymbols() {
    for (const moduleName of SSL_MODULE_ORDER) {
        const module = Process.findModuleByName(moduleName);
        if (!module) continue;
        const sslRead = module.findExportByName('SSL_read');
        const sslWrite = module.findExportByName('SSL_write');
        if (sslRead && sslWrite) return { moduleName, sslRead, sslWrite };
    }
    return null;
}

function installHooks() {
    const symbols = findSslSymbols();
    if (!symbols) {
        emit({ kind: 'log', msg: 'No exported SSL_read/SSL_write found. Loaded SSL-ish modules follow.' });
        Process.enumerateModules().forEach(function (module) {
            if (/ssl|flutter|boring|conscrypt|crypto/i.test(module.name)) {
                emit({ kind: 'log', msg: module.name + ' @ ' + module.base + ' size=0x' + module.size.toString(16) });
            }
        });
        return;
    }

    emit({ kind: 'log', msg: 'Hooking ' + symbols.moduleName + ' SSL_read=' + symbols.sslRead + ' SSL_write=' + symbols.sslWrite });

    Interceptor.attach(symbols.sslWrite, {
        onEnter: function (args) {
            this.ssl = args[0];
            this.buffer = args[1];
        },
        onLeave: function (retval) {
            const length = retval.toInt32();
            if (length <= 0) return;
            const data = decodeBuffer(this.buffer, length);
            if (!data) return;
            const sslKey = this.ssl.toString();
            if (/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS) \//.test(data)) {
                if (connections[sslKey]) flushConnection(sslKey, 'new-request');
                const connection = getConnection(this.ssl);
                connection.req = data;
                connection.req_ts = isoNow(false);
                return;
            }
            const existing = connections[sslKey];
            if (existing && existing.req && !isHttpComplete(existing.req, true)) existing.req += data;
        },
    });

    Interceptor.attach(symbols.sslRead, {
        onEnter: function (args) {
            this.ssl = args[0];
            this.buffer = args[1];
        },
        onLeave: function (retval) {
            const length = retval.toInt32();
            if (length <= 0) return;
            const data = decodeBuffer(this.buffer, length);
            if (!data) return;
            const sslKey = this.ssl.toString();
            const connection = getConnection(this.ssl);
            if (!connection.resp_ts) connection.resp_ts = isoNow(false);
            if (/^HTTP\//.test(data) && connection.resp) {
                flushConnection(sslKey, 'new-response');
                const nextConnection = getConnection(this.ssl);
                nextConnection.resp = data;
                nextConnection.resp_ts = isoNow(false);
            } else {
                connection.resp += data;
            }
            if (connection.req && isHttpComplete(connection.resp, false)) flushConnection(sslKey, 'response-complete');
        },
    });
}

installHooks();
