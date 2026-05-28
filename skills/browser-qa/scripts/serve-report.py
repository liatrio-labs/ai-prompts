#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.11"
# ///
"""Serve browser-qa HTML report and JSON run artifacts from the system temp folder."""

from __future__ import annotations

import argparse
import json
import mimetypes
import sys
import tempfile
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse

REPORT_ROOT_NAME = "browser-qa-reports"
DEFAULT_PORT = 10891


def default_report_root() -> Path:
    return Path(tempfile.gettempdir()) / REPORT_ROOT_NAME


def skill_dir() -> Path:
    return Path(__file__).resolve().parents[1]


def report_html_path() -> Path:
    return skill_dir() / "templates" / "report.html"


def safe_run_id(raw: str) -> str:
    return "".join(ch for ch in raw if ch.isalnum() or ch in {"-", "_", "."})


def load_json(path: Path) -> dict[str, Any] | None:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    return data if isinstance(data, dict) else None


def discover_reports(root: Path) -> list[dict[str, Any]]:
    root.mkdir(parents=True, exist_ok=True)
    reports: list[dict[str, Any]] = []
    for findings_path in root.glob("*/findings.json"):
        run_dir = findings_path.parent
        run_id = run_dir.name
        if safe_run_id(run_id) != run_id:
            continue
        data = load_json(findings_path) or {}
        raw_summary = data.get("summary")
        raw_target = data.get("target")
        summary: dict[str, Any] = raw_summary if isinstance(raw_summary, dict) else {}
        target: dict[str, Any] = raw_target if isinstance(raw_target, dict) else {}
        reports.append(
            {
                "id": run_id,
                "label": f"{run_id} - {summary.get('status', 'unknown')} - {target.get('url', 'unknown target')}",
                "json_url": f"/api/reports/{run_id}",
                "artifact_base_url": f"/artifacts/{run_id}/",
                "checked_at": target.get("checked_at", ""),
                "target_url": target.get("url", ""),
                "summary": summary,
            }
        )
    return sorted(reports, key=lambda item: (item.get("checked_at") or "", item["id"]), reverse=True)


class BrowserQAHandler(SimpleHTTPRequestHandler):
    report_root: Path = default_report_root()

    def log_message(self, format: str, *args: object) -> None:  # noqa: A002 - stdlib signature
        print(f"browser-qa-report: {format % args}", file=sys.stderr)

    def send_json(self, value: Any, status: int = 200) -> None:
        body = json.dumps(value, indent=2).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def send_file(self, path: Path, content_type: str | None = None) -> None:
        try:
            body = path.read_bytes()
        except OSError:
            self.send_error(404, "file not found")
            return
        self.send_response(200)
        self.send_header("Content-Type", content_type or mimetypes.guess_type(path.name)[0] or "application/octet-stream")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:  # noqa: N802 - stdlib hook
        parsed = urlparse(self.path)
        path = parsed.path

        if path in {"/", "/index.html", "/report.html"}:
            self.send_file(report_html_path(), "text/html; charset=utf-8")
            return

        if path == "/api/reports":
            reports = discover_reports(self.report_root)
            self.send_json({"root": str(self.report_root), "reports": reports})
            return

        if path.startswith("/api/reports/"):
            run_id = safe_run_id(unquote(path.removeprefix("/api/reports/")))
            findings = self.report_root / run_id / "findings.json"
            data = load_json(findings)
            if data is None:
                self.send_error(404, "report not found")
                return
            data.setdefault("_browser_qa", {})
            data["_browser_qa"]["run_id"] = run_id
            data["_browser_qa"]["artifact_base_url"] = f"/artifacts/{run_id}/"
            self.send_json(data)
            return

        if path.startswith("/artifacts/"):
            rest = unquote(path.removeprefix("/artifacts/"))
            parts = [part for part in rest.split("/") if part]
            if len(parts) < 2:
                self.send_error(404, "artifact not found")
                return
            run_id = safe_run_id(parts[0])
            rel_parts = [safe_run_id(part) for part in parts[1:]]
            run_root = (self.report_root / run_id).resolve()
            requested_rel_path = Path(*rel_parts)
            artifact_path = (run_root / requested_rel_path).resolve()
            if requested_rel_path.name == "browser-qa-findings.json" and not artifact_path.exists():
                artifact_path = (run_root / "findings.json").resolve()
            if run_root not in artifact_path.parents and artifact_path != run_root:
                self.send_error(403, "invalid artifact path")
                return
            self.send_file(artifact_path)
            return

        self.send_error(404, "not found")


def serve(port: int = DEFAULT_PORT, report_root: Path | None = None) -> None:
    BrowserQAHandler.report_root = (report_root or default_report_root()).resolve()
    BrowserQAHandler.report_root.mkdir(parents=True, exist_ok=True)
    server = ThreadingHTTPServer(("127.0.0.1", port), BrowserQAHandler)
    print(f"Browser QA report server: http://127.0.0.1:{port}/")
    print(f"Serving report runs from: {BrowserQAHandler.report_root}")
    server.serve_forever()


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=DEFAULT_PORT)
    parser.add_argument("--root", type=Path, default=default_report_root())
    args = parser.parse_args(argv)
    serve(args.port, args.root)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
