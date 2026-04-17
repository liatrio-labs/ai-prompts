---
name: minimal-outline
description: Compress, tighten, or outline writing (SOW, proposal, PR/FAQ, one-pager, six-pager, readout, memo, brief) into a minimal but semantically dense outline. Use when the user asks to outline, tighten, compress, or shorten a piece of writing, or wants the load-bearing essentials of a longer draft. Includes templates for PR/FAQ, one-pager, and six-pager formats.
---

# Minimal Outline

## The goal

Produce an outline with the **highest possible signal-to-noise ratio**: every bullet and every word earns its place. A reader should grasp the entire argument in one pass, and nothing should be cuttable without changing the meaning.

This is the opposite of a "comprehensive" outline. Comprehensiveness is the failure mode; it buries load-bearing claims under scene-setting, hedges, and restatements. The user wants the minimum text that conveys the message, not a faithful summary of every paragraph in the source.

## When it applies

Starting point varies:

- a full prose draft the user wants compressed
- a messy brain-dump of notes, comments, or reactions
- a raw idea the user is thinking out loud about
- a blank page where they know the doc type (e.g., "I need a one-pager for X")

Document type varies too: SOWs, proposals, PR/FAQs, one-pagers, six-pagers, advocacy memos, engagement readouts, strategic briefs, product ideas, internal decision docs, personal essays. The skill is **structure-agnostic**. Don't force content into a shape that doesn't fit the doc type.

## The method

### 1. Identify the doc type and its structure

**First, figure out what kind of document this is and what structure it wants.** This governs every later decision.

Three cases:

**a) The doc type has a prescribed structure.** PR/FAQs, one-pagers, and six-pagers all have canonical sections. Respect them; don't invent a new shape. Templates are bundled with this skill under `references/`:

- `references/pr-faq-template.md`: Press Release + FAQ structure
- `references/one-pager-template.md`: 10-section project scope doc
- `references/six-pager-template.md`: 6-section strategic narrative

If the user is outlining one of these, **read the relevant template before drafting**. Fit the content into the template's sections rather than inventing your own.

**b) The doc type has conventions but not a rigid structure.** SOWs, proposals, engagement readouts, status updates. These have expected elements (scope, deliverables, timeline, cost for a SOW; context, findings, recommendations for a readout) but the exact sectioning is flexible. Use the convention as a starting point; adjust as the content demands.

**c) The doc has no prescribed structure.** Advocacy memos, idea briefs, internal arguments. Here you're inventing the shape from scratch. A good default for persuasive/advocacy writing is **Ask → Why → How** (lead with what you want the reader to do, then the reasons, then the steps), but this is one option among many, not a mandatory structure. Other shapes that often work:

- **Problem → Solution → Consequences** (for decision memos)
- **Context → Finding → Recommendation** (for readouts and reviews)
- **Situation → Complication → Resolution** (the "SCR" pattern from consulting)
- **Claim → Evidence → Implication** (for analytical writing)

Pick the shape that matches what the content is really doing.

### 2. Find the one thing the doc is really doing

Every useful document has a single center of gravity: the one thing that, if removed, collapses the whole document. Name it before you write anything else.

- **PR/FAQ:** the customer + the benefit (literally the subheading)
- **One-pager:** the decision being asked for + whether it's worth doing
- **Six-pager:** the strategic recommendation or decision
- **SOW / proposal:** the scope of what will be delivered, and why it's worth the price
- **Advocacy memo:** the behavior change being requested
- **Engagement readout:** the finding or recommendation the audience should act on
- **Idea brief:** the proposition being tested

If you can't name it in one sentence, you don't yet understand what the doc is doing, and the outline will be padded with everything because nothing stands out as essential.

Once you name it, **lead with it** (or with whatever section the template prescribes for leading). Don't bury it behind scene-setting.

### 3. Extract the load-bearing claims

Find the 2-5 claims that, if the reader accepts them, make the center of gravity from step 2 unavoidable. These are the bullets that earn section-level real estate.

A load-bearing claim is not:

- a **rule or norm** smuggled in as justification
- an **analogy or example** (those support claims, they aren't claims)
- a **restatement** of the main point in different words
- **scene-setting** about how the world changed (unless the change *is* the reason)

When you catch yourself writing a bullet that doesn't actually carry weight, cut it or reclassify it.

### 4. Find the common backbone

If you're tempted to list variants or options, look for what's constant across them. Extract the constant as the main flow; push the variation to a single sub-bullet or side note.

Example: if three paths all end in "share → iterate → expand → polish" and only differ in how they start, the main flow is that shared sequence, and "how you get the initial outline" becomes one line of variation, not three parallel top-level bullets.

This is one of the biggest compression wins. Authors instinctively enumerate; the skill is to see through enumeration to the backbone.

### 5. Each bullet should answer a question

Every section (and ideally every top-level bullet) in a minimal outline should have an implicit question it answers. The bundled templates make this explicit with italicized *"This section answers:"* lines under every heading, and it's a useful positive test.

Examples:

- *What are we asking for?* → the ask
- *Why is this worth doing?* → the justification
- *How do we do it?* → the steps
- *What's in and out of scope?* → the boundary
- *What could go wrong?* → the risks

If you can't name the question a bullet answers in one sentence, the bullet is probably padding. This is the positive version of the cut-test: "does this earn its place?" instead of "is this removable?"

### 6. Cut ruthlessly

For each bullet, ask: **if I delete this, does the argument change?** If no, delete it.

For each word, ask: **if I delete this, does the meaning change?** If no, delete it.

**Categories to hunt for and kill:**

**Vague quantifiers** (the bullet sounds like data but measures nothing):

- *significant(ly), substantial(ly), considerable, numerous, many, few, some, most, almost, nearly, approximately, about, around, roughly*
- Replace with the actual number, range, or percentage. If you don't have one, say so explicitly rather than hedging.

**Hedges** (author ducking commitment):

- *might, may, could, possibly, potentially, perhaps, seems, appears, arguably, somewhat, fairly, rather, quite, virtually, subtle*
- Either commit to the claim or state plainly what you haven't verified yet. "We expect X based on Y" beats "X could possibly happen."

**Attribution dodgers** (false authority from unnamed sources):

- *experts say, studies show, research indicates, it is believed, some people think, industry best practice*
- Name the source or cut the claim.

**Filler phrases** (words without meaning):

- *in order to → to*
- *due to the fact that → because*
- *it should be noted that → [just state it]*
- *at this point in time → now*
- *basically, actually, essentially, generally, typically, usually, often, sometimes → [quantify or remove]*

**Complexity disguisers** (simple things dressed up):

- *utilize → use*
- *leverage → use*
- *facilitate → help / enable*
- *implement → build / do*
- *optimize → improve / speed up*
- *robust, seamless, scalable, best-in-class, world-class, next-generation, cutting-edge, innovative, transformative* → describe the specific capability or cut

**Passive-voice attribution dodges** (hiding who did what):

- *"concerns were raised"* → *"QA raised concerns"*
- *"it was decided"* → *"the VP decided"*
- *"the project was delayed"* → *"Team X's dependency delayed the project"*

**Structural padding:**

- Scene-setting that isn't load-bearing (*"The shift:", "Historically,", "In the old days"*)
- Filler nouns: *substance, aspects, things, stuff, elements, factors*
- Label-then-explain: *"Prose is the wrong format (it's slow to review)"* → *"Prose is slow to review"*
- Restatements that say the same thing in different words
- Analogies that illustrate but don't add to the argument (keep one that makes the point land; drop the rest)
- Adverbs ending in *-ly* (search for them; most are weasel words in disguise)

The full reference table (with every category, every entry, and replacement examples) is bundled at `references/weasel-words.md`. Load it when you need the exhaustive list or when grinding through a long document and want to search systematically.

When in doubt, cut. It's easier for the user to ask you to restore something than to ask you again to trim.

### 7. Prefer concrete words over vague ones

Vague words feel safe but communicate nothing. Replace them or cut them.

**Principles:**

- **Data over adjectives.** "customers love it" → "customer retention increased 15% year-over-year". "significantly improved" → "40ms faster (23%)". If you can't put a number on it, name the specific observable thing.
- **Simple verbs.** "use" not "utilize," "build" not "implement," "help" not "facilitate."
- **Concrete nouns.** "outcomes and approach" not "direction and substance." "the load-bearing claims" not "the important stuff."
- **Spell out acronyms on first use.** Then abbreviate.
- **Keep bullets under 30 words.** Long bullets hide muddled thinking. If a bullet runs long, either split it into parent + children or cut until the meaning is clear.

If you can't name a concrete replacement, the bullet probably isn't saying anything and should be cut rather than rephrased.

### 8. Use outline conventions, not prose

- Nested bullets for hierarchy, not paragraphs
- Labels as headers or parent bullets; content as children
- Avoid colons-in-bullets for inline explanation. If the label and content are both important, make the content a sub-bullet.
- Keep bullets roughly parallel in structure and length
- Headers are nouns when they name a thing, imperatives when they name a step

**Note:** For a six-pager, the final product is *narrative prose, not bullets*. The outline phase still uses bullets (to get the thinking right), but the expansion back into prose happens after alignment. Don't conflate the two phases.

## The workflow

Collaborative and iterative, not one-shot. Expect multiple rounds of feedback.

1. **Read the input carefully.** What doc type is this? What's the center of gravity? What are the load-bearing claims? What's padding?

2. **If it's a templated doc type, read the template.** Don't guess what sections a PR/FAQ needs. Load `references/pr-faq-template.md` and fit to it. Same for one-pagers (`references/one-pager-template.md`) and six-pagers (`references/six-pager-template.md`).

3. **Produce a first-draft outline.** Apply the method. Err on the side of cutting too much; it's easier for the user to add back than to ask you to remove again.

4. **Briefly explain your cuts.** One or two sentences about what you dropped and why. This lets the user redirect if your cuts don't match their intent.

5. **Iterate on feedback.** Common patterns:

   - *"Is X even important?"* → probably not; cut it
   - *"This isn't really a why"* → it's likely a rule or restatement; reclassify or cut
   - *"Can we say this more clearly?"* → look for vague words, label-then-explain, or a missing concrete noun
   - *"There's a part that's common across these"* → find the backbone
   - *"Do we need to say X and then Y?"* → pick one (usually the more specific wins)
   - *"What about [word choice]?"* → the user is almost certainly right; the current word is vague

6. **Push back when warranted.** If the user asks to add something that doesn't earn its place, say so. The skill serves the goal (signal-to-noise), not the user's momentary instinct to hedge. Offer the reasoning; the user decides.

## Red flags in your own drafts

If you catch yourself writing any of these, stop and reconsider:

- A bullet starting with "The shift:" or "Historically,"
- A bullet that says "X is important because..." (just state X)
- A sub-bullet that repeats its parent in different words
- "The subtle risk," "there's also," "it's worth noting"
- Any adverb ending in -ly (significantly, substantially, virtually, relatively)
- Passive voice hiding who did what ("concerns were raised," "it was decided")
- A vague quantifier (significant, many, most) where a real number could live
- A complexity disguiser (utilize, leverage, robust, seamless) where a simple word would do
- Five bullets where three would do
- An analogy longer than the claim it supports
- A section that's really another section restated
- A section whose *"This section answers..."* question is unclear or identical to another section's
- Forcing a templated doc type into Ask/Why/How or vice versa

## Success criteria

The final outline should pass all of these:

- A reader grasps the full argument (or the shape of the full doc) in under 30 seconds
- Every bullet serves the doc's center of gravity
- No bullet is cuttable without changing the argument
- No word is cuttable without changing the meaning
- Vague filler words are absent
- Variations are collapsed into a backbone where possible
- If the doc type has a prescribed structure, the outline respects it
