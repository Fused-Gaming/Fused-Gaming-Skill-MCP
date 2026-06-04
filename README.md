# 

<div align="center"> 

# 📊 SYNCPULSE MCP 
![SyncPulse Agent Swarms - Production Ready](.github/assets/syncpulse-hero.png)

<img width="1672" height="941" alt="image" src="https://github.com/user-attachments/assets/0b5dc2bb-4f0d-45f5-8632-8e89de49571b" />
</div>

<div align="center"> 

[![Version](https://img.shields.io/badge/version-v1.1.5-blue)](./CHANGELOG.md) [![npm scope](https://img.shields.io/badge/npm-scope%20%40h4shed-red)](https://www.npmjs.com/~h4shed) [![License](https://img.shields.io/badge/license-PPL%203.0.0%20%2B%20Commercial-brightgreen)](./LICENSE) [![Publish to npm](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/actions/workflows/publish.yml/badge.svg?branch=main)](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/actions/workflows/publish.yml) [![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/typescript-5.3.2-blue)](https://www.typescriptlang.org/) [![npm](https://img.shields.io/badge/npm-%3E%3D8.0.0-red)](https://www.npmjs.com/)

</div>

---

## 🚀 The Ultimate AI-Powered Skill Ecosystem

**Fused Gaming MCP** is a modular, production-ready Model Context Protocol server with **61 total packages** organized as:
- **31 reusable AI skills** (across 11 functional categories)
- **28 specialized MCP tools**
- **2 core infrastructure packages**

All skills, tools, and infrastructure are documented with individual READMEs in their respective package directories. This root README provides a focused navigation index and quick-start guide.

### 📜 Dual License Model

**Fused Gaming MCP** is available under two flexible licensing options:

1. **Prosperity Public License 3.0.0** (Free)
   - ✅ Personal use, educational projects, open-source development
   - ✅ Community forum support
   - 📄 See [LICENSE](./LICENSE) for full details

2. **Commercial License** (Paid)
   - ✅ Commercial applications, closed-source products, SaaS platforms
   - ✅ Tiered pricing: Startup ($500/yr), Growth ($5K/yr), Enterprise (custom)
   - ✅ 30-day free trial available
   - 📞 Priority support included
   - 📄 See [COMMERCIAL_LICENSE.md](./COMMERCIAL_LICENSE.md) for full details

**Starting your free trial?** Contact: jlucus916@gmail.com

### 🐝 SyncPulse Agent Orchestration (v0.2.2)
**SyncPulse** brings enterprise-grade multi-agent orchestration with:
- **Performance**: 100-500x vector search speedup via hierarchical indexing
- **Reliability**: LRU cache eviction preventing OOM in 24h+ deployments
- **Scale**: Work-stealing load balancing for heterogeneous swarms
- **Email Workflows**: 9 templated automation workflows (authentication, business, operations)

**SyncPulse Hub** (v0.1.1) provides:
- Orchestration dashboard for real-time swarm monitoring
- Agent health metrics and performance analytics
- Task queue management and load visualization
- Integration with SyncPulse v0.2.2+ for seamless orchestration

### 📌 Dual Naming Convention
The ecosystem uses intentional dual naming to separate internal development from published packages:
- **Internal Workspace Names** (in git): `@fused-gaming/skill-*` or `@fused-gaming/tool-*`
- **Published NPM Names**: `@h4shed/skill-*` or `@h4shed/tool-*`

This allows flexible internal development while maintaining a consistent, branded public presence on npm.

---

## ✨ Why Fused Gaming MCP?

Transform your Claude workflow with meticulously crafted tools designed for:

- ✔️ **Generative Art** — Create algorithmic artwork and visualizations  
- ✔️ **UI/UX Design** — Build design systems and component libraries  
- ✔️ **Web Development** — Scaffold projects and validate deployments  
- ✔️ **Game Development** — Asset generation and rapid prototyping  
- ✔️ **AI Automation** — Streamline creative and technical workflows  

**Trusted by:** Fused Gaming • VLN Security • Design Studios • AI Development Teams

---

## 🎬 Quick Start (2 Minutes)

### Option 1: Interactive Installation (Recommended)

```bash
# Clone and navigate to the repo
git clone https://github.com/fused-gaming/fused-gaming-skill-mcp.git
cd fused-gaming-skill-mcp

# Run the interactive installer
npm run mcp:install
```

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
```

### Option 3: Published Packages Only

```bash
# Install published packages (scope: @h4shed)
npm install @h4shed/mcp-core @h4shed/mcp-cli

# Add selected skills
npm install \
  @h4shed/skill-algorithmic-art \
  @h4shed/skill-theme-factory \
  @h4shed/skill-underworld-writer
```

---

## 📚 Skills Index (31 Total)

All skills include individual documentation in their respective directories at `packages/skills/<skill>/README.md`.

### 🎨 Design & Styling (8 Skills)

| Package | NPM Name | Description |
|---------|----------|-------------|
| agentic-flow-devkit | @h4shed/skill-agentic-flow-devkit | Agentic orchestration GUI + trailer A/B-roll planning |
| canvas-design | @h4shed/skill-canvas-design | SVG-based visual design and asset generation |
| frontend-design | @h4shed/skill-frontend-design | HTML/CSS component design and prototyping |
| style-dictionary-system | @h4shed/skill-style-dictionary-system | Design tokens and cross-platform theming |
| svg-generator | @h4shed/skill-svg-generator | Scalable vector graphics generation |
| tailwindcss-style-builder | @h4shed/skill-tailwindcss-style-builder | Utility-first styling and design system builder |
| theme-factory | @h4shed/skill-theme-factory | Design system generation and customization |
| ux-journeymapper | @h4shed/skill-ux-journeymapper | User journey mapping and experience design |

### 🎭 Generative Art & Blockchain (3 Skills)

| Package | NPM Name | Description |
|---------|----------|-------------|
| algorithmic-art | @h4shed/skill-algorithmic-art | Generative art using p5.js and procedural generation |
| nft-generative-art | @h4shed/skill-nft-generative-art | NFT artwork generation and blockchain assets |
| smart-contract-tools | @h4shed/skill-smart-contract-tools | Hardhat, Truffle, and Foundry integration |

### 🛠️ Build Tools & Bundling (4 Skills)

| Package | NPM Name | Description |
|---------|----------|-------------|
| mermaid-terminal | @h4shed/skill-mermaid-terminal | Mermaid diagram generation and terminal rendering |
| typescript-toolchain | @h4shed/skill-typescript-toolchain | Advanced TypeScript configuration and analysis |
| vite-module-bundler | @h4shed/skill-vite-module-bundler | Next-generation JavaScript module bundler |
| vercel-nextjs-deployment | @h4shed/skill-vercel-nextjs-deployment | Vercel deployment and Next.js integration |

### 🧪 Testing & Validation (2 Skills)

| Package | NPM Name | Description |
|---------|----------|-------------|
| playwright-test-automation | @h4shed/skill-playwright-test-automation | End-to-end testing automation framework |
| pre-deploy-validator | @h4shed/skill-pre-deploy-validator | Deployment validation and safety checks |

### 📚 Documentation & Components (2 Skills)

| Package | NPM Name | Description |
|---------|----------|-------------|
| storybook-component-library | @h4shed/skill-storybook-component-library | Component documentation and visual testing |
| ascii-mockup | @h4shed/skill-ascii-mockup | Mobile-first wireframe designs |

### 🔧 MCP Scaffolding (2 Skills)

| Package | NPM Name | Description |
|---------|----------|-------------|
| mcp-builder | @h4shed/skill-mcp-builder | MCP server scaffolding and code generation |
| skill-creator | @h4shed/skill-skill-creator | Custom skill builder and framework |

### 📝 Content Creation (2 Skills)

| Package | NPM Name | Description |
|---------|----------|-------------|
| linkedin-master-journalist | @h4shed/skill-linkedin-master-journalist | LinkedIn article + dual posts + branded covers |
| underworld-writer-skill | @h4shed/skill-underworld-writer | Character/world narrative generation |

### 🤖 Agent Orchestration (2 Skills)

| Package | NPM Name | Description |
|---------|----------|-------------|
| syncpulse | @h4shed/skill-syncpulse | Multi-agent coordination + 9 email workflow templates |
| syncpulse-hub | @h4shed/skill-syncpulse-hub | SyncPulse orchestration dashboard and agent management |

### 📊 Project Management (3 Skills)

| Package | NPM Name | Description |
|---------|----------|-------------|
| project-manager | @h4shed/skill-project-manager | Project planning and execution orchestration |
| project-manager-skill | @h4shed/skill-project-manager-skill | Project workflow coordination and automation |
| project-status-tool | @h4shed/skill-project-status-tool | Project status tracking and reporting |

### 🎯 Productivity & Session Management (2 Skills)

| Package | NPM Name | Description |
|---------|----------|-------------|
| daily-review-skill | @h4shed/skill-daily-review | Daily review and reflection automation |
| multi-account-session-tracking | @h4shed/skill-multi-account-session-tracking | Multi-account session management and persistence |
| multi-account-session-tracking-skill | @h4shed/skill-multi-account-session-tracking-skill | Advanced session tracking across platforms |

---

## 🛠️ MCP Tools (28 Total)

All tools include individual documentation in their respective directories at `packages/tools/tool-*/README.md`.

### 📦 Build & Bundling Tools (7 Tools)

| Package | NPM Name | Description |
|---------|----------|-------------|
| tool-esbuild | @h4shed/tool-esbuild | Fast JavaScript bundler with TypeScript support |
| tool-rollup | @h4shed/tool-rollup | Module bundler for JavaScript libraries |
| tool-tsup | @h4shed/tool-tsup | Minimal TypeScript to JavaScript transpiler |
| tool-vite | @h4shed/tool-vite | Next-generation frontend build tool |
| tool-vitepress | @h4shed/tool-vitepress | Static site generator powered by Vite |
| tool-webpack | @h4shed/tool-webpack | Powerful module bundler for applications |
| tool-docusaurus | @h4shed/tool-docusaurus | Documentation site generator |

### 🎨 Style & CSS Tools (6 Tools)

| Package | NPM Name | Description |
|---------|----------|-------------|
| tool-postcss | @h4shed/tool-postcss | CSS processor with plugin ecosystem |
| tool-sass | @h4shed/tool-sass | CSS preprocessor with nesting and variables |
| tool-less | @h4shed/tool-less | Dynamic stylesheet language |
| tool-cssnano | @h4shed/tool-cssnano | CSS minifier and optimizer |
| tool-tailwindcss | @h4shed/tool-tailwindcss | Utility-first CSS framework |
| tool-style-dictionary | @h4shed/tool-style-dictionary | Design token management system |

### 🧪 Testing & QA Tools (6 Tools)

| Package | NPM Name | Description |
|---------|----------|-------------|
| tool-jest | @h4shed/tool-jest | JavaScript testing framework |
| tool-vitest | @h4shed/tool-vitest | Vite-native unit testing framework |
| tool-cypress | @h4shed/tool-cypress | End-to-end testing platform |
| tool-playwright | @h4shed/tool-playwright | Cross-browser automation and testing |
| tool-pa11y | @h4shed/tool-pa11y | Accessibility testing runner |
| tool-axe-core | @h4shed/tool-axe-core | Accessibility engine and testing |

### 📚 Documentation & Component Tools (4 Tools)

| Package | NPM Name | Description |
|---------|----------|-------------|
| tool-storybook | @h4shed/tool-storybook | UI component development and documentation |
| tool-typedoc | @h4shed/tool-typedoc | TypeScript documentation generator |
| tool-markdown-it | @h4shed/tool-markdown-it | Markdown parser with plugins |
| tool-husky | @h4shed/tool-husky | Git hooks framework |

### 🔧 CLI & Automation Tools (3 Tools)

| Package | NPM Name | Description |
|---------|----------|-------------|
| tool-commander | @h4shed/tool-commander | CLI framework for Node.js |
| tool-inquirer | @h4shed/tool-inquirer | Interactive command-line prompts |
| tool-ora | @h4shed/tool-ora | Elegant terminal spinners |

### 📊 Analysis & Reporting Tools (2 Tools)

| Package | NPM Name | Description |
|---------|----------|-------------|
| tool-istanbul | @h4shed/tool-istanbul | Code coverage analysis tool |
| tool-release-manager | @h4shed/tool-release-manager | Automated version bumping and release notes |

---

## 📦 Core Infrastructure Packages (2 Total)

| Package | NPM Name | Purpose |
|---------|----------|---------|
| **cli** | @h4shed/mcp-cli | Command-line interface for MCP orchestration and skill management |
| **core** | @h4shed/mcp-core | Core MCP framework, server runtime, and protocol implementation |

### 🌟 New Packages in Development (4 Total)

These packages are actively in development and will be published to npm:

| Package | NPM Name (Target) | Description |
|---------|----------|-------------|
| **deploy-wizard** | @h4shed/skill-deploy-wizard | Interactive setup CLI for rapid MCP deployment |
| **mcp-orchestrator** | @h4shed/skill-mcp-orchestrator | Agentic task coordination and workflow management |
| **mvp-generator** | @h4shed/skill-mvp-generator | MVP generation service for rapid prototyping |
| **templates** | @h4shed/templates | Reusable generation templates and scaffolding |

---

## ✨ Key Features

✔️ **Orchestration & Coordination** — SyncPulse multi-agent coordination with 9 email workflow templates  
✔️ **Security & Authentication** — JWT-based endpoint protection with role-based access control for sensitive APIs  
✔️ **Design Systems** — Complete design tokens, theming, and component documentation  
✔️ **Generative Art** — Algorithmic and NFT artwork generation with blockchain tools  
✔️ **Content Creation** — Autonomous article generation, social posts, and branded assets  
✔️ **Automation & Testing** — E2E testing, deployment validation, and workflow automation  
✔️ **User Experience** — Journey mapping, wireframing, and interactive prototyping  
✔️ **Development Tools** — MCP scaffolding, TypeScript toolchain, and bundler integration  

---

## 📋 Essential Commands

### Setup & Installation

```bash
npm install                      # Install dependencies
npm run mcp:install              # Run interactive installer
npm run mcp:init                 # Initialize MCP core
npm run registry:generate        # Generate skill registry
npm run registry:validate        # Validate registry & code quality
npm run build                    # Build all packages
```

### Development

```bash
npm run dev                      # Start development server
npm run lint                     # Check code quality
npm run typecheck                # Validate TypeScript
npm run test                     # Run test suites
```

### Publishing

```bash
npm run publish:packages         # Publish all packages to npm
npm run publish:prepare          # Prepare versions for publish
```

> CI tip: keep lint output warning-free in addition to error-free to avoid stricter pipeline gates in downstream environments.

---

## 📚 Documentation

| Resource | Purpose |
|----------|---------|
| [docs/](./docs/) | Documentation directory index |
| [QUICKSTART.md](./docs/getting-started/QUICKSTART.md) | Get started in minutes |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design & internals |
| [SKILLS_GUIDE.md](./docs/SKILLS_GUIDE.md) | Build custom skills |
| [API_REFERENCE.md](./docs/API_REFERENCE.md) | Complete API docs |
| [ROADMAP.md](./docs/ROADMAP.md) | Published/missing/planned skills |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute |
| [VERSION.json](./VERSION.json) | Release metadata and version authority |
| [registry/REGISTRY.md](./registry/REGISTRY.md) | Authoritative package inventory |

---

## 🚢 Publishing & Releases

**Current Status:** `1.0.5` (Stable — Released 2026-04-27)

**Total Packages:** 61 (31 skills + 28 tools + 2 core)

### Published on npm (12 Packages)

**Core Infrastructure:**
- `@h4shed/mcp-cli` - Command-line orchestration interface
- `@h4shed/mcp-core` - Core MCP framework

**Published Skills:**
- `@h4shed/skill-algorithmic-art` - Generative art using p5.js
- `@h4shed/skill-ascii-mockup` - Mobile-first wireframe designs
- `@h4shed/skill-canvas-design` - SVG-based visual design
- `@h4shed/skill-frontend-design` - HTML/CSS component design
- `@h4shed/skill-mcp-builder` - MCP server scaffolding
- `@h4shed/skill-pre-deploy-validator` - Deployment validation
- `@h4shed/skill-skill-creator` - Custom skill builder
- `@h4shed/skill-theme-factory` - Design system generation
- `@h4shed/skill-underworld-writer` - Character/world narrative generation
- `@h4shed/skill-syncpulse` - Multi-agent orchestration (v0.2.2)
- `@h4shed/skill-syncpulse-hub` - Agent orchestration dashboard (v0.1.1)

### Scaffolded & Queued for Publishing (47 Packages)

**Skills (19):** mermaid-terminal, ux-journeymapper, svg-generator, project-manager, project-manager-skill, project-status-tool, daily-review, multi-account-session-tracking (x2 variants), linkedin-master-journalist, tailwindcss-style-builder, storybook-component-library, playwright-test-automation, vite-module-bundler, typescript-toolchain, vercel-nextjs-deployment, style-dictionary-system, nft-generative-art, smart-contract-tools, and agentic-flow-devkit.

**Tools (28):** tool-axe-core, tool-commander, tool-cssnano, tool-cypress, tool-docusaurus, tool-esbuild, tool-husky, tool-inquirer, tool-istanbul, tool-jest, tool-less, tool-markdown-it, tool-ora, tool-pa11y, tool-playwright, tool-postcss, tool-release-manager, tool-rollup, tool-sass, tool-storybook, tool-style-dictionary, tool-tailwindcss, tool-tsup, tool-typedoc, tool-vite, tool-vitepress, tool-vitest, and tool-webpack.

**Infrastructure (4 New Packages):** deploy-wizard (skill-deploy-wizard), mcp-orchestrator (skill-mcp-orchestrator), mvp-generator (skill-mvp-generator), and templates.

### Release Workflow

All releases use **GPG-signed commits and tags** for security:

```bash
# Local setup (one-time)
bash scripts/setup-gpg-signing.sh

# Or push to main for automatic workflow
git add .
git commit -m "feat: your changes"
git push origin main
```

**Full guide:** [docs/NPM_PUBLISHING.md](./docs/NPM_PUBLISHING.md)

---

## 💡 Use Cases

🎨 **Generative Art** — Create procedural artwork and visual effects  
🖼️ **Design Systems** — Build cohesive UI components and themes  
🛠️ **Development** — MCP builders, validators, and scaffolding  
📱 **Prototyping** — Rapid wireframing and layout design  
🎮 **Game Development** — Asset generation and design automation  
📝 **Content Creation** — Autonomous article, social post, and asset generation  
🤖 **AI Automation** — Multi-agent coordination with SyncPulse  

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

---

## 📄 License

Apache 2.0 — See [LICENSE](./LICENSE) for details

---

[![Version 1.0.5](https://img.shields.io/badge/version-1.0.5-blue)](./VERSION.json)
[![Released April 27, 2026](https://img.shields.io/badge/released-april%2027%2C%202026-brightgreen)](./docs/releases/RELEASE_NOTES.md)
[![Status: Stable](https://img.shields.io/badge/status-stable-brightgreen)](./CHANGELOG.md)
[![Maintained](https://img.shields.io/badge/maintained%3F-yes-brightgreen)](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP)
