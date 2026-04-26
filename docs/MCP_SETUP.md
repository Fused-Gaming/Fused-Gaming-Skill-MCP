# 🎮 Fused Gaming MCP Setup Guide

This guide explains the MCP core initialization system, skill registry, and installation workflows.

## Overview

The Fused Gaming MCP includes a comprehensive initialization and registry system that:

- ✅ **Automates MCP core setup** with `.mcp/` configuration
- ✅ **Discovers and catalogs all skills** automatically
- ✅ **Validates registry consistency** in CI/CD pipelines
- ✅ **Provides interactive installation** with Fused Gaming branding
- ✅ **Generates documentation** for all available tools

## Installation Methods

### 1. Interactive Installation (Recommended for new users)

```bash
npm run mcp:install
```

This launches an interactive terminal wizard that:
- 🎮 Shows the Fused Gaming banner
- 📋 Guides you through setup options
- 🔧 Initializes MCP core automatically
- 📦 Installs dependencies
- 🏗️ Builds packages
- 📊 Generates skill registry

**Features:**
- Choose from Full, Minimal, or Custom setup modes
- Select Development or Production environment
- Real-time progress tracking with spinners
- Detailed error messages and next steps

### 2. Manual Initialization

```bash
# Step 1: Install dependencies
npm install

# Step 2: Initialize MCP core
npm run mcp:init

# Step 3: Generate skill registry
npm run registry:generate

# Step 4: Build packages
npm run build

# Step 5: Start development
npm run dev
```

### 3. One-Command Setup

```bash
npm run mcp:init && npm run registry:generate && npm run build
```

## Configuration

### MCP Core Configuration (`.mcp/config.json`)

Generated automatically during initialization:

```json
{
  "version": "1.0.0",
  "server": {
    "name": "Fused Gaming MCP",
    "description": "Modular MCP server with scalable Claude skills",
    "version": "1.0.4",
    "environment": "development",
    "debug": false
  },
  "skills": {
    "enabled": [],
    "disabled": [],
    "auto_discover": true
  },
  "registry": {
    "auto_generate": true,
    "path": "./registry"
  },
  "logging": {
    "level": "info",
    "format": "json",
    "file": ".mcp/logs/mcp.log",
    "max_size": "10MB",
    "max_files": 5
  },
  "performance": {
    "cache_enabled": true,
    "cache_ttl": 3600,
    "max_workers": 4
  }
}
```

**Key Settings:**
- `auto_discover: true` - Automatically detect new skills
- `cache_enabled: true` - Enable runtime caching
- `debug: false` - Disable verbose logging in production

### Modifying Configuration

Edit `.mcp/config.json` to:
- Enable/disable specific skills
- Adjust logging levels
- Configure caching behavior
- Set performance parameters

## Skill Registry System

### What is the Registry?

The Fused Gaming MCP automatically catalogs all available skills and their tools in a machine-readable registry.

### Generating the Registry

```bash
# Generate or update the registry
npm run registry:generate

# Validate registry and code
npm run registry:validate

# View the registry in your terminal
npm run registry:view

# Open HTML registry in browser
open registry/registry.html
```

### Registry Files Generated

1. **`registry/skills.json`** - Machine-readable skill catalog
2. **`registry/skills.js`** - CommonJS module export
3. **`registry/skills.ts`** - TypeScript type definitions
4. **`registry/REGISTRY.md`** - Markdown documentation
5. **`registry/registry.html`** - Interactive HTML viewer

### Example Registry Structure

```json
{
  "version": "1.0.0",
  "timestamp": "2026-04-26T04:37:00.931Z",
  "totalSkills": 19,
  "totalTools": 22,
  "skills": [
    {
      "name": "algorithmic-art",
      "id": "algorithmic-art",
      "package": "@h4shed/skill-algorithmic-art",
      "description": "Generative art using p5.js",
      "version": "1.0.1",
      "category": "generative-art",
      "tools": [
        { "name": "flow_field", "file": "flow-field.ts" },
        { "name": "generate_art", "file": "generate-art.ts" }
      ],
      "enabled": true
    }
  ],
  "categories": {
    "design": 5,
    "generative-art": 1,
    ...
  }
}
```

## Directory Structure

```
.
├── .mcp/                           # MCP Core Configuration
│   ├── config.json                # Main configuration
│   ├── README.md                  # MCP documentation
│   ├── cache/                     # Runtime cache (git-ignored)
│   ├── logs/                      # Log files (git-ignored)
│   └── state/                     # Initialization state
│       └── init.state            # Init metadata
├── registry/                       # Skill Registry
│   ├── skills.json               # JSON registry
│   ├── skills.js                 # CommonJS module
│   ├── skills.ts                 # TypeScript definitions
│   ├── REGISTRY.md               # Markdown catalog
│   ├── registry.html             # Interactive viewer
│   ├── *.tmp                     # Temp files (git-ignored)
│   └── *.log                     # Log files (git-ignored)
├── packages/
│   ├── core/                     # MCP Core Server
│   ├── cli/                      # CLI Tool
│   ├── web/                      # Web Dashboard
│   └── skills/                   # Skill Packages
└── scripts/
    ├── init-mcp-core.sh         # Initialization script
    ├── generate-skill-registry.js # Registry generator
    ├── interactive-install.js    # Interactive installer
    └── ...other scripts
```

## Initialization Scripts

### 1. `init-mcp-core.sh` - Core Initialization

```bash
npm run mcp:init
```

**Performs:**
- ✅ Creates `.mcp/` directory structure
- ✅ Initializes `.mcp/config.json`
- ✅ Updates `.gitignore` for MCP files
- ✅ Creates `.gitkeep` files for git tracking
- ✅ Generates initialization state
- ✅ Validates installation
- ✅ Generates skill registry

**Output:**
```
✅ Initialized Directories
✅ Set Up .gitignore Files
✅ Created MCP Configuration
✅ Created MCP Documentation
✅ Created Initialization State
✅ Generated Skill Registry
✅ Installation validation passed!
```

### 2. `generate-skill-registry.js` - Registry Generator

```bash
npm run registry:generate
```

**Scans:**
- All skill packages in `packages/skills/`
- Tool files in `*/src/tools/*.ts`
- Package metadata in `*/package.json`

**Generates:**
- JSON registry for programmatic access
- CommonJS module for Node.js
- TypeScript definitions for IDE support
- Markdown documentation for reading
- Interactive HTML catalog

**Auto-detects Categories:**
- `design` - UI/UX design skills
- `generative-art` - Art generation skills
- `content-creation` - Content writing tools
- `project-management` - Project tools
- `development` - Development utilities
- And more based on skill descriptions

### 3. `interactive-install.js` - Interactive Installer

```bash
npm run mcp:install
```

**Features:**
- 🎮 Fused Gaming ASCII banner (via figlet)
- 📋 Interactive setup wizard with inquirer
- 🎨 Colorized output with chalk
- 📦 Box-styled messages with boxen
- 🔄 Real-time progress with ora spinners
- 🚀 Guided onboarding experience

**Wizard Steps:**
1. Select installation mode
2. Choose environment
3. Decide on registry generation
4. Confirm dependency installation
5. Execute setup steps
6. Validate installation
7. Show next steps

## CI/CD Integration

### Registry Validation Workflow

GitHub Actions workflow: `.github/workflows/validate-registry.yml`

**Runs on:**
- Push to `main` or `claude/**` branches
- Pull requests to `main`
- Manual trigger (`workflow_dispatch`)

**Validates:**
- ✅ Registry structure and JSON validity
- ✅ Skill consistency between registry and disk
- ✅ Registry completeness (no missing skills)
- ✅ Tool discovery and cataloging
- ✅ Package metadata accuracy

**Comments on PR failures** with guidance:
```
❌ Registry Validation Failed

Please ensure:
1. All skill packages are properly registered
2. All tools are discoverable
3. Registry is generated with: npm run registry:generate
4. No duplicate or invalid package names exist
```

**Generates artifacts:**
- `skill-registry` - All registry files (30-day retention)

## Git Workflow

### .gitignore Configuration

The MCP system automatically updates `.gitignore` to exclude:

```
# MCP Core Runtime & Cache
.mcp/cache/**       # Runtime cache files
.mcp/logs/**        # Log files
.mcp/state/**       # State snapshots (except init.state)
*.mcp-state        # State backup files

# MCP Tool Registry
registry/*.tmp     # Temporary files
registry/*.log     # Log files
```

### Tracked vs. Ignored

**Tracked (committed to git):**
- `.mcp/config.json` - Configuration
- `.mcp/README.md` - Documentation
- `registry/skills.json` - Registry snapshot
- `registry/REGISTRY.md` - Documentation

**Ignored (not committed):**
- `.mcp/cache/` - Runtime cache
- `.mcp/logs/` - Log files
- `.mcp/state/` - State files
- Registry temp files and logs

## Scripts Reference

### NPM Scripts

```bash
# MCP Commands
npm run mcp:init                    # Initialize MCP core
npm run mcp:install                # Run interactive installer

# Registry Commands
npm run registry:generate           # Generate/update registry
npm run registry:validate           # Validate registry + code
npm run registry:view               # View registry in terminal

# Development
npm run build                       # Build all packages
npm run dev                         # Start dev server
npm run lint                        # Check code quality
npm run typecheck                   # Type checking
npm run test                        # Run tests
```

## Troubleshooting

### Issue: "Registry validation failed"

**Solution:**
```bash
npm run registry:generate
npm run registry:validate
```

### Issue: "Skills not discovered"

**Solution:**
1. Ensure skill is in `packages/skills/*/package.json`
2. Ensure tools are in `*/src/tools/*.ts`
3. Run: `npm run registry:generate`

### Issue: ".mcp directory already exists"

**Solution:**
- The init script detects existing directories
- Edit `.mcp/config.json` manually if needed
- Run `npm run registry:generate` to refresh

### Issue: "Interactive installer not starting"

**Solution:**
1. Ensure Node.js >= 20.0.0
2. Ensure npm >= 8.0.0
3. Check dependencies: `npm install`
4. Run: `npm run mcp:install`

## Best Practices

### 1. Keep Registry Updated

After adding new skills or tools:

```bash
npm run registry:generate
npm run registry:validate
```

### 2. Monitor CI/CD Checks

The registry validator checks every PR for:
- Consistency between disk and registry
- Proper tool discovery
- Valid JSON structure

### 3. Document Your Skills

Ensure each skill has:
- Clear package name (matching tools)
- Descriptive `package.json` description
- Tools with clear names
- Category detection metadata

### 4. Version Control

- Commit: `.mcp/config.json`
- Commit: `registry/skills.json`
- Commit: `registry/REGISTRY.md`
- Ignore: `.mcp/cache/`, `.mcp/logs/`, etc.

## Advanced Configuration

### Custom Categories

Edit `scripts/generate-skill-registry.js`:

```javascript
function detectCategory(skillId, description) {
  if (/* custom logic */) return 'custom-category';
  // ... existing logic
}
```

### Custom Logging

Edit `.mcp/config.json`:

```json
{
  "logging": {
    "level": "debug",        // info, debug, warn, error
    "format": "json",        // json or text
    "file": ".mcp/logs/mcp.log",
    "max_size": "10MB",
    "max_files": 5
  }
}
```

### Performance Tuning

```json
{
  "performance": {
    "cache_enabled": true,
    "cache_ttl": 7200,       // Seconds
    "max_workers": 8         // Concurrent tasks
  }
}
```

## Support & Documentation

- 📚 [Main README](../README.md)
- 📖 [Skill Registry](../registry/REGISTRY.md)
- 🔧 [API Reference](./API_REFERENCE.md)
- 🏗️ [Architecture Guide](./ARCHITECTURE.md)
- 🆘 [Troubleshooting](./ARCHITECTURE.md#troubleshooting)

## Next Steps

1. Run the interactive installer: `npm run mcp:install`
2. Review your configuration: `cat .mcp/config.json`
3. View available skills: `npm run registry:view`
4. Start developing: `npm run dev`
5. Read the main [README.md](../README.md)

---

**Happy building with Fused Gaming MCP!** 🎮✨
