from __future__ import annotations

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parents[1]
VALIDATOR = SKILL_DIR / "scripts" / "validate_questions.py"
FIXTURES = Path(__file__).resolve().parent / "fixtures"


class ValidateQuestionsTests(unittest.TestCase):
    def run_validator(self, path: Path) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(VALIDATOR), str(path)],
            capture_output=True,
            text=True,
            check=False,
        )

    def test_accepts_valid_quiz_json(self) -> None:
        result = self.run_validator(FIXTURES / "valid-quiz.json")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("valid", result.stdout.lower())

    def test_rejects_question_with_not_four_answers(self) -> None:
        result = self.run_validator(FIXTURES / "invalid-answer-count.json")
        self.assertEqual(result.returncode, 1)
        self.assertIn("questions[0].answers", result.stderr)

    def test_rejects_question_without_exactly_one_correct_answer(self) -> None:
        result = self.run_validator(FIXTURES / "invalid-correct-count.json")
        self.assertEqual(result.returncode, 1)
        self.assertIn("questions[0].answers", result.stderr)

    def test_rejects_quiz_outside_supported_question_range(self) -> None:
        result = self.run_validator(FIXTURES / "invalid-question-count.json")
        self.assertEqual(result.returncode, 1)
        self.assertIn("questions", result.stderr)

    def test_extracts_quiz_json_from_named_html_script_element(self) -> None:
        quiz_json = (FIXTURES / "valid-quiz.json").read_text(encoding="utf-8")
        with tempfile.TemporaryDirectory() as directory:
            html_path = Path(directory) / "explainer.html"
            html_path.write_text(
                "<!doctype html><script id=\"explainer-quiz-data\" "
                f"type=\"application/json\">{quiz_json}</script>",
                encoding="utf-8",
            )
            result = self.run_validator(html_path)
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_rejects_html_without_named_quiz_data_element(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            html_path = Path(directory) / "explainer.html"
            html_path.write_text("<!doctype html><title>Missing quiz</title>", encoding="utf-8")
            result = self.run_validator(html_path)
        self.assertEqual(result.returncode, 1)
        self.assertIn("explainer-quiz-data", result.stderr)


if __name__ == "__main__":
    unittest.main()
