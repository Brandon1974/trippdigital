# Skill: Improve System

## Purpose
Review everything in `/raw` and `/wiki` that is new since the last run. Categorize every potential improvement into one of three buckets and take the appropriate action for each.

---

## Inputs needed
- Date of last improvement run (check `/output/changelogs/` for the most recent entry; if none exists, treat all files as new)
- No other input required — this skill is self-directed

---

## The Three Buckets

| Bucket | Definition | Action |
|---|---|---|
| **AUTO APPROVE** | Data cleanup, broken links, typos, obvious factual corrections, stale dates, duplicate content | Apply immediately, log to `/output/changelogs/` |
| **NEEDS SIGNOFF** | Skill edits, new skill creation, wiki restructuring, new wiki sections, changes to CLAUDE.md rules, anything that changes how Claude behaves | Write to `/output/review-[date].md` with checkboxes |
| **MORE CONTEXT REQUIRED** | Anything ambiguous, contradictory, or where the right answer depends on Brandon's intent | Write to `/output/review-[date].md` with a clear question |

---

## Steps

### Step 1 — Establish the review window
Find the date of the last improvement run:
- Check `/output/changelogs/` for the most recent file
- Check `/output/review-*.md` files for the most recent date
- Use whichever is most recent as the cutoff
- If no prior run exists, all files in `/raw` and `/wiki` are in scope

Log the review window at the top of the output files: `Reviewing changes since: YYYY-MM-DD`

### Step 2 — Scan `/raw` for new files
List all files in `raw/sessions/`, `raw/inputs/`, and `raw/ecosystem/` added since the cutoff date.

For each new raw file, ask:
- Has this been processed into a wiki entry yet? (check for a `Source:` reference in wiki files)
- If not processed: flag as `NEEDS SIGNOFF` — "Unprocessed raw file: [filename] — should I run `add-new-resource` on this?"

### Step 3 — Scan `/wiki` for issues
For each wiki file, check:

| Issue | Bucket |
|---|---|
| Missing `Source:` front-matter | AUTO APPROVE (add placeholder or infer from content) |
| Outdated `Last updated:` date | AUTO APPROVE (update to today) |
| Broken file references (`raw/[file]` that doesn't exist) | AUTO APPROVE (remove dead reference, log it) |
| Duplicate content across two wiki files | NEEDS SIGNOFF (propose merge) |
| Content that contradicts another wiki file | MORE CONTEXT REQUIRED (show both versions, ask which is current) |
| Section that is completely empty or just a placeholder | NEEDS SIGNOFF (propose filling it or deleting it) |
| New topic in raw files not yet covered by any wiki entry | NEEDS SIGNOFF (propose new wiki file) |

### Step 4 — Scan `/skills` for issues
For each skill file, check:

| Issue | Bucket |
|---|---|
| References a file path that doesn't exist | AUTO APPROVE (update path or note it as TBD) |
| "Example output" section is still empty | NEEDS SIGNOFF (flag as untested) |
| Steps reference a tool or platform no longer in use | NEEDS SIGNOFF (propose update) |
| New repeated task in sessions that has no skill file | NEEDS SIGNOFF (propose new skill) |

### Step 5 — Apply AUTO APPROVE items
For each AUTO APPROVE item:
1. Make the change directly
2. Log it to `/output/changelogs/YYYY-MM-DD_changelog.md` in this format:
```markdown
## AUTO APPROVED — YYYY-MM-DD

- [File]: [What was changed] — Reason: [brief reason]
- [File]: [What was changed] — Reason: [brief reason]
```

### Step 6 — Write the review file for NEEDS SIGNOFF and MORE CONTEXT REQUIRED
Create `/output/review-YYYY-MM-DD.md` with the following structure:

```markdown
# System Review — YYYY-MM-DD
Reviewing changes since: YYYY-MM-DD

---

## NEEDS SIGNOFF

For each item below, check the box to approve, mark REJECT to skip, or mark "Approve — don't ask again" to apply and add a permanent rule.

- [ ] **APPROVE** / [ ] **REJECT** / [ ] **APPROVE — don't ask again**
  `wiki/offers.md` — Missing section for digital product pricing. Propose adding a Pricing table.
  Preview: [show proposed addition]

- [ ] **APPROVE** / [ ] **REJECT** / [ ] **APPROVE — don't ask again**
  `skills/build-pdf.md` — Does not yet exist. Sessions show this task is repeated. Propose creating it.
  Preview: [show proposed skill outline]

---

## MORE CONTEXT REQUIRED

Each item below is ambiguous. Please answer the question so I can proceed.

**Q1:** `wiki/offers.md` says the Payhip PDF price is $27. Session from 2026-06-27 mentions $17. Which is current?
- [ ] $27 (keep wiki as-is)
- [ ] $17 (update wiki)
- [ ] Both — they are different products

**Q2:** [Next question...]
```

### Step 7 — Handle "Approve — don't ask again" items
When Brandon marks an item as "Approve — don't ask again":
1. Apply the change
2. Add a permanent rule to `CLAUDE.md` or the relevant skill file so this is never flagged again
3. Log to `/output/changelogs/`

### Step 8 — Report back
Summarize the run:

```
Improvement run complete — YYYY-MM-DD
Review window: YYYY-MM-DD to YYYY-MM-DD

AUTO APPROVED: [n] items applied
  → Logged to output/changelogs/YYYY-MM-DD_changelog.md

NEEDS SIGNOFF: [n] items
MORE CONTEXT REQUIRED: [n] items
  → Review file: output/review-YYYY-MM-DD.md

Next suggested run: [suggest a date, typically 1 week out or after 5+ new raw files]
```

---

## Output files
- `/output/changelogs/YYYY-MM-DD_changelog.md` — AUTO APPROVE log
- `/output/review-YYYY-MM-DD.md` — NEEDS SIGNOFF + MORE CONTEXT REQUIRED items

---

## Example output
*(Paste a real run here after first use)*
