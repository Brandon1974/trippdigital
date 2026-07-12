# Remotion Video Rendering Guide

This guide explains how to render Tripp Digital promo videos using the Remotion project set up in `remotion-promos/`.

## Quick Start

### 1. Navigate to the project
```bash
cd remotion-promos
```

### 2. Install dependencies (first time only)
```bash
npm install
```

### 3. Preview before rendering
```bash
npm start
```
Opens preview at `http://localhost:3000`

### 4. Render the video
```bash
npm run render
```
Outputs MP4 to `output/` folder

## System Requirements

- Node.js 18+ (already installed)
- npm 9+ (already installed)
- FFmpeg (already installed) - needed for video encoding
- ~500MB disk space for rendering

## Rendering Options

### Standard Quality (Default)
```bash
npm run render
```
- Codec: H.264
- Quality: CRF 28 (good balance of quality/file size)
- Output: ~2-3MB for 25-second video
- Time: ~30-60 seconds rendering

### High Quality
```bash
npm run render:hq
```
- Codec: H.264
- Quality: CRF 20 (better quality, larger file)
- Output: ~4-6MB for 25-second video
- Time: ~60-120 seconds rendering

### Custom Quality
Edit `remotion-promos/remotion.config.mjs`:
```javascript
Config.setCrf(18); // 18-24 for high quality, 28-32 for smaller files
```

## Creating New Product Videos

### Step 1: Get Product Screenshot
- Screenshot should be 500x300px or larger
- Save it to `remotion-promos/public/product-name.jpg`

### Step 2: Update src/index.tsx
Open the file and modify this section:

```typescript
const MY_PRODUCT_CONFIG = {
  productName: 'Your Product Name',
  headline: 'Catchy Hook (6-8 words)',
  features: [
    'Feature 1 description',
    'Feature 2 description',
    'Feature 3 description',
  ],
  price: 29,
  screenshotPath: './public/product-name.jpg',
};
```

Then update the defaultProps in the Composition:
```typescript
defaultProps={MY_PRODUCT_CONFIG}
```

### Step 3: Preview (Optional)
```bash
npm start
```
Check that everything looks good in browser at http://localhost:3000

### Step 4: Render
```bash
npm run render
```

Video will be saved to `output/PromoVideo.mp4`

## Example Configs

### Invoice Generator ($25)
```typescript
const INVOICE_CONFIG = {
  productName: 'Invoice & Estimate Generator',
  headline: 'Create Professional Invoices Fast',
  features: [
    'Generate invoices in seconds',
    'Built-in payment tracking',
    'Export as PDF instantly',
  ],
  price: 25,
  screenshotPath: './public/invoice-tracker.jpg',
};
```

### Lead CRM Tracker ($29)
```typescript
const LEAD_CRM_CONFIG = {
  productName: 'Lead & CRM Tracker',
  headline: 'Never Lose a Lead Again',
  features: [
    'Track leads through sales pipeline',
    'Automated follow-up reminders',
    'Performance analytics included',
  ],
  price: 29,
  screenshotPath: './public/lead-tracker.jpg',
};
```

### Budget Expense Tracker ($15)
```typescript
const BUDGET_CONFIG = {
  productName: 'Budget & Expense Tracker',
  headline: 'Take Control of Your Money',
  features: [
    'Categorized expense tracking',
    'Monthly budget goals & alerts',
    'Export spending reports',
  ],
  price: 15,
  screenshotPath: './public/budget-tracker.jpg',
};
```

## Video Length Customization

Default: 25 seconds total
- Scene 1 (Hook): 6 seconds
- Scene 2 (Product): 10 seconds
- Scene 3 (CTA): 8 seconds

To change total length, edit `remotion-promos/src/lib/branding.ts`:
```typescript
export const VIDEO_CONFIG = {
  durationInSeconds: 30, // Change from 25 to 30, etc.
  fps: 30,
  width: 1080,
  height: 1920,
} as const;
```

Then adjust scene durations in `src/components/PromoVideoTemplate.tsx`:
```typescript
const hookDuration = fps * 8;        // 8 seconds
const productDuration = fps * 12;    // 12 seconds
const ctaDuration = fps * 10;        // 10 seconds
```

## Troubleshooting

### "npm: command not found"
```bash
# Reinstall Node.js or check PATH
node --version
npm --version
```

### Video looks dark/wrong
- Preview first: `npm start`
- Check that screenshotPath is correct
- Verify image file exists in `public/` folder

### Rendering is slow
- Normal: 30-120 seconds depending on computer
- Tip: Limit background processes
- Tip: Use CRF 28+ for faster renders (slightly lower quality)

### "Chrome/Chromium not found"
This means the system can't find a browser for rendering. Solutions:
1. Install Chromium: `sudo apt-get install chromium-browser`
2. Or install Chrome from Google
3. Or use Docker with pre-installed browsers

### Large output file
If MP4 is too large (>10MB):
- Increase CRF value: 30, 32, or 34
- Higher CRF = smaller file, lower quality
- For social media, 3-5MB is ideal

### "Preview won't start"
```bash
# Kill any existing servers
lsof -i :3000
kill -9 <PID>

# Then try again
npm start
```

## Output Files

All rendered videos go to `output/` folder with naming like:
- `PromoVideo.mp4` (if rendered once)
- Videos are timestamped if rendered multiple times

### Using the Video

Once rendered, use the MP4 for:
- ✅ TikTok/Reels/YouTube Shorts (perfect 1080x1920 format)
- ✅ Email campaigns (embed in HTML)
- ✅ Product landing pages
- ✅ Facebook ads
- ✅ Instagram feed posts (crop from vertical)

## Adding More Scenes

The template supports 3 scenes. To add more:

1. Create new scene component in `src/components/PromoVideoTemplate.tsx`
2. Add timing variables
3. Add `<Sequence>` and `<YourScene>` to main component
4. Adjust durationInSeconds

Example:
```typescript
const testimonialDuration = fps * 5;

<YourScene
  durationInFrames={testimonialDuration}
  startFrame={hookDuration + productDuration + ctaDuration}
/>
```

## Batch Rendering Multiple Videos

To render all products at once, create `batch-render.js`:

```javascript
#!/usr/bin/env node
const { exec } = require('child_process');
const products = ['pickleball', 'invoice', 'lead-crm', 'budget'];

products.forEach(product => {
  console.log(`Rendering ${product}...`);
  exec(`npm run render`, { cwd: __dirname }, (err) => {
    if (err) console.error(`Failed: ${product}`, err);
    else console.log(`✓ ${product} complete`);
  });
});
```

Then run:
```bash
node batch-render.js
```

## Advanced Customization

### Change Colors
Edit `src/lib/branding.ts`:
```typescript
colors: {
  black: '#0D0D0D',
  orange: '#FF6B00',
  // Modify these for different branding
}
```

### Change Fonts
Edit `src/lib/branding.ts`:
```typescript
fonts: {
  heading: 'Bebas Neue, sans-serif',
  body: 'Inter, sans-serif',
  // Add your preferred fonts
}
```

### Add Audio/Music
1. Add audio import in `PromoVideoTemplate.tsx`
2. Use `<Audio>` component from remotion
3. Adjust timing to match music beats

### Add Logo/Watermark
Edit `src/components/PromoVideoTemplate.tsx`:
```typescript
<img 
  src="./public/logo.png" 
  style={{
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '80px',
  }}
/>
```

## Next Steps

1. ✅ Prepare product screenshots (500x300px minimum)
2. ✅ Update config for first product
3. ✅ Preview video (`npm start`)
4. ✅ Render video (`npm run render`)
5. ✅ Upload MP4 to TikTok/Reels/YouTube
6. ✅ Track views and engagement
7. ✅ Create videos for remaining products

## Performance Metrics

- **Render Time:** ~30-60 seconds per video
- **Output Size:** 2-3MB (default CRF 28)
- **Resolution:** 1080x1920 (perfect for mobile)
- **Frame Rate:** 30fps (smooth playback)
- **Duration:** 25 seconds (optimal for social)

## Support

For issues:
1. Check TROUBLESHOOTING section above
2. Review Remotion docs: https://www.remotion.dev/docs
3. Check CLI options: `npx remotion --help`
4. View available commands: `npm run`

---

**Ready to render?** 🎬

Start with:
```bash
cd remotion-promos
npm run render
```

Your first Tripp Digital promo video will be ready in `output/PromoVideo.mp4`!
