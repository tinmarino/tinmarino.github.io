# Android Hacking Field Guide

This is a practical field guide for authorized Android application testing. The fake target package used throughout is `target.cl`; replace it with the package you are allowed to test. The goal is to avoid losing hard-earned lab recipes: APK pull and patching, Frida Gadget, rooted emulators, user-level systemd services, Burp capture, OkHttp plaintext logging, WebView tracing, Flutter/Dart runtime hooks and crypto sink discovery.

How to read this file:

- Start with **Download and patch** when you only have a device and need to pull, decode, patch or rebuild an APK.
- Jump to **Emulator work** when your blocker is lab reliability: AVD startup, root, Burp CA, per-app DNAT, Frida services, mock GPS or sensors.
- Jump to **All to Burp** when you need plaintext HTTP: proxy, mitmproxy, OkHttp, WebView, SSL hooks or Burp-paste files.
- Jump to **Flutter and keys** when `jadx` is not enough, secrets are encrypted on disk, or the interesting logic lives in Dart AOT/native code.
- Treat every snippet as a template. Keep real client names, domains, tokens, phone numbers, national IDs, vehicle identifiers, request bodies and offsets out of public commits.

# Download and patch

### Get APK

```bash
# Get apk path -- it may list more than one entry (App Bundle splits):
#   base.apk, split_config.arm64_v8a.apk, split_config.xxhdpi.apk, split_config.en.apk, ...
adb shell pm list packages
adb shell pm path target.cl

adb pull /data/app/~~example==/target.cl-example/base.apk
mv base.apk target.cl.apk
```

If `pm path` shows split APKs, pull them all — base.apk alone usually has no native libs:

```bash
mkdir -p splits
for p in $(adb shell pm path target.cl | sed 's/^package://'); do
    adb pull "$p" splits/
done
```

### Manifest triage with Python

After `apktool d`, the first repeated command is usually: list exported components, deep links and intent filters. The helper below parses `AndroidManifest.xml` and prints tab-separated rows that are easy to grep or paste into notes.

```bash
python3 res/code/android_hacking_0x00/android_py_04_manifest_exports.py Source_v1.00/AndroidManifest.xml
```

```embed
/res/code/android_hacking_0x00/android_py_04_manifest_exports.py
```

### Patch APK

#### Disassemble

```bash
apktool d -o Source_v1.00/ target.cl.apk 
cd Source_v1.00
```

#### Patch code

File: target/cl/MainActivity.smali

```diff
-.method public constructor <init>()V
-    .locals 0
+.method public constructor <init>()V
+    .locals 1
+    # Variables start with index 0
+    const-string v0, "fg"   # Line added
+    invoke-static {v0}, Ljava/lang/System;->loadLibrary(Ljava/lang/String;)V   # Line added
```

#### Copy library binary

Download the [Frida Gadget](https://github.com/frida/frida/releases) and rename it libfg.so

```bash
mkdir -p lib/arm64-v8a/
cp ~/Iso/Jar/libfg.so lib/arm64-v8a/
```

#### Bring in native libs from the ABI split

If the app was distributed as an App Bundle, all the original `.so` files live in `split_config.arm64_v8a.apk` (not in `base.apk`). If you skip this step and rebuild, the app will crash at launch with something like:

```text
com.facebook.soloader.SoLoaderDSONotFoundError: couldn't find DSO to load: libreactnative.so
```

Extract every `.so` from the ABI split into the decoded `lib/arm64-v8a/` next to your `libfg.so`:

```bash
# From inside Source_v1.00/
unzip -j -o ../splits/split_config.arm64_v8a.apk 'lib/arm64-v8a/*.so' -d lib/arm64-v8a/
ls lib/arm64-v8a/   # should now include libreactnative.so, libhermes.so, ..., libfg.so
```

#### Patch manifest (if installed from Play Store as App Bundle)

If the original was installed as split APKs (Play Store / AAB), the manifest will declare splits as required, and your single rebuilt APK won't install (`INSTALL_FAILED_MISSING_SPLIT`). Also, if `extractNativeLibs="false"`, the system requires page-aligned uncompressed `.so` files — easier to just flip it to `true`.

Edit `Source_v1.00/AndroidManifest.xml` on the root `<manifest>` / `<application>` tags:

```diff
-<manifest ... android:requiredSplitTypes="base__abi,base__density" android:splitTypes="" ...>
+<manifest ... ...>
...
-  <application ... android:isSplitRequired="true" android:extractNativeLibs="false" ...>
+  <application ... android:extractNativeLibs="true" ...>
```

#### Recompile

```bash
# 1. Rebuild
apktool b Source_v1.00 -o target.cl_mod.apk

# 2. Zipalign (must come BEFORE signing; -p page-aligns .so files)
zipalign -p -f 4 target.cl_mod.apk target.cl_aligned.apk

# 3. One-time: generate a debug keystore
keytool -genkey -v -keystore ~/.android/debug.keystore \
  -storepass android -alias androiddebugkey -keypass android \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=Android Debug,O=Android,C=US"

# 4. Sign (v2/v3 schemes)
apksigner sign --ks ~/.android/debug.keystore \
  --ks-pass pass:android --key-pass pass:android \
  --ks-key-alias androiddebugkey \
  --out target.cl_signed.apk target.cl_aligned.apk

# 5. Verify
apksigner verify --verbose target.cl_signed.apk

# 6. Uninstall the original (signatures won't match) and install the modified one
adb uninstall target.cl
adb install target.cl_signed.apk
```

`zipalign` and `apksigner` ship with the Android SDK build-tools; on Debian/Ubuntu they're also available as the `zipalign` and `apksigner` apt packages.

# Useful snippets

### Permit ADB TCP

```bash
adb connect 192.0.2.10:5555
adb tcpip 5555
```

More in [ADB snippet](#adb-snippet-large).

### Device and package state

```bash
adb version
adb devices -l
adb shell pm path target.cl
```

More in [state snippet](#state-snippet-large).

### Start, stop and restart the app

```bash
adb shell monkey -p target.cl -c android.intent.category.LAUNCHER 1
adb shell am force-stop target.cl
adb shell am force-stop target.cl && adb shell monkey -p target.cl -c android.intent.category.LAUNCHER 1
```

More in [app lifecycle snippet](#app-lifecycle-snippet-large).

### Logcat that stays useful

```bash
adb logcat -c
adb logcat -v time -b crash
pid=$(adb shell pidof target.cl | tr -d '\r')
adb logcat --pid "$pid" -v time
```

More in [logcat snippet](#logcat-snippet-large).

### Screenshots and UI dumps

```bash
adb exec-out screencap -p > screen.png
adb shell uiautomator dump /sdcard/window.xml
adb pull /sdcard/window.xml .
```

More in [screen and UI snippet](#screen-ui-snippet-large).

### Proxy, reverse and forward

```bash
adb shell settings put global http_proxy 10.0.2.2:8080
adb shell settings put global http_proxy :0
adb reverse tcp:8080 tcp:8080
```

More in [proxy snippet](#proxy-snippet-large).

### Pull app data safely

```bash
adb exec-out run-as target.cl tar czf - -C /data/data/target.cl . > target-cl-data.tar.gz
adb shell "su -c 'tar czf /sdcard/target-cl-data.tar.gz -C /data/data/target.cl .'"
adb pull /sdcard/target-cl-data.tar.gz .
```

More in [data pull snippet](#data-pull-snippet-large).

### Install and clear state

```bash
adb uninstall target.cl || true
adb install --no-incremental target.cl_signed.apk
adb shell pm clear target.cl
```

More in [install snippet](#install-snippet-large).

### Frida attach and server sanity

```bash
frida-ps -Uai
frida -U -n target.cl -l hook.js
frida -U -f target.cl -l hook.js --runtime=v8
```

More in [Frida snippet](#frida-snippet-large).

### Rooted emulator iptables DNAT quick check

```bash
pid=$(adb shell pidof target.cl | tr -d '\r')
uid=$(adb shell "grep '^Uid:' /proc/${pid}/status" | awk '{print $2}' | tr -d '\r')
adb shell "iptables -t nat -A OUTPUT -p tcp --dport 443 -m owner --uid-owner ${uid} -j DNAT --to-destination 10.0.2.2:8080"
```

More in [DNAT snippet](#dnat-snippet-large).

### Small user service

```bash
systemd-run --user --unit android-lab --same-dir --collect \
  bash -lc 'adb devices && sleep infinity'
systemctl --user status android-lab.service
```

More in [user service snippet](#user-service-snippet-large).

### Frida trace quick start

```bash
frida-trace -U -f target.cl -j 'target.cl.*!*' --runtime=v8
frida-trace -U -f target.cl -i 'open*' -i 'read' -i 'write' --runtime=v8
```

More in [Frida trace snippet](#frida-trace-snippet-large).

### Wait for unlock with Frida attached

```bash
frida -U -f target.cl
adb shell input keyevent KEYCODE_WAKEUP
%resume
```

More in [unlock snippet](#unlock-snippet-large).


# Frida Gadget Burp baseline

### Intercept HTTPS with Burp Suite (via Frida Gadget)

With Burp listening on `127.0.0.1:8080`, you don't need to expose it on the LAN — use `adb reverse` so the device's localhost tunnels to the host:

```bash
adb reverse tcp:8080 tcp:8080
```

Then drive the Frida Gadget that the app loaded (port 27042 by default) and inject HTTPToolkit's [`frida-interception-and-unpinning`](https://github.com/httptoolkit/frida-interception-and-unpinning) scripts:

```bash
# Forward the Gadget port to the host
adb forward tcp:27042 tcp:27042

# Sanity check
frida-ps -H 127.0.0.1:27042   # should show: Gadget

# In config.js: set PROXY_HOST = '127.0.0.1', PROXY_PORT = 8080,
# and paste your Burp CA cert (PEM) into CERT_PEM.

cd ~/Program/frida-interception-and-unpinning
frida -H 127.0.0.1:27042 -n Gadget \
  -l config.js \
  -l android/android-proxy-override.js \
  -l android/android-system-certificate-injection.js \
  -l android/android-certificate-unpinning.js \
  -l android/android-certificate-unpinning-fallback.js
```

The session must stay attached for the hooks to persist — leave the Frida REPL running while you use the app.

### Gotchas / lessons learned

A grab-bag of things that broke at least once, in roughly the order you'll hit them:

- **Smali register accounting**. In an instance method, `.locals N` allocates `v0..v(N-1)`. Higher-numbered `vN..` map onto `p0..` (parameters; `p0` = `this`). Reading `p0` before the super `<init>` runs triggers `VerifyError: Expected initialization on uninitialized reference`. When inserting a `loadLibrary` call into a constructor, use `v0` with `.locals 1`, not `v1`.

- **App Bundle splits**. Apps installed from the Play Store are usually App Bundles: `pm path <pkg>` returns several APKs (`base.apk`, `split_config.<abi>.apk`, `split_config.<density>.apk`, `split_config.<lang>.apk`). The native libraries (`.so`) live in the ABI split, not in `base.apk`. Pull and use **all** splits, or your rebuilt single APK will crash at startup with `SoLoaderDSONotFoundError: couldn't find DSO to load: libreactnative.so` (or similar).

- **Manifest split-required flags**. App Bundle base manifests declare `android:isSplitRequired="true"` and `android:requiredSplitTypes="base__abi,base__density"`. Both must be removed before a single-APK install is accepted (`INSTALL_FAILED_MISSING_SPLIT` otherwise).

- **`extractNativeLibs="false"`**. With this flag, Android refuses to install unless every `.so` is stored uncompressed and page-aligned inside the APK (`Failed to extract native libraries, res=-2`). Either flip it to `"true"` in the manifest, or make sure `zipalign -p 4` is run on the built APK; flipping is the easier route.

- **Zipalign then sign, never the reverse**. Aligning after signing invalidates the v2/v3 signature. Always run the pipeline as `apktool b → zipalign -p 4 → apksigner sign → apksigner verify → adb install`.

- **Signature mismatch on install**. The modded APK is signed with your debug key, not the original developer key, so you must `adb uninstall <pkg>` before installing — and that wipes the app's data.

- **Frida client/gadget version mismatch**. The Frida client (`frida-tools`) and the embedded Gadget speak a versioned wire protocol. Mismatches produce `Failed to spawn: connection closed` or `Failed to load script: the connection is closed` with no further hint. Check the Gadget's embedded version with `strings libfg.so | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$'`, then `pip install --break-system-packages frida==<version> frida-tools` to match.

- **Frida 17 API removals**. `Module.findExportByName` and `Module.getExportByName` (static, two-argument) were removed in Frida 17 in favor of instance methods (`Process.findModuleByName(name).findExportByName(...)`) and `Module.findGlobalExportByName`. Scripts that predate this (HTTPToolkit's included, at time of writing) need a compat shim:

  ```javascript
  if (typeof Module.findExportByName !== 'function') {
      Module.findExportByName = (moduleName, exportName) => {
          const mod = Process.findModuleByName(moduleName);
          const addr = mod && mod.findExportByName(exportName);
          return addr || (Module.findGlobalExportByName?.(exportName) ?? null);
      };
  }
  ```

- **React Native + native hooks = SIGSEGV**. HTTPToolkit ships `native-connect-hook.js` (rewrites `connect()` to redirect raw sockets) and `native-tls-hook.js` (hooks BoringSSL inside `libreactnative.so`). On React Native (Hermes/JSI) apps, both reliably segfault the JS executor thread (`mqt_v_js`). Use **only** the Java-level scripts under `android/` — React Native traffic goes through OkHttp anyway, so Java-level pinning bypass + proxy override is enough.

- **`adb reverse` beats LAN exposure**. Burp out of the box binds to `127.0.0.1`. Rather than reconfiguring it to listen on the LAN (and risking exposing it to other networks), run `adb reverse tcp:8080 tcp:8080` and set `PROXY_HOST = '127.0.0.1'` in the Frida config — connections originating on the device's localhost are tunneled to the host over USB/Wi-Fi adb.

- **Conscrypt `TrustManagerImpl.verifyChain`**. On modern Android, TLS validation eventually lands in `com.android.org.conscrypt.TrustManagerImpl`. The HTTPToolkit fallback only auto-patches public `X509TrustManager.checkServerTrusted` overloads, so if the error stack points at `TrustManagerImpl->verifyChain` you'll see `[ ] Unrecognized TLS error - this must be patched manually`. Patch the public entrypoint directly:

  ```javascript
  Java.perform(() => {
      const TM = Java.use('com.android.org.conscrypt.TrustManagerImpl');
      TM.checkServerTrusted.overloads.forEach((m) => {
          m.implementation = function () {
              return m.returnType.className === 'java.util.List'
                  ? Java.use('java.util.Arrays').asList(arguments[0])
                  : undefined;
          };
      });
  });
  ```

# Emulator work

### Field Notes From Real APK Work

The workflow above covers the classic Gadget path. In practice, modern Android targets are a mix of Java/Kotlin, Flutter/Dart AOT, WebView, Cronet, OkHttp, native TLS, app-specific crypto, App Bundle splits, anti-tamper checks, rooted emulators and physical phones. The useful lesson is not one magic bypass; it is choosing the cheapest observation layer that gives you plaintext without destabilizing the app.

Use this decision tree:

- If the app uses OkHttp, hook OkHttp first. You observe plaintext before TLS and after TLS without touching certificate pinning.
- If the app uses WebView, hook WebView navigation and `addJavascriptInterface` before guessing at bridges or deep links.
- If the app ignores Android proxy settings or pins TLS, hook `SSL_read` / `SSL_write` inside the process if symbols are exported.
- If the app is Flutter and `SSL_read` / `SSL_write` are stripped, expect per-build work: reFlutter, rooted DNAT + trusted CA, or a known `libflutter.so` offset.
- If the app stores secrets through Android Keystore or Flutter Secure Storage, filesystem access usually gives encrypted blobs, not plaintext. Hook runtime crypto sinks.
- If the emulator itself is unstable, fix the lab first: `systemd-run --user`, SDK `adb`, software GPU and clean proxy teardown save hours.

### Stable Emulator Launcher

Use `systemd-run --user` for long-lived emulator sessions. Avoid `nohup ... &` for overnight work; emulator processes often die with the shell session. `swiftshader_indirect` is a useful first fallback on hosts with flaky GPU passthrough.

```embed
/res/code/android_hacking_0x00/android_bash_01_stable_avd_systemd.sh
```

### Generic app lab controller

For longer work, a single local controller script is worth it. The generic script below is modeled after the kind of helper that gets reused constantly: start an AVD as a user service, wait for boot, install Burp CA on a rooted test image, route only `target.cl` through Burp, set test GPS, start `frida-server`, and keep a Frida hook running as another user service.

```embed
/res/code/android_hacking_0x00/android_bash_05_generic_app_lab.sh
```

### Rooted Burp Capture With Per-App DNAT

The cleanest rooted-emulator Burp setup is not a permanent `-http-proxy` flag. Start the emulator normally, install Burp's CA in the rooted test image, set Android's proxy, then add an owner-scoped `iptables` DNAT rule for the target app UID. This limits breakage from Google/Firebase/SDK traffic and gives you a fast `disable` command when an SDK refuses to work under interception.

Android 14 can validate through the Conscrypt APEX certificate store, so the snippet mirrors the CA into both the legacy store and the APEX store on disposable rooted images.

```embed
/res/code/android_hacking_0x00/android_bash_02_rooted_burp_dnat.sh
```

### Sensor Motion Loop

Some SDKs treat a perfectly frozen emulator sensor stream as suspicious. A simple accelerometer/gyroscope loop is not an exploit by itself; it just makes the lab device less physically impossible while you observe behavior.

```embed
/res/code/android_hacking_0x00/android_bash_03_sensor_motion_loop.sh
```

### Generic Frida Gadget Rebuild

For non-root devices, Gadget is still the workhorse. The generic pipeline is: decode with `apktool`, work on a copy, relax split/native-lib manifest flags, copy Gadget as `lib<name>.so`, insert `System.loadLibrary("<name>")`, rebuild, zipalign, sign, uninstall the original and install the patched APK. The uninstall is usually required because your debug signature does not match the developer signature.

```embed
/res/code/android_hacking_0x00/android_bash_04_frida_gadget_rebuild.sh
```

# All to Burp

### The OkHttp Plaintext Trick

If the app uses OkHttp, do not start by fighting SSL pinning. Hook OkHttp in-process. The request object exists before TLS encryption; the response object exists after TLS decryption. `Response.peekBody()` lets you copy response text without consuming the stream the app still needs.

This is especially useful on a physical phone with `frida-server` or a Gadget APK: no CA install, no proxy, no pinning bypass, and no network routing changes. The limitation is clear: it only sees traffic that goes through OkHttp.

```embed
/res/code/android_hacking_0x00/android_frida_01_okhttp_plaintext_logger.js
```

### WebView URL And Bridge Logger

Before testing a WebView bug, enumerate what the app actually exposes. Log `loadUrl`, `loadDataWithBaseURL`, subresource interception, console messages and `addJavascriptInterface` bridge names/classes.

```embed
/res/code/android_hacking_0x00/android_frida_02_webview_url_logger.js
```

### SSL Read/Write Burp Logger

When OkHttp is not enough and the SSL provider exports symbols, hook `SSL_write` and `SSL_read`. Pair streams by the `SSL*` pointer and write request/response blocks in a format Burp Repeater accepts. This is a read-only capture path: you are observing plaintext at the encryption boundary, not modifying traffic.

Known sharp edges: HTTP/2 multiplexing is not handled by the simple HTTP/1 parser; Flutter often strips BoringSSL symbols; native hooks do not see ARM guest code normally when the app runs through some translation layers on x86 emulators.

```embed
/res/code/android_hacking_0x00/android_frida_03_ssl_burp_logger.js
```

### Host Runner For Frida Burp Logs

Keep file writing on the host when you can. The Frida script should `send()` structured events; a Python runner can attach, load the JS, render Burp-paste files, write `_all.md`, and keep JSONL telemetry for later indexing.

```embed
/res/code/android_hacking_0x00/android_py_01_frida_burp_runner.py
```

### Mitmproxy To Burp-Paste

When MITM does work, keep the evidence format boring. One raw request/response file per flow is easy to paste into Burp Repeater, easy to diff, and easy to redact later.

```embed
/res/code/android_hacking_0x00/android_py_02_mitm_live_burp.py
```

```embed
/res/code/android_hacking_0x00/android_py_03_mitm_to_burp.py
```

### Python commands I keep rerunning

These commands are the small loop that repeatedly paid off during Android work. Keep them generic, point them at `target.cl`, and commit only sanitized outputs.

```bash
# Run a Frida logger and write Burp-paste files on the host
python3 res/code/android_hacking_0x00/android_py_01_frida_burp_runner.py \
  --device usb \
  --target target.cl \
  --script res/code/android_hacking_0x00/android_frida_01_okhttp_plaintext_logger.js \
  --out-dir burp-frida-target-cl

# Convert a mitmproxy dump into one Burp-paste file per flow
python3 res/code/android_hacking_0x00/android_py_03_mitm_to_burp.py capture.mitm \
  --host-filter 'target\.cl|api\.' \
  --out-dir burp-from-mitm

# Syntax sanity before committing snippets
python3 -m py_compile res/code/android_hacking_0x00/android_py_*.py
```

# Flutter and keys

### Flutter/Dart AOT Runtime Helpers

Flutter apps are different. `jadx` usually shows the Android wrapper, while business logic lives in `libapp.so` as Dart AOT code. Once you have a per-build offset from backtraces or reverse engineering, small helpers for tagged pointers, Dart strings and `Uint8List` make hooks much more useful.

Never present Dart class IDs or offsets as universal. Treat them as per-runtime/per-build configuration.

```embed
/res/code/android_hacking_0x00/android_frida_04_flutter_aot_helpers.js
```

### Getting Runtime Keys Without Leaking Them

For app-layer crypto, first map the envelope statically: certificates, algorithms, AES/RSA/HMAC libraries, request wrappers and storage keys. Then assume secrets are not recoverable from disk if Android Keystore is involved. The reliable path is runtime capture at the sink:

- `javax.crypto.Cipher.init/update/doFinal` for Java crypto.
- `javax.crypto.Mac.init/update/doFinal` for Java HMAC.
- BouncyCastle/PointyCastle constructors or HMAC update/final methods for Dart/Flutter stacks.
- HTTP write hooks for headers, tokens and signed bodies.
- Structured heap scans only after you know the object layout and can validate candidates offline.

Do not publish live keys, tokens, phone numbers, national identifiers, request bodies, endpoint paths or offsets from a real target. Public snippets should use the fake app package `target.cl` plus placeholders such as `<serial>`, `<offset>` and `<cid>`.

```embed
/res/code/android_hacking_0x00/android_frida_05_java_crypto_sinks.js
```

# Gorry usefull snippets

### ADB snippet large

Permit ADB over TCP and keep basic device visibility commands close.

```bash
# Permit via TCP (WiFi) instead of USB
adb tcpip 5555
adb connect 192.0.2.10:5555

# Know which adb server/device you are using
adb version
adb devices -l
```

### State snippet large

Quick checks before blaming Frida, Burp or the app.

```bash
# Device basics
adb shell getprop ro.product.model
adb shell getprop ro.build.version.release
adb shell getprop ro.product.cpu.abi

# Package install path, version and UID
adb shell pm path target.cl
adb shell dumpsys package target.cl | grep -E 'versionName|versionCode|userId|firstInstallTime|lastUpdateTime'

# Process and UID at runtime
adb shell pidof target.cl
adb shell "pid=\$(pidof target.cl); grep '^Uid:' /proc/\$pid/status"
```

### App lifecycle snippet large

Use `monkey` when you do not care about the concrete launcher Activity. Resolve the launcher Activity when you need explicit `am start` or when `monkey` behaves weirdly.

```bash
# Start the launcher Activity the simple way
adb shell monkey -p target.cl -c android.intent.category.LAUNCHER 1

# Stop the app
adb shell am force-stop target.cl

# Restart app in one line
adb shell am force-stop target.cl && adb shell monkey -p target.cl -c android.intent.category.LAUNCHER 1

# Resolve the main launcher Activity
adb shell cmd package resolve-activity --brief target.cl

# Start an explicit Activity after you know it
adb shell am start -n target.cl/.MainActivity

# Open app details in Android settings
adb shell am start -a android.settings.APPLICATION_DETAILS_SETTINGS -d package:target.cl
```

### Logcat snippet large

Start with crash logs, then narrow to the target PID. Clear the buffer before reproducing to avoid chasing stale errors.

```bash
# Clear old logs
adb logcat -c

# Watch crashes only
adb logcat -v time -b crash

# Watch fatal/exception lines from all buffers
adb logcat -v time '*:E' | grep -iE 'fatal|exception|abort|sigsegv|sigabrt|target\.cl'

# Follow logs for only the current app PID
pid=$(adb shell pidof target.cl | tr -d '\r')
adb logcat --pid "$pid" -v time

# Save a reproduction log to disk
adb logcat -c
adb shell am force-stop target.cl && adb shell monkey -p target.cl -c android.intent.category.LAUNCHER 1
adb logcat -v threadtime -d > target-cl-repro.log
```

### Screen UI snippet large

Screenshots and UIAutomator dumps make notes reproducible without exposing live tokens in shell history.

```bash
# Screenshot
adb exec-out screencap -p > screen.png

# Short screen recording
adb shell screenrecord --time-limit 20 /sdcard/demo.mp4
adb pull /sdcard/demo.mp4 .

# UI tree, useful for tap coordinates and automation
adb shell uiautomator dump /sdcard/window.xml
adb pull /sdcard/window.xml .

# Common input helpers
adb shell input keyevent KEYCODE_WAKEUP
adb shell input keyevent KEYCODE_BACK
adb shell input tap 540 1200
adb shell input text 'hello%sworld'
```

### Proxy snippet large

These are the commands I always want visible before debugging Burp or Gadget connectivity.

```bash
# Android global proxy to host Burp from an emulator
adb shell settings put global http_proxy 10.0.2.2:8080
adb shell settings get global http_proxy

# Remove Android global proxy
adb shell settings put global http_proxy :0

# Physical phone: make device localhost:8080 reach host localhost:8080
adb reverse tcp:8080 tcp:8080
adb reverse --list
adb reverse --remove tcp:8080

# Frida Gadget: make host localhost:27042 reach device Gadget
adb forward tcp:27042 tcp:27042
adb forward --list
adb forward --remove tcp:27042
```

### Data pull snippet large

Prefer one tarball over many slow `adb shell` reads. Use `run-as` only when the app is debuggable; otherwise use root on a disposable test image.

```bash
# Debuggable app, no root needed
adb exec-out run-as target.cl tar czf - -C /data/data/target.cl . > target-cl-data.tar.gz

# Rooted emulator/test phone
adb shell "su -c 'tar czf /sdcard/target-cl-data.tar.gz -C /data/data/target.cl .'"
adb pull /sdcard/target-cl-data.tar.gz .

# External app-specific storage
adb shell ls -la /sdcard/Android/data/target.cl/
adb pull /sdcard/Android/data/target.cl/ target-cl-external/
```

### Install snippet large

Use `--no-incremental` for patched APKs when you suspect install/extraction weirdness.

```bash
# Install patched APK cleanly
adb uninstall target.cl || true
adb install --no-incremental target.cl_signed.apk

# Clear data but keep the installed APK
adb shell pm clear target.cl

# Grant a runtime permission manually
adb shell pm grant target.cl android.permission.CAMERA

# List granted runtime permissions
adb shell dumpsys package target.cl | grep -A40 'runtime permissions'
```

### Frida snippet large

Do these before assuming the hook is broken.

```bash
# List devices and processes
frida-ls-devices
frida-ps -Uai

# Attach by package/process on USB
frida -U -n target.cl -l hook.js

# Spawn and pause at startup
frida -U -f target.cl -l hook.js --runtime=v8

# Gadget over adb forward
adb forward tcp:27042 tcp:27042
frida-ps -H 127.0.0.1:27042
frida -H 127.0.0.1:27042 -n Gadget -l hook.js

# Rooted device frida-server quick start
adb push frida-server /data/local/tmp/frida-server
adb shell "su -c 'chmod 755 /data/local/tmp/frida-server; /data/local/tmp/frida-server &'"
```

### DNAT snippet large

When Burp sees nothing, confirm the proxy and NAT rule are actually active.

```bash
# Resolve target UID
pid=$(adb shell pidof target.cl | tr -d '\r')
uid=$(adb shell "grep '^Uid:' /proc/${pid}/status" | awk '{print $2}' | tr -d '\r')
echo "$uid"

# Route only target UID TCP/443 to Burp
adb shell iptables -t nat -F OUTPUT
adb shell "iptables -t nat -A OUTPUT -p tcp --dport 443 -m owner --uid-owner ${uid} -j DNAT --to-destination 10.0.2.2:8080"
adb shell iptables -t nat -L OUTPUT -n -v

# Disable it
adb shell settings put global http_proxy :0
adb shell iptables -t nat -F OUTPUT
```

### User service snippet large

Use a transient user service when a command must keep running after the terminal closes. This is useful for emulators, Frida runners, loggers or long captures.

```bash
systemd-run --user --unit android-lab --same-dir --collect \
  bash -lc 'adb devices && sleep infinity'

systemctl --user status android-lab.service
systemctl --user stop android-lab.service
```

### Frida trace snippet large

Trace Java methods or native symbols when you only need fast visibility before writing a full hook.

```bash
# Java method traces
frida-trace -U -f target.cl \
  -j 'target.cl.*!*' \
  --runtime=v8

# Native libc traces
frida-trace -U -f target.cl \
  -i 'open*' \
  -i 'read' \
  -i 'write' \
  --runtime=v8
```

### Unlock snippet large

Spawn the app paused, wake/unlock the device, then resume from the Frida REPL. This avoids racing app startup while the screen is still locked.

```bash
frida -U -f target.cl

# In another terminal, or before typing %resume in the Frida REPL:
adb shell input keyevent KEYCODE_WAKEUP
adb shell input keyevent KEYCODE_MENU

# Back in Frida:
%resume
```
