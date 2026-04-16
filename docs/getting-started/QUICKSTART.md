# Quick Start Guide

Get started with Fused Gaming MCP in 5 minutes!

## Prerequisites

- **Node.js** 20.0.0 or higher ([install](https://nodejs.org/))
- **npm** 8.0.0 or higher (comes with Node.js)
- **Git** for version control

Check your versions:
```bash
node --version  # v20.0.0 or higher
npm --version   # 8.0.0 or higher
```

## Installation

### Option 1: Quick Install (Recommended for most users)

```bash
npm install @fused-gaming/mcp
```

This installs the core MCP server with commonly-used skills.

### Option 2: Full Monorepo Setup (For development)

```bash
# Clone the repository
git clone https://github.com/fused-gaming/fused-gaming-skill-mcp.git
cd fused-gaming-skill-mcp

# Install all dependencies
npm install

# Build all packages
npm run build
```

### Option 3: Selective Skills Installation

```bash
npm install @fused-gaming/mcp \
  @fused-gaming/skill-algorithmic-art \
  @fused-gaming/skill-frontend-design \
  @fused-gaming/skill-theme-factory
```

See [Available Skills](#available-skills) for the full list.

## Initial Setup

### 1. Initialize Configuration

```bash
npx fused-gaming-mcp init
```

This creates a `.fused-gaming-mcp.json` configuration file in your project root:

```json
{
  "skills": {
    "enabled": ["algorithmic-art", "mcp-builder", "theme-factory"],
    "disabled": []
  },
  "auth": {
    "apiKeys": {}
  },
  "logging": {
    "level": "info"
  }
}
```

### 2. Enable Additional Skills

```bash
# Add specific skills
npx fused-gaming-mcp add frontend-design
npx fused-gaming-mcp add theme-factory

# List all available skills
npx fused-gaming-mcp list

# Disable a skill (optional)
npx fused-gaming-mcp remove algorithmic-art
```

### 3. Start the Development Server

```bash
npm run dev
```

This starts the MCP server, making all enabled skills available.

## First Steps

### Use a Skill

Once the server is running, you can use any enabled skill:

```bash
# Example: Generate a theme using theme-factory
npx fused-gaming-mcp theme-factory --name "my-theme" --colors "primary:#0066ff,secondary:#ff6600"

# Example: Create ASCII mockup using ascii-mockup
npx fused-gaming-mcp ascii-mockup --layout "mobile" --title "My App"
```

### Check Configuration

View your current configuration:

```bash
cat .fused-gaming-mcp.json
```

Edit it manually:

```bash
# Use your favorite editor
nano .fused-gaming-mcp.json
# or
code .fused-gaming-mcp.json
```

## Available Skills

| Skill | Command | Description |
|-------|---------|-------------|
| **algorithmic-art** | `algorithmic-art` | Generate creative algorithmic visualizations |
| **ascii-mockup** | `ascii-mockup` | Create ASCII-based UI mockups |
| **canvas-design** | `canvas-design` | Generate SVG designs |
| **frontend-design** | `frontend-design` | Create React components |
| **theme-factory** | `theme-factory` | Generate design system themes |
| **mcp-builder** | `mcp-builder` | Scaffold new MCP servers |
| **pre-deploy-validator** | `pre-deploy-validator` | Validate deployments |
| **skill-creator** | `skill-creator` | Create new custom skills |

## Common Tasks

### Create a New Skill

```bash
npx fused-gaming-mcp skill-creator \
  --name "my-skill" \
  --description "My custom skill" \
  --type "utility"
```

This scaffolds a new skill in `packages/skills/my-skill/`.

### Build for Production

```bash
npm run build

# Build specific package
npm run build --workspace=packages/core
```

### Run Tests

```bash
npm test

# Run tests for specific skill
npm test --workspace=packages/skills/canvas-design
```

### Check TypeScript Types

```bash
npm run typecheck
```

### Lint Code

```bash
npm run lint

# Fix linting issues automatically
npm run lint -- --fix
```

## Directory Structure

```
fused-gaming-mcp/
├── packages/
│   ├── core/                    # Core MCP server
│   ├── cli/                     # CLI tools
│   └── skills/
│       ├── algorithmic-art/
│       ├── ascii-mockup/
│       ├── canvas-design/
│       ├── frontend-design/
│       ├── mcp-builder/
│       ├── pre-deploy-validator/
│       ├── skill-creator/
│       └── theme-factory/
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md
│   ├── SKILLS_GUIDE.md
│   ├── API_REFERENCE.md
│   └── EXAMPLES.md
├── package.json                 # Root workspace config
└── .fused-gaming-mcp.json      # MCP configuration
```

## Troubleshooting

### Installation Issues

**Problem**: `npm install` fails  
**Solution**: 
```bash
# Clear npm cache
npm cache clean --force

# Delete lock files and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Node version mismatch  
**Solution**: Use Node Version Manager (nvm)
```bash
# Install nvm: https://github.com/nvm-sh/nvm
nvm install 20
nvm use 20
```

### Build Issues

**Problem**: TypeScript compilation errors  
**Solution**:
```bash
npm run typecheck
# Fix errors shown, then rebuild
npm run build
```

**Problem**: Module not found  
**Solution**:
```bash
# Reinstall dependencies
npm install

# Rebuild workspaces
npm run build
```

### Configuration Issues

**Problem**: Skill not recognized  
**Solution**:
```bash
# Check enabled skills
npx fused-gaming-mcp list

# Re-enable the skill
npx fused-gaming-mcp add skill-name
```

## Next Steps

1. **Learn the Architecture**: Read [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
2. **Explore Examples**: Check [docs/EXAMPLES.md](./docs/EXAMPLES.md)
3. **Create a Custom Skill**: Follow [docs/SKILLS_GUIDE.md](./docs/SKILLS_GUIDE.md)
4. **Contribute**: See [CONTRIBUTING.md](./CONTRIBUTING.md)

## Getting Help

- 📖 [Full Documentation](./README.md)
- 🏗️ [Architecture Guide](./docs/ARCHITECTURE.md)
- 📚 [Skills Guide](./docs/SKILLS_GUIDE.md)
- 💬 [Discussions](https://github.com/fused-gaming/fused-gaming-skill-mcp/discussions)
- 🐛 [Report Issues](https://github.com/fused-gaming/fused-gaming-skill-mcp/issues)

## Tips & Tricks

### Speed Up Development

Use npm workspaces for faster development:

```bash
# Build only the package you're working on
npm run build --workspace=packages/skills/my-skill

# Watch for changes (with TypeScript)
npm run dev --workspace=packages/skills/my-skill
```

### Custom Configuration

Add custom settings to `.fused-gaming-mcp.json`:

```json
{
  "skills": {
    "enabled": ["frontend-design", "theme-factory"],
    "disabled": []
  },
  "auth": {
    "apiKeys": {
      "custom-api": "your-key-here"
    }
  },
  "logging": {
    "level": "debug",
    "file": "./logs/mcp.log"
  },
  "custom": {
    "myOption": "value"
  }
}
```

### Environment Variables

Set environment variables for configuration:

```bash
export FG_MCP_LOG_LEVEL=debug
export FG_MCP_CONFIG_PATH=./custom-config.json

npm run dev
```

---

**Ready to dive deeper?** Check out [docs/EXAMPLES.md](./docs/EXAMPLES.md) for real-world usage examples.
