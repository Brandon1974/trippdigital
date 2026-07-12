# Tripp Digital — Website & Product Ecosystem

A professional, dark-themed website for Tripp Digital — a Virginia Beach-based digital products agency + web solutions provider.

**Live site:** https://trippdigital.com

---

## 📁 Project Structure

```
trippdigital/
├── index.html                          # Main homepage (hero + nav + all sections)
├── privacy.html                        # Privacy policy
├── terms.html                          # Terms of service
├── success.html                        # Payment success page
├── admin-login.html                    # Admin login interface
├── admin-dashboard.html                # Admin dashboard
│
├── assets/                             # All static assets (organized)
│   ├── images/
│   │   ├── branding/                   # Logos, favicons, OG images
│   │   ├── products/                   # Product screenshots & thumbnails
│   │   ├── books/                      # Book cover images
│   │   └── icons/                      # SVG icons (future use)
│   ├── styles/
│   │   └── styles.css                  # Main stylesheet (all styling)
│   └── scripts/
│       ├── script.js                   # Main frontend functionality
│       └── chatbot.js                  # Chatbot widget logic
│
├── tools/                              # Interactive tools & dashboards
│   ├── invoice-generator.html          # Invoice & Estimate Generator
│   ├── budget-expense-tracker.html
│   ├── lead-crm-tracker.html
│   ├── social-media-dashboard.html
│   ├── client-tracking-dashboard.html
│   ├── kdp-sales-dashboard.html
│   ├── garden-planner.html
│   ├── habit-goal-tracker.html
│   ├── meal-prep-grocery-planner.html
│   ├── daycare-tracker.html
│   ├── pickleball-tracker.html
│   ├── content-calendar.html
│   ├── lead-finder.html
│   ├── stats.html
│   └── tools.html                      # Tools directory/hub
│
├── spec-sites/                         # Client showcase sites (web agency)
│   └── bd-handyman/                    # Example: BD Handyman spec site
│       └── index.html
│
├── data/
│   └── products.json                   # Product catalog (JSON)
│
├── netlify/
│   └── functions/
│       └── create-checkout-session.js  # Stripe checkout serverless function
│
├── netlify.toml                        # Netlify build config
├── package.json                        # Node dependencies
├── .env.example                        # Environment variables template
│
├── CLAUDE.md                           # Internal: Claude Code operating manual
├── ADMIN.md                            # Internal: Admin panel documentation
│
└── [Internal Knowledge System — not deployed]
    ├── raw/                            # Unprocessed input data
    │   ├── sessions/                   # Claude conversation exports
    │   ├── inputs/                     # Voice notes, brain dumps, notes
    │   └── ecosystem/                  # Facebook group posts, transcripts
    ├── wiki/                           # Structured knowledge base
    ├── skills/                         # Reusable task templates
    ├── output/                         # Generated reports & suggestions
    └── process/                        # In-flight work (temporary)
```

---

## 🎨 Design & Branding

- **Theme:** Dark professional (black background #000000)
- **Accent Color:** Orange #FF6B00
- **Fonts:** Bebas Neue (headings) + Inter (body)
- **Layout:** Responsive (mobile-first)
- **Animations:** Smooth transitions, intersection observer animations

### Color Variables (styles.css)

```css
--color-bg: #0a0a0a;
--color-text: #ffffff;
--color-orange: #FF6B00;
--color-border: #1a1a1a;
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env.local
```

Add your Stripe keys:
- `STRIPE_PUBLISHABLE_KEY` (from https://dashboard.stripe.com/)
- `STRIPE_SECRET_KEY`

### 3. Run Locally
```bash
npm run dev
# or
netlify dev
```

Visit `http://localhost:8888`

---

## 🌐 Deployment to Netlify

### Prerequisites
- Netlify account (https://netlify.com)
- GitHub account with this repo

### Steps

1. **Connect Repository**
   - Netlify dashboard → "Add new site" → "Import existing project"
   - Select GitHub and authorize
   - Select this repo

2. **Configure Environment**
   - Dashboard → Site settings → Build & deploy → Environment
   - Add your Stripe keys:
     - `STRIPE_PUBLISHABLE_KEY`
     - `STRIPE_SECRET_KEY`
     - `URL` = https://trippdigital.com

3. **Connect Domain**
   - Dashboard → Domain management → Add custom domain
   - Enter: `trippdigital.com`
   - Update DNS at your registrar OR use Netlify nameservers
   - Wait for DNS to propagate (5 min - 48 hours)

---

## 💳 Stripe Integration

### Payment Flow
1. User clicks "SELECT PLAN" or "BUY NOW"
2. Modal opens with item review
3. Click "Proceed to Payment"
4. Redirected to Stripe Checkout
5. After payment → redirected to `success.html`

### Testing Payments
Use Stripe test mode:
- Test card: `4242 4242 4242 4242`
- Any future expiration date
- Any 3-digit CVC

### Going Live
1. Switch from test keys to live keys in `.env`
2. Update Netlify environment variables with live keys
3. Redeploy

---

## 📝 Content Management

### Update Pricing
Edit `index.html`:
- Service prices (Services section, ~line 169-229)
- Product prices (Products section, ~line 234-650)
- Update data in `data/products.json` if using dynamic products

### Update Products
- Add new product cards in `index.html` Products section
- OR update `data/products.json` and bind with JavaScript (future enhancement)
- Place product images in `assets/images/products/`

### Update Colors
Edit `assets/styles/styles.css`:
```css
--color-orange: #FF6B00;   /* Brand accent */
--color-bg: #0a0a0a;       /* Background */
--color-text: #ffffff;     /* Text */
```

### Update Copy
Edit the relevant HTML section in `index.html`:
- Hero section (line 78-152)
- Services section (line 165-231)
- Products section (line 234-650)
- Books section (line 653-729)
- About/Contact sections (line 783-809)

---

## 🛠️ Customization Tips

### Add a New Tool
1. Create `tools/my-new-tool.html`
2. Use relative paths: `../assets/styles/styles.css`, `../assets/scripts/script.js`
3. Add reference in `tools/tools.html` navigation
4. Link from main `index.html` if needed

### Add a New Service/Product
1. Edit `index.html` Services or Products section
2. Add card HTML with proper classes
3. Update pricing in the card
4. Add image to `assets/images/products/`

### Customize Chatbot
Edit `assets/scripts/chatbot.js`:
- Change bot responses
- Update greeting message
- Modify styling in `styles.css` (`.chatbot-widget` class)

---

## 📊 Analytics & Monitoring

### Netlify Analytics
- Dashboard → Analytics
- See visitor counts, top pages, traffic sources

### Track Page Visits
The site includes a visitor tracking function (see `index.html`, line 942-951):
```javascript
fetch('/.netlify/functions/track-visit', {
  method: 'POST',
  body: JSON.stringify({
    page: window.location.pathname,
    referrer: document.referrer || 'direct'
  })
})
```

Consider adding:
- Google Analytics
- Stripe Analytics dashboard
- Email marketing integration (Mailchimp, ConvertKit, etc.)

---

## 🔒 Security

- ✅ Environment variables stored securely in Netlify
- ✅ Stripe handles all payment security (PCI compliant)
- ✅ No sensitive data in code or git
- ✅ HTTPS enabled by default on Netlify
- ✅ `.env.local` is in `.gitignore` (never committed)

---

## 🐛 Troubleshooting

### Payments not working?
- Verify Stripe keys in `.env.local` and Netlify settings
- Check test vs. live keys match your environment
- Open browser console (F12) and check for errors
- Verify Stripe API is responding: https://status.stripe.com

### Domain not connecting?
- DNS can take up to 48 hours to propagate
- Verify nameservers or A record at your registrar
- In Netlify, check domain shows as "Connected"
- Try https://mxtoolbox.com/mxlookup.aspx to check DNS

### Styles not loading?
- Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Clear browser cache
- Verify `assets/styles/styles.css` path is correct
- Check browser console for 404 errors

### Tools broken after reorganization?
- Verify all `../assets/` relative paths are correct in `/tools/*.html`
- Check that script and style src attributes point to correct locations
- Test in browser console: `fetch('../assets/styles/styles.css')` should return the file

---

## 📚 Internal Documentation

This repo includes internal knowledge management (not deployed):

- **CLAUDE.md** — Claude Code operating manual (business context, rules, workflows)
- **ADMIN.md** — Admin panel documentation
- **raw/** — Original, unprocessed data (sessions, voice notes, ecosystem captures)
- **wiki/** — Structured knowledge base (processed, distilled information)
- **skills/** — Reusable task templates for Claude
- **output/** — Generated reports, suggestions, changelogs
- **process/** — In-flight work (temporary staging)

These folders are excluded from Netlify deployment via `netlify.toml` and `.netlifyignore`.

---

## 📞 Support

- **Netlify Support:** https://support.netlify.com
- **Stripe Support:** https://support.stripe.com
- **HTML/CSS/JS Questions:** See inline comments in code files

---

## 📋 Feature Roadmap

- [ ] Dynamic product catalog from `data/products.json`
- [ ] Advanced analytics dashboard
- [ ] Email newsletter automation
- [ ] Social media feed integration
- [ ] Client testimonial management system
- [ ] Blog / resource center
- [ ] Advanced inventory management for products

---

## 📄 License

All code and design © 2026 Tripp Digital. All rights reserved.

**Built with ❤️ in Virginia Beach**
