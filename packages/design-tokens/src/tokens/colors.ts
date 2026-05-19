/**
 * SyncPulse Color System
 * Purple-neon cyberpunk theme with accessible semantic colors
 */

export const colors = {
  // Primary Purple Gradient (50-900)
  primary: {
    50: '#F3E8FF',
    100: '#E9D5FF',
    200: '#D8B4FE',
    300: '#C084FC',
    400: '#A855F7',
    500: '#9333EA',
    600: '#7E22CE',
    700: '#6B21A8',
    800: '#581C87',
    900: '#3B0764'
  },

  // Neon Color Palette
  neon: {
    purple: '#A855F7',     // Primary neon
    electric: '#8B5CF6',   // Secondary purple
    ultraviolet: '#A78BFA', // Light neon
    plasma: '#EC4899',     // Hot pink neon
    cyberBlue: '#0EA5E9',  // Cyber blue
    secureGreen: '#22C55E', // Secure green
    warningPink: '#F43F5E'  // Warning pink
  },

  // Background Colors
  background: {
    base: '#0F0F1E',       // Deep dark blue
    elevated: '#1A1A2E',   // Elevated surface
    card: '#16213E',       // Card background
    panel: '#0E1621',      // Panel background
    overlay: 'rgba(15, 15, 30, 0.8)' // Semi-transparent overlay
  },

  // Surface Colors
  surface: {
    primary: '#1E1B4B',    // Primary surface
    secondary: '#312E81',  // Secondary surface
    tertiary: '#4C1D95'    // Tertiary surface
  },

  // Border Colors
  border: {
    subtle: 'rgba(168, 85, 247, 0.1)',   // Subtle purple border
    default: 'rgba(168, 85, 247, 0.3)',  // Default border
    strong: 'rgba(168, 85, 247, 0.6)',   // Strong border
    glow: '#A855F7'                      // Glowing border
  },

  // Text Colors
  text: {
    primary: '#FFFFFF',                  // Primary text
    secondary: '#D1D5DB',                // Secondary text (gray)
    muted: '#9CA3AF',                    // Muted text
    disabled: '#6B7280',                 // Disabled text
    inverse: '#0F0F1E'                   // Inverse text (on light)
  },

  // Semantic Colors
  semantic: {
    success: '#22C55E',   // Success green
    warning: '#F59E0B',   // Warning amber
    danger: '#EF4444',    // Danger red
    info: '#0EA5E9'       // Info blue
  },

  // Status Colors
  status: {
    active: '#22C55E',    // Active (green)
    inactive: '#6B7280',  // Inactive (gray)
    pending: '#F59E0B',   // Pending (amber)
    error: '#EF4444',     // Error (red)
    warning: '#F59E0B',   // Warning (amber)
    success: '#22C55E'    // Success (green)
  },

  // Grayscale
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
} as const;

// Type for color values
export type ColorValue = typeof colors[keyof typeof colors];
export type AllColors = typeof colors;
