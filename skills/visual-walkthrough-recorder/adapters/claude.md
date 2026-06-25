# Claude Adapter

Claude does not need Codex-specific skill metadata to use this package.

Use `AGENT_GUIDE.md` as the primary instructions. Use shared scripts from `scripts/` for deterministic artifact generation. Keep any Claude-specific planning or tool invocation outside the shared scripts.

Run route inspection and recording-config preflight from `AGENT_GUIDE.md` before final video capture. Do not skip selector validation unless the user explicitly asks to skip it for the current run.

When Claude needs additional detail:

- Load `references/playwright-recording.md` for recording behavior.
- Load `references/artifact-policy.md` for output and cleanup rules.

Do not translate Codex `SKILL.md` manually; it is only an entry point for Codex.
