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

## STILL NEEDS SIGNOFF

- [ ] **APPROVE** / [ ] **REJECT**
  Reconcile two contact email addresses found:
  - Contact section in index.html: `trippdigital1@gmail.com`
  - Chatbot system prompt in chat.js: `trippdigital@gmail.com`
  Which is the correct email for customer-facing use?

- [ ] **APPROVE** / [ ] **REJECT**
  Add "How to Build a Local Web Agency" ($47) to the main site product grid in index.html. Currently listed only in chatbot system prompt, not visible to site visitors.

- [ ] **APPROVE** / [ ] **REJECT**
  Add Payhip link for "How to Build a Local Web Agency" ($47) to wiki/offers.md (currently listed as TBD).
