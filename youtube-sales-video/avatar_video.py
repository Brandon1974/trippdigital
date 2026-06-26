#!/usr/bin/env python3
"""
YouTube Sales Video Generator
Creates professional product promotion videos with a circular AI avatar.

Usage:
    python avatar_video.py

Folder layout expected:
    avatar.jpg            - your photo or AI headshot
    sales_script.txt      - voiceover text
    product_images/       - PNG/JPG screenshots shown as slides
    music.mp3             - (optional) background music
    output/               - generated video lands here
"""

import sys
import subprocess

# ---------------------------------------------------------------
# AUTO-INSTALL
# ---------------------------------------------------------------
def auto_install():
    """Install missing runtime libraries without user intervention."""
    packages = [
        ("moviepy",  "moviepy==1.0.3"),
        ("PIL",      "pillow"),
        ("pyttsx3",  "pyttsx3"),
        ("numpy",    "numpy"),
        ("cv2",      "opencv-python"),
    ]
    for module, pkg in packages:
        try:
            __import__(module)
        except ImportError:
            print(f"Installing {pkg} ...")
            subprocess.check_call(
                [sys.executable, "-m", "pip", "install", pkg, "--quiet"]
            )
    print("All dependencies ready.")

auto_install()

import math
import os
import tempfile
import unicodedata

import numpy as np
from PIL import Image, ImageDraw, ImageFont
import pyttsx3
from moviepy.editor import AudioFileClip, CompositeAudioClip, VideoClip
import moviepy.audio.fx.all as afx

# ================================================================
# CONFIGURATION  ─  edit everything here
# ================================================================
CONFIG = {
    # Product details
    "PRODUCT_NAME":        "Digital Product Pro",
    "PRODUCT_PRICE":       "$47",
    "ORIGINAL_PRICE":      "$97",
    "PRODUCT_DESCRIPTION": "The ultimate productivity tool for modern creators",
    "CTA_TEXT":            "Get It Now  -->",
    "CTA_LINK":            "yourproduct.com",
    "SALE_END_DATE":       "December 31, 2026",
    # Visuals
    "COLOR_THEME":         "#4a9eff",   # accent / brand color
    "RATING":              5,
    "REVIEW_COUNT":        "2,847",
    "BULLET_POINTS": [
        "[+] Save 10+ hours every single week",
        "[+] Works for complete beginners in 5 minutes",
        "[+] Lifetime access  --  pay once, use forever",
        "[+] 30-day money-back guarantee",
    ],
    "TESTIMONIALS": [
        '"This saved me 15 hours a week!"  -- Sarah K.',
        '"Best investment I made this year"  -- Mike T.',
        '"Doubled my productivity overnight"  -- Lisa M.',
    ],
    # Files
    "AVATAR_FILE":       "avatar.jpg",
    "SALES_SCRIPT_FILE": "sales_script.txt",
    "SLIDES_FOLDER":     "product_images",
    "MUSIC_FILE":        "music.mp3",
    "OUTPUT_FILE":       "output/product_sales_video.mp4",
    # Video settings
    "VIDEO_WIDTH":  1920,
    "VIDEO_HEIGHT": 1080,
    "FPS":          30,
    "AVATAR_SIZE":  200,    # diameter of the circular avatar in pixels
    # Feature flags
    "SHOW_PROGRESS_BAR":  True,
    "SHOW_COUNTDOWN":     True,
    "SHOW_TESTIMONIALS":  True,
    "SHOW_SUBSCRIBE_BTN": True,
}

# ================================================================
# COLORS
# ================================================================
def hex_to_rgb(h: str) -> tuple:
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

THEME   = hex_to_rgb(CONFIG["COLOR_THEME"])
BG      = (12,  14,  20)    # dark navy
CARD    = (22,  26,  38)    # card surface
WHITE   = (255, 255, 255)
GRAY    = (140, 150, 170)
GREEN   = (72,  210, 110)
YELLOW  = (255, 210,  60)
RED     = (240,  70,  70)

# ================================================================
# FONTS
# ================================================================
_FONT_PATHS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "/Library/Fonts/Arial Bold.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
]

def _ttf(size: int) -> ImageFont.FreeTypeFont:
    for path in _FONT_PATHS:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            pass
    try:
        return ImageFont.load_default(size=size)   # Pillow >=10
    except TypeError:
        return ImageFont.load_default()

FONT = {
    "title":    _ttf(72),
    "subtitle": _ttf(48),
    "body":     _ttf(36),
    "small":    _ttf(28),
    "tiny":     _ttf(22),
    "cta":      _ttf(52),
    "price":    _ttf(64),
    "badge":    _ttf(30),
}

# ================================================================
# TEXT HELPERS
# ================================================================
def _clean(text: str) -> str:
    """Remove characters that standard TTF fonts cannot render."""
    out = []
    for ch in text:
        cat = unicodedata.category(ch)
        # drop emoji / private-use / surrogate code-points
        if cat.startswith("S") and ch not in ("$", "+", "-", "*"):
            continue
        out.append(ch)
    return "".join(out)

def _draw_text_shadow(draw, xy, text, font, fill, shadow=(0, 0, 0)):
    """Draw text with a 2-pixel drop-shadow."""
    x, y = xy
    draw.text((x + 2, y + 2), text, font=font, fill=shadow)
    draw.text((x,     y),     text, font=font, fill=fill)

# ================================================================
# ROUNDED-RECT COMPAT (Pillow < 8.2 fallback)
# ================================================================
def _rounded_rect(draw, box, radius, fill=None, outline=None, width=1):
    try:
        draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)
    except AttributeError:
        draw.rectangle(box, fill=fill, outline=outline, width=width)

# ================================================================
# TTS: GENERATE VOICEOVER
# ================================================================
_DEFAULT_SCRIPT = """
Hey everyone! Welcome back. Today I want to share something that will 
completely transform the way you work.

Introducing {PRODUCT_NAME} -- {PRODUCT_DESCRIPTION}.

Here's why over two thousand people already love this product.

First: save ten or more hours every single week.
Second: it works for complete beginners in just five minutes.
Third: lifetime access -- pay once, use forever. No subscriptions.
Fourth: backed by a thirty-day money-back guarantee.

And right now, for a very limited time, you can get it for just 
{PRODUCT_PRICE}, down from {ORIGINAL_PRICE}. That is fifty percent off!

But this deal will not last. Click the link below this video right now 
and let's get you started today.
"""

def generate_voiceover(script_file: str, audio_out: str) -> str:
    """Render sales script to a WAV file; return the text used."""
    if os.path.exists(script_file):
        with open(script_file, encoding="utf-8") as f:
            text = f.read()
    else:
        text = _DEFAULT_SCRIPT.format(**CONFIG)

    engine = pyttsx3.init()
    engine.setProperty("rate",   165)
    engine.setProperty("volume", 0.95)

    # Prefer a female voice when available
    for v in engine.getProperty("voices") or []:
        if any(k in (v.name + v.id).lower() for k in ("female", "zira", "samantha", "hazel")):
            engine.setProperty("voice", v.id)
            break

    engine.save_to_file(text, audio_out)
    engine.runAndWait()
    print(f"  Voiceover saved -> {audio_out}")
    return text

# ================================================================
# AVATAR: circular crop + glow ring
# ================================================================
def make_circular_avatar(path: str, size: int) -> Image.Image:
    """
    Load an image, crop to circle, add a pulsing-glow ring border.
    Returns an RGBA image ready to composite.
    """
    pad = 18   # pixels of glow padding around the circle
    canvas_size = size + pad * 2
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))

    # --- Load or synthesise avatar ---
    if os.path.exists(path):
        raw = Image.open(path).convert("RGBA")
        # Centre-crop to square, then resize
        w, h = raw.size
        side  = min(w, h)
        left  = (w - side) // 2
        top   = (h - side) // 2
        raw   = raw.crop((left, top, left + side, top + side))
        raw   = raw.resize((size, size), Image.LANCZOS)
    else:
        # Gradient placeholder
        raw = Image.new("RGBA", (size, size), (0, 0, 0, 255))
        d   = ImageDraw.Draw(raw)
        for i in range(size):
            frac  = i / size
            color = tuple(int(THEME[c] * frac) for c in range(3)) + (255,)
            d.ellipse([i, i, size - i, size - i], fill=color)
        _draw_text_shadow(d, (size // 2 - 18, size // 2 - 18),
                          "AI", FONT["body"], WHITE)

    # --- Circular mask ---
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, size - 1, size - 1], fill=255)
    raw.putalpha(mask)

    # --- Glow rings (drawn on canvas, behind avatar) ---
    gd = ImageDraw.Draw(canvas)
    cx, cy = canvas_size // 2, canvas_size // 2
    r      = size // 2
    for offset, alpha in [(pad, 255), (pad + 4, 180), (pad + 8, 100), (pad + 12, 50)]:
        gd.ellipse(
            [cx - r - offset, cy - r - offset,
             cx + r + offset, cy + r + offset],
            outline=(*THEME, alpha), width=3
        )

    # --- Paste avatar centred on canvas ---
    canvas.paste(raw, (pad, pad), raw)
    return canvas

def avatar_with_bounce(base: Image.Image, t: float, talking: bool):
    """
    Return (frame_RGBA, y_offset)  where y_offset is the bounce delta.
    A subtle 3-second sine loop gives the floating effect.
    """
    bounce_y = int(math.sin(t * 2 * math.pi / 3) * 6)
    frame    = base.copy()

    if talking:
        # Animate a tiny mouth arc near the bottom of the circle
        d    = ImageDraw.Draw(frame)
        size = CONFIG["AVATAR_SIZE"]
        pad  = 18
        cx   = (size + pad * 2) // 2
        cy   = size + pad - 20       # lower quarter of the circle
        mh   = 6 if (int(t * 8) % 3 == 0) else 2
        d.arc([cx - 12, cy - mh, cx + 12, cy + mh], 0, 180,
              fill=(200, 150, 100, 200), width=2)

    return frame, bounce_y

# ================================================================
# SLIDE IMAGES
# ================================================================
def load_slides():
    folder = CONFIG["SLIDES_FOLDER"]
    images = []
    if os.path.isdir(folder):
        for fname in sorted(os.listdir(folder)):
            if fname.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                try:
                    images.append(Image.open(os.path.join(folder, fname)))
                except Exception as e:
                    print(f"  Skipping {fname}: {e}")
    return images or [None]   # at least one placeholder

# ================================================================
# FRAME DRAWING HELPERS
# ================================================================
def _base_frame(W, H) -> Image.Image:
    """Dark gradient background with a subtle grid."""
    img = Image.new("RGB", (W, H), BG)
    d   = ImageDraw.Draw(img)
    # Very faint grid
    for x in range(0, W, 80):
        d.line([(x, 0), (x, H)], fill=(20, 24, 35))
    for y in range(0, H, 80):
        d.line([(0, y), (W, y)], fill=(20, 24, 35))
    # Top accent bar gradient
    for y in range(6):
        alpha = 255 - y * 30
        d.line([(0, y), (W, y)], fill=(*THEME, alpha) if hasattr(d, '_mode') else THEME)
    return img


def _draw_header(d, W):
    """Product name + coloured accent stripe."""
    x, y = 60, 40
    d.rectangle([x, y, x + 6, y + 60], fill=THEME)
    _draw_text_shadow(d, (x + 20, y + 5),
                      _clean(CONFIG["PRODUCT_NAME"]),
                      FONT["title"], WHITE)


def _draw_slide_area(frame: Image.Image, slide, x, y, w, h):
    """Render a product screenshot inside a styled card."""
    d = ImageDraw.Draw(frame)
    _rounded_rect(d, [x - 12, y - 12, x + w + 12, y + h + 12],
                  radius=12, fill=CARD, outline=(*THEME, 120), width=2)
    if slide is not None:
        img = slide.resize((w, h), Image.LANCZOS).convert("RGB")
        frame.paste(img, (x, y))
    else:
        ph = Image.new("RGB", (w, h), CARD)
        pd = ImageDraw.Draw(ph)
        pd.text((w // 2 - 100, h // 2 - 25), "PRODUCT",  fill=THEME, font=FONT["subtitle"])
        pd.text((w // 2 - 100, h // 2 + 30), "SCREENSHOT", fill=GRAY, font=FONT["body"])
        frame.paste(ph, (x, y))


def _draw_bullets(d, bullets, active, y0=280):
    for i, b in enumerate(bullets):
        y = y0 + i * 70
        if i < active:
            d.text((60, y), _clean(b), fill=GRAY, font=FONT["small"])
        elif i == active:
            _rounded_rect(d, [50, y - 6, 960, y + 44], radius=6, fill=(*THEME, 25))
            _draw_text_shadow(d, (60, y), _clean(b), FONT["body"], WHITE)
        # future bullets are not shown


def _draw_stars(d, x, y, rating):
    for i in range(5):
        char  = "*" if i < rating else "-"
        color = YELLOW if i < rating else GRAY
        d.text((x + i * 36, y), char, fill=color, font=FONT["subtitle"])
    # text label next to stars
    d.text((x + 5 * 36 + 10, y + 6),
           f"{rating}/5  ({CONFIG['REVIEW_COUNT']} reviews)",
           fill=GRAY, font=FONT["tiny"])


def _draw_price(d, x, y, price, orig_price):
    # Strikethrough original price
    d.text((x, y), _clean(orig_price), fill=RED, font=FONT["subtitle"])
    bb  = d.textbbox((x, y), _clean(orig_price), font=FONT["subtitle"])
    mid = (bb[1] + bb[3]) // 2
    d.line([(bb[0], mid), (bb[2], mid)], fill=RED, width=3)
    # Current price
    _draw_text_shadow(d, (x, y + 60), _clean(price), FONT["price"], GREEN)


def _draw_cta(d, W, H, cta_text, glow: float):
    bw, bh = 480, 84
    bx     = (W - bw) // 2
    by     = H - 190
    # Outer glow rings
    for g in range(12, 0, -2):
        alpha = int(80 * glow * g / 12)
        _rounded_rect(d, [bx - g * 3, by - g, bx + bw + g * 3, by + bh + g],
                      radius=18, outline=(*THEME, alpha), width=1)
    # Button fill
    _rounded_rect(d, [bx, by, bx + bw, by + bh], radius=18, fill=THEME)
    d.text((bx + 24, by + 16), _clean(cta_text), fill=WHITE, font=FONT["cta"])


def _draw_urgency(d, W, H, t):
    if int(t * 2) % 2 == 0:
        txt = "LIMITED TIME OFFER  --  Don't miss out!"
        d.text((W // 2 - 280, H - 320), _clean(txt), fill=YELLOW, font=FONT["small"])


def _draw_countdown(d, W, H, t):
    """Simple visual countdown (demo values, update with real date logic)."""
    days  = max(0, 7 - int(t / 86400) % 8)
    hours = 23 - int(t) % 24
    mins  = 59 - int(t) % 60
    txt   = f"Offer ends in:  {days}d  {hours:02d}h  {mins:02d}m"
    d.text((W // 2 - 220, H - 360), _clean(txt), fill=YELLOW, font=FONT["small"])


def _draw_testimonials(d, t):
    idx = int(t / 5) % len(CONFIG["TESTIMONIALS"])
    d.text((60, 840), _clean(CONFIG["TESTIMONIALS"][idx]), fill=GRAY, font=FONT["small"])


def _draw_progress_bar(d, W, H, progress):
    by = H - 5
    d.rectangle([0, by, W, H], fill=(28, 32, 48))
    w  = int(W * min(progress, 1.0))
    if w > 0:
        d.rectangle([0, by, w, H], fill=THEME)


def _draw_subscribe(d, W, H, t):
    pulse  = 0.7 + 0.3 * abs(math.sin(t * 2.5))
    red    = int(200 * pulse)
    bw, bh = 300, 64
    bx     = W - bw - 60
    by     = H - 320
    _rounded_rect(d, [bx, by, bx + bw, by + bh], radius=10,
                  fill=(red, 28, 28))
    d.text((bx + 20, by + 14), "  SUBSCRIBE", fill=WHITE, font=FONT["badge"])


def _composite_avatar(frame: Image.Image, avatar_rgba: Image.Image,
                      bounce_y: int, W: int, H: int) -> Image.Image:
    aw, ah = avatar_rgba.size
    ax     = W - aw - 30
    ay     = 20 + bounce_y
    base   = frame.convert("RGBA")
    base.paste(avatar_rgba, (ax, ay), avatar_rgba)
    return base.convert("RGB")

# ================================================================
# MAIN FRAME RENDERER
# ================================================================
def build_frame(t: float, duration: float, avatar_base: Image.Image,
                slides: list) -> np.ndarray:
    W, H = CONFIG["VIDEO_WIDTH"], CONFIG["VIDEO_HEIGHT"]

    cta_start   = duration - 13
    is_cta      = t >= cta_start
    bullet_idx  = min(int(t / max(duration, 1) * len(CONFIG["BULLET_POINTS"])),
                      len(CONFIG["BULLET_POINTS"]) - 1)
    slide_idx   = int(t / 8) % len(slides)
    fade_dur    = 1.0

    frame = _base_frame(W, H)
    d     = ImageDraw.Draw(frame)

    _draw_header(d, W)

    if not is_cta:
        # Left column: bullet points
        _draw_bullets(d, CONFIG["BULLET_POINTS"], bullet_idx)
        # Right column: slide preview
        _draw_slide_area(frame, slides[slide_idx], 980, 130, 720, 490)
        # Star rating
        d.text((60, 700), "Customer rating:", fill=GRAY, font=FONT["tiny"])
        _draw_stars(d, 60, 730, CONFIG["RATING"])
        # Testimonials
        if CONFIG["SHOW_TESTIMONIALS"]:
            _draw_testimonials(d, t)
    else:
        # CTA phase
        cta_t  = t - cta_start
        d.text((W // 2 - 270, 190),
               _clean("Special Launch Offer!"), fill=THEME, font=FONT["subtitle"])
        _draw_price(d, W // 2 - 160, 270,
                    CONFIG["PRODUCT_PRICE"], CONFIG["ORIGINAL_PRICE"])
        glow = 0.6 + 0.4 * abs(math.sin(cta_t * 1.8))
        _draw_cta(d, W, H, CONFIG["CTA_TEXT"], glow)
        d.text((W // 2 - 170, H - 240),
               _clean(f"Visit: {CONFIG['CTA_LINK']}"), fill=GRAY, font=FONT["body"])
        _draw_urgency(d, W, H, t)
        if CONFIG["SHOW_COUNTDOWN"]:
            _draw_countdown(d, W, H, t)

    if CONFIG["SHOW_SUBSCRIBE_BTN"] and t > 4:
        _draw_subscribe(d, W, H, t)

    if CONFIG["SHOW_PROGRESS_BAR"]:
        _draw_progress_bar(d, W, H, t / duration)

    # Avatar overlay
    talking         = int(t * 8) % 5 != 0   # moving most of the time
    av_frame, by    = avatar_with_bounce(avatar_base, t, talking)
    frame           = _composite_avatar(frame, av_frame, by, W, H)

    # Fade in / fade out
    arr = np.array(frame, dtype=np.float32)
    if t < fade_dur:
        arr *= t / fade_dur
    elif t > duration - fade_dur:
        arr *= (duration - t) / fade_dur

    return arr.clip(0, 255).astype(np.uint8)

# ================================================================
# VIDEO ASSEMBLY
# ================================================================
def generate_video():
    print("=" * 60)
    print("  YouTube Sales Video Generator")
    print("=" * 60)

    os.makedirs("output",                  exist_ok=True)
    os.makedirs(CONFIG["SLIDES_FOLDER"],   exist_ok=True)

    # 1. Voiceover
    print("\n[1/4] Generating voiceover ...")
    audio_path = os.path.join(tempfile.gettempdir(), "sales_voiceover.wav")
    generate_voiceover(CONFIG["SALES_SCRIPT_FILE"], audio_path)

    # 2. Duration from audio
    total_duration = 45.0
    if os.path.exists(audio_path):
        try:
            clip = AudioFileClip(audio_path)
            total_duration = float(np.clip(clip.duration + 5, 30, 60))
            clip.close()
        except Exception as e:
            print(f"  Could not read audio length: {e}")
    print(f"  Video duration: {total_duration:.1f}s")

    # 3. Avatar
    print("\n[2/4] Preparing avatar ...")
    avatar_base = make_circular_avatar(CONFIG["AVATAR_FILE"], CONFIG["AVATAR_SIZE"])

    # 4. Slides
    print("\n[3/4] Loading product slides ...")
    slides = load_slides()
    print(f"  {len(slides)} slide(s) loaded")

    # 5. Render
    print("\n[4/4] Rendering frames ...")

    def make_frame(t):
        return build_frame(t, total_duration, avatar_base, slides)

    video = VideoClip(make_frame, duration=total_duration).set_fps(CONFIG["FPS"])

    # Audio: voiceover  (+ optional background music)
    if os.path.exists(audio_path):
        try:
            vo = AudioFileClip(audio_path)
            if vo.duration > total_duration:
                vo = vo.subclip(0, total_duration)

            final_audio = vo
            if os.path.exists(CONFIG["MUSIC_FILE"]):
                try:
                    music = AudioFileClip(CONFIG["MUSIC_FILE"]).volumex(0.12)
                    if music.duration < total_duration:
                        music = afx.audio_loop(music, duration=total_duration)
                    else:
                        music = music.subclip(0, total_duration)
                    final_audio = CompositeAudioClip([vo, music])
                    print("  Background music mixed in.")
                except Exception as me:
                    print(f"  Background music skipped: {me}")

            video = video.set_audio(final_audio)
        except Exception as ae:
            print(f"  Audio error: {ae}")

    # Write
    out = CONFIG["OUTPUT_FILE"]
    print(f"\nWriting -> {out}  (this takes a few minutes)")
    video.write_videofile(
        out,
        fps=CONFIG["FPS"],
        codec="libx264",
        audio_codec="aac",
        temp_audiofile="temp_audio.m4a",
        remove_temp=True,
        logger="bar",
        preset="medium",
        ffmpeg_params=["-crf", "23"],
    )

    print("\n" + "=" * 60)
    print(f"  Done!  Video saved to: {out}")
    print("=" * 60)
    return out


if __name__ == "__main__":
    generate_video()
