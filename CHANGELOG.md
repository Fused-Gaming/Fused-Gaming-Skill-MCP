# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Added one-command SyncPulse panel launcher commands to the CLI: `fused-gaming-mcp panel` and `fused-gaming-mcp syncpulse` (alias).
- Added `@fused-gaming/skill-agentic-flow-devkit` workspace with `visualize-agentic-flow` and `plan-trailer-rolls` tools to support orchestration GUI planning and trailer A/B-roll sourcing.
- Added `docs/process/GITHUB_MCP_AGENTS_ORIENTATION.md` with blockers, current steps, immediate next actions, PR-context triage, and agent directives for the `feat/github-agents` branch.
- Added `docs/process/PR_51_MERGE_CHECKLIST.md` with explicit PR #51 deliverables, success metrics, blockers, execution order, and next-agent handoff directives.
- Added `scripts/auto-bump-publish-versions.js` to automatically patch-bump root/workspace package versions until npm reports they are publishable.
- Added `scripts/preflight-publish-check.js` and wired it into publish CI to fail fast when any workspace package version is already published on npm.
- Added a documentation index (`docs/README.md`) and reorganized root-level docs into categorized directories (`docs/getting-started`, `docs/process`, `docs/releases`, `docs/archive`).
- Added a dedicated GitHub release workflow (`.github/workflows/github-release.yml`) that triggers on release tags (`v*`, `skill-*`) and can also be started manually.
- Added a roadmap document (`docs/ROADMAP.md`) with published/missing/planned skill inventories, blockers, and immediate next steps.
- Added scaffold packages for upcoming skills: mermaid-terminal, ux-journeymapper, svg-generator, project-manager, project-status-tool, daily-review, multi-account-session-tracking, and linkedin-master-journalist.

### Changed
- Updated CLI and root README command references to document the new one-command SyncPulse panel launcher.
- Bumped root release metadata to `1.0.4` to capture the new agentic-flow-devkit delivery and session-orientation updates.
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
