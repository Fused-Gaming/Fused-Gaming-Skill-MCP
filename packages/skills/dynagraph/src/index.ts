/**
 * Dynagraph MCP Skill
 * Vector-first dynamic Open Graph image renderer
 * Architecture: https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/blob/main/docs/architecture/DYNAGRAPH-INTEGRATION.md
 */

import type { Skill, SkillConfig } from "@h4shed/mcp-core";
import { renderTool } from "./tools/render.js";
import { listTemplatesTool } from "./tools/list-templates.js";
import { validateTemplateTool } from "./tools/validate-template.js";
import { previewTool } from "./tools/preview.js";

/**
 * Dynagraph Skill
 *
 * Phase 1 Scaffolding (Current)
 * - MCP tool definitions for integration
 * - Placeholder implementations
 * - Ready for Phase 8+ rendering pipeline
 *
 * Tools:
 * 1. dynagraph_render - Render OG images
 * 2. dynagraph_list_templates - List available templates
 * 3. dynagraph_validate_template - Validate template code
 * 4. dynagraph_preview - Generate SVG previews
 */
export const dynagraphSkill: Skill = {
  name: "dynagraph",
  version: "1.0.0",
  description:
    "Vector-first dynamic Open Graph image renderer - Phase 1 scaffold with MCP adapter",
  tools: [renderTool, listTemplatesTool, validateTemplateTool, previewTool],

  async initialize(config: SkillConfig): Promise<void> {
    console.log("[Dynagraph] Skill initialized");
    console.log(
      "[Dynagraph] Phase 1 scaffold: MCP adapter ready for Phase 8+ rendering"
    );
    if (config.debug) {
      console.log("[Dynagraph] Debug mode enabled");
    }
  },

  async cleanup(): Promise<void> {
    console.log("[Dynagraph] Skill cleaned up");
  },
};

export default dynagraphSkill;
