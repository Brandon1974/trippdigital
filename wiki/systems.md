---
Source: raw/inputs/2026-06-28_tech-stack-audit.md, raw/inputs/2026-06-28_admin-panel-docs.md
Last updated: 2026-06-28
---

# Systems & Tech Stack — Tripp Digital

---

## Main Website

- **URL:** trippdigital.com
- **Repo:** github.com/Brandon1974/trippdigital
- **Hosting:** Netlify
- **Build:** Static HTML/CSS/JS — no framework
- **Fonts:** Bebas Neue (headings) + Inter (body) via Google Fonts
- **Deploy command:** `npm install` (installs deps, Netlify handles the rest)
- **Publish dir:** `./` (root of repo)
- **404 handling:** All 404s redirect to index.html

---

## Netlify Functions (Serverless)

| Function | Purpose |
|---|---|
| `chat.js` | AI chatbot powered by Anthropic Claude API |
| `admin-auth.js` | Admin panel login/session management |
| `admin-products.js` | CRUD for product listings |
| `admin-blog.js` | Blog post management |
| `admin-videos.js` | YouTube/Vimeo video embeds |
| `admin-files.js` | File upload and management |

---

## Payments — Stripe

- Stripe Checkout (redirect-based)
- Required env vars: `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`
- Success page: `/success.html`
- Test card: `4242 4242 4242 4242`

---

## AI Chatbot — Anthropic

- Library: `@anthropic-ai/sdk ^0.24.0`
- Model: `claude-3-5-sonnet-20241022`
- Required env var: `ANTHROPIC_API_KEY`
- Persona: Tripp Digital customer service assistant
- Response style: 2–3 sentences, friendly, professional

---

## Admin Panel

- URL: trippdigital.com/admin-login.html
- Auth: single password via `ADMIN_PASSWORD` env var
- Session: browser localStorage
- Lockout: 5 failed attempts = 15 min lockout
- Data storage: JSON files in `/data/` (NOT in git)
  - `/data/products.json`
  - `/data/blog.json`
  - `/data/videos.json`
  - `/data/files.json`
- Uploads: `/uploads/products/`, `/uploads/blog/`, `/uploads/files/`

---

## Environment Variables (Netlify)

| Var | Purpose |
|---|---|
| `ADMIN_PASSWORD` | Admin panel login |
| `ANTHROPIC_API_KEY` | Claude chatbot |
| `STRIPE_PUBLISHABLE_KEY` | Stripe frontend key |
| `STRIPE_SECRET_KEY` | Stripe backend key |
| `URL` | Site URL (https://trippdigital.com) |

---

## Digital Product Platforms

| Platform | Handle | Use |
|---|---|---|
| Payhip | payhip.com/Tinytripp | Primary storefront |
| Gumroad | buildwithaihq.gumroad.com | Secondary storefront |
| Etsy | Tripp Digital store | Digital downloads |
| Whop | Tripp Digital store | Memberships |

---

## AI / Media Tools

| Tool | Config / ID |
|---|---|
| ElevenLabs Primary Voice | `CwhRBWXzGAHq8TQ4Fs17` |
| ElevenLabs Bella Voice | `EXAVITQu4vr4xnSDxMaL` |
| Higgsfield | Seedance 2.0, 480p fast, 22–23 credits/video |
| Python ReportLab | Used for all PDF builds |
