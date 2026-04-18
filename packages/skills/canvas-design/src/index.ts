/**
 * Canvas Design Skill
 * Visual design generation for web with SVG and canvas rendering
 */

import type { Skill, SkillConfig } from "@h4shed/mcp-core";
import { generateSVGDesignTool } from "./tools/generate-svg.js";

export const canvasDesignSkill: Skill = {
  name: "canvas-design",
  version: "1.0.0",
  description:
    "Generate visual designs for web with SVG and canvas rendering capabilities",
  tools: [generateSVGDesignTool],

  async initialize(_config: SkillConfig): Promise<void> {
    console.log("[CanvasDesign] Skill initialized");
  },

  async cleanup(): Promise<void> {
    console.log("[CanvasDesign] Skill cleaned up");
  },
};

export default canvasDesignSkill;
