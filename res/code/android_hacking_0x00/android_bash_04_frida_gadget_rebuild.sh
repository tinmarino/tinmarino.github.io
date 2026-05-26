#!/usr/bin/env bash
set -euo pipefail

# Rebuild an APK with Frida Gadget loaded from an Activity constructor.
#
# This is a generic skeleton for authorized lab work. Keep a clean apktool
# decode untouched, work on a copy, then rebuild, zipalign, sign and install.

ADB=${ADB:-adb}
APKTOOL=${APKTOOL:-apktool}
ZIPALIGN=${ZIPALIGN:-zipalign}
APKSIGNER=${APKSIGNER:-apksigner}
DECODED_DIR=${DECODED_DIR:-Source_v1.00}
WORK_DIR=${WORK_DIR:-Source_v1.00_gadget}
MAIN_ACTIVITY_SMALI=${MAIN_ACTIVITY_SMALI:-}
ABI=${ABI:-arm64-v8a}
GADGET_SO=${GADGET_SO:-libfrida-gadget.so}
LOAD_NAME=${LOAD_NAME:-fg}
APP_PACKAGE=${APP_PACKAGE:-target.cl}
OUT_APK=${OUT_APK:-example_gadget_signed.apk}
KEYSTORE=${KEYSTORE:-"$HOME/.android/debug.keystore"}

if [ -z "$MAIN_ACTIVITY_SMALI" ]; then
    printf 'Set MAIN_ACTIVITY_SMALI=path/to/MainActivity.smali inside the apktool tree.\n' >&2
    exit 2
fi

rm -rf "$WORK_DIR"
cp -a "$DECODED_DIR" "$WORK_DIR"

# Single-APK rebuilds from Play/AAB installs usually need these manifest flags relaxed.
python3 - "$WORK_DIR/AndroidManifest.xml" <<'PY'
from pathlib import Path
from sys import argv

path = Path(argv[1])
text = path.read_text(encoding="utf-8")
text = text.replace(' android:requiredSplitTypes="base__abi,base__density"', '')
text = text.replace(' android:splitTypes=""', '')
text = text.replace('android:isSplitRequired="true"', 'android:isSplitRequired="false"')
text = text.replace('android:extractNativeLibs="false"', 'android:extractNativeLibs="true"')
path.write_text(text, encoding="utf-8")
PY

mkdir -p "$WORK_DIR/lib/$ABI"
cp "$GADGET_SO" "$WORK_DIR/lib/$ABI/lib${LOAD_NAME}.so"

# Patch the first zero-arg constructor in the chosen smali file. If the app has
# a custom Application class, loading there may be even earlier than Activity.
python3 - "$WORK_DIR/$MAIN_ACTIVITY_SMALI" "$LOAD_NAME" <<'PY'
from pathlib import Path
from re import DOTALL, compile
from sys import argv

path = Path(argv[1])
load_name = argv[2]
source = path.read_text(encoding="utf-8")
pattern = compile(r'(\.method public constructor <init>\(\)V\n)\s*\.locals (\d+)\n(.*?)return-void\n\.end method\n', DOTALL)

def replace(match):
    locals_count = max(int(match.group(2)), 1)
    body = match.group(3)
    return (
        f'{match.group(1)}    .locals {locals_count}\n'
        f'{body}\n'
        f'    const-string v0, "{load_name}"\n'
        f'    invoke-static {{v0}}, Ljava/lang/System;->loadLibrary(Ljava/lang/String;)V\n'
        f'    return-void\n.end method\n'
    )

patched, count = pattern.subn(replace, source, count=1)
if count != 1:
    raise SystemExit(f'constructor not patched in {path}')
path.write_text(patched, encoding="utf-8")
PY

"$APKTOOL" b "$WORK_DIR" -o example_gadget_unsigned.apk
"$ZIPALIGN" -p -f 4 example_gadget_unsigned.apk example_gadget_aligned.apk
"$APKSIGNER" sign --ks "$KEYSTORE" --ks-pass pass:android --key-pass pass:android --ks-key-alias androiddebugkey --out "$OUT_APK" example_gadget_aligned.apk
"$APKSIGNER" verify --verbose "$OUT_APK"

"$ADB" uninstall "$APP_PACKAGE" || true
"$ADB" install --no-incremental "$OUT_APK"
printf 'Installed %s. Forward Gadget with: adb forward tcp:27042 tcp:27042\n' "$OUT_APK"
