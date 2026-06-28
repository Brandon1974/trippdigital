# Skill: Sync Facebook Group

## Purpose
Process a raw text dump of posts from the Facebook group "Make Money From Home — Tripp Digital Community" and convert member questions, struggles, and engagement signals into ranked product opportunities. Output lands in `wiki/product-pipeline.md` so it is always current and searchable in future sessions.

---

## Inputs needed
- **Raw post dump** — paste the Facebook group posts directly into the chat. Include post text, commenter replies if available, and any reaction/comment counts.
- **Date** of the dump (used in the filename and changelog entry).

---

## Steps

### Step 1 — Save raw input

Save the pasted content verbatim to:
```
raw/ecosystem/facebook-YYYY-MM-DD.md
```

Front-matter format:
```
# Facebook Group Dump — YYYY-MM-DD
Source: Make Money From Home — Tripp Digital Community
Last updated: YYYY-MM-DD

[raw post content below — do not edit]
```

Do not clean, summarize, or edit the raw content at this stage. Preserve member language exactly — it is the most valuable part.

---

### Step 2 — Analyze

Read all posts and extract signals across four categories:

**Questions** — What are members asking about? Look for:
- Direct questions ("How do I...", "Does anyone know...", "What should I...")
- Implied questions ("I've been trying to figure out...", "I'm confused about...")

**Struggles** — What problems or pain points appear? Look for:
- Frustration phrases ("I can't seem to...", "I keep failing at...", "Nobody tells you...")
- Time/money blocks ("I don't have time", "I can't afford", "I don't know where to start")
- Specific situations (job loss, military spouse, stay-at-home parent, etc.)

**Engagement signals** — Which posts got the most traction? Look for:
- High comment counts
- "Me too" or "same" replies
- Posts where multiple people share the same experience
- Posts Brandon or other admins responded to with long answers

**Member language** — Exact phrases members use naturally:
- How they describe their goal ("make money from home", "side income", "escape my 9-5")
- How they describe their situation ("military spouse", "single mom", "between jobs")
- Words they use instead of industry terms ("checklist" not "template", "guide" not "course")

---

### Step 3 — Extract and bucket

Group findings into three buckets:

**HOT — 3 or more people mentioned it**
This is an immediate product opportunity. Create a product brief for each HOT item.

**WARM — mentioned 1–2 times**
Add to the watch list. Check again next sync to see if it grows.

**INSIGHT — customer language and phrases**
Capture exact quotes or paraphrases to use in product titles, bullet points, and sales copy. These are more valuable than any market research tool.

---

### Step 4 — Write to wiki/product-pipeline.md

Update `wiki/product-pipeline.md` with the following structure. Do not erase previous entries — prepend the new sync at the top.

```markdown
# Product Pipeline
Source: Facebook Group — Make Money From Home — Tripp Digital Community
Last updated: YYYY-MM-DD

---

## Sync: YYYY-MM-DD

### HOT Opportunities

| Rank | Topic | Frequency | Suggested Product Title | Price |
|------|-------|-----------|------------------------|-------|
| 1 | [topic] | [X people / X posts] | [Payhip-ready title] | $X |
| 2 | [topic] | [X people / X posts] | [Payhip-ready title] | $X |

**HOT #1: [Topic]**
- What they're saying: [2-3 direct quotes or paraphrases]
- Why it's a product: [1 sentence]
- Suggested title: "[Title that mirrors their language]"
- Suggested price: $X
- Build with: `skills/build-pdf.md`

**HOT #2: [Topic]**
[same format]

---

### WARM Watch List

- [Topic] — mentioned [X] times — revisit next sync
- [Topic] — mentioned [X] times — revisit next sync

---

### INSIGHT — Customer Language

Use these exact phrases in product titles, Payhip descriptions, and Facebook posts:

- "[exact member phrase]"
- "[exact member phrase]"
- "[exact member phrase]"

**Situations members described:**
- [situation 1]
- [situation 2]

**Words they use (vs. industry terms):**
| They say | We should say |
|----------|---------------|
| [their word] | [use this in copy] |
```

**Pricing guide for suggested products:**
- Checklist / quick-start guide (1–5 pages): $7–$9.99
- Actionable guide (8–15 pages): $9.99–$17
- Deep-dive guide (20–40 pages): $27–$37
- Bundle or system: $37–$47

---

### Step 5 — Log the sync

Append an entry to `output/changelogs/YYYY-MM-DD_changelog.md` (create the file if it doesn't exist for today):

```markdown
## SYNCED — Facebook Group (YYYY-MM-DD)

**Raw file:** `raw/ecosystem/facebook-YYYY-MM-DD.md`  
**Posts analyzed:** [N]  
**HOT opportunities found:** [N]  
**WARM watch list items:** [N]  
**Output:** `wiki/product-pipeline.md` updated  

Top HOT item: [topic] — suggested product: "[title]" at $[price]
```

---

## Report back format

After running, reply with:

```
Facebook sync complete — YYYY-MM-DD

HOT (build now):
1. [Topic] — "[Suggested product title]" — $[price]
2. [Topic] — "[Suggested product title]" — $[price]

WARM (watch):
- [topic]
- [topic]

Top INSIGHT phrase: "[exact member quote]"

Files updated:
- raw/ecosystem/facebook-YYYY-MM-DD.md
- wiki/product-pipeline.md
- output/changelogs/YYYY-MM-DD_changelog.md

Next step: Run skills/build-pdf.md for HOT #1.
```

---

## Notes

- **Never paraphrase member language in the INSIGHT section.** Copy it verbatim. The exact words they use are the copy.
- If a HOT topic already has a product in `wiki/offers.md`, note that in the pipeline entry instead of suggesting a duplicate. Consider a "Part 2" or a bundle.
- Run this skill any time Brandon pastes new group posts — no minimum volume required. Even 5 posts can surface a HOT item.
- If comment counts are not available in the dump, frequency is counted by unique members mentioning the same topic (not total mentions by one person).

---

## Example output
*(Paste a real run here after first use)*
