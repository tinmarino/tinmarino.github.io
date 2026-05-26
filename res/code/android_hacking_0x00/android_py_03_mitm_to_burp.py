#!/usr/bin/env python3

"""
Convert a mitmproxy dump file into Burp-paste request/response files.

This is the offline companion to the live mitmproxy addon. It reads a `.mitm` capture, optionally filters by host regex, writes one `.txt` file per HTTP flow, and writes an aggregate `_all.md` file.

"""

from argparse import ArgumentParser
from datetime import datetime
from pathlib import Path
from re import compile as re_compile
from re import sub as re_sub
from sys import exit as sys_exit

from mitmproxy.exceptions import FlowReadException
from mitmproxy.http import HTTPFlow
from mitmproxy.io import FlowReader


def stamp(epoch: float | None) -> str:
    """ Return an ISO timestamp for *epoch*. """
    if epoch is None:
        epoch = 0
    return datetime.fromtimestamp(epoch).isoformat(timespec="seconds")


def safe_segment(value: str | None, max_len: int = 60) -> str:
    """ Return a filesystem-safe segment. """
    if not value:
        return "x"
    out = re_sub(r"[^A-Za-z0-9._-]+", "-", value).strip("-")[:max_len]
    return out or "x"


def render_request(flow: HTTPFlow) -> str:
    """ Render the request as raw HTTP. """
    request = flow.request
    http_version = request.http_version or "HTTP/1.1"
    lines = [f"{request.method} {request.path or '/'} {http_version}"]
    seen_host = False
    for header_name, header_value in request.headers.items():
        if header_name.lower() == "host":
            seen_host = True
        lines.append(f"{header_name}: {header_value}")
    if not seen_host and request.host:
        lines.insert(1, f"Host: {request.host}")
    return "\n".join(lines) + "\n\n" + (request.get_text(strict=False) or "")


def render_response(flow: HTTPFlow) -> str:
    """ Render the response as raw HTTP. """
    response = flow.response
    if response is None:
        return "(no response captured)"
    http_version = response.http_version or "HTTP/1.1"
    lines = [f"{http_version} {response.status_code} {response.reason or ''}".rstrip()]
    for header_name, header_value in response.headers.items():
        lines.append(f"{header_name}: {header_value}")
    return "\n".join(lines) + "\n\n" + (response.get_text(strict=False) or "")


def render_pair(flow: HTTPFlow) -> str:
    """ Render one flow in Burp-paste format. """
    request_ts = stamp(flow.request.timestamp_start)
    response_ts = stamp(flow.response.timestamp_start if flow.response else flow.request.timestamp_start)
    return f"# Request {request_ts}\n{render_request(flow)}\n\n# Response {response_ts}\n{render_response(flow)}\n\n---\n\n"


def iter_http_flows(capture_path: Path):
    """ Yield HTTP flows from *capture_path*. """
    with capture_path.open("rb") as capture_file:
        reader = FlowReader(capture_file)
        try:
            for flow in reader.stream():
                if isinstance(flow, HTTPFlow):
                    yield flow
        except FlowReadException as error:
            raise SystemExit(f"Could not read {capture_path}: {error}") from error


def parse_args():
    """ Parse command-line arguments. """
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("capture", help="Input .mitm capture")
    parser.add_argument("--out-dir", default="burp-from-mitm", help="Output directory")
    parser.add_argument("--host-filter", default="", help="Optional regex applied to request host")
    parser.add_argument("--all", action="store_true", help="Keep all hosts even when no host filter is set")
    return parser.parse_args()


def main() -> int:
    """ Convert selected flows into Burp-paste files. """
    args = parse_args()
    capture_path = Path(args.capture)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    host_filter = re_compile(args.host_filter) if args.host_filter else None
    combined_path = out_dir / "_all.md"
    count = 0

    with combined_path.open("w", encoding="utf-8") as combined_file:
        for flow in iter_http_flows(capture_path):
            host = flow.request.host or ""
            if not args.all and host_filter is None:
                continue
            if host_filter is not None and not host_filter.search(host):
                continue
            count += 1
            block = render_pair(flow)
            request_ts = stamp(flow.request.timestamp_start).replace(":", "-")
            host_part = safe_segment(host, 40)
            path_part = safe_segment((flow.request.path or "/").split("?")[0], 60)
            file_path = out_dir / f"{request_ts}_{count:04d}_{host_part}_{path_part}.txt"
            file_path.write_text(block, encoding="utf-8")
            combined_file.write(block)
            print(f"wrote {file_path}")
    print(f"DONE flows={count} out={out_dir}")
    return 0


if __name__ == "__main__":
    sys_exit(main())
