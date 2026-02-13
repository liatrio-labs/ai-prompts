# Commit Review Guardrails

## Goal

Run a concise commit-time review that catches obvious quality and risk issues before committing.

## Review Categories

- Code structure and organization
- Correctness and logic defects
- Security concerns (injection, auth, data exposure, secrets)
- Performance regressions
- Maintainability and readability
- Test coverage and test relevance

## Severity Rubric

- Critical: likely production outage, data loss, severe security issue, or unrecoverable corruption.
- High: major functional bug, strong security risk, or high-probability regression in core flows.
- Medium: meaningful quality or reliability gap that should be addressed soon.
- Low: minor improvements or polish items.

## Commit Gate

- If any Critical or High issue exists: stop and ask for explicit user confirmation before committing.
- If only Medium/Low findings or no findings: continue commit workflow.

## Report Template

Use this structure when reporting findings:

1. Executive summary
2. Issues by severity with file and line references
3. Suggested fixes with brief examples
4. Positive observations
5. Actionable next steps
