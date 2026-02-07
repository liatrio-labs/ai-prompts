---
name: create-mermaid-diagrams
description: Create, validate, and repair Mermaid diagrams for technical documentation with a deterministic CLI feedback loop. Use when an AI needs to create Mermaid diagrams, improve Mermaid diagram quality, validate Mermaid fences in markdown, diagnose Mermaid rendering failures, or fix Mermaid syntax and formatting issues.
---

# Create Mermaid Diagrams

## Overview

Create clear Mermaid diagrams and always validate output through a repeatable loop that catches syntax and rendering errors before final delivery.

## Context Marker

Always begin your response with all active emoji markers, in the order they were introduced.

Format: `"<marker1><marker2><marker3>\n<response>"`

The marker for this skill is: `🎨`

## Manual Triggering

When manual invocation is needed, trigger this skill using whatever mechanism your assistant/tool provides for manual skill selection or activation.

## Workflow

1. Define communication intent and choose the smallest diagram type that fits:
   - `flowchart` for process and architecture flow.
   - `sequenceDiagram` for interaction timelines.
   - `stateDiagram-v2` for state transitions.
2. Generate markdown with exactly one Mermaid fence per requested diagram:
   - Opening fence must be ` ```mermaid`.
   - Closing fence must be ` ``` `.
   - Keep fence markers at column 0.
3. Extract Mermaid body and validate with `scripts/validate_mermaid.sh`.
4. If validation fails:
   - Read the raw Mermaid CLI error output.
   - Apply the minimal targeted fix.
   - Re-run validation.
5. Repeat failure analysis and correction up to 3 attempts.
6. If still failing after 3 attempts, return:
   - Best-effort corrected diagram.
   - Validation summary with likely root cause.
   - Raw error excerpt from Mermaid CLI output.
   - Next manual fix suggestion.

## Feedback Loop Rules

- Do not change diagram type unless the error indicates the type keyword is invalid.
- Prefer minimal edits per retry to avoid introducing new syntax errors.
- Preserve user intent and semantic meaning while repairing syntax.
- Stop retrying early when validation succeeds.

## Existing Documentation with Multiple Mermaid Diagrams

When validating an existing markdown file that includes multiple Mermaid blocks:

1. Enumerate each Mermaid fence block in order.
2. Validate each block independently with `scripts/validate_mermaid.sh`.
3. Report per-block status with block index and nearby heading context.
4. Patch only failing blocks, then re-validate only modified blocks.
5. Provide a final rollup: total blocks, passed, failed, fixed, unresolved.

## Error Handling

Treat any non-zero validator exit as a failure and use Mermaid CLI output as the source of truth for diagnosis and repair.
For dependency or input failures, return installation/runtime guidance and do not continue retries.

## Output Requirements

- Always include the final Mermaid markdown block.
- Include a short validation result summary.
- On failure, include the actionable error context and exact next steps.

## References

- Mermaid best practices and templates: `references/mermaid-best-practices.md`
- Advanced diagram patterns and constructs: `references/advanced-patterns.md`
- Error classes and repair strategies: `references/error-patterns.md`
- Multi-diagram markdown validation workflow: `references/multi-diagram-validation.md`
