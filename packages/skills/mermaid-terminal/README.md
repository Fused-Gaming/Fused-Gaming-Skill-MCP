# @h4shed/skill-mermaid-terminal

Generate, validate and render terminal-friendly Mermaid diagrams.

## Installation

```bash
npm install @h4shed/skill-mermaid-terminal
```

## Tools

| Tool | Purpose |
| --- | --- |
| `generate-mermaid-diagram` | Build a flowchart, sequence or state diagram from a text objective. |
| `validate-mermaid-diagram` | Validate Mermaid source and return structured issues. |
| `render-mermaid-terminal` | Render flowchart/graph or sequence source as plain, ANSI-free text. |

### `generate-mermaid-diagram`

Input: `objective` (required), `context` (optional), `type` (`flowchart`, `sequenceDiagram`, `stateDiagram`, or `auto`).
Output: `{ success, diagramType, mermaidCode, textPreview, description }` or `{ success: false, error }`.

### `validate-mermaid-diagram`

Input: `diagram` (string).

- Rejects empty input (`EMPTY_INPUT`), input over 10,000 characters (`INPUT_TOO_LARGE`), and unknown or missing diagram types (`UNKNOWN_DIAGRAM_TYPE`).
- Reports unbalanced `()`, `[]`, `{}` (`UNBALANCED_BRACKETS`) and unclosed quotes (`UNBALANCED_QUOTES`), with line numbers. Brackets inside `"quoted"` labels are ignored.
- Success: `{ ok: true, diagramType, lineCount }`. Failure: `{ ok: false, error, issues: [{ code, message, line? }] }`.

### `render-mermaid-terminal`

Input: `diagram` (string). Supports `flowchart`/`graph` and `sequenceDiagram`. Other types return `UNSUPPORTED_RENDER_TYPE`.
Output is deterministic for a given input. Example:

```
flowchart LR
    Start([Start]) --> Login[Enter credentials]
    Login -->|ok| Done([End])
```

renders as

```
Flowchart LR (3 nodes, 2 edges)
Start --> Enter credentials
Enter credentials --ok--> End
```

Failure: `{ ok: false, error, issues }`, using the same codes as the validator plus `MALFORMED_EDGE`.

## Usage

```typescript
import { MermaidTerminalSkill, renderMermaidToText, validateMermaidDiagram } from "@h4shed/skill-mermaid-terminal";

const check = validateMermaidDiagram("flowchart TD\n    A --> B");
const rendered = renderMermaidToText("sequenceDiagram\n    A->>B: hello");
```

The default export is an MCP skill definition that can be loaded by `@h4shed/mcp-core` via the workspace skill registry.

## Development

```bash
# from repository root
npm run build --workspace=packages/skills/mermaid-terminal
npm run test --workspace=packages/skills/mermaid-terminal
```

Test fixtures live in `src/__tests__/fixtures/` (`login-flow.mmd` and its expected output `login-flow.txt`).

## License

Apache-2.0
