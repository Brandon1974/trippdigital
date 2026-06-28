# skills

Reusable skill files that Claude can execute on demand. Each file defines a repeatable task with clear inputs, steps, and expected output.

## What belongs here

- Step-by-step task definitions Claude follows
- Prompt templates for recurring content types
- Processing workflows for raw inputs
- Review and quality-check routines

## Skill file format

Every skill file should follow this structure:

```markdown
# Skill: [Name]

## Purpose
One sentence describing what this skill does.

## Inputs needed
- Input 1
- Input 2

## Steps
1. Step one
2. Step two
3. ...

## Output format
Description of what the finished output looks like and where it gets saved.

## Example output
(Paste a real example here after the skill has been run once)
```

## Suggested skills to create

| File | Task |
|---|---|
| `skills/process-voice-note.md` | Transcribe and file a voice note into the wiki |
| `skills/process-session.md` | Summarize a Claude Code session and extract wiki updates |
| `skills/write-fb-post.md` | Draft a Facebook group post from a topic or brain dump |
| `skills/write-email.md` | Draft a marketing email from an offer or topic |
| `skills/generate-lead-magnet.md` | Create a lead magnet outline from a wiki topic |
| `skills/weekly-review.md` | Produce the weekly output review and improvement suggestions |
| `skills/process-yt-transcript.md` | Extract key insights from a YouTube transcript into the wiki |

## Rules

- Skills must be self-contained — reading only the skill file should be enough to execute the task.
- After running a skill for the first time, paste a real example output at the bottom.
- If a skill produces poor results, revise it before the next use and note what changed.
