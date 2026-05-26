### Permit ADB TCP

```bash
# Permit via TCIP (WiFi) instead of custom USB
# -- So troubleshoot is wireless
adb connect 192.168.1.85:5555
adb tcpip 5555
```

### Get APK

```bash
# Get apk path -- it may list more than one entry (App Bundle splits):
#   base.apk, split_config.arm64_v8a.apk, split_config.xxhdpi.apk, split_config.en.apk, ...
adb shell pm list packages
adb shell pm path cl.target

adb pull /data/app/~~h_jVfrLCcLsWYsEkyDDdkA==/cl.target-4gIe4Vxvk314zP1kCOFVcw==/base.apk
mv base.apk cl.target.apk
```

If `pm path` shows split APKs, pull them all — base.apk alone usually has no native libs:

```bash
mkdir -p splits
for p in $(adb shell pm path cl.target | sed 's/^package://'); do
    adb pull "$p" splits/
done
```

### Path APK

#### Disassemble

```bash
apktool d -o Source_v1.00/ cl.target.apk 
cd Source_v1.00
```

#### Patch code

File: cl/target/MainActivity.smali

```diff
-.method public constructor <init>()V
-    .locals 0
+.method public constructor <init>()V
+    .locals 1
+    # Variables start with index 0
+    const-string v0, "fg"   # Tinmarino: Line added
+    invoke-static {v0}, Ljava/lang/System;->loadLibrary(Ljava/lang/String;)V   # Tinmarino: Line added
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
apktool b Source_v1.00 -o cl.target_mod.apk

# 2. Zipalign (must come BEFORE signing; -p page-aligns .so files)
zipalign -p -f 4 cl.target_mod.apk cl.target_aligned.apk

# 3. One-time: generate a debug keystore
keytool -genkey -v -keystore ~/.android/debug.keystore \
  -storepass android -alias androiddebugkey -keypass android \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=Android Debug,O=Android,C=US"

# 4. Sign (v2/v3 schemes)
apksigner sign --ks ~/.android/debug.keystore \
  --ks-pass pass:android --key-pass pass:android \
  --ks-key-alias androiddebugkey \
  --out cl.target_signed.apk cl.target_aligned.apk

# 5. Verify
apksigner verify --verbose cl.target_signed.apk

# 6. Uninstall the original (signatures won't match) and install the modified one
adb uninstall cl.target
adb install cl.target_signed.apk
```

`zipalign` and `apksigner` ship with the Android SDK build-tools; on Debian/Ubuntu they're also available as the `zipalign` and `apksigner` apt packages.

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
