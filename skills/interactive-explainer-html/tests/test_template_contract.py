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

    def test_provides_responsive_sticky_chapter_navigation(self) -> None:
        for hook in (
            "position: sticky",
            "flex-wrap: wrap",
            'aria-current="location"',
            'id="back-to-top"',
            'id="quiz" class="quiz"',
            ".toc { position: static; }",
            "scroll-margin-top",
            "IntersectionObserver",
            "counter-reset: chapter",
            'content: counter(chapter) ". "',
        ):
            with self.subTest(hook=hook):
                self.assertIn(hook, self.source)

    def test_embeds_named_quiz_json_and_mount(self) -> None:
        self.assertIn('id="explainer-quiz-data"', self.source)
        self.assertIn('id="explainer-quiz"', self.source)

    def test_retains_shared_font_and_accessibility_hooks(self) -> None:
        for hook in (
            "@font-face",
            'font-family: "Space Grotesk"',
            "data:font/",
            "--dark-bg: #1A1F23",
            "--primary-green: #24AE1D",
            "--bright-green: #89DF00",
            "--lime: #C6F135",
            "--violet: #C068F9",
            "--lagoon: #00C1DB",
            "aria-pressed",
            "aria-describedby",
            "focus-visible",
        ):
            with self.subTest(hook=hook):
                self.assertIn(hook, self.source)

    def test_uses_multiple_non_semantic_brand_accents_in_shared_chrome(self) -> None:
        for hook in (
            "border-top: 4px solid var(--primary-green)",
            "border: 1px solid var(--line)",
            "border-left: 3px solid var(--lagoon)",
        ):
            with self.subTest(hook=hook):
                self.assertIn(hook, self.source)

    def test_does_not_define_former_explanation_composition_primitives(self) -> None:
        for forbidden in (".table-scroll", ".code-scroll", ".explainer-flow"):
            with self.subTest(forbidden=forbidden):
                self.assertNotIn(forbidden, self.source)

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
