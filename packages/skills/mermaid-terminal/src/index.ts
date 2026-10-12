/**
 * Mermaid Terminal Skill
 * Generate, validate and render terminal-friendly Mermaid diagrams.
 */

import type { Skill, SkillConfig } from "./types.js";
import { GenerateMermaidDiagramTool } from "./tools/generate-mermaid-diagram.js";
import { ValidateMermaidDiagramTool } from "./tools/validate-mermaid-diagram.js";
import { RenderMermaidTerminalTool } from "./tools/render-mermaid-terminal.js";

export { GenerateMermaidDiagramTool, ValidateMermaidDiagramTool, RenderMermaidTerminalTool };
export { validateMermaidDiagram, renderMermaidToText, MAX_DIAGRAM_LENGTH } from "./lib/mermaid.js";

export const MermaidTerminalSkill: Skill = {
  name: "mermaid-terminal",
  version: "1.0.41",
  description: "Generate terminal-friendly Mermaid diagrams and flowcharts.",
  tools: [GenerateMermaidDiagramTool, ValidateMermaidDiagramTool, RenderMermaidTerminalTool],

  async initialize(_config: SkillConfig): Promise<void> {
    console.log("[Mermaid Terminal] Skill initialized");
  },

  async cleanup(): Promise<void> {
    console.log("[Mermaid Terminal] Skill cleaned up");
  },
};

export default MermaidTerminalSkill;
