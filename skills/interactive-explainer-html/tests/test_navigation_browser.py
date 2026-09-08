from __future__ import annotations

import json
import os
import re
import subprocess
import tempfile
import threading
import unittest
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parents[1]
TEMPLATE = SKILL_DIR / "references" / "explainer-template.html"
LABELS = (
    "Purpose", "Calculator journey", "Records", "Result truth", "Recovery",
    "Delivery process", "Manual verification",
)


def render_navigation_fixture() -> str:
    """Exercise the canonical shell, not a stale copy of its runtime."""
    sections = "".join(
        f'<section id="chapter-{index}"><h2>{label}</h2>'
        f'<p>This is the reading area for {label.lower()}.</p></section>'
        for index, label in enumerate(LABELS)
    )
    links = "".join(
        f'<li><a href="#chapter-{index}">{label}</a></li>'
        for index, label in enumerate(LABELS)
    )
    replacements = {
        "{{TITLE}}": "Explainer navigation regression preview",
        "{{SUBTITLE}}": "Eight chapters, full labels, and keyboard-friendly reading.",
        "{{METADATA}}": "Synthetic browser test fixture; not source evidence.",
        "{{TABLE_OF_CONTENTS}}": f'<ol>{links}<li><a href="#quiz">Check your understanding</a></li></ol>',
        "{{EXPLANATION_CONTENT}}": (
            '<style>.explainer-content > section { min-height: 900px; }'
            '.explainer-content h2 { margin: 0; } #quiz { min-height: 900px; }</style>'
            + sections
        ),
        "{{QUIZ_JSON}}": (SKILL_DIR / "tests" / "fixtures" / "valid-quiz.json")
        .read_text(encoding="utf-8").replace("<", "\\u003c"),
    }
    source = TEMPLATE.read_text(encoding="utf-8")
    for token, value in replacements.items():
        source = source.replace(token, value)
    return source


class NavigationBrowserTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.directory = tempfile.TemporaryDirectory(prefix="explainer-navigation-")
        cls.fixture = Path(cls.directory.name) / "navigation.html"
        cls.fixture.write_text(render_navigation_fixture(), encoding="utf-8")
        handler = partial(SimpleHTTPRequestHandler, directory=cls.directory.name)
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.url = f"http://127.0.0.1:{cls.server.server_port}/navigation.html"

    @classmethod
    def tearDownClass(cls) -> None:
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()
        cls.directory.cleanup()

    def setUp(self) -> None:
        self.session = f"explainer-navigation-{os.getpid()}"
        self.run_cli("open", self.url)

    def tearDown(self) -> None:
        self.run_cli("close")

    def run_cli(self, *args: str) -> str:
        result = subprocess.run(
            ["playwright-cli", f"-s={self.session}", *args],
            capture_output=True, text=True, check=False,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        return result.stdout

    def probe(self, code: str):
        output = self.run_cli("--raw", "run-code", "async page => {" + code + "}")
        value = json.loads(output.strip())
        return json.loads(value) if isinstance(value, str) else value

    PREPARE = """
        await page.setViewportSize({width: 1280, height: 900});
        await page.emulateMedia({reducedMotion: 'reduce'});
        await page.evaluate(() => document.fonts.ready);
        const current = () => page.locator('.toc a[aria-current="location"]').getAttribute('href');
        const waitForCurrent = async (id) => {
            await page.waitForFunction(id => document.querySelector('.toc a[aria-current="location"]')?.hash === id, id);
        };
    """

    def test_highlight_starts_only_at_section_threshold_and_clears_at_top(self) -> None:
        state = self.probe(self.PREPARE + """
            const results = [];
            for (const width of [1280, 768, 390]) {
                await page.setViewportSize({width, height: 900});
                await page.evaluate(() => scrollTo({top: 0, behavior: 'instant'}));
                await page.waitForTimeout(100);
                const initial = await page.locator('.toc [aria-current]').count();
                // Pin the nav before measuring the threshold so its height is stable.
                await page.evaluate(() => scrollTo({top: document.querySelector('.toc-anchor').offsetTop + 1, behavior: 'instant'}));
                await page.waitForTimeout(100);
                await page.evaluate(() => {
                    const first = document.querySelector('#chapter-0');
                    const marker = innerWidth <= 600 ? 24 : document.querySelector('.toc').offsetHeight + 24;
                    scrollTo({top: scrollY + first.getBoundingClientRect().top - marker - 8, behavior: 'instant'});
                });
                await page.waitForTimeout(100);
                const before = await page.locator('.toc [aria-current]').count();
                await page.evaluate(() => scrollBy({top: 16, behavior: 'instant'}));
                await waitForCurrent('#chapter-0');
                await page.evaluate(() => scrollTo({top: 0, behavior: 'instant'}));
                await page.waitForTimeout(100);
                results.push({width, initial, before, restored: await page.locator('.toc [aria-current]').count()});
            }
            return results;
        """)
        for result in state:
            with self.subTest(width=result["width"]):
                self.assertEqual(result["initial"], 0)
                self.assertEqual(result["before"], 0)
                self.assertEqual(result["restored"], 0)

    def test_non_scrollable_page_does_not_select_final_chapter(self) -> None:
        result = self.probe(self.PREPARE + """
            await page.setViewportSize({width: 1280, height: 16000});
            await page.waitForTimeout(150);
            return {scrollY: await page.evaluate(() => scrollY), active: await page.locator('.toc [aria-current]').count()};
        """)
        self.assertEqual(result, {"scrollY": 0, "active": 0})


    def test_short_final_sections_remain_selectable_and_align_at_reading_line(self) -> None:
        result = self.probe(self.PREPARE + """
            // Remove the fixture's artificial 900px sections, not the shell's CSS.
            await page.locator('.explainer-content > style').evaluate(style => {
                style.textContent = '.explainer-content > section { min-height: 0; } .explainer-content h2 { margin: 0; }';
            });
            const results = [];
            for (const [width, height] of [[1280, 2160], [1280, 900], [390, 844]]) {
                await page.setViewportSize({width, height});
                await page.waitForTimeout(100);
                await page.locator('.toc a[href="#chapter-6"]').click();
                await waitForCurrent('#chapter-6');
                await page.waitForTimeout(150);
                const penultimate = await current();
                await page.locator('.toc a[href="#quiz"]').click();
                await waitForCurrent('#quiz');
                const final = await page.evaluate(() => {
                    const target = document.querySelector('#quiz');
                    return {top: target.getBoundingClientRect().top, expected: parseFloat(getComputedStyle(target).scrollMarginTop)};
                });
                await page.locator('.toc a[href="#chapter-6"]').click();
                await waitForCurrent('#chapter-6');
                const back = await current();
                await page.locator('.toc a[href="#quiz"]').click();
                await waitForCurrent('#quiz');
                results.push({width, height, penultimate, final, back});
            }
            return results;
        """)
        for state in result:
            with self.subTest(viewport=(state["width"], state["height"])):
                self.assertEqual(state["penultimate"], "#chapter-6")
                self.assertEqual(state["back"], "#chapter-6")
                self.assertAlmostEqual(state["final"]["top"], state["final"]["expected"], delta=2)


    def test_compact_nav_preserves_labels_targets_and_column_positions(self) -> None:
        result = self.probe(self.PREPARE + """
            const measure = () => page.evaluate(() => {
                const toc = document.querySelector('.toc');
                const list = toc.querySelector('ol');
                const links = [...list.querySelectorAll('a')];
                return {
                    height: toc.getBoundingClientRect().height,
                    overhead: toc.getBoundingClientRect().height - list.getBoundingClientRect().height,
                    columns: links.map(link => [Math.round(link.getBoundingClientRect().left), Math.round(link.getBoundingClientRect().width)]),
                    targetHeights: links.map(link => link.getBoundingClientRect().height),
                    labels: links.map(link => link.textContent),
                    overflow: document.documentElement.scrollWidth > innerWidth,
                };
            });
            const rest = await measure();
            await page.evaluate(() => scrollTo({top: 900, behavior: 'instant'}));
            await page.waitForTimeout(100);
            const pinned = await measure();
            await page.setViewportSize({width: 390, height: 844});
            await page.waitForTimeout(100);
            return {rest, pinned, mobile: await measure()};
        """)
        self.assertLessEqual(result["rest"]["overhead"], 20)
        self.assertLessEqual(result["pinned"]["overhead"], 60)
        self.assertEqual(result["rest"]["columns"], result["pinned"]["columns"])
        for mode in ("rest", "pinned", "mobile"):
            self.assertFalse(result[mode]["overflow"])
            self.assertEqual(result[mode]["labels"], [*LABELS, "Check your understanding"])
            self.assertGreaterEqual(min(result[mode]["targetHeights"]), 32)
        self.assertGreaterEqual(min(result["mobile"]["targetHeights"]), 44)

    def test_fresh_deep_link_and_bottom_select_the_visible_destination(self) -> None:
        result = self.probe(self.PREPARE + """
            await page.goto('about:blank');
            await page.goto('""" + self.url + """#chapter-3');
            await waitForCurrent('#chapter-3');
            await page.evaluate(() => scrollTo({top: document.documentElement.scrollHeight, behavior: 'instant'}));
            await waitForCurrent('#quiz');
            return {current: await current()};
        """)
        self.assertEqual(result["current"], "#quiz")


    def test_emitted_scripts_parse(self) -> None:
        source = self.fixture.read_text(encoding="utf-8")
        scripts = re.findall(r'<script(?![^>]*application/json)[^>]*>(.*?)</script>', source, re.S | re.I)
        result = subprocess.run(["node", "--check"], input="\n".join(scripts), text=True, capture_output=True)
        self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == "__main__":
    unittest.main()
