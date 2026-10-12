/**
 * Validate Mermaid Diagram Tool
 * Checks Mermaid source and returns structured issues instead of throwing.
 */

import type { ToolDefinition } from "../types.js";
import { MAX_DIAGRAM_LENGTH, validateMermaidDiagram } from "../lib/mermaid.js";

export const ValidateMermaidDiagramTool: ToolDefinition = {
  name: "validate-mermaid-diagram",
  description:
    "Validate Mermaid source: rejects empty input, oversized input (over " +
    `${MAX_DIAGRAM_LENGTH} characters), unknown diagram types and unbalanced brackets or quotes. ` +
    "Returns { ok, diagramType, lineCount } or { ok: false, error, issues }.",
  inputSchema: {
    type: "object",
    properties: {
      diagram: {
        type: "string",
        description: "Mermaid source to validate",
      },
    },
    required: ["diagram"],
  },

  async handler(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      return { ...validateMermaidDiagram(input?.diagram) };
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      return {
        ok: false,
        error: `Validation failed unexpectedly: ${err}`,
        issues: [{ code: "INTERNAL_ERROR", message: err }],
      };
    }
  },
};
