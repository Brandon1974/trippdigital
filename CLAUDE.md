# Tripp Digital — Claude Code Operating Manual

This file is the source of truth for how this repository is organized and how Claude should work within it. Read this first in every session. Everything here is permanent operating context — never ask Brandon to re-explain these details.

---

## Business Identity

| Field | Value |
|---|---|
| **Business name** | Tripp Digital |
| **Owner** | Brandon Tripp |
| **Location** | Virginia Beach, VA |
| **Type** | Digital products + web agency |
| **Main site** | trippdigital.com |
| **Deploy** | Netlify, GitHub: `Brandon1974/trippdigital` |
| **Facebook Group** | "Make Money From Home — Tripp Digital Community" |
| **Twitter/X** | @benroyal578 |

**What Tripp Digital does:**
- Sells digital products (PDFs, templates, courses) on Payhip, Gumroad, Etsy, Whop
- Runs a web agency targeting local businesses with no website (Google Maps prospecting → HTML spec site → Netlify deploy → $97/month pitch)
- Builds AI-driven content, slideshows, and lead magnets
- Monetizes the Facebook community for product ideas and direct sales

---

## Branding Rules

- **Background:** Black (`#000000` or near-black)
- **Accent color:** Orange `#FF6B00`
- **Apply to:** All digital products, slideshows, PDFs, web pages, and any visual asset
- **Never** use white backgrounds or default color schemes on Tripp Digital deliverables

---

## Product Platforms

| Platform | URL / Handle | Use |
|---|---|---|
| **Payhip** | payhip.com/Tinytripp | Primary storefront for digital products |
| **Gumroad** | buildwithaihq.gumroad.com | Secondary digital product storefront |
| **Etsy** | (Tripp Digital store) | Digital downloads, printables |
| **Whop** | (Tripp Digital store) | Community/membership products |

**CTA rule:** Every piece of content and every slideshow must include both `payhip.com/Tinytripp` and `trippdigital.com` in the call to action.

---

## Voice & Media

### ElevenLabs
| Voice | ID |
|---|---|
| **Primary voice** | `CwhRBWXzGAHq8TQ4Fs17` |
| **Bella** | `EXAVITQu4vr4xnSDxMaL` |

Default to Primary voice unless a specific request calls for Bella.

### Higgsfield
- **Credit budget:** 22–23 credits per video
- **Model:** Seedance 2.0
- **Mode:** 480p fast mode

---

## Permanent Build Rules

These rules apply in every session without needing to be re-stated.

### BUILD-FIRST RULE
Always attempt to build the thing directly. **Never suggest a third-party service as the first answer.** If a tool, service, or platform is already in the stack (ElevenLabs, Higgsfield, ReportLab, Netlify, etc.), use it. Only mention external alternatives if the in-stack approach is truly impossible.

### SLIDESHOW RULE
- All promotional slideshows use **base64 `atob()` audio decoded via AudioContext / WebAudio API**
- **Never use `fetch()` for audio** in slideshows
- Animation style: Ken Burns zoom, fly-in animations, keyword pulse effects
- Black background, orange `#FF6B00` accents
- CTA always includes `payhip.com/Tinytripp` and `trippdigital.com`

### PDF RULE
- All PDFs are built with **Python ReportLab**
- Black background, orange `#FF6B00` branding throughout
- No exceptions — do not suggest Canva, Google Docs, or other tools for PDFs

### PINTEREST RULE
- Any trending Pinterest topic = immediately build a PDF digital product and list it on Payhip
- Treat trending Pinterest content as a direct product signal, not just content inspiration
- Speed matters: identify trend → build PDF → upload to Payhip in the same session if possible

### WEB AGENCY WORKFLOW
1. Find Google Maps businesses with **no website**
2. Build an HTML spec site (black/orange branding, professional)
3. Deploy live to **Netlify**
4. Send the live link as the sales pitch
5. Charge **$97/month recurring**
6. Never pitch before the site is live — the live link is the pitch

### SPEC SITE PHOTO RULE
- **Always include the client's real work photos in the spec site** — photos are what sell the site when the prospect sees their own work on a professional page
- When Brandon sends photos along with a spec site request, upload them to the GitHub repo and embed them as a dedicated photo gallery or work portfolio section
- A spec site without work photos is incomplete — never launch without them if photos were provided

### FACEBOOK GROUP RULE
- Monitor "Make Money From Home — Tripp Digital Community" for:
  - Product ideas (what members ask about or struggle with)
  - Sales opportunities (direct pitches when appropriate)
  - Content angles (what gets engagement = what to build next)
- Posts in the group should drive to Payhip and/or the email list

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
- `skills/build-pdf.md` — how to build a black/orange PDF with ReportLab
- `skills/build-slideshow.md` — how to build a promotional slideshow (WebAudio rules)
- `skills/web-agency-prospect.md` — Google Maps prospecting to Netlify pitch workflow

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
1. Read `CLAUDE.md` (this file) — all context is here, ask no clarifying questions about permanent rules.
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

### When building anything
- Apply the BUILD-FIRST RULE: attempt it directly with tools already in the stack.
- Apply branding: black background, orange `#FF6B00` accents.
- Apply the relevant build rule (Slideshow Rule, PDF Rule, etc.) without being asked.

---

## Self-Improvement Protocol

At the end of any significant work session:
1. Write a brief note to `/output/improvements/YYYY-MM-DD_suggestions.md` listing anything that felt slow, unclear, or missing.
2. If a wiki entry is outdated, update it immediately rather than flagging it.
3. If a skill file broke or produced poor output, revise it before closing the session.

The system improves every time it is used. The goal is that each session leaves the repo slightly more useful than when it started.

---

*Last updated: 2026-06-28*
