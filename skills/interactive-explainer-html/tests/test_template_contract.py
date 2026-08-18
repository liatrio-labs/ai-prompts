from __future__ import annotations

import unittest
from pathlib import Path

TEMPLATE = Path(__file__).resolve().parents[1] / "references" / "explainer-template.html"


class ExplainerTemplateContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.source = TEMPLATE.read_text(encoding="utf-8")

    def test_exposes_freeform_explanation_and_toc_slots(self) -> None:
        self.assertIn("{{TABLE_OF_CONTENTS}}", self.source)
        self.assertIn("{{EXPLANATION_CONTENT}}", self.source)

    def test_embeds_named_quiz_json_and_mount(self) -> None:
        self.assertIn('id="explainer-quiz-data"', self.source)
        self.assertIn('id="explainer-quiz"', self.source)

    def test_provides_reset_and_randomize_controls(self) -> None:
        self.assertIn('id="quiz-reset"', self.source)
        self.assertIn('id="quiz-randomize"', self.source)

    def test_uses_delegated_events_instead_of_inline_handlers(self) -> None:
        self.assertNotIn("onclick=", self.source.lower())
        self.assertIn('addEventListener("click"', self.source)

    def test_has_no_external_runtime_dependencies(self) -> None:
        self.assertNotIn("<script src=", self.source.lower())
        self.assertNotIn("<link rel=\"stylesheet\"", self.source.lower())

    def test_avoids_favicon_network_noise(self) -> None:
        self.assertIn('rel="icon" href="data:,"', self.source)


if __name__ == "__main__":
    unittest.main()
