# Multi-Diagram Markdown Validation

Use this workflow when working with existing markdown documents that already contain multiple Mermaid diagrams.

## Goals

- Validate all Mermaid blocks via one deterministic full-file run.
- Avoid broad rewrites across unrelated diagrams.
- Produce a deterministic pass/fail report per block.

## Procedure

1. Run `mmdc` against the full markdown file:

   ```bash
   mmdc -i <input.md> -o /tmp/<name>-rendered.md -a /tmp/<name>-mermaid-artifacts
   ```

2. Parse CLI output and store per-block result:
   - block index
   - nearby heading or context snippet
   - rendered artifact path (for passed blocks)
   - stderr excerpt (raw Mermaid CLI output on failure)
3. For failures, read raw CLI output and apply targeted fix only in implicated fences.
4. Re-run full-file `mmdc` validation.
5. Emit rollup summary.

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
- Optional cleanup: remove generated `/tmp/<name>-rendered.md` and `/tmp/<name>-mermaid-artifacts` when finished.
