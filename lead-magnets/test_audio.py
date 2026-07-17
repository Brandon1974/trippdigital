#!/usr/bin/env python3
"""
Test ElevenLabs Text-to-Speech audio - hear how it sounds before creating videos.
Uses your free ElevenLabs credits.
"""

from pathlib import Path
from elevenlabs.client import ElevenLabs
import os

# Get API key from environment
API_KEY = os.getenv("ELEVENLABS_API_KEY")

if not API_KEY:
    print("ERROR: ELEVENLABS_API_KEY not set!")
    print("\nSet it with:")
    print('  export ELEVENLABS_API_KEY="your-key-here"')
    print("\nYour API key is at: https://elevenlabs.io/app/account → API Key")
    exit(1)

# Create audio directory
AUDIO_DIR = Path("lead-magnets/audio")
AUDIO_DIR.mkdir(exist_ok=True, parents=True)

# Initialize ElevenLabs client
client = ElevenLabs(api_key=API_KEY)

# Voice options (pick one)
VOICES = {
    "rachel": "21m00Tcm4TlvDq8ikWAM",      # Professional, clear, female
    "chris": "onwK4e9ZjUvSHYXDvF00",       # Friendly, male
    "bella": "EXAVITQu4vr4xnSDxMaL",       # Warm, female
    "adam": "pNInz6obpgDQGcFmaJgB",        # Deep, male
}

# Narration texts
NARRATIONS = {
    "claude": """Welcome to The Complete Guide to Prompting Claude in 2026. The difference between a weak prompt and a powerful one isn't about being clever. It's about structure and clarity. Every great Claude prompt has five essential components. First, give Claude a clear role or persona. Second, state your task explicitly. Third, provide detailed context. Fourth, specify your output format. And fifth, define your success criteria. Claude natively understands XML tags, which help organize complex information. For complex tasks, break them into two or three sequential prompts instead of asking for everything at once. Tell Claude what NOT to do. Strong constraints are as valuable as strong instructions. Common mistakes include vague prompts, asking too many things at once, not specifying format, missing context, and not showing examples. Here's your template: one, your role. Two, explicit task. Three, context. Four, format. Five, success criteria. Pro tips: break complex tasks into sequential prompts, use XML tags, show examples, set clear constraints, and save your best prompts. Remember, structure beats cleverness every single time. Master these five components and you'll get exceptional results from Claude.""",

    "chatgpt": """Welcome to The Complete Guide to Prompting ChatGPT in 2026. Output quality is almost entirely determined by prompt quality. Vague prompts produce vague results. The gap between a mediocre prompt and a great one isn't cleverness, it's specificity. We use the PTCF Framework: Persona, Task, Context, Format. Persona means defining the role ChatGPT should adopt. Task means being crystal clear about what you want. Context means providing all relevant information. And Format means specifying exactly how you want the response structured. Here's your five sentence formula: one, your role with specific expertise. Two, the task you want done. Three, key details about context. Four, how to structure the response. Five, any important constraints. That's it. Under one hundred words, maximum impact. ChatGPT in 2026 has superpowers: web browsing, code execution, image generation with DALL-E, and memory across conversations. Leverage these explicitly. Common mistakes include unclear tasks, no format specified, missing context, too many things at once, and not using available tools. Pro tips: show examples, iterate, front-load important information, use memory, and chain prompts together. Remember: vague input equals vague output. Invest upfront in a clear, specific prompt.""",

    "gemini": """Welcome to The Complete Guide to Prompting Google Gemini in 2026. A single prompt does not work equally well across all Gemini models. Each model has its own personality and rewards different prompting styles. We use the PTCF Framework: Persona, Task, Context, Format. Different Gemini models need different approaches. Gemini 3.5 Flash works best with a task-chain approach. Break complex requests into clear sequential steps. Gemini 3 Standard prefers rich narrative descriptions. Provide detailed context and descriptions for better results. Persona means defining the role and expertise. Task means stating exactly what Gemini should do. Context means providing all relevant information. And Format means telling Gemini exactly how to structure the response. One critical thing: keep Gemini's temperature at its default value of one point zero. Google optimized Gemini's reasoning for the default temperature. Changing it can reduce quality. Gemini in 2026 is multimodal. You can provide text, images, even video. Leverage this. Include relevant images when helpful. Pro tips: match the model to your task, use rich descriptions, be specific about what you want, provide complete context, and use sequential steps for complex tasks. Master the four-part framework and you'll get exceptional results from Gemini."""
}

print("=" * 60)
print("Testing ElevenLabs TTS Audio")
print("=" * 60)

for guide_name, narration_text in NARRATIONS.items():
    print(f"\nGenerating audio for {guide_name.upper()}...")
    print(f"Text length: {len(narration_text)} characters")

    try:
        # Generate audio with ElevenLabs
        audio = client.generate(
            text=narration_text,
            voice=VOICES["rachel"],  # Using Rachel voice
            model="eleven_monologue_v1"
        )

        # Save audio
        audio_path = AUDIO_DIR / f"{guide_name}_narration.mp3"
        with open(audio_path, "wb") as f:
            for chunk in audio:
                f.write(chunk)

        print(f"✓ Saved: {audio_path}")
        print(f"  Ready to download and listen!")

    except Exception as e:
        print(f"✗ Error: {e}")

print("\n" + "=" * 60)
print("✓ Audio files generated with ElevenLabs!")
print("=" * 60)
print("\nAudio files location: lead-magnets/audio/")
print("\nNext steps:")
print("1. Download the MP3 files")
print("2. Listen to them")
print("3. Tell me if you like the quality")
print("4. If yes, we create the full slideshow videos")
