# Bones: Snake Eyes — Audiobook Player

## Audio Files Required

The audiobook player expects the following MP3 files in this directory:

- `ch0.mp3` - Prologue: Tuition
- `ch1.mp3` - Chapter 1: The Lesson (Chicago)
- `ch2.mp3` - Chapter 2: The A (Atlanta)
- `ch3.mp3` - Chapter 3: H-Town (Houston)
- `ch4.mp3` - Chapter 4: The 757 (Norfolk/Huntsville)
- `ch5.mp3` - Chapter 5: The D (Detroit)
- `ch6.mp3` - Chapter 6: The Boot (New Orleans)
- `ch7.mp3` - Chapter 7: City of Angels (Los Angeles)
- `ch8.mp3` - Chapter 8: The Bottom (Baltimore)
- `ch9.mp3` - Chapter 9: The Badlands (Philadelphia)
- `ch10.mp3` - Chapter 10: The Concrete Jungle (New York)
- `ch11.mp3` - Bonus: Bones' Rules of the Dice

## Features

✓ Password-protected access (Code: BONES2024)
✓ Tripp Digital branding (black background, #FF6B00 orange accents)
✓ Full player controls:
  - Play/Pause button
  - Skip back 15 seconds
  - Skip forward 15 seconds
  - Progress bar with click-to-seek
  - Time display (current / total)
  - Playback speed controls (0.75x, 1x, 1.25x, 1.5x, 2x)
✓ Chapter list with instant switching
✓ Auto-advances to next chapter when current ends
✓ Mobile-friendly responsive design
✓ Stylish UI with smooth animations

## How to Generate Audio

Generate MP3 files from the manuscript using:

1. **ElevenLabs API** - Use Brandon's primary voice (ID: CwhRBWXzGAHq8TQ4Fs17)
2. **Higgsfield** - For video + audio combo
3. **Any TTS service** - As long as MP3 output matches filenames

## Deployment to Netlify

### Option 1: Manual Deploy via Netlify CLI
```bash
cd audiobook
netlify deploy --prod --dir .
```

### Option 2: Deploy via Git
1. Push this branch to GitHub
2. In Netlify, create a new site from Git
3. Connect to `Brandon1974/trippdigital` repo
4. Set build command to: `echo "No build needed"`
5. Set publish directory to: `audiobook`
6. Deploy

### Option 3: Drag & Drop
1. Go to https://app.netlify.com/drop
2. Drag the `audiobook/` folder
3. Get instant live URL

### Option 4: Deploy as Subdirectory of Main Site
Add to main site's netlify.toml:
```toml
[[redirects]]
  from = "/audiobook/*"
  to = "/audiobook/index.html"
  status = 200
```
Then deploy main site with audiobook folder included.

**Netlify configuration:** See `netlify.toml` in this folder for caching and security headers.

## Call to Action

The footer includes links to:
- payhip.com/Tinytripp
- trippdigital.com

Per Tripp Digital branding rules.
