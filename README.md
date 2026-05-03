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

**Fused Gaming MCP** is a modular, production-ready Model Context Protocol server with **19 published-ready skills in-repo** plus core infrastructure packages.

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
| **tailwindcss-style-builder** | Utility-first styling and design system builder | 📋 |
| **storybook-component-library** | Component documentation and visual testing | 📋 |
| **playwright-test-automation** | End-to-end testing automation framework | 📋 |
| **vite-module-bundler** | Next-generation JavaScript module bundler | 📋 |
| **typescript-toolchain** | Advanced TypeScript configuration and analysis | 📋 |
| **vercel-nextjs-deployment** | Vercel deployment and Next.js integration | 📋 |
| **style-dictionary-system** | Design tokens and cross-platform theming | 📋 |
| **nft-generative-art** | NFT artwork generation and blockchain assets | 📋 |
| **smart-contract-tools** | Hardhat, Truffle, and Foundry integration | 📋 |
| **syncpulse** | Multi-agent coordination + 9 email workflow templates | ✅ |

**Core skills are production-ready; new tools are in active scaffolding** ✨

### 📧 SyncPulse Email Workflows (v0.2.0)
New to **SyncPulse**: Production-ready email automation with **9 templated workflows**:
- **Authentication** (4): Magic link login, MFA verification, password reset, security alerts
- **Business** (2): Invoice delivery, newsletters
- **Operations** (3): Outage notices, maintenance announcements, ticket updates

All with professional HTML templates, security best practices, and full agent integration.

### 📦 Publishing now / next wave

**Published now (`@h4shed`)**
- `mcp-cli`, `mcp-core`
- `skill-algorithmic-art`, `skill-ascii-mockup`, `skill-canvas-design`
- `skill-frontend-design`, `skill-mcp-builder`, `skill-pre-deploy-validator`
- `skill-skill-creator`, `skill-theme-factory`, `skill-underworld-writer`
- `skill-syncpulse` ⭐ (v0.2.0 — 9 email workflow templates)

**Scaffolded and queued for publish (`@h4shed`)**
- `skill-mermaid-terminal`
- `skill-ux-journeymapper`
- `skill-svg-generator`
- `skill-project-manager`
- `skill-project-status-tool`
- `skill-daily-review`
- `multi-account-session-tracking`
- `skill-linkedin-master-journalist`
- `skill-tailwindcss-style-builder`
- `skill-storybook-component-library`
- `skill-playwright-test-automation`
- `skill-vite-module-bundler`
- `skill-typescript-toolchain`
- `skill-vercel-nextjs-deployment`
- `skill-style-dictionary-system`
- `skill-nft-generative-art`
- `skill-smart-contract-tools`

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

## 🎬 Quick Start

### Option 1: Interactive Installation (Recommended)

```bash
# Clone and navigate to the repo
git clone https://github.com/fused-gaming/fused-gaming-skill-mcp.git
cd fused-gaming-skill-mcp

# Run the interactive installer
npm run mcp:install
```

This will guide you through:
- ✅ Selecting installation mode (full, minimal, or custom)
- ✅ Choosing your environment (development or production)
- ✅ Generating the skill registry
- ✅ Installing dependencies
- ✅ Building all packages

### Option 2: Manual Setup

```bash
# Install dependencies
npm install

# Initialize MCP core
npm run mcp:init

# Generate skill registry
npm run registry:generate

# Build all packages
npm run build

# Start development server
npm run dev
```

### Option 3: Published Packages Only

```bash
# Install published packages (active scope: @h4shed)
npm install @h4shed/mcp-core @h4shed/mcp-cli

# Add selected skills
npm install \
  @h4shed/skill-algorithmic-art \
  @h4shed/skill-theme-factory \
  @h4shed/skill-underworld-writer
```

Done! You're now ready to supercharge Claude. 🔋

---

## ⚡ One-Command Setup (NEW!)

Get up and running in under 60 seconds:

```bash
# Clone, install, and initialize everything in one command
git clone https://github.com/fused-gaming/fused-gaming-skill-mcp.git && \
cd fused-gaming-skill-mcp && \
npm install && \
npm run mcp:install -- --mode=full && \
npm run build
```

This single command:
- ✅ Clones the repository
- ✅ Installs all dependencies
- ✅ Runs interactive setup wizard
- ✅ Generates skill registry
- ✅ Builds all packages
- ✅ Ready for immediate use

**First-time setup time:** ~2-3 minutes depending on network speed

---

## 🔄 Session Auto-Update Script (NEW!)

Keep your skills and tools up-to-date automatically in each chat session:

### Installation

```bash
# Add to your ~/.bashrc, ~/.zshrc, or Claude Code startup hook
npm run update:check
```

### What It Does

The auto-update script:
- ✅ Checks for new skill packages on startup
- ✅ Fetches latest tool wrapper versions
- ✅ Validates registry consistency
- ✅ Reports what's new in your session
- ✅ Prompts for optional auto-install of updates

### Usage in Claude Code

Add this to your `.claude/settings.json` hook:

```json
{
  "hooks": {
    "session-start": "npm run update:check && npm run registry:validate"
  }
}
```

This ensures every new chat session has the latest skills and tools available.

### Manual Update Check

```bash
# Check for updates without auto-installing
npm run update:check

# Install all pending updates
npm run update:apply
```

---

## 🎬 Claude Code Terminal Livestream

**NEW:** Real-time terminal output visualization directly in Claude Code's web interface!

### What It Does
The Terminal Livestream component displays:
- ✅ Live MCP installation progress
- ✅ Real-time skill registry generation
- ✅ Installation logs with color coding
- ✅ Copy/download/clear functionality
- ✅ WebSocket support for remote log streaming
- ✅ Educational-use-only licensing compliance

### Quick Integration
```tsx
import TerminalLivestream from '@/components/TerminalLivestream';

export default function App() {
  return <TerminalLivestream />;
}
```

### Features
- 🎨 Fused Gaming branding (magenta/purple theme)
- 📱 Responsive mobile design (works on narrow screens)
- ♿ WCAG AA accessibility compliant
- 🔌 WebSocket real-time streaming support
- 📋 Educational-use-only licensing enforcement
- 🎯 Toggle widget (bottom-right, z-50)

### Learn More
- **Integration Guide:** [CLAUDE_CODE_INTEGRATION.md](./docs/CLAUDE_CODE_INTEGRATION.md)
- **Deployment Guide:** [TERMINAL_LIVESTREAM_DEPLOYMENT.md](./docs/TERMINAL_LIVESTREAM_DEPLOYMENT.md)
- **API Deployment:** [SKILL_VLN_GG_DEPLOYMENT.md](./docs/SKILL_VLN_GG_DEPLOYMENT.md)
- **Code Examples:** [TerminalLivestream.example.tsx](./packages/web/examples/TerminalLivestream.example.tsx)
- **License:** [CLAUDE_CODE_LICENSE.md](./packages/web/CLAUDE_CODE_LICENSE.md) (Educational use only)

---

## 📋 Essential Commands

### MCP Core Commands

```bash
npm run mcp:init                   # Initialize MCP core framework
npm run mcp:install                # Run interactive installer
npm run registry:generate          # Generate/update skill registry
npm run registry:validate          # Validate registry & code quality
npm run registry:view              # View full skill registry
```

### Development Commands

```bash
npm run build                      # Build all packages
npm run dev                        # Start development server
npm run lint                       # Check code quality
npm run typecheck                  # Validate TypeScript
npm run test                       # Run test suites
```

### CLI Commands (when using @h4shed/mcp-cli)

```bash
fused-gaming-mcp init              # Initialize config
fused-gaming-mcp list              # Show available skills
fused-gaming-mcp add <skill>       # Enable a skill
fused-gaming-mcp remove <skill>    # Disable a skill
fused-gaming-mcp panel             # Launch SyncPulse panel directly
fused-gaming-mcp config            # View current config
```

---

## 📚 Skill Registry

The Fused Gaming MCP includes a **comprehensive skill registry** that automatically discovers and catalogs all available skills and tools.

### View Available Skills

```bash
# View the Markdown registry
npm run registry:view

# Or open the HTML registry in your browser
open registry/registry.html
```

### Current Registry Status

📊 **19 Skills** | 🛠️ **22 Tools** | 🏷️ **11 Categories**

**Categories:**
- 🎨 Design (5 skills)
- 🎭 Generative Art (1 skill)
- 📖 Content Creation (2 skills)
- 💼 Project Management (2 skills)
- 🔧 MCP Tools (2 skills)
- 🎯 User Experience (1 skill)
- 📊 Session Management (1 skill)
- 🎬 Visualization (1 skill)
- 💻 Development (1 skill)
- 📈 Productivity (1 skill)
- 📋 General (2 skills)

See **[registry/REGISTRY.md](./registry/REGISTRY.md)** for the complete skill inventory.

## ⚙️ Configuration

### MCP Core Configuration

Edit `.mcp/config.json`:

```json
{
  "version": "1.0.0",
  "server": {
    "name": "Fused Gaming MCP",
    "environment": "development",
    "debug": false
  },
  "skills": {
    "enabled": [],
    "auto_discover": true
  },
  "logging": {
    "level": "info"
  }
}
```

### CLI Configuration

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

### Current repository state (as of April 27, 2026)
- ✅ `VERSION.json` is `1.0.5` with new Terminal Livestream component and MCP Core setup system
- ✅ Terminal Livestream: Real-time log visualization for Claude Code (educational-use-only)
- ✅ MCP Core Initialization: Automated setup with skill discovery & registry generation
- ✅ 11 `@h4shed/*` packages published, with 9 additional skill packages queued for publish
- ✅ Core docs include complete integration/deployment guides for Terminal Livestream

### Open PR queue (GitHub currently shows 9 open)
> Source: https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/pulls?q=is%3Apr+is%3Aopen

1. `#118` MCP Core Setup + Claude Code Terminal Livestream Integration (READY TO MERGE)
2. `#109` Add LinkedIn Master Journalist (LIMJ) skill (base: `main`)
3. `#101` ux-journeymapper implementation/docs refresh (base: `feature/syncpulse-skill-docs`)
4. `#81` Feat/socials automation phase1
5. `#79` Socials Automation Asset Pipeline - Phase 1
6. `#19` SVG generation for canvas-design skill
7. `#18` project status tool skill
8. `#17` project manager skill
9. `#16` multi-account session tracking skill

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

## 🚢 Release & Publishing

### 🔐 Signed Commits & Tags

All releases are **GPG signed** for security and authenticity:

- ✅ **Signed Commits** — Version bumps are cryptographically signed
- ✅ **Signed Tags** — Release tags are verified with GPG
- ✅ **GitHub Badge** — "Verified" badge on all commits and releases
- ✅ **npm Authenticity** — Packages published with signing credentials

### Publishing Workflow

**Automated on main push or tag:**
- **npm publish workflow:** `.github/workflows/publish.yml`
  - Imports GPG key and signs commits/tags
  - Runs lint, typecheck, build, scope preparation, and workspace publish
  - Auto-bumps versions for changed packages
  - Creates signed commits and tags

- **GitHub release workflow:** `.github/workflows/github-release.yml`
  - Runs on the same release tags (`v*`, `skill-*`) and creates GitHub Releases with generated notes

### Get Started Publishing

1. **Local Setup** (one-time):
   ```bash
   bash scripts/setup-gpg-signing.sh
   ```

2. **Publish with Signed Commits**:
   ```bash
   bash scripts/publish-signed.sh
   ```

3. **Or push to main** (automatic workflow):
   ```bash
   git add .
   git commit -m "feat: your changes"
   git push origin main
   ```

📖 **Full Guide:** [PUBLISH_GUIDE.md](./docs/PUBLISH_GUIDE.md)

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

[![Version 1.0.5](https://img.shields.io/badge/version-1.0.5-blue)](./VERSION.json)
[![Released April 27, 2026](https://img.shields.io/badge/released-april%2027%2C%202026-brightgreen)](./docs/releases/RELEASE_NOTES.md)
[![Status: Stable](https://img.shields.io/badge/status-stable-brightgreen)](./CHANGELOG.md)
[![Maintained](https://img.shields.io/badge/maintained%3F-yes-brightgreen)](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP)
