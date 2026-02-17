# PR/MR Description Template

Use this exact structure unless the user requests a different format.

```markdown
## Why?

[Explain the motivation and context for these changes. What problem does this solve? What business value does it provide?]

**Evidence:** Cite specific commits, issues, or discussions that led to this change.

## What Changed?

[Provide a clear summary of the changes made. Focus on the "what" rather than the "how".]

### Key Changes:
- [List the main changes in bullet points]
- [Include new features, bug fixes, refactoring, etc.]
- [Mention architectural or design pattern changes]

**Files Modified:** [List key files/directories affected, for example `src/auth/`, `tests/integration/`]

## Additional Notes

- **Breaking Changes:** [If any, describe change and migration path]
- **Performance Implications:** [Any notable performance impacts]
- **Security Considerations:** [Security-related changes or concerns]
- **Testing Strategy:** [How this was tested]
- **Dependencies:** [Added/removed/updated dependencies]
- **Configuration Changes:** [Required environment/config changes]
- **Known Limitations:** [Limitations or future work]
- **Related Issues:** [Issue/ticket links]

## Review Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated for new functionality
- [ ] Documentation updated if needed
- [ ] No breaking changes (or migration path documented)
- [ ] Performance impact considered
- [ ] Security implications reviewed
- [ ] Dependencies reviewed and approved
```

## Example

```markdown
## Why?

This PR fixes a race condition in payment processing that caused duplicate charges for a small subset of requests.

**Evidence:** Commit `abc123` introduces request ID tracking and commit `def456` adds tests reproducing the race condition.

## What Changed?

Implemented request ID tracking to ignore stale responses from overlapping payment requests.

### Key Changes:
- Added request ID generation and tracking in payment service
- Implemented stale response guards
- Removed timeout-based workaround
- Added concurrent scenario test coverage

**Files Modified:** `src/payment/processor.py`, `tests/payment/test_race_conditions.py`, `docs/payment-api.md`

## Additional Notes

- **Breaking Changes:** None
- **Performance Implications:** Minimal overhead for request ID generation
- **Security Considerations:** Request IDs do not expose sensitive data
- **Testing Strategy:** Added unit and integration coverage for concurrent flows
- **Dependencies:** None
- **Configuration Changes:** None
- **Known Limitations:** None identified
- **Related Issues:** Fixes #1234
```
