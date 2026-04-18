/**
 * Project Status Tool Skill
 * Summarize current project status, risks, and next actions.
 */

import type { Skill, SkillConfig } from "@h4shed/mcp-core";
import { SummarizeProjectStatusTool } from "./tools/summarize-project-status.js";

export const ProjectStatusToolSkill: Skill = {
  name: "project-status-tool",
  version: "1.0.0",
  description: "Summarize current project status, risks, and next actions.",
  tools: [SummarizeProjectStatusTool],

  async initialize(_config: SkillConfig): Promise<void> {
    console.log("[Project Status Tool] Skill initialized");
  },

  async cleanup(): Promise<void> {
    console.log("[Project Status Tool] Skill cleaned up");
  },
};

export default ProjectStatusToolSkill;
