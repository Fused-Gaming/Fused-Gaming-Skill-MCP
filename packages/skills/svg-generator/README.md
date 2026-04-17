# @fused-gaming/skill-svg-generator

Generate SVG assets and icon concepts from structured prompts.

## Installation

```bash
npm install @fused-gaming/skill-svg-generator
```

## Tools

### `generate-svg-asset`

Generate SVG assets and icon concepts from structured prompts.

## Implementation Status

- ✅ Package scaffolded
- ✅ Tool schema and handler stub
- ✅ Full production implementation complete
- ✅ Comprehensive test suite added
- ✅ Ready for release

## Features

- **Multiple asset types**: Icons, components, patterns, charts, illustrations, logos
- **Smart type detection**: Automatically detects asset type from description
- **Color extraction**: Identifies colors from natural language descriptions
- **SVG generation**: Generates clean, valid SVG code
- **Asset customization**: Support for various icon shapes (circle, star, heart)
- **Component templates**: Pre-built button and UI component generation
- **Pattern generation**: Creates repeating geometric patterns
- **Chart visualization**: Generates simple data visualization charts

## Usage Examples

```typescript
// Generate a blue star icon
{
  objective: "Blue star icon",
  type: "icon"
}

// Generate a green button component
{
  objective: "Green button component with click label",
  type: "component"
}

// Generate a geometric pattern
{
  objective: "Red and yellow geometric pattern",
  type: "pattern"
}

// Generate a bar chart
{
  objective: "Bar chart with four data points"
}

// Auto-detect asset type
{
  objective: "Heart icon in red and pink"
}
```

## Supported Asset Types

- **icon**: Simple icons like circles, stars, hearts
- **component**: UI components like buttons
- **pattern**: Repeating geometric patterns
- **chart**: Data visualizations and charts
- **illustration**: Custom illustrations
- **logo**: Logo designs
- **auto**: Automatic type detection (default)
- ⏳ Full production implementation pending roadmap prioritization

## Usage

This package exports an MCP skill definition that can be loaded by `@fused-gaming/mcp-core` via the workspace skill registry.

## Development

```bash
# from repository root
npm run build --workspace=packages/skills/svg-generator
npm run test --workspace=packages/skills/svg-generator
```

## License

Apache-2.0
