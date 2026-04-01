/**
 * Fused Gaming MCP Core
 * Main exports for types, registry, and configuration
 */

export type {
  ToolDefinition,
  ToolInputSchema,
  Skill,
  SkillConfig,
  FusedGamingConfig,
} from "./types.js";

export { SkillRegistry } from "./skill-registry.js";
export { loadConfig, saveConfig, getDefaultConfig } from "./config.js";
