import React from 'react';
import { Composition } from 'remotion';
import { PromoVideoTemplate } from './components/PromoVideoTemplate';
import { VIDEO_CONFIG } from './lib/branding';

/**
 * EDIT THESE VARIABLES TO CREATE NEW PROMO VIDEOS
 *
 * Example:
 * productName: "Pickleball Score Tracker"
 * headline: "Track scores, stats & rivalries"
 * features: ["Real-time scoring", "Player analytics", "Share results instantly"]
 * price: 12
 * screenshotPath: "/path/to/screenshot.jpg"
 */

// ===== EXAMPLE: Pickleball Tracker =====
const PICKLEBALL_CONFIG = {
  productName: 'Pickleball Score & Stats Tracker',
  headline: 'Track Scores & Master Your Game',
  features: [
    'Real-time scoring and match tracking',
    'Player stats and performance analytics',
    'Share results and compete with friends',
  ],
  price: 12,
  screenshotPath: 'https://via.placeholder.com/500x300?text=Pickleball+Tracker',
};

export const PromoVideo: React.FC = () => {
  return (
    <Composition
      id="PromoVideo"
      component={PromoVideoTemplate}
      durationInFrames={VIDEO_CONFIG.fps * VIDEO_CONFIG.durationInSeconds}
      fps={VIDEO_CONFIG.fps}
      width={VIDEO_CONFIG.width}
      height={VIDEO_CONFIG.height}
      defaultProps={PICKLEBALL_CONFIG}
    />
  );
};

/**
 * HOW TO CREATE A NEW PRODUCT VIDEO:
 *
 * 1. Define your product config above (duplicate PICKLEBALL_CONFIG as a template)
 * 2. Update these values:
 *    - productName: The full product name
 *    - headline: Catchy one-liner hook (up to 8 words)
 *    - features: Array of 3 key feature descriptions (1-2 lines each)
 *    - price: Numeric price (without $)
 *    - screenshotPath: Path to product screenshot (PNG/JPG, ~500x300px)
 *
 * 3. Update the defaultProps in the Composition below
 *
 * 4. Run: npm start to preview, or
 *    npm run build to render the final MP4
 *
 * 5. Customize:
 *    - Video length: Change VIDEO_CONFIG.durationInSeconds (currently 25)
 *    - Scene timing: Edit hookDuration, productDuration, ctaDuration in PromoVideoTemplate.tsx
 *    - Colors/fonts: Edit BRAND object in src/lib/branding.ts
 *
 * The template automatically handles:
 * ✓ Animated gradient background on all scenes
 * ✓ Ken Burns zoom on product screenshot
 * ✓ Staggered feature animations
 * ✓ Pulsing price animation
 * ✓ Glowing CTA button
 * ✓ Responsive text sizing for vertical format (1080x1920)
 */
