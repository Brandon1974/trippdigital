# Changelog — 2026-06-28

---

## RESOLVED — Brand color corrected across all files

**What changed:** All references to `#f5a623` (gold) and "gold" branding replaced with `#FF6B00` (orange) across 6 files.

**Files updated:**
- `CLAUDE.md` — Branding Rules, SLIDESHOW RULE, PDF RULE, WEB AGENCY WORKFLOW, "When building anything", skills list example
- `wiki/brand-voice.md` — Color palette corrected; discrepancy warning removed; logo accent updated
- `wiki/web-agency-workflow.md` — Spec site branding instruction updated
- `wiki/content-strategy.md` — ReportLab branding description updated
- `wiki/master-index.md` — brand-voice.md description updated
- `raw/inputs/2026-06-28_tech-stack-audit.md` — Branding note updated to confirmed/resolved

**Reason:** `#FF6B00` is the official Tripp Digital brand color, matching the existing website CSS (`styles.css`). The earlier `#f5a623` (gold) value was incorrect and introduced during initial CLAUDE.md setup.

---

## RESOLVED — Contact email standardized to trippdigital1@gmail.com

**What changed:** Two different contact emails were found during bulk ingest. `trippdigital@gmail.com` (incorrect) has been replaced with `trippdigital1@gmail.com` (official) in all affected files.

**Files updated:**
- `netlify/functions/chat.js` — Both occurrences in system prompt updated
- `wiki/systems.md` — New Contact section added, confirming single authoritative email

**Reason:** `trippdigital1@gmail.com` is the address shown in the site's contact section (index.html), which is the authoritative customer-facing source.

---

## STILL NEEDS SIGNOFF

- [ ] **APPROVE** / [ ] **REJECT**
  Add "How to Build a Local Web Agency" ($47) to the main site product grid in index.html. Currently listed only in chatbot system prompt, not visible to site visitors.

- [ ] **APPROVE** / [ ] **REJECT**
  Add Payhip link for "How to Build a Local Web Agency" ($47) to wiki/offers.md (currently listed as TBD).
