# Kiro CLI Adapter

Kiro CLI should use `AGENT_GUIDE.md` as the primary workflow and invoke scripts from `scripts/` for repeatable work.

Use Kiro planning/checkpoint features, if available, to track:

- visual applicability decision
- automated or guided demo plan
- route inspection and recording-config preflight
- runtime/auth decisions
- generated artifacts
- validation warnings

When more detail is required, load only the relevant reference file:

- `references/playwright-recording.md`
- `references/artifact-policy.md`

Keep generated recording scripts in the artifact folder outside the application repo.
