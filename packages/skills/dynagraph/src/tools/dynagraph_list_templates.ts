/**
 * Dynagraph List Templates Tool
 * Lists available Dynagraph templates
 */

import type { ToolDefinition } from "@h4shed/mcp-core";

// Phase 1 template definitions
const TEMPLATES = [
  {
    id: "profile",
    name: "Profile Card",
    description: "Social profile card with avatar, name, and title",
    version: "1.0.0",
    defaultSize: { width: 1200, height: 630 },
    requiredProps: ["title", "subtitle"],
    optionalProps: ["avatar", "theme"],
  },
  {
    id: "article",
    name: "Article Preview",
    description: "Article sharing card with headline and metadata",
    version: "1.0.0",
    defaultSize: { width: 1200, height: 630 },
    requiredProps: ["title"],
    optionalProps: ["description", "image", "author", "date"],
  },
  {
    id: "product",
    name: "Product Card",
    description: "E-commerce product display card",
    version: "1.0.0",
    defaultSize: { width: 1200, height: 630 },
    requiredProps: ["title", "price"],
    optionalProps: ["image", "rating", "badge"],
  },
];

export const listTemplatesTool: ToolDefinition = {
  name: "dynagraph_list_templates",
  description: "List all available Dynagraph templates",
  inputSchema: {
    type: "object",
    properties: {},
  },

  async handler(): Promise<Record<string, unknown>> {
    try {
      return {
        success: true,
        count: TEMPLATES.length,
        templates: TEMPLATES,
        message: "Phase 1 scaffold: Built-in templates available. Custom templates coming in Phase 8+.",
      };
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to list templates: ${err}`);
    }
  },
};
