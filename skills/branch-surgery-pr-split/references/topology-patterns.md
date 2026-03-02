# Topology Patterns

## Purpose

Use this guide to choose candidate branch topologies after quantifying branch shape.
Always present the top two options to the user with tradeoffs.

## Pattern Matrix

| Pattern | Best fit | Strengths | Risks | Typical review profile |
| --- | --- | --- | --- | --- |
| Foundation + fan-out + docs tail | Shared setup plus many mostly independent concerns, plus high shared-doc churn | Parallel reviews after foundation, reduced docs conflicts, clean scope boundaries | Requires good upfront decomposition and branch bookkeeping | One foundation PR, many parallel PRs, one final docs PR |
| Linear stacked PRs | Strong dependency chain where each layer builds on prior layers | Clear dependency storytelling and minimal duplicate conflict resolution | Slow throughput, deep rebase chain, blocked reviewers | Sequential review and merge |
| Independent vertical slices to main | Clear concern boundaries and low shared-file overlap | Fastest parallel throughput, minimal stack complexity | Hard to use when shared setup is large, may duplicate setup changes | Many peer PRs to `main` |
| Hybrid | Some work is dependent, some independent | Balances throughput and dependency clarity | More planning complexity and potential confusion without explicit map | Small stack plus some parallel PRs |
| Two-phase split | Functional changes plus broad docs/migration cleanup | Reduces docs noise in functional reviews | If phase boundaries are fuzzy, scope drift can occur | Functional PRs first, docs/migration last |

## Selection Heuristics

Choose patterns by signal:

- High dependency density -> prioritize stacked or hybrid.
- High shared setup + low inter-feature dependency -> prioritize foundation + fan-out.
- Low shared-file overlap -> prioritize independent slices.
- Heavy cross-cutting docs churn -> include docs tail or two-phase split.
- Tight release sequencing constraints -> favor explicit stack segments.

Calibration rubric:

| Signal | Practical threshold examples |
| --- | --- |
| High dependency density | 30%+ of changed files import or call across planned slice boundaries, or 10+ cross-slice dependency links in review notes. |
| High shared setup + low inter-feature dependency | 20%+ of changed files are shared setup, while each feature slice has 3 or fewer cross-slice links after setup is isolated. |
| Low shared-file overlap | Less than 15% of changed files are touched by more than one planned slice. |
| Heavy cross-cutting docs churn | 8+ docs files changed across multiple domains or docs touched in 50%+ of functional commits. |
| Tight release sequencing constraints | 2+ slices are explicitly blocked on earlier slices, or release notes require a strict merge/install order. |

## What to Include in Option Tradeoffs

For each proposed option, include:

1. Why this topology matches current branch signals.
2. Review throughput implications.
3. Merge conflict and rebase burden.
4. Operational complexity and audit complexity.
5. Failure modes and mitigation plan.

## Recommendation Rule

Always provide:

1. Recommended option.
2. Runner-up option.
3. One-paragraph explanation of what would change if the runner-up were chosen.
