#!/usr/bin/env python3
"""Local v1 Liatrio design-system adherence checker.

This checker intentionally uses only the Python standard library and reads only
local files. It performs deterministic, review-friendly checks for common
Liatrio brand/design-system issues and emits structured JSON suitable for proof
artifacts or CI-style review notes.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

REPO_SKILL_ROOT = Path(__file__).resolve().parents[1]
TOKEN_CSS = REPO_SKILL_ROOT / "assets" / "colors_and_type.css"

APPROVED_GREEN_HEX = {"#24ae1d", "#89df00", "#c6f135"}
APPROVED_GREEN_TOKENS = {
    "--primary-green",
    "--bright-green",
    "--lime",
    "--accent",
    "--accent-bright",
    "--success",
    "--border-accent",
}
DARK_SURFACE_TOKENS = {"--bg", "--bg-elevated", "--surface", "--dark-bg", "--dark-bg-2"}
DARK_SURFACE_HEX = {"#1a1f23", "#1e2327", "#111111", "#1e1e1e"}
REMOTE_REFERENCE_RE = re.compile(r"https?://[^\s\"'<>)]*", re.IGNORECASE)
HEX_RE = re.compile(r"#[0-9a-fA-F]{3,8}\b")
GREENISH_HEX_RE = re.compile(r"#[0-9a-fA-F]{6}\b")
TOKEN_RE = re.compile(r"var\(\s*(--[a-z0-9-]+)\s*\)", re.IGNORECASE)
EMOJI_RE = re.compile(
    "["
    "\U0001F300-\U0001FAFF"
    "\U00002700-\U000027BF"
    "\U00002600-\U000026FF"
    "]"
)


def read_tokens() -> dict[str, str]:
    """Read local token CSS and return token -> raw value map."""
    tokens: dict[str, str] = {}
    if not TOKEN_CSS.exists():
        return tokens
    for match in re.finditer(r"(--[a-z0-9-]+)\s*:\s*([^;]+);", TOKEN_CSS.read_text(encoding="utf-8"), re.IGNORECASE):
        tokens[match.group(1).lower()] = match.group(2).strip()
    return tokens


def add(items: list[dict[str, Any]], code: str, message: str, severity: str, evidence: str | None = None) -> None:
    item: dict[str, Any] = {"code": code, "severity": severity, "message": message}
    if evidence:
        item["evidence"] = evidence[:240]
    items.append(item)


def is_probably_green(hex_color: str) -> bool:
    value = hex_color.lstrip("#")
    if len(value) != 6:
        return False
    r, g, b = int(value[0:2], 16), int(value[2:4], 16), int(value[4:6], 16)
    return g > max(r, b) and g >= 120


def extract_visible_copy(text: str) -> str:
    # Remove style/script content, tags, and comments enough for copy checks.
    text = re.sub(r"<script\b[^>]*>.*?</script>", " ", text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r"<style\b[^>]*>.*?</style>", " ", text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r"<!--.*?-->", " ", text, flags=re.DOTALL)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def check_local_only(path_arg: str, findings: list[dict[str, Any]]) -> Path | None:
    parsed = urlparse(path_arg)
    if parsed.scheme and parsed.scheme not in {""}:
        add(findings, "non_local_input", "Checker input must be a local file path, not a URL or remote resource.", "error", path_arg)
        return None
    path = Path(path_arg).expanduser().resolve()
    if not path.exists() or not path.is_file():
        add(findings, "missing_file", "Checked file does not exist or is not a regular local file.", "error", str(path))
        return None
    return path


def check_adherence(path: Path, text: str) -> dict[str, Any]:
    findings: list[dict[str, Any]] = []
    warnings: list[dict[str, Any]] = []
    tokens = read_tokens()
    lowered = text.lower()
    used_tokens = {token.lower() for token in TOKEN_RE.findall(text)}
    raw_hex = {color.lower() for color in HEX_RE.findall(text)}
    visible_copy = extract_visible_copy(text)

    # Typography checks.
    if "space grotesk" not in lowered and "--font" not in used_tokens and "--font-body" not in used_tokens:
        add(findings, "missing_space_grotesk", "Canonical Space Grotesk usage was not found.", "error")
    if "dm sans" in lowered:
        add(findings, "stale_dm_sans", "DM Sans is stale/noncanonical for current Liatrio artifacts; use Space Grotesk.", "error", "DM Sans")

    # Dark-first surface checks.
    has_dark_surface = bool(used_tokens & DARK_SURFACE_TOKENS) or bool(raw_hex & DARK_SURFACE_HEX)
    if not has_dark_surface:
        add(findings, "missing_dark_surface", "Expected dark-first surface token or approved dark surface hex was not found.", "error")

    # Approved green token checks.
    approved_green_usage = bool(used_tokens & APPROVED_GREEN_TOKENS) or bool(raw_hex & APPROVED_GREEN_HEX)
    if not approved_green_usage:
        add(findings, "missing_approved_green", "Expected approved Liatrio green token or hex was not found.", "error")
    for color in sorted(raw_hex):
        if is_probably_green(color) and color not in APPROVED_GREEN_HEX:
            add(warnings, "unapproved_green_hex", "Green-like raw hex should use approved Liatrio green tokens or documented exceptions.", "warning", color)

    # Raw token hygiene adapted from _adherence.oxlintrc.json.
    raw_non_token_hex = sorted(c for c in raw_hex if c not in APPROVED_GREEN_HEX | DARK_SURFACE_HEX)
    if raw_non_token_hex:
        add(warnings, "raw_hex_color", "Raw hex colors found; prefer design-system tokens via var(...).", "warning", ", ".join(raw_non_token_hex[:8]))
    raw_px = sorted(set(re.findall(r"\b\d+px\b", text)))
    if raw_px:
        add(warnings, "raw_px_value", "Raw px values found; prefer design-system spacing/type/radius tokens where practical.", "warning", ", ".join(raw_px[:10]))

    # Source and offline checks.
    if "liatrio.ai" not in lowered:
        add(warnings, "missing_liatrio_ai_reference", "No liatrio.ai source/provenance reference found.", "warning")
    if "liatrio.com" in lowered:
        add(warnings, "legacy_liatrio_com_reference", "liatrio.com appears; ensure it is legacy-only context, not current canonical source guidance.", "warning")
    remote_refs = sorted(set(REMOTE_REFERENCE_RE.findall(text)))
    external_runtime_refs = [url for url in remote_refs if "liatrio.ai" not in url.lower()]
    if external_runtime_refs:
        add(warnings, "external_resource_reference", "External URL references found; static/offline artifacts should prefer bundled local assets unless explicitly allowed.", "warning", ", ".join(external_runtime_refs[:5]))

    # Copy posture checks.
    if EMOJI_RE.search(visible_copy):
        add(findings, "emoji_in_copy", "Emoji found in visible copy; Liatrio marketing/product UI copy should avoid emoji.", "error")
    exclamation_count = visible_copy.count("!")
    if exclamation_count:
        add(findings, "exclamation_in_copy", "Exclamation marks found in visible copy; Liatrio marketing/product UI copy should avoid them.", "error", f"count={exclamation_count}")

    # Structure checks where applicable.
    suffix = path.suffix.lower()
    if suffix in {".html", ".htm"}:
        if not re.search(r"<main\b|role=[\"']main[\"']", text, re.IGNORECASE):
            add(warnings, "missing_main_region", "HTML artifact lacks a main landmark.", "warning")
        if not re.search(r"<title>[^<]+</title>", text, re.IGNORECASE):
            add(warnings, "missing_title", "HTML artifact lacks a non-empty title element.", "warning")
        if "assets/colors_and_type.css" not in text and "../../assets/colors_and_type.css" not in text and "../assets/colors_and_type.css" not in text:
            add(warnings, "missing_local_token_css", "HTML artifact does not reference bundled local colors_and_type.css.", "warning")
    if "audit" in lowered:
        expected_audit_sections = ["executive summary", "findings", "recommendations"]
        missing = [section for section in expected_audit_sections if section not in lowered]
        if missing:
            add(findings, "missing_audit_structure", "Audit-like artifact is missing expected audit/review sections.", "error", ", ".join(missing))

    # Token source sanity: warn if checker cannot inspect local token CSS.
    if not tokens:
        add(warnings, "token_css_unavailable", "Local colors_and_type.css could not be read for token context.", "warning", str(TOKEN_CSS))

    status = "pass"
    if any(item["severity"] == "error" for item in findings):
        status = "fail"
    elif warnings:
        status = "warn"

    return {
        "status": status,
        "checked_file": str(path),
        "findings": findings,
        "warnings": warnings,
        "summary": {
            "finding_count": len(findings),
            "warning_count": len(warnings),
            "tokens_detected": sorted(used_tokens),
            "raw_hex_count": len(raw_hex),
            "checks": [
                "local_file_only",
                "space_grotesk_required",
                "dm_sans_stale",
                "dark_first_surfaces",
                "approved_green_tokens",
                "liatrio_ai_source_reference",
                "copy_no_emoji_or_exclamation",
                "audit_or_html_structure_when_applicable",
                "offline_external_reference_warning",
            ],
        },
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Check a local artifact for v1 Liatrio design-system adherence.")
    parser.add_argument("artifact", help="Local file path to inspect. URLs are rejected.")
    parser.add_argument("--pretty", action="store_true", help="Pretty-print JSON output.")
    args = parser.parse_args(argv)

    initial_findings: list[dict[str, Any]] = []
    path = check_local_only(args.artifact, initial_findings)
    if path is None:
        result = {
            "status": "fail",
            "checked_file": args.artifact,
            "findings": initial_findings,
            "warnings": [],
            "summary": {"finding_count": len(initial_findings), "warning_count": 0, "checks": ["local_file_only"]},
        }
    else:
        text = path.read_text(encoding="utf-8", errors="replace")
        result = check_adherence(path, text)

    print(json.dumps(result, indent=2 if args.pretty else None, sort_keys=True))
    return 1 if result["status"] == "fail" else 0


if __name__ == "__main__":
    sys.exit(main())
