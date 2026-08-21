# Code-change source resolution

Use this reference only when the explainer's source is a code change. For documents, concepts, incidents, or user-provided material, use the source-and-evidence pass in `SKILL.md` instead.

## Resolve one source explicitly

Choose the source the user requested. Do not silently fall back to a different change set.

| User intent | Source boundary |
|---|---|
| Uncommitted work | `git diff HEAD` |
| Pull request number | PR diff plus PR metadata from the configured Git host CLI/API |
| Commit or ref range | The supplied verified range/ref |
| Current branch | Dynamic merge-base against its tracked/default base branch |

Before authoring, record the selected boundary, diff stat, changed paths, relevant implementation context, and available validation evidence. Reject an invalid ref or unavailable PR rather than guessing. If the selected diff is empty, report that there is nothing to explain and do not create a placeholder artifact.

## Evidence isolation

If the parent delegates **authorship** for a code-change explainer, give the author the resolved source boundary, allowed repository paths/commands, artifact destination, quiz setting, and relevant validation/spec paths. Do not give it a parent-written narrative to paraphrase. The author must form the explanation from the source evidence.

The parent remains responsible for source selection, external side effects, review synthesis, and delivery.

## Sensitive source material

Never embed secrets, tokens, credentials, or `.env` content. Before including source excerpts, redact credential-shaped values and replace them with a concise description such as `[redacted access token]`. Do not fabricate a replacement value. If the omission changes an important boundary, say what category was omitted without exposing it.
