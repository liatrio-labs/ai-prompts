#!/usr/bin/env python3
"""Validate the JSON contract used by interactive HTML explainers."""

from __future__ import annotations

import argparse
import json
import sys
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

MIN_QUESTIONS = 5
MAX_QUESTIONS = 15
QUIZ_ELEMENT_ID = "explainer-quiz-data"


class QuizDataParser(HTMLParser):
    """Extract the text from the one named application/json script element."""

    def __init__(self) -> None:
        super().__init__()
        self._capturing = False
        self.contents: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        self._capturing = (
            tag == "script"
            and attributes.get("id") == QUIZ_ELEMENT_ID
            and attributes.get("type") == "application/json"
        )

    def handle_endtag(self, tag: str) -> None:
        if tag == "script":
            self._capturing = False

    def handle_data(self, data: str) -> None:
        if self._capturing:
            self.contents.append(data)


def extract_json_text(path: Path) -> str:
    content = path.read_text(encoding="utf-8")
    if path.suffix.lower() == ".json":
        return content
    if path.suffix.lower() != ".html":
        raise ValueError("input must be a .json or .html file")

    parser = QuizDataParser()
    parser.feed(content)
    payload = "".join(parser.contents).strip()
    if not payload:
        raise ValueError(
            f"HTML must contain <script id=\"{QUIZ_ELEMENT_ID}\" type=\"application/json\">"
        )
    return payload


def require_nonempty_string(value: Any, path: str, errors: list[str]) -> None:
    if not isinstance(value, str) or not value.strip():
        errors.append(f"{path} must be a non-empty string")


def validate_quiz(data: Any) -> list[str]:
    errors: list[str] = []
    if not isinstance(data, dict):
        return ["$ must be an object"]

    questions = data.get("questions")
    if not isinstance(questions, list):
        return ["$.questions must be an array"]
    if not MIN_QUESTIONS <= len(questions) <= MAX_QUESTIONS:
        errors.append(f"$.questions must contain {MIN_QUESTIONS} to {MAX_QUESTIONS} entries")

    seen_ids: set[str] = set()
    for index, question in enumerate(questions):
        path = f"$.questions[{index}]"
        if not isinstance(question, dict):
            errors.append(f"{path} must be an object")
            continue

        question_id = question.get("id")
        require_nonempty_string(question_id, f"{path}.id", errors)
        if isinstance(question_id, str) and question_id.strip():
            if question_id in seen_ids:
                errors.append(f"{path}.id must be unique")
            seen_ids.add(question_id)

        require_nonempty_string(question.get("prompt"), f"{path}.prompt", errors)
        require_nonempty_string(question.get("correct_explanation"), f"{path}.correct_explanation", errors)
        require_nonempty_string(question.get("wrong_explanation"), f"{path}.wrong_explanation", errors)

        answers = question.get("answers")
        answer_path = f"{path}.answers"
        if not isinstance(answers, list):
            errors.append(f"{answer_path} must be an array")
            continue
        if len(answers) != 4:
            errors.append(f"{answer_path} must contain exactly four answers")

        correct_answers = 0
        for answer_index, answer in enumerate(answers):
            item_path = f"{answer_path}[{answer_index}]"
            if not isinstance(answer, dict):
                errors.append(f"{item_path} must be an object")
                continue
            require_nonempty_string(answer.get("text"), f"{item_path}.text", errors)
            if not isinstance(answer.get("correct"), bool):
                errors.append(f"{item_path}.correct must be a boolean")
            elif answer["correct"]:
                correct_answers += 1
        if correct_answers != 1:
            errors.append(f"{answer_path} must contain exactly one correct answer")

    return errors


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path, help="quiz JSON or HTML containing named embedded quiz data")
    arguments = parser.parse_args(argv)

    try:
        payload = extract_json_text(arguments.input)
        data = json.loads(payload)
    except FileNotFoundError:
        print(f"quiz JSON invalid: file not found: {arguments.input}", file=sys.stderr)
        return 1
    except UnicodeDecodeError as exc:
        print(f"quiz JSON invalid: input is not UTF-8: {exc}", file=sys.stderr)
        return 1
    except json.JSONDecodeError as exc:
        print(f"quiz JSON invalid: parse error at line {exc.lineno}: {exc.msg}", file=sys.stderr)
        return 1
    except ValueError as exc:
        print(f"quiz JSON invalid: {exc}", file=sys.stderr)
        return 1

    errors = validate_quiz(data)
    if errors:
        print("quiz JSON invalid:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    print(f"quiz JSON valid: {len(data['questions'])} questions")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
