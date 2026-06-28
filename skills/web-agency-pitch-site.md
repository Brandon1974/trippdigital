# Skill: Web Agency Pitch Site

## Purpose
Take a local business found on Google Maps with no website, build a live HTML spec site in Tripp Digital branding, deploy it to Netlify, and send the owner a pitch with the live URL. The live link is the entire pitch — never contact the business before the site is deployed.

---

## Inputs needed
- **Business name** (exact as shown on Google Maps)
- **Business category** (restaurant, salon, contractor, daycare, etc.)
- **Phone number** (from Google Maps listing)
- **Address** (from Google Maps listing)
- **Services offered** (from Maps listing, Facebook page, Yelp, or Google reviews)
- **Hours** (optional, from listing)
- **Any photos or logo** (optional — use placeholder styling if not available)

If some fields are missing: build the site with what's available and mark placeholders clearly with `<!-- TODO -->` comments so Brandon can fill them in before pitching.

---

## Brand Constants (apply to every spec site)

```css
--bg:       #000000;   /* page background */
--orange:   #FF6B00;   /* accents, buttons, headings */
--white:    #FFFFFF;   /* body text */
--gray:     #AAAAAA;   /* secondary text */
--surface:  #111111;   /* card backgrounds */
```

---

## Steps

### Step 1 — Research the business

Collect everything from public sources (Google Maps, Facebook, Yelp, Google reviews):

| Field | Source |
|---|---|
| Business name | Google Maps |
| Phone | Google Maps |
| Address | Google Maps |
| Hours | Google Maps |
| Services | Maps description + Yelp + Facebook |
| About / story | Facebook "About" section |
| Customer praise | Google review keywords ("fast", "friendly", "affordable", etc.) |

Save this as a quick reference block at the top of the HTML file as a comment before building.

---

### Step 2 — Build the HTML spec site

Create a single file: `process/[business-slug]-spec-site.html`

Use this template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[BUSINESS NAME] — [City, State]</title>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #000000;
      --orange: #FF6B00;
      --white: #FFFFFF;
      --gray: #AAAAAA;
      --surface: #111111;
    }

    body {
      background: var(--bg);
      color: var(--white);
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
    }

    /* NAV */
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      border-bottom: 2px solid var(--orange);
      position: sticky;
      top: 0;
      background: var(--bg);
      z-index: 100;
    }
    .logo {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 1.8rem;
      color: var(--white);
      letter-spacing: 2px;
    }
    .logo span { color: var(--orange); }
    nav a {
      color: var(--white);
      text-decoration: none;
      margin-left: 1.5rem;
      font-weight: 600;
      font-size: 0.9rem;
      letter-spacing: 1px;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    nav a:hover { color: var(--orange); }

    /* HERO */
    .hero {
      min-height: 80vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding: 4rem 2rem;
      max-width: 900px;
      margin: 0 auto;
    }
    .hero-label {
      color: var(--orange);
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }
    .hero h1 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(3rem, 8vw, 6rem);
      line-height: 1;
      letter-spacing: 2px;
      margin-bottom: 1.5rem;
    }
    .hero h1 span { color: var(--orange); }
    .hero p {
      font-size: 1.15rem;
      color: var(--gray);
      max-width: 580px;
      margin-bottom: 2rem;
    }
    .btn {
      display: inline-block;
      background: var(--orange);
      color: var(--white);
      padding: 0.85rem 2rem;
      font-weight: 700;
      font-size: 0.95rem;
      letter-spacing: 1px;
      text-transform: uppercase;
      text-decoration: none;
      border: none;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn:hover { opacity: 0.85; }
    .btn-outline {
      background: transparent;
      border: 2px solid var(--orange);
      color: var(--orange);
      margin-left: 1rem;
    }

    /* SERVICES */
    .section {
      padding: 5rem 2rem;
      max-width: 1100px;
      margin: 0 auto;
    }
    .section-label {
      color: var(--orange);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .section h2 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(2rem, 5vw, 3.5rem);
      letter-spacing: 1px;
      margin-bottom: 3rem;
    }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    .service-card {
      background: var(--surface);
      border: 1px solid #222;
      border-top: 3px solid var(--orange);
      padding: 2rem;
    }
    .service-card h3 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 1.5rem;
      color: var(--orange);
      letter-spacing: 1px;
      margin-bottom: 0.75rem;
    }
    .service-card p { color: var(--gray); font-size: 0.95rem; }

    /* ABOUT */
    .about { background: var(--surface); }
    .about-inner {
      max-width: 800px;
      margin: 0 auto;
      padding: 5rem 2rem;
      text-align: center;
    }
    .about-inner h2 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
      letter-spacing: 1px;
    }
    .about-inner p { color: var(--gray); font-size: 1.05rem; line-height: 1.8; }

    /* CONTACT */
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    .contact-card {
      background: var(--surface);
      padding: 1.5rem;
      border-left: 3px solid var(--orange);
    }
    .contact-card .label {
      color: var(--orange);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .contact-card p { font-size: 1rem; }

    /* FOOTER */
    footer {
      border-top: 1px solid #222;
      padding: 2rem;
      text-align: center;
      color: var(--gray);
      font-size: 0.85rem;
    }
    footer span { color: var(--orange); }

    /* RESPONSIVE */
    @media (max-width: 600px) {
      nav a { display: none; }
      .btn-outline { display: none; }
    }
  </style>
</head>
<body>

  <!-- NAV -->
  <nav>
    <div class="logo">[BUSINESS<span> NAME</span>]</div>
    <div>
      <a href="#services">Services</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </div>
  </nav>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-label">[City, State] — [Category]</div>
    <h1>[BUSINESS <span>NAME</span>]</h1>
    <p>[One sentence describing what this business does and who it serves. Pull from Google Maps description or reviews.]</p>
    <div>
      <a href="#contact" class="btn">Get In Touch →</a>
      <a href="#services" class="btn btn-outline">Our Services</a>
    </div>
  </section>

  <!-- SERVICES -->
  <section id="services" class="section">
    <div class="section-label">What We Do</div>
    <h2>Our Services</h2>
    <div class="services-grid">
      <!-- Repeat for each service (3–6 cards) -->
      <div class="service-card">
        <h3>[Service Name]</h3>
        <p>[One sentence description from their listing or reviews.]</p>
      </div>
      <div class="service-card">
        <h3>[Service Name]</h3>
        <p>[One sentence description.]</p>
      </div>
      <div class="service-card">
        <h3>[Service Name]</h3>
        <p>[One sentence description.]</p>
      </div>
    </div>
  </section>

  <!-- ABOUT -->
  <section id="about" class="about">
    <div class="about-inner">
      <h2>About [Business Name]</h2>
      <p>[2–3 sentences about the business. Pull from their Facebook About section, Google description, or synthesize from reviews. Keep it professional and warm.]</p>
    </div>
  </section>

  <!-- CONTACT -->
  <section id="contact" class="section">
    <div class="section-label">Reach Us</div>
    <h2>Get In Touch</h2>
    <div class="contact-grid">
      <div class="contact-card">
        <div class="label">Phone</div>
        <p><a href="tel:[PHONE]" style="color:var(--white);text-decoration:none">[PHONE]</a></p>
      </div>
      <div class="contact-card">
        <div class="label">Address</div>
        <p>[ADDRESS]</p>
      </div>
      <div class="contact-card">
        <div class="label">Hours</div>
        <p>[HOURS or "Call for hours"]</p>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <p>&copy; 2026 <span>[Business Name]</span>. All rights reserved.</p>
  </footer>

</body>
</html>
```

---

### Step 3 — Fill in all placeholders

Search the HTML for every `[PLACEHOLDER]` and replace with real data. When a field truly isn't available anywhere, use a tasteful generic: "Call for hours", "Serving [City]", etc.

Check:
- [ ] Business name appears in nav logo, hero h1, about section, footer
- [ ] All service cards have real services (not placeholders)
- [ ] Phone number is correct and in the `href="tel:"`
- [ ] Address is complete
- [ ] No `[BRACKETS]` remain in the final HTML

---

### Step 4 — Deploy to Netlify via GitHub

1. Create a new GitHub repo: `brandon1974/[business-slug]-site`
   - Repo name: lowercase, hyphens, e.g. `vb-salon-spec-site`
2. Push the HTML file as `index.html` in the root
3. Connect repo to Netlify:
   - New site → Import from Git → Select repo
   - Build command: *(leave blank)*
   - Publish directory: `.` (root)
   - Deploy
4. Netlify generates a URL like `https://[random-name].netlify.app`
5. Optional: In Netlify site settings → Site name → rename to `[business-slug]` for a cleaner URL

**Live URL format:** `https://[business-slug].netlify.app`

---

### Step 5 — Craft the pitch message

Use this template (adapt to the contact channel — phone script, Facebook DM, Google Business message, or walk-in):

**Facebook DM / Text:**
```
Hey [Name or "there"]! My name is Brandon with Tripp Digital here in Virginia Beach.

I noticed [Business Name] didn’t have a website yet, so I went ahead and built one for you — free of charge — so you could see what it would look like:

🔗 [LIVE NETLIFY URL]

No strings attached — just wanted to show you what’s possible. If you like it and want to keep it live with your own domain, it’s just $97/month, no contracts.

Feel free to check it out and let me know what you think!
```

**Walk-in / Phone:**
```
“Hi, I’m Brandon from Tripp Digital — local web agency here in Virginia Beach. I built a professional website for [Business Name] — no charge to look at it. Here’s the live link: [URL]. Take a look and if you want it kept live with your name on it, it’s $97 a month, cancel any time.”
```

---

### Step 6 — Log the prospect

Add an entry to `raw/inputs/YYYY-MM-DD_agency-prospects.md` (create if it doesn't exist):

```markdown
## [Business Name] — [Date]
- Category: [type]
- Location: [address]
- Phone: [number]
- Spec site: [Netlify URL]
- Status: Pitched / Waiting / Signed / Declined
- Notes: [anything relevant]
```

---

### Step 7 — Report back

```
Spec site built and live: https://[business-slug].netlify.app
Business: [Name] — [Category] — [City]
Pitch ready. Contact via: [Facebook / phone / walk-in]

Prospect logged: raw/inputs/2026-06-28_agency-prospects.md

Next steps:
- Send pitch message
- Follow up in 3 days if no response
- If signed: connect custom domain, set up Stripe recurring $97/month
```

---

## Tips

- **Speed wins.** A spec site that takes 30 minutes and is 90% accurate beats a perfect site that takes 3 hours. The owner will fill in details after they say yes.
- **3 service cards minimum.** Even if the listing only mentions one service, infer adjacent ones from the category (a salon likely does cuts, color, and styling).
- **Pull language from reviews.** If Google reviews say "fastest oil change in Virginia Beach" — put that in the hero. Real customer language always converts better.
- **Don’t add pricing.** Leave prices off the spec site. Price conversation happens after they see it.
- **Primary niche targets:** businesses where Brandon already has products (daycares, caregivers, contractors, small shops). Warm audiences convert faster.

---

## Example output
*(Paste a real run here after first use)*
