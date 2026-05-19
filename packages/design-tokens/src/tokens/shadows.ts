/**
 * SyncPulse Shadow & Glow System
 * Purple-neon shadows and glassmorphism effects
 */

export const shadows = {
  // Shadow values
  shadowSmall: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMedium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  shadowLarge: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  shadowXL: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',

  // Purple neon glows
  glowSmall: '0 0 8px rgba(168, 85, 247, 0.4)',
  glowMedium: '0 0 16px rgba(168, 85, 247, 0.6)',
  glowLarge: '0 0 24px rgba(168, 85, 247, 0.8)',
  glowXL: '0 0 32px rgba(168, 85, 247, 1)',

  // Cyan/Electric glows
  glowCyan: '0 0 12px rgba(6, 182, 212, 0.6)',
  glowElectric: '0 0 16px rgba(139, 92, 246, 0.8)',

  // Green secure glow
  glowSecure: '0 0 12px rgba(34, 197, 94, 0.5)',

  // Pink/Plasma glow
  glowPlasma: '0 0 16px rgba(236, 72, 153, 0.7)',

  // Inner glows (for inset effects)
  innerGlowSmall: 'inset 0 0 8px rgba(168, 85, 247, 0.2)',
  innerGlowMedium: 'inset 0 0 16px rgba(168, 85, 247, 0.3)',
  innerGlowLarge: 'inset 0 0 24px rgba(168, 85, 247, 0.4)',

  // Neon border glow
  neonBorder: '0 0 1px rgba(168, 85, 247, 1), 0 0 8px rgba(168, 85, 247, 0.6)',
  neonBorderStrike: 'inset 0 0 8px rgba(168, 85, 247, 0.3)',

  // Multi-layer glows (intensive)
  glowIntense: `
    0 0 8px rgba(168, 85, 247, 0.4),
    0 0 16px rgba(168, 85, 247, 0.3),
    0 0 24px rgba(168, 85, 247, 0.2)
  `,

  // Glassmorphism backdrop blur
  glass: {
    backdrop: 'blur(8px)',
    backdropStrong: 'blur(12px)',
    backdropXStrong: 'blur(16px)'
  },

  // Elevation shadows (material-inspired)
  elevation: {
    // Card elevations
    level0: '0 0 0 rgba(0, 0, 0, 0)',
    level1: '0 1px 3px rgba(0, 0, 0, 0.12)',
    level2: '0 4px 6px rgba(0, 0, 0, 0.12)',
    level3: '0 8px 12px rgba(0, 0, 0, 0.15)',
    level4: '0 12px 24px rgba(0, 0, 0, 0.15)',
    level5: '0 16px 32px rgba(0, 0, 0, 0.2)'
  },

  // Composite shadow effects
  cardShadow: {
    shadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    neonGlow: '0 0 12px rgba(168, 85, 247, 0.4)'
  },
  cardElevated: {
    shadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    neonGlow: '0 0 16px rgba(168, 85, 247, 0.6)'
  },

  // Button states
  buttonDefault: '0 2px 4px rgba(0, 0, 0, 0.1)',
  buttonHover: '0 4px 12px rgba(168, 85, 247, 0.3), 0 0 8px rgba(168, 85, 247, 0.4)',
  buttonActive: 'inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 12px rgba(168, 85, 247, 0.6)',

  // Input focus glow
  inputFocus: '0 0 0 3px rgba(168, 85, 247, 0.1), 0 0 8px rgba(168, 85, 247, 0.4)',

  // Animated pulse (for loaders)
  pulseGlow: `
    0 0 8px rgba(168, 85, 247, 0.4),
    0 0 12px rgba(168, 85, 247, 0.2)
  `,

  // Scanline effect overlay
  scanline: 'inset 0 0 0 1px rgba(168, 85, 247, 0.1)'
} as const;

// Computed shadow combinations for common use cases
export const shadowPresets = {
  // Card shadows
  card: {
    boxShadow: shadows.cardShadow.shadow,
    filter: `drop-shadow(0 0 12px rgba(168, 85, 247, 0.4))`
  },
  cardElevated: {
    boxShadow: shadows.cardElevated.shadow,
    filter: `drop-shadow(0 0 16px rgba(168, 85, 247, 0.6))`
  },

  // Button shadows
  button: {
    boxShadow: shadows.buttonDefault
  },
  buttonHover: {
    boxShadow: shadows.buttonHover
  },
  buttonActive: {
    boxShadow: shadows.buttonActive
  },

  // Input focus
  inputFocus: {
    boxShadow: shadows.inputFocus
  },

  // Text effects
  textShadow: {
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
  },
  textGlow: {
    textShadow: '0 0 8px rgba(168, 85, 247, 0.6)'
  }
} as const;

export type ShadowKey = keyof typeof shadows;
export type ElevationLevel = keyof typeof shadows.elevation;
