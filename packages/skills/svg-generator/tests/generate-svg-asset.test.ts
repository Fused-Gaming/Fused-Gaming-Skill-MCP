/**
 * Tests for SVG Generator Tool
 */

import { describe, it, expect } from "@jest/globals";
import { GenerateSvgAssetTool } from "../src/tools/generate-svg-asset.js";

describe("GenerateSvgAssetTool", () => {
  describe("tool definition", () => {
    it("should have correct name and description", () => {
      expect(GenerateSvgAssetTool.name).toBe("generate-svg-asset");
      expect(GenerateSvgAssetTool.description).toContain("SVG");
    });

    it("should have valid input schema", () => {
      const schema = GenerateSvgAssetTool.inputSchema;
      expect(schema.type).toBe("object");
      expect(schema.properties).toHaveProperty("objective");
      expect(schema.required).toContain("objective");
    });
  });

  describe("handler - asset generation", () => {
    it("should generate SVG assets for valid objectives", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "Blue circle icon",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.svgCode).toBeDefined();
      expect((result.svgCode as string).includes("<svg")).toBe(true);
    });

    it("should include SVG code in response", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "Red star icon",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      const svgCode = result.svgCode as string;
      expect(svgCode.includes("<svg")).toBe(true);
      expect(svgCode.includes("</svg>")).toBe(true);
    });

    it("should provide description for generated asset", async () => {
      const objective = "Green button component";
      const result = (await GenerateSvgAssetTool.handler({
        objective,
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.description).toBeDefined();
      expect((result.description as string).includes(objective)).toBe(true);
    });

    it("should include dimensions in response", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "Icon asset",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.dimensions).toBeDefined();
      const dims = result.dimensions as Record<string, unknown>;
      expect(dims.width).toBe(100);
      expect(dims.height).toBe(100);
    });
  });

  describe("handler - asset type detection", () => {
    it("should detect icon type from objective", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "Blue icon",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.assetType).toBe("icon");
    });

    it("should detect component type from objective", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "Button component",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.assetType).toBe("component");
    });

    it("should detect pattern type from objective", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "Geometric pattern",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.assetType).toBe("pattern");
    });

    it("should detect chart type from objective", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "Bar chart visualization",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.assetType).toBe("chart");
    });

    it("should respect explicit type parameter", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "Some shape",
        type: "pattern",
      })) as Record<string, unknown>;

      expect(result.assetType).toBe("pattern");
    });
  });

  describe("handler - color extraction", () => {
    it("should extract colors from objective", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "Red circle with blue outline",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(Array.isArray(result.colorPalette)).toBe(true);
      const palette = result.colorPalette as string[];
      expect(palette.length).toBeGreaterThan(0);
    });

    it("should include default colors when none specified", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "Generic asset",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(Array.isArray(result.colorPalette)).toBe(true);
      const palette = result.colorPalette as string[];
      expect(palette.length).toBeGreaterThan(0);
    });

    it("should recognize multiple colors", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "Red and green and blue pattern",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      const palette = result.colorPalette as string[];
      expect(palette.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("handler - context usage", () => {
    it("should use context when provided", async () => {
      const context = "Modern minimalist style";
      const result = (await GenerateSvgAssetTool.handler({
        objective: "Icon",
        context,
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.svgCode).toBeDefined();
    });
  });

  describe("handler - error handling", () => {
    it("should return error for empty objective", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "",
      })) as Record<string, unknown>;

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("required");
    });

    it("should return error for missing objective", async () => {
      const result = (await GenerateSvgAssetTool.handler({})) as Record<
        string,
        unknown
      >;

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle whitespace-only objectives", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "   \n\t  ",
      })) as Record<string, unknown>;

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("response structure", () => {
    it("should return complete response object on success", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "Test asset",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.assetType).toBeDefined();
      expect(result.svgCode).toBeDefined();
      expect(result.description).toBeDefined();
      expect(result.dimensions).toBeDefined();
      expect(result.colorPalette).toBeDefined();
      expect(result.complexity).toBeDefined();
      expect(result.previewText).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it("should return error-only response on failure", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "",
      })) as Record<string, unknown>;

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("SVG code validity", () => {
    it("should generate well-formed SVG for icons", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "star icon",
      })) as Record<string, unknown>;

      const svgCode = result.svgCode as string;
      expect(svgCode.includes('<svg')).toBe(true);
      expect(svgCode.includes('</svg>')).toBe(true);
      expect(svgCode.match(/<svg/g)!.length).toBe(
        svgCode.match(/<\/svg>/g)!.length
      );
    });

    it("should generate well-formed SVG for patterns", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "pattern background",
      })) as Record<string, unknown>;

      const svgCode = result.svgCode as string;
      expect(svgCode.includes('<svg')).toBe(true);
      expect(svgCode.includes('</svg>')).toBe(true);
    });

    it("should generate well-formed SVG for charts", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "chart visualization",
      })) as Record<string, unknown>;

      const svgCode = result.svgCode as string;
      expect(svgCode.includes('<svg')).toBe(true);
      expect(svgCode.includes('</svg>')).toBe(true);
    });
  });

  describe("preview generation", () => {
    it("should provide preview text", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "Icon",
      })) as Record<string, unknown>;

      expect(result.previewText).toBeDefined();
      expect((result.previewText as string).includes("```")).toBe(true);
    });

    it("should include SVG markers in preview", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "Icon",
      })) as Record<string, unknown>;

      const preview = result.previewText as string;
      expect(preview.includes("svg")).toBe(true);
    });
  });

  describe("specific asset types", () => {
    it("should generate heart icon", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "heart icon",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      const svgCode = result.svgCode as string;
      expect(svgCode).toContain("<svg");
    });

    it("should generate star icon", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "star icon",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      const svgCode = result.svgCode as string;
      expect(svgCode).toContain("<path");
    });

    it("should generate button component", async () => {
      const result = (await GenerateSvgAssetTool.handler({
        objective: "button component",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.assetType).toBe("component");
    });
  });
});
