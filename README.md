# 🎮 Fused Gaming MCP

<div align="center">

![Fused Gaming MCP Social Preview](.github/assets/social-preview.png)

</div>

---

## 📊 Status & Technology

[![npm scope](https://img.shields.io/badge/npm-scope%20%40h4shed-red)](https://www.npmjs.com/~h4shed)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](./LICENSE)
[![Build](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/workflows/test/badge.svg)](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/actions)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.3.2-blue)](https://www.typescriptlang.org/)
[![npm](https://img.shields.io/badge/npm-%3E%3D8.0.0-red)](https://www.npmjs.com/)

---

## 🚀 The Ultimate AI-Powered Skill Ecosystem

**Fused Gaming MCP** is a modular, production-ready Model Context Protocol server with **10 published-ready skills in-repo** plus core infrastructure packages.

### 🎯 Your Creative Arsenal Includes:

| Skill | Purpose | Status |
|-------|---------|--------|
| **algorithmic-art** | Generative art using p5.js | ✅ |
| **ascii-mockup** | Mobile-first wireframe designs | ✅ |
| **canvas-design** | SVG-based visual design | ✅ |
| **frontend-design** | HTML/CSS component design | ✅ |
| **theme-factory** | Design system generation | ✅ |
| **mcp-builder** | MCP server scaffolding | ✅ |
| **pre-deploy-validator** | Deployment validation | ✅ |
| **skill-creator** | Custom skill builder | ✅ |
| **underworld-writer** | Character/world narrative generation | ✅ |
| **agentic-flow-devkit** | Agentic orchestration GUI + trailer A/B-roll planning | 🆕 |

**All skills are production-ready and actively maintained** ✨

### 📦 Publishing now / next wave

**Published now (`@h4shed`)**
- `mcp-cli`, `mcp-core`
- `skill-algorithmic-art`, `skill-ascii-mockup`, `skill-canvas-design`
- `skill-frontend-design`, `skill-mcp-builder`, `skill-pre-deploy-validator`
- `skill-skill-creator`, `skill-theme-factory`, `skill-underworld-writer`

**Scaffolded and queued for publish (`@h4shed`)**
- `skill-mermaid-terminal`
- `skill-ux-journeymapper`
- `skill-svg-generator`
- `skill-project-manager`
- `skill-project-status-tool`
- `skill-daily-review`
- `multi-account-session-tracking`
- `skill-linkedin-master-journalist`

---

## ✨ Why Fused Gaming MCP?

Transform your Claude workflow with meticulously crafted tools designed for:

✔️ **Generative Art** — Create algorithmic artwork and visualizations  
✔️ **UI/UX Design** — Build design systems and component libraries  
✔️ **Web Development** — Scaffold projects and validate deployments  
✔️ **Game Development** — Asset generation and rapid prototyping  
✔️ **AI Automation** — Streamline creative and technical workflows  

**Trusted by:** Fused Gaming • VLN Security • Design Studios • AI Development Teams

---

## 🎬 Quick Start (2 Minutes)

### Install

```bash
# Install published packages (active scope: @h4shed)
npm install @h4shed/mcp-core @h4shed/mcp-cli

# Add selected skills
npm install \
  @h4shed/skill-algorithmic-art \
  @h4shed/skill-theme-factory \
  @h4shed/skill-underworld-writer
```

### Initialize & Run

```bash
# Run CLI
npx @h4shed/mcp-cli init

# Add more skills anytime
npx @h4shed/mcp-cli add frontend-design
npx @h4shed/mcp-cli add pre-deploy-validator

# Start the MCP server
npm run dev
```

Done! You're now ready to supercharge Claude. 🔋

---

## 📋 Essential Commands

```bash
fused-gaming-mcp init              # Initialize config
fused-gaming-mcp list              # Show available skills
fused-gaming-mcp add <skill>       # Enable a skill
fused-gaming-mcp remove <skill>    # Disable a skill
fused-gaming-mcp panel             # Launch SyncPulse panel directly
fused-gaming-mcp config            # View current config
```

---

## ⚙️ Configuration

Customize via `.fused-gaming-mcp.json`:

```json
{
  "skills": {
    "enabled": ["algorithmic-art", "theme-factory", "frontend-design"],
    "disabled": []
  },
  "auth": {
    "apiKeys": {
      "openai": "sk-..."
    }
  },
  "logging": {
    "level": "info"
  }
}
```

---

## 🏗️ Development

```bash
npm install         # Install dependencies
npm run build       # Build all packages
npm run test        # Run tests
npm run lint        # Check code quality
npm run typecheck   # Validate TypeScript
npm run dev         # Start dev server
```

---

## 📚 Documentation

| Resource | Purpose |
|----------|---------|
| [QUICKSTART.md](./docs/getting-started/QUICKSTART.md) | Get started in minutes |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design & internals |
| [SKILLS_GUIDE.md](./docs/SKILLS_GUIDE.md) | Build custom skills |
| [API_REFERENCE.md](./docs/API_REFERENCE.md) | Complete API docs |
| [EXAMPLES.md](./docs/EXAMPLES.md) | Real-world usage patterns |
| [RELEASE_COMMUNICATION.md](./docs/RELEASE_COMMUNICATION.md) | Launch summary + LinkedIn post draft |
| [ROADMAP.md](./docs/ROADMAP.md) | Published/missing/planned skills and priorities |
| [docs/README.md](./docs/README.md) | Documentation index by category |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute |

---

## 🗺️ Roadmap Snapshot (Existing + Planned)

### Current repository state (as of April 21, 2026)
- ✅ `VERSION.json` is `1.0.4` and marks the project `stable`.
- ✅ 11 `@h4shed/*` packages are listed as published, with 9 additional skill packages queued for publish.
- ✅ Core docs exist for roadmap/changelog/release orientation and package publishing workflow.

### Open PR queue (GitHub currently shows 8 open)
> Source: https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/pulls?q=is%3Apr+is%3Aopen

1. `#109` Add LinkedIn Master Journalist (LIMJ) skill (base: `main`)
2. `#101` ux-journeymapper implementation/docs refresh (base: `feature/syncpulse-skill-docs`)
3. `#81` Feat/socials automation phase1
4. `#79` Socials Automation Asset Pipeline - Phase 1
5. `#19` SVG generation for canvas-design skill
6. `#18` project status tool skill
7. `#17` project manager skill
8. `#16` multi-account session tracking skill

### MVP milestone snapshot (GitHub milestones page)
> Source: https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/milestones

- 14 milestones are open, including:
  - `Syncpulse - AI Orchestration & Developer Control Plane`
  - `Social Media Brand Asset Skill`
  - `NPM Package Release` (closed issues complete)
  - `SVG generation for Canvas Design Skill`
  - `Project Manager Skill`
  - `UX Journeymapper Skill`
  - `Mermaid Terminal Skill`
  - `Daily Review Skill`
  - `Multi Account Session Tracking Skill`

### Current blockers
1. GitHub page/API content is partially degraded when unauthenticated (`Uh oh!` load failures on filters/check details), so some check-run evidence must be validated in an authenticated browser session.
2. Open PR queue includes older April 2026 feature branches that need rebase/conflict/testing passes before merge sequencing.
3. At least one open PR (`#101`) still shows a failed Vercel preview deployment signal in visible thread events.

### Current steps
1. Keep README/roadmap/changelog aligned with live GitHub PR + milestone state.
2. Prioritize failing-deployment PR remediation before feature merges.
3. Merge or close stale feature PRs with explicit branch strategy (stacked branch vs `main` direct).

### Immediate next 3 steps
1. Triage and fix failing deployment(s) on open PRs, starting with `#101`.
2. Normalize open feature branches (`#16/#17/#18/#19/#79/#81/#101/#109`) against current `main`.
3. Add/refresh a single merge checklist for each PR with test + deployment evidence links.

### Top 3 priorities now
1. Resolve failing open PR checks/deployments first (do not merge while red).
2. Finish publish-ready implementation for missing high-impact skills (`mermaid-terminal`, `ux-journeymapper`, `svg-generator`, `project-*`).
3. Automate docs/version/package drift checks in CI so release metadata stays accurate.

---

## 🚢 Release Automation

- **npm publish workflow:** `.github/workflows/publish.yml`
  - Runs lint, typecheck, build, scope preparation, and workspace publish.
- **GitHub release workflow:** `.github/workflows/github-release.yml`
  - Runs on the same release tags (`v*`, `skill-*`) and creates GitHub Releases with generated notes.
- This split keeps npm publishing and release-note generation independently observable and easier to retry.

---

## 💡 Use Cases

🎨 **Generative Art** — Create procedural artwork and visual effects  
🖼️ **Design Systems** — Build cohesive UI components and themes  
🛠️ **Development** — MCP builders, validators, and scaffolding  
📱 **Prototyping** — Rapid wireframing and layout design  
🎮 **Game Development** — Asset generation and design automation  

---

## 📦 System Requirements

```
Node.js ≥ 20.0.0
npm ≥ 8.0.0
```

---

## 🤝 Contributing

We'd love your involvement!

- 🐛 **Report Issues** → [GitHub Issues](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/issues)
- 💡 **Suggest Features** → [GitHub Discussions](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/discussions)
- 🤝 **Contribute Code** → [CONTRIBUTING.md](./CONTRIBUTING.md)
- 📧 **Get Support** → [support@fused-gaming.io](mailto:support@fused-gaming.io)

### Contributors

Built with ❤️ by the Fused Gaming Team and community contributors.

---

## 📄 License

Apache 2.0 — See [LICENSE](./LICENSE) for details

---

[![Version 1.0.4](https://img.shields.io/badge/version-1.0.4-blue)](./VERSION.json)
[![Released April 17, 2026](https://img.shields.io/badge/released-april%2017%2C%202026-brightgreen)](./docs/releases/RELEASE_NOTES.md)
[![Status: Stable](https://img.shields.io/badge/status-stable-brightgreen)](./CHANGELOG.md)
[![Maintained](https://img.shields.io/badge/maintained%3F-yes-brightgreen)](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP)
