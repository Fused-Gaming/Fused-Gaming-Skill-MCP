# @h4shed/skill-dynagraph

MCP Skill adapter for **Dynagraph** — a vector-first, high-fidelity dynamic Open Graph image renderer.

```bash
npm install @h4shed/skill-dynagraph
```

---

## Features

- ✅ **Vector-first rendering** — SVG canonical format, deterministic output
- ✅ **Arbitrary dimensions** — Support any width/height combination
- ✅ **High-DPI output** — DPR 1-3 for retina displays
- ✅ **MCP integration** — Use with Claude Desktop and AI agents
- ✅ **Template system** — Compose complex OG images with TypeScript
- ✅ **Multiple formats** — SVG, PNG, WebP output
- ✅ **Dual licensing** — Free for noncommercial, commercial licenses available

---

## Quick Start

### As MCP Skill (Claude Desktop)

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "fused-gaming-mcp": {
      "command": "npm",
      "args": ["run", "dev"],
      "cwd": "/path/to/fused-gaming-skill-mcp"
    }
  }
}
```

Then in Claude:
```
render a profile OG image with title "John Doe", subtitle "Engineer"
```

### As SDK (Direct Usage)

```bash
npm install @h4shed/dynagraph
```

```typescript
import { render } from '@h4shed/dynagraph';

const png = await render({
  template: 'profile',
  props: {
    title: 'John Doe',
    subtitle: 'Full Stack Engineer'
  },
  width: 1200,
  height: 630,
  dpr: 2,
  format: 'png'
});

// Returns: Buffer containing PNG data
```

### CLI Tool

```bash
npx @h4shed/dynagraph render profile \
  --title "John Doe" \
  --subtitle "Engineer" \
  --out og.png
```

---

## Architecture

```
Claude
  ↓ (tool_use)
MCP Skill: dynagraph_render
  ↓
@h4shed/dynagraph SDK
  ├─ Template Engine
  ├─ Scene Graph
  └─ Rendering Pipeline
      ├─ SVG Output
      ├─ PNG/WebP Rasterization
      └─ High-DPI Support
```

---

## Available Tools

| Tool | Description |
|------|-------------|
| `dynagraph_render` | Render OG image from template |
| `dynagraph_list_templates` | List available templates |
| `dynagraph_validate_template` | Validate template TypeScript |
| `dynagraph_preview` | Preview SVG output |

---

## Development

```bash
# Build
npm run build

# Type check
npm run typecheck

# Lint
npm run lint

# Watch mode
npm run dev
```

---

## Status

**Current Version:** 1.0.0 (Scaffolding)

| Phase | Status | Description |
|-------|--------|-------------|
| **Phase 1** | ⏳ In Progress | Adapter scaffolding, Dynagraph standalone repo creation |
| **Phase 2** | ⏳ Planned | Core SDK implementation, tool handlers |
| **Phase 3** | ⏳ Planned | Production features, performance optimization |

---

## Licensing

**This adapter:** Apache-2.0 (permissive)

**Dynagraph SDK:** PolyForm Noncommercial 1.0.0 + Commercial License
- **Free:** Personal/noncommercial use
- **Commercial:** Paid licensing tiers available

See [LICENSING-STRATEGY.md](../../docs/legal/LICENSING-STRATEGY.md) for details.

---

## Documentation

- **[SKILL.md](./SKILL.md)** — Skill specification
- **[docs/architecture/DYNAGRAPH-INTEGRATION.md](../../docs/architecture/DYNAGRAPH-INTEGRATION.md)** — Integration architecture
- **[docs/legal/LICENSING-STRATEGY.md](../../docs/legal/LICENSING-STRATEGY.md)** — Licensing model
- **[docs/legal/CLEAN-ROOM.md](../../docs/legal/CLEAN-ROOM.md)** — Reference implementation record

---

## Related Projects

- **@h4shed/dynagraph** — Main rendering engine (separate repo)
- **@h4shed/mcp-core** — MCP framework
- **@h4shed/design-tokens** — Design system

---

## Support

- Issue tracker: [GitHub Issues](https://github.com/fused-gaming/fused-gaming-skill-mcp/issues)
- Documentation: [docs/architecture/](../../docs/architecture/)
- License inquiries: [LICENSING-STRATEGY.md](../../docs/legal/LICENSING-STRATEGY.md)

---

**Author:** Fused Gaming  
**License:** Apache-2.0  
**Repository:** https://github.com/fused-gaming/fused-gaming-skill-mcp
