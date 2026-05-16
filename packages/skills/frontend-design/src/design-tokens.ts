/**
 * SyncPulse Design Tokens
 * Purple neon theme with cinematic animations
 * Based on GitHub Issues #164 and #165
 */

export const designTokens = {
  // =========================================================
  // COLOR SYSTEM
  // =========================================================
  colors: {
    primary: {
      50: "#F3E8FF",
      100: "#E9D5FF",
      200: "#D8B4FE",
      300: "#C084FC",
      400: "#A855F7",
      500: "#9333EA",
      600: "#7E22CE",
      700: "#6B21A8",
      800: "#581C87",
      900: "#3B0764",
    },

    neon: {
      purple: "#A855F7",
      electric: "#8B5CF6",
      ultraviolet: "#7C3AED",
      plasma: "#C026D3",
      cyberBlue: "#38BDF8",
      secureGreen: "#22C55E",
      warningPink: "#EC4899",
    },

    background: {
      base: "#05010D",
      elevated: "#0B0618",
      card: "#120A24",
      panel: "#160F2E",
      overlay: "rgba(10, 5, 25, 0.82)",
    },

    surface: {
      primary: "#181028",
      secondary: "#21153A",
      tertiary: "#2B1B4D",
    },

    border: {
      subtle: "rgba(168, 85, 247, 0.15)",
      default: "rgba(168, 85, 247, 0.30)",
      strong: "rgba(168, 85, 247, 0.65)",
      glow: "#A855F7",
    },

    text: {
      primary: "#F5F3FF",
      secondary: "#D8B4FE",
      muted: "#A78BFA",
      disabled: "#6B7280",
      inverse: "#05010D",
    },

    semantic: {
      success: "#22C55E",
      warning: "#F59E0B",
      danger: "#EF4444",
      info: "#38BDF8",
    },
  },

  // =========================================================
  // TYPOGRAPHY
  // =========================================================
  typography: {
    fontFamily: {
      heading: '"Orbitron", "Rajdhani", "Inter", sans-serif',
      body: '"Inter", "Manrope", sans-serif',
      mono: '"JetBrains Mono", "Fira Code", monospace',
    },

    fontWeight: {
      thin: 100,
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },

    fontSize: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "32px",
      "4xl": "40px",
      hero: "72px",
    },

    lineHeight: {
      tight: 1.1,
      normal: 1.5,
      relaxed: 1.8,
    },

    letterSpacing: {
      tighter: "-0.04em",
      tight: "-0.02em",
      normal: "0",
      wide: "0.08em",
      ultra: "0.22em",
    },
  },

  // =========================================================
  // SPACING
  // =========================================================
  spacing: {
    0: "0px",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
    24: "96px",
  },

  // =========================================================
  // BORDER RADIUS
  // =========================================================
  radius: {
    none: "0px",
    sm: "6px",
    md: "12px",
    lg: "18px",
    xl: "24px",
    pill: "999px",
  },

  // =========================================================
  // SHADOWS / GLOWS
  // =========================================================
  shadows: {
    sm: "0 0 10px rgba(168,85,247,0.15)",
    md: "0 0 20px rgba(168,85,247,0.22)",
    lg: "0 0 40px rgba(168,85,247,0.35)",
    xl: "0 0 80px rgba(168,85,247,0.55)",
    innerGlow: "inset 0 0 18px rgba(168,85,247,0.22)",
  },

  // =========================================================
  // EFFECTS
  // =========================================================
  effects: {
    glassmorphism: {
      background: "rgba(18, 10, 36, 0.65)",
      blur: "18px",
      border: "1px solid rgba(168,85,247,0.2)",
    },

    neonBorder: {
      border: "1px solid rgba(168,85,247,0.65)",
      glow: "0 0 18px rgba(168,85,247,0.5)",
    },

    holographic:
      "linear-gradient(135deg, #7C3AED 0%, #A855F7 35%, #38BDF8 100%)",
  },

  // =========================================================
  // GRADIENTS
  // =========================================================
  gradients: {
    hero: "linear-gradient(135deg, #05010D 0%, #120A24 35%, #7C3AED 100%)",
    swarm:
      "radial-gradient(circle at center, rgba(168,85,247,0.45), rgba(5,1,13,0.98))",
    secure: "linear-gradient(90deg, #22C55E, #38BDF8)",
    pulse: "linear-gradient(90deg, #A855F7, #C026D3, #38BDF8)",
  },

  // =========================================================
  // ANIMATION TOKENS
  // =========================================================
  motion: {
    duration: {
      instant: "80ms",
      fast: "160ms",
      normal: "280ms",
      slow: "420ms",
      cinematic: "900ms",
    },

    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      pulse: "ease-in-out",
    },

    keyframes: {
      pulseGlow: `
        @keyframes pulseGlow {
          from {
            box-shadow: 0 0 10px rgba(168,85,247,0.2);
          }
          to {
            box-shadow: 0 0 30px rgba(168,85,247,0.6);
          }
        }
      `,

      float: `
        @keyframes float {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(-6px);
          }
        }
      `,

      scanline: `
        @keyframes scanline {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 0 200px;
          }
        }
      `,

      glow: `
        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
          }
          50% {
            text-shadow: 0 0 40px rgba(168, 85, 247, 0.8);
          }
        }
      `,
    },
  },

  // =========================================================
  // COMPONENT TOKENS
  // =========================================================
  components: {
    button: {
      primary: {
        background: "#7C3AED",
        color: "#FFFFFF",
        border: "1px solid rgba(255,255,255,0.12)",
        shadow: "0 0 24px rgba(124,58,237,0.55)",
      },

      secondary: {
        background: "rgba(255,255,255,0.04)",
        color: "#E9D5FF",
        border: "1px solid rgba(168,85,247,0.25)",
      },

      danger: {
        background: "#EF4444",
        color: "#FFFFFF",
      },
    },

    card: {
      background: "rgba(18,10,36,0.72)",
      border: "1px solid rgba(168,85,247,0.15)",
      radius: "18px",
      backdropBlur: "18px",
    },

    input: {
      background: "#120A24",
      border: "1px solid rgba(168,85,247,0.2)",
      text: "#F5F3FF",
      placeholder: "#A78BFA",
    },

    terminal: {
      background: "#02040A",
      text: "#A855F7",
      accent: "#38BDF8",
    },
  },

  // =========================================================
  // AI / SWARM TOKENS
  // =========================================================
  agents: {
    orchestrator: {
      color: "#A855F7",
      icon: "hex-core",
      aura: "pulse",
    },

    sentinel: {
      color: "#22C55E",
      icon: "shield",
      aura: "secure",
    },

    analyst: {
      color: "#38BDF8",
      icon: "wave",
      aura: "scan",
    },

    executor: {
      color: "#EC4899",
      icon: "bolt",
      aura: "kinetic",
    },
  },
} as const;

export type DesignTokens = typeof designTokens;
export type ColorTokens = typeof designTokens.colors;
export type TypographyTokens = typeof designTokens.typography;
export type MotionTokens = typeof designTokens.motion;
