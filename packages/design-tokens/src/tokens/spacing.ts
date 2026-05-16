/**
 * SyncPulse Spacing System
 * 4px base unit scaling from 0 to 24 (96px)
 */

export const spacing = {
  // Base spacing scale (in px)
  0: '0px',
  1: '4px',      // 0.25rem
  2: '8px',      // 0.5rem
  3: '12px',     // 0.75rem
  4: '16px',     // 1rem
  5: '20px',     // 1.25rem
  6: '24px',     // 1.5rem
  8: '32px',     // 2rem
  10: '40px',    // 2.5rem
  12: '48px',    // 3rem
  16: '64px',    // 4rem
  20: '80px',    // 5rem
  24: '96px'     // 6rem
} as const;

// Common spacing combinations
export const spacingSets = {
  // Padding presets
  paddingXS: {
    padding: spacing[2]
  },
  paddingSM: {
    padding: spacing[3]
  },
  paddingMD: {
    padding: spacing[4]
  },
  paddingLG: {
    padding: spacing[6]
  },
  paddingXL: {
    padding: spacing[8]
  },
  paddingXXL: {
    padding: spacing[12]
  },

  // Padding horizontal/vertical
  paddingX: {
    paddingLeft: spacing[4],
    paddingRight: spacing[4]
  },
  paddingY: {
    paddingTop: spacing[4],
    paddingBottom: spacing[4]
  },
  paddingXLg: {
    paddingLeft: spacing[6],
    paddingRight: spacing[6]
  },
  paddingYLg: {
    paddingTop: spacing[6],
    paddingBottom: spacing[6]
  },

  // Margin presets
  marginXS: {
    margin: spacing[2]
  },
  marginSM: {
    margin: spacing[3]
  },
  marginMD: {
    margin: spacing[4]
  },
  marginLG: {
    margin: spacing[6]
  },
  marginXL: {
    margin: spacing[8]
  },

  // Gap presets (for flex/grid)
  gapXS: {
    gap: spacing[2]
  },
  gapSM: {
    gap: spacing[3]
  },
  gapMD: {
    gap: spacing[4]
  },
  gapLG: {
    gap: spacing[6]
  },
  gapXL: {
    gap: spacing[8]
  },
  gapXXL: {
    gap: spacing[12]
  }
} as const;

// Component spacing presets
export const componentSpacing = {
  // Button padding
  buttonSM: {
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    paddingLeft: spacing[3],
    paddingRight: spacing[3]
  },
  buttonMD: {
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    paddingLeft: spacing[4],
    paddingRight: spacing[4]
  },
  buttonLG: {
    paddingTop: spacing[3],
    paddingBottom: spacing[3],
    paddingLeft: spacing[6],
    paddingRight: spacing[6]
  },

  // Input padding
  inputPadding: {
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    paddingLeft: spacing[3],
    paddingRight: spacing[3]
  },

  // Card padding
  cardPaddingSM: {
    padding: spacing[3]
  },
  cardPaddingMD: {
    padding: spacing[4]
  },
  cardPaddingLG: {
    padding: spacing[6]
  },

  // Sidebar spacing
  sidebarPadding: {
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[4]
  },

  // Modal padding
  modalPadding: {
    padding: spacing[6]
  },

  // Section spacing
  sectionMargin: {
    marginBottom: spacing[8]
  },
  sectionGap: {
    gap: spacing[6]
  }
} as const;

export type SpacingValue = keyof typeof spacing;
export type SpacingKey = keyof typeof spacing;
