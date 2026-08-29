# Dynagraph Skill Specification

**Skill ID:** `dynagraph`  
**Version:** 1.0.0  
**Status:** Phase 1 Scaffold  
**MCP Adapter:** `@h4shed/skill-dynagraph`  
**Standalone SDK:** `@h4shed/dynagraph` (Phase 7+)

---

## Overview

Dynagraph is a vector-first dynamic Open Graph image renderer integrated into the Fused Gaming MCP ecosystem. This specification defines the MCP skill interface for rendering dynamic OG images.

**Key Characteristics:**
- ✅ Vector-first rendering (SVG canonical intermediate)
- ✅ Template system (profile, article, product, custom)
- ✅ Configurable dimensions and output formats
- ✅ Deterministic rendering (no browser engine)
- ⏳ Commercial licensing support (Phase 8+)

---

## Tool Definitions

### 1. `dynagraph_render`

**Purpose:** Render a dynamic Open Graph image

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "template": {
      "type": "string",
      "description": "Template ID (profile, article, product, custom)"
    },
    "props": {
      "type": "object",
      "description": "Template-specific properties"
    },
    "width": {
      "type": "number",
      "description": "Image width in pixels (default: 1200)"
    },
    "height": {
      "type": "number",
      "description": "Image height in pixels (default: 630)"
    },
    "dpr": {
      "type": "number",
      "description": "Device pixel ratio (default: 1)"
    },
    "format": {
      "type": "string",
      "enum": ["svg", "png", "webp"],
      "description": "Output format (default: png)"
    }
  },
  "required": ["template", "props"]
}
```

**Output:**
```typescript
{
  success: boolean;
  template: string;
  dimensions: { width: number; height: number; dpr: number };
  format: string;
  svg?: string; // SVG output or placeholder
  base64?: string; // Base64-encoded output
  message?: string; // Status message
}
```

**Templates (Phase 1):**
- `profile` — Social profile card
- `article` — Article sharing card
- `product` — E-commerce product card

---

### 2. `dynagraph_list_templates`

**Purpose:** List all available templates

**Input Schema:**
```json
{
  "type": "object",
  "properties": {}
}
```

**Output:**
```typescript
{
  success: boolean;
  count: number;
  templates: Array<{
    id: string;
    name: string;
    description: string;
    version: string;
    defaultSize: { width: number; height: number };
    requiredProps: string[];
    optionalProps: string[];
  }>;
}
```

---

### 3. `dynagraph_validate_template`

**Purpose:** Validate a template TypeScript definition

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "template_code": {
      "type": "string",
      "description": "TypeScript template code"
    },
    "template_id": {
      "type": "string",
      "description": "Template ID (optional)"
    }
  },
  "required": ["template_code"]
}
```

**Output:**
```typescript
{
  success: boolean;
  valid: boolean;
  template_id: string;
  errors: string[];
  warnings: string[];
  message: string;
}
```

---

### 4. `dynagraph_preview`

**Purpose:** Generate a quick SVG preview of a template

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "template": {
      "type": "string",
      "description": "Template ID"
    },
    "props": {
      "type": "object",
      "description": "Sample properties"
    },
    "width": {
      "type": "number",
      "description": "Preview width (default: 600)"
    },
    "height": {
      "type": "number",
      "description": "Preview height (default: 315)"
    }
  },
  "required": ["template", "props"]
}
```

**Output:**
```typescript
{
  success: boolean;
  template: string;
  dimensions: { width: number; height: number };
  svg: string;
  base64: string;
  message?: string;
}
```

---

## Usage Examples

### Render a Profile OG Image

```typescript
const result = await dynamicRender({
  template: "profile",
  props: {
    title: "Alice Johnson",
    subtitle: "Senior Software Engineer",
    avatar: "https://example.com/alice.jpg",
  },
  width: 1200,
  height: 630,
  format: "png",
});

// Returns PNG buffer or SVG output
```

### List Available Templates

```typescript
const templates = await listTemplates();

// Returns:
// {
//   count: 3,
//   templates: [
//     {
//       id: "profile",
//       name: "Profile Card",
//       requiredProps: ["title", "subtitle"],
//       ...
//     },
//     ...
//   ]
// }
```

### Preview a Template

```typescript
const preview = await previewTemplate({
  template: "article",
  props: {
    title: "Understanding Vector Graphics",
    description: "A deep dive into SVG rendering",
  },
});

// Returns SVG preview as string
```

### Validate Template Code

```typescript
const validation = await validateTemplate({
  template_code: `
    export interface ProfileTemplate {
      render(props: Props): SceneNode;
    }
  `,
  template_id: "profile",
});

// Returns validation result with errors/warnings
```

---

## Phase 1 Status

### ✅ Complete

- MCP adapter scaffold created
- Tool definitions finalized
- Placeholder implementations for all 4 tools
- README and documentation
- TypeScript configuration
- NPM package structure

### ⏳ Phase 7+ (Standalone Repository)

- Create `fused-gaming/dynagraph` repository
- Implement core rendering engine
- Build template system with full TypeScript support
- Setup HTTP API for serverless deployment

### ⏳ Phase 8+ (Full Implementation)

- Vector rendering pipeline (SVG canonical)
- SVG → PNG/WebP rasterization (Sharp/libvips)
- Performance optimization and benchmarking
- Visual regression testing
- Commercial licensing enforcement
- API documentation and examples

---

## Integration Architecture

```
Claude Desktop / API
  ↓ (tool_use)
MCP Core (registerTool)
  ↓
@h4shed/skill-dynagraph (this package)
  ├─ Tool Definitions (4 tools)
  ├─ MCP Handlers
  └─ depends: @h4shed/mcp-core

Phase 7+ Integration:
  └─ imports: @h4shed/dynagraph (SDK)
     ├─ Scene graph + SVG renderer
     ├─ Rasterization layer (Sharp/libvips)
     ├─ Template system
     └─ Licensing client (@h4shed/license-client)
```

---

## Licensing

**This Package:** Apache-2.0 (MCP Adapter)

**Dynagraph SDK (Phase 7+):** Dual License
- PolyForm Noncommercial 1.0.0 (Free for personal/educational use)
- Commercial License ($500-$25k/year depending on scale)

---

## Next Steps

1. ✅ Phase 1 scaffolding complete (this specification)
2. ⏳ Create standalone repository `fused-gaming/dynagraph`
3. ⏳ Implement core rendering pipeline (Phase 8+)
4. ⏳ Setup commercial licensing system (Phase 9+)
5. ⏳ Deploy HTTP API to serverless infrastructure (Phase 10+)

---

**Report:** 2026-08-29  
**Status:** Phase 1 Scaffolding  
**Next Review:** Upon Phase 7 standalone repository creation
