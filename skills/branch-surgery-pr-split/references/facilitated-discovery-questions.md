# Facilitated Discovery Questions

## Purpose

Use these questions to align on topology before branch surgery.
Ask only the questions needed to break meaningful ambiguity.

## Dependency and Scope

1. Which changes must merge before others can be reviewed correctly?
2. Which concerns are independent enough to review in parallel?
3. Are there mixed commits that span unrelated reviewer concerns?
4. Are there files that appear in many commits and likely cause conflicts?

## Review and Delivery Strategy

1. Do you want maximum parallel review throughput or strict sequential traceability?
2. Is a deeper PR stack acceptable if it improves change clarity?
3. Should shared docs updates be isolated to a final tail PR?
4. Are there stakeholder constraints on PR size or count?

## Risk and Compliance

1. Is there a low tolerance for any net-state drift from the original branch?
2. Are there release deadlines that change preferred merge sequencing?
3. Do any changes require additional compliance/security review gates?

## Decision Capture

After discussion, explicitly capture:

1. Chosen topology.
2. Runner-up topology and why not selected.
3. Non-negotiable constraints.
4. Audit gates required before opening PRs.
