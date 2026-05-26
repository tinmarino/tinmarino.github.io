#!/usr/bin/env python3

"""
Mitmproxy addon that writes Burp-paste request/response files.

Run with `mitmdump -s android_py_02_mitm_live_burp.py --set burp_split=out/ --set burp_all=true`. Use `--set burp_host_filter='example\\.test|api\\.'` to keep only selected hosts.

"""

from datetime import datetime
from pathlib import Path
from re import IGNORECASE as re_IGNORECASE
from re import compile as re_compile
from re import sub as re_sub

from mitmproxy import ctx
from mitmproxy.http import HTTPFlow


class BurpLogger:
    """ Stream mitmproxy flows in a raw format that Burp Repeater accepts. """

    def __init__(self) -> None:
        """ Initialize output state. """
        self.out_path: Path | None = None
        self.split_dir: Path | None = None
        self.out_file = None
        self.sequence = 0
        self.keep_all = False
        self.host_filter = None

    def load(self, loader) -> None:
        """ Register mitmproxy options. """
        loader.add_option(name="burp_out", typespec=str, default="", help="Aggregate Markdown output path")
        loader.add_option(name="burp_split", typespec=str, default="", help="Directory for one .txt per flow")
        loader.add_option(name="burp_all", typespec=bool, default=False, help="Log every host")
        loader.add_option(name="burp_host_filter", typespec=str, default="", help="Regex of hosts to keep when burp_all=false")

    def configure(self, updates) -> None:
        """ Open files and compile filters after option updates. """
        if "burp_out" in updates and ctx.options.burp_out:
            self.out_path = Path(ctx.options.burp_out)
            self.out_path.parent.mkdir(parents=True, exist_ok=True)
            self.out_file = self.out_path.open("a", encoding="utf-8", buffering=1)
            ctx.log.info(f"[burp-logger] aggregate -> {self.out_path}")
        if "burp_split" in updates and ctx.options.burp_split:
            self.split_dir = Path(ctx.options.burp_split)
            self.split_dir.mkdir(parents=True, exist_ok=True)
            ctx.log.info(f"[burp-logger] split -> {self.split_dir}")
        if "burp_all" in updates:
            self.keep_all = bool(ctx.options.burp_all)
        if "burp_host_filter" in updates:
            self.host_filter = re_compile(ctx.options.burp_host_filter, re_IGNORECASE) if ctx.options.burp_host_filter else None

    def done(self) -> None:
        """ Close the aggregate file. """
        if self.out_file:
            self.out_file.close()
            self.out_file = None

    def _keep(self, flow: HTTPFlow) -> bool:
        """ Return true when *flow* should be logged. """
        if self.keep_all:
            return True
        if self.host_filter is None:
            return False
        return bool(self.host_filter.search((flow.request.host or "").lower()))

    @staticmethod
    def _stamp(epoch: float | None) -> str:
        """ Return ISO timestamp for *epoch*. """
        if epoch is None:
            epoch = 0
        return datetime.fromtimestamp(epoch).isoformat(timespec="seconds")

    @staticmethod
    def _safe(value: str, max_len: int = 60) -> str:
        """ Return filesystem-safe text. """
        out = re_sub(r"[^A-Za-z0-9._-]+", "-", value or "").strip("-")[:max_len]
        return out or "x"

    def _render_request(self, flow: HTTPFlow) -> str:
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
        body = request.get_text(strict=False) or ""
        return "\n".join(lines) + "\n\n" + body

    def _render_response(self, flow: HTTPFlow) -> str:
        """ Render the response as raw HTTP. """
        response = flow.response
        if response is None:
            return "(no response captured)"
        http_version = response.http_version or "HTTP/1.1"
        lines = [f"{http_version} {response.status_code} {response.reason or ''}".rstrip()]
        for header_name, header_value in response.headers.items():
            lines.append(f"{header_name}: {header_value}")
        body = response.get_text(strict=False) or ""
        return "\n".join(lines) + "\n\n" + body

    def response(self, flow: HTTPFlow) -> None:
        """ Persist one completed mitmproxy flow. """
        if not self._keep(flow):
            return
        self.sequence += 1
        request_ts = self._stamp(flow.request.timestamp_start)
        response_ts = self._stamp(flow.response.timestamp_start if flow.response else flow.request.timestamp_start)
        block = f"# Request {request_ts}\n{self._render_request(flow)}\n\n# Response {response_ts}\n{self._render_response(flow)}\n\n---\n\n"

        if self.out_file:
            self.out_file.write(block)
        if self.split_dir:
            host = self._safe(flow.request.host, 40)
            path = self._safe((flow.request.path or "/").split("?")[0], 60)
            file_name = f"{request_ts.replace(':', '-')}_{self.sequence:04d}_{host}_{path}.txt"
            (self.split_dir / file_name).write_text(block, encoding="utf-8")
        ctx.log.info(f"[burp-logger] #{self.sequence:04d} {flow.request.method} {flow.request.host}{flow.request.path}")


addons = [BurpLogger()]
