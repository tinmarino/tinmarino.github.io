'use strict';

/*
 * Java crypto sink logger for authorized Android testing.
 *
 * Start broad, then narrow. This hook logs algorithms, key metadata and bounded
 * byte summaries for Cipher, Mac and KeyStore calls. It is meant to locate the
 * exact runtime point where plaintext, HMAC messages, AES keys or wrapped keys
 * appear. Hardware-backed keys may not expose encoded bytes; that is expected.
 */

const MAX_BYTES = 256;

function emit(event) {
    try { send({ kind: event.kind || 'crypto-event', payload: event }); }
    catch (error) { console.log('[crypto-sinks] send failed: ' + error); }
}

function safeString(value) {
    try {
        if (value === null || value === undefined) return '';
        return String(value);
    } catch (_) {
        return '<toString-error>';
    }
}

function bytesSummary(javaBytes) {
    if (javaBytes === null || javaBytes === undefined) return null;
    try {
        const length = javaBytes.length;
        const limit = Math.min(length, MAX_BYTES);
        let hex = '';
        let ascii = '';
        for (let index = 0; index < limit; index++) {
            const value = javaBytes[index] & 0xff;
            hex += value.toString(16).padStart(2, '0');
            ascii += value >= 0x20 && value < 0x7f ? String.fromCharCode(value) : '.';
        }
        return { length, shown: limit, hex, ascii };
    } catch (error) {
        return { error: safeString(error) };
    }
}

function keySummary(key) {
    if (!key) return null;
    const out = {};
    try { out.class_name = safeString(key.$className || key.getClass().getName()); } catch (_) {}
    try { out.algorithm = safeString(key.getAlgorithm()); } catch (_) {}
    try { out.format = safeString(key.getFormat()); } catch (_) {}
    try { out.encoded = bytesSummary(key.getEncoded()); } catch (error) { out.encoded_error = safeString(error); }
    return out;
}

function hookCipher() {
    const Cipher = Java.use('javax.crypto.Cipher');

    Cipher.init.overloads.forEach(function (overload) {
        overload.implementation = function () {
            const args = Array.prototype.slice.call(arguments);
            let opmode = '<unknown>';
            let key = null;
            try { opmode = safeString(args[0]); } catch (_) {}
            try { key = args[1]; } catch (_) {}
            emit({ kind: 'cipher-init', algorithm: safeString(this.getAlgorithm()), opmode, key: keySummary(key), overload: overload.argumentTypes.map(function (arg) { return arg.className; }).join(',') });
            return overload.apply(this, arguments);
        };
    });

    Cipher.update.overloads.forEach(function (overload) {
        overload.implementation = function () {
            const result = overload.apply(this, arguments);
            try {
                emit({ kind: 'cipher-update', algorithm: safeString(this.getAlgorithm()), input: bytesSummary(arguments[0]), output: bytesSummary(result) });
            } catch (_) {}
            return result;
        };
    });

    Cipher.doFinal.overloads.forEach(function (overload) {
        overload.implementation = function () {
            const result = overload.apply(this, arguments);
            try {
                emit({ kind: 'cipher-dofinal', algorithm: safeString(this.getAlgorithm()), input: arguments.length ? bytesSummary(arguments[0]) : null, output: bytesSummary(result) });
            } catch (_) {}
            return result;
        };
    });
}

function hookMac() {
    const Mac = Java.use('javax.crypto.Mac');

    const macInitOverload = Mac.init.overload('java.security.Key');
    macInitOverload.implementation = function (key) {
        emit({ kind: 'mac-init', algorithm: safeString(this.getAlgorithm()), key: keySummary(key) });
        return macInitOverload.call(this, key);
    };

    Mac.update.overloads.forEach(function (overload) {
        overload.implementation = function () {
            try { emit({ kind: 'mac-update', algorithm: safeString(this.getAlgorithm()), input: arguments.length ? bytesSummary(arguments[0]) : null }); } catch (_) {}
            return overload.apply(this, arguments);
        };
    });

    Mac.doFinal.overloads.forEach(function (overload) {
        overload.implementation = function () {
            const result = overload.apply(this, arguments);
            try { emit({ kind: 'mac-dofinal', algorithm: safeString(this.getAlgorithm()), input: arguments.length ? bytesSummary(arguments[0]) : null, output: bytesSummary(result) }); } catch (_) {}
            return result;
        };
    });
}

function hookKeyStore() {
    const KeyStore = Java.use('java.security.KeyStore');
    const getKeyOverload = KeyStore.getKey.overload('java.lang.String', '[C');
    getKeyOverload.implementation = function (alias, password) {
        const key = getKeyOverload.call(this, alias, password);
        emit({ kind: 'keystore-getkey', alias: safeString(alias), key: keySummary(key) });
        return key;
    };
}

Java.perform(function () {
    try { hookCipher(); emit({ kind: 'log', msg: 'Cipher hooks installed' }); } catch (error) { emit({ kind: 'log', msg: 'Cipher hook failed: ' + error }); }
    try { hookMac(); emit({ kind: 'log', msg: 'Mac hooks installed' }); } catch (error) { emit({ kind: 'log', msg: 'Mac hook failed: ' + error }); }
    try { hookKeyStore(); emit({ kind: 'log', msg: 'KeyStore hooks installed' }); } catch (error) { emit({ kind: 'log', msg: 'KeyStore hook failed: ' + error }); }
});
