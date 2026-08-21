from __future__ import annotations

import json
import os
import subprocess
import threading
import unittest
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import cast

FIXTURE = Path(__file__).resolve().parent / "fixtures" / "author-owned-explainer-fixture.html"


class QuizBrowserTests(unittest.TestCase):
    """Exercise the generated quiz through its public browser DOM."""

    @classmethod
    def setUpClass(cls) -> None:
        handler = partial(SimpleHTTPRequestHandler, directory=str(FIXTURE.parent))
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        cls.server_thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.server_thread.start()
        cls.target_url = (
            f"http://127.0.0.1:{cls.server.server_port}/{FIXTURE.name}"
        )

    @classmethod
    def tearDownClass(cls) -> None:
        cls.server.shutdown()
        cls.server.server_close()
        cls.server_thread.join()

    def setUp(self) -> None:
        self.session = f"explainer-quiz-{os.getpid()}"
        self.run_cli("open", self.target_url)

    def tearDown(self) -> None:
        subprocess.run(
            ["playwright-cli", f"-s={self.session}", "close"],
            capture_output=True,
            text=True,
            check=False,
        )

    def run_cli(self, *arguments: str) -> str:
        result = subprocess.run(
            ["playwright-cli", f"-s={self.session}", *arguments],
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        return result.stdout

    def evaluate(self, expression: str) -> dict[str, object]:
        output = self.run_cli(
            "--raw",
            "run-code",
            f"async page => await page.evaluate(() => JSON.stringify({expression}))",
        ).strip()
        value = json.loads(output)
        return json.loads(value) if isinstance(value, str) else value

    def test_initial_run_shows_one_question_with_progress_and_score(self) -> None:
        state = self.evaluate(
            "({"
            "visibleQuestions: document.querySelectorAll('#explainer-quiz .quiz-question').length,"
            "progress: document.querySelector('#quiz-progress')?.textContent.trim(),"
            "progressValue: document.querySelector('#quiz-progress-bar')?.value,"
            "score: document.querySelector('#quiz-score')?.textContent.trim()"
            "})"
        )
        self.assertEqual(state["visibleQuestions"], 1)
        self.assertEqual(state["progress"], "Question 1 of 5")
        self.assertEqual(state["progressValue"], 0)
        self.assertEqual(state["score"], "Correct: 0 · Incorrect: 0")

    def test_quiz_chrome_is_compact_and_separate_from_question_motion(self) -> None:
        state = self.evaluate(
            "({"
            "headingRow: Boolean(document.querySelector('.quiz-heading-row')),"
            "controlRow: Boolean(document.querySelector('.quiz-control-row')),"
            "instructionsInHeadingRow: Boolean(document.querySelector('.quiz-heading-row #quiz-instructions')),"
            "scoreInControlRow: Boolean(document.querySelector('.quiz-control-row #quiz-score')),"
            "actionsInControlRow: Boolean(document.querySelector('.quiz-control-row .quiz-actions')),"
            "nextInActions: Boolean(document.querySelector('.quiz-actions #quiz-next')),"
            "feedbackBeforeQuestion: Boolean(document.querySelector('#quiz-feedback-region')?.compareDocumentPosition(document.querySelector('#quiz-question-region')) & Node.DOCUMENT_POSITION_FOLLOWING),"
            "feedbackRegionHasReservedHeight: (document.querySelector('#quiz-feedback-region')?.getBoundingClientRect().height ?? 0) > 0,"
            "questionRegion: Boolean(document.querySelector('#quiz-question-region')),"
            "questionWithinRegion: Boolean(document.querySelector('#quiz-question-region #explainer-quiz .quiz-question')),"
            "answersAreLastInQuestion: document.querySelector('#explainer-quiz .quiz-question')?.lastElementChild?.classList.contains('answer-list'),"
            "questionAnimationDuration: Number.parseFloat(getComputedStyle(document.querySelector('.quiz-question')).animationDuration)"
            "})"
        )
        self.assertTrue(state["headingRow"])
        self.assertTrue(state["controlRow"])
        self.assertTrue(state["instructionsInHeadingRow"])
        self.assertTrue(state["scoreInControlRow"])
        self.assertTrue(state["actionsInControlRow"])
        self.assertTrue(state["nextInActions"])
        self.assertTrue(state["feedbackBeforeQuestion"])
        self.assertTrue(state["feedbackRegionHasReservedHeight"])
        self.assertTrue(state["questionRegion"])
        self.assertTrue(state["questionWithinRegion"])
        self.assertTrue(state["answersAreLastInQuestion"])
        animation_duration = cast(float, state["questionAnimationDuration"])
        self.assertGreaterEqual(animation_duration, 0.25)

    def test_fresh_runs_do_not_preserve_source_answer_order(self) -> None:
        answer_orders: set[tuple[str, ...]] = set()
        for _ in range(4):
            self.run_cli("reload")
            state = self.evaluate(
                "({answers: [...document.querySelectorAll('#explainer-quiz .answer-list button')]"
                ".map(button => button.textContent.trim())})"
            )
            answers = cast(list[object], state["answers"])
            self.assertIsInstance(answers, list)
            answer_orders.add(tuple(str(answer) for answer in answers))
        self.assertGreater(len(answer_orders), 1)


if __name__ == "__main__":
    unittest.main()
