/**
 * Project Status Tool Skill
 * Summarize current project status, risks, and next actions.
 */

import type { Skill, SkillConfig, ToolDefinition } from "@h4shed/mcp-core";
import { runTool } from "./handlers.js";
import { TOOL_SPECS } from "./tool-definitions.js";

export * from "./contracts.js";
export * from "./types.js";
export { HANDLERS, runTool, isToolName } from "./handlers.js";
export { TOOL_SPECS } from "./tool-definitions.js";
export { parseCliArgs } from "./cli-args.js";
export { createProject, updateProjectProgress, updateProjectStatus, validateProject } from "./tools/create-project.js";
export { generateDashboard, formatDashboard, getHealthIndicator } from "./tools/dashboard.js";
export { summarizeProjectStatus } from "./tools/summarize-project-status.js";

/** MCP tool definitions, one per entry in TOOL_SPECS. */
export const ProjectStatusTools: ToolDefinition[] = TOOL_SPECS.map((spec) => ({
  name: spec.name,
  description: spec.description,
  inputSchema: spec.inputSchema as ToolDefinition["inputSchema"],
  async handler(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const result = runTool(spec.name, input);
    return result.ok ? (result.data as unknown as Record<string, unknown>) : { success: false, error: result.error };
  },
}));

export const ProjectStatusToolSkill: Skill = {
  name: "project-status-tool",
  version: "1.0.41",
  description: "Summarize current project status, risks, and next actions.",
  tools: ProjectStatusTools,

  async initialize(_config: SkillConfig): Promise<void> {
    console.log("[Project Status Tool] Skill initialized");
  },

  async cleanup(): Promise<void> {
    console.log("[Project Status Tool] Skill cleaned up");
  },
};

export default ProjectStatusToolSkill;
