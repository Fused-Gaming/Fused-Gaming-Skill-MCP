# 🎮 Fused Gaming MCP
## The Ultimate AI-Powered Skill Ecosystem for Claude

[![npm version](https://img.shields.io/npm/v/@fused-gaming/mcp)](https://www.npmjs.com/package/@fused-gaming/mcp)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](./LICENSE)
[![Build](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/workflows/test/badge.svg)](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/actions)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)

---

## 🚀 Welcome to the Future of Creative AI

Transform your Claude workflow with **13+ meticulously crafted skills** designed for creative professionals, developers, and innovators. Whether you're designing cutting-edge interfaces, generating algorithmic art, or building scalable applications, Fused Gaming MCP empowers you to do more with less.

**Trusted by:** Fused Gaming • VLN Security • Design Studios • AI Development Teams

---

## ✨ Features That Empower

| Feature | Description |
|---------|-------------|
| 🎨 **13+ Curated Skills** | Algorithmic art, UI design, theme generation, MCP builders, validators, and more |
| 📦 **Modular by Design** | Install only what you need—zero bloat, maximum flexibility |
| ⚡ **Production-Ready** | Battle-tested in real-world applications at scale |
| 🔄 **Smart Auto-Loading** | NPM workspaces handle versioning automatically |
| 🔐 **Private Customization** | Add proprietary skills without publishing to npm |
| 🌱 **Growing Ecosystem** | Community-driven development, easy skill creation |

---

## 🎯 Skills Showcase

Your creative arsenal includes:

| Skill | What It Does | Status |
|-------|--------------|--------|
| **algorithmic-art** | Generate stunning procedural art using p5.js | ✅ |
| **ascii-mockup** | Rapid mobile-first wireframes in ASCII | ✅ |
| **canvas-design** | Vector-based visual design with SVG | ✅ |
| **frontend-design** | Component design with production-ready HTML/CSS | ✅ |
| **theme-factory** | Auto-generate cohesive design systems | ✅ |
| **mcp-builder** | Scaffold custom MCP servers in seconds | ✅ |
| **pre-deploy-validator** | Validate before deployment | ✅ |
| **skill-creator** | Create custom skills without boilerplate | ✅ |

**...and more coming soon!**

---

## 🎬 Quick Start (2 Minutes)

### Installation

```bash
# Install core + default skills
npm install @fused-gaming/mcp

# Or: install core + pick specific skills
npm install @fused-gaming/mcp \
  @fused-gaming/skill-algorithmic-art \
  @fused-gaming/skill-mcp-builder \
  @fused-gaming/skill-theme-factory
```

### Launch

```bash
# Initialize your configuration
npx fused-gaming-mcp init

# Add more skills on demand
npx fused-gaming-mcp add frontend-design
npx fused-gaming-mcp add pre-deploy-validator

# Start developing
npm run dev
```

That's it! You're now ready to empower your Claude instance with superpowers. 🔋

---

## 🛠️ CLI Commands at Your Fingertips

```bash
# Initialize config from scratch
fused-gaming-mcp init

# List all available skills
fused-gaming-mcp list

# Activate a skill
fused-gaming-mcp add <skill-name>

# Deactivate a skill
fused-gaming-mcp remove <skill-name>

# View current configuration
fused-gaming-mcp config
```

---

## ⚙️ Configuration Magic

Customize everything via `.fused-gaming-mcp.json`:

```json
{
  "skills": {
    "enabled": [
      "algorithmic-art",
      "mcp-builder",
      "theme-factory",
      "frontend-design"
    ],
    "disabled": []
  },
  "auth": {
    "apiKeys": {
      "openai": "sk-...",
      "internal": "..."
    }
  },
  "logging": {
    "level": "info"
  }
}
```

---

## 🏗️ Architecture Overview

```
fused-gaming-mcp/
├── packages/
│   ├── core/              ⚙️  Core MCP server + skill orchestration
│   ├── cli/               🖥️  Command-line interface
│   └── skills/            🎨  Individual modular skills
│       ├── algorithmic-art/
│       ├── ascii-mockup/
│       ├── canvas-design/
│       ├── frontend-design/
│       ├── theme-factory/
│       ├── mcp-builder/
│       ├── pre-deploy-validator/
│       └── skill-creator/
├── docs/                  📚  Full documentation
└── .fused-gaming-mcp.json ⚙️  Configuration file
```

**Want the deep dive?** → See [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

## 👨‍💻 Development Workflow

Get up and running in your own environment:

```bash
# Clone and install
git clone https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP.git
cd Fused-Gaming-Skill-MCP
npm install

# Development tasks
npm run build       # 🏗️  Build all packages
npm run test        # ✅ Run test suites
npm run lint        # 🧹 Code quality checks
npm run typecheck   # 🔍 TypeScript validation
npm run dev         # 🚀 Start dev server

# Production
npm run prerelease  # 📦 Build + typecheck + lint
npm publish:packages # 🌐 Publish to npm
```

---

## 📚 Documentation & Guides

| Resource | What You'll Learn |
|----------|-------------------|
| **[QUICKSTART.md](./QUICKSTART.md)** | Get up to speed in minutes |
| **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | System design, internals, and extensibility |
| **[SKILLS_GUIDE.md](./docs/SKILLS_GUIDE.md)** | Create custom skills from scratch |
| **[API_REFERENCE.md](./docs/API_REFERENCE.md)** | Complete API documentation |
| **[EXAMPLES.md](./docs/EXAMPLES.md)** | Real-world usage patterns |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | Join the community effort |

---

## 💡 Use Cases

- 🎨 **Generative Art** — Create algorithmic artwork, visualizations, and interactive experiences
- 🖼️ **UI/UX Design** — Design systems, component libraries, responsive mockups
- 🛠️ **Development** — MCP builders, deployment validators, skill scaffolding
- 📱 **Prototyping** — Rapid wireframing, layout design, iterative mockups
- 🎮 **Game Dev** — Asset generation, design system creation, rapid prototyping
- 🚀 **AI-Powered Workflows** — Automate creative and technical tasks with Claude

---

## 🌟 Why Choose Fused Gaming MCP?

✔️ **Battle-tested** in production at scale  
✔️ **Modular** — pay for what you use  
✔️ **Easy to extend** — create skills without friction  
✔️ **Community-driven** — your feedback shapes the future  
✔️ **Well-documented** — clear guides for every use case  
✔️ **Active maintenance** — regular updates and improvements  

---

## 🤝 Get Involved

We'd love to have you in the community!

- 🐛 **Found a bug?** [Open an issue](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/issues)
- 💡 **Have an idea?** [Start a discussion](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/discussions)
- 🤝 **Want to contribute?** [Read our contributing guide](./CONTRIBUTING.md)
- 📧 **Need support?** Reach out to [support@fused-gaming.io](mailto:support@fused-gaming.io)

---

## 🎁 System Requirements

```
Node.js ≥ 20.0.0
npm ≥ 8.0.0
```

---

## 📄 License

Apache 2.0 — Your freedom matters. See [LICENSE](./LICENSE) for full details.

---

<div align="center">

### 🎮 Ready to Level Up?

**[Get Started Now](./QUICKSTART.md)** • **[View Docs](./docs/)** • **[See Examples](./docs/EXAMPLES.md)**

---

**Built with ❤️ by the Fused Gaming Team**

[Website](https://fused-gaming.io) • [Email](mailto:info@fused-gaming.io) • [GitHub](https://github.com/Fused-Gaming)

</div>

---

## 📸 Adding the Fused Gaming Social Preview

To add the Fused Gaming social preview image to this repository for GitHub's social media cards:

### Step 1: Prepare Your Image
- Create or obtain the Fused Gaming preview image (recommended: 1200x630px, PNG/JPG format)
- The image should be eye-catching and represent the brand/product identity

### Step 2: Add to Repository
```bash
# Create an assets directory (if it doesn't exist)
mkdir -p .github/assets

# Place your image here:
# .github/assets/social-preview.png
```

### Step 3: Configure GitHub Repository Settings
1. Go to **Settings** → **General**
2. Scroll to **Social preview** section
3. Click **Upload an image**
4. Select `.github/assets/social-preview.png`
5. Click **Save changes**

### Image Specifications
- **Dimensions:** 1200×630px (optimal for social media)
- **Format:** PNG or JPG
- **File size:** < 1MB recommended
- **Content:** Logo, brand colors, and product highlights

Once configured, this preview will appear when the repository is shared on Twitter, LinkedIn, Discord, and other social platforms.

---
