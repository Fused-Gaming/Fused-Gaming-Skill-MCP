/**
 * ASCII Mockup Skill
 * Mobile-first ASCII wireframe mockup generator for rapid UI prototyping
 */

import type { Skill, SkillConfig } from "@fused-gaming/mcp-core";
import { generateMockupTool } from "./tools/generate-mockup.js";

export const asciiMockupSkill: Skill = {
  name: "ascii-mockup",
  version: "1.0.0",
  description:
    "Generate mobile-first ASCII wireframe mockups for rapid UI prototyping and layout planning",
  tools: [generateMockupTool],

  async initialize(config: SkillConfig): Promise<void> {
    console.log("[ASCIIMockup] Skill initialized");
  },

  async cleanup(): Promise<void> {
    console.log("[ASCIIMockup] Skill cleaned up");
  },
};

export default asciiMockupSkill;
