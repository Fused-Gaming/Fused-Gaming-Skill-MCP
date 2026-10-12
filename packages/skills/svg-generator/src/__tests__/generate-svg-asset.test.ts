/**
 * Tests for the SVG generator: validation, deterministic serialization,
 * and fixture-driven regression checks.
 */

import { describe, it, expect } from "@jest/globals";
import fs from "node:fs";
import path from "node:path";
import { GenerateSvgAssetTool, generateSvgAsset } from "../tools/generate-svg-asset";
import { validateColor, validateDimension, validateLabel } from "../validation";
import { escapeXml, fmt } from "../serialize";

/** Loose view of a tool result, covering both the success and failure shapes. */
interface Result {
  ok?: boolean;
  error?: string;
  issues?: Array<{ path: string; message: string }>;
  svgCode?: string;
  [key: string]: unknown;
}

/** Runs the tool handler and narrows its result for assertions. */
async function run(input: Record<string, unknown>): Promise<Result> {
  return (await GenerateSvgAssetTool.handler(input)) as Result;
}

const FIXTURE_DIR = path.join(__dirname, "fixtures");
const inputFixtures = fs
  .readdirSync(FIXTURE_DIR)
  .filter((name) => name.endsWith(".input.json"))
  .map((name) => name.replace(".input.json", ""))
  .sort();

describe("tool definition", () => {
  it("has the expected name and a valid schema", () => {
    expect(GenerateSvgAssetTool.name).toBe("generate-svg-asset");
    expect(GenerateSvgAssetTool.description).toContain("SVG");
    expect(GenerateSvgAssetTool.inputSchema.type).toBe("object");
    expect(GenerateSvgAssetTool.inputSchema.required).toContain("objective");
  });
});

describe("fixture regression", () => {
  it("has success and failure fixtures for at least three asset types", () => {
    const successes = inputFixtures.filter((n) => !n.startsWith("invalid-"));
    const failures = inputFixtures.filter((n) => n.startsWith("invalid-"));
    expect(successes.length).toBeGreaterThanOrEqual(3);
    expect(failures.length).toBeGreaterThanOrEqual(3);
  });

  it.each(inputFixtures.filter((n) => !n.startsWith("invalid-")))(
    "%s matches its expected SVG byte-for-byte",
    async (name) => {
      const input = JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, `${name}.input.json`), "utf8"));
      const expected = fs.readFileSync(path.join(FIXTURE_DIR, `${name}.expected.svg`), "utf8");

      const result = await run(input);

      expect(result.ok).toBe(true);
      expect(result.svgCode).toBe(expected);
    }
  );

  it.each(inputFixtures.filter((n) => n.startsWith("invalid-")))(
    "%s returns the expected structured failure",
    async (name) => {
      const input = JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, `${name}.input.json`), "utf8"));
      const expected = JSON.parse(fs.readFileSync(path.join(FIXTURE_DIR, `${name}.expected.json`), "utf8"));

      const result = await run(input);

      expect(result).toEqual(expected);
      expect(result.ok).toBe(false);
      expect(result).not.toHaveProperty("svgCode");
    }
  );
});

describe("dimension validation", () => {
  it.each([1, 100, 4096, 1.5, 2.25])("accepts %p", (value) => {
    expect(validateDimension(value, "width").ok).toBe(true);
  });

  it.each([0, 0.5, -1, 4097, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, "100", null])(
    "rejects %p",
    (value) => {
      expect(validateDimension(value, "width").ok).toBe(false);
    }
  );

  it("rejects out-of-range explicit dimensions without throwing", async () => {
    const result = await run({ objective: "Icon", width: 0, height: 10 });
    expect(result).toMatchObject({ ok: false });
    expect(result.issues).toEqual([{ path: "width", message: "must be between 1 and 4096" }]);
  });
});

describe("color validation", () => {
  it.each([
    ["#abc", "#AABBCC"],
    ["#AABBCC", "#AABBCC"],
    ["#aabbccdd", "#AABBCCDD"],
    ["red", "#FF4444"],
    ["  Blue ", "#4444FF"],
  ])("accepts %p as %p", (input, normalized) => {
    expect(validateColor(input, "color")).toEqual({ ok: true, value: normalized });
  });

  it.each([
    'red" onload="x',
    "#ABCD",
    "#GGGGGG",
    "rgb(1,2,3)",
    "javascript:alert(1)",
    "",
    "#",
    42,
  ])("rejects %p", (input) => {
    expect(validateColor(input, "color").ok).toBe(false);
  });

  it("rejects an attribute-injection color through the tool", async () => {
    const result = await run({
      objective: "Red square",
      color: 'red" onload="alert(1)',
    });
    expect(result.ok).toBe(false);
    expect(result).not.toHaveProperty("svgCode");
  });
});

describe("label validation and escaping", () => {
  it("rejects labels over 64 characters", () => {
    expect(validateLabel("x".repeat(65), "label").ok).toBe(false);
    expect(validateLabel("x".repeat(64), "label").ok).toBe(true);
  });

  it("rejects control characters", () => {
    expect(validateLabel("a\u0007b", "label").ok).toBe(false);
  });

  it("escapes markup in button labels", () => {
    const result = generateSvgAsset({ objective: "Red button", label: '<script>"&\'' });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.svgCode).toContain("&lt;script&gt;&quot;&amp;&apos;");
    expect(result.svgCode).not.toContain("<script>");
  });

  it("escapeXml escapes all five XML special characters", () => {
    expect(escapeXml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&apos;");
  });
});

describe("deterministic serialization", () => {
  it("formats numbers without float noise", () => {
    expect(fmt(0.1 + 0.2)).toBe("0.3");
    expect(fmt(40.00000000000001)).toBe("40");
    expect(fmt(-0)).toBe("0");
    expect(fmt(1234.5)).toBe("1234.5");
  });

  it("throws only for non-finite numbers inside the serializer", () => {
    expect(() => fmt(Number.NaN)).toThrow(RangeError);
  });

  it("produces byte-identical output for identical input", async () => {
    const input = { objective: "Yellow star icon", width: 73, height: 73 };
    const first = await run({ ...input });
    const second = await run({ ...input });
    expect(second.svgCode).toBe(first.svgCode);
    expect(first.svgCode ?? "").not.toMatch(/NaN|Infinity|undefined/);
  });
});

describe("input robustness", () => {
  it.each([
    [{}, "objective"],
    [{ objective: "   " }, "objective"],
    [{ objective: 42 }, "objective"],
    [{ objective: "Icon", type: "video" }, "type"],
    [{ objective: "Icon", context: 7 }, "context"],
  ])("returns a structured failure for %p", async (input, field) => {
    const result = await run(input as Record<string, unknown>);
    expect(result.ok).toBe(false);
    expect(typeof result.error).toBe("string");
    expect((result.issues ?? []).map((i) => i.path)).toContain(field);
  });

  it("never throws for non-object input", () => {
    expect(generateSvgAsset(null)).toMatchObject({ ok: false });
    expect(generateSvgAsset([])).toMatchObject({ ok: false });
    expect(generateSvgAsset("icon")).toMatchObject({ ok: false });
  });
});

describe("explicit axis override", () => {
  it("keeps the text-derived height when only width is given", async () => {
    const result = await run({ objective: "icon 256x128", context: "", width: 300 });
    expect(result.ok).toBe(true);
    expect(result.svgCode).toContain('width="300"');
    expect(result.svgCode).toContain('height="128"');
  });

  it("keeps the text-derived width when only height is given", async () => {
    const result = await run({ objective: "icon 256x128", context: "", height: 300 });
    expect(result.ok).toBe(true);
    expect(result.svgCode).toContain('width="256"');
    expect(result.svgCode).toContain('height="300"');
  });
});

describe("chart bars stay inside the canvas", () => {
  it.each([100, 150, 256])("keeps every bar within a %i-pixel-wide chart", async (width) => {
    const result = await run({ objective: "bar chart of sales", context: "", width, height: 120 });
    expect(result.ok).toBe(true);
    const rects = [...String(result.svgCode).matchAll(/<rect x="([\d.]+)" y="[\d.]+" width="([\d.]+)"/g)];
    expect(rects.length).toBe(4);
    for (const [, x, w] of rects) {
      expect(Number(x) + Number(w)).toBeLessThanOrEqual(width);
    }
  });
});

describe("named colors match whole words", () => {
  it("does not treat 'credit' as 'red' or 'blackberry' as 'black'", async () => {
    const credit = await run({ assetType: "icon", objective: "credit card icon", context: "" });
    expect(credit.svgCode).not.toContain("#FF4444");
    const berry = await run({ assetType: "icon", objective: "blackberry logo", context: "" });
    expect(berry.svgCode).not.toContain("#333333");
  });
});

describe("published success discriminator", () => {
  it("keeps success alongside ok on success and failure results", async () => {
    const good = await run({ objective: "icon star", context: "" });
    expect(good).toMatchObject({ ok: true, success: true });
    const bad = await run({ objective: "icon", context: "", width: 0 });
    expect(bad).toMatchObject({ ok: false, success: false });
  });
});

describe("chart axis and per-axis text dimensions", () => {
  it("keeps the baseline inside a very narrow chart", async () => {
    const result = await run({ objective: "bar chart", context: "", width: 5, height: 40 });
    expect(result.ok).toBe(true);
    const line = String(result.svgCode).match(/<line x1="([\d.-]+)"[^>]*x2="([\d.-]+)"/);
    expect(line).not.toBeNull();
    expect(Number(line![1])).toBeGreaterThanOrEqual(0);
    expect(Number(line![2])).toBeLessThanOrEqual(5);
  });

  it("ignores an invalid text width when width is given explicitly", async () => {
    const result = await run({ objective: "icon 5000x128", context: "", width: 300 });
    expect(result.ok).toBe(true);
    expect(result.svgCode).toContain('width="300"');
    expect(result.svgCode).toContain('height="128"');
  });
});
