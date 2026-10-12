/**
 * Deterministic SVG renderers for each supported asset kind.
 * Inputs must already be validated; output depends only on the arguments.
 */

import { element, escapeXml, fmt, svgRoot, type Attr } from "./serialize.js";

export interface Canvas {
  width: number;
  height: number;
}

const OUTLINE = "#333";

export function renderCircleIcon(canvas: Canvas, color: string): string {
  const { width, height } = canvas;
  const size = Math.min(width, height);
  const padding = size * 0.1;
  const radius = (size - padding * 2) / 2;
  const circle = element("circle", [
    ["cx", fmt(width / 2)],
    ["cy", fmt(height / 2)],
    ["r", fmt(radius)],
    ["fill", color],
    ["stroke", OUTLINE],
    ["stroke-width", "2"],
  ]);
  return svgRoot(width, height, [circle]);
}

export function renderStarIcon(canvas: Canvas, color: string): string {
  const { width, height } = canvas;
  const size = Math.min(width, height);
  const cx = width / 2;
  const cy = height / 2;
  const outer = size * 0.4;
  const inner = size * 0.15;

  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const radius = i % 2 === 0 ? outer : inner;
    const x = fmt(cx + radius * Math.cos(angle));
    const y = fmt(cy + radius * Math.sin(angle));
    points.push(`${i === 0 ? "M" : "L"}${x},${y}`);
  }
  const d = points.join(" ") + " Z";
  const path = element("path", [
    ["d", d],
    ["fill", color],
    ["stroke", OUTLINE],
    ["stroke-width", "1"],
  ]);
  return svgRoot(width, height, [path]);
}

const HEART_PATH =
  "M50,85 C25,70 10,55 10,40 C10,25 20,15 30,15 C40,15 50,25 50,35 C50,25 60,15 70,15 C80,15 90,25 90,40 C90,55 75,70 50,85 Z";

export function renderHeartIcon(canvas: Canvas, color: string): string {
  const { width, height } = canvas;
  // The heart is drawn on a 100x100 grid, uniformly scaled and centered.
  const scale = Math.min(width, height) / 100;
  const tx = (width - 100 * scale) / 2;
  const ty = (height - 100 * scale) / 2;
  const path = element("path", [
    ["d", HEART_PATH],
    ["fill", color],
    ["stroke", OUTLINE],
    ["stroke-width", "1"],
  ]);
  const group = element(
    "g",
    [["transform", `translate(${fmt(tx)} ${fmt(ty)}) scale(${fmt(scale)})`]],
    path
  );
  return svgRoot(width, height, [group]);
}

export function renderButton(canvas: Canvas, color: string, label: string): string {
  const { width, height } = canvas;
  const textSize = height * 0.6;
  const rect = element("rect", [
    ["x", "2"],
    ["y", "2"],
    ["width", fmt(Math.max(width - 4, 0))],
    ["height", fmt(Math.max(height - 4, 0))],
    ["rx", "4"],
    ["fill", color],
    ["stroke", OUTLINE],
    ["stroke-width", "1.5"],
  ]);
  const attrs: Attr[] = [
    ["x", fmt(width / 2)],
    ["y", fmt(height / 2 + textSize / 3)],
    ["text-anchor", "middle"],
    ["font-size", fmt(textSize)],
    ["fill", "white"],
    ["font-weight", "bold"],
  ];
  const text = element("text", attrs, escapeXml(label));
  return svgRoot(width, height, [rect, text]);
}

export function renderPattern(canvas: Canvas, color: string): string {
  const { width, height } = canvas;
  const cell = Math.min(width, height) / 4;
  const circle = element("circle", [
    ["cx", fmt(cell / 2)],
    ["cy", fmt(cell / 2)],
    ["r", fmt(cell / 4)],
    ["fill", color],
  ]);
  const pattern = element(
    "pattern",
    [
      ["id", "pattern"],
      ["x", "0"],
      ["y", "0"],
      ["width", fmt(cell)],
      ["height", fmt(cell)],
      ["patternUnits", "userSpaceOnUse"],
    ],
    circle
  );
  const defs = element("defs", [], pattern);
  const rect = element("rect", [
    ["width", fmt(width)],
    ["height", fmt(height)],
    ["fill", "url(#pattern)"],
  ]);
  return svgRoot(width, height, [defs, rect]);
}

export function renderBarChart(canvas: Canvas, palette: readonly string[]): string {
  const { width, height } = canvas;
  const heights = [0.3, 0.6, 0.8, 0.5];
  const bars = heights.length;
  // Gaps come out of the 80% allocation, so the last bar ends inside the canvas
  // even when the canvas is narrow.
  const gap = Math.min(5, width * 0.02);
  const barWidth = (width * 0.8 - gap * (bars - 1)) / bars;
  const startX = width * 0.1;
  const maxHeight = height * 0.7;
  const baseline = height - Math.min(20, height * 0.2);

  const children: string[] = heights.map((share, index) => {
    const barHeight = maxHeight * share;
    const x = startX + index * (barWidth + gap);
    const y = baseline - barHeight;
    const color = palette[index % palette.length];
    return element("rect", [
      ["x", fmt(x)],
      ["y", fmt(y)],
      ["width", fmt(barWidth)],
      ["height", fmt(barHeight)],
      ["fill", color],
      ["stroke", OUTLINE],
      ["stroke-width", "1"],
    ]);
  });

  children.push(
    element("line", [
      ["x1", fmt(startX)],
      ["y1", fmt(baseline)],
      ["x2", fmt(width - startX)],
      ["y2", fmt(baseline)],
      ["stroke", OUTLINE],
      ["stroke-width", "1.5"],
    ])
  );
  return svgRoot(width, height, children);
}
