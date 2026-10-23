---
Source: raw/ecosystem/2026-10-23_youtube-claude-duet-review.md
Last updated: 2026-10-23
---

# AI Tools Landscape — Tripp Digital

Distilled notes on AI assistants and tools that affect how Tripp Digital runs or what it sells. Claims here come from third-party reviews unless marked confirmed — verify before putting them in a product.

---

## Claude Duet (Anthropic) — personal AI assistant

**Status (Oct 2026):** Waitlist rollout, US-only. Reviewed hands-on in a YouTube video (source above); not yet tested by Tripp Digital.

| Feature | What it does | Tripp Digital relevance |
|---|---|---|
| **Account-wide context** | Reads files, mail, calendar, team chat. Pulls context from past Claude Code, Claude chat and Cowork sessions | Every session in this repo (wiki, skills, outputs) becomes context Duet can use from a phone |
| **Voice mode** | Low-latency spoken conversation (e.g. "what's on my calendar?") | Hands-free business check-ins on the go |
| **Channels** | Slack-like topic spaces, each with its own messages, tasks and files | Natural map: `#web-agency`, `#payhip-products`, `#fb-group`, `#pinterest-trends` |
| **Tasks** | Active / Up Next / Ready for review queue — includes tasks it adds itself (e.g. flags an important email for tomorrow) | Overlaps with the scheduled routines in CLAUDE.md (Pinterest check, Netlify monitor) |
| **Make** | Gallery of every artifact: dashboards, presentations, PDFs, CSVs, docs — including ones made earlier in Claude Code | All spec sites, dashboards and PDFs in one place |
| **Payments** | Payment methods can be added; can't make payments yet | — |
| **Connectors** | Uses the same connectors as the Claude account; can't add new ones inside Duet itself | Set connectors up once on desktop, use them from Duet |

**Weak spots named by the reviewer:** Channels feel less clean than multi-agent setups (the reviewer compared it with "Grockbot", which runs separate agents that talk to each other). Phone-only so far, no desktop test.

---

## Workaround: apps with no native Claude connector

Pattern shown: the app (Drip email marketing) had no Claude connector → **Zapier MCP** server (claims 9,000+ apps) → connected to Claude Code → Duet could pull campaign stats and build a dashboard (open rate, CTR, unsubscribe, delivery, drop-off).

**Apply to Tripp Digital:**
- **Connectors this account already has:** Gmail, Google Drive, Canva, ElevenLabs, Higgsfield, Netlify, GitHub, Hugging Face
- **Gaps:** Payhip, Gumroad, Etsy, Whop, Facebook Groups. These are the sales and community data sources. Next step: check whether each has a Zapier app. If so, a Zapier MCP bridge would allow a single "sales dashboard" across all storefronts.
- BUILD-FIRST note: Zapier is a bridge for data access only. Keep building dashboards and products in-stack (HTML on Netlify, ReportLab PDFs).

---

## Product & content signals

1. **PDF product — "Claude Duet Starter Guide for Side Hustlers"**: what it is, channel setup for a home business, 10 voice prompts, how to connect apps that have no connector. Waitlist + US-only = high curiosity and little beginner content yet. Build with ReportLab → Payhip.
2. **Mini-app — "AI Assistant Channel Planner"**: an HTML tool where users pick their business type and get a suggested channel/task layout. Fits the existing `*-demo.html` tool catalog.
3. **FB group post angle**: "Anthropic just launched a personal AI assistant. Here's how I'd set it up to run a side hustle from my phone." CTA → payhip.com/Tinytripp + trippdigital.com.
4. **Short-form video**: phone-screen demo of "ask Duet how my store did this week → it builds a dashboard". Higgsfield Seedance 2.0, 480p fast mode, 22–23 credits.
