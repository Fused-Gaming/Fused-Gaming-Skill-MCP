/**
 * Dynagraph Validate Template Tool
 * Validates template TypeScript code
 */

import type { ToolDefinition } from "@h4shed/mcp-core";

export const validateTemplateTool: ToolDefinition = {
  name: "dynagraph_validate_template",
  description: "Validate a Dynagraph template TypeScript definition",
  inputSchema: {
    type: "object",
    properties: {
      template_code: {
        type: "string",
        description: "TypeScript template code to validate",
      },
      template_id: {
        type: "string",
        description: "Template ID for context (optional)",
      },
    },
    required: ["template_code"],
  },

  async handler(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const { template_code, template_id } = input as {
      template_code: string;
      template_id?: string;
    };

    try {
      // Phase 1: Basic validation
      // In Phase 8+, this will use TypeScript compiler for full validation
      const errors: string[] = [];
      const warnings: string[] = [];

      // Check for required patterns
      if (!template_code.includes("export")) {
        errors.push("Template must export a DynagraphTemplate interface");
      }

      if (!template_code.includes("render")) {
        warnings.push("Template should define a render function");
      }

      // Check for common issues
      if (template_code.includes("async") && !template_code.includes("await")) {
        warnings.push("Async function declared but no await statements found");
      }

      const isValid = errors.length === 0;

      return {
        success: isValid,
        valid: isValid,
        template_id: template_id || "unknown",
        errors,
        warnings,
        message: isValid
          ? "Template validation passed (Phase 1 basic check)"
          : "Template validation failed",
        note: "Phase 1 scaffold: Basic pattern checking. Full TypeScript compilation validation coming in Phase 8+.",
      };
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to validate template: ${err}`);
    }
  },
};
