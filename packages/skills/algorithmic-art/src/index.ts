/**
 * Algorithmic Art Skill
 * Generative art using p5.js with seeded randomness, flow fields, and particle systems
 */

import type { Skill, SkillConfig } from "@fused-gaming/mcp-core";
import { generateArtTool } from "./tools/generate-art.js";
import { createFlowFieldTool } from "./tools/flow-field.js";

export const algorithmicArtSkill: Skill = {
  name: "algorithmic-art",
  version: "1.0.0",
  description:
    "Generate algorithmic and generative art using p5.js with seeded randomness, flow fields, and particle systems",
  tools: [generateArtTool, createFlowFieldTool],

  async initialize(config: SkillConfig): Promise<void> {
    // Initialize any required API keys or configurations
    if (config.apiKeys?.algArtKey) {
      // Store key for use in tools
    }
    console.log("[AlgorithmicArt] Skill initialized");
  },

  async cleanup(): Promise<void> {
    console.log("[AlgorithmicArt] Skill cleaned up");
  },
};

export default algorithmicArtSkill;
