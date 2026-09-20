# Session note: privacy policy audit for Pinterest app approval

**Source:** Brandon's request to verify trippdigital.com has a live, discoverable privacy policy.

## What was found
- `privacy.html` and `terms.html` already existed and were reasonably complete.
- The homepage footer (the actual entry point visitors and reviewers would use) linked to `/privacy` and `/terms` with no extension. Netlify's deploy report confirms **no redirect rules are configured** for this site, so those clean-URL links 404 in production even though the underlying `.html` files work fine. `privacy.html`/`terms.html` themselves correctly link to each other with `.html` extensions — only the homepage footer had the broken form.
- The privacy policy didn't mention the AI chat widget, which sends visitor messages to Anthropic's Claude API and logs transcripts (visible in `netlify/functions/chat.js`). Added disclosure for that.

## Fix applied
- `index.html` footer: `/privacy` → `/privacy.html`, `/terms` → `/terms.html`.
- `privacy.html`: added an "AI Chat Assistant" section and listed Anthropic in third-party services; bumped last-updated date.
- Pushed to `claude/trippdigital-privacy-policy-t0x7jf`. Not merged to `main` — Brandon needs to merge for this to go live on trippdigital.com before submitting the URL to Pinterest.

## Suggestion for the system
- This site has several extension-less internal links (`/privacy`, `/terms` were the ones found) resting on an unverified assumption about Netlify's pretty-URL behavior. Worth a quick pass to check for any other bare-path links (`/success`, `/tools`, etc.) across the HTML files, or adding explicit `_redirects` rules as a safety net, so a future page doesn't silently 404 the same way.
- No wiki entry exists yet for legal/compliance pages (privacy, terms, Pinterest app requirements). Could add `wiki/systems.md` note once Pinterest approval is confirmed, so future sessions know the privacy policy is a load-bearing file, not just boilerplate.
