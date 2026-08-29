/**
 * Dynagraph Preview Tool
 * Generates SVG previews of Dynagraph templates
 */

import type { ToolDefinition } from "@h4shed/mcp-core";

export const previewTool: ToolDefinition = {
  name: "dynagraph_preview",
  description:
    "Generate a quick SVG preview of a Dynagraph template for visual inspection",
  inputSchema: {
    type: "object",
    properties: {
      template: {
        type: "string",
        description: "Template ID to preview",
      },
      props: {
        type: "object",
        description: "Sample properties for preview",
      },
      width: {
        type: "number",
        description: "Preview width in pixels (default: 600)",
      },
      height: {
        type: "number",
        description: "Preview height in pixels (default: 315)",
      },
    },
    required: ["template", "props"],
  },

  async handler(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const { template, props, width = 600, height = 315 } = input as {
      template: string;
      props: Record<string, unknown>;
      width?: number;
      height?: number;
    };

    try {
      // Phase 1: Return simple preview SVG
      // In Phase 8+, this will integrate with the Dynagraph rendering engine
      const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" stroke-width="0.5"/>
          </pattern>
        </defs>

        <!-- Grid background -->
        <rect width="${width}" height="${height}" fill="white"/>
        <rect width="${width}" height="${height}" fill="url(#grid)"/>

        <!-- Preview container -->
        <rect x="10" y="10" width="${width - 20}" height="${height - 20}" fill="#f3f4f6" stroke="#d1d5db" stroke-width="1"/>

        <!-- Template identifier -->
        <text x="${width / 2}" y="30" text-anchor="middle" fill="#374151" font-size="16" font-weight="600" font-family="system-ui, sans-serif">
          ${template} Preview
        </text>

        <!-- Props display -->
        <text x="20" y="60" fill="#6b7280" font-size="12" font-family="monospace">
          Props: ${JSON.stringify(props).substring(0, 50)}...
        </text>

        <!-- Placeholder content -->
        <rect x="20" y="80" width="${width - 40}" height="${height - 100}" fill="white" stroke="#d1d5db" stroke-width="1" rx="4"/>
        <text x="${width / 2}" y="${height / 2}" text-anchor="middle" dominant-baseline="middle" fill="#9ca3af" font-size="14" font-family="system-ui, sans-serif">
          Full rendering coming in Phase 8+
        </text>
      </svg>`;

      return {
        success: true,
        template,
        dimensions: { width, height },
        svg,
        format: "svg",
        base64: Buffer.from(svg).toString("base64"),
        message: "Phase 1 scaffold: SVG preview generated with grid layout",
      };
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate preview: ${err}`);
    }
  },
};
