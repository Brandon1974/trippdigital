#!/usr/bin/env python3
"""
Create slideshow videos with ElevenLabs narration for lead magnets.
Requires: ffmpeg, Pillow, requests, elevenlabs Python SDK
"""

import os
import json
import time
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import subprocess
import requests
from elevenlabs.client import ElevenLabs

# Configuration
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
OUTPUT_DIR = Path("lead-magnets/videos")
IMAGES_DIR = Path("lead-magnets/slide-images")
AUDIO_DIR = Path("lead-magnets/audio")

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
        "voice_id": "21m00Tcm4TlvDq8ikWAM",  # Rachel (professional, clear)
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
        "voice_id": "onwK4e9ZjUvSHYXDvF00",  # Chris (friendly, professional)
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
        "voice_id": "EXAVITQu4vr4xnSDxMaL",  # Bella (warm, clear)
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

# Narration texts (shortened versions for timing)
NARRATIONS = {
    "claude": """Welcome to The Complete Guide to Prompting Claude in 2026. The difference between a weak prompt and a powerful one isn't about being clever. It's about structure and clarity. Every great Claude prompt has five essential components. First, give Claude a clear role or persona. Second, state your task explicitly. Third, provide detailed context. Fourth, specify your output format. And fifth, define your success criteria. Claude natively understands XML tags, which help organize complex information. For complex tasks, break them into two or three sequential prompts instead of asking for everything at once. Tell Claude what NOT to do—strong constraints are as valuable as strong instructions. Common mistakes include vague prompts, asking too many things at once, not specifying format, missing context, and not showing examples. Here's your template: one, your role. Two, explicit task. Three, context. Four, format. Five, success criteria. Pro tips: break complex tasks into sequential prompts, use XML tags, show examples, set clear constraints, and save your best prompts. Remember, structure beats cleverness every single time. Master these five components and you'll get exceptional results from Claude.""",

    "chatgpt": """Welcome to The Complete Guide to Prompting ChatGPT in 2026. Output quality is almost entirely determined by prompt quality. Vague prompts produce vague results. The gap between a mediocre prompt and a great one isn't cleverness, it's specificity. We use the PTCF Framework: Persona, Task, Context, Format. Persona means defining the role ChatGPT should adopt. Task means being crystal clear about what you want. Context means providing all relevant information. And Format means specifying exactly how you want the response structured. Here's your five-sentence formula: one, your role with specific expertise. Two, the task you want done. Three, key details about context. Four, how to structure the response. Five, any important constraints. That's it. Under 100 words, maximum impact. ChatGPT in 2026 has superpowers: web browsing, code execution, image generation with DALL-E, and memory across conversations. Leverage these explicitly. Common mistakes include unclear tasks, no format specified, missing context, too many things at once, and not using available tools. Pro tips: show examples, iterate, front-load important information, use memory, and chain prompts together. Remember: vague input equals vague output. Invest upfront in a clear, specific prompt.""",

    "gemini": """Welcome to The Complete Guide to Prompting Google Gemini in 2026. A single prompt does not work equally well across all Gemini models. Each model has its own personality and rewards different prompting styles. We use the PTCF Framework: Persona, Task, Context, Format. Different Gemini models need different approaches. Gemini 3.5 Flash works best with a task-chain approach—break complex requests into clear sequential steps. Gemini 3 Standard prefers rich narrative descriptions. Provide detailed context and descriptions for better results. Persona means defining the role and expertise. Task means stating exactly what Gemini should do. Context means providing all relevant information. And Format means telling Gemini exactly how to structure the response. One critical thing: keep Gemini's temperature at its default value of 1.0. Google optimized Gemini's reasoning for the default temperature. Changing it can reduce quality. Gemini in 2026 is multimodal. You can provide text, images, even video. Leverage this. Include relevant images when helpful. Pro tips: match the model to your task, use rich descriptions, be specific about what you want, provide complete context, and use sequential steps for complex tasks. Master the four-part framework and you'll get exceptional results from Gemini."""
}


def create_image_directory():
    """Create directories for output files."""
    OUTPUT_DIR.mkdir(exist_ok=True, parents=True)
    IMAGES_DIR.mkdir(exist_ok=True, parents=True)
    AUDIO_DIR.mkdir(exist_ok=True, parents=True)


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


def generate_audio(narration_text, guide_name, voice_id):
    """Generate audio using ElevenLabs API."""
    if not ELEVENLABS_API_KEY:
        print("ERROR: ELEVENLABS_API_KEY environment variable not set")
        return None

    client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

    print(f"Generating audio for {guide_name}...")

    audio = client.generate(
        text=narration_text,
        voice=voice_id,
        model="eleven_monologue_v1"
    )

    audio_path = AUDIO_DIR / f"{guide_name}_narration.mp3"
    with open(audio_path, "wb") as f:
        for chunk in audio:
            f.write(chunk)

    print(f"✓ Audio saved to {audio_path}")
    return audio_path


def create_slideshow_video(guide_name, audio_path, slides_info):
    """Create slideshow video from slides and audio."""
    print(f"\nCreating slideshow video for {guide_name}...")

    # Create image list file for ffmpeg
    image_list_file = IMAGES_DIR / f"{guide_name}_images.txt"

    with open(image_list_file, "w") as f:
        for i, slide in enumerate(slides_info):
            image_path = IMAGES_DIR / f"{guide_name}_slide_{i:02d}.png"
            duration = slide.get("duration", 3)
            f.write(f"file '{image_path}'\n")
            f.write(f"duration {duration}\n")

    output_video = OUTPUT_DIR / f"{guide_name}-prompting-guide.mp4"

    # Use ffmpeg to create video with audio
    cmd = [
        "ffmpeg",
        "-f", "concat",
        "-safe", "0",
        "-i", str(image_list_file),
        "-i", str(audio_path),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-shortest",
        "-y",
        str(output_video)
    ]

    subprocess.run(cmd, check=True)
    print(f"✓ Video created: {output_video}")
    return output_video


def main():
    """Main function to create all slideshow videos."""
    print("=" * 60)
    print("Creating Slideshow Videos with ElevenLabs Narration")
    print("=" * 60)

    # Check for required environment variable
    if not ELEVENLABS_API_KEY:
        print("\n⚠️  ELEVENLABS_API_KEY not set!")
        print("Set it with: export ELEVENLABS_API_KEY='your-key-here'")
        print("\nTo get your API key:")
        print("1. Go to https://elevenlabs.io")
        print("2. Sign up for free")
        print("3. Go to Account → API Key")
        print("4. Copy your key")
        return

    create_image_directory()

    for guide_name, guide_config in GUIDES.items():
        print(f"\n{'='*60}")
        print(f"Processing: {guide_name.upper()}")
        print(f"{'='*60}")

        # Create slide images
        print(f"\nCreating {len(guide_config['slides'])} slide images...")
        for i, slide in enumerate(guide_config['slides']):
            create_slide_image(slide, guide_name, i, {
                "color_bg": guide_config["color_bg"],
                "color_accent": guide_config["color_accent"],
                "color_text": guide_config["color_text"]
            })
        print(f"✓ {len(guide_config['slides'])} slides created")

        # Generate audio narration
        narration_text = NARRATIONS[guide_name]
        audio_path = generate_audio(narration_text, guide_name, guide_config["voice_id"])

        if not audio_path:
            print(f"✗ Failed to generate audio for {guide_name}")
            continue

        # Create slideshow video
        time.sleep(2)  # Brief pause between API calls
        create_slideshow_video(guide_name, audio_path, guide_config['slides'])

    print(f"\n{'='*60}")
    print("✓ All slideshow videos created successfully!")
    print(f"{'='*60}")
    print(f"\nVideos location: {OUTPUT_DIR}")
    print("\nYour videos are ready for Instagram/TikTok!")


if __name__ == "__main__":
    main()
