/**
 * Render Mermaid Terminal Tool
 * Renders flowchart and sequence diagram source as deterministic, ANSI-free text.
 */

import type { ToolDefinition } from "../types.js";
import { renderMermaidToText } from "../lib/mermaid.js";

export const RenderMermaidTerminalTool: ToolDefinition = {
  name: "render-mermaid-terminal",
  description:
    "Render a Mermaid flowchart, graph or sequenceDiagram as plain terminal text. " +
    "Source is validated first; failures return { ok: false, error, issues }.",
  inputSchema: {
    type: "object",
    properties: {
      diagram: {
        type: "string",
        description: "Mermaid flowchart/graph or sequenceDiagram source",
      },
    },
    required: ["diagram"],
  },

  async handler(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      return { ...renderMermaidToText(input?.diagram) };
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      return {
        ok: false,
        error: `Render failed unexpectedly: ${err}`,
        issues: [{ code: "INTERNAL_ERROR", message: err }],
      };
    }
  },
};
