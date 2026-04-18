/**
 * SVG Generator Skill
 * Generate SVG assets and icon concepts from structured prompts.
 */

import type { Skill, SkillConfig } from "@fused-gaming/mcp-core";
import { GenerateSvgAssetTool } from "./tools/generate-svg-asset.js";

export const SvgGeneratorSkill: Skill = {
  name: "svg-generator",
  version: "1.0.0",
  description: "Generate SVG assets and icon concepts from structured prompts.",
  tools: [GenerateSvgAssetTool],

  async initialize(_config: SkillConfig): Promise<void> {
    console.log("[SVG Generator] Skill initialized");
  },

  async cleanup(): Promise<void> {
    console.log("[SVG Generator] Skill cleaned up");
  },
};

export default SvgGeneratorSkill;
