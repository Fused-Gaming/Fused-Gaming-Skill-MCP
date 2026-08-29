# Fused Gaming MCP Architecture Graph

**Status:** Current state (v1.4.1)  
**Future Vision:** Multi-repository architecture with federated skill discovery  
**Dynagraph Role:** New standalone repository + MCP skill adapter

---

## 1. High-Level System Architecture

### Current Monorepo Structure

```mermaid
flowchart TB
    subgraph User ["Users & Integrations"]
        Claude["Claude Desktop / API"]
        CLI["CLI Tool (npx)"]
        Web["Web Dashboard"]
    end

    subgraph Core ["Core MCP Packages (Keep in Main Repo)"]
        MCPCore["@h4shed/mcp-core<br/>MCP Server Runtime"]
        Registry["Skill Registry<br/>Tool Registration"]
        Transport["Transport Layer<br/>HTTP/SSE/Socket"]
    end

    subgraph Platform ["Platform Packages"]
        LicenseClient["@h4shed/license-client<br/>License Validation"]
        DesignTokens["@h4shed/design-tokens<br/>Design System"]
        BenchmarkUtils["@h4shed/benchmark-utils<br/>Performance Testing"]
        CLI_PKG["@h4shed/mcp-cli<br/>CLI Commands"]
    end

    subgraph Skills ["Skills (30+ Packages) — Will Migrate to Separate Repos"]
        Design["Design Skills<br/>Canvas, Theme Factory,<br/>SVG Generator, Frontend"]
        Build["Build Tools<br/>TypeScript, Vite,<br/>Vercel Deploy"]
        Content["Content Skills<br/>LinkedIn Journalist,<br/>Underworld Writer"]
        Automation["Automation<br/>SyncPulse, Project Manager,<br/>Session Tracking"]
        Testing["Testing<br/>Playwright, Pre-Deploy"]
        Generative["Generative Art<br/>Algorithmic Art, NFT"]
    end

    subgraph Tools ["Tools (30+ Packages) — Will Migrate to Separate Repos"]
        ToolsPkg["Email Workflows<br/>Document Processing<br/>Data Transform<br/>Validation"]
    end

    subgraph Dynagraph ["Dynagraph (NEW) — Separate Repository"]
        DynagraphCore["@h4shed/dynagraph<br/>Vector-First Renderer"]
        DynagraphTemplates["Templates & Presets"]
        DynagraphSkill["@h4shed/skill-dynagraph<br/>MCP Adapter"]
        DynagraphSDK["SDK + CLI<br/>npx @h4shed/dynagraph"]
    end

    Claude -->|tool_use| MCPCore
    CLI -->|command| CLI_PKG
    Web -->|fetch| Platform

    MCPCore -->|registers| Registry
    MCPCore -->|uses| Transport
    MCPCore -->|loads| Skills
    MCPCore -->|loads| Tools
    MCPCore -->|loads| DynagraphSkill

    Skills -->|depends| Platform
    Tools -->|depends| Platform
    Dynagraph -->|depends| Platform
    DynagraphSkill -->|wraps| DynagraphCore

    LicenseClient -->|validates| Skills
    LicenseClient -->|validates| Dynagraph
    DesignTokens -->|used by| Skills
    DesignTokens -->|used by| Dynagraph
    BenchmarkUtils -->|measures| Skills
    BenchmarkUtils -->|measures| Dynagraph
```

---

## 2. Dependency Tree — Current State

### Deepest Dependencies

```
Claude
  └─ MCP Core
      ├─ Transport Layer
      ├─ Registry
      │   └─ [Skills loaded dynamically]
      │   └─ [Tools loaded dynamically]
      ├─ License Client
      │   └─ Telemetry
      ├─ Design Tokens
      └─ [External: TypeScript, Node]

Skills (all depend on Core + Platform)
  ├─ Design Skills
  │   ├─ Design Tokens
  │   ├─ Canvas/SVG rendering
  │   └─ Layout primitives
  ├─ Build Tools
  │   ├─ CLI
  │   └─ TypeScript
  ├─ Content Skills
  │   ├─ API integrations
  │   └─ Text processing
  └─ Automation
      ├─ SyncPulse (complex)
      ├─ Project management
      └─ Workflows
```

---

## 3. Skill Categories & Reusability for Dynagraph

### Tier 1: Direct Reuse (No Modification)

These packages Dynagraph will consume without change:

```mermaid
graph LR
    D["Dynagraph"]
    D -->|"token system"| DT["Design Tokens"]
    D -->|"license model"| LC["License Client"]
    D -->|"MCP registration"| MCORE["MCP Core"]
    D -->|"CLI patterns"| CLI["CLI"]
    D -->|"benchmarking"| BU["Benchmark Utils"]
```

---

### Tier 2: Extend or Reference

These packages provide patterns Dynagraph adapts:

```mermaid
graph LR
    D["Dynagraph"]
    D -->|"SVG pipeline reference"| SVG["SVG Generator Skill"]
    D -->|"layout patterns"| Canvas["Canvas Design Skill"]
    D -->|"theme composition"| TF["Theme Factory"]
    D -->|"test patterns"| PW["Playwright Skill"]
```

---

### Tier 3: Not Applicable

These packages are orthogonal:

- SyncPulse (multi-agent orchestration)
- Content skills (writing, journalism)
- Generative art (procedural art, not OG rendering)
- Session tracking
- Blockchain tools

---

## 4. Technology Stack Snapshot

### Core MCP

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | >= 20.0.0 |
| Language | TypeScript | 5.3.2 |
| HTTP | Express (implied) | — |
| Build | TypeScript compiler | 5.3.2 |
| Testing | Jest (implied) | — |

### Skills Ecosystem

| Category | Technologies |
|----------|--------------|
| Rendering | None (opportunity for Dynagraph) |
| Styling | Tailwind, Style Dictionary |
| SVG | Canvas, SVG Generator |
| UI | React (web only), Framer Motion |
| Asset Management | File system, CDN (implied) |
| Fonts | System fonts (default) |

### Dynagraph Will Need

| Component | Candidates | Status |
|-----------|-----------|--------|
| Rendering | Satori, Skia.js, Canvas | TBD |
| Rasterization | Sharp, libvips, Playwright | TBD |
| Server | Express or Hono | TBD |
| Template Engine | Custom (Dynagraph-specific) | To Design |

---

## 5. Multi-Repository Vision

### Phase 2+: After Migration

```mermaid
flowchart TB
    subgraph Claude ["Claude Desktop / API"]
        C["Claude"]
    end

    subgraph Main ["fused-gaming/fused-gaming-skill-mcp"]
        Core["MCP Core<br/>CLI<br/>License Client<br/>Benchmark Utils<br/>Docs"]
    end

    subgraph SyncPulse ["fused-gaming/syncpulse"]
        SP["SyncPulse<br/>Agent Orchestration<br/>Workflows"]
    end

    subgraph Design ["fused-gaming/design-system"]
        DS["Design Tokens<br/>Theme Factory<br/>Style Dictionary<br/>Tailwind Builder"]
    end

    subgraph Skills ["fused-gaming/skills"]
        Skills["Design Skills<br/>Build Tools<br/>Content Skills<br/>Testing<br/>Generative Art"]
    end

    subgraph Dynagraph ["fused-gaming/dynagraph"]
        DG["Dynagraph SDK<br/>Renderer<br/>Templates<br/>API<br/>MCP Skill"]
    end

    C -->|tools| Main
    Main -->|discovers| Skills
    Main -->|discovers| SyncPulse
    Main -->|uses| Design
    Main -->|discovers| Dynagraph

    Skills -->|depends| Design
    Dynagraph -->|depends| Design
    Dynagraph -->|integrates| Main
```

---

## 6. Integration Pattern: How Skills Integrate with Core

### MCP Skill Registration Flow

```mermaid
sequenceDiagram
    participant Claude
    participant MCPCore
    participant SkillRegistry
    participant SingleSkill as "Skill Package<br/>(e.g., Theme Factory)"

    Claude->>MCPCore: initialize()
    MCPCore->>SkillRegistry: loadSkills()
    SkillRegistry->>SingleSkill: import @h4shed/skill-theme-factory
    SingleSkill->>MCPCore: registerTool({name, schema, handler})
    MCPCore->>SkillRegistry: ✓ registered
    Claude->>MCPCore: call_tool(theme_factory_generate)
    MCPCore->>SingleSkill: handler({theme, props})
    SingleSkill->>Claude: {result, schema}
```

---

## 7. Dynagraph Integration Example

### How Dynagraph Adapter Fits

```mermaid
flowchart LR
    subgraph Standalone ["Standalone: fused-gaming/dynagraph"]
        SDK["@h4shed/dynagraph SDK<br/>render() function"]
        Renderer["Vector Renderer<br/>SVG generation"]
        Rasterizer["Rasterizer<br/>PNG/WebP output"]
        Templates["Template System"]
        API["HTTP Rendering API"]
    end

    subgraph Adapter ["MCP Skill: packages/skills/dynagraph/"]
        Tool["MCP Tool:<br/>dynagraph.render<br/>dynagraph.preview<br/>dynagraph.list_templates"]
        Client["SDK Client Wrapper"]
    end

    SDK -->|direct consumption| Renderer
    SDK -->|direct consumption| Rasterizer
    SDK -->|CLI| CMD["npx @h4shed/dynagraph"]

    Tool -->|wraps| SDK
    Client -->|uses| SDK
    Tool -->|registers with| MCORE["MCP Core"]
```

---

## 8. Licensing Boundaries

### Apache-2.0 Boundary (Current)

```
fused-gaming/fused-gaming-skill-mcp (Apache-2.0)
├── packages/core
├── packages/cli
├── packages/license-client
├── packages/design-tokens
└── [all skills] — keep Apache-2.0
```

### Dynagraph Licensing (NEW)

```
fused-gaming/dynagraph (PolyForm Noncommercial 1.0.0 + Commercial License)
├── @h4shed/dynagraph (dual-licensed)
├── @h4shed/dynagraph-templates (dual-licensed)
└── @h4shed/skill-dynagraph (Apache-2.0 — MCP adapter remains permissive)
```

**Note:** Adapter remains Apache-2.0 for MCP integration. Only core Dynagraph packages use source-available licensing.

---

## 9. Deployment Architecture

### API Deployment Pattern

```
Claude Desktop
    ↓
MCP Stdio Transport
    ↓
MCP Core Server (Local)
    ↓ (calls tool)
Dynagraph Skill
    ↓
Dynagraph SDK (in-process or HTTP)
    ↓
Rendering Pipeline
    ↓
PNG/SVG Output
```

### Optional: Hosted Rendering API

```
Dynagraph CLI / SDK
    ↓
https://dynagraph.h4shed.dev/v1/render
    ↓
Rendering Service (Vercel Functions or similar)
    ↓
CDN (for generated assets)
```

---

## 10. Key Metrics: Package Inventory Summary

| Metric | Count |
|--------|-------|
| **Core Packages** (keep in main repo) | 6 |
| **Skills** (30+ spread across 5 future repos) | 30+ |
| **Tools** (separate repo) | 30+ |
| **Total Workspace Packages** | 60+ |
| **Published npm Packages** (v1.4.1) | 19 |
| **Dynagraph New Packages** (proposed) | 4-5 |

---

## Next Steps

1. **PACKAGE-INVENTORY.md** ✅ — Individual package details
2. **PACKAGE-GRAPH.md** ✅ (this file) — System architecture
3. **DYNAGRAPH-INTEGRATION.md** — Dynagraph-specific integration
4. **DEPENDENCY-LICENSE-AUDIT.md** — License analysis
5. **LICENSING-STRATEGY.md** — Commercial licensing design
6. **CLEAN-ROOM.md** — Clean-room development record

---

**Generated:** 2026-08-29  
**Branch:** `claude/dynagraph-architecture-audit-6r5740`
