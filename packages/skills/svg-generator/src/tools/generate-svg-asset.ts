/**
 * SVG Generator Tool
 * Generate SVG assets and icon concepts from structured prompts.
 *
 * Inputs are validated strictly; invalid input yields { ok: false, error, issues }
 * and never throws. Output is deterministic for identical inputs.
 */

import type { ToolDefinition } from "@h4shed/mcp-core";
import {
  renderBarChart,
  renderButton,
  renderCircleIcon,
  renderHeartIcon,
  renderPattern,
  renderStarIcon,
  type Canvas,
} from "../generators.js";
import { ASSET_TYPES, MAX_DIMENSION, MIN_DIMENSION, NAMED_COLORS, validateAssetType, validateColor, validateDimension, validateLabel, validateText, type ValidationIssue, type ValidationResult } from "../validation.js";

export interface SvgAssetSuccess extends Record<string, unknown> {
  ok: true;
  success: true;
  assetType: string;
  svgCode: string;
  description: string;
  dimensions: { width: number; height: number };
  colorPalette: string[];
  complexity: string;
  previewText: string;
}

export interface SvgAssetFailure extends Record<string, unknown> {
  ok: false;
  success: false;
  error: string;
  issues: ValidationIssue[];
}

export type SvgAsset = SvgAssetSuccess | SvgAssetFailure;

const DEFAULT_SIZE = 100;
const DEFAULT_COMPONENT_HEIGHT_RATIO = 0.4;

/** Detects the type of SVG asset from objective description. */
export function detectAssetType(objective: string): string {
  const lowerObj = objective.toLowerCase();

  if (lowerObj.includes("icon") || lowerObj.includes("symbol") || lowerObj.includes("glyph")) {
    return "icon";
  }
  if (lowerObj.includes("button") || lowerObj.includes("component") || lowerObj.includes("widget")) {
    return "component";
  }
  if (lowerObj.includes("pattern") || lowerObj.includes("background") || lowerObj.includes("texture")) {
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
 * Extracts "WxH" dimensions from free text (e.g. "256x256", "512 x 128").
 * Returns null when no pattern is present; a validation failure when the match is out of range.
 */
function extractTextDimensions(
  text: string,
  path: string,
  overridden: { width: boolean; height: boolean }
): ValidationResult<Partial<Canvas>> | null {
  const match = text.toLowerCase().match(/(\d+)\s*x\s*(\d+)/);
  if (!match) {
    return null;
  }
  // An axis given explicitly overrides the text, so its text value is not validated.
  const value: Partial<Canvas> = {};
  const issues: ValidationIssue[] = [];
  if (!overridden.width) {
    const width = validateDimension(Number(match[1]), `${path}.width`);
    if (width.ok) value.width = Number(match[1]);
    else issues.push(...width.issues);
  }
  if (!overridden.height) {
    const height = validateDimension(Number(match[2]), `${path}.height`);
    if (height.ok) value.height = Number(match[2]);
    else issues.push(...height.issues);
  }
  if (issues.length > 0) {
    return { ok: false, issues };
  }
  return { ok: true, value };
}

/** Extracts named colors mentioned in free text, in documented palette order. */
export function extractColors(text: string): string[] {
  const lowerText = text.toLowerCase();
  const colors = Object.entries(NAMED_COLORS)
    // Whole words only, so "credit card" does not read as "red" and "blackberry" not as "black".
    .filter(([keyword]) => new RegExp(`\\b${keyword}\\b`).test(lowerText))
    .map(([, hex]) => hex);
  return colors.length > 0 ? colors : ["#4444FF", "#44FF44"];
}

function defaultCanvas(assetType: string, width: number | undefined, height: number | undefined): Canvas {
  const w = width ?? DEFAULT_SIZE;
  if (height !== undefined) {
    return { width: w, height };
  }
  if (assetType === "component") {
    // Clamp so a narrow component never derives a zero (invisible) height.
    return { width: w, height: Math.max(MIN_DIMENSION, Math.round(w * DEFAULT_COMPONENT_HEIGHT_RATIO)) };
  }
  return { width: w, height: width ?? DEFAULT_SIZE };
}

function renderAsset(
  objective: string,
  assetType: string,
  canvas: Canvas,
  palette: readonly string[],
  label: string
): string {
  const primary = palette[0];
  const lower = objective.toLowerCase();

  switch (assetType) {
    case "icon":
      if (lower.includes("star")) return renderStarIcon(canvas, primary);
      if (lower.includes("heart")) return renderHeartIcon(canvas, primary);
      return renderCircleIcon(canvas, primary);
    case "component":
      return renderButton(canvas, primary, label);
    case "pattern":
      return renderPattern(canvas, primary);
    case "chart":
      return renderBarChart(canvas, palette);
    default:
      return renderCircleIcon(canvas, primary);
  }
}

/** Creates a short text preview of the SVG (first 8 lines). */
function createSvgPreview(svgCode: string): string {
  const lines = svgCode.split("\n");
  const head = lines.slice(0, 8).join("\n");
  const suffix = lines.length > 8 ? "\n... (more SVG code)\n" : "\n";
  return "```svg\n" + head + suffix + "```";
}

function fail(error: string, issues: ValidationIssue[]): SvgAssetFailure {
  // `success` is the discriminator published in 1.1.0; keep it alongside `ok` for consumers.
  return { ok: false, success: false, error, issues };
}

/** Validates the raw input and renders the asset. Never throws. */
export function generateSvgAsset(input: unknown): SvgAsset {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return fail("Invalid input", [{ path: "input", message: "must be an object" }]);
  }
  const raw = input as Record<string, unknown>;
  const issues: ValidationIssue[] = [];
  const collect = <T>(result: ValidationResult<T>): T | undefined => {
    if (result.ok) return result.value;
    issues.push(...result.issues);
    return undefined;
  };

  const objectiveRaw = raw.objective;
  const objective = collect(validateText(objectiveRaw, "objective"));
  if (objective !== undefined && objective.trim().length === 0) {
    issues.push({ path: "objective", message: "must not be empty" });
  }

  const context = raw.context === undefined ? "" : collect(validateText(raw.context, "context"));

  const assetTypeInput = raw.type === undefined ? "auto" : collect(validateAssetType(raw.type, "type"));

  const width =
    raw.width === undefined ? undefined : collect(validateDimension(raw.width, "width"));
  const height =
    raw.height === undefined ? undefined : collect(validateDimension(raw.height, "height"));
  const color = raw.color === undefined ? undefined : collect(validateColor(raw.color, "color"));
  const labelInput =
    raw.label === undefined ? undefined : collect(validateLabel(raw.label, "label"));

  if (issues.length > 0 || objective === undefined || context === undefined || assetTypeInput === undefined) {
    if (issues.length === 0) {
      issues.push({ path: "input", message: "invalid input" });
    }
    return fail("Invalid input: " + issues.map((i) => `${i.path} ${i.message}`).join("; "), issues);
  }

  const trimmedObjective = objective.trim();
  const assetType = assetTypeInput === "auto" ? detectAssetType(trimmedObjective) : assetTypeInput;

  // Text dimensions fill whichever axis is not given explicitly, so an explicit
  // width or height must not discard the other text-derived axis.
  const textDims = extractTextDimensions(`${trimmedObjective} ${context}`, "objective", {
    width: width !== undefined,
    height: height !== undefined,
  });
  if (textDims !== null && !textDims.ok) {
    return fail("Invalid input: " + textDims.issues.map((i) => `${i.path} ${i.message}`).join("; "), textDims.issues);
  }
  const explicitCanvas = textDims?.ok ? textDims.value : undefined;

  const canvas = defaultCanvas(
    assetType,
    width ?? explicitCanvas?.width,
    height ?? explicitCanvas?.height
  );

  const palette = color !== undefined ? [color] : extractColors(`${trimmedObjective} ${context}`);
  const label = labelInput ?? (trimmedObjective.toLowerCase().includes("button") ? "Click" : "Button");

  const svgCode = renderAsset(trimmedObjective, assetType, canvas, palette, label);

  return {
    ok: true,
    success: true,
    assetType,
    svgCode,
    description: `Generated ${assetType} SVG asset: ${trimmedObjective}`,
    dimensions: { width: canvas.width, height: canvas.height },
    colorPalette: [...palette],
    complexity: "simple",
    previewText: createSvgPreview(svgCode),
  };
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
        description: "Optional additional context like style preferences or color scheme",
      },
      type: {
        type: "string",
        enum: [...ASSET_TYPES],
        description: "Type of SVG asset to generate. 'auto' detects from objective.",
      },
      width: {
        type: "number",
        description: `Canvas width in pixels (${MIN_DIMENSION}..${MAX_DIMENSION}). Overrides any WxH in the objective.`,
      },
      height: {
        type: "number",
        description: `Canvas height in pixels (${MIN_DIMENSION}..${MAX_DIMENSION}). Overrides any WxH in the objective.`,
      },
      color: {
        type: "string",
        description: "Primary color: #RGB, #RRGGBB, #RRGGBBAA, or a named color (red, blue, green, ...).",
      },
      label: {
        type: "string",
        description: "Button label text (max 64 characters, no control characters).",
      },
    },
    required: ["objective"],
  },

  async handler(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      return generateSvgAsset(input);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return fail(`Failed to generate SVG asset: ${message}`, [{ path: "", message }]);
    }
  },
};
