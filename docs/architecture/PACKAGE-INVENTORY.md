# Fused Gaming MCP — Complete Package Inventory

**Date:** 2026-08-29  
**Audit Scope:** Full monorepo architectural analysis for Dynagraph integration planning  
**Repository:** `fused-gaming/fused-gaming-skill-mcp`  
**Branch:** `claude/dynagraph-architecture-audit-6r5740`

---

## Executive Summary

This document provides a complete inventory of every package in the Fused Gaming MCP monorepo. The project consists of **60+ workspace packages** organized into functional families:

- **1 Root Package** (@h4shed/mcp)
- **8 Core Platform Packages** (core, CLI, web, design tokens, license client, docs, benchmark-utils)
- **30+ Skills** (design, generative art, build tools, content, automation)
- **30+ Tools** (build utilities, testing, CSS, documentation)

---

## 1. Core Platform Packages

### 1.1 packages/core

| Property | Value |
|----------|-------|
| **Package Name** | `@h4shed/mcp-core` |
| **Version** | 1.0.24 |
| **Purpose** | MCP server runtime, skill registry, tool registration, transport layer |
| **License** | Apache-2.0 |
| **Exports** | Server, Registry, Tool schemas, Resource schemas |
| **CLI Commands** | None (library) |
| **MCP Tools/Resources** | Core MCP infrastructure |
| **Dependencies** | TypeScript, @types/node |
| **Publish Status** | ✅ Published to npm |
| **Dynagraph Relevance** | **CRITICAL** — Dynagraph MCP adapter will depend on core for tool/resource registration |

**Key Responsibilities:**
- MCP server lifecycle management
- Skill/tool registry
- Schema validation
- Transport handlers
- Type definitions

---

### 1.2 packages/cli

| Property | Value |
|----------|-------|
| **Package Name** | `@h4shed/mcp-cli` |
| **Version** | 1.0.24 |
| **Purpose** | Command-line interface for skill discovery, installation, execution |
| **License** | Apache-2.0 |
| **CLI Commands** | `fused-gaming-mcp` (global), skill install, skill list, skill execute |
| **Dependencies** | yargs, chalk, ora, inquirer, boxen |
| **Publish Status** | ✅ Published to npm |
| **Dynagraph Relevance** | **HIGH** — Can reuse CLI infrastructure for `npx @h4shed/dynagraph` commands |

**Key Responsibilities:**
- Package discovery
- Skill installation
- Interactive CLI flows
- Command parsing
- Output formatting

---

### 1.3 packages/design-tokens

| Property | Value |
|----------|-------|
| **Package Name** | `@h4shed/design-tokens` |
| **Version** | 1.0.0 |
| **Purpose** | Centralized design token definitions (colors, typography, spacing, shadows) |
| **License** | Apache-2.0 |
| **Exports** | Token objects, CSS variables, Tailwind config |
| **Publish Status** | ✅ Published to npm |
| **Dynagraph Relevance** | **HIGH** — Dynagraph can reuse token system for consistent styling in generated OG images |

---

### 1.4 packages/license-client

| Property | Value |
|----------|-------|
| **Package Name** | `@h4shed/license-client` |
| **Version** | 1.0.0 |
| **Purpose** | License validation, commercial use detection, telemetry support |
| **License** | Apache-2.0 |
| **Exports** | License validator, telemetry client, compliance hooks |
| **Publish Status** | ✅ Published to npm |
| **Dynagraph Relevance** | **CRITICAL** — Dynagraph requires similar licensing model (free/commercial dual licensing) |

**Key Capabilities:**
- License token validation
- Commercial vs. noncommercial detection
- Telemetry event tracking
- Compliance reporting
- Service integration

---

### 1.5 packages/web

| Property | Value |
|----------|-------|
| **Package Name** | `@h4shed/web` |
| **Purpose** | Next.js 14 web dashboard, skill showcase, API gateway |
| **Framework** | Next.js 14 (App Router), React, Framer Motion |
| **License** | Apache-2.0 |
| **Publish Status** | Not published (app-only) |
| **Dynagraph Relevance** | **MEDIUM** — Could integrate Dynagraph renderer preview; may share auth/API patterns |

---

### 1.6 packages/benchmark-utils

| Property | Value |
|----------|-------|
| **Package Name** | `@h4shed/benchmark-utils` |
| **Purpose** | Performance measurement, benchmarking, metric collection |
| **License** | Apache-2.0 |
| **Exports** | Benchmark runner, metric aggregators, report generators |
| **Publish Status** | Not published (dev-only) |
| **Dynagraph Relevance** | **HIGH** — Dynagraph rendering performance requires benchmarking (cold/warm render, SVG, rasterization) |

---

### 1.7 packages/docs

| Property | Value |
|----------|-------|
| **Package Name** | `@h4shed/docs` |
| **Purpose** | Documentation site, guides, API reference |
| **Framework** | VitePress or similar |
| **License** | Apache-2.0 |
| **Publish Status** | Not published (doc-only) |
| **Dynagraph Relevance** | **MEDIUM** — Dynagraph will need comprehensive docs integrated here |

---

## 2. Skills (30+ Packages)

### Design & Styling Skills (8)

| Skill | Path | Version | Status | Dynagraph Relevance |
|-------|------|---------|--------|-------------------|
| **Canvas Design** | `packages/skills/canvas-design` | 1.0.24 | ✅ Published | **HIGH** — Scene composition, layout primitives |
| **Frontend Design** | `packages/skills/frontend-design` | 1.0.24 | ✅ Published | **HIGH** — UI component patterns, styling |
| **Theme Factory** | `packages/skills/theme-factory` | 1.0.24 | ✅ Published | **CRITICAL** — Theme generation, color schemes, design system |
| **SVG Generator** | `packages/skills/svg-generator` | 1.1.0 | ✅ Published | **CRITICAL** — SVG rendering, asset generation |
| **TailwindCSS Builder** | `packages/skills/tailwindcss-style-builder` | ? | ? | **HIGH** — CSS generation, utility-first styling |
| **Style Dictionary System** | `packages/skills/style-dictionary-system` | ? | ? | **MEDIUM** — Design token compilation |
| **Agentic Flow Devkit** | `packages/skills/agentic-flow-devkit` | ? | ? | **LOW** — Agent coordination (separate concern) |
| **UX Journey Mapper** | `packages/skills/ux-journeymapper` | 1.0.23 | ✅ Published | **MEDIUM** — Flow visualization, composition |

### Generative Art Skills (3)

| Skill | Path | Version | Status | Dynagraph Relevance |
|-------|------|---------|--------|-------------------|
| **Algorithmic Art** | `packages/skills/algorithmic-art` | 1.0.24 | ✅ Published | **MEDIUM** — Generative patterns, procedural decoration |
| **NFT Generative Art** | `packages/skills/nft-generative-art` | ? | ? | **MEDIUM** — Canvas generation, image composition |
| **Smart Contract Tools** | `packages/skills/smart-contract-tools` | ? | ? | **LOW** — Blockchain (separate domain) |

### Build & Development Tools (4+)

| Skill | Path | Version | Status | Dynagraph Relevance |
|-------|------|---------|--------|-------------------|
| **TypeScript Toolchain** | `packages/skills/typescript-toolchain` | ? | ? | **HIGH** — TypeScript support, compilation |
| **Vite Module Bundler** | `packages/skills/vite-module-bundler` | ? | ? | **MEDIUM** — Asset bundling, module resolution |
| **Mermaid Terminal** | `packages/skills/mermaid-terminal` | 1.0.23 | ✅ Published | **LOW** — Diagram rendering (separate) |
| **Vercel NextJS Deployment** | `packages/skills/vercel-nextjs-deployment` | ? | ? | **HIGH** — Deployment patterns, serverless integration |

### Content & Writing Skills (3+)

| Skill | Path | Version | Status | Dynagraph Relevance |
|-------|------|---------|--------|-------------------|
| **LinkedIn Master Journalist** | `packages/skills/linkedin-master-journalist` | 1.0.23 | ✅ Published | **MEDIUM** — Content generation, social formatting |
| **Underworld Writer Skill** | `packages/skills/underworld-writer-skill` | 2.0.0 | ✅ Published | **LOW** — Content writing (separate domain) |
| **Daily Review Skill** | `packages/skills/daily-review-skill` | 1.0.23 | ✅ Published | **LOW** — Summarization (separate domain) |

### Project Management & Automation (4+)

| Skill | Path | Version | Status | Dynagraph Relevance |
|-------|------|---------|--------|-------------------|
| **Project Manager** | `packages/skills/project-manager` | ? | ? | **MEDIUM** — Workflow orchestration patterns |
| **Project Manager Skill** | `packages/skills/project-manager-skill` | 1.0.24 | ✅ Published | **MEDIUM** — Task coordination |
| **Project Status Tool** | `packages/skills/project-status-tool` | 1.0.23 | ✅ Published | **MEDIUM** — Status aggregation |
| **SyncPulse** | `packages/skills/syncpulse` | ? | ? | **MEDIUM** — Multi-agent coordination infrastructure |
| **SyncPulse Hub** | `packages/skills/syncpulse-hub` | ? | ? | **MEDIUM** — Agent dashboard, orchestration UI |

### Testing & Validation (2+)

| Skill | Path | Version | Status | Dynagraph Relevance |
|-------|------|---------|--------|-------------------|
| **Playwright Test Automation** | `packages/skills/playwright-test-automation` | ? | ? | **HIGH** — Visual regression testing, screenshot capture |
| **Pre-Deploy Validator** | `packages/skills/pre-deploy-validator` | 1.0.24 | ✅ Published | **MEDIUM** — Build validation patterns |

### Infrastructure & Tooling (4+)

| Skill | Path | Version | Status | Dynagraph Relevance |
|-------|------|---------|--------|-------------------|
| **MCP Builder** | `packages/skills/mcp-builder` | 1.0.24 | ✅ Published | **MEDIUM** — MCP server scaffolding |
| **Skill Creator** | `packages/skills/skill-creator` | 1.0.24 | ✅ Published | **MEDIUM** — Skill template generation |
| **Storybook Component Library** | `packages/skills/storybook-component-library` | ? | ? | **MEDIUM** — Component documentation |
| **ASCII Mockup** | `packages/skills/ascii-mockup` | 1.0.24 | ✅ Published | **MEDIUM** — Text-based design preview |
| **Multi-Account Session Tracking** | `packages/skills/multi-account-session-tracking-skill` | 1.0.23 | ✅ Published | **LOW** — Session management (separate) |

---

## 3. Tools Packages (30+)

Located in `packages/tools/`. Each provides specialized functionality exposed through MCP tool interface.

**Sampling of Key Tools:**
- Email workflows
- Document processing
- Image manipulation
- Data transformation
- API integrations
- Validation utilities

**Dynagraph Relevance:** Variable — Most are domain-specific. Key reusable tools may relate to image processing, asset management, or data transformation.

---

## 4. Dependency Audit Summary

### Critical Production Dependencies

**Rendering & Graphics:**
- No native rendering library currently in use (opportunity for Dynagraph)
- SVG Generator skill exists but appears lightweight

**Typography & Fonts:**
- Standard Node.js font loading
- Verify font licensing separately (PHASE 4 task)

**HTTP & Networking:**
- Express (web framework)
- Axios or Node fetch (HTTP client)

**Templating:**
- No template system currently published
- Theme Factory provides styling but not templating

**Licensing & Compliance:**
- `@h4shed/license-client` exists — examine for reuse pattern

---

## 5. Workspace Structure Observations

### Strengths
1. ✅ Clear separation: core platform vs. skills vs. tools
2. ✅ Consistent naming: `@h4shed/` scoped packages
3. ✅ Published packages tracked in VERSION.json
4. ✅ Design tokens centralized
5. ✅ Skill registry pattern established

### Gaps Relevant to Dynagraph
1. ❌ No vector rendering library
2. ❌ No template system
3. ❌ No high-DPI rasterization
4. ❌ No dynamic image generation pipeline
5. ❌ Font licensing not explicitly audited

---

## 6. Reusability Scoring for Dynagraph

### Direct Reuse (No Modification)
| Package | Use Case |
|---------|----------|
| `@h4shed/mcp-core` | Tool/resource registration |
| `@h4shed/design-tokens` | Color, typography tokens |
| `@h4shed/license-client` | Licensing model |
| `@h4shed/mcp-cli` | CLI infrastructure |
| `@h4shed/benchmark-utils` | Performance testing |

### Extend or Wrap
| Package | Use Case |
|---------|----------|
| `@h4shed/skill-svg-generator` | SVG output pipeline |
| `@h4shed/skill-theme-factory` | Theme composition |
| `@h4shed/skill-canvas-design` | Scene graph normalization |

### Reference or Learn From
| Package | Use Case |
|----------|----------|
| `@h4shed/skill-playwright-test-automation` | Visual regression testing pattern |
| `@h4shed/skill-vercel-nextjs-deployment` | Serverless deployment pattern |

### Not Relevant
| Package | Reason |
|---------|--------|
| Blockchain tools | Separate domain |
| Content generation skills | Separate domain |
| Session tracking | Separate concern |

---

## 7. Dynagraph Integration Points

### Adapter Placement
```
packages/skills/dynagraph/
├── src/
│   ├── index.ts           # MCP adapter entry
│   ├── tools.ts          # Tool definitions
│   ├── schema.ts         # Type definitions
│   └── client.ts         # SDK client wrapper
├── package.json
└── SKILL.md
```

### Reuse Points
1. **MCP Core** → Tool registration
2. **Design Tokens** → Styling system
3. **License Client** → Commercial licensing
4. **CLI** → Command-line interface
5. **Benchmark Utils** → Performance testing
6. **SVG Generator** (optional) → SVG pipeline

---

## 8. Missing Dependencies to Audit

For Dynagraph implementation, the following categories need license audit:

1. **Vector Rendering:** Likely candidates (audit needed)
   - Skia.js, Canvas, Satori, RESVG
   - Audit: License compatibility, feature set, performance

2. **Rasterization:** Likely candidates
   - Sharp, libvips, Puppeteer, PlayWright
   - Audit: License, headless dependencies

3. **Typography:** Likely candidates
   - Fontkit, Opentype.js, Canvas text
   - Audit: Font licensing separate from software

4. **HTTP Server (if API): Existing**
   - Express already in use

---

## Next Steps

1. **PHASE 2:** Map existing capabilities in detail
2. **PHASE 3:** Generate PACKAGE-GRAPH.md and DYNAGRAPH-INTEGRATION.md
3. **PHASE 4:** Complete dependency license audit
4. **PHASE 5:** Design licensing strategy
5. **Phase 6-7:** Create Dynagraph standalone repository

---

**Report Generated:** 2026-08-29  
**Audit Branch:** `claude/dynagraph-architecture-audit-6r5740`
