# process

Temporary staging area for files actively being ingested or worked on.

## How it works

1. Copy the raw file here before processing begins.
2. Work from the `/process` copy — never edit files in `/raw` directly.
3. When processing is complete:
   - Processed artifact → `/wiki` (if knowledge) or `/output` (if deliverable)
   - Original → `/raw` (correct subfolder)
   - The `/process` file → **delete it**

## Stalled files

If a file sits in `/process` with no recent activity (check the commit date), it is considered stalled. At the start of a session, Claude should flag any stalled files and ask the owner what to do with them.

## Rules

- This folder should be **empty between sessions** in an ideal workflow.
- Never commit final knowledge or deliverables here — they belong in `/wiki` or `/output`.
- File names should match the original from `/raw`.
