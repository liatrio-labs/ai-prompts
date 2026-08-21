from __future__ import annotations

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parents[1]
VALIDATOR = SKILL_DIR / "scripts" / "validate_artifact.py"
TEMPLATE = SKILL_DIR / "references" / "explainer-template.html"


class ValidateArtifactTests(unittest.TestCase):
    def run_validator(self, html: str) -> subprocess.CompletedProcess[str]:
        with tempfile.TemporaryDirectory() as directory:
            artifact = Path(directory) / "explainer.html"
            artifact.write_text(html, encoding="utf-8")
            return subprocess.run(
                [sys.executable, str(VALIDATOR), str(artifact)],
                capture_output=True,
                text=True,
                check=False,
            )

    def valid_artifact(self) -> str:
        return """<!doctype html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\">
  <link rel=\"icon\" href=\"data:,\">
  <style>body { color: black; }</style>
</head>
<body>
  <main>
    <h1>Example explainer</h1>
    <nav class=\"toc\" aria-label=\"Table of contents\"><a href=\"#model\">Model</a></nav>
    <article class=\"explainer-content\"><section id=\"model\"><h2>Model</h2></section></article>
    <section class=\"quiz\"><button id=\"quiz-reset\">Reset</button><button id=\"quiz-randomize\">Randomize</button><div id=\"explainer-quiz\"></div></section>
  </main>
  <script id=\"explainer-quiz-data\" type=\"application/json\">{\"questions\": []}</script>
  <script>console.log(\"interactive\");</script>
</body>
</html>"""

    def test_accepts_complete_self_contained_artifact(self) -> None:
        result = self.run_validator(self.valid_artifact())
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("valid", result.stdout.lower())

    def test_rejects_external_runtime_resource(self) -> None:
        html = self.valid_artifact().replace(
            "</head>", '<script src="https://example.com/runtime.js"></script></head>'
        )
        result = self.run_validator(html)
        self.assertEqual(result.returncode, 1)
        self.assertIn("external runtime resource", result.stderr.lower())

    def test_rejects_non_inline_resource_forms(self) -> None:
        cases = {
            "relative image": '<img src="diagram.png">',
            "protocol-relative stylesheet": '<link href="//cdn.example.test/theme.css">',
            "stylesheet import": '<style>@import url("https://cdn.example.test/theme.css");</style>',
            "quoted stylesheet import": '<style>@import "https://cdn.example.test/theme.css";</style>',
            "responsive image": '<img srcset="diagram.png 1x, data:image/png;base64,AA== 2x">',
            "SVG image": '<svg><image href="https://cdn.example.test/diagram.svg"></image></svg>',
        }
        for label, dependency in cases.items():
            with self.subTest(label=label):
                html = self.valid_artifact().replace("</head>", f"{dependency}</head>")
                result = self.run_validator(html)
                self.assertEqual(result.returncode, 1)
                self.assertIn("external runtime resource", result.stderr.lower())

    def test_rejects_unreplaced_template_token(self) -> None:
        html = self.valid_artifact().replace("Example explainer", "{{TITLE}}")
        result = self.run_validator(html)
        self.assertEqual(result.returncode, 1)
        self.assertIn("template token", result.stderr.lower())

    def test_rejects_missing_toc_target(self) -> None:
        html = self.valid_artifact().replace('id="model"', 'id="other"')
        result = self.run_validator(html)
        self.assertEqual(result.returncode, 1)
        self.assertIn("toc target", result.stderr.lower())

    def test_rejects_empty_toc(self) -> None:
        html = self.valid_artifact().replace('<a href="#model">Model</a>', "")
        result = self.run_validator(html)
        self.assertEqual(result.returncode, 1)
        self.assertIn("toc", result.stderr.lower())

    def test_rejects_duplicate_quiz_data_elements(self) -> None:
        quiz_data = '<script id="explainer-quiz-data" type="application/json">{"questions": []}</script>'
        html = self.valid_artifact().replace(quiz_data, quiz_data + quiz_data)
        result = self.run_validator(html)
        self.assertEqual(result.returncode, 1)
        self.assertIn("exactly one", result.stderr.lower())

    def test_rejects_artifact_without_inline_styles(self) -> None:
        html = self.valid_artifact().replace("<style>body { color: black; }</style>", "")
        result = self.run_validator(html)
        self.assertEqual(result.returncode, 1)
        self.assertIn("inline style", result.stderr.lower())

    def test_rejects_artifact_without_executable_script(self) -> None:
        html = self.valid_artifact().replace('<script>console.log("interactive");</script>', "")
        result = self.run_validator(html)
        self.assertEqual(result.returncode, 1)
        self.assertIn("executable script", result.stderr.lower())

    def test_accepts_canonical_template_after_slot_substitution(self) -> None:
        html = TEMPLATE.read_text(encoding="utf-8")
        replacements = {
            "{{TITLE}}": "Example explainer",
            "{{SUBTITLE}}": "A source-grounded explanation.",
            "{{METADATA}}": "Source boundary: synthetic test fixture.",
            "{{TABLE_OF_CONTENTS}}": '<ol><li><a href="#model">Model</a></li></ol>',
            "{{EXPLANATION_CONTENT}}": '<section id="model"><h2>Model</h2><p>Minimal explanation.</p></section>',
            "{{QUIZ_JSON}}": '{"questions": []}',
        }
        for token, value in replacements.items():
            html = html.replace(token, value)
        result = self.run_validator(html)
        self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == "__main__":
    unittest.main()
