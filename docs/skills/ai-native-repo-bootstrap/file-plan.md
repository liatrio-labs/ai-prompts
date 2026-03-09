# AI-Native Repo Bootstrap File Plan

## Skill Package Target

Create the package at `skills/ai-native-repo-bootstrap`.

## Planned Files

### `skills/ai-native-repo-bootstrap/SKILL.md`

Purpose:

- primary skill entrypoint
- trigger language
- workflow summary
- approval boundaries
- concise execution contract

Key sections:

- frontmatter with name and description
- when to use this skill
- when not to use this skill
- workflow: `new_repo`
- workflow: `upgrade_repo`
- output expectations
- approval and safety rules
- validation expectations

### `skills/ai-native-repo-bootstrap/references/baseline-rubric.md`

Purpose:

- capture the canonical definition of a good AI-native repository baseline

Key sections:

- rubric categories
- required artifacts
- optional artifacts
- minimum acceptable state
- strong target state

### `skills/ai-native-repo-bootstrap/references/maturity-profiles.md`

Purpose:

- explain how recommendations change for docs-first, early implementation, and active delivery repositories

Key sections:

- profile definitions
- allowed exceptions
- anti-patterns
- escalation points

### `skills/ai-native-repo-bootstrap/references/github-governance.md`

Purpose:

- isolate GitHub-specific remote operations from the neutral core

Key sections:

- repo settings audit commands
- ruleset audit commands
- ruleset apply commands
- drift detection patterns
- approval requirements
- verification steps

### `skills/ai-native-repo-bootstrap/references/adoption-sources.md`

Purpose:

- explain how source repositories informed the final baseline so future maintainers can understand provenance

Key sections:

- source inventory
- baseline repo takeaways
- target repo takeaways
- translation rules into this skill

### `skills/ai-native-repo-bootstrap/templates/delta-report-template.md`

Purpose:

- provide a deterministic report structure for audits and upgrade runs

Suggested sections:

- repo summary
- maturity classification
- compliant items
- gaps by severity
- local remediation plan
- remote remediation plan
- validation results
- follow-ups

### `skills/ai-native-repo-bootstrap/templates/check-results-template.md`

Purpose:

- standardize validation reporting

Suggested sections:

- commands run
- pass or fail results
- known skips
- unresolved blockers

### `skills/ai-native-repo-bootstrap/templates/execution-log-template.json.md`

Purpose:

- define the expected shape of a structured execution log without forcing a real JSON artifact in the skill package itself

Suggested fields:

- timestamp
- repository path
- workflow mode
- actions taken
- approvals received
- local files changed
- remote operations proposed or applied

### `skills/ai-native-repo-bootstrap/checklists/preflight-checklist.md`

Purpose:

- ensure safe startup conditions before making changes

Checklist topics:

- clean working tree expectations
- auth and tool availability
- repository maturity identification
- repo path confirmation
- remote approval boundary confirmation

### `skills/ai-native-repo-bootstrap/checklists/verification-checklist.md`

Purpose:

- ensure work is verified after changes

Checklist topics:

- local checks pass
- docs are internally consistent
- CI and release scaffolding are coherent
- remote parity audit completed
- residual risks documented

### `skills/ai-native-repo-bootstrap/agents/openai.yaml`

Purpose:

- generated agent metadata for this repository

Generation step:

```bash
uv run scripts/generate_openai_yaml.py skills/ai-native-repo-bootstrap
```

## Implementation Sequence

1. Create the folder scaffold under `skills/ai-native-repo-bootstrap`.
2. Write `SKILL.md` with a concise, triggerable contract.
3. Add the reference documents.
4. Add templates and checklists.
5. Generate `agents/openai.yaml`.
6. Validate the new skill.
7. Update docs inventory if needed.

## Validation Sequence

```bash
uv run scripts/generate_openai_yaml.py skills/ai-native-repo-bootstrap
uv run scripts/quick_validate.py skills/ai-native-repo-bootstrap
python scripts/check_docs_drift.py
```

## Open Questions To Resolve During Build

- Whether the first version should include an explicit repository settings adapter beyond rulesets.
- Whether agent runtime config files such as `.claude/`, `.cursor/`, and `.opencode/` should be treated as recommended or optional-plus.
- Whether the skill should emit only markdown reports or also prescribe a JSON report contract.
- Whether docs inventory updates belong in the same first implementation commit or a follow-up commit.
