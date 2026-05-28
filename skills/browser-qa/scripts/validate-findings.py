#!/usr/bin/env -S uv run
# /// script
# requires-python = ">=3.11"
# ///
"""Validate the demo-sized browser-qa findings JSON contract."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

STATUSES = {"pass", "warn", "fail", "unknown"}
EVIDENCE_KINDS = {"console", "network", "screenshot", "snapshot", "manual-note"}
SAFE_URL_SCHEMES = {"http", "https", "file"}
_SCHEME_RE = re.compile(r"^([a-z][a-z0-9+.\-]*):", re.IGNORECASE)


def has_unsafe_scheme(value: str) -> bool:
    match = _SCHEME_RE.match(value)
    if not match:
        return False
    return match.group(1).lower() not in SAFE_URL_SCHEMES


def require_mapping(value: Any, path: str, errors: list[str]) -> dict[str, Any]:
    if not isinstance(value, dict):
        errors.append(f"{path} must be an object")
        return {}
    return value


def require_keys(mapping: dict[str, Any], keys: list[str], path: str, errors: list[str]) -> None:
    for key in keys:
        if key not in mapping:
            errors.append(f"{path}.{key} is required")


def validate(data: Any) -> list[str]:
    errors: list[str] = []
    root = require_mapping(data, "$", errors)
    require_keys(root, ["target", "summary", "checks", "artifacts"], "$", errors)

    target = require_mapping(root.get("target"), "$.target", errors)
    require_keys(target, ["url", "checked_at", "viewport"], "$.target", errors)
    target_url = target.get("url")
    if isinstance(target_url, str) and has_unsafe_scheme(target_url):
        errors.append(f"$.target.url scheme must be one of {sorted(SAFE_URL_SCHEMES)} or a relative path")

    summary = require_mapping(root.get("summary"), "$.summary", errors)
    require_keys(summary, ["status", "passes", "warnings", "failures", "unknowns"], "$.summary", errors)
    if summary.get("status") not in STATUSES:
        errors.append(f"$.summary.status must be one of {sorted(STATUSES)}")

    checks = root.get("checks")
    if not isinstance(checks, list) or not checks:
        errors.append("$.checks must be a non-empty array")
        checks = []

    for index, check_value in enumerate(checks):
        path = f"$.checks[{index}]"
        check = require_mapping(check_value, path, errors)
        require_keys(check, ["id", "label", "status", "evidence"], path, errors)

        status = check.get("status")
        if status not in STATUSES:
            errors.append(f"{path}.status must be one of {sorted(STATUSES)}")

        evidence = check.get("evidence")
        if evidence is None:
            evidence = []
        if not isinstance(evidence, list):
            errors.append(f"{path}.evidence must be an array")
            evidence = []
        if status != "pass" and not evidence:
            errors.append(f"{path}.evidence is required when status is {status!r}")

        for ev_index, evidence_value in enumerate(evidence):
            ev_path = f"{path}.evidence[{ev_index}]"
            item = require_mapping(evidence_value, ev_path, errors)
            require_keys(item, ["kind", "message", "source"], ev_path, errors)
            if item.get("kind") not in EVIDENCE_KINDS:
                errors.append(f"{ev_path}.kind must be one of {sorted(EVIDENCE_KINDS)}")

    artifacts = require_mapping(root.get("artifacts"), "$.artifacts", errors)
    for key, value in artifacts.items():
        if value is None:
            continue
        if not isinstance(value, str):
            errors.append(f"$.artifacts.{key} must be a string or null")
            continue
        if has_unsafe_scheme(value):
            errors.append(
                f"$.artifacts.{key} scheme must be one of {sorted(SAFE_URL_SCHEMES)} or a relative path"
            )

    return errors


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate-findings.py <findings.json>", file=sys.stderr)
        return 2

    path = Path(argv[1])
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"browser-qa findings invalid: file not found: {path}", file=sys.stderr)
        return 1
    except json.JSONDecodeError as exc:
        print(f"browser-qa findings invalid: JSON parse error at line {exc.lineno}: {exc.msg}", file=sys.stderr)
        return 1

    errors = validate(data)
    if errors:
        print("browser-qa findings invalid:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    checks = len(data.get("checks", []))
    status = data.get("summary", {}).get("status", "unknown")
    print(f"browser-qa findings valid: status={status}, checks={checks}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
