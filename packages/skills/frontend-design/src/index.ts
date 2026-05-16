/**
 * Frontend Design Skill
 * Frontend component design and HTML/CSS generation for modern web applications
 */

import type { Skill, SkillConfig } from "@h4shed/mcp-core";
import { generateComponentTool } from "./tools/generate-component.js";
import { designTokens } from "./design-tokens.js";

export const frontendDesignSkill: Skill = {
  name: "frontend-design",
  version: "1.0.0",
  description:
    "Design animated frontend components with SyncPulse purple neon theme and HTML/CSS generation",
  tools: [generateComponentTool],

  async initialize(_config: SkillConfig): Promise<void> {
    console.log("[FrontendDesign] Skill initialized with SyncPulse design tokens");
  },

  async cleanup(): Promise<void> {
    console.log("[FrontendDesign] Skill cleaned up");
  },
};

// Export design tokens for use in components
export { designTokens };
export type { DesignTokens, ColorTokens, TypographyTokens, MotionTokens } from "./design-tokens.js";

export default frontendDesignSkill;
