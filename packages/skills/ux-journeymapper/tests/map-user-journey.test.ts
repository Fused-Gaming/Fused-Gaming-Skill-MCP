/**
 * Tests for UX Journeymapper Tool
 */

import { describe, it, expect } from "@jest/globals";
import { MapUserJourneyTool } from "../src/tools/map-user-journey.js";

describe("MapUserJourneyTool", () => {
  describe("tool definition", () => {
    it("should have correct name and description", () => {
      expect(MapUserJourneyTool.name).toBe("map-user-journey");
      expect(MapUserJourneyTool.description).toContain("journey");
    });

    it("should have valid input schema", () => {
      const schema = MapUserJourneyTool.inputSchema;
      expect(schema.type).toBe("object");
      expect(schema.properties).toHaveProperty("objective");
      expect(schema.required).toContain("objective");
    });
  });

  describe("handler - journey mapping", () => {
    it("should generate a journey map for valid objectives", async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: "E-commerce customer journey",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.goal).toBe("E-commerce customer journey");
      expect(Array.isArray(result.stages)).toBe(true);
    });

    it("should include multiple journey stages", async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: "SaaS user onboarding journey",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      const stages = result.stages as Record<string, unknown>[];
      expect(stages.length).toBeGreaterThan(0);
      expect(stages.length).toBeLessThanOrEqual(8);
    });

    it("should generate touchpoints for each stage", async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: "Mobile app user journey",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      const stages = result.stages as Record<string, unknown>[];
      stages.forEach((stage) => {
        expect(Array.isArray(stage.touchpoints)).toBe(true);
        expect((stage.touchpoints as string[]).length).toBeGreaterThan(0);
      });
    });

    it("should identify pain points for each stage", async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: "Customer support journey",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      const stages = result.stages as Record<string, unknown>[];
      stages.forEach((stage) => {
        expect(Array.isArray(stage.painPoints)).toBe(true);
        expect((stage.painPoints as string[]).length).toBeGreaterThan(0);
      });
    });

    it("should identify opportunities for improvement", async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: "Product adoption journey",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      const stages = result.stages as Record<string, unknown>[];
      stages.forEach((stage) => {
        expect(Array.isArray(stage.opportunities)).toBe(true);
        expect((stage.opportunities as string[]).length).toBeGreaterThan(0);
      });
    });

    it("should capture emotional journey", async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: "User engagement journey",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      const stages = result.stages as Record<string, unknown>[];
      stages.forEach((stage) => {
        expect(Array.isArray(stage.emotions)).toBe(true);
        expect((stage.emotions as string[]).length).toBeGreaterThan(0);
      });
    });
  });

  describe("handler - persona context", () => {
    it("should use persona context when provided", async () => {
      const persona = "First-time buyer";
      const result = (await MapUserJourneyTool.handler({
        objective: "Purchase journey",
        context: persona,
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.persona).toBe(persona);
    });

    it("should use generic persona when context not provided", async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: "Generic journey",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.persona).toBe("General User");
    });
  });

  describe("handler - insights", () => {
    it("should generate key insights", async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: "Customer lifecycle journey",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(Array.isArray(result.keyInsights)).toBe(true);
      const insights = result.keyInsights as string[];
      expect(insights.length).toBeGreaterThan(0);
    });

    it("should provide summary of the journey", async () => {
      const objective = "Retail customer journey";
      const result = (await MapUserJourneyTool.handler({
        objective,
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.summary).toBeDefined();
      expect((result.summary as string).includes(objective)).toBe(true);
    });
  });

  describe("handler - error handling", () => {
    it("should return error for empty objective", async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: "",
      })) as Record<string, unknown>;

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("required");
    });

    it("should return error for missing objective", async () => {
      const result = (await MapUserJourneyTool.handler({})) as Record<
        string,
        unknown
      >;

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle whitespace-only objectives", async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: "   \n\t  ",
      })) as Record<string, unknown>;

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("response structure", () => {
    it("should return complete response object on success", async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: "Test journey",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.persona).toBeDefined();
      expect(result.goal).toBeDefined();
      expect(result.stages).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.keyInsights).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it("should return error-only response on failure", async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: "",
      })) as Record<string, unknown>;

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("stage generation", () => {
    it("should generate stages with all required properties", async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: "Complete user journey",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      const stages = result.stages as Record<string, unknown>[];
      stages.forEach((stage) => {
        expect(stage).toHaveProperty("stage");
        expect(stage).toHaveProperty("description");
        expect(stage).toHaveProperty("touchpoints");
        expect(stage).toHaveProperty("emotions");
        expect(stage).toHaveProperty("painPoints");
        expect(stage).toHaveProperty("opportunities");
      });
    });

    it("should generate reasonable number of stages", async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: "Test journey",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      const stages = result.stages as Record<string, unknown>[];
      expect(stages.length).toBeGreaterThanOrEqual(1);
      expect(stages.length).toBeLessThanOrEqual(8);
    });
  });

  describe("journey type detection", () => {
    it("should detect awareness stage from keywords", async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: "awareness and discovery phase",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      const stages = result.stages as Record<string, unknown>[];
      const stageNames = stages.map((s) => (s.stage as string).toLowerCase());
      expect(stageNames.some((n) => n.includes("aware"))).toBe(true);
    });

    it("should detect consideration stage from keywords", async () => {
      const result = (await MapUserJourneyTool.handler({
        objective: "consideration and evaluation",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      const stages = result.stages as Record<string, unknown>[];
      const stageNames = stages.map((s) => (s.stage as string).toLowerCase());
      expect(stageNames.some((n) => n.includes("consider"))).toBe(true);
    });
  });
});
