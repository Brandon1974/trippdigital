# Remotion Promo Video Generator — Quick Start

## 🎬 Generate Your First Video (5 Minutes)

### Step 1: Open the Config File
```bash
# On your computer, open:
# /home/user/trippdigital/remotion-promos/src/index.tsx
```

### Step 2: Edit Product Info
Find this section and update it:

```typescript
const PICKLEBALL_CONFIG = {
  productName: 'Your Product Name',
  headline: 'Your Catchy Hook (6-8 words)',
  features: [
    'Feature 1 here',
    'Feature 2 here',
    'Feature 3 here',
  ],
  price: 29,  // Your price
  screenshotPath: './public/your-screenshot.jpg',
};
```

### Step 3: Add Product Screenshot
1. Take/find a screenshot of your product (500x300px or larger)
2. Save it to: `remotion-promos/public/my-product.jpg`
3. Update `screenshotPath` to match the filename

### Step 4: Preview (Optional)
```bash
cd remotion-promos
npm start
```
Opens at `http://localhost:3000` to see your video before rendering

### Step 5: Render
```bash
npm run render
```

**Done!** Your video is in `output/PromoVideo.mp4` 🎉

---

## 📺 Upload to Social Media

### TikTok
- Format: ✅ Perfect (1080x1920 vertical)
- Upload: Direct MP4 file
- Sound: Optional (video has no audio)

### Instagram Reels
- Format: ✅ Perfect (1080x1920 vertical)
- Upload: Direct MP4 file
- Tip: Add trending audio in Instagram

### YouTube Shorts
- Format: ✅ Perfect (1080x1920 vertical)
- Upload: Direct MP4 file
- Min length: 15 sec, Max: 60 sec (your video: 25 sec)

### Facebook
- Format: ✅ Works (will appear in feed as vertical video)
- Upload: Direct MP4 file
- Tip: Add captions for viewers without sound

---

## 🎯 What You Get

✅ Professional animated intro with your headline  
✅ Product screenshot with cinematic zoom  
✅ 3 feature bullets that animate in sequence  
✅ Pricing card with pulsing price  
✅ Glowing CTA button  
✅ Tripp Digital branding (orange & black)  
✅ 25-second video (optimal for social)  
✅ 1080x1920 vertical format (mobile-first)  

---

## 📁 Example Files

### Pickleball Tracker
```javascript
{
  productName: 'Pickleball Score & Stats Tracker',
  headline: 'Track Scores & Master Your Game',
  features: [
    'Real-time scoring',
    'Player analytics',
    'Share results instantly',
  ],
  price: 12,
  screenshotPath: './public/pickleball-placeholder.jpg',
}
```

### Lead Tracker
```javascript
{
  productName: 'Lead & CRM Tracker',
  headline: 'Never Lose a Lead Again',
  features: [
    'Track leads to close',
    'Follow-up reminders',
    'Analytics included',
  ],
  price: 29,
  screenshotPath: './public/lead-tracker.jpg',
}
```

### Budget Tracker
```javascript
{
  productName: 'Budget Expense Tracker',
  headline: 'Control Your Money',
  features: [
    'Expense tracking',
    'Budget goals',
    'Spending reports',
  ],
  price: 15,
  screenshotPath: './public/budget-tracker.jpg',
}
```

---

## 🔧 Customization

### Change Video Length
Edit `src/lib/branding.ts`:
```typescript
durationInSeconds: 30,  // Change from 25 to 30, etc.
```

### Change Colors
Edit `src/lib/branding.ts`:
```typescript
colors: {
  black: '#0D0D0D',      // Background
  orange: '#FF6B00',     // Accent
  // Change these to your colors
}
```

### Change Fonts
Edit `src/lib/branding.ts`:
```typescript
fonts: {
  heading: 'Bebas Neue',  // Headlines
  body: 'Inter',          // Body text
}
```

---

## 💡 Pro Tips

1. **Screenshot Quality** - Use high-res screenshots (at least 500x300px)
2. **Headline Length** - Keep to 6-8 words for impact
3. **Features** - Use clear, benefit-focused language
4. **Price Point** - Round numbers work better ($9, $25, $49)
5. **Test First** - Use `npm start` to preview before rendering
6. **Batch Rendering** - Create multiple configs and render all at once

---

## ❓ Troubleshooting

**Video looks wrong?**
- Preview first: `npm start`
- Check screenshot path exists
- Verify image file is in `public/` folder

**Rendering is slow?**
- Normal: 30-120 seconds depending on computer
- If stuck >5 min, stop with Ctrl+C and try again

**File too large?**
- Edit `remotion.config.mjs`
- Change `CRF` from 28 to 30-32 (smaller file, lower quality)

**Preview won't start?**
```bash
# Kill any existing servers
pkill -f "node"

# Try again
npm start
```

---

## 📚 Full Documentation

- **README.md** - Complete feature overview
- **RENDERING_GUIDE.md** - Detailed step-by-step rendering
- **REMOTION_SETUP_SUMMARY.md** - Project architecture & capabilities

---

## 🚀 Ready?

1. Update the config in `src/index.tsx`
2. Add your product screenshot to `public/`
3. Run: `npm run render`
4. Upload `output/PromoVideo.mp4` to social media
5. Watch sales increase 📈

**That's it!** 🎉

One config file. One command. Professional video.

```bash
cd remotion-promos
npm run render
```

Your promo video is waiting in `output/PromoVideo.mp4`

---

**Questions?** Check RENDERING_GUIDE.md for complete documentation.
