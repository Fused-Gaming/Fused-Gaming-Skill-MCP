/**
 * SyncPulse Motion & Animation System
 * Durations, easing curves, and keyframe animations
 */

export const motion = {
  // Animation Durations
  duration: {
    instant: '80ms',      // Instant interactions
    fast: '160ms',        // Fast feedback
    normal: '280ms',      // Standard animations
    slow: '420ms',        // Slow transitions
    cinematic: '900ms'    // Cinematic effects
  },

  // Easing Curves
  easing: {
    // Default easing (ease-in-out cubic)
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Smooth curves
    smooth: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smoothEnter: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smoothExit: 'cubic-bezier(0.34, 1.56, 0.64, 1)',

    // Linear easing
    linear: 'linear',

    // Ease-in (accelerating)
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInQuad: 'cubic-bezier(0.11, 0, 0.5, 0)',
    easeInCubic: 'cubic-bezier(0.32, 0, 0.67, 0)',
    easeInQuart: 'cubic-bezier(0.5, 0, 0.75, 0)',
    easeInQuint: 'cubic-bezier(0.64, 0, 0.78, 0)',

    // Ease-out (decelerating)
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeOutQuad: 'cubic-bezier(0.5, 1, 0.89, 1)',
    easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
    easeOutQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
    easeOutQuint: 'cubic-bezier(0.22, 1, 0.36, 1)',

    // Ease-in-out (accelerate then decelerate)
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeInOutQuad: 'cubic-bezier(0.45, 0, 0.55, 1)',
    easeInOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',

    // Special curves
    pulse: 'cubic-bezier(0.4, 0, 0.6, 1)',     // Pulse effect
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Bounce effect
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' // Elastic effect
  },

  // Animation Presets
  animation: {
    fadeIn: {
      animation: `fadeIn 280ms cubic-bezier(0.34, 1.56, 0.64, 1)`
    },
    fadeOut: {
      animation: `fadeOut 280ms cubic-bezier(0.34, 1.56, 0.64, 1)`
    },
    slideInUp: {
      animation: `slideInUp 280ms cubic-bezier(0.34, 1.56, 0.64, 1)`
    },
    slideOutDown: {
      animation: `slideOutDown 280ms cubic-bezier(0.34, 1.56, 0.64, 1)`
    },
    scaleIn: {
      animation: `scaleIn 280ms cubic-bezier(0.34, 1.56, 0.64, 1)`
    },
    scaleOut: {
      animation: `scaleOut 280ms cubic-bezier(0.34, 1.56, 0.64, 1)`
    },
    pulse: {
      animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`
    },
    float: {
      animation: `float 3s ease-in-out infinite`
    },
    scanline: {
      animation: `scanline 8s linear infinite`
    },
    shimmer: {
      animation: `shimmer 2s infinite`
    },
    spin: {
      animation: `spin 1s linear infinite`
    }
  },

  // Transition Presets
  transition: {
    default: 'all 280ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 160ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 420ms cubic-bezier(0.4, 0, 0.2, 1)',
    color: 'color 280ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    background: 'background-color 280ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: 'box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 280ms cubic-bezier(0.4, 0, 0.2, 1)'
  }
} as const;

// Keyframe animations CSS-in-JS friendly format
export const keyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,

  fadeOut: `
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `,

  slideInUp: `
    @keyframes slideInUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,

  slideOutDown: `
    @keyframes slideOutDown {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(20px);
        opacity: 0;
      }
    }
  `,

  scaleIn: `
    @keyframes scaleIn {
      from {
        transform: scale(0.95);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,

  scaleOut: `
    @keyframes scaleOut {
      from {
        transform: scale(1);
        opacity: 1;
      }
      to {
        transform: scale(0.95);
        opacity: 0;
      }
    }
  `,

  // Pulse effect (opacity)
  pulse: `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `,

  // Pulse glow effect
  pulseGlow: `
    @keyframes pulseGlow {
      0%, 100% {
        opacity: 1;
        box-shadow: 0 0 8px rgba(168, 85, 247, 0.4);
      }
      50% {
        opacity: 0.8;
        box-shadow: 0 0 16px rgba(168, 85, 247, 0.8);
      }
    }
  `,

  // Float animation
  float: `
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
    }
  `,

  // Scanline effect (horizontal lines)
  scanline: `
    @keyframes scanline {
      0% {
        transform: translateY(-100%);
      }
      100% {
        transform: translateY(100%);
      }
    }
  `,

  // Shimmer effect (for loading)
  shimmer: `
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
  `,

  // Spin animation
  spin: `
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,

  // Blink effect
  blink: `
    @keyframes blink {
      0%, 50%, 100% {
        opacity: 1;
      }
      25%, 75% {
        opacity: 0.5;
      }
    }
  `,

  // Glow intensify
  glowPulse: `
    @keyframes glowPulse {
      0%, 100% {
        filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.4));
      }
      50% {
        filter: drop-shadow(0 0 16px rgba(168, 85, 247, 0.8));
      }
    }
  `,

  // Slide in from left
  slideInLeft: `
    @keyframes slideInLeft {
      from {
        transform: translateX(-30px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,

  // Slide in from right
  slideInRight: `
    @keyframes slideInRight {
      from {
        transform: translateX(30px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,

  // Rotate in
  rotateIn: `
    @keyframes rotateIn {
      from {
        transform: rotate(-10deg);
        opacity: 0;
      }
      to {
        transform: rotate(0deg);
        opacity: 1;
      }
    }
  `
} as const;

export type DurationKey = keyof typeof motion.duration;
export type EasingKey = keyof typeof motion.easing;
export type AnimationKey = keyof typeof motion.animation;
export type KeyframeKey = keyof typeof keyframes;
