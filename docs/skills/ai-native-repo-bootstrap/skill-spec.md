# AI-Native Repo Bootstrap Skill Specification

## Purpose

Bootstrap or upgrade a repository so humans and AI agents can work effectively with clear context, modern developer experience guardrails, deterministic feedback loops, and approval-gated remote governance.

## Positioning

This skill is marketed as a way to get a target repository ready for AI-native development.

It should not present itself as a generic template copier. It should present itself as a guided repo adoption and hardening workflow.

## Trigger Conditions

Use this skill when the user asks to:

- bootstrap a repo for AI-native development
- prepare a repo so AI agents can work well
- bring a repo up to a modern devex baseline
- upgrade a repo to stronger guardrails and feedback loops
- align a repo with the repository baseline or target-state template

Do not trigger for isolated app feature work or one-off lint or CI fixes with no repo-bootstrap intent.

## Workflows

### `new_repo`

Use when the repository is empty, lightly scaffolded, or still near-template state.

Outcome:

- required baseline files exist
- placeholders are replaced or intentionally documented
- local quality loops run
- CI and release scaffolding are in place
- remote GitHub parity can be audited and proposed

### `upgrade_repo`

Use when the repository already has established structure and needs baseline alignment.

Outcome:

- current local and remote state are audited
- deltas are classified by severity
- missing baseline items are added or updated
- maturity-based exceptions are preserved where intentional
- remote GitHub parity changes are planned or applied only with approval

## Scope Boundaries

### In Scope

- repository baseline audit
- repo-specific documentation and governance scaffolding
- local quality gates
- CI and release scaffolding
- GitHub ruleset and settings audit planning
- maturity-aware adaptation for docs-first repositories
- final delta and verification reporting

### Out of Scope

- product feature implementation
- secret provisioning
- organization-wide GitHub administration unrelated to the target repository
- destructive git cleanup
- silent remote GitHub mutation

## Operating Principles

- Start by classifying repository maturity before making recommendations.
- Use the baseline rubric instead of blindly copying files.
- Prefer deterministic outputs, concrete commands, and explicit report sections.
- Keep the neutral core separate from GitHub-specific operational guidance.
- Re-audit after changes and report residual gaps honestly.

## Maturity Profiles

The skill should explicitly support at least these repository states:

1. Docs-first planning repository
2. Early implementation repository
3. Active delivery repository

Each profile may justify different recommendations for tests, release stamping, language-specific hooks, and environment documentation.

## Approval Boundaries

The skill may inspect local files and propose changes without a special approval step.

The skill must require explicit user approval before:

- applying GitHub repository settings with `gh api`
- creating or updating GitHub rulesets
- changing remote governance or required checks
- taking any destructive action

## Output Contract

Each run should produce a clear report with these sections:

- repository maturity classification
- compliant baseline items
- missing or misaligned baseline items
- local changes planned or applied
- remote changes planned or applied
- validation results
- residual risks and follow-ups

## Baseline Rubric Categories

The skill should evaluate at minimum:

1. Repo intent and documentation clarity
2. Governance and contribution standards
3. Local feedback loops
4. CI quality enforcement
5. Release scaffolding
6. Remote GitHub policy as code
7. AI operability instructions
8. Environment and integration documentation
9. Maturity-based exceptions

## Required Skill Outputs

The finished skill package should support generating or reasoning about these artifact classes:

- required repo files and their target states
- repo delta reports
- execution logs
- preflight checklists
- verification checklists
- GitHub remote audit and apply sequences

## Canonical Examples

Use these repositories as canonical examples while authoring:

- Generic baseline: `/home/damien/Liatrio/repos/base-repo-template`
- AI-native target-state example: `/home/damien/Liatrio/repos/forge-program-tracker`

The strongest guidance should come from the differences between them.
