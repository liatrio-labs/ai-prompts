# Multi-Diagram Markdown Validation

Use this workflow when working with existing markdown documents that already contain multiple Mermaid diagrams.

## Goals

- Validate each Mermaid block independently.
- Avoid broad rewrites across unrelated diagrams.
- Produce a deterministic pass/fail report per block.

## Procedure

1. Locate Mermaid fences in order of appearance.
2. Extract each block body (exclude fence lines).
3. Validate each block via `scripts/validate_mermaid.sh`.
4. Store per-block result:
   - block index
   - nearby heading or context snippet
   - exit code (`0` pass, non-zero fail)
   - stderr excerpt (raw Mermaid CLI output on failure)
5. For failures, read raw CLI output and apply targeted fix.
6. Revalidate only blocks that were changed.
7. Emit rollup summary.

## Suggested Report Format

```text
Mermaid block validation summary:
- Total blocks: 5
- Passed: 3
- Fixed: 1
- Unresolved: 1

Block 2 (### API Flow): fixed after 1 retry
Block 5 (### State Model): unresolved (syntax)
```

## Guardrails

- Keep original ordering and surrounding markdown unchanged.
- Do not change diagram semantics unless needed to resolve parser/runtime failure.
- If many blocks fail, fix highest-priority sections first and report remaining backlog.
