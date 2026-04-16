# @fused-gaming/skill-mermaid-terminal-skill

Visualization engine for generating Mermaid diagrams in Fused Gaming MCP.

## Installation

```bash
npm install @fused-gaming/skill-mermaid-terminal-skill
```

## Usage

This package exports Mermaid diagram generation utilities and tool schemas used by the MCP skill runtime.

```typescript
import { generateDiagram } from "@fused-gaming/skill-mermaid-terminal-skill";
```

## Tools

- `generate-diagram`
- `generate-flowchart`
- `generate-architecture`
- `generate-sequence`

## Development

```bash
# from repository root
npm run build --workspace=packages/skills/mermaid-terminal-skill
npm run test --workspace=packages/skills/mermaid-terminal-skill
```

## License

Apache-2.0
