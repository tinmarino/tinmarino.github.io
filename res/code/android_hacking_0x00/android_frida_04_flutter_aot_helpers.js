'use strict';

/*
 * Flutter/Dart AOT object helper skeleton.
 *
 * Dart object layouts and class IDs are build/runtime specific. Treat every
 * numeric value below as configuration, not a universal fact. Use this when you
 * already have an authorized target, a known module, and one or more offsets
 * found with a reversing tool or a prior backtrace.
 */

const CONFIG = {
    moduleName: 'libapp.so',
    oneByteStringCid: 94,
    twoByteStringCid: 95,
    uint8ListCid: 116,
    maxStringLength: 4096,
    maxBytesLength: 8192,
    offsets: [
        // { name: 'interesting function', offset: 0x123456 }
    ],
};

function emit(event) {
    try { send(event); }
    catch (error) { console.log('[dart-aot] send failed: ' + error); }
}

function bytesToHex(bytes) {
    let output = '';
    for (let index = 0; index < bytes.length; index++) output += bytes[index].toString(16).padStart(2, '0');
    return output;
}

function bytesToAscii(bytes) {
    let output = '';
    for (let index = 0; index < bytes.length; index++) {
        const byte = bytes[index];
        output += byte >= 0x20 && byte < 0x7f ? String.fromCharCode(byte) : '.';
    }
    return output;
}

function deTag(taggedPointer) {
    return ptr(taggedPointer).and(ptr('0xfffffffffffffffe'));
}

function isTaggedPointer(value) {
    try { return !value.isNull() && !value.and(ptr(1)).isNull(); }
    catch (_) { return false; }
}

function headerCid(headerU32) {
    return (headerU32 >>> 12) & 0xfffff;
}

function cidOf(taggedPointer) {
    if (!isTaggedPointer(taggedPointer)) return -1;
    try { return headerCid(deTag(taggedPointer).readU32()); }
    catch (_) { return -1; }
}

function dartString(taggedPointer) {
    const cid = cidOf(taggedPointer);
    if (cid !== CONFIG.oneByteStringCid && cid !== CONFIG.twoByteStringCid) return null;
    const object = deTag(taggedPointer);
    const length = object.add(8).readU32() >> 1;
    if (length < 0 || length > CONFIG.maxStringLength) return null;
    if (cid === CONFIG.oneByteStringCid) return object.add(16).readUtf8String(length);
    return object.add(16).readUtf16String(length);
}

function dartUint8List(taggedPointer) {
    if (cidOf(taggedPointer) !== CONFIG.uint8ListCid) return null;
    const object = deTag(taggedPointer);
    const length = object.add(20).readU32() >> 1;
    if (length < 0 || length > CONFIG.maxBytesLength) return null;
    return new Uint8Array(object.add(24).readByteArray(length));
}

function describeTagged(taggedPointer) {
    try {
        if (taggedPointer.isNull()) return 'null';
        if (!isTaggedPointer(taggedPointer)) return 'Smi(' + taggedPointer.shr(1).toString() + ')';
        const text = dartString(taggedPointer);
        if (text !== null) return 'String(' + JSON.stringify(text) + ')';
        const bytes = dartUint8List(taggedPointer);
        if (bytes !== null) return 'Uint8List(len=' + bytes.length + ',hex=' + bytesToHex(bytes).slice(0, 256) + ',ascii=' + JSON.stringify(bytesToAscii(bytes).slice(0, 160)) + ')';
        return 'cid=' + cidOf(taggedPointer) + '@' + taggedPointer;
    } catch (error) {
        return 'decode-error(' + error + ')@' + taggedPointer;
    }
}

function stackArg(context, index) {
    // Many Dart AOT ARM64 callsites keep logical args in a stack register rather
    // than normal C ABI x0/x1/x2. You must confirm the right register per build.
    const stackRegister = context.x15;
    if (!stackRegister || stackRegister.isNull()) return ptr(0);
    return stackRegister.add(8 * index).readPointer();
}

function findModuleBase() {
    try {
        const module = Process.findModuleByName(CONFIG.moduleName);
        if (module) return module.base;
    } catch (_) {}
    return null;
}

function installOffsetHooks() {
    const base = findModuleBase();
    if (!base) {
        emit({ kind: 'log', msg: CONFIG.moduleName + ' not loaded yet; retrying' });
        setTimeout(installOffsetHooks, 500);
        return;
    }
    emit({ kind: 'log', msg: CONFIG.moduleName + ' base=' + base });
    CONFIG.offsets.forEach(function (target) {
        const address = base.add(target.offset);
        try {
            Interceptor.attach(address, {
                onEnter: function () {
                    const args = [];
                    for (let index = 0; index < 8; index++) {
                        let value = ptr(0);
                        try { value = stackArg(this.context, index); } catch (_) {}
                        args.push({ index, value: value.toString(), description: describeTagged(value) });
                    }
                    emit({ kind: 'dart-enter', target: target.name, offset: '0x' + target.offset.toString(16), args });
                },
                onLeave: function (retval) {
                    emit({ kind: 'dart-leave', target: target.name, retval: retval.toString(), description: describeTagged(retval) });
                },
            });
            emit({ kind: 'log', msg: 'Hooked ' + target.name + ' @ ' + address });
        } catch (error) {
            emit({ kind: 'log', msg: 'Failed to hook ' + target.name + ': ' + error });
        }
    });
}

installOffsetHooks();
