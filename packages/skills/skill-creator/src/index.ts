/**
 * Skill Creator Skill
 * Create custom skills and tools for the Fused Gaming MCP ecosystem
 */

import type { Skill, SkillConfig } from "@fused-gaming/mcp-core";
import { createSkillTool } from "./tools/create-skill.js";

export const skillCreatorSkill: Skill = {
  name: "skill-creator",
  version: "1.0.0",
  description:
    "Create custom skills and tools for the Fused Gaming MCP ecosystem with templates and generators",
  tools: [createSkillTool],

  async initialize(_config: SkillConfig): Promise<void> {
    console.log("[SkillCreator] Skill initialized");
  },

  async cleanup(): Promise<void> {
    console.log("[SkillCreator] Skill cleaned up");
  },
};

export default skillCreatorSkill;
