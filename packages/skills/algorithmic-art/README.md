# @h4shed/skill-algorithmic-art

Generative art using p5.js with seeded randomness, flow fields, and particle systems.

## Installation

```bash
npm install @h4shed/skill-algorithmic-art
```

## Tools

### `generate-art`

Generate algorithmic art with customizable patterns, colors, and complexity.

**Parameters:**
- `pattern` (required): `mandala`, `spiral`, `fractal`, `cellular`, or `random`
- `seed` (optional): Random seed for reproducible results
- `width` (optional): Canvas width in pixels (default: 800)
- `height` (optional): Canvas height in pixels (default: 600)
- `colors` (optional): Array of hex color codes
- `complexity` (optional): 1-10 (default: 5)

**Example:**
```javascript
const result = await callTool("generate-art", {
  pattern: "mandala",
  seed: 12345,
  colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
  complexity: 7
});
```

### `create-flow-field`

Create particle flow field visualizations with various algorithms.

**Parameters:**
- `algorithm` (required): `perlin-noise`, `curl-noise`, `force-field`, or `custom`
- `particles` (optional): Number of particles (default: 5000)
- `speed` (optional): Particle speed multiplier 0.1-10 (default: 1)
- `scale` (optional): Noise scale (default: 0.005)
- `trailLength` (optional): Trail fade in frames 0-100 (default: 50)

**Example:**
```javascript
const result = await callTool("create-flow-field", {
  algorithm: "perlin-noise",
  particles: 10000,
  speed: 2,
  trailLength: 75
});
```

## Use Cases

- 🎨 **Generative Art Projects** - Create unique, algorithmic artwork
- 🌀 **Data Visualization** - Visualize complex data using flow fields
- 🎮 **Game Development** - Generate procedural assets and effects
- 📊 **Scientific Visualization** - Visualize physics and mathematical concepts

## Implementation Status

- ✅ Tool definitions and schemas
- 📝 p5.js code generation templates
- ⏳ Full pattern implementations (WIP)

## See Also

- [p5.js Documentation](https://p5js.org)
- [Perlin Noise Guide](https://en.wikipedia.org/wiki/Perlin_noise)
- [Flow Fields Tutorial](https://thecodingtrain.com)

## Usage

This package exports an MCP skill definition that can be loaded by `@h4shed/mcp-core` via the workspace skill registry.

## Development

```bash
# from repository root
npm run build --workspace=packages/skills/algorithmic-art
npm run test --workspace=packages/skills/algorithmic-art
```

## License

Apache-2.0
