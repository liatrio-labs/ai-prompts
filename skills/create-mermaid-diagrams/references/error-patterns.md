# Mermaid Error Patterns and Repair Strategies

## Error Input from Validator

Use the script exit code and raw Mermaid CLI stderr output.

## Repair Rules by Error Pattern

## Dependency/Input Failures

- Stop retries.
- Report dependency or input issue and how to fix it (`node`, `npx`, missing file, empty input).
- Do not guess syntax changes when CLI cannot run.

## Syntax/Parse Errors

- Inspect stderr for parser location hints.
- Fix only the smallest likely syntax fault per attempt:
  - broken arrows
  - missing bracket/brace
  - invalid diagram type keyword
  - malformed edge labels
- Revalidate immediately after each fix.

## Fence/Markdown Extraction Errors

- Ensure diagram content excludes markdown fence lines before validation.
- Ensure fences are exactly ` ```mermaid` and ` ``` ` in final markdown.
- Ensure no nested or indented fence markers.

## Unsupported Feature Errors

- Replace unsupported syntax with compatible alternatives.
- Keep semantics but downgrade to widely-supported constructs.
- Revalidate.

## Unknown/Other Errors

- Use first stderr line as local hint.
- Apply one conservative syntax normalization change.
- Revalidate.
- If still failing after max retries, return unresolved failure summary.

## Retry Loop Contract

1. Run validator.
2. If non-zero, read raw CLI output.
3. Apply one focused correction.
4. Re-run validator.
5. Stop at success or after 3 attempts.

## Final Failure Report Shape

- `attempts`: integer
- `last_error_excerpt`: stderr excerpt
- `suggested_next_fix`: concise manual action
