/**
 * Project Manager Skill
 * Plan projects with milestones, dependencies, and delivery phases.
 */

import type { Skill, SkillConfig } from "@h4shed/mcp-core";
import { PlanProjectTool } from "./tools/plan-project.js";

export const ProjectManagerSkill: Skill = {
  name: "project-manager",
  version: "1.0.0",
  description: "Plan projects with milestones, dependencies, and delivery phases.",
  tools: [PlanProjectTool],

  async initialize(_config: SkillConfig): Promise<void> {
    console.log("[Project Manager] Skill initialized");
  },

  async cleanup(): Promise<void> {
    console.log("[Project Manager] Skill cleaned up");
  },
};

export default ProjectManagerSkill;
