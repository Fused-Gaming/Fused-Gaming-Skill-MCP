# Package Separation Strategy — Monorepo to Multi-Repo Migration

**Date:** 2026-08-29  
**Status:** Planning Phase  
**Objective:** Separate Fused Gaming Skill MCP into focused repositories while maintaining clear integration boundaries

---

## Vision: Focused Repositories

### Repository 1: Fused-Gaming/Fused-Gaming-Skill-MCP (Core)

**Keeps:**
- `packages/core` — MCP server runtime, skill registry, tool registration
- `packages/cli` — Command-line interface for skill discovery/management
- `packages/license-client` — License validation and compliance
- `packages/benchmark-utils` — Performance measurement
- `packages/web` — Dashboard/showcase (consider moving if standalone)
- `packages/docs` — Documentation site
- `.github/` — CI/CD workflows
- `scripts/` — Build and registry scripts

**Responsibility:** Core MCP platform, tool registration, skill discovery

**Published Packages:**
- `@h4shed/mcp-core`
- `@h4shed/mcp-cli`
- `@h4shed/license-client`

---

### Repository 2: Fused-Gaming/SyncPulse (Orchestration)

**Keeps:**
- `packages/skills/syncpulse`
- `packages/skills/syncpulse-hub`
- Related email workflows
- Multi-agent coordination patterns

**Responsibility:** Agent coordination, workflow orchestration

**Published Packages:**
- `@h4shed/skill-syncpulse`
- `@h4shed/skill-syncpulse-hub`

**Note:** SyncPulse is complex enough to warrant separate repository with focused development cycles.

---

### Repository 3: Fused-Gaming/Fused-Gaming-Design-System

**Keeps:**
- `packages/design-tokens`
- `packages/skills/theme-factory`
- `packages/skills/style-dictionary-system`
- `packages/skills/tailwindcss-style-builder`
- Related design documentation

**Responsibility:** Design tokens, theming, styling infrastructure

**Published Packages:**
- `@h4shed/design-tokens`
- `@h4shed/skill-theme-factory`
- `@h4shed/skill-style-dictionary-system`
- `@h4shed/skill-tailwindcss-builder`

---

### Repository 4: Fused-Gaming/Fused-Gaming-Skills (Design & Dev Tools)

**Contains:**
- Design skills: Canvas, Frontend Design, SVG Generator, UX Journey Mapper
- Build tools: TypeScript Toolchain, Vite, Mermaid Terminal, Vercel NextJS
- Testing: Playwright, Pre-Deploy Validator
- Generative: Algorithmic Art, NFT Art

**Published Packages:**
- `@h4shed/skill-*` (design & development skills)

---

### Repository 5: Fused-Gaming/Fused-Gaming-Content-Skills

**Contains:**
- Content generation: LinkedIn Journalist, Underworld Writer, Daily Review
- Project management: Project Manager, Project Status
- Utilities: Session Tracking, ASCII Mockup, Skill Creator

**Published Packages:**
- `@h4shed/skill-*` (content & automation skills)

---

### Repository 6: Fused-Gaming/Fused-Gaming-Tools

**Contains:**
- All packages from `packages/tools/`
- Specialized utilities exposed as MCP tools

**Published Packages:**
- `@h4shed/tool-*`

---

### Repository 7: Fused-Gaming/Dynagraph (NEW)

**Contains:**
- Vector-first rendering engine
- SVG pipeline
- Rasterization layer
- Template system
- MCP adapter skill

**Published Packages:**
- `@h4shed/dynagraph` (main SDK)
- `@h4shed/dynagraph-renderer`
- `@h4shed/dynagraph-templates`
- `@h4shed/skill-dynagraph` (MCP adapter)

**Licensing:** Separate dual-license model (free/commercial)

---

## Migration Phases

### Phase A: Planning & Documentation (Current)
- Document existing architecture
- Define boundaries between repositories
- Plan skill registry federation
- Design dependency graph

### Phase B: Skill Registry Federation
- Extend skill registry to support remote skill discovery
- Implement skill manifest format
- Create registry server for each repository type
- Support installing skills from multiple sources

### Phase C: Gradual Repository Creation
1. Create SyncPulse repository (highest complexity)
2. Create Design System repository
3. Create Skills repositories (batched by category)
4. Create Tools repository
5. Create Dynagraph repository

### Phase D: Cleanup & Consolidation
- Remove migrated packages from main monorepo
- Update documentation
- Update CI/CD for multi-repo workflows
- Validate skill discovery and installation

---

## Skill Registry Federation

### Current Model
```
MCP Core ← [hardcoded skill list]
```

### Future Model
```
Claude ↔ MCP Core ↔ Registry Service
                   ↓
           ┌───────┼───────┬───────┐
           ↓       ↓       ↓       ↓
    Skills  Design SyncPulse Tools
    Repo    Repo   Repo    Repo
```

### Implementation
1. **Registry Schema:** Define skill manifest format (JSON/TOML)
2. **Discovery:** MCP server queries remote registries on startup
3. **Caching:** Local cache of remote skill definitions
4. **Installation:** CLI can install skills from any registered repository
5. **Versioning:** Semantic versioning with compatibility checking

---

## Integration Points to Preserve

### 1. Skill Installation
```bash
# Current: npm install from monorepo
npm run skills:install theme-factory

# Future: Install from separate repo
npm run skills:install @h4shed/skill-theme-factory
# or
npx fused-gaming-mcp skills:install theme-factory
```

### 2. MCP Tool Registration
```typescript
// Each skill independently registers with MCP Core
import { registerTool } from '@h4shed/mcp-core';

registerTool({
  name: 'theme_factory_generate',
  description: '...',
  inputSchema: {...}
});
```

### 3. Design Token Distribution
```typescript
// Design tokens distributed as independent package
import { tokens } from '@h4shed/design-tokens';
```

### 4. Licensing System
```typescript
// License validation available via license-client
import { validateLicense } from '@h4shed/license-client';
```

---

## Benefits of Separation

### For Core MCP
- Faster CI/CD cycles
- Easier to maintain and version
- Clear API boundaries
- Focused contributions

### For Skills
- Independent release schedules
- Per-skill versioning
- Specialized documentation
- Easier onboarding for new developers

### For SyncPulse
- Complex orchestration evolves independently
- Multi-agent patterns shared across projects
- Clear responsibilities

### For Dynagraph
- Separate licensing model
- Independent release schedule
- Commercial-focused development
- Clean integration boundary with MCP

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Version compatibility issues | Semantic versioning + compatibility matrix docs |
| Skill discovery breaks | Well-designed registry protocol + fallbacks |
| Duplicated logic | Shared base packages (@h4shed/mcp-core, design-tokens) |
| CI/CD complexity | Consistent tooling across repositories |
| Documentation drift | Single source of truth in core repo |

---

## Timeline Estimate

- **Planning:** 1-2 weeks (current phase)
- **Registry Implementation:** 2-3 weeks
- **SyncPulse Extraction:** 2-3 weeks
- **Skill Repository Creation:** 4-6 weeks
- **Documentation & Migration:** 2-3 weeks
- **Validation & Cleanup:** 1-2 weeks

**Total:** 12-18 weeks

---

## This Audit's Role

The Dynagraph Architecture Audit serves as:
1. **Proof of concept** for multi-repo skill integration
2. **Reference implementation** of clean MCP adapter boundaries
3. **Test case** for skill registry federation
4. **Documentation** of reusable packages from core

By designing Dynagraph as a standalone repository from the start, we validate the separation strategy before migrating existing skills.

---

**Next:** PACKAGE-GRAPH.md shows current state; DYNAGRAPH-INTEGRATION.md shows how new repositories interact with core.
