# Skill: Sync Claude Sessions

## Purpose
Pull Claude Code session history into `/raw/sessions/`, analyze sessions for lessons learned, skill gaps, and improvement suggestions, then update relevant wiki entries.

---

## Inputs needed
- Session content: either (a) Brandon pastes conversation text, (b) uploads an export file, or (c) points to a local sessions folder path
- Date range to sync (default: all sessions not yet in `/raw/sessions/`)

---

## Steps

### Step 1 — Identify new sessions
Check what already exists in `/raw/sessions/` (look at filenames/dates). Any session not yet saved there is new and needs to be processed.

If Brandon provides a local sessions folder path, list files newer than the most recent file in `/raw/sessions/`.

### Step 2 — Save each session to `/raw/sessions/`
For each new session:
- Filename: `YYYY-MM-DD_topic-or-task.md` (use session date and the primary task discussed)
- Content: full conversation text or export — unmodified
- If a session spans multiple days, use the start date

Save all sessions before proceeding to analysis.

### Step 3 — Analyze each session
For each newly saved session, extract:

**Lessons learned**
- What worked well? (prompts, approaches, techniques)
- What produced bad or slow output?
- Any unexpected insights about the business, audience, or offers?

**Skill gaps**
- Was there a task where no skill file existed or the existing one gave poor guidance?
- Were there repeated clarifying questions Claude had to ask that should be pre-answered in a skill or wiki file?

**Improvement suggestions**
- Anything in `CLAUDE.md`, `/wiki/`, or `/skills/` that should be updated based on what happened in the session?
- New skill files that should exist?

**Decisions made**
- Any strategic or structural decisions Brandon made during the session that should be recorded in the wiki?

### Step 4 — Update wiki entries
For each fact, decision, or update identified in Step 3:
- Apply the same logic as `skills/add-new-resource.md` Steps 5–6
- Reference the session file in the `Source:` front-matter
- Only update wiki entries with confirmed, decided information — not speculation from the session

### Step 5 — Write improvement suggestions
Collect all improvement suggestions from Step 3 into `/output/improvements/YYYY-MM-DD_session-sync-suggestions.md`.

Format:
```markdown
# Session Sync Suggestions — YYYY-MM-DD

## Skill gaps found
- [ ] No skill exists for [task] — suggest creating `skills/[name].md`
- [ ] `skills/[existing].md` gave poor guidance on [specific step]

## Wiki updates needed
- [ ] `wiki/[file].md` is missing [topic] — covered in session YYYY-MM-DD

## CLAUDE.md updates
- [ ] Add rule: [rule text] (reason: [why it came up])

## Other
- [ ] [anything else]
```

### Step 6 — Report back
Tell Brandon:
1. How many sessions were synced and their filenames
2. Which wiki entries were updated
3. Number of improvement suggestions written (and path to the suggestions file)
4. Any high-priority flags (e.g., a decision that contradicts current wiki content)

---

## Output format
```
Synced: 3 sessions
  - raw/sessions/2026-06-25_facebook-post-campaign.md
  - raw/sessions/2026-06-27_pdf-lead-magnet-build.md
  - raw/sessions/2026-06-28_web-agency-pitch-site.md

Wiki updated:
  - wiki/content-strategy.md (Facebook posting cadence added)
  - wiki/offers.md (new PDF price point: $17)

Suggestions written: output/improvements/2026-06-28_session-sync-suggestions.md
  5 items — 2 skill gaps, 2 wiki updates, 1 CLAUDE.md rule

High priority:
  - wiki/offers.md previously listed PDF at $27; session on 2026-06-27 decided $17. Reconciled.
```

---

## Example output
*(Paste a real run here after first use)*
