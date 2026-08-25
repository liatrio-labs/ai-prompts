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

    def evaluate_script(self, body: str) -> dict[str, object]:
        """Run an async page script whose last statement returns a JSON string."""
        output = self.run_cli(
            "--raw",
            "run-code",
            f"async page => await page.evaluate(async () => {{ {body} }})",
        ).strip()
        value = json.loads(output)
        return json.loads(value) if isinstance(value, str) else value

    def test_initial_run_shows_one_question_with_progress_and_score(self) -> None:
        state = self.evaluate(
            "({"
            "visibleQuestions: document.querySelectorAll('#explainer-quiz .quiz-question').length,"
            "progress: document.querySelector('#quiz-progress')?.textContent.trim(),"
            "progressValue: Number(document.querySelector('#quiz-progress-bar')?.getAttribute('aria-valuenow') ?? 0),"
            "score: document.querySelector('#quiz-score')?.textContent.trim()"
            "})"
        )
        self.assertEqual(state["visibleQuestions"], 1)
        self.assertEqual(state["progress"], "Question 1 of 5")
        self.assertEqual(state["progressValue"], 0)
        self.assertEqual(state["score"], "0 of 5 correct")

    def test_quiz_chrome_is_compact_and_separate_from_question_motion(self) -> None:
        state = self.evaluate(
            "({"
            "headingRow: Boolean(document.querySelector('.quiz-heading-row')),"
            "quizHeadingOutsideBox: Boolean(document.querySelector('#quiz > h2') && !document.querySelector('.quiz h2')),"
            "completeHiddenInitially: document.querySelector('#quiz-complete')?.hidden === true,"
            "controlRow: Boolean(document.querySelector('.quiz-control-row')),"
            "instructionsInHeadingRow: Boolean(document.querySelector('.quiz-heading-row #quiz-instructions')),"
            "scoreInStatusRow: Boolean(document.querySelector('.quiz-status #quiz-score')),"
            "progressBarBeforeStatusText: Boolean(document.querySelector('#quiz-progress-bar')?.compareDocumentPosition(document.querySelector('.quiz-status-summary')) & Node.DOCUMENT_POSITION_FOLLOWING),"
            "actionsInControlRow: Boolean(document.querySelector('.quiz-control-row .quiz-actions')),"
            "prevVisible: Boolean(document.querySelector('.quiz-nav-actions #quiz-prev')),"
            "nextVisible: Boolean(document.querySelector('.quiz-nav-actions #quiz-next')),"
            "prevDisabledInitially: document.querySelector('#quiz-prev')?.disabled === true,"
            "nextDisabledInitially: document.querySelector('#quiz-next')?.disabled === true,"
            "feedbackAfterQuestion: Boolean(document.querySelector('#quiz-question-region')?.compareDocumentPosition(document.querySelector('#quiz-feedback-region')) & Node.DOCUMENT_POSITION_FOLLOWING),"
            "feedbackRegionReservesSpaceInitially: (document.querySelector('#quiz-feedback-region')?.getBoundingClientRect().height ?? 0) > 40,"
            "questionRegion: Boolean(document.querySelector('#quiz-question-region')),"
            "questionWithinRegion: Boolean(document.querySelector('#quiz-question-region #explainer-quiz .quiz-question')),"
            "answersAreLastInQuestion: document.querySelector('#explainer-quiz .quiz-question')?.lastElementChild?.classList.contains('answer-list'),"
            "questionTransitionDuration: Number.parseFloat(getComputedStyle(document.querySelector('.quiz-question')).transitionDuration)"
            "})"
        )
        self.assertTrue(state["headingRow"])
        self.assertTrue(state["quizHeadingOutsideBox"])
        self.assertTrue(state["completeHiddenInitially"])
        self.assertTrue(state["controlRow"])
        self.assertTrue(state["instructionsInHeadingRow"])
        self.assertTrue(state["scoreInStatusRow"])
        self.assertTrue(state["progressBarBeforeStatusText"])
        self.assertTrue(state["actionsInControlRow"])
        self.assertTrue(state["prevVisible"])
        self.assertTrue(state["nextVisible"])
        self.assertTrue(state["prevDisabledInitially"])
        self.assertTrue(state["nextDisabledInitially"])
        self.assertTrue(state["feedbackAfterQuestion"])
        self.assertTrue(state["feedbackRegionReservesSpaceInitially"])
        self.assertTrue(state["questionRegion"])
        self.assertTrue(state["questionWithinRegion"])
        self.assertTrue(state["answersAreLastInQuestion"])
        transition_duration = cast(float, state["questionTransitionDuration"])
        self.assertGreaterEqual(transition_duration, 0.25)

    def test_sticky_nav_expands_to_full_width_then_restores(self) -> None:
        self.run_cli("resize", "1280", "720")
        state = self.evaluate_script(
            "const toc = document.querySelector('.toc');"
            "const article = document.querySelector('.explainer-content');"
            "if (document.documentElement.scrollHeight < window.innerHeight + 480) {"
            "article.style.minHeight = `${window.innerHeight}px`;"
            "}"
            "const rest = toc.getBoundingClientRect();"
            "const restClass = toc.classList.contains('is-stuck');"
            "document.querySelector('#quiz').scrollIntoView();"
            "await new Promise((resolve) => setTimeout(resolve, 900));"
            "const pinned = toc.getBoundingClientRect();"
            "const pinnedClass = toc.classList.contains('is-stuck');"
            "window.scrollTo(0, 0);"
            "await new Promise((resolve) => setTimeout(resolve, 900));"
            "const restored = toc.getBoundingClientRect();"
            "return JSON.stringify({"
            "restClass, restWidth: rest.width,"
            "pinnedClass, pinnedWidth: pinned.width, pinnedLeft: pinned.left, pinnedTop: pinned.top,"
            "restoredClass: toc.classList.contains('is-stuck'), restoredWidth: restored.width,"
            "viewport: document.documentElement.clientWidth"
            "});"
        )
        self.assertFalse(state["restClass"])
        self.assertLess(state["restWidth"], state["viewport"] - 40)
        self.assertTrue(state["pinnedClass"])
        self.assertLess(abs(state["pinnedWidth"] - state["viewport"]), 2)
        self.assertLess(abs(state["pinnedLeft"]), 2)
        self.assertLessEqual(state["pinnedTop"], 1)
        self.assertFalse(state["restoredClass"])
        self.assertAlmostEqual(state["restWidth"], state["restoredWidth"], delta=2)

    def test_pinned_nav_bleeds_surface_but_holds_chapter_columns(self) -> None:
        self.run_cli("resize", "1280", "720")
        state = self.evaluate_script(
            "const toc = document.querySelector('.toc');"
            "const article = document.querySelector('.explainer-content');"
            "if (document.documentElement.scrollHeight < window.innerHeight + 480) {"
            "article.style.minHeight = `${window.innerHeight}px`;"
            "}"
            "const geometry = () => [...document.querySelectorAll('.toc ol a')]"
            ".map((link) => { const box = link.getBoundingClientRect();"
            "return [Math.round(box.left), Math.round(box.width)]; });"
            "const restChapters = geometry();"
            "const restTracks = getComputedStyle(document.querySelector('.toc ol')).gridTemplateColumns;"
            "document.querySelector('#quiz').scrollIntoView();"
            "await new Promise((resolve) => setTimeout(resolve, 900));"
            "return JSON.stringify({"
            "isStuck: toc.classList.contains('is-stuck'),"
            "restChapters, pinnedChapters: geometry(),"
            "restTracks, pinnedTracks: getComputedStyle(document.querySelector('.toc ol')).gridTemplateColumns,"
            "pinnedWidth: toc.getBoundingClientRect().width,"
            "viewport: document.documentElement.clientWidth"
            "});"
        )
        self.assertTrue(state["isStuck"])
        self.assertLess(abs(state["pinnedWidth"] - state["viewport"]), 2)
        self.assertEqual(state["restChapters"], state["pinnedChapters"])
        self.assertEqual(state["restTracks"], state["pinnedTracks"])

    def test_toc_utility_row_reveals_back_to_top_only_while_pinned(self) -> None:
        self.run_cli("resize", "1280", "720")
        state = self.evaluate_script(
            "document.documentElement.style.scrollBehavior = 'auto';"
            "const article = document.querySelector('.explainer-content');"
            "if (document.documentElement.scrollHeight < window.innerHeight + 480) {"
            "article.style.minHeight = `${window.innerHeight}px`;"
            "}"
            "const toc = document.querySelector('.toc');"
            "const utility = document.querySelector('.toc-utility');"
            "const inner = document.querySelector('.toc-utility-inner');"
            "const topLink = document.querySelector('.toc-top');"
            "const firstChapter = document.querySelector('.toc ol a');"
            "const restStyle = getComputedStyle(utility);"
            "const rest = { visibility: restStyle.visibility, opacity: Number(restStyle.opacity) };"
            "document.querySelector('#quiz').scrollIntoView();"
            "await new Promise((resolve) => setTimeout(resolve, 900));"
            "const pinnedStyle = getComputedStyle(utility);"
            "const pinned = { visibility: pinnedStyle.visibility, opacity: Number(pinnedStyle.opacity) };"
            "const isStuck = toc.classList.contains('is-stuck');"
            "const label = topLink.innerText.trim();"
            "const dividerWidth = Number.parseFloat(getComputedStyle(inner).borderTopWidth);"
            "const listBox = document.querySelector('.toc ol').getBoundingClientRect();"
            "const topBox = topLink.getBoundingClientRect();"
            "const chapters = [...document.querySelectorAll('.toc ol a')];"
            "const lastChapterBottom = Math.max(...chapters.map((link) => link.getBoundingClientRect().bottom));"
            "const rightAligned = listBox.right - topBox.right;"
            "const belowChapters = topBox.top >= lastChapterBottom;"
            "const scrolled = window.scrollY;"
            "topLink.click();"
            "await new Promise((resolve) => setTimeout(resolve, 1000));"
            "return JSON.stringify({"
            "rest, pinned, isStuck, label, dividerWidth, rightAligned, belowChapters,"
            "afterChapters: Boolean(firstChapter.compareDocumentPosition(topLink) & Node.DOCUMENT_POSITION_FOLLOWING),"
            "topMarker: document.body.id,"
            "topBefore: getComputedStyle(topLink, '::before').content,"
            "listReset: getComputedStyle(document.querySelector('.toc ol')).counterReset,"
            "navReset: getComputedStyle(toc).counterReset,"
            "mainReset: getComputedStyle(document.querySelector('main')).counterReset,"
            "chapterBefore: getComputedStyle(firstChapter, '::before').content,"
            "scrolled, restored: window.scrollY"
            "});"
        )
        self.assertEqual("hidden", state["rest"]["visibility"])
        self.assertEqual(0, state["rest"]["opacity"])
        self.assertTrue(state["isStuck"])
        self.assertEqual("visible", state["pinned"]["visibility"])
        self.assertEqual(1, state["pinned"]["opacity"])
        self.assertEqual("↑Back to top", " ".join(state["label"].split()))
        self.assertTrue(state["afterChapters"])
        self.assertGreater(state["dividerWidth"], 0)
        self.assertLess(abs(state["rightAligned"]), 2)
        self.assertTrue(state["belowChapters"])
        self.assertEqual("top", state["topMarker"])
        self.assertIn(state["topBefore"], ("none", '""'))
        # The reset has to stay on the list: a counter-reset's scope covers following siblings,
        # so resetting on the nav itself continues the nav's count into the sections after it.
        self.assertIn("chapter", state["listReset"])
        self.assertEqual("none", state["navReset"])
        self.assertIn("chapter", state["mainReset"])
        self.assertIn("counter(chapter)", state["chapterBefore"])
        self.assertGreater(state["scrolled"], 40)
        self.assertLess(state["restored"], 20)

    ANSWER_AND_ADVANCE = (
        "const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));"
        "const answer = () => document.querySelector('#explainer-quiz .answer-list button').click();"
        "const nav = (id) => document.querySelector(id).click();"
        # Answers are shuffled, so resolve the correct one from the embedded quiz JSON.
        "const source = JSON.parse(document.querySelector('#explainer-quiz-data').textContent);"
        "const answerCorrectly = () => {"
        "const heading = document.querySelector('#explainer-quiz .quiz-question h3').textContent;"
        "const question = source.questions.find((item) => heading.includes(item.prompt));"
        "const correct = question.answers.find((item) => item.correct).text;"
        "[...document.querySelectorAll('#explainer-quiz .answer-list button')]"
        ".find((button) => button.textContent === correct).click();};"
        "const answerIncorrectly = () => {"
        "const heading = document.querySelector('#explainer-quiz .quiz-question h3').textContent;"
        "const question = source.questions.find((item) => heading.includes(item.prompt));"
        "const wrong = question.answers.find((item) => !item.correct).text;"
        "[...document.querySelectorAll('#explainer-quiz .answer-list button')]"
        ".find((button) => button.textContent === wrong).click();};"
    )

    def test_navigation_is_not_blocked_while_questions_animate(self) -> None:
        state = self.evaluate_script(
            self.ANSWER_AND_ADVANCE
            + "answer();"
            "await sleep(850);"
            "nav('#quiz-next');"
            "await sleep(80);"
            "const mid = {"
            "prevDisabled: document.querySelector('#quiz-prev').disabled,"
            "cards: document.querySelectorAll('#explainer-quiz .quiz-question').length};"
            "nav('#quiz-prev');"
            "await sleep(120);"
            "nav('#quiz-next');"
            "await sleep(900);"
            "return JSON.stringify({mid, settled: {"
            "progress: document.querySelector('#quiz-progress').textContent.trim(),"
            "cards: document.querySelectorAll('#explainer-quiz .quiz-question').length,"
            "panels: document.querySelectorAll('#quiz-feedback-stack .feedback').length}});"
        )
        mid = cast(dict[str, object], state["mid"])
        settled = cast(dict[str, object], state["settled"])
        self.assertFalse(mid["prevDisabled"], "previous must stay usable mid-animation")
        self.assertEqual(mid["cards"], 2, "both cards should be crossfading")
        self.assertEqual(settled["progress"], "Question 2 of 5")
        self.assertEqual(settled["cards"], 1, "interrupted cards must not accumulate")
        self.assertEqual(settled["panels"], 0, "unanswered question shows no feedback panel")

    def test_quiz_block_and_page_height_never_change(self) -> None:
        state = self.evaluate_script(
            self.ANSWER_AND_ADVANCE
            + "const sample = () => ({"
            "quiz: Math.round(document.querySelector('.quiz').getBoundingClientRect().height),"
            "page: Math.round(document.documentElement.scrollHeight)});"
            "const samples = {initial: sample()};"
            "answer();"
            "await sleep(900);"
            "samples.answered = sample();"
            "nav('#quiz-next');"
            "await sleep(900);"
            "samples.nextUnanswered = sample();"
            "answer();"
            "await sleep(900);"
            "samples.nextAnswered = sample();"
            "nav('#quiz-prev');"
            "await sleep(900);"
            "samples.backAgain = sample();"
            "return JSON.stringify(samples);"
        )
        quiz_heights = {cast(dict[str, int], step)["quiz"] for step in state.values()}
        page_heights = {cast(dict[str, int], step)["page"] for step in state.values()}
        self.assertEqual(len(quiz_heights), 1, f"quiz block resized: {state}")
        self.assertEqual(len(page_heights), 1, f"page height changed: {state}")

    def test_answered_question_is_locked_before_it_animates_in(self) -> None:
        state = self.evaluate_script(
            self.ANSWER_AND_ADVANCE
            + "answer();"
            "await sleep(850);"
            "nav('#quiz-next');"
            "await sleep(850);"
            "nav('#quiz-prev');"
            "await sleep(80);"
            "const entering = document.querySelector('#explainer-quiz .quiz-question.quiz-question-enter');"
            "const buttons = [...entering.querySelectorAll('button')];"
            "return JSON.stringify({"
            "opacity: Number(getComputedStyle(entering).opacity),"
            "allDisabled: buttons.every((button) => button.disabled),"
            "pressed: buttons.filter((button) => button.getAttribute('aria-pressed') === 'true').length});"
        )
        self.assertLess(cast(float, state["opacity"]), 1, "card should still be fading in")
        self.assertTrue(state["allDisabled"], "answered card must render locked")
        self.assertEqual(state["pressed"], 1)

    def test_status_lines_fade_out_before_the_next_value_fades_in(self) -> None:
        state = self.evaluate_script(
            self.ANSWER_AND_ADVANCE
            + "const layers = (id) => [...document.querySelectorAll(id + ' span')]"
            ".map((span) => ({text: span.textContent, opacity: Number(getComputedStyle(span).opacity),"
            "exiting: span.classList.contains('quiz-swap-exit')}));"
            "answerCorrectly();"
            "await sleep(50);"
            "const leaving = layers('#quiz-score');"
            "await sleep(150);"
            "const arriving = layers('#quiz-score');"
            "await sleep(900);"
            "nav('#quiz-next');"
            "await sleep(50);"
            "const progressLeaving = layers('#quiz-progress');"
            "await sleep(900);"
            "return JSON.stringify({leaving, arriving, progressLeaving, settled: {"
            "progressSpans: document.querySelectorAll('#quiz-progress span').length,"
            "scoreSpans: document.querySelectorAll('#quiz-score span').length,"
            "progressText: document.querySelector('#quiz-progress').textContent.trim(),"
            "scoreText: document.querySelector('#quiz-score').textContent.trim()}});"
        )
        for name in ("leaving", "progressLeaving"):
            layers = cast(list[dict[str, object]], state[name])
            exiting = [layer for layer in layers if layer["exiting"]]
            entering = [layer for layer in layers if not layer["exiting"]]
            self.assertEqual(len(exiting), 1, f"{name} needs one outgoing layer: {layers}")
            self.assertEqual(len(entering), 1, f"{name} needs one incoming layer: {layers}")
            self.assertLess(cast(float, exiting[0]["opacity"]), 1, "outgoing value should be fading")
            self.assertGreater(cast(float, exiting[0]["opacity"]), 0, "outgoing value should still show")
            self.assertLess(
                cast(float, entering[0]["opacity"]),
                0.05,
                f"{name} must hold the incoming value back until the outgoing one clears",
            )
        arriving = cast(list[dict[str, object]], state["arriving"])
        self.assertEqual(len(arriving), 1, f"outgoing layer should be gone by now: {arriving}")
        self.assertGreater(cast(float, arriving[0]["opacity"]), 0, "incoming value should be fading in")
        self.assertLess(cast(float, arriving[0]["opacity"]), 1, "incoming value should still be fading in")
        settled = cast(dict[str, object], state["settled"])
        self.assertEqual(settled["progressSpans"], 1, "stale status layers must be removed")
        self.assertEqual(settled["scoreSpans"], 1, "stale status layers must be removed")
        self.assertEqual(settled["progressText"], "Question 2 of 5")
        self.assertEqual(settled["scoreText"], "1 of 5 correct")

    def test_answers_fade_into_their_locked_state(self) -> None:
        state = self.evaluate_script(
            self.ANSWER_AND_ADVANCE
            + "const unselected = () => [...document.querySelectorAll('#explainer-quiz .answer-list button')]"
            ".filter((button) => button.dataset.selected !== 'true' && button.dataset.correct !== 'true')"
            ".map((button) => Number(getComputedStyle(button).opacity));"
            "answer();"
            "await sleep(300);"
            "const mid = unselected();"
            "await sleep(900);"
            "return JSON.stringify({mid, settled: unselected()});"
        )
        mid = cast(list[float], state["mid"])
        settled = cast(list[float], state["settled"])
        self.assertTrue(mid, "expected unselected answers to sample")
        for opacity in mid:
            self.assertLess(opacity, 0.99, "answers must not pop straight to disabled")
            self.assertGreater(opacity, 0.6, "answers must still be mid-fade")
        for opacity in settled:
            self.assertAlmostEqual(opacity, 0.55, places=2)

    def test_wrong_answer_reveals_the_correct_option(self) -> None:
        state = self.evaluate_script(
            self.ANSWER_AND_ADVANCE
            + "answerIncorrectly();"
            "await sleep(900);"
            "const buttons = [...document.querySelectorAll('#explainer-quiz .answer-list button')];"
            "const selected = buttons.find((button) => button.dataset.selected === 'true');"
            "const revealed = buttons.filter((button) => button.dataset.selected !== 'true' && button.dataset.correct === 'true');"
            "return JSON.stringify({"
            "selectedCorrect: selected?.dataset.correct,"
            "pressed: buttons.filter((button) => button.getAttribute('aria-pressed') === 'true').length,"
            "revealedCount: revealed.length,"
            "revealedOpacity: revealed.map((button) => Number(getComputedStyle(button).opacity))});"
        )
        self.assertEqual(state["selectedCorrect"], "false")
        self.assertEqual(state["pressed"], 1)
        self.assertEqual(state["revealedCount"], 1)
        for opacity in cast(list[float], state["revealedOpacity"]):
            self.assertAlmostEqual(opacity, 1.0, places=2)

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

    def test_last_question_shows_review_wrap_up(self) -> None:
        state = self.evaluate_script(
            self.ANSWER_AND_ADVANCE
            + "answer();"
            "await sleep(850);"
            "const first = document.querySelector('#quiz-complete')?.hidden === true;"
            "for (let index = 0; index < 4; index += 1) {"
            "nav('#quiz-next');"
            "await sleep(850);"
            "answer();"
            "await sleep(850);"
            "}"
            "const banner = document.querySelector('#quiz-complete');"
            "const last = banner?.textContent ?? '';"
            "const announced = document.querySelector('#quiz-feedback')?.textContent ?? '';"
            "const afterInstructions = Boolean(document.querySelector('.quiz-heading-row')?.compareDocumentPosition(banner) & Node.DOCUMENT_POSITION_FOLLOWING);"
            "const beforeButtons = Boolean(banner?.compareDocumentPosition(document.querySelector('.quiz-control-row')) & Node.DOCUMENT_POSITION_FOLLOWING);"
            "const lead = banner?.querySelector('.quiz-complete-lead');"
            "const score = banner?.querySelector('.quiz-complete-score');"
            "const review = banner?.querySelector('.quiz-complete-review');"
            "const scoreLine = document.querySelector('#quiz-score')?.textContent ?? '';"
            "const scored = scoreLine.match(/(\\d+) of (\\d+)/);"
            "const expectedScore = scored ? `${Math.round((Number(scored[1]) / Number(scored[2])) * 100)}%` : '';"
            "return JSON.stringify({first, hidden: banner.hidden, last, announced, afterInstructions, beforeButtons, leadDisplay: lead ? getComputedStyle(lead).display : '', leadText: lead?.textContent ?? '', scoreText: score?.textContent ?? '', scoreWeight: score ? getComputedStyle(score).fontWeight : '', reviewDisplay: review ? getComputedStyle(review).display : '', reviewText: review?.textContent ?? '', expectedScore});"
        )
        self.assertTrue(state["first"])
        self.assertFalse(state["hidden"])
        self.assertIn("🎉", state["last"])
        self.assertIn("Quiz complete!", state["leadText"])
        self.assertIn("You scored", state["leadText"])
        self.assertEqual(state["expectedScore"], state["scoreText"])
        self.assertIn(state["scoreWeight"], ("700", "600", "bold"))
        self.assertEqual("block", state["leadDisplay"])
        self.assertEqual("block", state["reviewDisplay"])
        self.assertIn("Previous and Next", state["reviewText"])
        self.assertNotIn("Previous and Next", state["leadText"])
        self.assertIn("Reset or Randomize", state["last"])
        self.assertIn("another pass", state["last"])
        self.assertNotIn("Quiz complete.", state["announced"])
        self.assertTrue(state["afterInstructions"])
        self.assertTrue(state["beforeButtons"])


if __name__ == "__main__":
    unittest.main()
