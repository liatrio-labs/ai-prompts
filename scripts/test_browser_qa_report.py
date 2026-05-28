#!/usr/bin/env python3
"""Regression tests for the browser-qa demo report viewer."""

from __future__ import annotations

import importlib.util
import json
import tempfile
import threading
import unittest
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import urlopen

REPO_ROOT = Path(__file__).resolve().parents[1]
SERVE_REPORT_PATH = REPO_ROOT / "skills" / "browser-qa" / "scripts" / "serve-report.py"
REPORT_TEMPLATE_PATH = REPO_ROOT / "skills" / "browser-qa" / "templates" / "report.html"


def load_serve_report_module():
    spec = importlib.util.spec_from_file_location("browser_qa_serve_report", SERVE_REPORT_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load {SERVE_REPORT_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class BrowserQAReportTests(unittest.TestCase):
    def setUp(self) -> None:
        self.module = load_serve_report_module()
        self.temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self.temp_dir.name)
        self.run_dir = self.root / "demo-run"
        self.run_dir.mkdir()
        (self.run_dir / "findings.json").write_text(
            json.dumps(
                {
                    "target": {
                        "url": "https://example.com/",
                        "checked_at": "2026-05-27T00:00:00Z",
                        "viewport": {"width": 1280, "height": 720},
                    },
                    "summary": {"status": "warn", "passes": 1, "warnings": 1, "failures": 0, "unknowns": 0},
                    "checks": [
                        {
                            "id": "console",
                            "label": "Console errors",
                            "status": "pass",
                            "evidence": [{"kind": "console", "message": "No errors", "source": "browser console"}],
                        }
                    ],
                    "artifacts": {"report": "browser-qa-findings.json", "screenshot": "demo.png"},
                },
                indent=2,
            ),
            encoding="utf-8",
        )
        (self.run_dir / "demo.png").write_bytes(b"fake image")

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def serve(self):
        def handler_factory(*args, **kwargs):
            class TestHandler(self.module.BrowserQAHandler):
                report_root = self.root

            return TestHandler(*args, **kwargs)

        server = ThreadingHTTPServer(("127.0.0.1", 0), handler_factory)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(server.server_close)
        self.addCleanup(server.shutdown)
        return f"http://127.0.0.1:{server.server_port}"

    def test_demo_findings_alias_serves_real_findings_json(self) -> None:
        base_url = self.serve()

        with urlopen(f"{base_url}/artifacts/demo-run/browser-qa-findings.json", timeout=5) as response:
            body = json.loads(response.read().decode("utf-8"))

        self.assertEqual(response.status, 200)
        self.assertEqual(response.headers.get_content_type(), "application/json")
        self.assertEqual(body["target"]["url"], "https://example.com/")

    def test_report_template_has_demo_friendly_artifacts_and_json_panel(self) -> None:
        html = REPORT_TEMPLATE_PATH.read_text(encoding="utf-8")

        self.assertIn('id="raw-json"', html)
        self.assertIn('class="artifact-grid"', html)
        self.assertIn('class="artifact-card"', html)
        self.assertIn('View raw JSON', html)


if __name__ == "__main__":
    unittest.main()
