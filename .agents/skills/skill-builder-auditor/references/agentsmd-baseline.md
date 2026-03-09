# AGENTS.md Baseline for Skill Design

## Objective

Define a vendor-neutral baseline for skill creation and auditing using AGENTS.md-style principles.

## Core AGENTS.md Concepts

- AGENTS.md is a predictable place for agent-facing guidance, similar to a README for agents.
- Guidance should be explicit, practical, and scoped to project workflows.
- Agents should get clear execution instructions (commands, checks, conventions) with minimal ambiguity.

## Baseline Requirements for Skills

Every generated or audited skill should satisfy:

1. Clear purpose statement
2. Explicit trigger conditions (when to use the skill)
3. Bounded scope (what the skill should not do)
4. Stepwise workflow instructions
5. Deterministic output contract
6. Safety/approval boundaries
7. Reference links to deeper guidance

## Recommended Skill Structure

```text
skill-name/
├── SKILL.md
├── references/
│   ├── domain-context.md
│   └── research-playbook.md
├── templates/
│   └── output-template.md
└── checklists/
    └── quality-checklist.md
```

## Instruction Writing Rules

- Use imperative language ("Do X", "Then do Y").
- Name explicit inputs and outputs for each step.
- Avoid vague language ("as needed", "if appropriate") unless conditions are defined.
- Keep global behavior separate from task-specific workflows.

## What Belongs in AGENTS.md vs Skills

Use AGENTS.md for:

- repository-wide standing guidance,
- toolchain commands and validation gates,
- broad collaboration norms.

Use skills for:

- reusable, named workflows,
- procedural logic with branching,
- packaged templates/checklists/reference context.

## Quality Signals

High-quality skills typically include:

- clarification-first behavior for ambiguous requests,
- explicit severity model for audits,
- direct references (not deeply nested references),
- reproducible output formats.
