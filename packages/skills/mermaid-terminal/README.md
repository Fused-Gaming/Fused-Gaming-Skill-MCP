# @fused-gaming/skill-mermaid-terminal

Generate terminal-friendly Mermaid diagrams and flowcharts.

## Installation

```bash
npm install @fused-gaming/skill-mermaid-terminal
```

## Tools

### `generate-mermaid-diagram`

Generate terminal-friendly Mermaid diagrams and flowcharts.

## Implementation Status

- ✅ Package scaffolded
- ✅ Tool schema and handler stub
- ✅ Full production implementation complete
- ✅ Comprehensive test suite added
- ✅ Ready for release

## Features

- **Auto-detection**: Automatically detects diagram type from objective description
- **Multiple diagram types**: Flowchart, Sequence, State diagrams
- **Terminal-friendly**: Generates clean, readable Mermaid syntax
- **Context-aware**: Uses additional context to enhance diagram generation
- **Production-ready**: Full error handling and test coverage

## Usage Examples

```typescript
// Generate a flowchart automatically
{
  objective: "User login, validation, redirect to dashboard"
}

// Explicit sequence diagram
{
  objective: "Client sends request to server, server validates and responds",
  type: "sequenceDiagram"
}

// State machine with context
{
  objective: "Initial, Processing, Complete",
  type: "stateDiagram",
  context: "Orders workflow"
}
```
