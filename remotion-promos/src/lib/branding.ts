// Tripp Digital Brand System
export const BRAND = {
  colors: {
    black: '#0D0D0D',
    orange: '#FF6B00',
    darkGray: '#1a1a1a',
    mediumGray: '#2a2a2a',
    lightGray: '#888888',
    white: '#ffffff',
  },
  fonts: {
    heading: 'Bebas Neue, sans-serif',
    body: 'Inter, sans-serif',
  },
  sizes: {
    headingXL: 72,
    headingLG: 48,
    headingMD: 36,
    bodyLG: 24,
    bodyMD: 18,
    bodySM: 14,
  },
  timing: {
    fast: 300,
    normal: 500,
    slow: 1000,
    verySlow: 2000,
  },
} as const;

export const VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInSeconds: 25,
} as const;
