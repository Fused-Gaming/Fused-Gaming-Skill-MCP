# 🎮 Fused Gaming MCP

<div align="center">

![Fused Gaming MCP Social Preview](.github/assets/social-preview.png)

</div>

---

## 📊 Status & Technology

[![npm version](https://img.shields.io/npm/v/@fused-gaming/mcp)](https://www.npmjs.com/package/@fused-gaming/mcp)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](./LICENSE)
[![Build](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/workflows/test/badge.svg)](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/actions)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.3.2-blue)](https://www.typescriptlang.org/)
[![npm](https://img.shields.io/badge/npm-%3E%3D8.0.0-red)](https://www.npmjs.com/)

---

## 🚀 The Ultimate AI-Powered Skill Ecosystem

**Fused Gaming MCP** is a modular, production-ready Model Context Protocol server packed with **8 powerful skills** for creative professionals, developers, and AI enthusiasts.

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

**All skills are production-ready and actively maintained** ✨

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
# Core + default skills
npm install @fused-gaming/mcp

# Or pick your skills
npm install @fused-gaming/mcp \
  @fused-gaming/skill-algorithmic-art \
  @fused-gaming/skill-theme-factory
```

### Initialize & Run

```bash
# Generate configuration
npx fused-gaming-mcp init

# Add more skills anytime
npx fused-gaming-mcp add frontend-design
npx fused-gaming-mcp add pre-deploy-validator

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
| [QUICKSTART.md](./QUICKSTART.md) | Get started in minutes |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design & internals |
| [SKILLS_GUIDE.md](./docs/SKILLS_GUIDE.md) | Build custom skills |
| [API_REFERENCE.md](./docs/API_REFERENCE.md) | Complete API docs |
| [EXAMPLES.md](./docs/EXAMPLES.md) | Real-world usage patterns |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute |

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

## 🎉 Footer

[![Version 1.0.0](https://img.shields.io/badge/version-1.0.0-blue)](./VERSION.json)
[![Released April 2, 2026](https://img.shields.io/badge/released-april%202%2C%202026-brightgreen)](./RELEASE_NOTES.md)
[![Status: Stable](https://img.shields.io/badge/status-stable-brightgreen)](./CHANGELOG.md)
[![Maintained](https://img.shields.io/badge/maintained%3F-yes-brightgreen)](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP)

<div align="center">

### Ready to Level Up?

**[Get Started](./QUICKSTART.md)** • **[View Docs](./docs/)** • **[See Examples](./docs/EXAMPLES.md)**

**Built with ❤️ by [Fused Gaming](https://fused-gaming.io)**

[GitHub](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP) • [NPM](https://www.npmjs.com/package/@fused-gaming/mcp) • [Support](mailto:support@fused-gaming.io)

</div>
