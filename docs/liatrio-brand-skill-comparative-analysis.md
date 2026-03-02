# Liatrio Brand Skill Comparative Analysis

## Purpose

This document compares three Liatrio brand skills and records the consolidation decisions used to produce the canonical `skills/liatrio-brand-guidelines` skill in this repository.

## Candidates Compared

1. [liatrio/liatrio-branding-skill](https://github.com/liatrio/liatrio-branding-skill) (`skills/liatrio-brand/SKILL.md`)
2. [liatrio-labs/claude-plugins](https://github.com/liatrio-labs/claude-plugins/tree/main/plugins/liatrio-branding/skills/liatrio-brand-guide) (`plugins/liatrio-branding/skills/liatrio-brand-guide/SKILL.md`)
3. [liatrio-labs/ai-prompts](https://github.com/liatrio-labs/ai-prompts/blob/main/skills/liatrio-brand-guidelines/SKILL.md) (`skills/liatrio-brand-guidelines/SKILL.md`)

## Canonical Brand Source

Source-of-truth order used for factual decisions:

1. `https://www.liatrio.com/brand-data.json`
2. `https://www.liatrio.com/brand`
3. Existing local references/assets

## Weighted Scoring Model

Scoring prioritizes factual fidelity.

| Criterion | Weight |
| --- | --- |
| Factual fidelity to live brand data | 40 |
| Trigger precision and activation quality | 20 |
| Multi-platform portability | 15 |
| Instruction quality and execution reliability | 15 |
| Progressive disclosure and token efficiency | 10 |

## Comparative Findings

### 1) `liatrio/liatrio-branding-skill`

Strengths:

- Strong live-data and refresh model (`fetch-brand-data.sh`, `download-brand-assets.sh`)
- Strong source hierarchy language and logo variant specificity
- Good structure for portability (`SKILL.md`, `scripts/`, `assets/`)

Weaknesses:

- Less explicit output contracts for audit deliverables
- Less direct component/icons/spacing guidance in the core skill body

### 2) `liatrio-labs/claude-plugins` skill

Strengths:

- Clear trigger language and practical examples
- Direct and concise guidance for common logo/typography choices

Weaknesses:

- Contains stale values versus live brand JSON in tertiary palette content
- No formal source conflict-resolution model
- No live refresh scripts

### 3) Existing `ai-prompts` skill

Strengths:

- Best operational format for audits/checklists/verification loops
- Already includes source-priority and conflict handling concepts
- Strong local reference + visual baseline pattern

Weaknesses:

- Missing live-refresh scripts
- Needed tighter implementation output contract
- Needed broader reference coverage (icons/components/spacing)

## Consolidation Decisions

1. Use `ai-prompts` skill as the base implementation.
2. Import live-maintenance script pattern from `liatrio-branding-skill`.
3. Keep and strengthen source-priority + conflict reporting behavior.
4. Preserve practical trigger language and examples inspired by plugin skill.
5. Expand reference coverage to include icons, components, and spacing sections from official brand site content.
6. Require responses to state whether live verification was performed.

## Known Value Mismatch Corrected

The consolidated skill uses live canonical tertiary values from `brand-data.json`:

- Deep Sea: `#006989`
- Hot Red: `#E63946`
- Flame Orange: `#F77F00`

These supersede stale alternate values found in older skill variants.

## Implementation Changes Applied

- Updated: `skills/liatrio-brand-guidelines/SKILL.md`
- Updated: `skills/liatrio-brand-guidelines/references/liatrio-brand-guidelines.md`
- Added: `skills/liatrio-brand-guidelines/scripts/fetch-brand-data.sh`
- Added: `skills/liatrio-brand-guidelines/scripts/download-brand-assets.sh`

Validation run:

```bash
uv run scripts/generate_openai_yaml.py skills/liatrio-brand-guidelines
uv run scripts/quick_validate.py skills/liatrio-brand-guidelines
```

## External Best-Practice Sources

- Anthropic Agent Skills Overview: `https://console.anthropic.com/docs/en/agents-and-tools/agent-skills/overview`
- Anthropic Skill Authoring Best Practices: `https://console.anthropic.com/docs/en/agents-and-tools/agent-skills/best-practices`
- Anthropic Skills API Guide: `https://console.anthropic.com/docs/en/build-with-claude/skills-guide`
- Agent Skills Open Specification: `https://agentskills.io/specification`
- OpenAI Prompt Engineering Guide: `https://platform.openai.com/docs/guides/prompt-engineering`
- OpenAI Prompt Best Practices: `https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api`
- Vercel Agent Skills FAQ: `https://vercel.com/blog/agent-skills-explained-an-faq`
- Google Prompt Design Strategies: `https://ai.google.dev/gemini-api/docs/prompting-strategies`
- Microsoft Prompt Engineering Concepts: `https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/prompt-engineering`

## Review Checklist

- [ ] Skill frontmatter passes repo validator.
- [ ] Brand tokens match live `brand-data.json` values.
- [ ] Audit and implementation output contracts are present.
- [ ] Source-priority and conflict-report rules are explicit.
- [ ] Live verification fallback behavior is explicit.
