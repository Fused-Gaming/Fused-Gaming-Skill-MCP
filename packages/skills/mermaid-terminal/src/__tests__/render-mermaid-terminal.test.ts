/**
 * Tests for the render-mermaid-terminal tool, renderMermaidToText helper,
 * and the byte-for-byte login-flow fixture.
 */

import { describe, it, expect } from "@jest/globals";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RenderMermaidTerminalTool } from "../tools/render-mermaid-terminal.js";
import { renderMermaidToText } from "../lib/mermaid.js";
import { MermaidTerminalSkill } from "../index.js";

const FIXTURES = join(__dirname, "fixtures");

describe("login-flow fixture", () => {
  it("renders byte-for-byte identical to the checked-in expected output", () => {
    const source = readFileSync(join(FIXTURES, "login-flow.mmd"), "utf8");
    const expected = readFileSync(join(FIXTURES, "login-flow.txt"), "utf8");

    const result = renderMermaidToText(source);

    expect(result.ok).toBe(true);
    if (result.ok) expect(Buffer.from(result.text, "utf8").equals(Buffer.from(expected, "utf8"))).toBe(true);
  });
});

describe("renderMermaidToText", () => {
  it("renders a sequence diagram with participant aliases", () => {
    const result = renderMermaidToText(
      [
        "sequenceDiagram",
        "    participant A as Client",
        "    participant B as Server",
        "    A->>+B: Request token",
        "    B-->>-A: Token issued",
      ].join("\n"),
    );

    expect(result).toEqual({
      ok: true,
      diagramType: "sequenceDiagram",
      text:
        "sequenceDiagram (2 participants, 2 messages)\n" +
        "1. Client ->> Server: Request token\n" +
        "2. Server -->> Client: Token issued\n",
    });
  });

  it("lists isolated flowchart nodes after the edges", () => {
    const result = renderMermaidToText(
      ["flowchart TD", "    A[Start] --> B{Ready?}", "    B -->|yes| C((Go))", "    Orphan[Lonely]"].join("\n"),
    );

    expect(result).toEqual({
      ok: true,
      diagramType: "flowchart",
      text: "Flowchart TD (4 nodes, 2 edges)\nStart --> Ready?\nReady? --yes--> Go\n(isolated) Lonely\n",
    });
  });

  it("emits no ANSI escape codes", () => {
    const result = renderMermaidToText("flowchart TD\n A --> B");
    expect(result.ok && result.text.includes("\x1b[")).toBe(false);
  });

  it("is deterministic across repeated calls", () => {
    const source = "flowchart LR\n A --> B --> C";
    expect(renderMermaidToText(source)).toEqual(renderMermaidToText(source));
  });

  it("refuses diagram types without a terminal renderer", () => {
    const result = renderMermaidToText("stateDiagram-v2\n    [*] --> Idle");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.issues[0].code).toBe("UNSUPPORTED_RENDER_TYPE");
  });

  it("returns validation issues for invalid source", () => {
    const result = renderMermaidToText("flowchart TD\n    A[broken --> B");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.issues[0].code).toBe("UNBALANCED_BRACKETS");
  });

  it("reports a malformed edge that has no target node", () => {
    const result = renderMermaidToText("flowchart TD\n A --> ");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.issues[0]).toMatchObject({ code: "MALFORMED_EDGE", line: 2 });
  });
});

describe("RenderMermaidTerminalTool", () => {
  it("renders valid source through the tool handler", async () => {
    const result = await RenderMermaidTerminalTool.handler({ diagram: "flowchart TD\n A --> B" });
    expect(result).toEqual({
      ok: true,
      diagramType: "flowchart",
      text: "Flowchart TD (2 nodes, 1 edges)\nA --> B\n",
    });
  });

  it("returns structured errors from the handler on bad input", async () => {
    const result = await RenderMermaidTerminalTool.handler({ diagram: "   " });
    expect(result).toMatchObject({ ok: false, error: "Diagram source is empty" });
  });

  it("is registered with the skill alongside the other tools", () => {
    const names = (MermaidTerminalSkill.tools ?? []).map((t) => t.name);
    expect(names).toEqual(
      expect.arrayContaining(["generate-mermaid-diagram", "validate-mermaid-diagram", "render-mermaid-terminal"]),
    );
  });
});

describe("quoted labels", () => {
  it("does not split a node whose quoted label contains an arrow", () => {
    const result = renderMermaidToText(['flowchart LR', '    A["wait --> retry"] --> B'].join("\n"));

    expect(result).toEqual({
      ok: true,
      diagramType: "flowchart",
      text: "Flowchart LR (2 nodes, 1 edges)\nwait --> retry --> B\n",
    });
  });
});

describe("asymmetric node shapes", () => {
  it("accepts and renders an asymmetric id>label] node", () => {
    const result = renderMermaidToText(["flowchart LR", "    A>Flag] --> B"].join("\n"));
    expect(result).toMatchObject({ ok: true, diagramType: "flowchart" });
    expect(result.ok && result.text).toContain("Flag --> B");
  });
});

describe("inline edge labels", () => {
  it("keeps the source node and reads the label between the dashes", () => {
    const result = renderMermaidToText(["flowchart LR", "    A -- yes --> B"].join("\n"));
    expect(result).toEqual({
      ok: true,
      diagramType: "flowchart",
      text: "Flowchart LR (2 nodes, 1 edges)\nA --yes--> B\n",
    });
  });
});

describe("comparison text outside flowcharts", () => {
  it("accepts a '>' in a sequence message without treating it as a node shape", () => {
    const result = renderMermaidToText(["sequenceDiagram", "    A->>B: x>0"].join("\n"));
    expect(result).toMatchObject({ ok: true, diagramType: "sequenceDiagram" });
  });
});
