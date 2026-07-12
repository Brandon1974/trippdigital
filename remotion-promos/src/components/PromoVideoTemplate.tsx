import React, { useMemo } from 'react';
import {
  Composition,
  Sequence,
  useVideoConfig,
  interpolate,
  useCurrentFrame,
  AbsoluteFill,
  spring,
} from 'remotion';
import { BRAND, VIDEO_CONFIG } from '../lib/branding';
import { AnimatedGradientBg } from './AnimatedGradientBg';

interface PromoVideoProps {
  productName: string;
  headline: string;
  features: string[];
  price: number;
  screenshotPath: string;
}

// ===== SCENE 1: HOOK =====
const HookScene: React.FC<{ headline: string; duration: number }> = ({ headline, duration }) => {
  const frame = useCurrentFrame();
  const fps = useVideoConfig().fps;

  // Text slides in from bottom with fade
  const translateY = interpolate(frame, [0, fps * 0.8], [100, 0]);
  const opacity = interpolate(frame, [0, fps * 0.5], [0, 1]);

  // Pulse effect on text
  const scaleOverTime = spring({
    frame,
    fps,
    config: { damping: 10 },
    from: 0.95,
    to: 1,
    delay: fps * 0.5,
  });

  return (
    <Sequence from={0} durationInFrames={duration}>
      <AbsoluteFill style={{ background: BRAND.colors.black }}>
        <AnimatedGradientBg />

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 40px',
            zIndex: 10,
          }}
        >
          <h1
            style={{
              fontFamily: BRAND.fonts.heading,
              fontSize: BRAND.sizes.headingXL,
              fontWeight: 700,
              color: BRAND.colors.white,
              textAlign: 'center',
              margin: 0,
              lineHeight: 1.1,
              transform: `translateY(${translateY}px) scale(${scaleOverTime})`,
              opacity,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            {headline}
          </h1>
        </div>
      </AbsoluteFill>
    </Sequence>
  );
};

// ===== SCENE 2: PRODUCT SHOWCASE =====
const ProductScene: React.FC<{
  screenshotPath: string;
  features: string[];
  durationInFrames: number;
  startFrame: number;
}> = ({ screenshotPath, features, durationInFrames, startFrame }) => {
  const frame = useCurrentFrame();
  const fps = useVideoConfig().fps;

  // Ken Burns zoom effect
  const scale = interpolate(frame - startFrame, [0, fps * durationInFrames], [1, 1.15]);

  return (
    <Sequence from={startFrame} durationInFrames={durationInFrames}>
      <AbsoluteFill style={{ background: BRAND.colors.black }}>
        <AnimatedGradientBg />

        {/* Product screenshot with zoom */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '50%',
            transform: `translateX(-50%) scale(${scale})`,
            width: '90%',
            maxWidth: '500px',
            aspectRatio: '16 / 10',
            borderRadius: '16px',
            overflow: 'hidden',
            border: `3px solid ${BRAND.colors.orange}`,
            boxShadow: `0 0 30px rgba(255, 107, 0, 0.3)`,
            backgroundImage: `url(${screenshotPath})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 5,
          }}
        />

        {/* Feature bullets */}
        <div
          style={{
            position: 'absolute',
            bottom: '12%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '85%',
            zIndex: 10,
          }}
        >
          {features.map((feature, index) => {
            const featureFrame = frame - startFrame - fps * (0.5 + index * 0.3);
            const featureOpacity = interpolate(featureFrame, [0, fps * 0.4], [0, 1]);
            const featureTranslateX = interpolate(
              Math.min(featureFrame, fps * 0.4),
              [0, fps * 0.4],
              [-30, 0]
            );

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '16px',
                  opacity: Math.max(0, featureOpacity),
                  transform: `translateX(${featureTranslateX}px)`,
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: BRAND.colors.orange,
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    fontFamily: BRAND.fonts.body,
                    fontSize: BRAND.sizes.bodyLG,
                    color: BRAND.colors.white,
                    margin: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {feature}
                </p>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Sequence>
  );
};

// ===== SCENE 3: PRICE & CTA =====
const CTAScene: React.FC<{
  productName: string;
  price: number;
  durationInFrames: number;
  startFrame: number;
}> = ({ productName, price, durationInFrames, startFrame }) => {
  const frame = useCurrentFrame();
  const fps = useVideoConfig().fps;

  // Price pulse
  const priceScale = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 8 },
    from: 0.8,
    to: 1,
    delay: fps * 0.3,
  });

  // CTA button animation
  const ctaOpacity = interpolate(frame - startFrame, [fps * 1, fps * 1.3], [0, 1]);
  const ctaScale = interpolate(frame - startFrame, [fps * 1, fps * 1.3], [0.9, 1]);

  // Glowing effect on button
  const glowOpacity = interpolate(
    Math.sin(((frame - startFrame) / fps) * Math.PI * 2),
    [-1, 1],
    [0.2, 0.8]
  );

  return (
    <Sequence from={startFrame} durationInFrames={durationInFrames}>
      <AbsoluteFill style={{ background: BRAND.colors.black }}>
        <AnimatedGradientBg />

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '60px',
            padding: '60px 40px',
            zIndex: 10,
          }}
        >
          {/* Price section */}
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: BRAND.fonts.body,
                fontSize: BRAND.sizes.bodySM,
                color: BRAND.colors.lightGray,
                marginBottom: '16px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Get Started Today
            </div>
            <div
              style={{
                transform: `scale(${priceScale})`,
                transformOrigin: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: BRAND.fonts.heading,
                  fontSize: '80px',
                  fontWeight: 700,
                  color: BRAND.colors.orange,
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                ${price}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div
            style={{
              position: 'relative',
              opacity: ctaOpacity,
              transform: `scale(${ctaScale})`,
            }}
          >
            {/* Button glow */}
            <div
              style={{
                position: 'absolute',
                top: '-8px',
                left: '-8px',
                right: '-8px',
                bottom: '-8px',
                background: BRAND.colors.orange,
                borderRadius: '50px',
                opacity: glowOpacity * 0.3,
                filter: 'blur(16px)',
              }}
            />

            {/* Button */}
            <button
              style={{
                position: 'relative',
                padding: '18px 48px',
                fontSize: BRAND.sizes.bodyLG,
                fontFamily: BRAND.fonts.body,
                fontWeight: 700,
                color: BRAND.colors.black,
                background: BRAND.colors.orange,
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                boxShadow: `0 0 20px rgba(255, 107, 0, ${glowOpacity * 0.5})`,
              }}
            >
              Get at Payhip
            </button>
          </div>

          {/* Footer CTA */}
          <div
            style={{
              fontFamily: BRAND.fonts.body,
              fontSize: BRAND.sizes.bodySM,
              color: BRAND.colors.lightGray,
              textAlign: 'center',
              marginTop: '20px',
            }}
          >
            <p style={{ margin: '0 0 8px 0' }}>trippdigital.com</p>
            <p style={{ margin: '0 0 8px 0' }}>payhip.com/Tinytripp</p>
          </div>
        </div>
      </AbsoluteFill>
    </Sequence>
  );
};

// ===== MAIN COMPOSITION =====
export const PromoVideoTemplate: React.FC<PromoVideoProps> = ({
  productName,
  headline,
  features,
  price,
  screenshotPath,
}) => {
  const { fps } = useVideoConfig();

  // Scene timing
  const hookDuration = fps * 6; // 6 seconds
  const productDuration = fps * 10; // 10 seconds
  const ctaDuration = fps * 8; // 8 seconds

  return (
    <AbsoluteFill style={{ background: BRAND.colors.black }}>
      {/* Scene 1: Hook */}
      <HookScene headline={headline} duration={hookDuration} />

      {/* Scene 2: Product Showcase */}
      <ProductScene
        screenshotPath={screenshotPath}
        features={features}
        durationInFrames={productDuration}
        startFrame={hookDuration}
      />

      {/* Scene 3: CTA */}
      <CTAScene
        productName={productName}
        price={price}
        durationInFrames={ctaDuration}
        startFrame={hookDuration + productDuration}
      />
    </AbsoluteFill>
  );
};
