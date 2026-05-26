#!/usr/bin/env bash
set -euo pipefail

# Feed non-static accelerometer and gyroscope values into an Android emulator.
#
# This is useful when testing SDKs that treat a perfectly frozen sensor stream
# as an emulator/lab signal. It does not bypass any specific vendor; it only
# makes the lab device less physically impossible while you observe behavior.

ADB=${ADB:-"$HOME/Android/Sdk/platform-tools/adb"}
SERIAL=${SERIAL:-emulator-5554}
INTERVAL=${INTERVAL:-0.35}

if ! "$ADB" -s "$SERIAL" get-state >/dev/null 2>&1; then
    printf 'Device not available: %s\n' "$SERIAL" >&2
    exit 1
fi

printf 'Injecting sensor variation on %s; Ctrl-C to stop\n' "$SERIAL"

while true; do
    "$ADB" -s "$SERIAL" emu sensor set acceleration 0.12:9.72:0.83 >/dev/null || true
    "$ADB" -s "$SERIAL" emu sensor set gyroscope 0.018:-0.010:0.006 >/dev/null || true
    sleep "$INTERVAL"
    "$ADB" -s "$SERIAL" emu sensor set acceleration -0.16:9.84:0.71 >/dev/null || true
    "$ADB" -s "$SERIAL" emu sensor set gyroscope -0.012:0.016:-0.004 >/dev/null || true
    sleep "$INTERVAL"
    "$ADB" -s "$SERIAL" emu sensor set acceleration 0.07:9.76:0.95 >/dev/null || true
    "$ADB" -s "$SERIAL" emu sensor set gyroscope 0.009:0.004:0.014 >/dev/null || true
    sleep "$INTERVAL"
    "$ADB" -s "$SERIAL" emu sensor set acceleration -0.04:9.80:0.78 >/dev/null || true
    "$ADB" -s "$SERIAL" emu sensor set gyroscope -0.006:-0.011:0.008 >/dev/null || true
    sleep "$INTERVAL"
done
