# Vendor Adapter Guidance (Optional Layer)

## Purpose

Keep skill outputs vendor-neutral by default, but provide adapter mappings for common platforms.

## Rule of Use

- Default deliverable: vendor-neutral.
- Vendor-specific adaptations: only when user requests or implementation environment requires it.
- Never treat one vendor's format as universally required.

## OpenAI Adapter

Relevant concepts:

- reusable skill bundles with `SKILL.md`,
- versioned skill assets and references,
- hosted/local shell attachment patterns.

Mapping guidance:

- keep neutral `SKILL.md` content unchanged,
- add OpenAI-specific packaging metadata only in an adapter layer,
- preserve output contract and safety rules.

## Anthropic/Claude Adapter

Relevant concepts:

- progressive disclosure model (metadata, then `SKILL.md`, then references),
- practical guidance to keep `SKILL.md` focused and references direct,
- optional frontmatter fields for invocation/tool restrictions in Claude Code contexts.

Mapping guidance:

- maintain concise `SKILL.md`,
- link support files directly from `SKILL.md`,
- add Claude-specific fields only when targeting Claude runtime.

## GitHub Copilot Adapter

Relevant distinctions:

- custom instructions (always-on),
- prompt files (manual one-shot),
- custom agents (persona/tool profile),
- skills (reusable capability package).

Mapping guidance:

- keep reusable multi-step workflows in skills,
- keep repo-wide norms in instructions files,
- avoid duplicating workflow logic across both.

## Vercel/Skills Ecosystem Adapter

Relevant concepts:

- skills as reusable procedural knowledge packages,
- install and distribution via skills tooling,
- portability across multiple agent surfaces.

Mapping guidance:

- package the skill for discoverability/installability,
- preserve neutral content and add distribution metadata separately.

## Google ADK-Compatible Adapter

Terminology note:

- Google docs emphasize modular agents/tools/workflows rather than a first-class "skills" primitive with the same branding.

Mapping guidance:

- map neutral skill workflows to reusable ADK modules and tool orchestration flows,
- preserve entry conditions, safety boundaries, and output contracts.

## Cross-Vendor Portability Checklist

Before publishing vendor-adapted outputs:

1. Neutral baseline still exists as canonical source.
2. Adapter adds metadata, not behavior drift.
3. Trigger language remains clear and deterministic.
4. Safety boundaries are preserved.
5. Audit rubric and severity levels remain unchanged.
