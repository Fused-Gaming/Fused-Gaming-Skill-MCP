# @fused-gaming/skill-ascii-mockup

Mobile-first ASCII wireframe mockup generator for rapid UI prototyping.

## Installation

```bash
npm install @fused-gaming/skill-ascii-mockup
```

## Tools

### `generate-mockup`

Generate ASCII wireframe mockups for rapid prototyping.

**Parameters:**
- `type` (required): `mobile`, `tablet`, `desktop`, or `responsive`
- `layout` (optional): `single-column`, `two-column`, `three-column`, or `grid`
- `components` (optional): Array of component names

## Use Cases

- 📱 Mobile-first design planning
- 🖼️ Quick wireframe generation
- ✏️ Rapid prototyping

## Implementation Status

- ✅ Tool definitions
- 📝 ASCII rendering templates
- ⏳ Full implementation (WIP)

## Usage

This package exports an MCP skill definition that can be loaded by `@fused-gaming/mcp-core` via the workspace skill registry.

## Development

```bash
# from repository root
npm run build --workspace=packages/skills/ascii-mockup
npm run test --workspace=packages/skills/ascii-mockup
```

## License

Apache-2.0
