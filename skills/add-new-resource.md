# Skill: Add New Resource

## Purpose
Take any raw file Brandon provides, save it to the correct `/raw` subfolder with the right naming convention, analyze it, then create or update the relevant wiki entry that references it.

---

## Inputs needed
- The raw file content (pasted, uploaded, or described)
- File type / source (voice note, Facebook post, YouTube transcript, brain dump, product note, lead data, etc.)
- Date (default to today if not provided: `YYYY-MM-DD`)

---

## Steps

### Step 1 — Classify the file
Determine which `/raw` subfolder it belongs in:

| Source type | Target folder |
|---|---|
| Claude Code conversation export, session summary, decision log | `raw/sessions/` |
| Voice note transcript, audio recording, brain dump, meeting notes, quick idea, product sketch | `raw/inputs/` |
| Facebook group post, YouTube transcript, email capture, social content, competitor content | `raw/ecosystem/` |

If ambiguous, ask Brandon one clarifying question before proceeding.

### Step 2 — Name the file
Use the convention: `YYYY-MM-DD_short-kebab-description.ext`

Rules:
- Date first, always
- Lowercase, hyphens only (no spaces, underscores, or camelCase)
- Short description: 2–5 words max, describes the content not the file type
- Preserve original extension if it matters (`.mp3`, `.pdf`, `.txt`); default to `.md` for text

Examples:
- `2026-06-28_voice-note-offer-idea.md`
- `2026-07-01_facebook-ai-tools-post.md`
- `2026-07-03_youtube-transcript-lead-gen.md`
- `2026-07-05_brain-dump-funnel-structure.md`

### Step 3 — Save to `/raw`
Commit the file to the correct subfolder with filename from Step 2. Do not modify the content — save it exactly as received.

### Step 4 — Analyze the content
Read the raw file and extract:
- **Key facts** (names, numbers, decisions, product ideas, pain points)
- **Actionable items** (things Brandon should do or build)
- **Wiki relevance** (which existing wiki entries does this touch, or which new one should it create?)

Produce a brief internal analysis before writing the wiki entry.

### Step 5 — Identify the target wiki entry
Check `/wiki/` for an existing file that covers this topic:
- `wiki/offers.md` — product/pricing/positioning content
- `wiki/audience.md` — ICP, pain points, desires, language patterns
- `wiki/brand-voice.md` — tone, style guidelines
- `wiki/content-strategy.md` — platforms, formats, cadence
- `wiki/systems.md` — tools, automations, workflows
- `wiki/faq.md` — questions and objections
- `wiki/results.md` — wins, testimonials, case study notes

If no suitable file exists, create a new one with an appropriate name.

### Step 6 — Create or update the wiki entry
Add or update content in the target wiki file:
- At the top of the file, maintain a `Source:` front-matter block listing all contributing raw files:
  ```
  ---
  Source: raw/inputs/2026-06-28_voice-note-offer-idea.md
  Last updated: 2026-06-28
  ---
  ```
- If updating an existing file, append or merge the new information — do not overwrite existing content unless it is directly contradicted.
- If contradicted: reconcile, keep the most current version, and log the change to `/output/changelogs/YYYY-MM-DD_changelog.md`.
- Keep wiki language factual, distilled, third-person or system-voice (not raw notes).

### Step 7 — Report back
Tell Brandon:
1. Where the raw file was saved (`raw/[subfolder]/[filename]`)
2. Which wiki entry was created or updated (`wiki/[filename].md`)
3. A 2–3 bullet summary of what was extracted
4. Any actionable items flagged (if any)

---

## Output format
```
Filed: raw/inputs/2026-06-28_voice-note-offer-idea.md
Wiki updated: wiki/offers.md

Extracted:
- New product idea: AI prompts bundle at $27
- Pain point mentioned: people don't know which AI tool to start with
- Suggested CTA tweak: lead with outcome, not feature

Action items:
- [ ] Build AI prompts PDF and list on Payhip
```

---

## Example output
*(Paste a real run here after first use)*
