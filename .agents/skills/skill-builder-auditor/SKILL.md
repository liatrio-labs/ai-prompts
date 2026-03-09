---
name: skill-builder-auditor
description: Create new vendor-neutral agent skills from user intent, or audit existing skills against modern standards. Use when user asks to design, generate, review, or modernize skills.
---

# Skill Builder/Auditor

## Purpose

This skill supports two workflows:

1. `create_skill`: create a new skill package from a user request.
2. `audit_skill`: audit an existing skill package against current best practices.

Outputs must be vendor-neutral by default, grounded in the AGENTS.md ecosystem and portable across agent platforms.

## Mode Selection

Choose mode based on user intent:

- If user asks to build, draft, generate, or scaffold a skill: use `create_skill`.
- If user asks to review, assess, score, modernize, or validate a skill: use `audit_skill`.

If intent is ambiguous, do not proceed directly to generation. Use a clarification step first.

## Required Clarification and Planning

Before generating any skill artifacts:

1. Confirm objective and scope.
2. Confirm target repository/path.
3. Confirm whether user wants:
   - minimal output (MVP), or
   - full package (references/templates/checklists).
4. Confirm constraints:
   - vendor neutrality expectations,
   - safety/approval boundaries for remote operations.
5. Propose a concise plan and get acceptance.

Do not skip clarification for ambiguous requests.

## Output Contract

### For `create_skill`

Produce:

1. Skill specification summary:
   - purpose,
   - trigger conditions,
   - scope boundaries,
   - modes/workflows.
2. File plan:
   - exact files/folders to create,
   - short rationale per file.
3. Generated skill package files:
   - `SKILL.md`,
   - references,
   - templates,
   - checklists.
4. Validation results:
   - markdown lint pass/fail,
   - known gaps and follow-ups.

### For `audit_skill`

Produce:

1. Audit report with severity levels:
   - `critical`, `high`, `medium`, `low`.
2. Evidence:
   - concrete file references and snippets.
3. Remediation plan:
   - ordered fixes,
   - which are blocking vs non-blocking.
4. Updated compliance scorecard:
   - by category (structure, instructions, references, safety, portability, maintainability).

## Vendor-Neutral Baseline

Use AGENTS.md-aligned principles as the default baseline:

- concise and explicit instructions,
- clear operational commands,
- minimal ambiguity,
- deterministic outputs where possible.

Vendor-specific conventions are allowed as optional adapter guidance, not as the required output format.

## Research and Freshness Rules

When needed, perform updated research before final recommendations:

- prioritize official docs,
- compare across major vendors,
- note conflicts and choose neutral guidance by default.

Use `references/research-playbook.md` for trigger conditions and source priority.

## Safety Rules

- Never apply destructive operations without explicit user request.
- Never assume a platform-specific skill format as mandatory when user requested vendor-neutral output.
- Never represent optional vendor guidance as universal requirement.
- Clearly label assumptions and unresolved questions.

## Working Files

Use these companion files:

- `references/agentsmd-baseline.md`
- `references/vendor-adapters.md`
- `references/research-playbook.md`
- `templates/new-skill-spec-template.md`
- `templates/skill-audit-report-template.md`
- `checklists/authoring-checklist.md`
- `checklists/audit-checklist.md`
