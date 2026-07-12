#!/usr/bin/env node

/**
 * Render script for Tripp Digital Promo Videos
 * Usage: node render.js [videoName]
 *
 * Example: node render.js pickleball
 */

import { renderMedia, selectComposition } from 'remotion';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videoName = process.argv[2] || 'default';
const outputDir = path.join(__dirname, 'output');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputFile = path.join(outputDir, `${videoName}-${Date.now()}.mp4`);

console.log(`🎬 Rendering Tripp Digital Promo: ${videoName}`);
console.log(`📁 Output: ${outputFile}`);

(async () => {
  try {
    const comp = await selectComposition({
      serveUrl: 'http://localhost:3000',
      id: 'PromoVideo',
      inputProps: {},
    });

    console.log('⏳ Rendering (this may take a minute)...');

    await renderMedia({
      composition: comp,
      serveUrl: 'http://localhost:3000',
      codec: 'h264',
      crf: 28,
      outputLocation: outputFile,
    });

    console.log(`✅ Done! Video saved to: ${outputFile}`);
    console.log(`📊 File size: ${(fs.statSync(outputFile).size / 1024 / 1024).toFixed(1)}MB`);
  } catch (err) {
    console.error('❌ Render failed:', err);
    process.exit(1);
  }
})();
