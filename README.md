# Fused Gaming MCP

[![npm version](https://img.shields.io/npm/v/@fused-gaming/mcp)](https://www.npmjs.com/package/@fused-gaming/mcp)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](./LICENSE)
[![Build](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/workflows/test/badge.svg)](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/actions)

Modular, scalable MCP server with curated Claude skills for creative & technical tasks.

## Features

🎨 **13+ Curated Skills** — Algorithmic art, UI design, MCP builders, and more
📦 **Modular Design** — Install only what you need
🔄 **Auto-Loading** — Npm workspaces handle versioning automatically
🔐 **Private Customization** — Add internal skills without publishing
🚀 **Production-Ready** — Used by Fused Gaming + VLN Security

## Installation

```bash
# Install core + default skills
npm install @fused-gaming/mcp

# Or: install core + pick skills
npm install @fused-gaming/mcp \
  @fused-gaming/skill-algorithmic-art \
  @fused-gaming/skill-mcp-builder
```

## Quick Start

```bash
# Generate config
npx fused-gaming-mcp init

# Enable additional skills
npx fused-gaming-mcp add frontend-design
npx fused-gaming-mcp add theme-factory

# Start MCP server
npm run dev
```

## Skills

| Skill | Description | Status |
|-------|-------------|--------|
| **algorithmic-art** | Generative art using p5.js | ✅ |
| **ascii-mockup** | Mobile-first wireframes | ✅ |
| **canvas-design** | Visual design with SVG | ✅ |
| **frontend-design** | Component design & HTML/CSS | ✅ |
| **theme-factory** | Design system generation | ✅ |
| **mcp-builder** | MCP server scaffolding | ✅ |
| **pre-deploy-validator** | Deployment validation | ✅ |
| **skill-creator** | Custom skill builder | ✅ |

## Architecture

```
fused-gaming-mcp/
├── packages/core/           # Core MCP server + skill loader
├── packages/cli/            # CLI for config management
├── packages/skills/         # Individual modular skills
│   ├── algorithmic-art/
│   ├── ascii-mockup/
│   ├── canvas-design/
│   └── ... (8 total)
└── docs/                    # Documentation
```

**See [ARCHITECTURE.md](./docs/ARCHITECTURE.md)** for detailed system design.

## CLI Commands

```bash
# Initialize config
fused-gaming-mcp init

# List available skills
fused-gaming-mcp list

# Enable a skill
fused-gaming-mcp add <skill-name>

# Disable a skill
fused-gaming-mcp remove <skill-name>
```

## Configuration

Edit `.fused-gaming-mcp.json` to customize:

```json
{
  "skills": {
    "enabled": ["algorithmic-art", "mcp-builder", "theme-factory"],
    "disabled": ["internal-comms"]
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

## Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run linter
npm run lint

# Run type checker
npm run typecheck

# Start development server
npm run dev
```

## Documentation

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — System design & internals
- **[SKILLS_GUIDE.md](./docs/SKILLS_GUIDE.md)** — Creating new skills
- **[API_REFERENCE.md](./docs/API_REFERENCE.md)** — Complete API docs
- **[EXAMPLES.md](./docs/EXAMPLES.md)** — Real-world usage examples
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — How to contribute

## Use Cases

🎨 **Generative Art** — Create algorithmic artwork  
🖼️ **UI Design** — Design systems, components, mockups  
🛠️ **Development** — MCP builders, validators, skill creators  
📱 **Prototyping** — Rapid wireframing and layout design  

## Community

- 🐛 [Report Issues](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/issues)
- 💡 [Request Skills](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/discussions)
- 🤝 [Contribute](./CONTRIBUTING.md)

## License

Apache 2.0 — See [LICENSE](./LICENSE) for details

---

**Built with ❤️ by [Fused Gaming](https://fused-gaming.io)**
