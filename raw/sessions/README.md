# raw/sessions

Stores exported Claude Code conversation histories, session summaries, and decision logs.

## What belongs here

- Full conversation exports from Claude Code sessions
- Session summary notes written at the end of a working session
- Decision logs explaining why a structural or strategic choice was made
- Any auto-generated session output from Claude Code hooks

## Naming convention

```
YYYY-MM-DD_topic-or-task.md
```

Examples:
- `2026-06-28_wiki-setup-session.md`
- `2026-07-01_lead-gen-strategy-decision.md`

## Rules

- Files here are **read-only** after being saved — do not edit originals.
- To extract knowledge from a session, process it via `/skills/process-session.md` and output to `/wiki`.
