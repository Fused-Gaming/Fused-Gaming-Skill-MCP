/**
 * SVG Generator Tool
 * Generate SVG assets and icon concepts from structured prompts.
 */

import type { ToolDefinition } from "@h4shed/mcp-core";

interface SvgAsset extends Record<string, unknown> {
  success: boolean;
  assetType?: string;
  svgCode?: string;
  description?: string;
  dimensions?: { width: number; height: number };
  colorPalette?: string[];
  complexity?: string;
  previewText?: string;
  error?: string;
}

/**
 * Detects the type of SVG asset from objective description
 */
function detectAssetType(objective: string): string {
  const lowerObj = objective.toLowerCase();

  if (
    lowerObj.includes("icon") ||
    lowerObj.includes("symbol") ||
    lowerObj.includes("glyph")
  ) {
    return "icon";
  }

  if (
    lowerObj.includes("button") ||
    lowerObj.includes("component") ||
    lowerObj.includes("widget")
  ) {
    return "component";
  }

  if (
    lowerObj.includes("pattern") ||
    lowerObj.includes("background") ||
    lowerObj.includes("texture")
  ) {
    return "pattern";
  }

  if (lowerObj.includes("chart") || lowerObj.includes("graph")) {
    return "chart";
  }

  if (lowerObj.includes("illustration") || lowerObj.includes("drawing")) {
    return "illustration";
  }

  if (lowerObj.includes("logo") || lowerObj.includes("brand")) {
    return "logo";
  }

  return "generic-shape";
}

/**
 * Extracts color mentions from objective
 */
function extractColors(objective: string): string[] {
  const colorKeywords: Record<string, string> = {
    red: "#FF4444",
    blue: "#4444FF",
    green: "#44FF44",
    yellow: "#FFFF44",
    orange: "#FF8844",
    purple: "#FF44FF",
    pink: "#FF44AA",
    cyan: "#44FFFF",
    gray: "#888888",
    black: "#000000",
    white: "#FFFFFF",
  };

  const colors: string[] = [];
  const lowerObj = objective.toLowerCase();

  Object.entries(colorKeywords).forEach(([keyword, hex]) => {
    if (lowerObj.includes(keyword)) {
      colors.push(hex);
    }
  });

  return colors.length > 0 ? colors : ["#4444FF", "#44FF44"];
}

/**
 * Generates a simple circle icon
 */
function generateCircleIcon(size: number, color: string): string {
  const padding = size * 0.1;
  const radius = (size - padding * 2) / 2;
  const center = size / 2;

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <circle cx="${center}" cy="${center}" r="${radius}" fill="${color}" stroke="#333" stroke-width="2"/>
</svg>`;
}

/**
 * Generates a star icon
 */
function generateStarIcon(size: number, color: string): string {
  const center = size / 2;
  const outerRadius = size * 0.4;
  const innerRadius = size * 0.15;

  let path = `M${center},${size * 0.1}`;

  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    path += ` L${x},${y}`;
  }

  path += " Z";

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <path d="${path}" fill="${color}" stroke="#333" stroke-width="1"/>
</svg>`;
}

/**
 * Generates a heart icon
 */
function generateHeartIcon(size: number, color: string): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
  <path d="M50,85 C25,70 10,55 10,40 C10,25 20,15 30,15 C40,15 50,25 50,35 C50,25 60,15 70,15 C80,15 90,25 90,40 C90,55 75,70 50,85 Z"
    fill="${color}" stroke="#333" stroke-width="1"/>
</svg>`;
}

/**
 * Generates a simple button component
 */
function generateButton(
  size: number,
  color: string,
  label: string = "Button"
): string {
  const width = size;
  const height = size * 0.4;
  const textSize = height * 0.6;

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect x="2" y="2" width="${width - 4}" height="${height - 4}"
    rx="4" fill="${color}" stroke="#333" stroke-width="1.5"/>
  <text x="${width / 2}" y="${height / 2 + textSize / 3}"
    text-anchor="middle" font-size="${textSize}" fill="white" font-weight="bold">
    ${label}
  </text>
</svg>`;
}

/**
 * Generates a geometric pattern
 */
function generatePattern(size: number, color: string): string {
  const patternSize = size / 4;
  let pattern = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <pattern id="pattern" x="0" y="0" width="${patternSize}" height="${patternSize}" patternUnits="userSpaceOnUse">
      <circle cx="${patternSize / 2}" cy="${patternSize / 2}" r="${patternSize / 4}" fill="${color}"/>
    </pattern>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#pattern)"/>
</svg>`;

  return pattern;
}

/**
 * Generates a simple bar chart
 */
function generateChart(size: number, colors: string[]): string {
  const bars = 4;
  const barWidth = (size * 0.8) / bars;
  const startX = size * 0.1;
  const maxHeight = size * 0.7;

  let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;

  const heights = [0.3, 0.6, 0.8, 0.5];

  heights.forEach((heightPercent, index) => {
    const barHeight = maxHeight * heightPercent;
    const x = startX + index * (barWidth + 5);
    const y = size - barHeight - 20;
    const color = colors[index % colors.length];

    svg += `\n  <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" stroke="#333" stroke-width="1"/>`;
  });

  svg += `\n  <line x1="10" y1="${size - 20}" x2="${size - 10}" y2="${size - 20}" stroke="#333" stroke-width="1.5"/>
</svg>`;

  return svg;
}

/**
 * Routes to appropriate SVG generator based on asset type
 */
function generateSvgAsset(
  objective: string,
  assetType: string,
  colors: string[]
): string {
  const size = 100;
  const primaryColor = colors[0] || "#4444FF";

  switch (assetType) {
    case "icon":
      if (objective.toLowerCase().includes("star"))
        return generateStarIcon(size, primaryColor);
      if (objective.toLowerCase().includes("heart"))
        return generateHeartIcon(size, primaryColor);
      return generateCircleIcon(size, primaryColor);

    case "component":
      if (objective.toLowerCase().includes("button"))
        return generateButton(size, primaryColor, "Click");
      return generateButton(size, primaryColor);

    case "pattern":
      return generatePattern(size, primaryColor);

    case "chart":
      return generateChart(size, colors);

    default:
      return generateCircleIcon(size, primaryColor);
  }
}

/**
 * Creates a text preview of the SVG
 */
function createSvgPreview(svgCode: string): string {
  const lines = svgCode.split("\n").slice(0, 8);
  return (
    "```svg\n" +
    lines.join("\n") +
    (svgCode.split("\n").length > 8
      ? "\n... (more SVG code)\n"
      : "\n") +
    "```"
  );
}

export const GenerateSvgAssetTool: ToolDefinition = {
  name: "generate-svg-asset",
  description:
    "Generate SVG assets including icons, components, patterns, charts, and illustrations from natural language descriptions.",
  inputSchema: {
    type: "object",
    properties: {
      objective: {
        type: "string",
        description:
          "Description of the SVG asset to generate (e.g., 'Blue star icon', 'Red button component', 'Green geometric pattern')",
      },
      context: {
        type: "string",
        description:
          "Optional additional context like style preferences or color scheme",
      },
      type: {
        type: "string",
        enum: ["icon", "component", "pattern", "chart", "illustration", "logo", "auto"],
        description: "Type of SVG asset to generate. 'auto' detects from objective.",
      },
    },
    required: ["objective"],
  },

  async handler(input: Record<string, unknown>): Promise<SvgAsset> {
    try {
      const {
        objective = "",
        context = "",
        type: specifiedType = "auto",
      } = input as {
        objective: string;
        context?: string;
        type?: string;
      };

      if (!objective || objective.trim().length === 0) {
        return {
          success: false,
          error: "objective parameter is required and must not be empty",
        };
      }

      // Detect asset type
      const assetType =
        specifiedType === "auto" ? detectAssetType(objective) : specifiedType;

      // Extract colors from objective and context
      const colors = extractColors(objective + " " + context);

      // Generate SVG code
      const svgCode = generateSvgAsset(objective, assetType, colors);

      // Create preview
      const previewText = createSvgPreview(svgCode);

      const result: SvgAsset = {
        success: true,
        assetType,
        svgCode,
        description: `Generated ${assetType} SVG asset: ${objective}`,
        dimensions: { width: 100, height: 100 },
        colorPalette: colors,
        complexity: "simple",
        previewText,
      };

      return result;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Failed to generate SVG asset: ${err}`,
      };
    }
  },
};
