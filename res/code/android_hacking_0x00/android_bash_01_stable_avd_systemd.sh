#!/usr/bin/env bash
set -euo pipefail

# Start an Android emulator as a transient user service.
#
# Why systemd-run instead of `nohup emulator ... &`?
# The emulator is a GUI-ish process even in headless-ish setups. If it remains
# attached to the shell session, it often dies when the terminal/agent exits.
# A transient user unit survives that lifecycle and is easy to inspect/stop.

ADB=${ADB:-"$HOME/Android/Sdk/platform-tools/adb"}
EMULATOR=${EMULATOR:-"$HOME/Android/Sdk/emulator/emulator"}
AVD_NAME=${AVD_NAME:-Target_AVD}
UNIT_NAME=${UNIT_NAME:-target-cl-emu}
DISPLAY_VALUE=${DISPLAY:-:0}
XAUTHORITY_VALUE=${XAUTHORITY:-"$HOME/.Xauthority"}

start_avd() {
    systemctl --user reset-failed "${UNIT_NAME}.service" 2>/dev/null || true
    systemd-run --user --unit="$UNIT_NAME" \
        --setenv="DISPLAY=${DISPLAY_VALUE}" \
        --setenv="XAUTHORITY=${XAUTHORITY_VALUE}" \
        "$EMULATOR" \
        -avd "$AVD_NAME" \
        -no-snapshot-load \
        -no-snapshot-save \
        -no-boot-anim \
        -no-audio \
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

case "${1:-start}" in
    start)
        start_avd
        serial=$(wait_for_boot)
        printf 'AVD %s is booted as %s\n' "$AVD_NAME" "$serial"
        ;;
    status)
        systemctl --user --no-pager status "${UNIT_NAME}.service" || true
        serial_for_avd || true
        ;;
    stop)
        systemctl --user stop "${UNIT_NAME}.service" 2>/dev/null || true
        ;;
    *)
        printf 'Usage: %s [start|status|stop]\n' "$0" >&2
        exit 2
        ;;
esac
