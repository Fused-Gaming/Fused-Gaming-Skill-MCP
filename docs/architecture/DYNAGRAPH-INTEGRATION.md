# Dynagraph Integration Architecture

**Date:** 2026-08-29  
**Status:** Design Phase (Scaffolding Only)  
**Repository:** `fused-gaming/dynagraph` (NEW — Standalone)  
**MCP Adapter:** `packages/skills/dynagraph` (in main monorepo)

---

## Executive Summary

Dynagraph is a **vector-first, high-fidelity dynamic Open Graph image renderer** designed as a:

1. **Standalone npm package** (`@h4shed/dynagraph`) — consumed directly by applications
2. **HTTP rendering API** — deployed to serverless infrastructure
3. **CLI tool** (`npx @h4shed/dynagraph`) — used locally for batch rendering
4. **MCP skill adapter** — integrated into Fused Gaming MCP for agent-driven rendering

This document shows how Dynagraph integrates with the existing Fused Gaming ecosystem while maintaining clear separation of concerns and a clean licensing boundary.

---

## 1. Dynagraph Standalone Repository Structure

### Repository: `fused-gaming/dynagraph`

**Separate from main MCP monorepo.** Licensed under PolyForm Noncommercial 1.0.0 + Commercial License.

```
dynagraph/
├── apps/
│   ├── api/                    # HTTP Rendering API (optional for Phase 1)
│   └── studio/                 # Web UI for template development (optional)
│
├── packages/
│   ├── core/                   # Vector renderer, scene graph, SVG pipeline
│   │   ├── src/
│   │   │   ├── scene.ts        # Scene graph normalization
│   │   │   ├── renderer.ts     # SVG rendering
│   │   │   ├── types.ts        # Shared types
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── renderer/                # SVG-to-PNG/WebP rasterization
│   │   ├── src/
│   │   │   ├── rasterize.ts    # Sharp/libvips integration
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── templates/               # Built-in template definitions
│   │   ├── src/
│   │   │   ├── profile.ts       # Profile OG template
│   │   │   ├── article.ts       # Article OG template
│   │   │   ├── product.ts       # Product OG template
│   │   │   └── presets.ts       # Dimension presets
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── cli/                     # CLI: `npx @h4shed/dynagraph`
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   ├── index.ts
│   │   │   └── bin.ts
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── sdk/                     # Main SDK export
│   │   ├── src/
│   │   │   ├── render.ts        # render() function
│   │   │   ├── preview.ts       # preview() function
│   │   │   ├── validate.ts      # template validation
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── types/                   # Shared TypeScript definitions
│       ├── src/
│       │   ├── template.ts
│       │   ├── scene.ts
│       │   ├── render.ts
│       │   └── index.ts
│       └── package.json
│
├── templates/                   # Example template implementations
│   ├── profile.ts
│   ├── article.ts
│   └── ...
│
├── examples/                    # Usage examples
│   ├── sdk-basic.ts
│   ├── cli-usage.sh
│   └── ...
│
├── tests/                       # Visual regression tests
│   ├── golden/                  # Golden image references
│   ├── profile.test.ts
│   └── ...
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── TEMPLATE_GUIDE.md
│   ├── API.md
│   ├── CONTRIBUTING.md
│   └── LICENSING.md
│
├── scripts/
│   ├── benchmark.ts
│   ├── validate-licenses.ts
│   └── ...
│
├── .github/
│   ├── workflows/
│   │   ├── test.yml
│   │   ├── publish.yml
│   │   └── benchmark.yml
│   └── pull_request_template.md
│
├── .codex/                      # Agent instructions
│   └── README.md
│
├── CLAUDE.md                    # Development instructions
├── package.json                 # Workspace root
├── tsconfig.json
├── tsconfig.build.json
├── LICENSE                      # PolyForm Noncommercial + Commercial
├── CLEAN-ROOM.md               # Reference implementation record
├── COMPLIANCE.md               # Licensing & compliance
├── README.md
├── CHANGELOG.md
└── .gitignore
```

---

## 2. MCP Adapter Placement

### Location: `packages/skills/dynagraph/` (in main monorepo)

**Keeps Apache-2.0 license.** Acts as thin wrapper for MCP integration.

```
packages/skills/dynagraph/
├── src/
│   ├── index.ts                # MCP skill entry point
│   ├── tools.ts                # MCP tool definitions
│   ├── client.ts               # SDK client wrapper
│   ├── schema.ts               # Input/output schemas
│   └── types.ts                # Shared types
│
├── package.json
├── tsconfig.json
├── README.md
├── SKILL.md                    # MCP skill metadata
└── LICENSE (Apache-2.0)
```

**Dependency Graph:**
```
MCP Adapter (@h4shed/skill-dynagraph)
  ├─ depends: @h4shed/mcp-core (for tool registration)
  └─ depends: @h4shed/dynagraph (SDK — external repo)
```

---

## 3. Existing Fused Gaming Packages Used by Dynagraph

### Tier 1: Direct Dependencies (Reuse As-Is)

| Package | Purpose | Why Dynagraph Uses It |
|---------|---------|----------------------|
| **@h4shed/mcp-core** | MCP server framework | Tool registration in MCP skill adapter |
| **@h4shed/design-tokens** | Design system | Token constants for default themes |
| **@h4shed/license-client** | License validation | License checking for commercial use detection |
| **@h4shed/benchmark-utils** | Performance measurement | Benchmarking render performance |

### Tier 2: Reference Implementations (Patterns to Follow)

| Package | Purpose | What Dynagraph Learns |
|---------|---------|----------------------|
| **@h4shed/skill-svg-generator** | SVG asset generation | SVG output pipeline pattern |
| **@h4shed/skill-canvas-design** | Canvas/SVG rendering | Scene graph composition pattern |
| **@h4shed/skill-theme-factory** | Theme generation | Color system and theme composition |
| **@h4shed/skill-style-dictionary-system** | Design tokens | Token organization and export patterns |

### Tier 3: Optional Enhancements (Phase 2+)

| Package | Purpose | Possible Use |
|---------|---------|--------------|
| **@h4shed/skill-playwright-test-automation** | E2E testing | Visual regression test infrastructure |
| **@h4shed/tool-storybook** | Component docs | Template showcase documentation |
| **@h4shed/skill-vercel-nextjs-deployment** | Deployment | API deployment patterns for serverless |

---

## 4. Integration Points

### 4.1 SDK Integration Pattern

**Dynagraph SDK is a standalone package:**

```typescript
// User code
import { render } from '@h4shed/dynagraph';

const png = await render({
  template: 'profile',
  props: {
    title: 'John Doe',
    subtitle: 'Full Stack Engineer',
    avatar: 'https://example.com/avatar.jpg'
  },
  width: 1200,
  height: 630,
  dpr: 2,
  format: 'png'
});
```

**No MCP dependency required for direct SDK usage.**

---

### 4.2 MCP Tool Integration Pattern

**Dynagraph skill wraps SDK for MCP:**

```typescript
// MCP adapter code
import { registerTool } from '@h4shed/mcp-core';
import { render, validateTemplate, listTemplates } from '@h4shed/dynagraph';

registerTool({
  name: 'dynagraph_render',
  description: 'Render a dynamic Open Graph image',
  inputSchema: {
    type: 'object',
    properties: {
      template: { type: 'string', enum: listTemplates() },
      props: { type: 'object' },
      width: { type: 'number' },
      height: { type: 'number' },
      dpr: { type: 'number', default: 1 },
      format: { type: 'string', enum: ['svg', 'png', 'webp'] }
    }
  },
  handler: async (input) => {
    return await render(input);
  }
});
```

---

### 4.3 CLI Integration Pattern

**CLI is bundled in Dynagraph SDK:**

```bash
# Direct package usage
npx @h4shed/dynagraph render profile \
  --title "Example" \
  --width 1200 \
  --height 630 \
  --out og.png

# With template file
npx @h4shed/dynagraph render ./templates/custom.ts \
  --title "Custom" \
  --out result.png

# Service mode (optional Phase 2)
npx @h4shed/dynagraph serve --port 3000
```

---

### 4.4 Design Token Integration

**Dynagraph imports tokens from Fused Gaming:**

```typescript
// In Dynagraph core
import { tokens } from '@h4shed/design-tokens';

// Use for default theme
const defaultTheme = {
  colors: tokens.colors,
  typography: tokens.typography,
  spacing: tokens.spacing
};
```

---

### 4.5 Licensing Integration

**Commercial licensing via license-client:**

```typescript
import { validateLicense } from '@h4shed/license-client';

export async function render(input: RenderInput): Promise<Buffer> {
  // Check commercial use
  const license = await validateLicense(input.projectToken);
  
  if (license.type === 'commercial') {
    // Allow commercial rendering
  } else if (license.type === 'noncommercial') {
    // Allow noncommercial rendering
    // Add required attribution watermark
  } else {
    throw new Error('Invalid or missing license');
  }
  
  // ... proceed with rendering
}
```

---

## 5. Dependency Graph: Dynagraph Within Fused Gaming Ecosystem

### High-Level

```
Claude Desktop / API
  ↓ (tool_use)
MCP Core
  ├─ skill: Dynagraph Adapter (@h4shed/skill-dynagraph)
  │   ├─ depends: @h4shed/mcp-core
  │   ├─ depends: @h4shed/license-client
  │   └─ imports: @h4shed/dynagraph (SDK from separate repo)
  │
  └─ skill: [Other skills]

Dynagraph Standalone (@h4shed/dynagraph)
  ├─ depends: @h4shed/license-client (via SDK)
  ├─ imports: @h4shed/design-tokens (for tokens)
  ├─ imports: @h4shed/benchmark-utils (for perf testing)
  └─ no dependency on MCP Core (clean separation)
```

---

## 6. Template System Design

### Template Interface

```typescript
export interface DynagraphTemplate<Props = any> {
  id: string;
  version: string;
  description: string;
  
  // Default canvas size
  defaultSize: {
    width: number;
    height: number;
  };
  
  // Supported platforms/presets
  presets?: {
    name: string;
    width: number;
    height: number;
  }[];
  
  // Input schema (JSON Schema)
  inputSchema: JSONSchema;
  
  // Render function
  render(props: Props, context: RenderContext): SceneNode;
}
```

### Scene Graph

```typescript
export type SceneNode = 
  | Frame
  | Group
  | Text
  | Image
  | SVG
  | Shape
  | Gradient
  | Mask
  | Transform;

export interface Frame {
  type: 'frame';
  width: number;
  height: number;
  backgroundColor?: string;
  children: SceneNode[];
}

export interface Text {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight?: number;
  color: string;
  x: number;
  y: number;
  maxWidth?: number;
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right';
}

// ... more node types
```

### Rendering Pipeline

```
Template Props
  ↓
Scene Graph (normalized)
  ↓
SVG Renderer
  ↓
SVG Output (or pass to rasterizer)
  ↓
Rasterizer (Sharp / libvips)
  ↓
PNG/WebP Output
```

---

## 7. Licensing Architecture

### Dynagraph Repositories & Licensing

| Repository | Main License | Comment |
|------------|--------------|---------|
| `fused-gaming/dynagraph` | PolyForm Noncommercial 1.0.0 + Commercial | Source-available; dual-licensed |
| `packages/skills/dynagraph` (in main monorepo) | Apache-2.0 | MCP adapter remains permissive |
| MCP Core + Platform | Apache-2.0 | Unchanged; Dynagraph adds commercial tier |

### License Enforcement

**Option A: Runtime Check (Preferred)**
```
Dynagraph renders with any license
  ↓
Includes compliance metadata in output
  ↓
CDN/service logs track usage
  ↓
Audit trail for enforcement
```

**Option B: API Key (Optional Phase 2)**
```
Project tokens required for some features
  ↓
Token contains entitlement level
  ↓
API validates token before render
```

---

## 8. Deployment Architecture

### Scenario 1: Direct SDK Usage (Local Rendering)

```
Application
  ├─ npm install @h4shed/dynagraph
  ├─ import { render } from '@h4shed/dynagraph'
  └─ const png = await render({...})
      ↓
   Vector → SVG → PNG (local)
```

### Scenario 2: MCP Tool (Claude Desktop)

```
Claude Desktop
  ├─ MCP Core loads skill
  ├─ skill: dynagraph.render
  └─ calls @h4shed/dynagraph SDK
      ↓
   Vector → SVG → PNG → returns to Claude
```

### Scenario 3: HTTP API (Optional Phase 2)

```
Web Application
  │
  ├─ POST /v1/render/profile
  │   {
  │     template: 'profile',
  │     props: {...},
  │     width: 1200,
  │     height: 630,
  │     format: 'png'
  │   }
  │
  └─ Rendering Service (Vercel/AWS)
      ├─ Dynagraph SDK
      ├─ License check
      └─ returns: PNG buffer + metadata
```

---

## 9. Clean-Room Implementation Record

**Reference Project:** https://github.com/sgalanb/sharepreviews (AGPL-3.0)

**Permitted Research:**
- User experience and feature design
- High-level architectural approach (API contracts, template system)
- Social-media compatibility requirements (dimensions, metadata)

**Prohibited:**
- Source code copying
- Implementation details
- Algorithmic approaches
- Distinctive code patterns

**Dynagraph Implementation:** 100% clean-room, independent implementation.

---

## 10. Development Workflow

### Phase 1: Scaffolding & Core Rendering
- [ ] Create standalone `fused-gaming/dynagraph` repository
- [ ] Implement scene graph + SVG renderer
- [ ] Build template system (profile example)
- [ ] SDK + CLI interface
- [ ] MCP adapter integration
- [ ] Benchmark baseline

### Phase 2: Production Readiness
- [ ] HTTP API server
- [ ] Asset pipeline (fonts, images)
- [ ] Visual regression tests
- [ ] Performance optimization
- [ ] Documentation

### Phase 3: Commercial Licensing
- [ ] License enforcement system
- [ ] Commercial license model
- [ ] Compliance tracking
- [ ] Audit trail system

---

## 11. Known Decisions

### Vector-First Rendering
**Decision:** SVG is the canonical intermediate representation.  
**Why:** Resolution independence, fidelity at arbitrary dimensions, deterministic output.  
**Impact:** All rendering paths go through SVG (PNG/WebP are rasterized from SVG).

### Separate Repository
**Decision:** Dynagraph is not a skill in the main monorepo.  
**Why:** Different licensing model, independent release cycle, clean boundaries.  
**Impact:** Dependency flow is one-way: MCP adapter imports Dynagraph SDK.

### No Browser Engine in Phase 1
**Decision:** Skip Puppeteer/Playwright for rendering. Use native graphics instead.  
**Why:** Performance, determinism, licensing (headless browser licensing complex).  
**Impact:** Implement our own layout/rendering engine (worth the effort for determinism).

---

## 12. Next Steps

1. ✅ **PACKAGE-INVENTORY.md** — Complete package audit
2. ✅ **PACKAGE-GRAPH.md** — System architecture
3. ✅ **DYNAGRAPH-INTEGRATION.md** (this file) — Integration design
4. ⏳ **DEPENDENCY-LICENSE-AUDIT.md** — License analysis of candidate dependencies
5. ⏳ **LICENSING-STRATEGY.md** — Commercial licensing model
6. ⏳ **CLEAN-ROOM.md** — Reference implementation record
7. ⏳ **Create dynagraph repository** — Standalone scaffolding
8. ⏳ **Create MCP adapter** — packages/skills/dynagraph/ scaffolding

---

**Report:** 2026-08-29  
**Branch:** `claude/dynagraph-architecture-audit-6r5740`  
**Status:** Scaffolding Design (Phase 1 Ready)
