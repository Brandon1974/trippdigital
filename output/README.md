# output

Deliverables, drafts, changelogs, and improvement suggestions generated during working sessions.

## Sub-folder structure

```
output/
├── content/        ← Drafted posts, emails, scripts ready for review
├── changelogs/     ← What changed in the system and why
├── improvements/   ← Suggested improvements to skills, wiki, or structure
└── reports/        ← Weekly reviews, lead gen summaries, campaign reports
```

## content/
Content ready for human review before publishing. Includes Facebook posts, email drafts, video scripts, and ad copy. Files are named `YYYY-MM-DD_platform_topic.md`.

## changelogs/
Log of structural or strategic changes made to the repo or business. Append to `YYYY-MM-DD_changelog.md`. Format:
```
## [Date] — [What changed]
- Changed: ...
- Reason: ...
- Impact: ...
```

## improvements/
Queued improvement suggestions written at the end of sessions. Claude checks this folder at the start of each session. Format: a bullet list of what felt slow, unclear, or missing.

## reports/
Periodic summaries: weekly activity reviews, lead generation reports, campaign performance notes.

## Rules

- Output files are for human review — they are not final until the owner approves.
- Approved content gets moved to the relevant platform and archived or deleted from this folder.
- Never auto-publish from `/output` — always confirm with the owner first.
