# @h4shed/skill-dynagraph

Vector-first dynamic Open Graph image renderer — MCP skill adapter

**Status:** Phase 1 Scaffold (Design & Integration)  
**Version:** 1.0.0  
**License:** Apache-2.0 (MCP Adapter)

## Overview

Dynagraph is a **vector-first, high-fidelity dynamic Open Graph image renderer** designed to integrate with Claude and Fused Gaming's MCP ecosystem.

This package is the **MCP adapter skill** that enables Claude to use Dynagraph's rendering capabilities. The actual rendering engine lives in the standalone [`fused-gaming/dynagraph`](https://github.com/Fused-Gaming/dynagraph) repository (Phase 7+).

## Features (Phase 1)

✅ MCP tool definitions for four core capabilities:
- **dynagraph_render** — Render dynamic OG images using templates
- **dynagraph_list_templates** — Discover available templates  
- **dynagraph_validate_template** — Validate template TypeScript
- **dynagraph_preview** — Generate SVG previews

⏳ Phase 8+ features:
- Full vector rendering pipeline (SVG → PNG/WebP)
- Custom template system
- Performance optimization
- HTTP API server
- Commercial licensing

## Installation

```bash
npm install @h4shed/skill-dynagraph
```

## Usage

### With Claude Desktop or MCP

To enable the skill, add it to your MCP configuration (e.g., `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "fused-gaming-skill-mcp": {
      "command": "node",
      "args": ["/path/to/fused-gaming-skill-mcp/dist/index.js"]
    }
  }
}
```

Then ensure `dynagraph` is listed in your `.fused-gaming-mcp.json` configuration file:

```json
{
  "skills": ["dynagraph", "...other-skills"]
}
```

Once enabled, all four Dynagraph tools (`dynagraph_render`, `dynagraph_list_templates`, `dynagraph_validate_template`, `dynagraph_preview`) become available to Claude.

### Manual Tool Invocation

```typescript
import { renderTool, dynagraphSkill } from "@h4shed/skill-dynagraph";

// Use the exported tool directly
const result = await renderTool.handler({
  template: "profile",
  props: {
    title: "John Doe",
    subtitle: "Full Stack Engineer",
  },
  width: 1200,
  height: 630,
  format: "svg",
});

// Or initialize the skill and access tools via the skill object
const skill = dynagraphSkill;
```

## Tools

### `dynagraph_render`

Renders a dynamic Open Graph image.

**Input:**
- `template` (string, required): Template ID (`profile`, `article`, `product`)
- `props` (object, required): Template-specific properties
- `width` (number, optional): Image width in pixels (default: 1200)
- `height` (number, optional): Image height in pixels (default: 630)
- `dpr` (number, optional): Device pixel ratio (default: 1)
- `format` (string, optional): Output format — `svg`, `png`, or `webp` (default: `png`)

**Output:**
- `success` (boolean): Whether rendering succeeded
- `template` (string): Template ID used
- `dimensions` (object): Image dimensions and DPR
- `format` (string): Output format
- `svg` (string): SVG output or placeholder
- `base64` (string): Base64-encoded output

### `dynagraph_list_templates`

Lists all available templates.

**Output:**
- `success` (boolean): Whether operation succeeded
- `count` (number): Number of templates
- `templates` (array): Template metadata array

### `dynagraph_validate_template`

Validates a template TypeScript definition.

**Input:**
- `template_code` (string, required): TypeScript template code
- `template_id` (string, optional): Template ID for context

**Output:**
- `success` (boolean): Whether template is valid
- `valid` (boolean): Validation result
- `errors` (array): Validation errors
- `warnings` (array): Validation warnings

### `dynagraph_preview`

Generates a quick SVG preview of a template.

**Input:**
- `template` (string, required): Template ID
- `props` (object, required): Sample properties
- `width` (number, optional): Preview width (default: 600)
- `height` (number, optional): Preview height (default: 315)

**Output:**
- `success` (boolean): Whether preview was generated
- `template` (string): Template ID
- `dimensions` (object): Preview dimensions
- `svg` (string): SVG preview
- `base64` (string): Base64-encoded SVG

## Architecture

```
Claude Desktop / API
  ↓ (tool_use)
MCP Core
  ├─ @h4shed/skill-dynagraph (this package)
  │   ├─ depends: @h4shed/mcp-core
  │   └─ integrates: @h4shed/dynagraph (SDK from standalone repo — Phase 7+)
  │
  └─ [Other skills]

@h4shed/dynagraph (Standalone Repository — Phase 7+)
  ├─ Core rendering engine
  ├─ Template system
  ├─ SVG → PNG/WebP rasterization
  └─ Licensing system
```

See [`DYNAGRAPH-INTEGRATION.md`](../../docs/architecture/DYNAGRAPH-INTEGRATION.md) for full architecture.

## Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Test

```bash
npm test
```

## Development Phases

### Phase 1 (Current)
✅ MCP adapter scaffold  
✅ Tool definitions  
✅ Phase 1 placeholder implementations  

### Phase 7+ (Standalone Repository)
⏳ Create `fused-gaming/dynagraph` repository  
⏳ Implement core rendering pipeline  
⏳ Build template system  
⏳ Setup HTTP API  

### Phase 8+
⏳ Full vector rendering  
⏳ SVG → PNG/WebP rasterization  
⏳ Performance optimization  
⏳ Visual regression tests  
⏳ Commercial licensing

## Integration Points

### MCP Tool Registration

Tools are automatically registered with MCP via `@h4shed/mcp-core` patterns.

### Design Token Integration

```typescript
import { tokens } from "@h4shed/design-tokens";

// Use for default theme
const defaultTheme = {
  colors: tokens.colors,
  typography: tokens.typography,
  spacing: tokens.spacing,
};
```

### Licensing Integration (Phase 8+)

```typescript
import { validateLicense } from "@h4shed/license-client";

const license = await validateLicense(projectToken);
// Handle commercial vs. noncommercial rendering
```

## Documentation

- **Architecture:** [`docs/architecture/DYNAGRAPH-INTEGRATION.md`](../../docs/architecture/DYNAGRAPH-INTEGRATION.md)
- **Audit Summary:** [`docs/architecture/AUDIT-SUMMARY.md`](../../docs/architecture/AUDIT-SUMMARY.md)
- **Package Inventory:** [`docs/architecture/PACKAGE-INVENTORY.md`](../../docs/architecture/PACKAGE-INVENTORY.md)
- **Licensing:** [`docs/legal/LICENSING-STRATEGY.md`](../../docs/legal/LICENSING-STRATEGY.md)

## Next Steps

1. ✅ Phase 1 scaffolding complete
2. ⏳ Create standalone `fused-gaming/dynagraph` repository (Phase 7)
3. ⏳ Implement rendering pipeline (Phase 8+)
4. ⏳ Build commercial licensing system (Phase 9+)

## Related

- **Tracking Issue:** [#322](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/issues/322)
- **Architecture PR:** [#323](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/pull/323)
- **Standalone Repo:** `fused-gaming/dynagraph` (Phase 7+)

## License

Apache-2.0

---

**Note:** The Dynagraph MCP adapter is licensed under Apache-2.0 (permissive, ecosystem-friendly). The standalone `fused-gaming/dynagraph` rendering engine will use a separate dual-licensing model (PolyForm Noncommercial + Commercial).
