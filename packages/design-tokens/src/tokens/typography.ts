/**
 * SyncPulse Typography System
 * Font families, weights, sizes, and line heights
 */

export const typography = {
  // Font Families
  fontFamily: {
    display: '"Orbitron", "Rajdhani", system-ui, sans-serif',    // Headings
    body: '"Inter", "Manrope", system-ui, sans-serif',           // Body text
    mono: '"JetBrains Mono", "Fira Code", monospace'              // Code/Terminal
  },

  // Font Weights
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900
  },

  // Font Sizes
  fontSize: {
    xs: '0.75rem',        // 12px
    sm: '0.875rem',       // 14px
    base: '1rem',         // 16px
    lg: '1.125rem',       // 18px
    xl: '1.25rem',        // 20px
    '2xl': '1.5rem',      // 24px
    '3xl': '1.875rem',    // 30px
    '4xl': '2.25rem',     // 36px
    '5xl': '3rem',        // 48px
    '6xl': '3.75rem',     // 60px
    '7xl': '4.5rem',      // 72px
    '8xl': '6rem',        // 96px
    // Custom sizes
    hero: '7.5rem',       // 120px - Hero text
    display: '3.5rem'     // 56px - Display text
  },

  // Line Heights
  lineHeight: {
    tight: '1.1',        // For tight displays
    normal: '1.5',       // Default line height
    relaxed: '1.75',     // For readability
    loose: '2'           // Extra spacing
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    ultra: '0.1em'
  },

  // Text Styles (Composite)
  textStyles: {
    // Display styles
    displayLarge: {
      fontFamily: '"Orbitron", "Rajdhani", system-ui, sans-serif',
      fontSize: '7.5rem',
      fontWeight: 700,
      lineHeight: '1.1',
      letterSpacing: '0.1em'
    },
    displayMedium: {
      fontFamily: '"Orbitron", "Rajdhani", system-ui, sans-serif',
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: '1.1',
      letterSpacing: '0.05em'
    },
    displaySmall: {
      fontFamily: '"Orbitron", "Rajdhani", system-ui, sans-serif',
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: '1.2',
      letterSpacing: '0.025em'
    },

    // Heading styles
    h1: {
      fontFamily: '"Orbitron", "Rajdhani", system-ui, sans-serif',
      fontSize: '1.875rem',
      fontWeight: 700,
      lineHeight: '1.2',
      letterSpacing: '0.025em'
    },
    h2: {
      fontFamily: '"Orbitron", "Rajdhani", system-ui, sans-serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: '1.3',
      letterSpacing: '0em'
    },
    h3: {
      fontFamily: '"Rajdhani", system-ui, sans-serif',
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: '1.3',
      letterSpacing: '0em'
    },
    h4: {
      fontFamily: '"Rajdhani", system-ui, sans-serif',
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: '1.4',
      letterSpacing: '0em'
    },
    h5: {
      fontFamily: '"Manrope", system-ui, sans-serif',
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: '1.4',
      letterSpacing: '0em'
    },
    h6: {
      fontFamily: '"Manrope", system-ui, sans-serif',
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: '1.4',
      letterSpacing: '0.025em'
    },

    // Body text styles
    bodyLarge: {
      fontFamily: '"Inter", "Manrope", system-ui, sans-serif',
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: '1.6',
      letterSpacing: '0em'
    },
    body: {
      fontFamily: '"Inter", "Manrope", system-ui, sans-serif',
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.5',
      letterSpacing: '0em'
    },
    bodySmall: {
      fontFamily: '"Inter", "Manrope", system-ui, sans-serif',
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.5',
      letterSpacing: '0em'
    },

    // Caption styles
    caption: {
      fontFamily: '"Inter", system-ui, sans-serif',
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: '1.4',
      letterSpacing: '0.025em'
    },
    captionSmall: {
      fontFamily: '"Inter", system-ui, sans-serif',
      fontSize: '0.6875rem',
      fontWeight: 400,
      lineHeight: '1.3',
      letterSpacing: '0.05em'
    },

    // Mono/Code styles
    monoBold: {
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: '1.5',
      letterSpacing: '0em'
    },
    mono: {
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.5',
      letterSpacing: '0em'
    },
    monoSmall: {
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: '1.4',
      letterSpacing: '0em'
    }
  }
} as const;

export type TextStyle = keyof typeof typography.textStyles;
export type FontFamily = keyof typeof typography.fontFamily;
export type FontWeight = keyof typeof typography.fontWeight;
export type FontSize = keyof typeof typography.fontSize;
export type LineHeight = keyof typeof typography.lineHeight;
export type LetterSpacing = keyof typeof typography.letterSpacing;
