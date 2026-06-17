# Tripp Digital - Professional Website

A modern, dark-theme professional website for Tripp Digital, a Virginia Beach-based web agency specializing in affordable websites and digital products.

## 🎨 Design Features

- **Dark Professional Theme** — Black background with orange #FF6B00 accents
- **Bebas Neue + Inter Fonts** — Bold, modern typography
- **Fully Responsive** — Mobile-first design that works on all devices
- **Stripe Integration** — Seamless payment processing for services and products
- **Smooth Animations** — Professional micro-interactions and transitions

## 📁 Project Structure

```
trippdigital-website/
├── index.html                          # Main homepage
├── success.html                        # Payment success page
├── styles.css                          # All styling
├── script.js                           # Frontend functionality
├── package.json                        # Dependencies
├── netlify.toml                        # Netlify configuration
├── .env.example                        # Environment variables template
├── netlify/
│   └── functions/
│       └── create-checkout-session.js  # Stripe checkout serverless function
└── README.md                           # This file
```

## 🚀 Quick Start

### 1. **Clone or Download**
```bash
cd trippdigital-website
npm install
```

### 2. **Set Up Environment Variables**
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Add your Stripe keys to `.env.local`:
- Get your Stripe keys from https://dashboard.stripe.com/
- Replace `pk_live_YOUR_STRIPE_PUBLISHABLE_KEY` with your publishable key
- Replace `sk_live_YOUR_STRIPE_SECRET_KEY` with your secret key

### 3. **Run Locally**
```bash
npm run dev
# or
netlify dev
```

Visit `http://localhost:8888` in your browser.

## 🌐 Deployment to Netlify

### Step 1: Create a Netlify Account
1. Go to https://netlify.com
2. Sign up with GitHub, GitLab, or your email

### Step 2: Connect Your Repository
1. Click "Add new site" → "Import an existing project"
2. Select your Git provider (GitHub, GitLab, Bitbucket)
3. Authorize Netlify
4. Select the repository
5. Click "Deploy"

### Step 3: Configure Environment Variables
1. In Netlify dashboard: Go to **Site settings** → **Build & deploy** → **Environment**
2. Add your environment variables:
   - `STRIPE_PUBLISHABLE_KEY` = your public key
   - `STRIPE_SECRET_KEY` = your secret key
   - `URL` = https://trippdigital.com

### Step 4: Connect Your Domain
1. In Netlify dashboard: Go to **Domain management**
2. Click "Add custom domain"
3. Enter: `trippdigital.com`
4. Follow the DNS setup instructions:
   - For domain registrar (GoDaddy, Namecheap, etc.):
     - Go to your DNS settings
     - Update nameservers to Netlify's nameservers, OR
     - Add the A record that Netlify provides
5. Wait for DNS to propagate (5 minutes to 48 hours)

## 💳 Stripe Integration

### Before Going Live:
1. Create a Stripe account: https://stripe.com
2. Test with test keys first:
   - `pk_test_...` (publishable)
   - `sk_test_...` (secret)
3. Once tested, switch to live keys for production

### How Payments Work:
1. User clicks "SELECT PLAN" or "ADD TO CART"
2. They review items in the modal
3. Click "Proceed to Payment"
4. Redirected to Stripe Checkout
5. After payment, redirected to `success.html`

### Testing Payments:
Use Stripe test card: `4242 4242 4242 4242`
- Any future expiration date
- Any 3-digit CVC

## 📝 Customization

### Update Pricing
Edit `index.html` and update:
- Service prices in the Services section
- Product prices in the Products grid
- Line item prices in the checkout function

### Update Colors
Edit `styles.css` and modify:
- `--color-orange: #FF6B00` (change to your brand color)
- `--color-bg: #0a0a0a` (background)
- `--color-text: #ffffff` (text)

### Update Content
Edit `index.html` to update:
- Business name, email, location
- Service descriptions and features
- Product names and descriptions
- Book titles
- Social media links

## 📱 Mobile Responsive

The site automatically adapts to:
- Desktop (1400px+)
- Tablet (1024px)
- Mobile (768px and below)

All layouts are tested and optimized for touch.

## 🔒 Security

- Environment variables stored securely in Netlify
- Stripe handles all payment security
- No sensitive data stored in code
- HTTPS enabled by default on Netlify

## 📊 Analytics

Netlify provides free analytics. To view:
1. Dashboard → **Analytics**
2. See visitor data, traffic sources, top pages

Consider adding:
- Google Analytics
- Stripe Analytics
- Email marketing integration

## 🛠️ Troubleshooting

### Payments not working?
- Check Stripe keys in `.env.local` and Netlify settings
- Verify test vs. live keys match
- Check browser console for errors (F12)

### Domain not connecting?
- Wait for DNS propagation (can take up to 48 hours)
- Verify nameservers or A record in your domain registrar
- In Netlify, verify domain shows as connected

### Styles not loading?
- Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Clear browser cache
- Check that `styles.css` is in the same folder as `index.html`

## 📧 Support

For Netlify support: https://support.netlify.com
For Stripe support: https://support.stripe.com

---

**Built with ❤️ for Tripp Digital**
