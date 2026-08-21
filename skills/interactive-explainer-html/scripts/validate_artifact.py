#!/usr/bin/env python3
"""Validate the standalone structural contract of an HTML explainer."""

from __future__ import annotations

import argparse
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
TEMPLATE_TOKEN = re.compile(r"\{\{[A-Z][A-Z0-9_]*\}\}")
RUNTIME_TAGS = {"audio", "embed", "iframe", "image", "img", "link", "object", "script", "source", "track", "video"}
CSS_RESOURCE = re.compile(r"(?:@import\s+(?:url\()?|url\()\s*[\"']?([^\s\"')]+)", re.IGNORECASE)
JAVASCRIPT_COMMENT = re.compile(r"/\*.*?\*/|//[^\n]*", re.DOTALL)
EXECUTABLE_SCRIPT_TYPES = {
    "application/ecmascript",
    "application/javascript",
    "module",
    "text/ecmascript",
    "text/javascript",
}


def strip_css_comments(style_text: str) -> str:
    """Remove CSS block comments while preserving comment-like quoted text."""
    result: list[str] = []
    index = 0
    quote: str | None = None
    while index < len(style_text):
        character = style_text[index]
        if quote:
            result.append(character)
            if character == "\\" and index + 1 < len(style_text):
                index += 1
                result.append(style_text[index])
            elif character == quote:
                quote = None
            index += 1
            continue
        if character in {"\"", "'"}:
            quote = character
            result.append(character)
            index += 1
            continue
        if style_text.startswith("/*", index):
            end = style_text.find("*/", index + 2)
            if end == -1:
                break
            index = end + 2
            continue
        result.append(character)
        index += 1
    return "".join(result)


def has_embedded_space_grotesk_font(style_text: str) -> bool:
    effective_style = strip_css_comments(style_text)
    return any(
        re.search(r"font-family\s*:\s*[\"']?space\s+grotesk[\"']?", font_face, re.IGNORECASE)
        and re.search(r"src\s*:\s*url\(\s*[\"']?data:font/", font_face, re.IGNORECASE)
        for font_face in re.findall(r"@font-face\s*\{(.*?)\}", effective_style, re.IGNORECASE | re.DOTALL)
    )


def has_pressed_state_renderer(script_text: str) -> bool:
    effective_script = JAVASCRIPT_COMMENT.sub("", script_text)
    return all(
        re.search(
            rf"\.setAttribute\s*\(\s*[\"']aria-pressed[\"']\s*,\s*[\"']{state}[\"']\s*\)",
            effective_script,
        )
        for state in ("false", "true")
    )


def has_feedback_description_relationship(script_text: str) -> bool:
    effective_script = JAVASCRIPT_COMMENT.sub("", script_text)
    return bool(
        re.search(r"\bfeedback\.id\s*=", effective_script)
        and re.search(
            r"\bfeedback\.setAttribute\s*\(\s*[\"']role[\"']\s*,\s*[\"']status[\"']\s*\)",
            effective_script,
        )
        and re.search(
            r"\.setAttribute\s*\(\s*[\"']aria-describedby[\"']\s*,\s*feedback\.id\s*\)",
            effective_script,
        )
    )


def is_inline_resource(value: str) -> bool:
    return value.startswith("data:") or value.startswith("#")


class ArtifactInspector(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: set[str] = set()
        self.toc_depth = 0
        self.toc_targets: list[str] = []
        self.has_toc = False
        self.has_h1 = False
        self.has_inline_style = False
        self.has_executable_script = False
        self.quiz_data_count = 0
        self.has_quiz_mount = False
        self.has_reset = False
        self.has_randomize = False
        self.external_resources: list[str] = []
        self.style_text: list[str] = []
        self.script_text: list[str] = []
        self._active_style = False
        self._style_data: list[str] = []
        self._active_script_type: str | None = None
        self._script_data: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = dict(attrs)
        element_id = attr_map.get("id")
        if element_id:
            self.ids.add(element_id)
        if tag == "h1":
            self.has_h1 = True
        if tag == "nav" and "toc" in (attr_map.get("class") or "").split():
            self.toc_depth += 1
            self.has_toc = True
        elif tag == "nav" and self.toc_depth:
            self.toc_depth += 1

        if self.toc_depth and tag == "a":
            href = attr_map.get("href") or ""
            if href.startswith("#") and len(href) > 1:
                self.toc_targets.append(href[1:])

        if tag == "style":
            self._active_style = True
            self._style_data = []
        if tag == "script":
            self._active_script_type = (attr_map.get("type") or "text/javascript").lower()
            self._script_data = []
            if attr_map.get("id") == "explainer-quiz-data" and self._active_script_type == "application/json":
                self.quiz_data_count += 1
        if element_id == "explainer-quiz":
            self.has_quiz_mount = True
        if element_id == "quiz-reset":
            self.has_reset = True
        if element_id == "quiz-randomize":
            self.has_randomize = True

        if tag in RUNTIME_TAGS:
            resource = attr_map.get("src") or attr_map.get("href")
            if resource and not is_inline_resource(resource):
                self.external_resources.append(resource)
            srcset = attr_map.get("srcset")
            if srcset:
                self.external_resources.append("srcset=" + srcset)

    def handle_endtag(self, tag: str) -> None:
        if tag == "nav" and self.toc_depth:
            self.toc_depth -= 1
        if tag == "style":
            style_text = "".join(self._style_data)
            self.style_text.append(style_text)
            for resource in CSS_RESOURCE.findall(strip_css_comments(style_text)):
                if not is_inline_resource(resource):
                    self.external_resources.append(resource)
            self._active_style = False
        if tag == "script":
            script_text = "".join(self._script_data)
            if self._active_script_type in EXECUTABLE_SCRIPT_TYPES and script_text.strip():
                self.has_executable_script = True
                self.script_text.append(script_text)
            self._active_script_type = None
            self._script_data = []

    def handle_data(self, data: str) -> None:
        if self._active_style and data.strip():
            self.has_inline_style = True
            self._style_data.append(data)
        if self._active_script_type is not None:
            self._script_data.append(data)


def validate(path: Path) -> list[str]:
    try:
        source = path.read_text(encoding="utf-8")
    except OSError as error:
        return [f"cannot read artifact: {error}"]

    inspector = ArtifactInspector()
    inspector.feed(source)
    inspector.close()

    errors: list[str] = []
    if TEMPLATE_TOKEN.search(source):
        errors.append("artifact contains an unreplaced template token")
    if inspector.external_resources:
        errors.append("artifact contains an external runtime resource: " + ", ".join(inspector.external_resources))
    if not inspector.has_h1:
        errors.append("artifact is missing an h1 title")
    if not inspector.has_toc:
        errors.append("artifact is missing a table-of-contents navigation region")
    elif not inspector.toc_targets:
        errors.append("artifact TOC has no in-page links")
    for target in inspector.toc_targets:
        if target not in inspector.ids:
            errors.append(f"TOC target #{target} does not exist")
    if not inspector.has_inline_style:
        errors.append("artifact is missing an inline style block")
    if not inspector.has_executable_script:
        errors.append("artifact is missing an executable script block")
    style_text = "\n".join(inspector.style_text)
    script_text = "\n".join(inspector.script_text)
    if not has_embedded_space_grotesk_font(style_text):
        errors.append("artifact is missing an embedded Space Grotesk font")
    if not has_pressed_state_renderer(script_text):
        errors.append("artifact renderer is missing aria-pressed state hooks")
    if not has_feedback_description_relationship(script_text):
        errors.append("artifact renderer is missing feedback id/role or aria-describedby wiring")
    if inspector.quiz_data_count != 1:
        errors.append("artifact must contain exactly one #explainer-quiz-data JSON element")
    if not inspector.has_quiz_mount:
        errors.append("artifact is missing #explainer-quiz mount")
    if not inspector.has_reset:
        errors.append("artifact is missing #quiz-reset control")
    if not inspector.has_randomize:
        errors.append("artifact is missing #quiz-randomize control")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artifact", type=Path, help="Path to the generated HTML artifact")
    args = parser.parse_args()
    errors = validate(args.artifact)
    if errors:
        for error in errors:
            print(f"error: {error}", file=sys.stderr)
        return 1
    print("artifact structure valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
