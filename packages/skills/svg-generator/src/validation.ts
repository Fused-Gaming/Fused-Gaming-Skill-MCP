/**
 * Strict input validation for the SVG generator.
 * Every validator returns a discriminated result and never throws.
 */

export const MIN_DIMENSION = 1;
export const MAX_DIMENSION = 4096;
export const MAX_LABEL_LENGTH = 64;
export const MAX_TEXT_LENGTH = 500;

export const ASSET_TYPES = [
  "icon",
  "component",
  "pattern",
  "chart",
  "illustration",
  "logo",
  "auto",
] as const;

export type AssetTypeInput = (typeof ASSET_TYPES)[number];

/** Documented named colors. Keys are lowercase; values are normalized hex. */
export const NAMED_COLORS: Readonly<Record<string, string>> = {
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

export interface ValidationIssue {
  path: string;
  message: string;
}

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; issues: ValidationIssue[] };

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;

/** Validates a width or height: finite number within [MIN_DIMENSION, MAX_DIMENSION]. */
export function validateDimension(value: unknown, path: string): ValidationResult<number> {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return { ok: false, issues: [{ path, message: "must be a finite number" }] };
  }
  if (value < MIN_DIMENSION || value > MAX_DIMENSION) {
    return {
      ok: false,
      issues: [{ path, message: `must be between ${MIN_DIMENSION} and ${MAX_DIMENSION}` }],
    };
  }
  return { ok: true, value };
}

/**
 * Validates a color. Accepts #RGB, #RRGGBB, #RRGGBBAA or a documented named color.
 * Returns a normalized uppercase hex value (#RGB expanded to #RRGGBB).
 */
export function validateColor(value: unknown, path: string): ValidationResult<string> {
  if (typeof value !== "string") {
    return { ok: false, issues: [{ path, message: "must be a string" }] };
  }
  const trimmed = value.trim();
  const named = NAMED_COLORS[trimmed.toLowerCase()];
  if (named !== undefined) {
    return { ok: true, value: named };
  }
  if (!HEX_COLOR.test(trimmed)) {
    return {
      ok: false,
      issues: [
        {
          path,
          message:
            "must be #RGB, #RRGGBB, #RRGGBBAA, or a named color (" +
            Object.keys(NAMED_COLORS).join(", ") +
            ")",
        },
      ],
    };
  }
  const body = trimmed.slice(1).toUpperCase();
  if (body.length === 3) {
    return {
      ok: true,
      value: "#" + body.split("").map((c) => c + c).join(""),
    };
  }
  return { ok: true, value: "#" + body };
}

/** Validates a visible text label: string, bounded length, no control characters. */
export function validateLabel(value: unknown, path: string): ValidationResult<string> {
  if (typeof value !== "string") {
    return { ok: false, issues: [{ path, message: "must be a string" }] };
  }
  if (value.length > MAX_LABEL_LENGTH) {
    return {
      ok: false,
      issues: [{ path, message: `must be at most ${MAX_LABEL_LENGTH} characters` }],
    };
  }
  if (CONTROL_CHARS.test(value)) {
    return { ok: false, issues: [{ path, message: "must not contain control characters" }] };
  }
  return { ok: true, value };
}

/** Validates free-text input (objective or context). */
export function validateText(value: unknown, path: string): ValidationResult<string> {
  if (typeof value !== "string") {
    return { ok: false, issues: [{ path, message: "must be a string" }] };
  }
  if (value.length > MAX_TEXT_LENGTH) {
    return {
      ok: false,
      issues: [{ path, message: `must be at most ${MAX_TEXT_LENGTH} characters` }],
    };
  }
  return { ok: true, value };
}

/** Validates the asset type enum. */
export function validateAssetType(value: unknown, path: string): ValidationResult<AssetTypeInput> {
  if (typeof value === "string" && (ASSET_TYPES as readonly string[]).includes(value)) {
    return { ok: true, value: value as AssetTypeInput };
  }
  return {
    ok: false,
    issues: [{ path, message: `must be one of: ${ASSET_TYPES.join(", ")}` }],
  };
}
