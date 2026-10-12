/**
 * Deterministic SVG serialization helpers.
 */

const PRECISION_FACTOR = 100; // two decimal places

/**
 * Formats a number with fixed precision and no float noise.
 * Example: 0.30000000000000004 -> "0.3", 40.00000000000001 -> "40".
 */
export function fmt(value: number): string {
  if (!Number.isFinite(value)) {
    throw new RangeError(`Cannot serialize non-finite number: ${value}`);
  }
  const rounded = Math.round(value * PRECISION_FACTOR) / PRECISION_FACTOR;
  return Object.is(rounded, -0) || rounded === 0 ? "0" : String(rounded);
}

/** Escapes text for use in XML element content and double-quoted attributes. */
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export type Attr = readonly [name: string, value: string];

/** Renders an element with attributes in the exact order given. */
export function element(name: string, attrs: readonly Attr[], content?: string): string {
  const attrText = attrs.map(([key, value]) => ` ${key}="${value}"`).join("");
  if (content === undefined) {
    return `<${name}${attrText}/>`;
  }
  return `<${name}${attrText}>${content}</${name}>`;
}

/** Renders the root svg element for a canvas of the given size. */
export function svgRoot(width: number, height: number, children: readonly string[]): string {
  const w = fmt(width);
  const h = fmt(height);
  const open = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`;
  return [open, ...children.map((c) => `  ${c}`), "</svg>"].join("\n");
}
