# Tripp Digital Promo Video Generator

A reusable Remotion-based video template system for creating branded promo videos for Tripp Digital products.

## Features

✓ **Animated Gradient Background** - Subtly pulsing orange glow on black background (reused across all videos)  
✓ **3-Scene Template** - Hook → Product Showcase → Price & CTA  
✓ **Responsive Design** - 1080x1920 vertical format (TikTok/Reels/Shorts ready)  
✓ **Easy Customization** - Just edit variables at the top of `src/index.tsx`  
✓ **Professional Animations** - Ken Burns zoom, staggered text, pulsing price, glowing buttons  
✓ **Branded** - Uses Tripp Digital colors (black #0D0D0D, orange #FF6B00)  

## Quick Start

### Install Dependencies
```bash
cd remotion-promos
npm install
```

### Preview Your Video
```bash
npm start
```
Opens a preview at http://localhost:3000

### Render Final Video
```bash
npm run build
```
Outputs to `out/` as MP4 (1080x1920, 30fps)

## How to Create a New Promo Video

1. Open `src/index.tsx`

2. Create a new config object (copy & modify `PICKLEBALL_CONFIG`):
```javascript
const MY_PRODUCT_CONFIG = {
  productName: 'My Awesome Product',
  headline: 'Short Catchy Hook (6-8 words max)',
  features: [
    'First key feature description',
    'Second key feature description', 
    'Third key feature description',
  ],
  price: 29,
  screenshotPath: '/path/to/screenshot.jpg',
};
```

3. Update the `defaultProps` in the Composition:
```javascript
defaultProps={MY_PRODUCT_CONFIG}
```

4. Run `npm start` to preview

5. Run `npm run build` to render the final MP4

## File Structure

```
src/
├── index.tsx                    # Main entry point (EDIT THIS to create new videos)
├── components/
│   ├── PromoVideoTemplate.tsx   # 3-scene template (reusable across all products)
│   └── AnimatedGradientBg.tsx   # Animated background (used in all scenes)
└── lib/
    └── branding.ts              # Brand colors, fonts, timing (global settings)
```

## Customization

### Change Video Length
Edit `VIDEO_CONFIG.durationInSeconds` in `src/lib/branding.ts`

### Adjust Scene Timing
In `PromoVideoTemplate.tsx`, change:
- `hookDuration = fps * 6` (currently 6 seconds)
- `productDuration = fps * 10` (currently 10 seconds)  
- `ctaDuration = fps * 8` (currently 8 seconds)

### Update Brand Colors
Edit the `BRAND.colors` object in `src/lib/branding.ts`:
```javascript
colors: {
  black: '#0D0D0D',
  orange: '#FF6B00',
  // ... other colors
}
```

### Change Fonts
Update `BRAND.fonts` in `src/lib/branding.ts`

## Scene Breakdown

### Scene 1: Hook (6 seconds)
- Large bold headline slides up from bottom
- Animated gradient background pulses
- Perfect for establishing product name + value

### Scene 2: Product Showcase (10 seconds)
- Product screenshot zooms in (Ken Burns effect)
- 3 feature bullet points slide in one at a time
- Orange accent dots mark each feature

### Scene 3: Price & CTA (8 seconds)
- "Get Started Today" text
- Price pulses up and scales
- Glowing orange "Get at Payhip" button animates
- Footer with trippdigital.com + payhip.com/Tinytripp CTAs

## Example Product Configs

### Pickleball Tracker ($12)
```javascript
{
  productName: 'Pickleball Score & Stats Tracker',
  headline: 'Track Scores & Master Your Game',
  features: [
    'Real-time scoring and match tracking',
    'Player stats and performance analytics',
    'Share results and compete with friends',
  ],
  price: 12,
  screenshotPath: '/images/pickleball-tracker.jpg',
}
```

### Lead CRM Tracker ($25)
```javascript
{
  productName: 'Lead & CRM Tracker',
  headline: 'Never Lose a Lead Again',
  features: [
    'Track leads from prospecting to close',
    'Built-in email and call logging',
    'Automated follow-up reminders',
  ],
  price: 25,
  screenshotPath: '/images/lead-tracker.jpg',
}
```

## Rendering Options

### MP4 (Default)
```bash
npm run build
```

### Custom Quality
Edit `remotion.config.mjs`:
- `CRF` (0-51, lower = better quality, larger file): Currently 28
- `FPS` (frames per second): Currently 30
- `CODEC`: Currently h264 (good compatibility)

### Batch Render Multiple Videos
Create a script that loops through product configs and renders each

## Troubleshooting

**Preview won't start?**
```bash
npm install
npm start
```

**Screenshot not showing?**
- Ensure path is correct (relative to project root)
- File must be PNG or JPG
- Try using a full URL instead

**Video quality too low?**
- Lower CRF value in `remotion.config.mjs` (20-24 for high quality)
- Note: Lower CRF = larger file size

**Animations feel slow/fast?**
- Adjust `interpolate()` frame ranges in component files
- Adjust scene durations (hookDuration, productDuration, ctaDuration)

## Performance

- Preview: Real-time on most machines
- Render: ~2-3 seconds per second of video on average hardware
- File size: ~2-3MB for 25-second 1080x1920 video

## Next Steps

1. Create product screenshots (1080x1920 recommended, or at least 500x300)
2. Add Pickleball Tracker video config
3. Render test video
4. Upload to TikTok/Reels/YouTube Shorts
5. Create configs for other Tripp Digital products
6. Use rendered videos in sales emails and product pages

---

**Brand Assets Used:**
- Colors: Black (#0D0D0D), Orange (#FF6B00)
- Fonts: Bebas Neue (headings), Inter (body)
- Pattern: Animated gradient with grid overlay
- Format: 1080x1920 vertical (phone/social optimized)
