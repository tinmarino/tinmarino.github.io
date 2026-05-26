#!/usr/bin/env python3

"""
Run a Frida HTTP logger and write Burp-paste files.

This runner expects the loaded JavaScript to send either log events or pair events. Pair events should look like `send({kind: "pair", payload: {req: "...", resp: "...", host: "...", path: "..."}})`. It also accepts JSON strings with the same shape.

"""

from argparse import ArgumentParser
from datetime import datetime
from json import dumps as json_dumps
from json import loads as json_loads
from pathlib import Path
from re import sub as re_sub
from sys import exit as sys_exit
from time import sleep

import frida


def safe_segment(value: str | None, max_len: int = 60) -> str:
    """ Return a filesystem-safe segment for *value*. """
    if not value:
        return "x"
    cleaned = re_sub(r"[^A-Za-z0-9._-]+", "-", value).strip("-")
    return (cleaned[:max_len] or "x")


def normalize_newlines(value: str | None) -> str:
    """ Normalize HTTP text blocks to LF-only strings. """
    if value is None:
        return ""
    return str(value).replace("\r\n", "\n")


def render_pair(pair: dict) -> str:
    """ Render a captured pair in Burp-paste format. """
    req = normalize_newlines(pair.get("req"))
    resp = normalize_newlines(pair.get("resp")) or "(no response)"
    req_ts = pair.get("req_ts") or datetime.now().isoformat(timespec="seconds")
    resp_ts = pair.get("resp_ts") or datetime.now().isoformat(timespec="seconds")
    return f"# Request {req_ts}\n{req}\n\n# Response {resp_ts}\n{resp}\n\n---\n"


def parse_payload(payload) -> dict:
    """ Return a dict payload from Frida's send() value. """
    if isinstance(payload, dict):
        return payload
    if isinstance(payload, str):
        try:
            decoded = json_loads(payload)
            if isinstance(decoded, dict):
                return decoded
        except ValueError:
            return {"kind": "log", "msg": payload}
    return {"kind": "event", "payload": payload}


def connect_device(device_name: str):
    """ Return a Frida device selected by *device_name*. """
    if device_name == "usb":
        return frida.get_usb_device(timeout=10)
    if ":" in device_name:
        return frida.get_device_manager().add_remote_device(device_name)
    return frida.get_device(device_name, timeout=10)


def parse_args():
    """ Parse command-line arguments. """
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("--device", default="usb", help="Frida device id, 'usb', or remote host:port")
    parser.add_argument("--target", default="Gadget", help="Process name or Gadget")
    parser.add_argument("--script", required=True, help="Frida JavaScript file to load")
    parser.add_argument("--out-dir", default="burp-frida-out", help="Directory for split Burp-paste files")
    parser.add_argument("--jsonl", default="", help="Optional JSONL event log path")
    return parser.parse_args()


def main() -> int:
    """ Attach Frida, load the script, and persist events. """
    args = parse_args()

    # Prepare output sinks before attaching
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    combined_path = out_dir / "_all.md"
    jsonl_path = Path(args.jsonl) if args.jsonl else None

    script_source = Path(args.script).read_text(encoding="utf-8")
    device = connect_device(args.device)
    session = device.attach(args.target)
    print(f"[runner] attached device={device.id} target={args.target}", flush=True)

    combined_file = combined_path.open("a", encoding="utf-8", buffering=1)
    jsonl_file = jsonl_path.open("a", encoding="utf-8", buffering=1) if jsonl_path else None

    # Closure captures output handles so the Frida callback stays simple
    def on_message(message, data):
        """ Handle one Frida message. """
        _ = data
        if message.get("type") == "error":
            print(message.get("stack") or message.get("description") or message, flush=True)
            return
        if message.get("type") != "send":
            print(f"[runner] {message}", flush=True)
            return

        event = parse_payload(message.get("payload"))
        kind = event.get("kind")
        if kind == "log":
            print(f"[target] {event.get('msg')}", flush=True)
        elif kind == "pair":
            pair = event.get("payload") or event
            rendered = render_pair(pair)
            sequence = int(pair.get("seq") or 0)
            timestamp = pair.get("ts_file") or datetime.now().strftime("%Y-%m-%dT%H-%M-%S")
            host = safe_segment(pair.get("host"), 40)
            path = safe_segment(pair.get("path"), 60)
            file_path = out_dir / f"{timestamp}_{sequence:04d}_{host}_{path}.txt"
            file_path.write_text(rendered, encoding="utf-8")
            combined_file.write(rendered)
            print(f"[runner] wrote {file_path.name}", flush=True)

        if jsonl_file:
            jsonl_file.write(json_dumps(event, ensure_ascii=False) + "\n")

    script = session.create_script(script_source)
    script.on("message", on_message)
    script.load()
    print("[runner] script loaded; interact with the app. Ctrl-C to detach.", flush=True)

    try:
        while True:
            sleep(1)
    except KeyboardInterrupt:
        print("\n[runner] detaching", flush=True)
    finally:
        try:
            script.unload()
        except frida.InvalidOperationError:
            pass
        session.detach()
        combined_file.close()
        if jsonl_file:
            jsonl_file.close()
    return 0


if __name__ == "__main__":
    sys_exit(main())
