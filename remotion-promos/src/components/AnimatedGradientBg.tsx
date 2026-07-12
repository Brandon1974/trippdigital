import React, { useMemo } from 'react';
import { useVideoConfig, interpolate, useCurrentFrame } from 'remotion';
import { BRAND } from '../lib/branding';

export const AnimatedGradientBg: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slowly rotating gradient positions for subtle animation
  const rotation = interpolate(frame, [0, fps * 20], [0, 360]);
  const glowOpacity = interpolate(
    Math.sin((frame / fps) * Math.PI * 0.5),
    [-1, 1],
    [0.3, 0.8]
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: BRAND.colors.black,
        overflow: 'hidden',
      }}
    >
      {/* Base black background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: BRAND.colors.black,
        }}
      />

      {/* Animated gradient glow */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          filter: `blur(80px)`,
          opacity: glowOpacity * 0.4,
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center',
        }}
        viewBox="0 0 1080 1920"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={BRAND.colors.orange} stopOpacity="0.8" />
            <stop offset="100%" stopColor={BRAND.colors.black} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="540" cy="960" r="800" fill="url(#glowGradient)" />
      </svg>

      {/* Subtle grid overlay */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.05,
        }}
        viewBox="0 0 1080 1920"
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={BRAND.colors.orange} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1080" height="1920" fill="url(#grid)" />
      </svg>
    </div>
  );
};
