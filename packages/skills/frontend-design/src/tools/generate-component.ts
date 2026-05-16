/**
 * Generate Component Tool
 * Creates animated React/Vue components with SyncPulse design tokens (purple color theme)
 */

import type { ToolDefinition } from "@h4shed/mcp-core";

interface ComponentInput {
  component: string;
  framework?: string;
  variant?: string;
  animated?: boolean;
}

const DESIGN_TOKENS = {
  colors: {
    purple: {
      primary: "#9333EA",
      neon: "#A855F7",
      electric: "#8B5CF6",
      ultraviolet: "#7C3AED",
      plasma: "#C026D3",
    },
    background: {
      base: "#05010D",
      card: "#120A24",
    },
    text: {
      primary: "#F5F3FF",
      secondary: "#D8B4FE",
    },
    border: {
      glow: "#A855F7",
    },
  },
  motion: {
    durations: {
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
  },
};

const ANIMATED_BUTTON = `
<style>
  @keyframes pulseGlow {
    from {
      box-shadow: 0 0 10px rgba(168, 85, 247, 0.2);
    }
    to {
      box-shadow: 0 0 30px rgba(168, 85, 247, 0.6);
    }
  }

  @keyframes float {
    from {
      transform: translateY(0px);
    }
    to {
      transform: translateY(-6px);
    }
  }

  .animated-button {
    background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%);
    color: #FFFFFF;
    border: 1px solid rgba(255, 255, 255, 0.12);
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: all 280ms cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: 0 0 24px rgba(124, 58, 237, 0.55);
  }

  .animated-button:hover {
    animation: pulseGlow 900ms ease-in-out infinite alternate;
    transform: translateY(-2px);
  }

  .animated-button:active {
    transform: translateY(0);
  }
</style>

<button class="animated-button">
  ✨ Animated Button
</button>`;

const ANIMATED_CARD = `
<style>
  @keyframes scanline {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 0 200px;
    }
  }

  .animated-card {
    background: rgba(18, 10, 36, 0.72);
    border: 1px solid rgba(168, 85, 247, 0.15);
    border-radius: 18px;
    backdrop-filter: blur(18px);
    padding: 24px;
    min-width: 300px;
    overflow: hidden;
  }

  .animated-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(168, 85, 247, 0.2),
      transparent
    );
    background-size: 200px 100%;
    animation: scanline 3s linear infinite;
    pointer-events: none;
  }

  .card-content {
    position: relative;
    z-index: 1;
  }

  .card-title {
    color: #F5F3FF;
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 12px 0;
  }

  .card-text {
    color: #A78BFA;
    font-size: 14px;
    line-height: 1.6;
  }
</style>

<div class="animated-card">
  <div class="card-content">
    <h3 class="card-title">Animated Card</h3>
    <p class="card-text">
      Beautiful glassmorphism effect with animated scanline overlay using purple neon colors
    </p>
  </div>
</div>`;

const ANIMATED_HERO = `
<style>
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes glow {
    0%, 100% {
      text-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
    }
    50% {
      text-shadow: 0 0 40px rgba(168, 85, 247, 0.8);
    }
  }

  .animated-hero {
    background: linear-gradient(135deg, #05010D 0%, #120A24 35%, #7C3AED 100%);
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 24px;
    overflow: hidden;
    position: relative;
  }

  .hero-content {
    text-align: center;
    z-index: 10;
    animation: float 4s ease-in-out infinite;
  }

  .hero-title {
    font-size: 48px;
    font-weight: 900;
    color: #F5F3FF;
    margin: 0 0 16px 0;
    animation: glow 2s ease-in-out infinite;
    letter-spacing: 0.08em;
  }

  .hero-subtitle {
    font-size: 20px;
    color: #D8B4FE;
    margin: 0;
  }
</style>

<div class="animated-hero">
  <div class="hero-content">
    <h1 class="hero-title">Animated Hero</h1>
    <p class="hero-subtitle">Elegant floating animation with glowing purple neon effect</p>
  </div>
</div>`;

function generateComponent(input: ComponentInput): string {
  const { component = "button" } = input;

  const components: Record<string, string> = {
    button: ANIMATED_BUTTON,
    card: ANIMATED_CARD,
    hero: ANIMATED_HERO,
  };

  return components[component.toLowerCase()] || `<!-- Component "${component}" not found -->`;
}

export const generateComponentTool: ToolDefinition = {
  name: "generate-component",
  description:
    "Generate animated frontend components with SyncPulse purple color tokens and cinematic motion effects",
  inputSchema: {
    type: "object",
    properties: {
      component: {
        type: "string",
        enum: ["button", "card", "hero"],
        description: "Component type: button, card, hero",
      },
      framework: {
        type: "string",
        enum: ["vanilla", "react", "vue"],
        description: "Framework: vanilla (HTML/CSS), react, vue (default: vanilla)",
      },
      animated: {
        type: "boolean",
        description: "Enable animations (default: true)",
      },
    },
    required: ["component"],
  },

  async handler(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      const params = input as unknown as ComponentInput;
      const html = generateComponent(params);

      return {
        success: true,
        component: params.component,
        framework: params.framework || "vanilla",
        animated: params.animated !== false,
        html,
        designTokens: DESIGN_TOKENS,
        message: "Animated component generated with purple SyncPulse color tokens",
      };
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate component: ${err}`);
    }
  },
};
