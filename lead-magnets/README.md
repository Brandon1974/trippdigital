# Lead Magnet Slideshow Videos

Complete guide to creating slideshow videos with ElevenLabs narration.

## What You Get

Three professional 2-3 minute slideshow videos with:
- ✅ ElevenLabs AI narration (professional voices)
- ✅ Animated slides matching the narration
- ✅ Trippdigital.com branding on every slide
- ✅ 9:16 vertical format (Instagram Reels/TikTok ready)
- ✅ 1080p HD quality
- ✅ Natural pacing and timing

## Videos Created

1. **claude-prompting-guide.mp4** - Complete Guide to Prompting Claude (2026)
2. **chatgpt-prompting-guide.mp4** - Complete Guide to Prompting ChatGPT (2026)
3. **gemini-prompting-guide.mp4** - Complete Guide to Prompting Google Gemini (2026)

## Setup Instructions

### Step 1: Install Dependencies

```bash
# Install Python packages
pip install pillow requests elevenlabs

# Install ffmpeg
# On macOS:
brew install ffmpeg

# On Ubuntu/Debian:
sudo apt-get install ffmpeg

# On Windows:
# Download from https://ffmpeg.org/download.html
```

### Step 2: Get ElevenLabs API Key

1. Go to https://elevenlabs.io
2. Sign up for a free account
3. Navigate to Account → API Key
4. Copy your API key

### Step 3: Set Environment Variable

```bash
# Linux/macOS:
export ELEVENLABS_API_KEY="your-api-key-here"

# Windows (PowerShell):
$env:ELEVENLABS_API_KEY="your-api-key-here"

# Or add to your .env file and source it
```

### Step 4: Run the Script

```bash
cd lead-magnets
python create_slideshow_videos.py
```

The script will:
1. ✓ Create slide images (11-15 slides per video)
2. ✓ Generate audio narration using ElevenLabs
3. ✓ Combine slides + audio into final MP4 videos
4. ✓ Output videos to `lead-magnets/videos/`

### Step 5: Use Your Videos

Videos are ready for:
- Instagram Reels (vertical 9:16 format)
- TikTok uploads
- YouTube Shorts
- Manychat integration
- Email marketing
- Website embedding

## Files Included

- `claude-prompting-guide.md` - Full Claude prompting guide (PDF-ready)
- `chatgpt-prompting-guide.md` - Full ChatGPT prompting guide (PDF-ready)
- `gemini-prompting-guide.md` - Full Gemini prompting guide (PDF-ready)
- `claude-narration-script.md` - Claude video narration script
- `chatgpt-narration-script.md` - ChatGPT video narration script
- `gemini-narration-script.md` - Gemini video narration script
- `create_slideshow_videos.py` - Main Python script (run this)

## Customization

You can customize the script to:

### Change Voice

Edit the `voice_id` in `create_slideshow_videos.py`:

Available ElevenLabs voices:
- Rachel (21m00Tcm4TlvDq8ikWAM) - professional, clear, female
- Chris (onwK4e9ZjUvSHYXDvF00) - friendly, male
- Bella (EXAVITQu4vr4xnSDxMaL) - warm, female

### Change Colors

Edit the `color_bg`, `color_accent`, `color_text` in the GUIDES section:

```python
"color_bg": (25, 45, 85),  # Dark blue - RGB values
"color_accent": (100, 150, 255),  # Light blue
"color_text": (255, 255, 255),  # White
```

### Change Slide Durations

Edit the `duration` parameter in each slide:

```python
{"title": "Your Slide", "duration": 3}  # 3 seconds
```

### Modify Narration Text

Edit the NARRATIONS dictionary with your own text:

```python
NARRATIONS = {
    "claude": "Your custom narration here...",
    ...
}
```

## Troubleshooting

### "ffmpeg not found"
Install ffmpeg:
- macOS: `brew install ffmpeg`
- Ubuntu: `sudo apt-get install ffmpeg`
- Windows: https://ffmpeg.org/download.html

### "ELEVENLABS_API_KEY not set"
Set your API key:
```bash
export ELEVENLABS_API_KEY="your-key-here"
```

### Audio doesn't match video length
The script uses the shortest input (audio or slides). Adjust slide durations to match audio length, or trim/extend narration.

### Video quality issues
- Increase FPS in script: `FPS = 30` (from 24)
- Increase resolution if needed

## Output Quality

- Resolution: 1080p (9:16 aspect ratio)
- Codec: H.264 (MP4 container)
- Audio: AAC
- File size: ~30-50 MB per video
- Duration: ~2-3 minutes per video

## Using with Manychat

1. Upload videos to Manychat media library
2. Create automation trigger: "Want to learn AI prompting?"
3. Set action: Play video in chat
4. Add CTA: "Download full guide" or "Learn more"
5. Link to complete PDF guides on your website

## Next Steps

1. ✅ Run the script
2. ✅ Download videos from `lead-magnets/videos/`
3. ✅ Upload to Manychat
4. ✅ Share on social media
5. ✅ Track engagement

## Support

Need help? Check:
- ElevenLabs docs: https://docs.elevenlabs.io
- FFmpeg docs: https://ffmpeg.org/documentation.html
- Pillow docs: https://pillow.readthedocs.io

---

**Ready?** Run `python create_slideshow_videos.py` and create your lead magnet videos! 🚀
