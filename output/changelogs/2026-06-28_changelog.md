# Changelog — 2026-06-28

## AUTO APPROVED

- **wiki/brand-voice.md created**: Documented branding color discrepancy. Current site CSS uses orange `#FF6B00`; CLAUDE.md (owner-specified) uses gold `#f5a623`. Gold is authoritative for all new builds. Website CSS (`styles.css`) needs to be updated — flagged as NEEDS SIGNOFF.

## NEEDS SIGNOFF

- [ ] **APPROVE** / [ ] **REJECT**
  Update `styles.css` CSS variable `--color-orange: #FF6B00` → `--color-gold: #f5a623` and all references throughout the site to align with intended brand color.

- [ ] **APPROVE** / [ ] **REJECT**
  Reconcile two contact email addresses found:
  - Contact section in index.html: `trippdigital1@gmail.com`
  - Chatbot system prompt in chat.js: `trippdigital@gmail.com`
  Which is the correct email for customer-facing use?

- [ ] **APPROVE** / [ ] **REJECT**
  Add "How to Build a Local Web Agency" ($47) to the main site product grid in index.html. Currently listed only in chatbot system prompt, not visible to site visitors.

- [ ] **APPROVE** / [ ] **REJECT**
  Add Payhip link for "How to Build a Local Web Agency" ($47) to wiki/offers.md (currently listed as TBD).
