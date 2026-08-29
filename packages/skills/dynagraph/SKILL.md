# Dynagraph MCP Skill

**Package:** `@h4shed/skill-dynagraph`  
**Version:** 1.0.0  
**Status:** Scaffolding Phase  
**License:** Apache-2.0  
**MCP Integration:** Ready for tool registration

---

## Overview

This skill provides MCP tool integration for **Dynagraph**, a vector-first dynamic Open Graph image rendering engine.

Dynagraph itself is maintained as a **separate, standalone npm package** (`@h4shed/dynagraph`) with independent licensing (PolyForm Noncommercial 1.0.0 + Commercial).

This adapter acts as a thin wrapper, exposing Dynagraph's rendering capabilities as MCP tools for use with Claude.

---

## Tools Provided

| Tool | Purpose | Status |
|------|---------|--------|
| `dynagraph_render` | Render OG image with specified template and props | ⏳ Phase 1 |
| `dynagraph_list_templates` | List available templates | ⏳ Phase 1 |
| `dynagraph_validate_template` | Validate template TypeScript definition | ⏳ Phase 1 |
| `dynagraph_preview` | Generate SVG preview | ⏳ Phase 1 |

---

## Usage Example

```typescript
// In Claude context, call:
// dynagraph_render with:
// {
//   template: "profile",
//   props: {
//     title: "John Doe",
//     subtitle: "Full Stack Engineer",
//     avatar: "https://example.com/avatar.jpg"
//   },
//   width: 1200,
//   height: 630,
//   dpr: 2,
//   format: "png"
// }
```

---

## Architecture

```
Claude Desktop / API
  ↓ (tool_use: dynagraph_render)
MCP Core (skill registry)
  ↓ (dispatch to tool handler)
Dynagraph Skill Adapter (this package)
  ↓ (imports SDK)
@h4shed/dynagraph (standalone, separate repo)
  ├─ Scene graph rendering
  ├─ SVG pipeline
  ├─ Rasterization (PNG/WebP)
  └─ Template system
```

---

## Dependencies

**Runtime:**
- `@h4shed/mcp-core` ^1.0.24 — MCP framework

**When Implemented:**
- `@h4shed/dynagraph` — Main rendering SDK (external dependency from separate repo)
- `@h4shed/license-client` — License validation (optional, for commercial tracking)

**Dev:**
- TypeScript 5.3.2
- Node types

---

## Implementation Plan

### Phase 1: Scaffolding ✅ (Current)
- [x] Create package structure
- [x] Define MCP tool interfaces
- [x] Document architecture
- [ ] Implement tool handlers (blocked on Dynagraph SDK availability)

### Phase 2: Core Integration ⏳
- [ ] Import `@h4shed/dynagraph` SDK
- [ ] Implement `dynagraph_render` handler
- [ ] Add error handling & validation
- [ ] Implement `dynagraph_list_templates` handler

### Phase 3: Advanced Features ⏳
- [ ] Implement `dynagraph_validate_template` handler
- [ ] Add preview/SVG output support
- [ ] License validation integration
- [ ] Performance benchmarking

---

## Future Development

See:
- `docs/architecture/DYNAGRAPH-INTEGRATION.md` — Integration design
- `docs/legal/LICENSING-STRATEGY.md` — Commercial licensing model
- `docs/legal/CLEAN-ROOM.md` — Reference implementation record

---

## License

**This adapter:** Apache-2.0  
**Dynagraph core:** PolyForm Noncommercial 1.0.0 + Commercial License

The MCP adapter remains Apache-2.0 for ecosystem compatibility. Dynagraph's core rendering engine uses source-available licensing.

---

**Status:** Ready for implementation once Dynagraph SDK published  
**Owner:** Fused Gaming  
**Next:** Publish Dynagraph standalone repository
