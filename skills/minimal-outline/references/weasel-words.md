# Weasel Words Reference

Weasel words are hedging language that weakens statements, obscures meaning, and lets writers avoid commitment. They signal unclear thinking.

In Amazon-style writing, replace weasel words with specific, measurable statements. If you can't be specific, you may not understand the topic well enough yet.

---

## Vague Quantifiers

These words sound like data but convey nothing measurable.

| Weasel Word | Problem | Replacement Example |
|-------------|---------|---------------------|
| significant(ly) | How much? | "reduced latency by 40ms (23%)" |
| substantial(ly) | How much? | "increased revenue by $2.3M" |
| considerable/considerably | How much? | "added 15,000 new users" |
| numerous | How many? | "received 47 customer complaints" |
| many | How many? | "12 teams adopted the tool" |
| few | How many? | "3 engineers completed training" |
| some | How many? | "4 of 10 customers reported issues" |
| most | What percentage? | "78% of respondents preferred option A" |
| almost | How close? | "94% of tests passed" |
| nearly | How close? | "migration completed for 18 of 20 services" |
| approximately | What range? | "between 500-600 requests per second" |
| about | What range? | "47 minutes (measured over 30 runs)" |
| around | What range? | "$12,000-$15,000 per month" |
| roughly | What range? | "3.2GB average memory usage" |

---

## Hedge Words

These words let writers avoid committing to a statement.

| Weasel Word | Problem | Replacement Example |
|-------------|---------|---------------------|
| might | Will it or won't it? | "will reduce load time" or "we haven't verified whether this reduces load time" |
| may | Will it or won't it? | "this increases response time by 200ms" or "we expect a 10-15% increase based on similar migrations (see Appendix B)" |
| could | Will it or won't it? | "saves 2 hours per deployment" or "we estimate 2 hours saved based on Team X's pilot results" |
| possibly | Is it or isn't it? | State the conditions: "if traffic exceeds 10K RPS, we need additional capacity" |
| potentially | Is it or isn't it? | "creates a security vulnerability" or "we haven't verified the security impact" |
| perhaps | Is it or isn't it? | Make a decision and state it |
| seems | Does it or doesn't it? | "the data shows X" or "we need to verify" |
| appears | Does it or doesn't it? | "testing confirmed X" |
| arguably | Is it or isn't it? | State the argument directly |
| somewhat | How much? | Quantify or remove |
| fairly | How much? | Quantify or remove |
| rather | How much? | Quantify or remove |
| quite | How much? | Quantify or remove |

---

## Attribution Dodgers

These phrases cite unnamed sources to add false authority.

| Weasel Word | Problem | Replacement Example |
|-------------|---------|---------------------|
| experts say | Which experts? | "Gartner's 2024 report states..." |
| studies show | Which studies? | "MIT's 2023 study (n=500) found..." |
| research indicates | Which research? | "[Author, Year] demonstrated that..." |
| it is believed | By whom? | "The security team (Jane Smith, lead) recommends..." |
| it is thought | By whom? | "Based on the platform team's load testing..." |
| some people think | Who? | Name them or remove |
| critics argue | Which critics? | "Jane Smith (competitor CTO) argues..." |
| many experts agree | Who and how many? | "AWS, GCP, and Azure documentation all recommend..." |
| according to sources | What sources? | Cite the source or remove |
| industry best practice | Says who? | Cite the standard: "per OWASP guidelines..." |

---

## Filler Phrases

These add words without adding meaning.

| Weasel Phrase | Replacement |
|---------------|-------------|
| in order to | to |
| due to the fact that | because |
| at this point in time | now |
| in the event that | if |
| for the purpose of | to / for |
| with regard to | about |
| in terms of | [rewrite sentence] |
| on a daily basis | daily |
| in the near future | [give a date] |
| at the end of the day | [remove or be specific] |
| it should be noted that | [remove, just state it] |
| it is important to note | [remove, just state it] |
| as a matter of fact | [remove] |
| basically | [remove] |
| actually | [remove] |
| essentially | [remove] |
| generally | [quantify or remove] |
| typically | [quantify: "in 80% of cases"] |
| usually | [quantify: "7 of 10 times"] |
| often | [quantify: "3x per week"] |
| sometimes | [quantify: "in 2 of 5 scenarios"] |
| rarely | [quantify: "once per quarter"] |
| seldom | [quantify: "2 incidents in 12 months"] |

---

## Complexity Disguisers

These words make simple things sound sophisticated.

| Weasel Word | Replacement |
|-------------|-------------|
| utilize | use |
| leverage | use |
| facilitate | help / enable |
| implement | build / do |
| optimize | improve / speed up |
| synergy | [be specific about what combines] |
| paradigm | model / approach |
| scalable | [specify: "handles 10x current load"] |
| robust | [specify what it withstands] |
| seamless | [specify the integration details] |
| streamline | simplify / reduce steps |
| empower | enable / let |
| best-in-class | [cite the comparison] |
| world-class | [cite the benchmark] |
| cutting-edge | [describe the specific capability] |
| next-generation | [describe what's new] |
| innovative | [describe the innovation] |
| transformative | [describe the change] |

---

## Passive Voice Hedges

Passive voice often hides who is responsible. This is a form of attribution dodging through sentence structure rather than vague sourcing.

| Weasel Phrase | Problem | Replacement |
|---------------|---------|-------------|
| "mistakes were made" | By whom? | "The deployment team pushed untested code" |
| "it was decided" | By whom? | "The VP of Engineering decided" |
| "the project was delayed" | By whom/what? | "Dependency on Team X delayed the project" |
| "concerns were raised" | By whom? | "QA raised concerns about test coverage" |
| "it has been suggested" | By whom? | "Sarah Chen suggested..." |

---

## Self-Test

Before submitting a document, search for these patterns:

- Any word ending in "-ly" (often an adverb)
- "significant" or "substantial"
- "may," "might," "could," "possibly"
- "some," "many," "few," "most"
- "it is" or "there are" (often passive voice)
- "in order to" or "due to the fact"

For each match, ask: **Can I replace this with a specific number, name, or date?**

If you can't be specific:

- You may need to do more research before writing
- Or state your expectation and what it's based on: "We expect a 15% improvement based on Team X's pilot results (see Appendix A)"
- Or acknowledge the gap: "We have not yet measured the performance impact"

Vague language often signals that more work is needed before the document is ready.
