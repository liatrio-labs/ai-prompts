# New Skill Specification Template

Use this template when running `create_skill`.

## 1) Request Summary

- User objective:
- Problem being solved:
- Success criteria:
- Constraints:

## 2) Clarifications Captured

- Target path/repo:
- Expected depth (`mvp` or `full`):
- Vendor neutrality requirements:
- Safety/approval requirements:
- Open questions resolved:

## 3) Skill Definition

- Skill name:
- Short description (what + when to use):
- Primary mode(s):
- Non-goals:

## 4) Trigger Conditions

- Trigger phrases/intents:
- Explicit "do not trigger" cases:
- Ambiguity handling policy:

## 5) Workflow Design

### Mode: `create_skill`

1.
2.
3.

### Mode: `audit_skill`

1.
2.
3.

## 6) Output Contract

- Required outputs:
- Output file formats:
- Severity model (if audit path used):

## 7) File Plan

```text
<skill-folder>/
├── SKILL.md
├── references/
├── templates/
└── checklists/
```

- File-by-file rationale:

## 8) Safety and Guardrails

- Operations allowed without approval:
- Operations requiring approval:
- Explicit prohibitions:

## 9) Validation Plan

- Markdown lint commands:
- Additional checks:
- Pass/fail criteria:

## 10) Research/Citation Notes

- Sources consulted:
- Conflicts and resolution:
- Date of research snapshot:
