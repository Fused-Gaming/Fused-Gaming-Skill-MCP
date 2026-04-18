/**
 * Mermaid Terminal Skill
 * Generate terminal-friendly Mermaid diagrams and flowcharts.
 */

import type { Skill, SkillConfig } from "@h4shed/mcp-core";
import { GenerateMermaidDiagramTool } from "./tools/generate-mermaid-diagram.js";

export const MermaidTerminalSkill: Skill = {
  name: "mermaid-terminal",
  version: "1.0.0",
  description: "Generate terminal-friendly Mermaid diagrams and flowcharts.",
  tools: [GenerateMermaidDiagramTool],

  async initialize(_config: SkillConfig): Promise<void> {
    console.log("[Mermaid Terminal] Skill initialized");
  },

  async cleanup(): Promise<void> {
    console.log("[Mermaid Terminal] Skill cleaned up");
  },
};

export default MermaidTerminalSkill;
