# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- TBD for next release

### Changed
- **CI/CD**: Updated GitHub Actions to Node 24-compatible major versions (`actions/checkout@v5`, `actions/setup-node@v5`) and disabled matrix fail-fast in `test.yml` so Node 24 jobs still run when Node 20 fails.
- **CI/CD**: Set `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` in repository workflows (`test`, `publish`, `codeql`) to proactively validate JavaScript-based actions on Node 24 before the June 2, 2026 default switch.
- **Docs**: Updated embedded workflow examples and action-version guidance from `@v4` to `@v5` across publishing/execution/prompt/manifest docs for consistency with live CI configuration.

### Deprecated
- TBD for next release

### Removed
- TBD for next release

### Fixed
- **Multi-account session tracking**: Removed an unused accumulator variable in session aggregation to resolve static analysis/code quality findings (multi-account-session-tracking-skill).
- **Multi-account session tracking**: Replaced `any` typing in daily review/session aggregation models with explicit typed records to remove lint warnings that can break stricter CI gates (multi-account-session-tracking-skill).

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
