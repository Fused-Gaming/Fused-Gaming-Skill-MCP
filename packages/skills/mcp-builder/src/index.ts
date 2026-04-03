/**
 * MCP Builder Skill
 * Build and scaffold MCP servers and skills with best practices
 */

import type { Skill, SkillConfig } from "@fused-gaming/mcp-core";
import { scaffoldSkillTool } from "./tools/scaffold-skill.js";

export const mcpBuilderSkill: Skill = {
  name: "mcp-builder",
  version: "1.0.0",
  description:
    "Build and scaffold MCP servers and skills following best practices and architecture patterns",
  tools: [scaffoldSkillTool],

  async initialize(_config: SkillConfig): Promise<void> {
    console.log("[MCPBuilder] Skill initialized");
  },

  async cleanup(): Promise<void> {
    console.log("[MCPBuilder] Skill cleaned up");
  },
};

export default mcpBuilderSkill;
