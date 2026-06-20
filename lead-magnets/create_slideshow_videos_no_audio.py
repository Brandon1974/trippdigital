#!/usr/bin/env python3
"""
Create slideshow videos (no audio) - you'll add voiceover yourself.
Requires: ffmpeg, Pillow
"""

import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import subprocess

# Configuration
OUTPUT_DIR = Path("lead-magnets/videos")
IMAGES_DIR = Path("lead-magnets/slide-images")

# Video settings
VIDEO_WIDTH = 1080
VIDEO_HEIGHT = 1920  # 9:16 aspect ratio
FPS = 24
BRAND = "Trippdigital.com"

# Slide data for each guide
GUIDES = {
    "claude": {
        "color_bg": (25, 45, 85),  # Dark blue
        "color_accent": (100, 150, 255),  # Light blue
        "color_text": (255, 255, 255),  # White
        "slides": [
            {"title": "The Complete Guide to\nPrompting Claude (2026)", "duration": 3},
            {"title": "Core Principle", "text": "Structure Over\nCleverness", "duration": 2},
            {"title": "5 Essential Components", "text": "1. Clear Role\n2. Explicit Task\n3. Detailed Context\n4. Output Format\n5. Success Criteria", "duration": 3},
            {"title": "Advanced Strategies", "text": "• XML Tags\n• Sequential Prompting\n• Context Engineering", "duration": 3},
            {"title": "The Art of Constraints", "text": "Tell Claude what NOT to do\n\nAvoid: jargon, passive voice\nInclude: examples, numbers", "duration": 3},
            {"title": "Common Mistakes", "text": "❌ Vague prompts\n❌ Too many things at once\n❌ No format specified\n❌ Missing context", "duration": 3},
            {"title": "Your Template", "text": "1. Role/Persona\n2. Explicit Task\n3. Context\n4. Format\n5. Success Criteria", "duration": 3},
            {"title": "Pro Tips", "text": "✓ Break into sequential prompts\n✓ Use XML tags\n✓ Show examples\n✓ Set constraints\n✓ Save your best prompts", "duration": 3},
            {"title": "Final Thought", "text": "Structure beats cleverness.\nEvery time.\n\nMaster these 5 components.", "duration": 4},
        ]
    },
    "chatgpt": {
        "color_bg": (20, 20, 30),  # Dark gray
        "color_accent": (255, 120, 0),  # Orange
        "color_text": (255, 255, 255),  # White
        "slides": [
            {"title": "The Complete Guide to\nPrompting ChatGPT (2026)", "duration": 3},
            {"title": "Core Principle", "text": "Specificity Wins\nEvery Time", "duration": 2},
            {"title": "PTCF Framework", "text": "P - Persona\nT - Task\nC - Context\nF - Format", "duration": 2},
            {"title": "Persona", "text": "Define the role\nInclude expertise level\nBe specific", "duration": 2},
            {"title": "Task", "text": "Crystal clear\nUse action verbs\nBe explicit", "duration": 2},
            {"title": "Context", "text": "Industry?\nAudience?\nConstraints?\nProvide all background", "duration": 2},
            {"title": "Format", "text": "Bullets?\nParagraphs?\nTable?\nCode?\nBe explicit.", "duration": 2},
            {"title": "The 5-Sentence Formula", "text": "1. Your role\n2. The task\n3. Key details\n4. Response structure\n5. Constraints\n\nUnder 100 words. Maximum impact.", "duration": 3},
            {"title": "ChatGPT's Superpowers", "text": "🌐 Web browsing\n💻 Code execution\n🎨 Image generation (DALL-E)\n💾 Memory across chats", "duration": 2},
            {"title": "The Golden Rule", "text": "Vague input =\nVague output\n\nInvest in clarity upfront.", "duration": 3},
        ]
    },
    "gemini": {
        "color_bg": (15, 20, 40),  # Very dark blue
        "color_accent": (66, 133, 244),  # Google blue
        "color_text": (255, 255, 255),  # White
        "slides": [
            {"title": "The Complete Guide to\nPrompting Google Gemini (2026)", "duration": 3},
            {"title": "Core Principle", "text": "Different Models =\nDifferent Styles", "duration": 2},
            {"title": "PTCF Framework", "text": "P - Persona\nT - Task\nC - Context\nF - Format", "duration": 2},
            {"title": "Model-Specific Approaches", "text": "Gemini 3.5 Flash\nTask-chain approach\n\nGemini 3 Standard\nRich descriptions", "duration": 3},
            {"title": "Persona", "text": "Define the role\nInclude expertise\nSpecify domain", "duration": 2},
            {"title": "Task", "text": "Be crystal clear\nState your goal\nBe specific", "duration": 2},
            {"title": "Context", "text": "Industry?\nTime period?\nData available?\nProvide all context", "duration": 2},
            {"title": "Format", "text": "Bullets?\nSections?\nTable?\nSpecify structure", "duration": 2},
            {"title": "Important Setting", "text": "Keep temperature at default: 1.0\n\nDon't change it.\nIt's already optimized.", "duration": 2},
            {"title": "Gemini Superpowers", "text": "📊 Multimodal input\n🖼️ Image understanding\n🎬 Video analysis\n📈 Complex reasoning", "duration": 2},
            {"title": "Your Success Formula", "text": "Clear persona +\nExplicit task +\nComplete context +\nSpecified format =\nExceptional results", "duration": 3},
        ]
    }
}


def create_directories():
    """Create output directories."""
    OUTPUT_DIR.mkdir(exist_ok=True, parents=True)
    IMAGES_DIR.mkdir(exist_ok=True, parents=True)


def create_slide_image(text_content, guide_name, slide_num, colors):
    """Create a single slide image with text and branding."""
    img = Image.new("RGB", (VIDEO_WIDTH, VIDEO_HEIGHT), colors["color_bg"])
    draw = ImageDraw.Draw(img)

    # Try to use a nice font, fall back to default
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
        text_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 60)
        brand_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 40)
    except:
        title_font = ImageFont.load_default()
        text_font = ImageFont.load_default()
        brand_font = ImageFont.load_default()

    # Draw main content
    content = text_content.get("text", "")
    if content:
        # Center text vertically
        text_y = 400
        for line in content.split("\n"):
            bbox = draw.textbbox((0, 0), line, font=text_font)
            text_width = bbox[2] - bbox[0]
            text_x = (VIDEO_WIDTH - text_width) // 2
            draw.text((text_x, text_y), line, fill=colors["color_accent"], font=text_font)
            text_y += 120

    # Draw branding at bottom right
    brand_text = BRAND
    bbox = draw.textbbox((0, 0), brand_text, font=brand_font)
    brand_width = bbox[2] - bbox[0]
    brand_height = bbox[3] - bbox[1]
    draw.text(
        (VIDEO_WIDTH - brand_width - 40, VIDEO_HEIGHT - brand_height - 40),
        brand_text,
        fill=colors["color_text"],
        font=brand_font
    )

    # Save image
    image_path = IMAGES_DIR / f"{guide_name}_slide_{slide_num:02d}.png"
    img.save(image_path)
    return image_path


def create_slideshow_video(guide_name, slides_info):
    """Create slideshow video from slides (no audio)."""
    print(f"Creating slideshow video for {guide_name}...")

    # Create image list file for ffmpeg
    image_list_file = IMAGES_DIR / f"{guide_name}_images.txt"

    with open(image_list_file, "w") as f:
        for i, slide in enumerate(slides_info):
            image_path = (IMAGES_DIR / f"{guide_name}_slide_{i:02d}.png").absolute()
            duration = slide.get("duration", 3)
            f.write(f"file '{image_path}'\n")
            f.write(f"duration {duration}\n")

    output_video = OUTPUT_DIR / f"{guide_name}-prompting-guide.mp4"

    # Use ffmpeg to create video (no audio)
    cmd = [
        "ffmpeg",
        "-f", "concat",
        "-safe", "0",
        "-i", str(image_list_file),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-y",
        str(output_video)
    ]

    subprocess.run(cmd, check=True, capture_output=True)
    print(f"✓ Video created: {output_video}")
    return output_video


def main():
    """Main function to create all slideshow videos."""
    print("=" * 60)
    print("Creating Slideshow Videos (No Audio)")
    print("=" * 60)

    create_directories()

    for guide_name, guide_config in GUIDES.items():
        print(f"\n{'='*60}")
        print(f"Processing: {guide_name.upper()}")
        print(f"{'='*60}")

        # Create slide images
        print(f"Creating {len(guide_config['slides'])} slide images...")
        for i, slide in enumerate(guide_config['slides']):
            create_slide_image(slide, guide_name, i, {
                "color_bg": guide_config["color_bg"],
                "color_accent": guide_config["color_accent"],
                "color_text": guide_config["color_text"]
            })
        print(f"✓ {len(guide_config['slides'])} slides created")

        # Create slideshow video
        create_slideshow_video(guide_name, guide_config['slides'])

    print(f"\n{'='*60}")
    print("✓ All slideshow videos created!")
    print(f"{'='*60}")
    print(f"\nVideos ready at: {OUTPUT_DIR}")
    print("\nNow you can add your own voiceover using:")
    print("- Adobe Premiere Pro")
    print("- DaVinci Resolve")
    print("- CapCut")
    print("- Any video editor with audio track")


if __name__ == "__main__":
    main()
