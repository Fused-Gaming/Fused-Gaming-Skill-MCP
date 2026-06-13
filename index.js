/**
 * @h4shed/mcp - Main Entry Point
 * Exports core MCP server functionality and skill registry
 */

export {
  SkillRegistry,
  loadConfig,
  saveConfig,
  getDefaultConfig,
} from "./packages/core/dist/packages/core/src/index.js";

export type {
  ToolDefinition,
  ToolInputSchema,
  Skill,
  SkillConfig,
  FusedGamingConfig,
} from "./packages/core/dist/packages/core/src/types.js";
