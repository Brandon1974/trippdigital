---
Source: CLAUDE.md (owner instructions), raw/inputs/2026-06-28_tech-stack-audit.md
Last updated: 2026-06-28
---

# Web Agency Workflow — Tripp Digital

---

## The Core Model

**Find businesses with no website → build spec site → deploy live → send link → charge $97/month**

The live link IS the pitch. Never pitch before the site is built and deployed.

---

## Step-by-Step Workflow

### Step 1: Prospect
- Search Google Maps for local business categories (restaurants, salons, contractors, daycares, etc.)
- Filter for businesses with no website listed (or a broken/outdated one)
- Record: business name, phone, address, category, Google Maps link
- Virginia Beach is primary territory but not exclusive

### Step 2: Build the Spec Site
- Build in pure HTML/CSS/JavaScript
- Apply Tripp Digital branding: black background, orange `#FF6B00` accents
- Include: business name, services, contact info, location, call to action
- Source business info from Google Maps listing, Facebook page, Yelp, etc.
- Keep it clean and professional — 1 to 3 pages is fine for a spec

### Step 3: Deploy to Netlify
- Push to GitHub (new repo per client, or subfolder)
- Connect to Netlify → auto-deploys
- Get a live Netlify URL (e.g., `businessname.netlify.app`)
- Optional: set up custom subdomain if available

### Step 4: Send the Pitch
- Contact via phone, Facebook message, Google Business message, or walk-in
- Lead with the live link: "I built you a professional website — here's the live preview: [URL]"
- Do NOT mention price first — let them see it and ask

### Step 5: Close
- Pitch: $97/month recurring, no long-term contract, they can cancel anytime
- Upgrades available: $197 (Business) or $297 (Premium) for more pages/features
- Connect their custom domain once they say yes
- Collect payment via Stripe

---

## Service Tiers

| Tier | Monthly | What's Included |
|---|---|---|
| Starter | $97 | Up to 5 pages, basic SEO, contact form, email support |
| Business | $197 | Up to 15 pages, full SEO, blog, payment integration, phone support |
| Premium | $297 | Unlimited pages, advanced SEO, e-commerce, custom integrations, priority support |

---

## Tech Stack for Client Sites

- Same stack as main site: HTML/CSS/JS + Netlify
- Reuse Tripp Digital component patterns
- Stripe for payment processing if needed
- Anthropic chatbot if client wants one

---

## Notes

- Build fast — speed is the competitive advantage
- One live demo is worth more than any sales pitch
- Target niches where Brandon already has products: daycares, small service businesses
