# Tripp Digital — Claude Code Operating Manual

This file is the source of truth for how this repository is organized and how Claude should work within it. Read this first in every session.

---

## Business Context

**Tripp Digital** is a digital marketing and AI consulting business. This repository is the operational brain — it stores raw inputs, structured knowledge, reusable skills, and output artifacts. The goal is a self-improving system: raw content flows in, gets processed into structured knowledge, and that knowledge feeds better outputs over time.

---

## Folder Structure

```
/
├── CLAUDE.md            ← You are here. Master operating manual.
├── raw/                 ← Unprocessed input data (never edit these files)
│   ├── sessions/        ← Claude Code conversation exports & summaries
│   ├── inputs/          ← Voice notes, recordings, brain dumps, scratch ideas
│   └── ecosystem/       ← Facebook group posts, YouTube transcripts, email captures
├── wiki/                ← Processed, structured knowledge (the "source of truth" layer)
├── skills/              ← Reusable skill files Claude can execute on demand
├── output/              ← Review files, changelogs, improvement suggestions
└── process/             ← Files currently being ingested / in-flight work
```

---

## Folder Definitions

### `/raw` — Raw Input Vault
Never-edited originals. Treat everything here as immutable once stored. Sub-folders:

| Folder | What goes here |
|---|---|
| `raw/sessions/` | Exported Claude Code conversation histories, session summaries, decision logs |
| `raw/inputs/` | Voice note transcripts, recordings, brain dumps, meeting notes, quick ideas |
| `raw/ecosystem/` | Facebook group posts (scraped or copied), YouTube video transcripts, email list captures, social content |

**Naming convention:** `YYYY-MM-DD_short-description.md` (or original file extension)

---

### `/wiki` — Structured Knowledge Base
Processed, distilled versions of raw files. Every wiki entry should reference its source file(s) in `raw/`. This is the layer Claude reads when answering questions about the business.

Example files:
- `wiki/offers.md` — current products, pricing, positioning
- `wiki/audience.md` — ICP, pain points, language patterns
- `wiki/content-strategy.md` — platforms, formats, cadence
- `wiki/brand-voice.md` — tone, style, phrases to use/avoid
- `wiki/systems.md` — tools, automations, workflows in use

**Rule:** When a raw file is fully processed into the wiki, add a front-matter note at the top of the wiki file listing source paths.

---

### `/skills` — Reusable Claude Skills
Markdown files that define repeatable tasks Claude can execute. Each skill file contains:
1. A clear **task description**
2. **Inputs** it needs
3. **Step-by-step instructions** Claude follows
4. **Output format** expected

Example skills:
- `skills/process-voice-note.md` — how to transcribe and file a voice note
- `skills/write-fb-post.md` — how to draft a Facebook group post from a topic
- `skills/generate-lead-magnet.md` — steps to create a lead magnet from a wiki topic
- `skills/weekly-review.md` — how to produce the weekly output review

---

### `/output` — Deliverables & Review Artifacts
Files generated for review, delivery, or tracking. Organized by type:

| Sub-pattern | Content |
|---|---|
| `output/content/` | Drafted posts, emails, scripts ready for review |
| `output/changelogs/` | What changed in the system and why |
| `output/improvements/` | Suggested improvements to skills, wiki, or structure |
| `output/reports/` | Weekly reviews, lead gen summaries, campaign reports |

---

### `/process` — In-Flight Work
Temporary staging area. Files land here while being actively ingested or worked on. Once processing is complete:
- Processed artifact → `/wiki` or `/output`
- Original → `/raw` (appropriate subfolder)
- `/process` file → deleted

If a file sits in `/process` with no recent activity, treat it as stalled and flag it.

---

## How Claude Should Work in This Repo

### Starting a session
1. Read `CLAUDE.md` (this file).
2. Check `/process` for any stalled in-flight work.
3. Check `/output/improvements/` for queued suggestions.
4. Ask the user what they want to work on.

### When receiving new raw content
1. Save the original to the correct `/raw` subfolder with a dated filename.
2. Move a working copy to `/process`.
3. Process it per the relevant skill in `/skills`.
4. Output the result to `/wiki` (if it's knowledge) or `/output` (if it's a deliverable).
5. Delete the `/process` copy.

### When updating wiki entries
- Always add/update the `Source:` front-matter line.
- Keep wiki entries factual and distilled — no raw stream-of-consciousness.
- If a wiki entry contradicts an older entry, reconcile and note the change in `/output/changelogs/`.

### When creating skills
- Skills must be self-contained: someone reading only that file should be able to execute the task.
- Test a skill by running it once and saving the example output as a comment at the bottom of the skill file.

---

## Self-Improvement Protocol

At the end of any significant work session:
1. Write a brief note to `/output/improvements/YYYY-MM-DD_suggestions.md` listing anything that felt slow, unclear, or missing.
2. If a wiki entry is outdated, update it immediately rather than flagging it.
3. If a skill file broke or produced poor output, revise it before closing the session.

The system improves every time it is used. The goal is that each session leaves the repo slightly more useful than when it started.

---

## Key Contacts & Context

- **Owner:** Brandon (Tripp Digital)
- **Primary platforms:** Facebook Groups, YouTube, Email
- **Core offer:** AI + digital marketing consulting/training
- **Repository:** `brandon1974/trippdigital`
- **Deploy:** Netlify (see `netlify.toml`)

---

*Last updated: 2026-06-28*
