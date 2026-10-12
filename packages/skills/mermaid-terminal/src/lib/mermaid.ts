/**
 * Shared Mermaid helpers: validation (structured issues) and a
 * deterministic terminal renderer for flowchart and sequence diagrams.
 */

export const MAX_DIAGRAM_LENGTH = 10_000;

export const SUPPORTED_DIAGRAM_TYPES: readonly string[] = [
  "flowchart",
  "graph",
  "sequenceDiagram",
  "stateDiagram",
  "stateDiagram-v2",
  "classDiagram",
  "timeline",
];

export type ValidationIssue = {
  code: string;
  message: string;
  line?: number;
};

export type ValidationResult =
  | { ok: true; diagramType: string; lineCount: number }
  | { ok: false; error: string; issues: ValidationIssue[] };

export type RenderResult =
  | { ok: true; diagramType: string; text: string }
  | { ok: false; error: string; issues: ValidationIssue[] };

const OPENERS: Record<string, string> = { "(": ")", "[": "]", "{": "}" };
const CLOSERS = new Set([")", "]", "}"]);
/** Closer expected for each opener, including the asymmetric `id>label]` shape. */
const EXPECTED_CLOSER: Record<string, string> = { ...OPENERS, ">": "]" };

function fail(error: string, issues: ValidationIssue[]): { ok: false; error: string; issues: ValidationIssue[] } {
  return { ok: false, error, issues };
}

/**
 * Quote-aware bracket check. Brackets inside "double quoted" labels are ignored.
 */
function checkBrackets(lines: string[], asymmetricShapes: boolean): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const stack: Array<{ ch: string; line: number }> = [];

  lines.forEach((raw, index) => {
    const lineNo = index + 1;
    if (raw.trim().startsWith("%%")) return;

    let inQuote = false;
    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i];
      if (ch === '"') {
        inQuote = !inQuote;
        continue;
      }
      if (inQuote) continue;
      // A ">" opens an asymmetric shape only at top level, directly after a node id.
      // Arrows ("-->", "==>") and markup such as "<br>" are not shapes, so they are skipped.
      if (ch === ">") {
        // Only flowchart node declarations use this shape; elsewhere ">" is ordinary text.
        if (asymmetricShapes && stack.length === 0 && /[A-Za-z0-9_]/.test(raw[i - 1] ?? "")) {
          stack.push({ ch, line: lineNo });
        }
        continue;
      }
      if (OPENERS[ch]) {
        stack.push({ ch, line: lineNo });
      } else if (CLOSERS.has(ch)) {
        const top = stack.pop();
        if (!top || EXPECTED_CLOSER[top.ch] !== ch) {
          issues.push({
            code: "UNBALANCED_BRACKETS",
            message: `Unexpected closing '${ch}' at line ${lineNo}`,
            line: lineNo,
          });
          // Stop tracking further mismatches for this unmatched closer.
          if (top) stack.push(top);
        }
      }
    }

    if (inQuote) {
      issues.push({
        code: "UNBALANCED_QUOTES",
        message: `Unclosed double quote at line ${lineNo}`,
        line: lineNo,
      });
    }
  });

  for (const open of stack) {
    issues.push({
      code: "UNBALANCED_BRACKETS",
      message: `Unclosed '${open.ch}' opened at line ${open.line}`,
      line: open.line,
    });
  }

  return issues;
}

/** Validates Mermaid source and returns structured issues instead of throwing. */
export function validateMermaidDiagram(input: unknown): ValidationResult {
  if (typeof input !== "string") {
    return fail("Diagram source must be a string", [
      { code: "INVALID_INPUT", message: "diagram must be a string" },
    ]);
  }
  if (input.trim().length === 0) {
    return fail("Diagram source is empty", [
      { code: "EMPTY_INPUT", message: "diagram must contain Mermaid source" },
    ]);
  }
  if (input.length > MAX_DIAGRAM_LENGTH) {
    return fail(`Diagram source exceeds ${MAX_DIAGRAM_LENGTH} characters`, [
      {
        code: "INPUT_TOO_LARGE",
        message: `received ${input.length} characters; limit is ${MAX_DIAGRAM_LENGTH}`,
      },
    ]);
  }

  const lines = input.split(/\r?\n/);
  const issues: ValidationIssue[] = [];

  const headerIndex = lines.findIndex((l) => l.trim().length > 0 && !l.trim().startsWith("%%"));
  const keyword = headerIndex >= 0 ? (lines[headerIndex].trim().split(/\s+/)[0] ?? "") : "";
  if (!SUPPORTED_DIAGRAM_TYPES.includes(keyword)) {
    issues.push({
      code: "UNKNOWN_DIAGRAM_TYPE",
      message: `Unknown or missing diagram type "${keyword}"; expected one of ${SUPPORTED_DIAGRAM_TYPES.join(", ")}`,
      line: headerIndex >= 0 ? headerIndex + 1 : 1,
    });
  }

  issues.push(...checkBrackets(lines, keyword === "flowchart" || keyword === "graph"));

  if (issues.length > 0) {
    return fail(`Diagram failed validation with ${issues.length} issue(s)`, issues);
  }
  return { ok: true, diagramType: keyword, lineCount: lines.length };
}

// ---------------------------------------------------------------------------
// Terminal rendering
// ---------------------------------------------------------------------------

const ARROW_PATTERN = /(--\s[^>]*?\s-->|-\.->|==>|-->|---)(?:\s*\|([^|]*)\|)?/g;

/**
 * Blanks the contents of double-quoted labels so an arrow written inside a label
 * is not treated as an edge. The length is kept, so match offsets still index the
 * original line.
 */
function maskQuotedLabels(line: string): string {
  return line.replace(/"[^"]*"/g, (quoted) => " ".repeat(quoted.length));
}
const NON_NODE_KEYWORDS = new Set(["subgraph", "end", "classdef", "class", "style", "linkstyle", "click", "direction"]);

function stripShape(rest: string): string {
  return rest
    .trim()
    .replace(/^[\[(){>]+/, "")
    .replace(/[\])}]+$/, "")
    .replace(/^"(.*)"$/, "$1")
    .trim();
}

interface ParsedNode {
  id: string;
  label: string;
  explicit: boolean;
}

function parseNode(text: string): ParsedNode | null {
  const match = /^([A-Za-z0-9_][A-Za-z0-9_.-]*)\s*(.*)$/.exec(text.trim());
  if (!match) return null;
  const rest = match[2].trim();
  if (rest.length === 0) return { id: match[1], label: match[1], explicit: false };
  const label = stripShape(rest);
  return { id: match[1], label: label.length > 0 ? label : match[1], explicit: true };
}

function renderFlowchart(lines: string[], header: string): RenderResult {
  const direction = header.split(/\s+/)[1] ?? "TD";
  const labels = new Map<string, string>();
  const order: string[] = [];
  const edges: Array<{ from: string; to: string; label?: string }> = [];
  const issues: ValidationIssue[] = [];

  const register = (node: ParsedNode): void => {
    if (!labels.has(node.id)) {
      order.push(node.id);
      labels.set(node.id, node.label);
    } else if (node.explicit) {
      labels.set(node.id, node.label);
    }
  };

  lines.forEach((raw, index) => {
    const line = raw.trim();
    const lineNo = index + 1;
    if (!line || line.startsWith("%%")) return;
    const firstToken = (line.split(/\s+/)[0] ?? "").toLowerCase();
    if (NON_NODE_KEYWORDS.has(firstToken)) return;
    if (index === 0 && /^(flowchart|graph)\b/i.test(line)) return;

    const parts: string[] = [];
    const edgeLabels: Array<string | undefined> = [];
    const masked = maskQuotedLabels(line);
    ARROW_PATTERN.lastIndex = 0;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = ARROW_PATTERN.exec(masked)) !== null) {
      const end = ARROW_PATTERN.lastIndex;
      parts.push(line.slice(last, m.index));
      // Read the edge label from the original line so quoted label text is kept.
      const token = line.slice(m.index, end);
      const pipeLabel = /\|([^|]*)\|/.exec(token)?.[1].trim();
      // Inline form "-- text -->" carries its label between the dashes.
      const inlineLabel = /^--\s.*\s-->$/.test(token) ? token.slice(2, -3).trim() : undefined;
      edgeLabels.push(pipeLabel || inlineLabel || undefined);
      last = end;
    }
    parts.push(line.slice(last));

    const nodes = parts.map((p) => parseNode(p));
    if (nodes.length === 1) {
      if (nodes[0]) register(nodes[0]);
      return;
    }
    if (nodes.some((n) => n === null)) {
      issues.push({ code: "MALFORMED_EDGE", message: `Could not parse node in line ${lineNo}`, line: lineNo });
      return;
    }
    const resolved = nodes as ParsedNode[];
    resolved.forEach(register);
    for (let i = 0; i < resolved.length - 1; i++) {
      edges.push({ from: resolved[i].id, to: resolved[i + 1].id, label: edgeLabels[i] });
    }
  });

  if (issues.length > 0) {
    return { ok: false, error: "Flowchart could not be rendered", issues };
  }

  const out: string[] = [];
  out.push(`Flowchart ${direction} (${order.length} nodes, ${edges.length} edges)`);
  for (const edge of edges) {
    const from = labels.get(edge.from) ?? edge.from;
    const to = labels.get(edge.to) ?? edge.to;
    out.push(edge.label ? `${from} --${edge.label}--> ${to}` : `${from} --> ${to}`);
  }
  const connected = new Set<string>();
  edges.forEach((e) => {
    connected.add(e.from);
    connected.add(e.to);
  });
  for (const id of order) {
    if (!connected.has(id)) out.push(`(isolated) ${labels.get(id)}`);
  }
  return { ok: true, diagramType: "flowchart", text: out.join("\n") + "\n" };
}

const MESSAGE_PATTERN =
  /^([A-Za-z0-9_]+)\s*(-->>|->>|--\)|-\)|--x|-x|-->|->)\s*[+-]?\s*([A-Za-z0-9_]+)\s*:\s*(.*?)\s*$/;

function renderSequence(lines: string[]): RenderResult {
  const labels = new Map<string, string>();
  const messages: Array<{ from: string; arrow: string; to: string; text: string }> = [];

  const ensure = (id: string): void => {
    if (!labels.has(id)) labels.set(id, id);
  };

  lines.forEach((raw, index) => {
    const line = raw.trim();
    if (!line || line.startsWith("%%") || index === 0) return;

    const declaration = /^(participant|actor)\s+([A-Za-z0-9_]+)(?:\s+as\s+(.+))?$/.exec(line);
    if (declaration) {
      labels.set(declaration[2], declaration[3] ? declaration[3].trim() : declaration[2]);
      return;
    }

    const message = MESSAGE_PATTERN.exec(line);
    if (message) {
      ensure(message[1]);
      ensure(message[3]);
      messages.push({ from: message[1], arrow: message[2], to: message[3], text: message[4] });
    }
  });

  const out: string[] = [];
  out.push(`sequenceDiagram (${labels.size} participants, ${messages.length} messages)`);
  messages.forEach((msg, i) => {
    const from = labels.get(msg.from) ?? msg.from;
    const to = labels.get(msg.to) ?? msg.to;
    out.push(`${i + 1}. ${from} ${msg.arrow} ${to}: ${msg.text}`);
  });
  return { ok: true, diagramType: "sequenceDiagram", text: out.join("\n") + "\n" };
}

/**
 * Renders flowchart and sequenceDiagram sources as plain, ANSI-free text.
 * Output is deterministic: the same input always yields the same bytes.
 */
export function renderMermaidToText(input: unknown): RenderResult {
  const validation = validateMermaidDiagram(input);
  if (!validation.ok) return validation;

  const source = input as string;
  const lines = source.split(/\r?\n/);
  const headerIndex = lines.findIndex((l) => l.trim().length > 0 && !l.trim().startsWith("%%"));
  const header = lines[headerIndex].trim();
  const keyword = validation.diagramType;

  if (keyword === "flowchart" || keyword === "graph") {
    return renderFlowchart(lines.slice(headerIndex), header);
  }
  if (keyword === "sequenceDiagram") {
    return renderSequence(lines.slice(headerIndex));
  }
  return fail(`Rendering is not supported for "${keyword}" diagrams; supported: flowchart, graph, sequenceDiagram`, [
    { code: "UNSUPPORTED_RENDER_TYPE", message: `no terminal renderer for ${keyword}`, line: headerIndex + 1 },
  ]);
}
