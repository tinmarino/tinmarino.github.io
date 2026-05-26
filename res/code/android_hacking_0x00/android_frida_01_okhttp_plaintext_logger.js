'use strict';

/*
 * OkHttp plaintext logger for authorized Android testing.
 *
 * This observes requests before TLS encryption and responses after TLS
 * decryption by hooking OkHttp inside the target process. It does not need a
 * proxy, does not install a CA, and does not bypass certificate pinning. It
 * only works for traffic that actually uses OkHttp; Flutter dart:io, Cronet,
 * WebView and custom native stacks need separate hooks.
 *
 * Run examples:
 *   frida -U -f target.cl -l android_frida_01_okhttp_plaintext_logger.js
 *   frida -H 127.0.0.1:27042 -n Gadget -l android_frida_01_okhttp_plaintext_logger.js
 */

const MAX_BODY_BYTES = 1024 * 1024;
const REDACT_COMMON_SECRET_HEADERS = true;

function emit(event) {
    try {
        send({ kind: event.kind || 'event', payload: event });
    } catch (error) {
        console.log('[okhttp-log] send failed: ' + error);
    }
}

function safeString(value) {
    try {
        if (value === null || value === undefined) return '';
        return String(value);
    } catch (_) {
        return '<toString-error>';
    }
}

function headerValue(name, value) {
    if (!REDACT_COMMON_SECRET_HEADERS) return safeString(value);
    if (/^(authorization|cookie|set-cookie|x-api-key|x-auth-token)$/i.test(safeString(name))) {
        return '<redacted>';
    }
    return safeString(value);
}

function headersToObject(headers) {
    const out = {};
    try {
        const size = headers.size();
        for (let index = 0; index < size; index++) {
            const name = safeString(headers.name(index));
            out[name] = headerValue(name, headers.value(index));
        }
    } catch (error) {
        out['<headers-error>'] = safeString(error);
    }
    return out;
}

function requestBodyToString(request) {
    try {
        const body = request.body();
        if (!body) return '';
        const Buffer = Java.use('okio.Buffer');
        const buffer = Buffer.$new();
        body.writeTo(buffer);
        const size = buffer.size();
        if (size > MAX_BODY_BYTES) return '<body-too-large:' + size + '>';
        return safeString(buffer.readUtf8());
    } catch (error) {
        return '<body-error:' + safeString(error) + '>';
    }
}

function responseBodyToString(response) {
    try {
        const peeked = response.peekBody(MAX_BODY_BYTES);
        return safeString(peeked.string());
    } catch (error) {
        return '<body-error:' + safeString(error) + '>';
    }
}

function urlParts(urlObject) {
    const url = safeString(urlObject);
    let path = '/';
    let host = '';
    try { path = safeString(urlObject.encodedPath()); } catch (_) {}
    try {
        const query = safeString(urlObject.encodedQuery());
        if (query) path += '?' + query;
    } catch (_) {}
    try { host = safeString(urlObject.host()); } catch (_) {}
    return { url, host, path };
}

function requestToRaw(request) {
    const parts = urlParts(request.url());
    const method = safeString(request.method());
    const headers = headersToObject(request.headers());
    const lines = [method + ' ' + parts.path + ' HTTP/1.1'];
    if (!headers.Host && parts.host) lines.push('Host: ' + parts.host);
    Object.keys(headers).forEach(function (name) {
        lines.push(name + ': ' + headers[name]);
    });
    return lines.join('\n') + '\n\n' + requestBodyToString(request);
}

function responseToRaw(response) {
    const headers = headersToObject(response.headers());
    const lines = ['HTTP/1.1 ' + response.code() + ' ' + safeString(response.message())];
    Object.keys(headers).forEach(function (name) {
        lines.push(name + ': ' + headers[name]);
    });
    return lines.join('\n') + '\n\n' + responseBodyToString(response);
}

function requestMeta(request) {
    const parts = urlParts(request.url());
    return {
        method: safeString(request.method()),
        url: parts.url,
        host: parts.host,
        path: parts.path,
        headers: headersToObject(request.headers()),
    };
}

function responseMeta(response) {
    return {
        code: response.code(),
        message: safeString(response.message()),
        headers: headersToObject(response.headers()),
    };
}

function hookRealCall(className) {
    let RealCall;
    try {
        RealCall = Java.use(className);
    } catch (_) {
        return false;
    }

    if (RealCall.execute) {
        const executeOverload = RealCall.execute.overload();
        executeOverload.implementation = function () {
            const request = this.request();
            const started = Date.now();
            emit({ kind: 'okhttp-request', className, mode: 'sync', meta: requestMeta(request), raw: requestToRaw(request) });
            try {
                const response = executeOverload.call(this);
                emit({
                    kind: 'okhttp-pair',
                    className,
                    mode: 'sync',
                    elapsed_ms: Date.now() - started,
                    request: requestMeta(request),
                    response: responseMeta(response),
                    req: requestToRaw(request),
                    resp: responseToRaw(response),
                });
                return response;
            } catch (error) {
                emit({ kind: 'okhttp-error', className, mode: 'sync', error: safeString(error), request: requestMeta(request) });
                throw error;
            }
        };
    }

    if (RealCall.enqueue) {
        const enqueueOverload = RealCall.enqueue.overload('okhttp3.Callback');
        enqueueOverload.implementation = function (callback) {
            const request = this.request();
            emit({ kind: 'okhttp-request', className, mode: 'async', meta: requestMeta(request), raw: requestToRaw(request) });
            return enqueueOverload.call(this, callback);
        };
    }

    emit({ kind: 'log', msg: 'Hooked ' + className });
    return true;
}

function hookCallbacks() {
    Java.enumerateLoadedClasses({
        onMatch: function (className) {
            try {
                if (className.indexOf('okhttp3') === 0) return;
                const Candidate = Java.use(className);
                const interfaces = Candidate.class.getInterfaces();
                let implementsCallback = false;
                for (let index = 0; index < interfaces.length; index++) {
                    if (safeString(interfaces[index].getName()) === 'okhttp3.Callback') {
                        implementsCallback = true;
                        break;
                    }
                }
                if (!implementsCallback) return;
                if (Candidate.onResponse) {
                    Candidate.onResponse.overloads.forEach(function (overload) {
                        overload.implementation = function (call, response) {
                            try {
                                const request = call.request();
                                emit({
                                    kind: 'okhttp-pair',
                                    className,
                                    mode: 'async',
                                    request: requestMeta(request),
                                    response: responseMeta(response),
                                    req: requestToRaw(request),
                                    resp: responseToRaw(response),
                                });
                            } catch (error) {
                                emit({ kind: 'okhttp-callback-error', className, error: safeString(error) });
                            }
                            return overload.apply(this, arguments);
                        };
                    });
                }
                if (Candidate.onFailure) {
                    Candidate.onFailure.overloads.forEach(function (overload) {
                        overload.implementation = function (call, exception) {
                            try {
                                emit({ kind: 'okhttp-error', className, mode: 'async', error: safeString(exception), request: requestMeta(call.request()) });
                            } catch (_) {}
                            return overload.apply(this, arguments);
                        };
                    });
                }
                emit({ kind: 'log', msg: 'Hooked callback ' + className });
            } catch (_) {}
        },
        onComplete: function () {
            emit({ kind: 'log', msg: 'Callback enumeration complete' });
        },
    });
}

Java.perform(function () {
    const hooked = hookRealCall('okhttp3.internal.connection.RealCall') || hookRealCall('okhttp3.RealCall');
    if (!hooked) emit({ kind: 'log', msg: 'OkHttp RealCall was not found' });
    hookCallbacks();
});
