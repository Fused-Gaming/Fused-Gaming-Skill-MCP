# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.4] - 2026-05-19

### Fixed
- **License Client Security & Documentation** — PR #183 Codex review resolutions
  - Machine binding now derives from immutable host properties (hostname + platform + MAC address) instead of caching in user-writable directory
  - Prevents vulnerability where copying license directory to another machine would bypass machine binding protection
  - Always compute fresh machine ID on each validation based on hardware identifiers
  - Updated commercial, team, and enterprise license generation examples to show correct API signatures with type, expiresAt, and privateKey arguments
  - Fixed stale documentation examples that were missing required parameters and would cause TypeScript compilation errors

- **SVG Icon System (Solid Variants)** — PR #183 P2 Codex review fix
  - Fixed solid icon variant rendering by keeping strokes enabled for both outline and solid variants
  - Icon registry contains only stroke-based SVG primitives, so stroke removal in solid variant caused invisible rendering
  - Solid variants now use fill + stroke for proper visual appearance while outline variants use stroke-only rendering
  - Resolves rendering issues with `variant="solid"` prop on Icon component

- **Vercel Serverless Function Support**
  - Added @vercel/node to devDependencies for VercelRequest/VercelResponse type definitions
  - Added npm overrides field to enforce TypeScript 5.3.2 globally, preventing license policy violations from transitive dependencies

### Changed
- Enhanced Icon component with improved variant handling logic for better visual consistency

## [1.1.3] - 2026-05-17

### Added
- **Standardized PR Merge Workflow (v1.0)** — Comprehensive documentation and templates for consistent development practices
  - `.github/pull_request_template.md` — Auto-populated PR template with 5-phase merge checklist
  - `docs/PR_MERGE_CHECKLIST.md` — 136+ verification items across validation, testing, documentation, review, and merge execution phases
  - `docs/MERGE_WORKFLOW_GUIDE.md` — Team reference guide with commands, metrics, customization examples, and adoption strategy
  - Publication branch tagging procedures with version numbering (semantic versioning v[X.Y.Z])
  - Comprehensive label checklist system (7+ issue categories, 5+ PR categories)
  - Phase timeline with command sequences for each workflow stage
  - Benchmark metrics template and performance tracking guidelines
  - Migration guide and breaking change documentation standards
  - Post-merge verification and release notes procedures

### Fixed
- **Tailwind CSS Opacity Compatibility (GlassmorphCard)** — PR #186 Codex review resolution
  - Changed unsupported `border-white/8` to valid arbitrary opacity `border-white/[0.08]`
  - Updated hover state from `hover:border-purple-500/50` to `hover:border-white/[0.12]` for consistency
  - Ensures proper translucent border rendering without Tailwind build warnings

### Changed
- Enhanced breadcrumb component with three design variants (default, compact, minimal)
- Updated dashboard and navigation pages to use standardized breadcrumb component
- Improved PR template with implementation checklist for code/testing/documentation/QA tracking
- Added session achievement documentation to checklists with commit tracking

### Documentation
- All PR merge workflow documentation integrated into version-controlled references
- Label system standardized across issues and PRs for consistent project organization
- Release procedures documented with explicit steps for version tagging and publication
- Team adoption guidelines with metrics tracking and retrospective process

## [1.1.2] - 2026-05-16

### Performance
- **SyncPulse v0.2.2 Benchmark Results** — Comprehensive performance validation across all critical operations
  - JWT-based session management with stateless authentication
  - User account creation via `SessionStore.createUser()` method
  - Rate limiting on signup and contact form endpoints (5 requests/min and 10 requests/min respectively)
  - Secured password validation and change workflows
  - Enhanced form submissions with actual API integration (ContactForm, signup page)

### Changed
- **Professional Documentation Reorganization** — PR #181 restructured root documentation hierarchy
  - Moved 34 markdown files from root to organized `docs/` subdirectories (architecture, guides, releases, analysis, archive)
  - Preserved 6 essential root files (README.md, CHANGELOG.md, CLAUDE.md, CONTRIBUTING.md, SECURITY.md, STATUS.md)
  - Fixed all relative path references to prevent broken links during reorganization
  - Updated CONTRIBUTING.md with comprehensive workflow guidance including branch naming, release procedures, and skill registry management
  - Enhanced documentation with workspace install safety guidance and release automation documentation

### Fixed
- Fixed session-store.ts references to non-existent `sessionsMap` in `deleteSession()` method
- Fixed signup page to call `/api/auth/signup` endpoint instead of redirecting without creating account
- Fixed ContactForm.tsx to POST contact data to `/api/contact-sales` instead of simulating submission
- Added missing rate limiter imports to signup and contact-sales endpoints
- Improved error handling in signup and contact form submission workflows
- Enhanced JWT token cookie generation and session management across auth endpoints
- Fixed CONTRIBUTING.md SKILLS_GUIDE reference path from `docs/guides/SKILLS_GUIDE.md` to `docs/SKILLS_GUIDE.md`
- Updated Node.js version requirement from 18+ to 20.x (tested on 20.x and 22.x LTS) in documentation

## [1.1.2] - 2026-05-16

### Performance
- **SyncPulse v0.2.2 Benchmark Results** — Comprehensive performance validation across all critical operations
  - **Cache Operations**: 0.002ms average (447k ops/sec) — Target: <1ms ✓
  - **Vector Search (1K entries)**: 4.5ms average (220 ops/sec) — Target: <10ms ✓
  - **Vector Search (10K entries)**: 45.7ms average (22 ops/sec) — Target: <50ms ✓
  - **Swarm Task Assignment (5 agents)**: 0.0018ms average (559k ops/sec) — Target: <1ms ✓
  - **Memory Usage**: 617.72MB heap (stable) with 1.81MB external resources
  - **Status**: 4 of 4 primary targets passing; Ready for production deployment

### Changed
- **Design System Integration** — SyncPulse v2.0 glassmorphism design system with SVG icons
  - Integrated purple neon theme (#A855F7) across all web pages
  - Replaced emoji with configurable SVG icon system (20+ icons)
  - Added breadcrumb navigation with dynamic version/status badges
  - Implemented PageFooter component for consistent footer/nav structure
  - All pages now use consistent design tokens from version manifest

### Security
- No new vulnerabilities introduced; maintained security baseline from v1.1.1

## [1.1.1] - 2026-05-16

### Fixed
- **TypeScript Configuration Standardization** — Fixed tsconfig.json across 60+ workspace packages
  - Resolved TypeScript 5.3.2 module resolution issues affecting monorepo builds
  - Standardized `ignoreDeprecations: "5.0"` compiler option for baseUrl+paths pattern
  - Fixed malformed JSON in package-level tsconfig.json files (include/exclude placement)
  - Added consistent `baseUrl: "."` and `"paths": {}` to package tsconfigs to resolve inheritance issues
  - Ensured proper TypeScript compilation for all workspace builds (Node 20.x and 22.x)

### Changed
- Updated TypeScript build system to ensure consistent compilation across all CI environments
- Standardized workspace package configuration inheritance patterns

### Security
- No new vulnerabilities introduced; maintained security baseline from v1.1.0

## [1.0.5] - 2026-04-27

### Added
- **SyncPulse Email Workflow Templates (v0.2.0)** — 9 production-ready email automation workflows
  - **Authentication & Security**: Magic link login, MFA verification, password reset, security alerts
  - **Business Operations**: Invoice delivery, newsletter distribution
  - **System Operations**: Outage notices, maintenance announcements, ticket updates
  - All templates feature professional HTML/text, variable interpolation, and security best practices
  - Full TypeScript support with MCP tool definitions
  - Comprehensive documentation: SECURE_EMAIL_SETUP.md, AGENT_INTEGRATION.md, EMAIL_WORKFLOWS.md
- **9 New Scaffolded Development Tool Skills** — Complete package structure and Skill interface implementations
  - Vite Module Bundler (`@h4shed/skill-vite-module-bundler`)
  - TypeScript Toolchain (`@h4shed/skill-typescript-toolchain`)
  - Tailwind CSS Style Builder (`@h4shed/skill-tailwindcss-style-builder`)
  - Storybook Component Library (`@h4shed/skill-storybook-component-library`)
  - Playwright Test Automation (`@h4shed/skill-playwright-test-automation`)
  - Vercel Next.js Deployment (`@h4shed/skill-vercel-nextjs-deployment`)
  - Style Dictionary System (`@h4shed/skill-style-dictionary-system`)
  - NFT Generative Art (`@h4shed/skill-nft-generative-art`)
  - Smart Contract Tools (`@h4shed/skill-smart-contract-tools`)
  - Each implements the Skill interface with proper name, version, description, and initialize method
- **27 Tool Wrapper Packages** — Scaffolding for open-source tool integrations under `@h4shed/tool-*` namespace
  - Design & Style Systems (6): Style Dictionary, Tailwind CSS, PostCSS, cssnano, Sass, Less
  - Component Systems (5): Storybook, TypeDoc, Docusaurus, VitePress, Markdown-it
  - Testing & Quality (8): Axe Core, Pa11y, Jest, Cypress, Playwright, Vitest, Istanbul, Husky
  - Build & Bundling (5): Vite, tsup, Rollup, Webpack, esbuild
  - CLI & Automation (3): Commander, Inquirer, Ora
- **Comprehensive Documentation Hub** — VitePress-based site at `packages/docs/`
  - Home page with hero section, features grid, and quick installation
  - Quick Start guide (5-minute setup)
  - Full Installation guide with phase-by-phase approach
  - Documentation configuration with local search provider
  - Proper navigation structure preventing 404 errors
- **Security & Orchestration Documentation**
  - Tool Integrations Orchestration Guide with security-first approach
  - Complete Tools Registry tracking 50+ packages across 5 tiers
  - Installation Manifest with phased rollout plan (5 phases through May 15)
  - Agent coordination patterns for 13+ specialized agents

### Fixed
- Fixed TypeScript monorepo type resolution by adding `types: ["node"]` to root tsconfig.json
- Fixed TypeScript configuration compatibility by updating `ignoreDeprecations` from "6.0" to "5.0" (21 files)
- Fixed VitePress navigation configuration to prevent 404 errors on missing documentation pages
- Implemented proper Skill interface exports in all 9 new skill packages (resolves Codex P1 review)

## [1.0.5] - 2026-04-27

### Added
- **Claude Code Terminal Livestream Component** — Real-time terminal output visualization for MCP setup and skill registry generation in Claude Code's web interface
  - Interactive toggle widget with smooth animations (Framer Motion)
  - Live log streaming with color-coded output (info, success, warning, error, command)
  - Copy, download, and clear functionality for logs
  - WebSocket support for real-time log streaming from backend
  - Educational-use-only licensing enforcement with UI badge
  - WCAG AA accessibility compliance and keyboard navigation
  - Responsive mobile design (works on narrow screens)
  - Controlled component mode for external log management
  - Live/pause toggle to freeze log snapshots by ID (preserves true snapshot on parent array rotation)
- **Complete MCP Core Initialization System** with automated setup and skill discovery
  - `scripts/init-mcp-core.sh` — Bash initialization script with comprehensive validation
  - `scripts/generate-skill-registry.js` — Automatic skill discovery with registry generation (JSON, TypeScript, CommonJS, Markdown, HTML formats)
  - `scripts/interactive-install.js` — Interactive setup wizard with Fused Gaming branding
  - `.github/workflows/validate-registry.yml` — CI/CD validation workflow
  - `.mcp/config.json` — Default MCP configuration with dev/prod environment support
- **Comprehensive integration and deployment documentation**
  - `docs/CLAUDE_CODE_INTEGRATION.md` (420 lines) — Complete integration guide for developers
  - `docs/TERMINAL_LIVESTREAM_DEPLOYMENT.md` (520 lines) — Deployment instructions for Vercel, Docker, AWS, and WebSocket servers
  - `packages/web/CLAUDE_CODE_LICENSE.md` — Educational licensing terms and restrictions
  - `packages/web/examples/TerminalLivestream.example.tsx` — 10 complete working examples
- Added a 2026-04-27 PR/milestone triage snapshot in `README.md` covering PR #118 (Terminal Livestream integration)
- Added Terminal Livestream section to root README with quick integration guide
- Updated release metadata to `1.0.5` with `releaseDate` set to 2026-04-27

### Changed
- Updated `README.md` to document Terminal Livestream component features and deployment options
- Updated version badge and release date in README footer to reflect 1.0.5
- Updated `VERSION.json` `releaseDate` from 2026-04-24 to 2026-04-27
- Moved PR #118 to top of open PR queue as "READY TO MERGE"
- Updated roadmap notes to include Terminal Livestream component status and MCP Core initialization system

### Fixed
- Fixed Terminal Livestream freeze logic to use log ID snapshots instead of array length (preserves view when parent array is rotated/trimmed)
- Fixed FastAPI WebSocket route from `/ws/logs` to `/logs` to match client default configuration
- Fixed 29+ Codex P1/P2 quality issues including:
  - Prevented duplicate WebSocket connections and stale closures
  - Fixed React hook dependency arrays and effect cleanup
  - Made component responsive for mobile devices (max-w-[calc(100vw-3rem)])
  - Added payload validation and type coercion for WebSocket messages
  - Implemented controlled component mode with external log management
  - Corrected documentation references to non-existent npm packages and build commands
  - Fixed example code to demonstrate actual working patterns

## [1.0.4] - 2026-04-24

### Changed
- Updated roadmap summary messaging in `README.md` to align with live GitHub open PR and milestone inventory instead of stale branch assumptions.
- Added a validated update standard to `docs/NPM_PUBLISHING.md` requiring typecheck/lint/build/tests/publish-prepare before version bumps or release tagging.
- Updated `.github/workflows/test.yml` Node matrix from `20.x`/`24.x` to active LTS lanes `20.x`/`22.x` to resolve Actions Node-version failures in CI testing.
- Updated `.github/workflows/github-release.yml` to `actions/checkout@v5` and added an explicit `actions/setup-node@v5` (`22.x`) runtime step for consistent release-job Node behavior.
- Added `npm run publish:prepare` to automatically bump workspace package patch versions when a matching npm version already exists.
- Updated README and package publish file list to reflect the new documentation paths.
- Updated `publish.yml` to publish npm workspaces on every push to `main` (including merges), while retaining tag-triggered releases and adding manual `workflow_dispatch` support.
- Switched GitHub release authentication in the publish workflow to use the repository `GH_TOKEN` secret.
- Updated `publish.yml` to hand off tag-based release creation to the dedicated GitHub release workflow for clearer separation of responsibilities.
- Expanded README release/roadmap documentation to include existing status, planned follow-ups, and operational blockers.
- Raised release metadata and docs minimum Node.js requirement references from `18.0.0` to `20.0.0` to align with workspace engines and active CI lanes.
- Standardized workspace package README files to follow npm package documentation conventions (installation, usage/tooling context, development, and license sections).
- Advanced release metadata from `1.0.2` to `1.0.3` for the current patch iteration.

### Deprecated
- TBD for next release

### Removed
- TBD for next release

### Fixed
- Added missing CLI dependency declarations (`boxen`, `chalk`, `figlet`, `gradient-string`, `inquirer`, `ora`) plus type packages for `figlet`/`inquirer` to prevent TypeScript module resolution failures during workspace CLI builds in child branches/deploy environments.
- Fixed `packages/skills/svg-generator/src/tools/generate-svg-asset.ts` to define `width` in `generateButton`, resolving CI TypeScript failures (`Cannot find name 'width'`) reported in PR #73 workflow annotations.
- Updated publish version bump automation to only consider changed workspace packages when checking for already-published npm versions, preventing unrelated packages from being patch-bumped without source changes.
- Aligned workflow runtime expectations and release docs around Node.js LTS lanes (`20.x`, `22.x`) to prevent test matrix Node-version mismatches.
- Replaced placeholder Jest test commands in `mermaid-terminal`, `svg-generator`, and `ux-journeymapper` workspace packages with shell no-op test scripts so CI does not fail with `jest: command not found` during PR merge checks.
- Resolved Node `24.x` CI workspace discovery failure (`EDUPLICATEWORKSPACE`) by assigning the legacy Mermaid package a unique workspace name (`@fused-gaming/skill-mermaid-terminal-legacy`) after the production `mermaid-terminal` merge.
- Publish workflow now runs workspace version preparation and lockfile synchronization before `npm ci`/publish to prevent merge-order CI publish conflicts.
- Updated GitHub Actions references to Node 24-compatible major versions (`actions/checkout@v5`, `actions/setup-node@v5`) across workflow docs and execution guides to prevent deprecation drift.
- Regenerated `package-lock.json` to include newly scaffolded workspace packages so `npm ci` no longer fails after development→main merges.
- Resolved `EDUPLICATEWORKSPACE` install/test blocker by assigning a unique workspace package name to `packages/skills/mermaid-terminal-skill`.
- Stopped running the monorepo workspace build from the root `prepare` hook so production `npm install` (for example on Vercel) no longer fails before workspace dependencies are installed.

### Security
- TBD for next release

## [1.0.3] - 2026-04-16

### Added
- Added explicit issue-level specifications to roadmap milestone buckets and PR #51 checklist guidance to standardize execution evidence.

### Changed
- Updated blocker/current-step/next-step planning to include dependency install runtime constraints and dependency-validation follow-up tasks.
- Bumped repository metadata/version references to `1.0.3` across `package.json`, `VERSION.json`, and README badge.

### Fixed
- Re-synchronized `package-lock.json` metadata with current workspace manifests using `npm install --package-lock-only --ignore-scripts`.

## [1.0.1] - 2026-04-16

### Added
- PR #51 merge-readiness checklist and handoff doc with blockers, active steps, and immediate next three tasks.
- Milestone and issue-oriented roadmap entries for planned tools/skills (`daily-review`, `project-status-tool`, `project-manager`, and deployment/status automation).

### Changed
- Bumped repository version metadata to `1.0.1` for daily-review merge readiness documentation and planning sync.
- Refreshed root README roadmap snapshot, priorities, and blockers to align with the PR #51 review window.

## [1.0.0] - 2026-04-02

### Added
- **13+ Curated Skills** for creative and technical tasks
  - Algorithmic Art: Generative art using p5.js
  - ASCII Mockup: Mobile-first wireframes
  - Canvas Design: Visual design with SVG
  - Frontend Design: Component design & HTML/CSS
  - Theme Factory: Design system generation
  - MCP Builder: MCP server scaffolding
  - Pre-Deploy Validator: Deployment validation
  - Skill Creator: Custom skill builder
  - And 5 additional specialized skills
- Modular, scalable MCP server architecture
- npm workspaces for dependency management
- CLI for skill management (`fused-gaming-mcp init`, `add`, `remove`, `list`)
- Comprehensive configuration system with `.fused-gaming-mcp.json`
- Auto-loading of skills via npm workspaces
- Private customization support for internal skills
- Complete API reference documentation
- Architecture documentation and examples
- Contributing guidelines
- Pre-deployment validation tools

### Changed
- Converted from pnpm to npm workspaces for broader compatibility
- Updated TypeScript configuration for modern standards
- Enhanced dependency security with latest package versions

### Security
- Fixed 7 high-severity vulnerabilities
- Resolved ReDoS vulnerability in minimatch
- Updated @modelcontextprotocol/sdk to 1.29.0
- Upgraded @typescript-eslint to 8.58.0
- Upgraded eslint to 10.1.0
- Current security status: 0 vulnerabilities

### Dependencies
- Node.js: >=18.0.0
- npm: >=8.0.0
- TypeScript: ^5.3.2
- @modelcontextprotocol/sdk: latest
- yargs: ^17.7.2

---

## Versioning Policy

This project follows **Semantic Versioning (SemVer)**:
- **MAJOR** (X.0.0): Breaking changes to API, CLI, or skill interfaces
- **MINOR** (0.X.0): New features, new skills, backwards-compatible changes
- **PATCH** (0.0.X): Bug fixes, security patches, documentation updates

## Release Schedule

- **Major versions**: Quarterly (breaking changes)
- **Minor versions**: Monthly (new features/skills)
- **Patch versions**: As needed (bug fixes)

## Backporting Policy

- Security patches: Backported to previous major version
- Bug fixes: Considered case-by-case for maintenance releases
- New features: Only in current major version

## Deprecation Policy

Features marked as deprecated will:
1. Include a deprecation notice in documentation
2. Show a warning when used
3. Be removed in the next major version (minimum 6-month notice)

---

## How to Report Changes

When contributing, please:
1. Update this CHANGELOG.md in your PR
2. Categorize your changes under the [Unreleased] section
3. Follow the format: `- **Category**: Brief description`
4. For skills: mention the skill name in parentheses

Example:
```markdown
### Added
- **Skills**: New `advanced-animation` skill for complex motion graphics (advanced-animation)
```

For detailed contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).
