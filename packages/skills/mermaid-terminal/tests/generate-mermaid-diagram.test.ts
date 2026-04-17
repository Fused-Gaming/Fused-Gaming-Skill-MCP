/**
 * Tests for Mermaid Terminal Tool
 */

import { describe, it, expect } from "@jest/globals";
import { GenerateMermaidDiagramTool } from "../src/tools/generate-mermaid-diagram.js";

describe("GenerateMermaidDiagramTool", () => {
  describe("tool definition", () => {
    it("should have correct name and description", () => {
      expect(GenerateMermaidDiagramTool.name).toBe("generate-mermaid-diagram");
      expect(GenerateMermaidDiagramTool.description).toContain("Mermaid");
    });

    it("should have valid input schema", () => {
      const schema = GenerateMermaidDiagramTool.inputSchema;
      expect(schema.type).toBe("object");
      expect(schema.properties).toHaveProperty("objective");
      expect(schema.required).toContain("objective");
    });
  });

  describe("handler - flowchart generation", () => {
    it("should generate a flowchart for basic objectives", async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: "User login, validation, redirect",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.diagramType).toBe("flowchart");
      expect(typeof result.mermaidCode).toBe("string");
      expect((result.mermaidCode as string).includes("flowchart")).toBe(true);
    });

    it("should include objective in the description", async () => {
      const objective = "Payment processing workflow";
      const result = (await GenerateMermaidDiagramTool.handler({
        objective,
      })) as Record<string, unknown>;

      expect(result.description).toContain(objective);
    });

    it("should provide text preview of the diagram", async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: "Test workflow",
      })) as Record<string, unknown>;

      expect(result.textPreview).toBeDefined();
      expect(typeof result.textPreview).toBe("string");
      expect((result.textPreview as string).includes("```mermaid")).toBe(true);
    });
  });

  describe("handler - sequence diagram detection", () => {
    it("should detect and generate sequence diagrams for interaction objectives", async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: "User sends request, system processes, returns response",
        type: "sequenceDiagram",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.diagramType).toBe("sequenceDiagram");
      expect((result.mermaidCode as string).includes("sequenceDiagram")).toBe(
        true
      );
    });

    it("should auto-detect sequence diagrams from keywords", async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: "sequence of interactions between client and server",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.diagramType).toBe("sequenceDiagram");
    });
  });

  describe("handler - state diagram detection", () => {
    it("should generate state diagrams for state-based objectives", async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: "Initial, Processing, Complete",
        type: "stateDiagram",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.diagramType).toBe("stateDiagram");
      expect((result.mermaidCode as string).includes("stateDiagram")).toBe(
        true
      );
    });

    it("should auto-detect state diagrams from keywords", async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: "State machine with transitions between states",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.diagramType).toBe("stateDiagram");
    });
  });

  describe("handler - error handling", () => {
    it("should return error for missing objective", async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: "",
      })) as Record<string, unknown>;

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("required");
    });

    it("should return error for undefined objective", async () => {
      const result = (await GenerateMermaidDiagramTool.handler({})) as Record<
        string,
        unknown
      >;

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle whitespace-only objectives", async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: "   \n\t  ",
      })) as Record<string, unknown>;

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("handler - context usage", () => {
    it("should use context when provided", async () => {
      const context = "Actors: Client, Server, Database";
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: "interaction flow",
        context,
        type: "sequenceDiagram",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      // The context should influence the diagram generation
      expect(result.mermaidCode).toBeDefined();
    });
  });

  describe("handler - diagram type specification", () => {
    it("should respect explicit diagram type parameter", async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: "Some workflow",
        type: "stateDiagram",
      })) as Record<string, unknown>;

      expect(result.diagramType).toBe("stateDiagram");
    });

    it("should handle auto type detection", async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: "Some workflow",
        type: "auto",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.diagramType).toBeDefined();
    });

    it("should default to auto detection when type not specified", async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: "Some workflow",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.diagramType).toBeDefined();
    });
  });

  describe("mermaid code generation", () => {
    it("should generate valid Mermaid code structure", async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: "Process flow with multiple steps",
      })) as Record<string, unknown>;

      const code = result.mermaidCode as string;

      // Check for basic Mermaid syntax
      expect(code).toMatch(/flowchart|sequenceDiagram|stateDiagram/);
      expect(code.length).toBeGreaterThan(0);
    });

    it("should handle long objectives appropriately", async () => {
      const longObjective =
        "This is a very long objective that describes a complex workflow with many steps including user authentication, data validation, processing, and final output generation";
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: longObjective,
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.mermaidCode).toBeDefined();
      // Ensure we truncate appropriately to prevent overly long labels
      const code = result.mermaidCode as string;
      expect(code.length).toBeLessThan(2000);
    });
  });

  describe("response structure", () => {
    it("should return complete response object on success", async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: "Test",
      })) as Record<string, unknown>;

      expect(result.success).toBe(true);
      expect(result.diagramType).toBeDefined();
      expect(result.mermaidCode).toBeDefined();
      expect(result.textPreview).toBeDefined();
      expect(result.description).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it("should return error-only response on failure", async () => {
      const result = (await GenerateMermaidDiagramTool.handler({
        objective: "",
      })) as Record<string, unknown>;

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
