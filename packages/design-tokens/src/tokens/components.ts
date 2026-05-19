/**
 * SyncPulse Component Tokens
 * Design tokens for UI components (buttons, cards, inputs, etc.)
 */

export const componentTokens = {
  // Button Component Tokens
  button: {
    primary: {
      background: '#A855F7',
      backgroundHover: '#9333EA',
      backgroundActive: '#7E22CE',
      color: '#FFFFFF',
      border: 'rgba(168, 85, 247, 0.5)',
      borderHover: 'rgba(168, 85, 247, 0.8)',
      shadow: '0 0 12px rgba(168, 85, 247, 0.4)',
      shadowHover: '0 0 20px rgba(168, 85, 247, 0.6)'
    },
    secondary: {
      background: 'rgba(168, 85, 247, 0.1)',
      backgroundHover: 'rgba(168, 85, 247, 0.2)',
      backgroundActive: 'rgba(168, 85, 247, 0.3)',
      color: '#A855F7',
      border: 'rgba(168, 85, 247, 0.3)',
      borderHover: 'rgba(168, 85, 247, 0.6)',
      shadow: 'none',
      shadowHover: '0 0 12px rgba(168, 85, 247, 0.3)'
    },
    danger: {
      background: '#EF4444',
      backgroundHover: '#DC2626',
      backgroundActive: '#B91C1C',
      color: '#FFFFFF',
      border: 'rgba(239, 68, 68, 0.5)',
      borderHover: 'rgba(239, 68, 68, 0.8)',
      shadow: '0 0 12px rgba(239, 68, 68, 0.4)',
      shadowHover: '0 0 20px rgba(239, 68, 68, 0.6)'
    },
    disabled: {
      background: '#6B7280',
      color: '#9CA3AF',
      border: 'rgba(107, 114, 128, 0.3)',
      shadow: 'none'
    }
  },

  // Card Component Tokens
  card: {
    background: '#1A1A2E',
    backgroundElevated: '#16213E',
    border: 'rgba(168, 85, 247, 0.2)',
    borderGlow: 'rgba(168, 85, 247, 0.4)',
    radius: '8px',
    radiusLarge: '12px',
    blur: 'blur(8px)',
    blurStrong: 'blur(12px)',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    shadowGlow: '0 0 12px rgba(168, 85, 247, 0.4)',
    shadowElevated: '0 8px 24px rgba(0, 0, 0, 0.2)'
  },

  // Input Component Tokens
  input: {
    background: 'rgba(26, 26, 46, 0.8)',
    backgroundFocus: 'rgba(26, 26, 46, 1)',
    border: 'rgba(168, 85, 247, 0.2)',
    borderFocus: 'rgba(168, 85, 247, 0.6)',
    borderError: 'rgba(239, 68, 68, 0.6)',
    text: '#FFFFFF',
    textPlaceholder: '#9CA3AF',
    textDisabled: '#6B7280',
    radius: '6px',
    shadow: 'none',
    shadowFocus: '0 0 8px rgba(168, 85, 247, 0.4)',
    shadowError: '0 0 8px rgba(239, 68, 68, 0.3)'
  },

  // Badge Component Tokens
  badge: {
    success: {
      background: 'rgba(34, 197, 94, 0.1)',
      color: '#22C55E',
      border: 'rgba(34, 197, 94, 0.3)'
    },
    warning: {
      background: 'rgba(245, 158, 11, 0.1)',
      color: '#F59E0B',
      border: 'rgba(245, 158, 11, 0.3)'
    },
    error: {
      background: 'rgba(239, 68, 68, 0.1)',
      color: '#EF4444',
      border: 'rgba(239, 68, 68, 0.3)'
    },
    info: {
      background: 'rgba(14, 165, 233, 0.1)',
      color: '#0EA5E9',
      border: 'rgba(14, 165, 233, 0.3)'
    },
    default: {
      background: 'rgba(168, 85, 247, 0.1)',
      color: '#A855F7',
      border: 'rgba(168, 85, 247, 0.3)'
    }
  },

  // Terminal Component Tokens
  terminal: {
    background: '#0F0F1E',
    backgroundAlt: '#16213E',
    text: '#00FF00',
    textMuted: '#00AA00',
    textError: '#FF3333',
    textWarning: '#FFAA00',
    cursor: '#00FF00',
    selection: 'rgba(0, 255, 0, 0.2)',
    border: 'rgba(0, 255, 0, 0.3)',
    glow: '0 0 8px rgba(0, 255, 0, 0.4)',
    scrollbar: 'rgba(168, 85, 247, 0.3)',
    scrollbarThumb: 'rgba(168, 85, 247, 0.6)'
  },

  // Alert Component Tokens
  alert: {
    success: {
      background: 'rgba(34, 197, 94, 0.1)',
      border: 'rgba(34, 197, 94, 0.3)',
      text: '#22C55E',
      icon: '#22C55E'
    },
    warning: {
      background: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.3)',
      text: '#F59E0B',
      icon: '#F59E0B'
    },
    error: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.3)',
      text: '#EF4444',
      icon: '#EF4444'
    },
    info: {
      background: 'rgba(14, 165, 233, 0.1)',
      border: 'rgba(14, 165, 233, 0.3)',
      text: '#0EA5E9',
      icon: '#0EA5E9'
    }
  },

  // Modal/Dialog Component Tokens
  modal: {
    overlay: 'rgba(15, 15, 30, 0.8)',
    overlayBlur: 'blur(8px)',
    background: '#1A1A2E',
    border: 'rgba(168, 85, 247, 0.2)',
    radius: '12px',
    shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
    glowShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
  },

  // Menu Component Tokens
  menu: {
    background: '#1A1A2E',
    backgroundHover: 'rgba(168, 85, 247, 0.1)',
    backgroundActive: 'rgba(168, 85, 247, 0.2)',
    text: '#FFFFFF',
    textHover: '#A855F7',
    border: 'rgba(168, 85, 247, 0.2)',
    radius: '6px',
    shadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
  },

  // Tooltip Component Tokens
  tooltip: {
    background: '#16213E',
    text: '#FFFFFF',
    border: 'rgba(168, 85, 247, 0.2)',
    radius: '6px',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    padding: '8px 12px'
  },

  // Navigation Component Tokens
  navigation: {
    background: '#0F0F1E',
    backgroundHover: 'rgba(168, 85, 247, 0.1)',
    backgroundActive: 'rgba(168, 85, 247, 0.2)',
    text: '#FFFFFF',
    textMuted: '#9CA3AF',
    textActive: '#A855F7',
    border: 'rgba(168, 85, 247, 0.2)',
    divider: 'rgba(168, 85, 247, 0.1)',
    shadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },

  // Spinner/Loader Component Tokens
  spinner: {
    primary: '#A855F7',
    secondary: 'rgba(168, 85, 247, 0.3)',
    background: 'rgba(168, 85, 247, 0.1)',
    glow: '0 0 12px rgba(168, 85, 247, 0.6)'
  },

  // Toggle/Switch Component Tokens
  toggle: {
    backgroundOff: '#4B5563',
    backgroundOn: '#A855F7',
    thumbColor: '#FFFFFF',
    border: 'rgba(168, 85, 247, 0.2)',
    glowOn: '0 0 8px rgba(168, 85, 247, 0.5)'
  },

  // Progress Bar Component Tokens
  progress: {
    background: 'rgba(168, 85, 247, 0.1)',
    fill: '#A855F7',
    fillSuccess: '#22C55E',
    fillWarning: '#F59E0B',
    fillError: '#EF4444',
    glow: '0 0 8px rgba(168, 85, 247, 0.4)',
    radius: '4px'
  },

  // Tag Component Tokens
  tag: {
    background: 'rgba(168, 85, 247, 0.1)',
    border: 'rgba(168, 85, 247, 0.3)',
    text: '#A855F7',
    removeButtonHover: 'rgba(168, 85, 247, 0.2)',
    radius: '6px'
  }
} as const;

export type ComponentToken = typeof componentTokens;
export type ComponentName = keyof typeof componentTokens;
