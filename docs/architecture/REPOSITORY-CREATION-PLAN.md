# Repository Creation Plan — Multi-Repository Reorganization

**Date:** 2026-08-29  
**Status:** Planning (Ready for Execution)  
**Scope:** 7 new repositories to facilitate package separation  
**Timeline:** 12-18 weeks (phased creation)

---

## Overview

The current monorepo (60+ packages) will be separated into **7 focused repositories**. This document provides the exact repository details, naming, structure, and creation sequence.

---

## Repository Creation Checklist

### Phase 1: Foundation (Weeks 1-2)

#### ✅ Repository 1: `fused-gaming/dynagraph` (NEW — Highest Priority)

**Purpose:** Vector-first dynamic OG image renderer  
**Visibility:** Public  
**License:** PolyForm Noncommercial 1.0.0 + Commercial  
**Owner:** Fused Gaming  

**Content to Migrate:**
- None (brand new project)

**Initial Structure:**
```
dynagraph/
├── apps/
│   ├── api/
│   └── studio/ (optional Phase 2)
├── packages/
│   ├── core/
│   ├── renderer/
│   ├── templates/
│   ├── cli/
│   ├── sdk/
│   └── types/
├── templates/
├── examples/
├── tests/
├── docs/
├── scripts/
├── .github/workflows/
├── CLAUDE.md
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE (PolyForm Noncommercial + Commercial)
```

**Setup Instructions:**
1. Create repository on GitHub (Fused-Gaming/dynagraph)
2. Initialize with default Node.js .gitignore
3. Add MIT/PolyForm LICENSE files
4. Create initial package.json with workspace declaration
5. Set branch protection rules (main branch)
6. Enable GitHub Actions
7. Configure default branch protection

**Owner Contact:** [TBD — assign to lead architect]

---

### Phase 2: Multi-Agent Orchestration (Weeks 2-3)

#### ✅ Repository 2: `fused-gaming/syncpulse`

**Purpose:** SyncPulse multi-agent orchestration and coordination  
**Visibility:** Public  
**License:** Apache-2.0 (permissive)  
**Owner:** Fused Gaming  
**Monorepo:** YES (multi-workspace)

**Content to Migrate From:**
- `packages/skills/syncpulse/`
- `packages/skills/syncpulse-hub/`
- Related email workflow definitions
- Multi-agent coordination patterns

**Initial Structure:**
```
syncpulse/
├── packages/
│   ├── core/
│   │   ├── src/
│   │   │   ├── orchestrator.ts
│   │   │   ├── workflows.ts
│   │   │   └── types.ts
│   │   ├── package.json
│   │   └── README.md
│   ├── hub/
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   └── workflows/
│       ├── email-templates/
│       ├── package.json
│       └── README.md
├── examples/
├── docs/
├── .github/workflows/
├── package.json (workspace root)
├── tsconfig.json
├── README.md
└── LICENSE (Apache-2.0)
```

**Dependencies:**
- `@h4shed/mcp-core` (external, from main repo)
- `@h4shed/license-client` (external)

**Setup Instructions:**
1. Create repository on GitHub
2. Initialize monorepo structure (workspaces)
3. Set up CI workflows for multi-workspace testing
4. Configure npm scope publication
5. Set release process for coordinated versioning

**Owner Contact:** [TBD]

---

### Phase 3: Design System (Weeks 3-4)

#### ✅ Repository 3: `fused-gaming/design-system`

**Purpose:** Centralized design tokens, theming, and styling infrastructure  
**Visibility:** Public  
**License:** Apache-2.0  
**Owner:** Fused Gaming  
**Monorepo:** YES (multi-workspace)

**Content to Migrate From:**
- `packages/design-tokens/`
- `packages/skills/theme-factory/`
- `packages/skills/style-dictionary-system/`
- `packages/skills/tailwindcss-style-builder/`

**Initial Structure:**
```
design-system/
├── packages/
│   ├── tokens/
│   │   ├── src/
│   │   │   ├── colors.ts
│   │   │   ├── typography.ts
│   │   │   ├── spacing.ts
│   │   │   └── index.ts
│   │   ├── package.json (@h4shed/design-tokens)
│   │   └── README.md
│   ├── theme-factory/
│   │   ├── src/
│   │   ├── package.json (@h4shed/skill-theme-factory)
│   │   └── README.md
│   ├── style-dictionary/
│   │   ├── src/
│   │   ├── package.json (@h4shed/skill-style-dictionary-system)
│   │   └── README.md
│   └── tailwindcss/
│       ├── src/
│       ├── package.json (@h4shed/skill-tailwindcss-builder)
│       └── README.md
├── examples/
├── docs/
├── .github/workflows/
├── package.json (workspace root)
├── tsconfig.json
├── README.md
└── LICENSE (Apache-2.0)
```

**Dependencies:**
- `@h4shed/mcp-core` (external)

**Setup Instructions:**
1. Create repository
2. Set up workspace structure
3. Configure cross-workspace dependencies
4. Ensure design token exports work for external packages

**Owner Contact:** [TBD]

---

### Phase 4: Skills — Design & Development (Weeks 4-6)

#### ✅ Repository 4: `fused-gaming/skills`

**Purpose:** Reusable skills for design, development, and testing  
**Visibility:** Public  
**License:** Apache-2.0  
**Owner:** Fused Gaming  
**Monorepo:** YES (30+ skill workspaces)

**Content to Migrate From:**
- All `packages/skills/*` EXCEPT syncpulse and design-related skills already in separate repos
- Examples:
  - Canvas Design
  - Frontend Design
  - SVG Generator
  - UX Journey Mapper
  - Mermaid Terminal
  - TypeScript Toolchain
  - Vite Module Bundler
  - Playwright Test Automation
  - Pre-Deploy Validator
  - MCP Builder
  - Skill Creator
  - Algorithmic Art
  - NFT Generative Art
  - LinkedIn Journalist
  - Underworld Writer
  - Daily Review
  - Project Manager
  - And 12+ more skills

**Initial Structure:**
```
skills/
├── packages/
│   ├── canvas-design/
│   ├── svg-generator/
│   ├── frontend-design/
│   ├── ux-journeymapper/
│   ├── mermaid-terminal/
│   ├── typescript-toolchain/
│   ├── vite-module-bundler/
│   ├── playwright-test-automation/
│   ├── pre-deploy-validator/
│   ├── algorithmic-art/
│   ├── nft-generative-art/
│   ├── linkedin-journalist/
│   ├── underworld-writer/
│   ├── daily-review/
│   ├── project-manager/
│   ├── project-status/
│   ├── skill-creator/
│   ├── mcp-builder/
│   ├── vercel-deployment/
│   ├── storybook-library/
│   ├── ascii-mockup/
│   ├── multi-account-tracking/
│   ├── agentic-flow-devkit/
│   └── [12+ more]
├── .github/workflows/
│   ├── test.yml (runs all skills)
│   ├── publish.yml (multi-package publish)
│   └── registry-sync.yml
├── scripts/
│   ├── generate-registry.mjs
│   └── sync-claude-directory.mjs
├── package.json (workspace root)
├── tsconfig.json
├── README.md
└── LICENSE (Apache-2.0)
```

**Shared Infrastructure in This Repo:**
- Skill registry generation scripts
- Common CI/CD workflows
- Shared benchmark utilities
- Shared testing configuration

**Dependencies:**
- `@h4shed/mcp-core` (external, from main repo)
- `@h4shed/design-tokens` (external, from design-system repo)
- `@h4shed/license-client` (external)

**Setup Instructions:**
1. Create repository
2. Set up 30+ skill workspaces
3. Configure CI for parallel skill testing
4. Set up registry generation and sync scripts
5. Configure multi-package publish workflow

**Owner Contact:** [TBD]

**Note:** This will be the largest repository by package count. Consider splitting further (design skills vs. dev tools) in Phase 5 if CI becomes slow.

---

### Phase 5: Tools & Utilities (Weeks 6-7)

#### ✅ Repository 5: `fused-gaming/tools`

**Purpose:** Specialized tools and utilities exposed as MCP tools  
**Visibility:** Public  
**License:** Apache-2.0  
**Owner:** Fused Gaming  
**Monorepo:** YES (28 tool workspaces)

**Content to Migrate From:**
- All `packages/tools/*`
- Examples:
  - Email workflows
  - CSS tools (SASS, LESS, PostCSS, etc.)
  - Testing tools (Jest, Cypress, Playwright)
  - Documentation tools (Storybook, TypeDoc, etc.)
  - CLI tools (Commander, Inquirer)
  - Release management tools

**Initial Structure:**
```
tools/
├── packages/
│   ├── sass/
│   ├── less/
│   ├── postcss/
│   ├── cssnano/
│   ├── tailwindcss/
│   ├── jest/
│   ├── cypress/
│   ├── playwright/
│   ├── vitest/
│   ├── istanbul/
│   ├── axe-core/
│   ├── pa11y/
│   ├── storybook/
│   ├── typedoc/
│   ├── vitepress/
│   ├── docusaurus/
│   ├── commander/
│   ├── inquirer/
│   ├── ora/
│   ├── husky/
│   ├── release-manager/
│   └── [8+ more]
├── .github/workflows/
├── scripts/
├── package.json (workspace root)
├── tsconfig.json
├── README.md
└── LICENSE (Apache-2.0)
```

**Setup Instructions:**
1. Create repository
2. Set up 28 tool workspaces
3. Configure tool peer-dependency strategy
4. Set up CI for tool validation

**Owner Contact:** [TBD]

---

### Phase 6: Documentation & Examples (Weeks 7-8)

#### ✅ Repository 6: `fused-gaming/docs-and-examples`

**Purpose:** Centralized documentation site and usage examples  
**Visibility:** Public  
**License:** Apache-2.0  
**Owner:** Fused Gaming

**Content to Migrate From:**
- `packages/docs/`
- Example projects demonstrating skill usage
- Architecture documentation
- Contributing guidelines

**Initial Structure:**
```
docs-and-examples/
├── docs/
│   ├── getting-started/
│   ├── architecture/
│   ├── skills/
│   ├── tools/
│   ├── api-reference/
│   ├── contributing/
│   └── vitepress-config.ts
├── examples/
│   ├── minimal-skill-usage/
│   ├── multi-skill-composition/
│   ├── mcp-integration/
│   └── custom-skill-template/
├── .github/workflows/
│   └── deploy-docs.yml
├── package.json
├── README.md
└── LICENSE (Apache-2.0)
```

**Setup Instructions:**
1. Create repository
2. Configure documentation site (VitePress)
3. Set up deployment to GitHub Pages
4. Create example project templates

**Owner Contact:** [TBD]

---

### Phase 7: Web Dashboard (Weeks 8-9)

#### ✅ Repository 7: `fused-gaming/web-dashboard`

**Purpose:** Next.js web dashboard for MCP showcase and orchestration  
**Visibility:** Public  
**License:** Apache-2.0  
**Owner:** Fused Gaming

**Content to Migrate From:**
- `packages/web/`

**Initial Structure:**
```
web-dashboard/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── [routes]/
├── components/
├── public/
├── styles/
├── lib/
├── .github/workflows/
│   └── deploy-vercel.yml
├── package.json
├── tsconfig.json
├── next.config.js
├── README.md
└── LICENSE (Apache-2.0)
```

**Setup Instructions:**
1. Create repository
2. Configure Vercel deployment
3. Set up Next.js build pipeline
4. Connect to GitHub Pages for docs site

**Owner Contact:** [TBD]

---

### Main Repository: `fused-gaming/fused-gaming-skill-mcp` (Refactored)

**Purpose:** Core MCP server, CLI, and skill registry federation  
**Content Remaining After Migration:**
- `packages/core/` — @h4shed/mcp-core
- `packages/cli/` — @h4shed/mcp-cli
- `packages/license-client/` — @h4shed/license-client
- `packages/benchmark-utils/` — Benchmarking infrastructure
- `docs/` — Architecture documentation
- `.github/workflows/` — CI/CD orchestration
- `scripts/` — Build, registry, release scripts
- `VERSION.json` — Version management
- `CHANGELOG.md` — Release notes

**New Structure (Post-Migration):**
```
fused-gaming-skill-mcp/
├── packages/
│   ├── core/
│   ├── cli/
│   ├── license-client/
│   └── benchmark-utils/
├── docs/
│   ├── architecture/
│   └── getting-started/
├── scripts/
│   ├── registry-federation.mjs (NEW)
│   ├── skill-discovery.mjs (NEW)
│   └── [existing scripts]
├── .github/
│   ├── workflows/
│   │   ├── registry-sync.yml (NEW)
│   │   └── [existing workflows]
│   └── pull_request_template.md
├── CLAUDE.md (updated)
├── package.json (updated for new workspace scope)
├── README.md (updated)
└── LICENSE (Apache-2.0)
```

**Key Changes:**
- Removed skill packages (moved to separate repos)
- Removed tool packages (moved to separate repos)
- Added skill registry federation system
- Reduced CI time significantly (fewer packages)
- Clearer focus: Core MCP platform only

---

## Repository Setup Checklist

For **each new repository**, follow this sequence:

### Step 1: Create on GitHub
- [ ] Navigate to https://github.com/organizations/Fused-Gaming/repositories/new
- [ ] Repository name: `[repo-name]`
- [ ] Description: `[from repository section above]`
- [ ] Visibility: Public
- [ ] Add .gitignore: Node.js
- [ ] Add LICENSE: Apache-2.0 (or PolyForm for Dynagraph)
- [ ] Create repository

### Step 2: Clone & Initialize
```bash
git clone https://github.com/Fused-Gaming/[repo-name].git
cd [repo-name]
git checkout -b main  # Ensure on main
```

### Step 3: Add Base Files
- [ ] CLAUDE.md (development instructions)
- [ ] CONTRIBUTING.md (contribution guidelines)
- [ ] .codex/ directory (agent instructions)
- [ ] package.json (workspace root + scripts)
- [ ] tsconfig.json
- [ ] .gitignore
- [ ] README.md

### Step 4: Configure Workflows
- [ ] .github/workflows/test.yml (testing matrix)
- [ ] .github/workflows/publish.yml (npm publishing)
- [ ] .github/workflows/codeql.yml (security)

### Step 5: Setup Branch Protection
- [ ] Require pull request reviews before merging
- [ ] Dismiss stale pull request approvals when new commits are pushed
- [ ] Require status checks to pass (test, lint, typecheck)
- [ ] Require branches to be up to date before merging

### Step 6: Configure npm Publishing
- [ ] Verify npm scope (@h4shed/)
- [ ] Set up publishing workflow with secrets
- [ ] Test publish to npm with beta tag first

---

## Creation Sequence & Timeline

```
Week 1-2:   ✅ Dynagraph (highest priority, separate license model)
Week 2-3:   ✅ SyncPulse (complex orchestration, separate from skills)
Week 3-4:   ✅ Design System (foundation for all design skills)
Week 4-6:   ✅ Skills (largest, 30+ packages)
Week 6-7:   ✅ Tools (28 utilities)
Week 7-8:   ✅ Docs & Examples
Week 8-9:   ✅ Web Dashboard
Week 9:     ✅ Main repo refactored (cleanup only)
Week 10-12: ✅ Skill registry federation system (in main repo)
Week 12-18: ⏳ Package separation execution & validation
```

---

## Dependency Management

### External Dependencies Between Repos

```
dynagraph/
  ├─ imports: @h4shed/mcp-core (from main repo)
  ├─ imports: @h4shed/license-client (from main repo)
  ├─ imports: @h4shed/design-tokens (from design-system repo)
  └─ imports: @h4shed/benchmark-utils (from main repo)

syncpulse/
  ├─ imports: @h4shed/mcp-core (from main repo)
  └─ imports: @h4shed/license-client (from main repo)

design-system/
  └─ imports: @h4shed/mcp-core (from main repo)

skills/
  ├─ imports: @h4shed/mcp-core (from main repo)
  ├─ imports: @h4shed/design-tokens (from design-system repo)
  └─ imports: @h4shed/license-client (from main repo)

tools/
  └─ imports: @h4shed/mcp-core (from main repo)

web-dashboard/
  ├─ imports: @h4shed/mcp-core (from main repo)
  └─ imports: design-system packages (via npm)
```

### Dependency Installation

Each repository's `package.json` should reference external packages from npm:

```json
{
  "dependencies": {
    "@h4shed/mcp-core": "^1.0.24",
    "@h4shed/design-tokens": "^1.0.0",
    "@h4shed/license-client": "^1.0.0"
  }
}
```

**Important:** Do NOT use file: protocol for cross-repo dependencies. Use published npm versions for clean separation.

---

## Naming Conventions

### Repository Names
- Lowercase with hyphens
- Examples: `fused-gaming-skill-mcp`, `syncpulse`, `design-system`

### npm Package Scope
- All packages: `@h4shed/`
- Skills: `@h4shed/skill-[name]`
- Tools: `@h4shed/tool-[name]`
- Core: `@h4shed/[name]` (no prefix for core platform packages)

### Package Names
- Lowercase with hyphens
- Examples:
  - `@h4shed/skill-canvas-design`
  - `@h4shed/tool-jest`
  - `@h4shed/design-tokens`

---

## Risk Mitigation

### Risks & Strategies

| Risk | Mitigation |
|------|-----------|
| **Broken cross-repo deps** | Use semantic versioning + compatibility matrix docs |
| **Skill discovery breaks** | Well-designed registry protocol + fallbacks |
| **Duplicated logic** | Shared base packages remain in main repo |
| **CI/CD complexity** | Consistent tooling + centralized workflows template |
| **Docs outdated** | Single source of truth in main repo docs |
| **Package conflicts** | Unique npm scope (@h4shed/) + namespace isolation |

---

## Success Criteria

| Milestone | Criteria |
|-----------|----------|
| **All repos created** | ✅ 7 new repositories with basic scaffolding |
| **Code migrated** | ✅ All 60+ packages distributed without code loss |
| **CI/CD working** | ✅ Each repo has passing test/lint/publish workflows |
| **npm publishing working** | ✅ Packages publish correctly to registry |
| **Skill registry federation** | ✅ MCP core can discover/load skills from 5+ repos |
| **Documentation complete** | ✅ Each repo has README + contribution guide |
| **Dependency graph clean** | ✅ No circular dependencies between repos |

---

## Next Steps

1. **Review this plan** with team
2. **Assign owners** for each repository
3. **Prepare migration scripts** for each phase
4. **Create repositories** in sequence (start with Dynagraph)
5. **Test skill registry federation** before full migration
6. **Migrate packages** phase by phase
7. **Validate CI/CD** on each new repository
8. **Update documentation** across all repositories

---

**Status:** Ready for execution  
**Prepared By:** Architecture Audit (2026-08-29)  
**Owner:** [Assign team lead]  
**Next Review:** Upon Phase 1 completion
