/**
 * Generate SVG Design Tool
 * Creates SVG designs for web applications
 */

import type { ToolDefinition } from "@fused-gaming/mcp-core";

export const generateSVGDesignTool: ToolDefinition = {
  name: "generate-svg-design",
  description: "Generate SVG designs with shapes, patterns, and effects",
  inputSchema: {
    type: "object",
    properties: {
      shape: {
        type: "string",
        description: "Shape type: circle, rectangle, triangle, polygon, or custom",
      },
      width: {
        type: "number",
        description: "SVG width in pixels (default: 200)",
      },
      height: {
        type: "number",
        description: "SVG height in pixels (default: 200)",
      },
      color: {
        type: "string",
        description: "Fill color in hex format (default: #000000)",
      },
    },
    required: ["shape"],
  },

  async handler(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const { shape, width = 200, height = 200, color = "#000000" } = input as {
      shape: string;
      width?: number;
      height?: number;
      color?: string;
    };

    try {
      let svgContent = "";

      const cx = width / 2;
      const cy = height / 2;

      switch (shape.toLowerCase()) {
        case "circle": {
          const radius = Math.min(width, height) / 2 - 10;
          svgContent = `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${color}" />`;
          break;
        }
        case "rectangle": {
          const padding = 10;
          const rectWidth = width - 2 * padding;
          const rectHeight = height - 2 * padding;
          svgContent = `<rect x="${padding}" y="${padding}" width="${rectWidth}" height="${rectHeight}" fill="${color}" />`;
          break;
        }
        case "triangle": {
          const padding = 20;
          const points = `${cx},${padding} ${width - padding},${height - padding} ${padding},${height - padding}`;
          svgContent = `<polygon points="${points}" fill="${color}" />`;
          break;
        }
        case "polygon": {
          // Generate a 6-sided polygon (hexagon)
          const radius = Math.min(width, height) / 2 - 10;
          const points = Array.from({ length: 6 }, (_, i) => {
            const angle = (i * Math.PI) / 3;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            return `${x},${y}`;
          }).join(" ");
          svgContent = `<polygon points="${points}" fill="${color}" />`;
          break;
        }
        case "custom":
        default: {
          // Default to a rounded rectangle (custom shape)
          const padding = 10;
          const rectWidth = width - 2 * padding;
          const rectHeight = height - 2 * padding;
          svgContent = `<rect x="${padding}" y="${padding}" width="${rectWidth}" height="${rectHeight}" rx="10" fill="${color}" />`;
          break;
        }
      }

      const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${svgContent}</svg>`;

      return {
        success: true,
        shape,
        dimensions: { width, height },
        color,
        svg,
      };
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate SVG: ${err}`);
    }
  },
};
