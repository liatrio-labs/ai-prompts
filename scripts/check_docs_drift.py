#!/usr/bin/env python3
"""Check repository documentation for skill-inventory and script-reference drift."""

from __future__ import annotations

import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
README_PATH = REPO_ROOT / "README.md"
SKILLS_DIR = REPO_ROOT / "skills"
DOC_FILES = [
    REPO_ROOT / "README.md",
    REPO_ROOT / "CONTRIBUTING.md",
    REPO_ROOT / "docs" / "development.md",
    REPO_ROOT / "AGENTS.md",
]


def _extract_between(lines: list[str], start_pattern: str, end_pattern: str | None = None) -> list[str]:
    start_idx = None
    for i, line in enumerate(lines):
        if re.search(start_pattern, line):
            start_idx = i
            break

    if start_idx is None:
        return []

    end_idx = len(lines)
    if end_pattern is not None:
        for i in range(start_idx + 1, len(lines)):
            if re.search(end_pattern, lines[i]):
                end_idx = i
                break

    return lines[start_idx + 1 : end_idx]


def canonical_skills() -> set[str]:
    return {p.parent.name for p in SKILLS_DIR.glob("*/SKILL.md")}


def readme_skill_bullets(readme_lines: list[str]) -> set[str]:
    section = _extract_between(
        readme_lines,
        r"^Skills are organized in the `skills/` directory by capability:$",
        r"^### ",
    )
    results: set[str] = set()
    bullet_re = re.compile(r"^- `([a-z0-9-]+)/` -")
    for line in section:
        m = bullet_re.match(line.strip())
        if m:
            results.add(m.group(1))
    return results


def readme_skill_catalog(readme_lines: list[str]) -> set[str]:
    section = _extract_between(readme_lines, r"^## Skills Catalog$", r"^## ")
    results: set[str] = set()
    row_re = re.compile(r"^\| `([a-z0-9-]+)` \|")
    for line in section:
        m = row_re.match(line.strip())
        if m:
            results.add(m.group(1))
    return results


def find_script_references() -> tuple[set[str], set[str]]:
    ref_re = re.compile(r"(?:\./)?(scripts/[A-Za-z0-9_.-]+)")
    referenced: set[str] = set()
    missing: set[str] = set()

    for doc in DOC_FILES:
        text = doc.read_text(encoding="utf-8")
        for match in ref_re.findall(text):
            referenced.add(match)
            if not (REPO_ROOT / match).exists():
                missing.add(match)

    return referenced, missing


def _format_set(label: str, items: set[str]) -> list[str]:
    if not items:
        return [f"  {label}: none"]
    formatted = [f"  {label}:"]
    formatted.extend(f"    - {item}" for item in sorted(items))
    return formatted


def main() -> int:
    readme_lines = README_PATH.read_text(encoding="utf-8").splitlines()

    canonical = canonical_skills()
    bullets = readme_skill_bullets(readme_lines)
    catalog = readme_skill_catalog(readme_lines)
    referenced_scripts, missing_scripts = find_script_references()

    failures: list[str] = []

    bullet_missing = canonical - bullets
    bullet_extra = bullets - canonical
    if bullet_missing or bullet_extra:
        failures.append("README skills bullet list drift detected:")
        failures.extend(_format_set("missing entries", bullet_missing))
        failures.extend(_format_set("stale/extra entries", bullet_extra))

    catalog_missing = canonical - catalog
    catalog_extra = catalog - canonical
    if catalog_missing or catalog_extra:
        failures.append("README skills catalog drift detected:")
        failures.extend(_format_set("missing entries", catalog_missing))
        failures.extend(_format_set("stale/extra entries", catalog_extra))

    if missing_scripts:
        failures.append("Missing script references detected in docs:")
        failures.extend(f"    - {item}" for item in sorted(missing_scripts))

    if failures:
        print("Documentation drift check failed.")
        print()
        for line in failures:
            print(line)
        print()
        print("Canonical skills source: skills/*/SKILL.md")
        print("Scanned script-reference docs:")
        for doc in DOC_FILES:
            print(f"  - {doc.relative_to(REPO_ROOT)}")
        print("Referenced script paths found:")
        for item in sorted(referenced_scripts):
            print(f"  - {item}")
        return 1

    print("Documentation drift check passed.")
    print(f"Canonical skills: {', '.join(sorted(canonical))}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
