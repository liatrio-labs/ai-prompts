# Mermaid Error Patterns and Repair Strategies

## Error Input from Validator

Use `mmdc` exit code and raw Mermaid CLI stderr output from the full markdown file run.

## Repair Rules by Error Pattern

## Dependency/Input Failures

- Stop retries.
- Treat `mmdc` execution/access failures as hard-stop errors (for example command not found, sandbox deny, permission denied).
- State clearly that validation did not run to completion; do not imply success or partial validation for the failing run.
- Report dependency or input issue and how to fix it (`mmdc` not found, missing input markdown file, unreadable file, output path permissions).
- Include the exact failed command, exit code (if available), and raw stderr excerpt.
- Do not guess syntax changes when CLI cannot run.

## Syntax/Parse Errors

- Inspect stderr for parser location hints (`Parse error on line`, snippet, and caret pointer).
- Fix only the smallest likely syntax fault per attempt:
  - broken arrows
  - missing bracket/brace
  - invalid diagram type keyword
  - malformed edge labels
  - unquoted text with special characters (for example `(` and `)`)
- Revalidate immediately after each fix.

## Fence/Markdown Extraction Errors

- Ensure Mermaid fences are valid in the source markdown file.
- Ensure fences are exactly `` ```mermaid `` and `` ``` `` in final markdown.
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

1. Run `mmdc` on the full markdown file.
2. If non-zero, read raw CLI output.
3. Apply one focused correction.
4. Re-run full-file `mmdc`.
5. Stop at success or after 3 attempts.

## Final Failure Report Shape

- `attempts`: integer
- `last_error_excerpt`: stderr excerpt
- `suggested_next_fix`: concise manual action
