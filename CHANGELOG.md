# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Added a documentation index (`docs/README.md`) and reorganized root-level docs into categorized directories (`docs/getting-started`, `docs/process`, `docs/releases`, `docs/archive`).
- Added a dedicated GitHub release workflow (`.github/workflows/github-release.yml`) that triggers on release tags (`v*`, `skill-*`) and can also be started manually.
- Added a roadmap document (`docs/ROADMAP.md`) with published/missing/planned skill inventories, blockers, and immediate next steps.
- Added scaffold packages for upcoming skills: mermaid-terminal, ux-journeymapper, svg-generator, project-manager, project-status-tool, daily-review, multi-account-session-tracking, and linkedin-master-journalist.

### Changed
- Updated README and package publish file list to reflect the new documentation paths.
- Updated `publish.yml` to publish npm workspaces on every push to `main` (including merges), while retaining tag-triggered releases and adding manual `workflow_dispatch` support.
- Switched GitHub release authentication in the publish workflow to use the repository `GH_TOKEN` secret.
- Updated `publish.yml` to hand off tag-based release creation to the dedicated GitHub release workflow for clearer separation of responsibilities.
- Expanded README release/roadmap documentation to include existing status, planned follow-ups, and operational blockers.
- Updated release-facing documentation to reflect currently published npm scope/packages under `@h4shed`.

### Deprecated
- TBD for next release

### Removed
- TBD for next release

### Fixed
- Prevented npm publish workflow failures from missing scopes by adding CI scope preparation with `NPM_SCOPE` override and `npm whoami` fallback.
- Regenerated `package-lock.json` to include newly scaffolded workspace packages so `npm ci` no longer fails after development→main merges.

### Security
- TBD for next release

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
