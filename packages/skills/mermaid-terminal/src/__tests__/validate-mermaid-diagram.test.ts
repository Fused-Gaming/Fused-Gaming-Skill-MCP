/**
 * Tests for the validate-mermaid-diagram tool and validateMermaidDiagram helper.
 */

import { describe, it, expect } from "@jest/globals";
import { ValidateMermaidDiagramTool } from "../tools/validate-mermaid-diagram.js";
import { validateMermaidDiagram, MAX_DIAGRAM_LENGTH } from "../lib/mermaid.js";

describe("validateMermaidDiagram", () => {
  describe("happy path", () => {
    it.each([
      ["flowchart TD\n    A --> B", "flowchart"],
      ["graph LR\n    A --> B", "graph"],
      ["sequenceDiagram\n    A->>B: hi", "sequenceDiagram"],
      ["stateDiagram-v2\n    [*] --> Idle", "stateDiagram-v2"],
      ["classDiagram\n    class Animal", "classDiagram"],
      ["timeline\n    2024 : Launch", "timeline"],
    ])("accepts a %s header", (source, type) => {
      const result = validateMermaidDiagram(source);
      expect(result).toEqual({ ok: true, diagramType: type, lineCount: source.split("\n").length });
    });

    it("skips leading comment lines when locating the header", () => {
      const result = validateMermaidDiagram("%% note [unclosed\nflowchart TD\nA-->B");
      expect(result.ok).toBe(true);
    });

    it("ignores brackets inside quoted labels", () => {
      const result = validateMermaidDiagram('flowchart TD\n    A["a ] b ( c"] --> B');
      expect(result.ok).toBe(true);
    });
  });

  describe("failure path", () => {
    it("rejects empty and whitespace-only input", () => {
      for (const input of ["", "   \n  "]) {
        const result = validateMermaidDiagram(input);
        expect(result).toMatchObject({ ok: false, error: "Diagram source is empty" });
        if (!result.ok) expect(result.issues[0].code).toBe("EMPTY_INPUT");
      }
    });

    it("rejects non-string input", () => {
      const result = validateMermaidDiagram(123);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.issues[0].code).toBe("INVALID_INPUT");
    });

    it("rejects input over the size limit", () => {
      const source = "flowchart TD\n" + "A".repeat(MAX_DIAGRAM_LENGTH);
      const result = validateMermaidDiagram(source);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.issues[0].code).toBe("INPUT_TOO_LARGE");
    });

    it("rejects unknown diagram types with the offending line", () => {
      const result = validateMermaidDiagram("%% c\npie title Pets\n\"Dogs\" : 3");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues).toEqual([
          expect.objectContaining({ code: "UNKNOWN_DIAGRAM_TYPE", line: 2 }),
        ]);
      }
    });

    it("reports an unclosed opening bracket with its line number", () => {
      const result = validateMermaidDiagram("flowchart TD\n    A[Label --> B");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.issues).toEqual([
          expect.objectContaining({ code: "UNBALANCED_BRACKETS", line: 2 }),
        ]);
      }
    });

    it("reports an unexpected closing bracket", () => {
      const result = validateMermaidDiagram("flowchart TD\n    A) --> B");
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.issues[0].message).toContain("Unexpected closing ')' at line 2");
    });

    it("reports an unclosed double quote", () => {
      const result = validateMermaidDiagram('flowchart TD\n    A["open --> B');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.issues[0].code).toBe("UNBALANCED_QUOTES");
    });

    it("returns every issue found, not just the first", () => {
      const result = validateMermaidDiagram("pie\n    A[oops");
      expect(result.ok).toBe(false);
      if (!result.ok) {
        const codes = result.issues.map((i) => i.code);
        expect(codes).toEqual(expect.arrayContaining(["UNKNOWN_DIAGRAM_TYPE", "UNBALANCED_BRACKETS"]));
      }
    });
  });
});

describe("ValidateMermaidDiagramTool", () => {
  const call = async (input: Record<string, unknown>): Promise<Record<string, unknown>> =>
    (await ValidateMermaidDiagramTool.handler(input)) as Record<string, unknown>;

  it("returns ok for valid source", async () => {
    const result = await call({ diagram: "flowchart TD\n A-->B" });
    expect(result).toEqual({ ok: true, diagramType: "flowchart", lineCount: 2 });
  });

  it("returns structured errors for invalid source", async () => {
    const result = await call({ diagram: "" });
    expect(result).toMatchObject({ ok: false, error: "Diagram source is empty" });
    expect(Array.isArray(result.issues)).toBe(true);
  });

  it("treats a missing diagram field as invalid input", async () => {
    const result = await call({});
    expect(result.ok).toBe(false);
  });
});
