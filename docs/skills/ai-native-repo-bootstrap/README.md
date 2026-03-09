# AI-Native Repo Bootstrap Planning Handoff

This folder captures the planning state needed to build the new `ai-native-repo-bootstrap` skill.

## Objective

Create a reusable skill at `skills/ai-native-repo-bootstrap` that bootstraps or upgrades a repository so humans and AI agents can work effectively with clear context, modern developer experience guardrails, deterministic feedback loops, and approval-gated remote governance.

## Current Decisions

- Skill name: `ai-native-repo-bootstrap`
- Package depth: full package, not MVP-only
- Core positioning: get a target repo ready for AI-native development
- Primary workflows: `new_repo` and `upgrade_repo`
- Vendor posture: vendor-neutral core with GitHub adapter/reference guidance
- Remote operations policy: audit first, require explicit approval before any `gh api` apply phase

## Source Materials

The skill should be derived from these sources, in this priority order:

1. `temp/template-target-state-handoff.md`
2. `/home/damien/Liatrio/repos/forge-program-tracker`
3. `/home/damien/Liatrio/repos/base-repo-template`
4. `AGENTS.md`
5. `.agents/skills/skill-builder-auditor/*`

## What Good Looks Like

The target skill should optimize for these outcomes:

- Repo intent is legible to both humans and AI agents.
- Governance and contribution standards are explicit early.
- Local feedback loops exist through `pre-commit` and markdown hygiene.
- CI preserves required quality checks even for docs-first repositories.
- Release automation is scaffolded honestly for current repo maturity.
- Remote GitHub policy is treated as code and can be audited against live state.
- AI operating instructions are concise, repo-specific, and actionable.
- Maturity-based exceptions are intentional rather than accidental.

## Key Insight From Source Repos

`base-repo-template` defines the generic governance baseline.

`forge-program-tracker` is the stronger target-state example because it shows how to adapt that baseline for a real docs-first, AI-assisted repository with policy drift detection, remote ruleset sync, and repo-specific agent instructions.

The skill should therefore model the delta between those two repositories rather than blindly copying the base template.

## Planned Deliverable Shape

The skill package should include:

- `skills/ai-native-repo-bootstrap/SKILL.md`
- `skills/ai-native-repo-bootstrap/references/*.md`
- `skills/ai-native-repo-bootstrap/templates/*.md`
- `skills/ai-native-repo-bootstrap/checklists/*.md`
- `skills/ai-native-repo-bootstrap/agents/openai.yaml`

See `docs/skills/ai-native-repo-bootstrap/skill-spec.md` for the contract and `docs/skills/ai-native-repo-bootstrap/file-plan.md` for the file-by-file plan.

## Recommended Build Order

1. Distill the neutral baseline from the source materials.
2. Write the concise `SKILL.md` entrypoint.
3. Add reference documents for maturity profiles and GitHub governance.
4. Add deterministic templates and checklists.
5. Generate `agents/openai.yaml`.
6. Validate the skill and docs inventory.

## Validation Commands

Run these from the repository root as work progresses:

```bash
uv run scripts/generate_openai_yaml.py skills/ai-native-repo-bootstrap
uv run scripts/quick_validate.py skills/ai-native-repo-bootstrap
python scripts/check_docs_drift.py
```

## Resume Checklist

When resuming on another machine:

1. Open `docs/skills/ai-native-repo-bootstrap/README.md`.
2. Review `docs/skills/ai-native-repo-bootstrap/skill-spec.md`.
3. Review `docs/skills/ai-native-repo-bootstrap/file-plan.md`.
4. Start authoring the skill package under `skills/ai-native-repo-bootstrap`.
5. Generate `agents/openai.yaml` after `SKILL.md` is stable.
6. Run validation commands before committing.
