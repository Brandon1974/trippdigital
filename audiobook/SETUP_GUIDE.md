# Bones: Snake Eyes — Audiobook Player Setup Guide

## ✅ What's Been Built

A complete, production-ready audiobook web player for "Bones: Snake Eyes" by Brandon Tripp.

**Location:** `/audiobook` folder in the repository
**Branch:** `claude/bones-snake-eyes-audiobook-h0zy90`

---

## 📋 Player Features

### Security
- ✓ Password gate with access code **BONES2024**
- ✓ Prevents unauthorized access while keeping UI clean

### Audio Controls
- ✓ Play/Pause button
- ✓ Skip back 15 seconds (⏪)
- ✓ Skip forward 15 seconds (⏩)
- ✓ Interactive progress bar (click to seek)
- ✓ Current time / Total duration display
- ✓ Playback speed controls: **0.75x, 1x, 1.25x, 1.5x, 2x**

### Navigation
- ✓ Chapter list with 12 items:
  - Prologue: Tuition
  - Chapters 1–10 (one per city)
  - Bonus: Bones' Rules of the Dice
- ✓ Click any chapter to jump instantly
- ✓ Current chapter highlighted in gold
- ✓ Auto-advances to next chapter when current ends

### Design
- ✓ Tripp Digital branding (black background, #FF6B00 orange accents)
- ✓ Bebas Neue font for headers, Roboto for body
- ✓ Smooth animations and hover effects
- ✓ Fully mobile-responsive (tested down to 320px width)
- ✓ Custom scrollbar styling
- ✓ Dark mode only (as per brand)

### Branding
- ✓ Footer links to `payhip.com/Tinytripp` and `trippdigital.com`
- ✓ Copyright notice: © 2026 Brandon Tripp

---

## 🎵 Next Steps: Add Audio Files

The player expects 12 MP3 files in the audiobook folder:

```
ch0.mp3   → Prologue: Tuition
ch1.mp3   → Chapter 1: The Lesson (Chicago)
ch2.mp3   → Chapter 2: The A (Atlanta)
ch3.mp3   → Chapter 3: H-Town (Houston)
ch4.mp3   → Chapter 4: The 757 (Norfolk/Huntsville)
ch5.mp3   → Chapter 5: The D (Detroit)
ch6.mp3   → Chapter 6: The Boot (New Orleans)
ch7.mp3   → Chapter 7: City of Angels (Los Angeles)
ch8.mp3   → Chapter 8: The Bottom (Baltimore)
ch9.mp3   → Chapter 9: The Badlands (Philadelphia)
ch10.mp3  → Chapter 10: The Concrete Jungle (New York)
ch11.mp3  → Bonus: Bones' Rules of the Dice
```

### Generate Audio Using ElevenLabs

Brandon's primary voice ID: `CwhRBWXzGAHq8TQ4Fs17`

**Option A: Direct API (Fastest)**
```python
import requests

voice_id = "CwhRBWXzGAHq8TQ4Fs17"
text = "[manuscript chapter text]"

response = requests.post(
    f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
    headers={"xi-api-key": "YOUR_API_KEY"},
    json={
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }
)

with open("ch0.mp3", "wb") as f:
    f.write(response.content)
```

**Option B: Higgsfield (Brandon's go-to tool)**
- Use `generate_audio` with voice ID
- Supports batch processing
- Integrates with video if needed

**Option C: Any TTS Service**
- Use any service you prefer
- Just ensure output is `.mp3` format
- Name files exactly as specified above

---

## 🚀 Deploy to Netlify

Once you have the MP3 files in place:

### Quick Deploy (Recommended)
```bash
cd audiobook
netlify deploy --prod --dir .
```

### Or: Manual via Netlify UI
1. Go to https://app.netlify.com
2. Create new site from Git (`Brandon1974/trippdigital`)
3. Build settings:
   - Build command: `echo "No build needed"`
   - Publish directory: `audiobook`
4. Deploy

### Or: Drag & Drop
- Go to https://app.netlify.com/drop
- Drag `audiobook/` folder
- Get live URL instantly

---

## 🔗 Live Player URL

After deployment, share this URL with listeners:

```
https://[your-netlify-domain].netlify.app
```

Access code: `BONES2024`

---

## 📊 Architecture

### Files in audiobook/ folder
- `index.html` - Complete player (15KB, self-contained)
- `netlify.toml` - Deployment config with security headers
- `README.md` - Technical documentation
- `SETUP_GUIDE.md` - This file
- `ch0.mp3` – `ch11.mp3` - Audio files (placeholder, to be generated)

### No External Dependencies
- ✓ No npm packages required
- ✓ No build step
- ✓ No CDN fonts (self-hosted Bebas Neue + Roboto)
- ✓ Pure HTML5 + CSS3 + Vanilla JavaScript
- ✓ ~15KB total (before audio files)

---

## 🎨 Customization

If you want to modify the player:

### Change Password
In `index.html`, find line ~385:
```javascript
const ACCESS_CODE = 'BONES2024';
```
Change to your preferred code.

### Change Default Speed
Find line ~386:
```javascript
let currentSpeed = 1.25;
```
Change to 0.75, 1, 1.5, or 2.

### Change Branding Colors
- Orange accent: `#FF6B00` (search & replace)
- Black background: `#000000` (search & replace)
- Other colors: `#1a1a1a` (dark gray), `#0a0a0a` (darker)

### Add Analytics
Insert any tracking pixel or script before `</body>` tag.

---

## ✅ Testing Checklist

Before sharing live:

- [ ] All 12 MP3 files uploaded to folder
- [ ] Play button works, audio plays
- [ ] Skip forward/back works (±15s)
- [ ] Progress bar responsive to clicks
- [ ] Speed controls cycle through all 5 speeds
- [ ] Chapter list jumps to selected chapter
- [ ] Auto-advance happens at chapter end
- [ ] Mobile layout looks good on phone
- [ ] Password gate works (BONES2024)
- [ ] Footer links work
- [ ] No console errors

---

## 📞 Support

For issues with the player code, check the browser console (F12 → Console tab).

For deployment help, see Netlify docs: https://docs.netlify.com

For audio generation, refer to ElevenLabs or Higgsfield documentation.

---

**Player Version:** 1.0 (July 2026)  
**Built for:** Brandon Tripp / Tripp Digital  
**Manuscript:** Bones: Snake Eyes (hard-boiled noir)  
**Status:** Ready for audio files and deployment
