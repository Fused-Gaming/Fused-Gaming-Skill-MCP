/**
 * SyncPulse Agent Tokens
 * Design tokens for agent personas and visual identity
 */

export const agentTokens = {
  // Orchestrator Agent
  orchestrator: {
    name: 'Orchestrator',
    color: '#A855F7',      // Purple
    colorLight: '#D8B4FE',
    colorDark: '#6B21A8',
    icon: 'hex-core',      // Icon identifier
    iconBackground: 'rgba(168, 85, 247, 0.1)',
    aura: 'pulse',         // Animation: pulse
    aureColor: 'rgba(168, 85, 247, 0.6)',
    borderColor: '#A855F7',
    glow: '0 0 16px rgba(168, 85, 247, 0.8)',
    shadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
    badge: {
      background: 'rgba(168, 85, 247, 0.1)',
      border: '#A855F7',
      text: '#A855F7'
    },
    cardBackground: 'rgba(168, 85, 247, 0.05)',
    description: 'Coordinates agent swarms and orchestrates task execution',
    role: 'Swarm Coordinator'
  },

  // Sentinel Agent
  sentinel: {
    name: 'Sentinel',
    color: '#22C55E',      // Green
    colorLight: '#86EFAC',
    colorDark: '#15803D',
    icon: 'shield',        // Icon identifier
    iconBackground: 'rgba(34, 197, 94, 0.1)',
    aura: 'secure',        // Animation: gentle glow
    aureColor: 'rgba(34, 197, 94, 0.5)',
    borderColor: '#22C55E',
    glow: '0 0 14px rgba(34, 197, 94, 0.7)',
    shadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
    badge: {
      background: 'rgba(34, 197, 94, 0.1)',
      border: '#22C55E',
      text: '#22C55E'
    },
    cardBackground: 'rgba(34, 197, 94, 0.05)',
    description: 'Monitors security and validates compliance across operations',
    role: 'Security Guardian'
  },

  // Analyst Agent
  analyst: {
    name: 'Analyst',
    color: '#0EA5E9',      // Cyan/Blue
    colorLight: '#7DD3FC',
    colorDark: '#0369A1',
    icon: 'wave',          // Icon identifier (data waves)
    iconBackground: 'rgba(14, 165, 233, 0.1)',
    aura: 'scan',          // Animation: scan/wave
    aureColor: 'rgba(14, 165, 233, 0.5)',
    borderColor: '#0EA5E9',
    glow: '0 0 14px rgba(14, 165, 233, 0.7)',
    shadow: '0 4px 12px rgba(14, 165, 233, 0.2)',
    badge: {
      background: 'rgba(14, 165, 233, 0.1)',
      border: '#0EA5E9',
      text: '#0EA5E9'
    },
    cardBackground: 'rgba(14, 165, 233, 0.05)',
    description: 'Analyzes data patterns and provides intelligence insights',
    role: 'Data Analyst'
  },

  // Executor Agent
  executor: {
    name: 'Executor',
    color: '#EC4899',      // Pink/Magenta
    colorLight: '#F472B6',
    colorDark: '#BE185D',
    icon: 'bolt',          // Icon identifier (lightning bolt)
    iconBackground: 'rgba(236, 72, 153, 0.1)',
    aura: 'kinetic',       // Animation: energetic
    aureColor: 'rgba(236, 72, 153, 0.6)',
    borderColor: '#EC4899',
    glow: '0 0 16px rgba(236, 72, 153, 0.8)',
    shadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
    badge: {
      background: 'rgba(236, 72, 153, 0.1)',
      border: '#EC4899',
      text: '#EC4899'
    },
    cardBackground: 'rgba(236, 72, 153, 0.05)',
    description: 'Executes tasks and manages operational workflows',
    role: 'Task Executor'
  }
} as const;

// Agent status tokens
export const agentStatus = {
  active: {
    color: '#22C55E',     // Green
    background: 'rgba(34, 197, 94, 0.1)',
    label: 'Active',
    icon: 'check-circle'
  },
  inactive: {
    color: '#6B7280',     // Gray
    background: 'rgba(107, 114, 128, 0.1)',
    label: 'Inactive',
    icon: 'circle'
  },
  pending: {
    color: '#F59E0B',     // Amber
    background: 'rgba(245, 158, 11, 0.1)',
    label: 'Pending',
    icon: 'hourglass'
  },
  error: {
    color: '#EF4444',     // Red
    background: 'rgba(239, 68, 68, 0.1)',
    label: 'Error',
    icon: 'alert-circle'
  },
  busy: {
    color: '#A855F7',     // Purple
    background: 'rgba(168, 85, 247, 0.1)',
    label: 'Busy',
    icon: 'spinner'
  }
} as const;

// Agent card presets
export const agentCardPresets = {
  orchestrator: {
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.05))',
    border: '2px solid rgba(168, 85, 247, 0.3)',
    glow: '0 0 20px rgba(168, 85, 247, 0.4)',
    headerBackground: 'rgba(168, 85, 247, 0.1)',
    accent: '#A855F7'
  },
  sentinel: {
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
    border: '2px solid rgba(34, 197, 94, 0.3)',
    glow: '0 0 20px rgba(34, 197, 94, 0.3)',
    headerBackground: 'rgba(34, 197, 94, 0.1)',
    accent: '#22C55E'
  },
  analyst: {
    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(14, 165, 233, 0.05))',
    border: '2px solid rgba(14, 165, 233, 0.3)',
    glow: '0 0 20px rgba(14, 165, 233, 0.3)',
    headerBackground: 'rgba(14, 165, 233, 0.1)',
    accent: '#0EA5E9'
  },
  executor: {
    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(236, 72, 153, 0.05))',
    border: '2px solid rgba(236, 72, 153, 0.3)',
    glow: '0 0 20px rgba(236, 72, 153, 0.4)',
    headerBackground: 'rgba(236, 72, 153, 0.1)',
    accent: '#EC4899'
  }
} as const;

// Agent icon size variants
export const agentIconSizes = {
  xs: '16px',
  sm: '20px',
  md: '24px',
  lg: '32px',
  xl: '48px',
  xxl: '64px'
} as const;

// Type exports
export type AgentName = keyof typeof agentTokens;
export type AgentStatusType = keyof typeof agentStatus;
export type AgentIconSize = keyof typeof agentIconSizes;
