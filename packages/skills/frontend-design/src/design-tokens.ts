/**
 * SyncPulse Design Tokens v2
 * Purple neon theme with cinematic animations and glassmorphism
 * Enhanced with professional UI patterns from main page concept
 * Based on GitHub Issues #164 and #165
 */

export const designTokens = {
  // =========================================================
  // COLOR SYSTEM - Enhanced Palette
  // =========================================================
  colors: {
    // Core Purple Gradient (primary brand)
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

    // Neon accent colors with enhanced saturation
    neon: {
      purple: "#A855F7",      // Primary neon
      electric: "#8B5CF6",    // Electric purple
      ultraviolet: "#7C3AED", // Deep violet (hero gradients)
      plasma: "#C026D3",      // Hot pink/magenta
      cyberBlue: "#38BDF8",   // Cyan accent
      secureGreen: "#22C55E", // Success state
      warningPink: "#EC4899", // Warning state
      quantumIndigo: "#667eea",      // Quantum indigo primary
      quantumIndigoLight: "#8ea5f8", // Quantum indigo light variant
      quantumIndigoDark: "#4c3fa8",  // Quantum indigo dark variant
      quantumIndigoGlow: "rgba(102, 126, 234, 0.3)", // Quantum indigo glow effect
    },

    // Deep space background gradients
    background: {
      base: "#050508",                          // Cool digital black base
      elevated: "#0a0a0f",                      // Slightly elevated
      card: "#121218",                          // Card background
      panel: "#1a1a22",                         // Panel background
      overlay: "rgba(10, 5, 25, 0.82)",        // Modal overlay
      radialGradient: "radial-gradient(circle at 70% 40%, rgba(168,85,247,.22), transparent 34%), radial-gradient(circle at 20% 20%, rgba(192,38,211,.16), transparent 30%)",
    },

    // Glass morphism surfaces
    surface: {
      primary: "#181028",   // Primary glass surface
      secondary: "#21153A", // Secondary glass surface
      tertiary: "#2B1B4D",  // Tertiary glass surface
      glass: "rgba(18, 10, 36, 0.66)",   // 66% opacity glass
      glass2: "rgba(22, 15, 46, 0.76)",  // 76% opacity glass
    },

    // Borders with glow effects
    border: {
      subtle: "rgba(168, 85, 247, 0.15)",   // Very subtle
      default: "rgba(168, 85, 247, 0.25)",  // Enhanced from concept
      strong: "rgba(168, 85, 247, 0.65)",   // Strong border
      glow: "#A855F7",                       // Glow border
      light: "rgba(255, 255, 255, 0.15)",   // Light border
      lightTop: "rgba(255, 255, 255, 0.18)", // Lighter top
    },

    // Text hierarchy - Opacity-based system
    text: {
      primary: "rgba(255, 255, 255, 0.9)",    // Main text
      secondary: "rgba(255, 255, 255, 0.7)",  // Secondary text
      muted: "rgba(255, 255, 255, 0.6)",      // Muted text
      disabled: "rgba(255, 255, 255, 0.4)",   // Disabled text
      inverse: "#050508",                      // Inverse (on light)
      accent: "rgba(255, 255, 255, 0.95)",    // Accent text
    },

    // Semantic colors
    semantic: {
      success: "#22C55E",    // Success green
      warning: "#F59E0B",    // Warning amber
      danger: "#EF4444",     // Error red
      info: "#38BDF8",       // Info cyan
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
  // SHADOWS / GLOWS - Enhanced with Concept Styling
  // =========================================================
  shadows: {
    sm: "0 0 10px rgba(168,85,247,0.15)",
    md: "0 0 20px rgba(168,85,247,0.22)",
    lg: "0 0 40px rgba(168,85,247,0.35)",
    xl: "0 0 80px rgba(168,85,247,0.55)",
    innerGlow: "inset 0 0 18px rgba(168,85,247,0.22)",
    // Enhanced shadows from concept
    cardShadow: "0 24px 80px rgba(0,0,0,0.45), inset 0 0 28px rgba(168,85,247,0.06)",
    buttonGlow: "0 0 28px rgba(168,85,247,0.45)",
    mascotGlow: "drop-shadow(0 0 26px rgba(192,38,211,0.72)) drop-shadow(0 0 80px rgba(168,85,247,0.42))",
  },

  // =========================================================
  // EFFECTS - Glassmorphism & Professional UI
  // =========================================================
  effects: {
    // Premium glassmorphism from concept design
    glassmorphism: {
      background: "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
      blur: "22px",
      border: "1px solid rgba(255,255,255,0.08)",
      borderTop: "rgba(255,255,255,0.18)",
      borderLeft: "rgba(255,255,255,0.15)",
      saturate: "130%",
      shadow: "0 24px 80px rgba(0,0,0,0.45), inset 0 0 28px rgba(168,85,247,0.06)",
    },

    // Neon border effects
    neonBorder: {
      border: "1px solid rgba(168,85,247,0.65)",
      glow: "0 0 18px rgba(168,85,247,0.5)",
    },

    // Holographic gradient
    holographic:
      "linear-gradient(135deg, #7C3AED 0%, #A855F7 35%, #38BDF8 100%)",

    // Text gradient (from concept heading)
    textGradient: "linear-gradient(90deg, #ffffff, #d8b4fe 42%, #C026D3)",

    // Grid background pattern
    gridPattern: "linear-gradient(rgba(168,85,247,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.06) 1px, transparent 1px)",
  },

  // =========================================================
  // GRADIENTS - Enhanced Professional Palette
  // =========================================================
  gradients: {
    // Hero section gradient
    hero: "linear-gradient(135deg, #05010D 0%, #120A24 35%, #7C3AED 100%)",
    // Swarm orchestration gradient
    swarm: "radial-gradient(circle at center, rgba(168,85,247,0.45), rgba(5,1,13,0.98))",
    // Secure/success gradient
    secure: "linear-gradient(90deg, #22C55E, #38BDF8)",
    // Pulse animation gradient
    pulse: "linear-gradient(90deg, #A855F7, #C026D3, #38BDF8)",
    // Button gradient (from concept)
    button: "linear-gradient(135deg, #7C3AED, #C026D3)",
    // Brand gradient for mark/logo
    brand: "linear-gradient(135deg, #7C3AED, #C026D3)",
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
      quantumSlow: "1200ms",
      quantumExtended: "2000ms",
    },

    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      pulse: "ease-in-out",
      // Quantum-inspired easing functions
      quantum: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",        // smooth, elegant
      fastQuantum: "cubic-bezier(0.4, 0.0, 0.2, 1)",          // snappy
      slowQuantum: "cubic-bezier(0.25, 0.1, 0.25, 1)",        // deliberate
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

      // Quantum-inspired animations
      pulseQuantum: `
        @keyframes pulseQuantum {
          0% {
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.2);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 30px rgba(102, 126, 234, 0.6);
            transform: scale(1.05);
          }
          100% {
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.2);
            transform: scale(1);
          }
        }
      `,

      quantumNodeActivate: `
        @keyframes quantumNodeActivate {
          0% {
            opacity: 0.4;
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 35px rgba(102, 126, 234, 0.7);
          }
          100% {
            opacity: 1;
            box-shadow: 0 0 25px rgba(102, 126, 234, 0.5);
            transform: scale(1.1);
          }
        }
      `,

      networkFlow: `
        @keyframes networkFlow {
          0% {
            stroke-dashoffset: 1000;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
        }
      `,

      agentActive: `
        @keyframes agentActive {
          0%, 100% {
            box-shadow: 0 0 15px rgba(102, 126, 234, 0.3), inset 0 0 10px rgba(102, 126, 234, 0.1);
          }
          50% {
            box-shadow: 0 0 35px rgba(102, 126, 234, 0.7), inset 0 0 20px rgba(102, 126, 234, 0.2);
          }
        }
      `,

      swarmCoordinating: `
        @keyframes swarmCoordinating {
          0% {
            transform: rotate(0deg) translateX(40px);
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: rotate(360deg) translateX(40px);
            opacity: 1;
          }
        }
      `,

      taskProcessing: `
        @keyframes taskProcessing {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 200px 0;
          }
        }
      `,

      idleBreathing: `
        @keyframes idleBreathing {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
        }
      `,
    },
  },

  // =========================================================
  // COMPONENT TOKENS - Enhanced Professional Styling
  // =========================================================
  components: {
    button: {
      primary: {
        background: "linear-gradient(135deg, #7C3AED, #C026D3)",
        color: "#FFFFFF",
        border: "1px solid rgba(255,255,255,0.12)",
        shadow: "0 0 28px rgba(168,85,247,0.45)",
        padding: "14px 18px",
        borderRadius: "14px",
        fontWeight: "800",
      },

      secondary: {
        background: "rgba(255,255,255,0.05)",
        color: "#E9D5FF",
        border: "1px solid rgba(168,85,247,0.25)",
        padding: "14px 18px",
        borderRadius: "14px",
        fontWeight: "600",
      },

      danger: {
        background: "#EF4444",
        color: "#FFFFFF",
        shadow: "0 0 24px rgba(239,68,68,0.45)",
      },

      ghost: {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(168,85,247,0.25)",
      },
    },

    card: {
      background: "rgba(18,10,36,0.72)",
      border: "1px solid rgba(168,85,247,0.15)",
      radius: "24px",
      backdropBlur: "22px",
      shadow: "0 24px 80px rgba(0,0,0,0.45), inset 0 0 28px rgba(168,85,247,0.06)",
      padding: "24px",
    },

    input: {
      background: "#120A24",
      border: "1px solid rgba(168,85,247,0.2)",
      text: "#F5F3FF",
      placeholder: "#A78BFA",
      borderRadius: "14px",
      padding: "12px 16px",
    },

    terminal: {
      background: "#02040A",
      text: "#A855F7",
      accent: "#38BDF8",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    },

    badge: {
      background: "rgba(168, 85, 247, 0.14)",
      color: "#E9D5FF",
      borderRadius: "999px",
      fontSize: "12px",
      padding: "6px 10px",
    },

    status: {
      background: "rgba(5,1,13,0.58)",
      border: "1px solid rgba(168,85,247,0.32)",
      blur: "16px",
      borderRadius: "999px",
      padding: "14px 18px",
    },
  },

  // =========================================================
  // ICON SYSTEM - Replace Emojis with SVG Icons
  // =========================================================
  icons: {
    // Action Icons
    launch: "M13.5 4.5L19 10m-5.5-5.5h5.5m0 0v5.5M19 10l-7-7",
    view: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",

    // Status Icons
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    error: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
    warning: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",

    // Feature Icons
    zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    shield: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z",
    grid: "M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z",
    layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",

    // Navigation Icons
    chevronRight: "M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6-1.41-1.41z",
    chevronDown: "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z",

    // System Icons
    settings: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.1-.62l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.48.1.62l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.1.62l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.47.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.48-.1-.62l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
    bell: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z",

    // Agent Icons
    hexCore: "M12 2l3.09 1.5v3l2.58 1.5v3l-2.58 1.5v3L12 16l-3.09-1.5v-3l-2.58-1.5v-3l2.58-1.5v-3L12 2z",
    pulse: "M7 14c1.66 0 3-1.34 3-3 0-1.31-1.16-2.5-2.5-2.5S4.5 9.69 4.5 11c0 1.66 1.34 3 2.5 3zm13.71-9.71L12 2h-1v.71C6.11 3.14 2 7.29 2 12s4.11 8.86 9 9.29V22h1l8.71-8.71c.39-.39.39-1.02 0-1.41zM12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",

    // Data Icons
    chart: "M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z",
    trendUp: "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18 10 11.41l4 4 6.3-6.29L22 12v-6z",
  },

  // =========================================================
  // AI / SWARM TOKENS - Enhanced with Icon System
  // =========================================================
  agents: {
    orchestrator: {
      color: "#A855F7",
      icon: "hexCore",
      label: "Orchestrator",
      aura: "pulse",
    },

    sentinel: {
      color: "#22C55E",
      icon: "shield",
      label: "Sentinel",
      aura: "secure",
    },

    analyst: {
      color: "#38BDF8",
      icon: "chart",
      label: "Analyst",
      aura: "scan",
    },

    executor: {
      color: "#EC4899",
      icon: "zap",
      label: "Executor",
      aura: "kinetic",
    },
  },
} as const;

export type DesignTokens = typeof designTokens;
export type ColorTokens = typeof designTokens.colors;
export type TypographyTokens = typeof designTokens.typography;
export type MotionTokens = typeof designTokens.motion;
