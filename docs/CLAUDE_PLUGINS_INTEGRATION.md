# Fused Gaming MCP — Claude Plugins Integration Guide

## Overview

This guide explains how to integrate the **Fused Gaming MCP** with Claude plugins to access 50+ creative and development tools directly in Claude.

---

## What is the Fused Gaming MCP?

The **Model Context Protocol (MCP)** is Anthropic's standard for connecting external tools and data sources to Claude. The Fused Gaming MCP server provides:

- **50+ Claude skills** (tools) for creative design, development, and automation
- **Modular architecture** — enable only the skills you need
- **Production-ready** — battle-tested in real workflows

---

## Quick Start: Adding to Claude Plugins

### Prerequisites

- Claude.ai account
- Node.js 20+ installed locally
- Git (optional, but recommended)

### Step 1: Clone or Download the Repository

```bash
git clone https://github.com/fused-gaming/fused-gaming-skill-mcp.git
cd fused-gaming-skill-mcp
```

Or download the ZIP from GitHub and extract it.

### Step 2: Install Dependencies

```bash
npm install --package-lock-only --ignore-scripts
npm ci
npm run build
```

### Step 3: Add to Claude Desktop Client

#### Option A: Via `.mcp.json` Configuration (Recommended for Local Development)

1. Locate your Claude Desktop configuration:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. Open the config file and add:

```json
{
  "mcpServers": {
    "fused-gaming-mcp": {
      "command": "npm",
      "args": ["run", "dev"],
      "cwd": "/path/to/fused-gaming-skill-mcp",
      "env": {
        "CLAUDE_MCP_MODE": "plugin",
        "NODE_ENV": "production"
      },
      "alwaysAllow": ["tools/all"]
    }
  }
}
```

Replace `/path/to/fused-gaming-skill-mcp` with the actual path to the cloned repository.

3. Restart Claude Desktop

4. Open the MCP menu (or check the home sidebar) to verify the server is running

#### Option B: Via Claude.ai Web (Coming Soon)

Claude.ai will soon support adding MCP servers directly from the web interface:

1. Go to **Skills** → **Connect MCP Server**
2. Select **Fused Gaming MCP**
3. Choose which skills to enable
4. Click **Connect**

---

## Configuring Skills

### View Enabled Skills

The default configuration enables these skills:

- ✅ **Algorithmic Art** — Generate p5.js art
- ✅ **ASCII Mockup** — Create wireframes
- ✅ **Canvas Design** — Visual design output
- ✅ **Frontend Design** — UI component design
- ✅ **Theme Factory** — Color palette generation
- ✅ **MCP Builder** — Create MCP tools
- ✅ **Pre-Deploy Validator** — Deployment checks
- ✅ **Skill Creator** — Build new skills

### Enable Additional Skills

Edit `.fused-gaming-mcp.json`:

```json
{
  "skills": {
    "enabled": [
      "algorithmic-art",
      "ascii-mockup",
      "canvas-design",
      "web-artifacts-builder",    // Add this
      "webapp-testing",             // Add this
      "nft-generative-art"          // Add this
    ]
  }
}
```

Then restart Claude.

### Disable Skills

Move skill names from `enabled` to `disabled` array:

```json
{
  "skills": {
    "enabled": ["algorithmic-art", "ascii-mockup"],
    "disabled": ["canvas-design", "frontend-design"]
  }
}
```

---

## Available Skills

### Design Skills

| Skill | Description | Status |
|-------|-------------|--------|
| **Algorithmic Art** | Generative art, flow fields, particle systems | ✅ Stable |
| **ASCII Mockup** | Mobile wireframes in ASCII | ✅ Stable |
| **Canvas Design** | SVG/PNG visual design generation | ✅ Stable |
| **Frontend Design** | React component prototyping | ✅ Beta |
| **Theme Factory** | Design system color generation | ✅ Stable |
| **NFT Generative Art** | NFT metadata and art generation | ✅ Stable |

### Development Skills

| Skill | Description | Status |
|-------|-------------|--------|
| **MCP Builder** | Create MCP tools and servers | ✅ Stable |
| **Skill Creator** | Bootstrap new skills | ✅ Stable |
| **Playwright Test Automation** | Web testing framework | ✅ Stable |
| **Pre-Deploy Validator** | Application pre-deployment checks | ✅ Stable |

### Productivity Skills

| Skill | Description | Status |
|-------|-------------|--------|
| **Project Manager** | Task planning and coordination | ✅ Stable |
| **Daily Review Skill** | Daily reflection and planning | ✅ Stable |
| **LinkedIn Master Journalist** | Content creation and scheduling | ✅ Stable |
| **Doc Coauthoring** | Collaborative documentation | ✅ Beta |

---

## Using Skills in Claude

### Example 1: Generate Algorithmic Art

```
User: Generate a flow field art piece with 800x600 dimensions and seed 42

Claude will:
1. Call the algorithmic-art skill
2. Use the generate-flow-field tool
3. Return SVG/PNG output
4. Display the visualization
```

### Example 2: Create a Mobile Mockup

```
User: Create an ASCII mockup for a mobile e-commerce app with header, product grid, and footer

Claude will:
1. Call the ascii-mockup skill
2. Use the generate-mockup tool
3. Return formatted ASCII art
4. You can copy and iterate
```

### Example 3: Deploy Validation

```
User: Validate my Next.js app for production deployment

Claude will:
1. Analyze the project structure
2. Run pre-deploy-validator checks
3. Report issues and recommendations
4. Provide deployment readiness score
```

---

## Troubleshooting

### Error: "No manifest or registry for tools/plugins"

**Cause**: The `claude.json` manifest file is missing or misconfigured.

**Solution**:
1. Ensure `claude.json` exists in the repository root
2. Verify the file is properly formatted (valid JSON)
3. Check that the `.mcp.json` configuration points to the correct directory
4. Restart Claude

### Error: "Failed to load skill: [skill-name]"

**Cause**: The skill package is not installed or not built.

**Solution**:
```bash
npm run build
npm install --package-lock-only --ignore-scripts
npm ci
```

### MCP Server Doesn't Connect

**Cause**: Configuration path is incorrect or Node.js isn't available.

**Solution**:
1. Verify the `cwd` path in `.mcp.json` is absolute and correct
2. Ensure Node.js 20+ is installed: `node --version`
3. Test locally: `cd /path/to/repo && npm run dev`
4. Check logs in Claude Desktop's developer console

### Skill Tools Not Showing in Claude

**Cause**: Skill is disabled in configuration.

**Solution**:
1. Edit `.fused-gaming-mcp.json`
2. Move skill from `disabled` to `enabled` array
3. Restart Claude
4. Reconnect to MCP server

---

## Advanced Configuration

### Custom Environment Variables

Edit `.mcp.json`:

```json
{
  "mcpServers": {
    "fused-gaming-mcp": {
      "command": "npm",
      "args": ["run", "dev"],
      "cwd": "/path/to/repo",
      "env": {
        "FUSED_GAMING_LOG_LEVEL": "debug",
        "API_KEY_CUSTOM": "your-api-key-here"
      }
    }
  }
}
```

### Running in Production Mode

For production usage (not recommended unless you know what you're doing):

```json
{
  "mcpServers": {
    "fused-gaming-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "@h4shed/mcp@latest",
        "start"
      ],
      "env": {
        "NODE_ENV": "production",
        "CLAUDE_MCP_MODE": "production"
      }
    }
  }
}
```

### Debugging

Enable debug logs:

```bash
FUSED_GAMING_DEBUG=true npm run dev
```

Check the Claude Desktop console for detailed logs.

---

## Contributing

Want to add a new skill or tool? See [CONTRIBUTING.md](../CONTRIBUTING.md).

## Support

- **GitHub Issues**: [Report bugs](https://github.com/fused-gaming/fused-gaming-skill-mcp/issues)
- **Documentation**: [Full API Reference](./ARCHITECTURE.md)
- **Community**: [Discussions](https://github.com/fused-gaming/fused-gaming-skill-mcp/discussions)

---

## License

Apache 2.0 — See [LICENSE](../LICENSE) for details.
