#!/usr/bin/env bash
set -euo pipefail

# Generic Android lab controller for one target app.
#
# This is a sanitized version of the kind of helper that becomes invaluable in
# long mobile engagements. It starts an AVD as a systemd user service, waits for
# boot, optionally installs Burp's CA on a rooted emulator, scopes DNAT to the
# target app UID, starts frida-server, and runs a Frida hook as another user
# service. Defaults use the fake package `target.cl`.

ROOT_DIR=${ROOT_DIR:-"$PWD"}
ADB=${ADB:-"$HOME/Android/Sdk/platform-tools/adb"}
EMULATOR=${EMULATOR:-"$HOME/Android/Sdk/emulator/emulator"}
FRIDA=${FRIDA:-frida}
APP_PACKAGE=${APP_PACKAGE:-target.cl}
APP_PROCESS=${APP_PROCESS:-target.cl}
AVD_NAME=${AVD_NAME:-Target_AVD}
UNIT_EMU=${UNIT_EMU:-target-cl-emu}
UNIT_HOOK=${UNIT_HOOK:-target-cl-frida-hook}
HOOK_JS=${HOOK_JS:-"$ROOT_DIR/android_frida_01_okhttp_plaintext_logger.js"}
LOG_DIR=${LOG_DIR:-"$ROOT_DIR/logs/android-lab"}
BURP_HOST_PORT=${BURP_HOST_PORT:-8080}
BURP_PROXY=${BURP_PROXY:-10.0.2.2:8080}
LAT=${LAT:-0.000000}
LON=${LON:-0.000000}
ALT=${ALT:-10}
ACCURACY=${ACCURACY:-20}
DISPLAY_VALUE=${DISPLAY:-:0}
XAUTHORITY_VALUE=${XAUTHORITY:-"$HOME/.Xauthority"}
CA_DER=${CA_DER:-/tmp/target-burp-ca.der}
CA_PEM=${CA_PEM:-/tmp/target-burp-ca.pem}

usage() {
    cat <<'EOF'
Usage: android_bash_05_generic_app_lab.sh [start|status|hooks|proxy|unproxy|geo|stop]

Commands:
  start    Start AVD, wait for boot, apply proxy/DNAT/geo, start Frida hooks.
  status   Print emulator service, proxy, DNAT and Frida hook status.
  hooks    Start only frida-server and the host-side Frida hook service.
  proxy    Install Burp CA and route target app UID through Burp.
  unproxy  Clear Android proxy and NAT rules.
  geo      Set mock GPS coordinates.
  stop     Stop emulator and hook user services.

Important environment variables:
  APP_PACKAGE=target.cl
  APP_PROCESS=target.cl
  AVD_NAME=Target_AVD
  HOOK_JS=/path/to/hook.js
  BURP_PROXY=10.0.2.2:8080
EOF
}

log() {
    printf '[android-lab] %s\n' "$*"
}

need_file() {
    if [ ! -e "$1" ]; then
        printf 'Missing file: %s\n' "$1" >&2
        exit 1
    fi
}

need_exec() {
    if ! command -v "$1" >/dev/null 2>&1 && [ ! -x "$1" ]; then
        printf 'Missing executable: %s\n' "$1" >&2
        exit 1
    fi
}

require_tools() {
    need_exec "$ADB"
    need_exec "$EMULATOR"
    need_exec "$FRIDA"
    need_file "$HOOK_JS"
    need_exec curl
    need_exec openssl
    need_exec systemd-run
    need_exec systemctl
}

start_avd_service() {
    systemctl --user reset-failed "${UNIT_EMU}.service" 2>/dev/null || true
    systemd-run --user --unit="$UNIT_EMU" \
        --setenv="DISPLAY=${DISPLAY_VALUE}" \
        --setenv="XAUTHORITY=${XAUTHORITY_VALUE}" \
        "$EMULATOR" \
        -avd "$AVD_NAME" \
        -no-snapshot-load \
        -no-snapshot-save \
        -no-boot-anim \
        -no-audio \
        -writable-system \
        -accel on \
        -gpu swiftshader_indirect >/dev/null
}

serial_for_avd() {
    local serial name
    for serial in $("$ADB" devices | awk '/^emulator-/ {print $1}'); do
        name=$("$ADB" -s "$serial" emu avd name 2>/dev/null | tr -d '\r' | sed -n '1p')
        if [ "$name" = "$AVD_NAME" ]; then
            printf '%s\n' "$serial"
            return 0
        fi
    done
    return 1
}

wait_for_boot() {
    local serial boot
    for _ in $(seq 1 120); do
        serial=$(serial_for_avd || true)
        if [ -n "${serial:-}" ]; then
            boot=$("$ADB" -s "$serial" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' || true)
            if [ "$boot" = 1 ]; then
                printf '%s\n' "$serial"
                return 0
            fi
        fi
        sleep 2
    done
    printf 'Timed out waiting for %s\n' "$AVD_NAME" >&2
    return 1
}

current_serial() {
    local serial
    serial=$(serial_for_avd || true)
    if [ -z "$serial" ]; then
        printf 'AVD is not running: %s\n' "$AVD_NAME" >&2
        return 1
    fi
    printf '%s\n' "$serial"
}

fetch_burp_ca() {
    curl -s --max-time 5 -x "localhost:${BURP_HOST_PORT}" http://burp/cert -o "$CA_DER"
    openssl x509 -inform der -in "$CA_DER" -out "$CA_PEM"
    CA_HASH=$(openssl x509 -inform pem -subject_hash_old -in "$CA_PEM" -noout)
    cp "$CA_PEM" "/tmp/${CA_HASH}.0"
    log "Burp CA hash=${CA_HASH}"
}

root_and_remount() {
    local serial=$1
    "$ADB" -s "$serial" root >/dev/null || true
    "$ADB" -s "$serial" wait-for-device
    "$ADB" -s "$serial" remount >/dev/null || true
}

install_burp_ca() {
    local serial=$1
    "$ADB" -s "$serial" push "/tmp/${CA_HASH}.0" "/system/etc/security/cacerts/${CA_HASH}.0" >/dev/null
    "$ADB" -s "$serial" shell "chmod 644 /system/etc/security/cacerts/${CA_HASH}.0"
    "$ADB" -s "$serial" shell "APEX=/apex/com.android.conscrypt/cacerts; mkdir -p /data/local/tmp/cacerts-stage; cp \$APEX/* /data/local/tmp/cacerts-stage/ 2>/dev/null || true; cp /system/etc/security/cacerts/${CA_HASH}.0 /data/local/tmp/cacerts-stage/; mount -t tmpfs tmpfs \$APEX 2>/dev/null || true; cp /data/local/tmp/cacerts-stage/* \$APEX/; chown root:root \$APEX/*; chmod 644 \$APEX/*; chcon u:object_r:system_file:s0 \$APEX/* 2>/dev/null || true; for pid in \$(pgrep zygote) \$(pgrep zygote64); do nsenter --mount=/proc/\$pid/ns/mnt -- /system/bin/mount --bind \$APEX \$APEX 2>/dev/null || true; done; echo DONE"
}

launch_app() {
    local serial=$1
    "$ADB" -s "$serial" shell am force-stop "$APP_PACKAGE" >/dev/null || true
    "$ADB" -s "$serial" shell monkey -p "$APP_PACKAGE" -c android.intent.category.LAUNCHER 1 >/dev/null
}

app_uid() {
    local serial=$1
    local pid uid
    for _ in $(seq 1 40); do
        pid=$("$ADB" -s "$serial" shell pidof "$APP_PACKAGE" 2>/dev/null | tr -d '\r' || true)
        if [ -n "$pid" ]; then
            uid=$("$ADB" -s "$serial" shell "grep '^Uid:' /proc/${pid}/status" | awk '{print $2}' | tr -d '\r')
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

proxy_app() {
    local serial=$1
    local uid
    fetch_burp_ca
    root_and_remount "$serial"
    install_burp_ca "$serial"
    "$ADB" -s "$serial" shell settings put global http_proxy "$BURP_PROXY"
    launch_app "$serial"
    uid=$(app_uid "$serial")
    "$ADB" -s "$serial" shell iptables -t nat -F OUTPUT
    "$ADB" -s "$serial" shell "iptables -t nat -A OUTPUT -p tcp --dport 443 -m owner --uid-owner ${uid} -j DNAT --to-destination ${BURP_PROXY}"
    log "Proxy enabled for ${APP_PACKAGE} uid=${uid} via ${BURP_PROXY}"
}

unproxy_app() {
    local serial=$1
    "$ADB" -s "$serial" shell settings put global http_proxy :0
    "$ADB" -s "$serial" shell iptables -t nat -F OUTPUT || true
    log "Proxy and DNAT cleared"
}

set_geo() {
    local serial=$1
    "$ADB" -s "$serial" emu geo fix "$LON" "$LAT" "$ALT" >/dev/null || true
    "$ADB" -s "$serial" shell "cmd location providers add-test-provider gps --requiresSatellite --supportsAltitude --supportsSpeed --supportsBearing --powerRequirement 3 2>/dev/null || true; cmd location providers set-test-provider-enabled gps true; cmd location providers set-test-provider-location gps --location ${LAT},${LON} --accuracy ${ACCURACY}" >/dev/null || true
    log "Mock GPS set to ${LAT},${LON}"
}

start_frida_server() {
    local serial=$1
    "$ADB" -s "$serial" shell "chmod 755 /data/local/tmp/frida-server; if pidof frida-server >/dev/null 2>&1; then exit 0; fi; /data/local/tmp/frida-server >/data/local/tmp/frida-server.log 2>&1 &" || true
    sleep 2
}

start_hook_service() {
    local serial=$1
    mkdir -p "$LOG_DIR"
    systemctl --user stop "${UNIT_HOOK}.service" 2>/dev/null || true
    systemctl --user reset-failed "${UNIT_HOOK}.service" 2>/dev/null || true
    systemd-run --user --unit="$UNIT_HOOK" /bin/bash -lc "exec '${FRIDA}' -D '${serial}' -n '${APP_PROCESS}' -q -t inf -l '${HOOK_JS}' 2>&1 | tee -a '${LOG_DIR}/frida-hook.log'" >/dev/null
    log "Frida hook service started: ${UNIT_HOOK}.service"
}

print_status() {
    local serial
    serial=$(serial_for_avd || true)
    systemctl --user --no-pager status "${UNIT_EMU}.service" 2>/dev/null || true
    systemctl --user --no-pager status "${UNIT_HOOK}.service" 2>/dev/null || true
    if [ -n "$serial" ]; then
        "$ADB" -s "$serial" shell settings get global http_proxy | tr -d '\r'
        "$ADB" -s "$serial" shell iptables -t nat -L OUTPUT -n -v || true
    fi
}

stop_services() {
    systemctl --user stop "${UNIT_HOOK}.service" "${UNIT_EMU}.service" 2>/dev/null || true
    systemctl --user reset-failed "${UNIT_HOOK}.service" "${UNIT_EMU}.service" 2>/dev/null || true
}

main() {
    local command=${1:-start}
    local serial
    require_tools
    case "$command" in
        start)
            start_avd_service
            serial=$(wait_for_boot)
            proxy_app "$serial"
            set_geo "$serial"
            start_frida_server "$serial"
            start_hook_service "$serial"
            print_status
            ;;
        status)
            print_status
            ;;
        hooks)
            serial=$(current_serial)
            start_frida_server "$serial"
            start_hook_service "$serial"
            ;;
        proxy)
            serial=$(current_serial)
            proxy_app "$serial"
            ;;
        unproxy)
            serial=$(current_serial)
            unproxy_app "$serial"
            ;;
        geo)
            serial=$(current_serial)
            set_geo "$serial"
            ;;
        stop)
            stop_services
            ;;
        -h|--help|help)
            usage
            ;;
        *)
            usage
            exit 2
            ;;
    esac
}

main "$@"
