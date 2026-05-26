#!/usr/bin/env bash
set -euo pipefail

# Route one rooted Android app through Burp without blackholing the whole device.
#
# This assumes a disposable rooted emulator/test device. It installs Burp's CA,
# sets Android's global proxy, then uses an owner-scoped iptables DNAT rule so
# only the target app's UID is redirected to the host Burp listener.

ADB=${ADB:-"$HOME/Android/Sdk/platform-tools/adb"}
SERIAL=${SERIAL:-emulator-5554}
APP_PACKAGE=${APP_PACKAGE:-target.cl}
APP_LAUNCHER=${APP_LAUNCHER:-""}
BURP_HOST_PORT=${BURP_HOST_PORT:-8080}
BURP_PROXY=${BURP_PROXY:-10.0.2.2:8080}
CA_DER=${CA_DER:-/tmp/burp-ca.der}
CA_PEM=${CA_PEM:-/tmp/burp-ca.pem}

fetch_burp_ca() {
    curl -s --max-time 5 -x "localhost:${BURP_HOST_PORT}" http://burp/cert -o "$CA_DER"
    openssl x509 -inform der -in "$CA_DER" -out "$CA_PEM"
    CA_HASH=$(openssl x509 -inform pem -subject_hash_old -in "$CA_PEM" -noout)
    cp "$CA_PEM" "/tmp/${CA_HASH}.0"
    printf 'Burp CA hash=%s\n' "$CA_HASH"
}

root_and_remount() {
    "$ADB" -s "$SERIAL" root >/dev/null || true
    "$ADB" -s "$SERIAL" wait-for-device
    "$ADB" -s "$SERIAL" remount >/dev/null || true
}

install_burp_ca() {
    "$ADB" -s "$SERIAL" push "/tmp/${CA_HASH}.0" "/system/etc/security/cacerts/${CA_HASH}.0" >/dev/null
    "$ADB" -s "$SERIAL" shell "chmod 644 /system/etc/security/cacerts/${CA_HASH}.0"

    # Android 14+ may validate through the Conscrypt APEX cert directory.
    # On disposable rooted test images, mirror the cert there with a tmpfs overlay.
    "$ADB" -s "$SERIAL" shell "APEX=/apex/com.android.conscrypt/cacerts; mkdir -p /data/local/tmp/cacerts-stage; cp \$APEX/* /data/local/tmp/cacerts-stage/ 2>/dev/null || true; cp /system/etc/security/cacerts/${CA_HASH}.0 /data/local/tmp/cacerts-stage/; mount -t tmpfs tmpfs \$APEX 2>/dev/null || true; cp /data/local/tmp/cacerts-stage/* \$APEX/; chown root:root \$APEX/*; chmod 644 \$APEX/*; chcon u:object_r:system_file:s0 \$APEX/* 2>/dev/null || true; for pid in \$(pgrep zygote) \$(pgrep zygote64); do nsenter --mount=/proc/\$pid/ns/mnt -- /system/bin/mount --bind \$APEX \$APEX 2>/dev/null || true; done; echo DONE"
}

launch_app() {
    "$ADB" -s "$SERIAL" shell am force-stop "$APP_PACKAGE" >/dev/null || true
    if [ -n "$APP_LAUNCHER" ]; then
        "$ADB" -s "$SERIAL" shell am start -n "$APP_LAUNCHER" >/dev/null
        return
    fi
    "$ADB" -s "$SERIAL" shell monkey -p "$APP_PACKAGE" -c android.intent.category.LAUNCHER 1 >/dev/null
}

app_uid() {
    local pid uid
    for _ in $(seq 1 40); do
        pid=$("$ADB" -s "$SERIAL" shell pidof "$APP_PACKAGE" 2>/dev/null | tr -d '\r' || true)
        if [ -n "$pid" ]; then
            uid=$("$ADB" -s "$SERIAL" shell "grep '^Uid:' /proc/${pid}/status" | awk '{print $2}' | tr -d '\r')
            if [ -n "$uid" ]; then
                printf '%s\n' "$uid"
                return 0
            fi
        fi
        sleep 1
    done
    printf 'Could not resolve UID for %s\n' "$APP_PACKAGE" >&2
    return 1
}

enable_proxy() {
    local uid
    "$ADB" -s "$SERIAL" shell settings put global http_proxy "$BURP_PROXY"
    launch_app
    uid=$(app_uid)
    "$ADB" -s "$SERIAL" shell iptables -t nat -F OUTPUT
    "$ADB" -s "$SERIAL" shell "iptables -t nat -A OUTPUT -p tcp --dport 443 -m owner --uid-owner ${uid} -j DNAT --to-destination ${BURP_PROXY}"
    printf 'Proxy enabled for %s uid=%s via %s\n' "$APP_PACKAGE" "$uid" "$BURP_PROXY"
}

disable_proxy() {
    "$ADB" -s "$SERIAL" shell settings put global http_proxy :0
    "$ADB" -s "$SERIAL" shell iptables -t nat -F OUTPUT
    printf 'Proxy and DNAT cleared on %s\n' "$SERIAL"
}

case "${1:-enable}" in
    enable)
        fetch_burp_ca
        root_and_remount
        install_burp_ca
        enable_proxy
        ;;
    disable)
        disable_proxy
        ;;
    status)
        "$ADB" -s "$SERIAL" shell settings get global http_proxy | tr -d '\r'
        "$ADB" -s "$SERIAL" shell iptables -t nat -L OUTPUT -n -v || true
        ;;
    *)
        printf 'Usage: %s [enable|disable|status]\n' "$0" >&2
        exit 2
        ;;
esac
