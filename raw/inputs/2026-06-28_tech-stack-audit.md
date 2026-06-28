# Source: package.json, netlify.toml, .env.example, README.md
Date: 2026-06-28
Extracted from: /home/user/trippdigital/

---

## Tech Stack

### Frontend
- Pure HTML/CSS/JavaScript (no framework)
- Fonts: Bebas Neue (headings) + Inter (body)
- Responsive, mobile-first

### Backend / Functions
- Netlify Functions (serverless, Node.js)
- Functions: admin-auth, admin-products, admin-blog, admin-videos, admin-files, chat

### Payments
- Stripe (checkout sessions via Netlify function)
- Products purchased via Stripe redirect; success page: success.html
- Env vars needed: STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY

### AI / Chatbot
- Anthropic Claude API (@anthropic-ai/sdk ^0.24.0)
- Model: claude-3-5-sonnet-20241022
- Env var: ANTHROPIC_API_KEY

### Hosting
- Netlify
- Publish dir: ./ (root)
- Build command: npm install
- Custom domain: trippdigital.com
- 404 redirect → index.html (SPA-style)

### Admin Panel
- Password-protected at /admin-login.html
- Auth via ADMIN_PASSWORD env var
- Sessions via browser localStorage
- 5 failed attempts = 15 min lockout
- Data stored in JSON files: /data/products.json, /data/blog.json, /data/videos.json, /data/files.json
- Uploads stored in /uploads/products/, /uploads/blog/, /uploads/files/

### Dependencies
- stripe ^12.0.0
- @anthropic-ai/sdk ^0.24.0
- netlify-cli ^16.0.0 (dev)

## Branding Note (DISCREPANCY)
README.md references: orange #FF6B00 accent
CLAUDE.md (user-specified): gold #f5a623
Resolution needed — see output/changelogs/2026-06-28_changelog.md
