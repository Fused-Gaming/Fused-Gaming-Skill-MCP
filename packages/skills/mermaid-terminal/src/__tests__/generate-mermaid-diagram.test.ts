/**
 * Tests for the generate-mermaid-diagram tool.
 */

import { describe, it, expect } from "@jest/globals";
import { GenerateMermaidDiagramTool } from "../tools/generate-mermaid-diagram.js";
import { validateMermaidDiagram } from "../lib/mermaid.js";

type Result = Record<string, unknown> & { success: boolean; error?: string };

const run = async (input: Record<string, unknown>): Promise<Result> =>
  (await GenerateMermaidDiagramTool.handler(input)) as Result;

describe("GenerateMermaidDiagramTool", () => {
  it("exposes its name, description and required objective", () => {
    expect(GenerateMermaidDiagramTool.name).toBe("generate-mermaid-diagram");
    expect(GenerateMermaidDiagramTool.inputSchema.required).toContain("objective");
  });

  describe("happy path", () => {
    it("generates a flowchart by default with start and end nodes", async () => {
      const result = await run({ objective: "Enter credentials, validate, grant access" });

      expect(result.success).toBe(true);
      expect(result.diagramType).toBe("flowchart");
      const code = result.mermaidCode as string;
      expect(code.startsWith("flowchart TD\n")).toBe(true);
      expect(code).toContain("Start([Start])");
      expect(code).toContain("End([End])");
    });

    it("returns all output fields on success", async () => {
      const result = await run({ objective: "Simple workflow" });

      expect(result.success).toBe(true);
      expect(typeof result.mermaidCode).toBe("string");
      expect(typeof result.textPreview).toBe("string");
      expect(result.textPreview as string).toContain("```mermaid");
      expect(result.description as string).toContain("flowchart");
    });

    it("generates a sequence diagram when requested explicitly", async () => {
      const result = await run({
        objective: "Client sends request, server responds",
        type: "sequenceDiagram",
      });

      expect(result.success).toBe(true);
      expect(result.diagramType).toBe("sequenceDiagram");
      expect(result.mermaidCode as string).toContain("A->>+B: Client sends request");
    });

    it("generates a state diagram when requested explicitly", async () => {
      const result = await run({ objective: "Initial, Processing, Complete", type: "stateDiagram" });

      expect(result.success).toBe(true);
      expect(result.mermaidCode as string).toContain("stateDiagram-v2");
      expect(result.mermaidCode as string).toContain('State2 : "Processing"');
    });

    it("auto-detects sequence and state diagrams from keywords", async () => {
      const seq = await run({ objective: "Sequence diagram of user interaction with API" });
      const state = await run({ objective: "State machine with transitions" });

      expect(seq.diagramType).toBe("sequenceDiagram");
      expect(state.diagramType).toBe("stateDiagram");
    });

    it("falls back to flowchart for class-style objectives it does not render", async () => {
      const result = await run({ objective: "Class diagram showing object relationships" });

      expect(result.success).toBe(true);
      expect(result.diagramType).toBe("flowchart");
    });

    it("sanitises double quotes so generated labels stay valid Mermaid", async () => {
      const result = await run({ objective: 'Say "hi", then leave' });
      const code = result.mermaidCode as string;

      expect(code).toContain("Step1[\"Say 'hi'\"]");
      expect(validateMermaidDiagram(code).ok).toBe(true);
    });

    it("produces output that passes the validation tool", async () => {
      for (const type of ["flowchart", "sequenceDiagram", "stateDiagram"]) {
        const result = await run({ objective: "Alpha, Beta, Gamma", type });
        expect(validateMermaidDiagram(result.mermaidCode).ok).toBe(true);
      }
    });
  });

  describe("failure path", () => {
    it("rejects an empty objective", async () => {
      const result = await run({ objective: "" });
      expect(result.success).toBe(false);
      expect(result.error).toContain("must not be empty");
    });

    it("rejects a whitespace-only objective", async () => {
      const result = await run({ objective: "   " });
      expect(result.success).toBe(false);
    });

    it("rejects a missing or non-string objective", async () => {
      const missing = await run({});
      const numeric = await run({ objective: 42 });

      expect(missing.success).toBe(false);
      expect(numeric.success).toBe(false);
      expect(numeric.error).toContain("must be a string");
    });

    it("rejects an unsupported diagram type with a clear message", async () => {
      const result = await run({ objective: "Anything", type: "pie" });

      expect(result.success).toBe(false);
      expect(result.error).toContain('"pie"');
    });
  });
});
