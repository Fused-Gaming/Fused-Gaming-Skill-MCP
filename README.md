# 

<div align="center"> 

# 📊 FUSED GAMING MCP
![SyncPulse Agent Swarms - Production Ready](.github/assets/syncpulse-hero.png)

<img width="1672" height="941" alt="image" src="https://github.com/user-attachments/assets/0b5dc2bb-4f0d-45f5-8632-8e89de49571b" />
</div>

<div align="center"> 

[![Version](https://img.shields.io/badge/version-v1.1.5-blue)](./CHANGELOG.md) [![npm scope](https://img.shields.io/badge/npm-scope%20%40h4shed-red)](https://www.npmjs.com/~h4shed) [![License](https://img.shields.io/badge/license-PPL%203.0.0%20%2B%20Commercial-brightgreen)](./LICENSE) [![Publish to npm](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/actions/workflows/publish.yml/badge.svg?branch=main)](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/actions/workflows/publish.yml) [![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/typescript-5.3.2-blue)](https://www.typescriptlang.org/) [![npm](https://img.shields.io/badge/npm-%3E%3D8.0.0-red)](https://www.npmjs.com/)

</div>

---

## Overview

**Fused Gaming MCP** is a comprehensive, production-ready Model Context Protocol server featuring **31 reusable AI skills**, **28 specialized tools**, and enterprise-grade multi-agent orchestration. Build AI-powered workflows for design, content, development, and automation.

- **🎨 31 AI Skills** — Design systems, generative art, content creation, project management, and more
- **🛠️ 28 Specialized Tools** — Build tools, testing, CSS, documentation, and automation
- **🤖 SyncPulse Orchestration** — Enterprise multi-agent coordination with 9 email workflows
- **📦 Production Ready** — TypeScript, npm-published, 12 published packages with continuous benchmarking

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/fused-gaming/fused-gaming-skill-mcp.git
cd fused-gaming-skill-mcp
npm install
npm run build
```

### 2. Use with Claude Desktop

Update `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "fused-gaming-mcp": {
      "command": "npm",
      "args": ["run", "dev"],
      "cwd": "/path/to/fused-gaming-skill-mcp",
      "alwaysAllow": ["tools/all"]
    }
  }
}
```

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`  
**Linux:** `~/.config/Claude/claude_desktop_config.json`

### 3. Install Published Packages Only

```bash
npm install @h4shed/mcp-core @h4shed/skill-theme-factory @h4shed/skill-underworld-writer
```

---

## 📚 Documentation Hub

The repository is organized into focused documentation categories for easier navigation:

| Section | Purpose | Location |
|---------|---------|----------|
| **Getting Started** | Installation, quick-start guides, beginner tutorials | [docs/getting-started/](./docs/getting-started/) |
| **Architecture & Design** | System design, MCP internals, design patterns | [docs/architecture/](./docs/architecture/) |
| **Design Systems** | UI components, themes, design tokens | [docs/design/](./docs/design/) |
| **Reference** | API docs, tool inventory, benchmarks | [docs/reference/](./docs/reference/) |

### Essential Resources

- **[PLUGIN_GUIDE.md](./docs/PLUGIN_GUIDE.md)** — Complete 30-skill inventory with learning paths
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — How to contribute and development setup
- **[CHANGELOG.md](./CHANGELOG.md)** — Release history and version tracking
- **[VERSION.json](./VERSION.json)** — Authoritative release metadata

---

## 🎨 Skills Overview (31 Total)

Organized by category. Each skill includes a full README in its package directory.

| Category | Count | Skills |
|----------|-------|--------|
| 🎨 Design & Styling | 8 | Canvas, Frontend, Theme Factory, SVG, TailwindCSS, Style Dictionary, Agentic Flow, UX Journey Mapper |
| 🎭 Generative Art | 3 | Algorithmic Art, NFT Art, Smart Contracts |
| 🛠️ Build Tools | 4 | TypeScript Toolchain, Vite Bundler, Mermaid Terminal, Vercel NextJS |
| 🧪 Testing & Validation | 2 | Playwright Testing, Pre-Deploy Validator |
| 📚 Components & Docs | 2 | Storybook, ASCII Mockup |
| 🔧 MCP Scaffolding | 2 | MCP Builder, Skill Creator |
| 📝 Content Creation | 2 | LinkedIn Master, Underworld Writer |
| 🤖 Orchestration | 2 | SyncPulse, SyncPulse Hub |
| 📊 Project Management | 3 | Project Manager, Skill Manager, Status Tool |
| 🎯 Productivity | 2 | Daily Review, Session Tracking |

**[View Complete Skill Inventory →](./docs/PLUGIN_GUIDE.md)**

---

## 🛠️ Tools Overview (28 Total)

Comprehensive tooling ecosystem for bundlers, testing, styling, docs, and automation.

| Category | Count | Tools |
|----------|-------|-------|
| 📦 Build & Bundling | 7 | esbuild, rollup, tsup, vite, vitepress, webpack, docusaurus |
| 🎨 Style & CSS | 6 | PostCSS, Sass, Less, CSSNano, TailwindCSS, Style Dictionary |
| 🧪 Testing & QA | 6 | Jest, Vitest, Cypress, Playwright, Pa11y, Axe Core |
| 📚 Documentation | 4 | Storybook, TypeDoc, Markdown-it, Husky |
| 🔧 CLI & Automation | 3 | Commander, Inquirer, Ora |
| 📊 Analysis & Reporting | 2 | Istanbul, Release Manager |

**[View Complete Tool Inventory →](./docs/PLUGIN_GUIDE.md)**

---

## ✨ Key Features

✔️ **Multi-Agent Orchestration** — SyncPulse with 9 templated email workflows  
✔️ **Security-First** — JWT authentication, role-based access control, signed releases  
✔️ **Design Systems** — Complete design tokens, theming, component libraries  
✔️ **Generative Capabilities** — Art, content, code, assets, and automation  
✔️ **Production Quality** — TypeScript strict mode, benchmarks, comprehensive testing  
✔️ **Developer Experience** — Clear documentation, quick-start paths, scaffolding tools  

---

## 💼 Licensing

| License | Use Case | Features |
|---------|----------|----------|
| **PPL 3.0.0** (Free) | Personal, open-source, educational | Community support |
| **Commercial** (Paid) | Business, SaaS, closed-source | Priority support, tiered pricing |

**[Full License Details →](./COMMERCIAL_LICENSE.md)**

---

## 📋 Essential Commands

```bash
# Setup
npm install                      # Install dependencies
npm run build                    # Build all packages
npm run dev                      # Start dev server

# Quality & Validation
npm run lint                     # Code quality checks
npm run typecheck                # TypeScript validation
npm run test                     # Run test suites

# Registry & Publishing
npm run registry:generate        # Generate skill registry
npm run registry:update          # Update and sync registry
npm run publish:prepare          # Prepare versions for publish
```

---

## 🐝 SyncPulse: Enterprise Orchestration

**SyncPulse (v0.2.2)** powers multi-agent coordination with:

- **100-500x** vector search speedup via hierarchical indexing
- **9 email workflows** for authentication, business, operations
- **Work-stealing load balancing** for heterogeneous swarms
- **LRU cache management** preventing OOM in 24h+ deployments

**SyncPulse Hub (v0.1.1)** adds:

- Real-time swarm monitoring dashboard
- Agent health metrics and performance analytics
- Task queue visualization and management

---

## 📦 What's Included

| Type | Count | Status |
|------|-------|--------|
| **Skills (Published)** | 12 | ✅ Available on npm |
| **Skills (Queued)** | 19 | 📦 Ready for publishing |
| **Tools** | 28 | 📦 Scaffolded, queued |
| **Core Packages** | 2 | ✅ Published |
| **Dev Packages** | 4 | 🚧 In progress |
| **Total** | 65 | — |

**[View Release Status →](./CHANGELOG.md)**

---

## 🎯 Use Cases

- 🎨 **Design Systems** — Build cohesive UI components and themes
- 🖼️ **Generative Art** — Create procedural artwork and NFTs
- 🛠️ **Development** — MCP builders, validators, bundlers, and scaffolding
- 📱 **Prototyping** — Rapid wireframing and component design
- 📝 **Content Creation** — Autonomous articles, posts, and assets
- 🤖 **AI Automation** — Multi-agent workflows and orchestration
- 🎮 **Game Development** — Asset generation and design automation

---

## 🔗 Dual Naming Convention

- **Internal Git Names:** `@fused-gaming/skill-*` or `@fused-gaming/tool-*`
- **Published NPM Names:** `@h4shed/skill-*` or `@h4shed/tool-*`

This separation allows flexible internal development while maintaining a consistent, branded public presence on npm.

---

## 📊 Performance & Quality

Every package undergoes continuous benchmarking:

- ✅ **Behavioral Testing** (40% weight) — 90%+ pass rate required
- ✅ **Performance Testing** (35% weight) — Latency/throughput validation
- ✅ **Code Quality** (25% weight) — Complexity, coverage, maintainability

**Combined Precision Score:** ≥90% required for release

**[View Benchmarks →](./docs/BENCHMARK_RELEASES.md)**

---

## 🌍 Community & Support

- 📖 **Documentation** — Start with [docs/getting-started/](./docs/getting-started/)
- 💬 **Discussions** — [GitHub Discussions](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/discussions)
- 🐛 **Issues** — [GitHub Issues](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/issues)
- 📧 **Contact** — [support@vln.gg](mailto:support@vln.gg)

---

## 📄 License

**Prosperity Public License 3.0.0** (Free) + **Commercial License** (Paid)

See [LICENSE](./LICENSE) and [COMMERCIAL_LICENSE.md](./COMMERCIAL_LICENSE.md) for details.

---

<div align="center">

**Built with ❤️ by Fused Gaming**

[![GitHub](https://img.shields.io/badge/GitHub-Fused--Gaming-181717?logo=github)](https://github.com/Fused-Gaming) · [![npm](https://img.shields.io/badge/npm-@h4shed-CB3837?logo=npm)](https://www.npmjs.com/~h4shed)

</div>
