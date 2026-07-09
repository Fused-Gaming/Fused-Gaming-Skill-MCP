# Official MCP Registry Publication Guide

**Status:** Ready for Publication ✅  
**Merged to Main:** 2026-07-09  
**PR #295:** Merged with all tests passing

---

## Official Publication Workflow

This guide follows the official Anthropic MCP Registry publication process from:
https://modelcontextprotocol.io/docs/publish/quickstart

### Step 1: Add Ownership Verification to package.json

Add `mcpName` to the root `package.json` file. This must follow GitHub-based namespace format:

```bash
# Edit package.json
nano package.json
```

Add/update the `mcpName` field:

```json
{
  "name": "@h4shed/mcp",
  "version": "1.3.0",
  "mcpName": "io.github.fused-gaming/mcp",
  "description": "Complete ecosystem: 31 AI skills + 28 developer tools",
  ...
}
```

The format is: `io.github.your-username/server-name`

### Step 2: Publish Package to npm

First, ensure the package builds and is ready:

```bash
# Navigate to repo
cd fused-gaming-skill-mcp

# Install dependencies
npm install

# Build the package
npm run build

# Verify TypeScript and linting
npm run typecheck
npm run lint

# Run tests
npm test
```

Then publish to npm:

```bash
# Authenticate with npm (if needed)
npm adduser

# Publish the package
npm publish --access public
```

Verify publication at: https://www.npmjs.com/package/@h4shed/mcp

### Step 3: Install mcp-publisher CLI

Install the official MCP Publisher tool:

**macOS/Linux:**
```bash
curl -L "https://github.com/modelcontextprotocol/registry/releases/latest/download/mcp-publisher_$(uname -s | tr '[:upper:]' '[:lower:]')_$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/').tar.gz" | tar xz mcp-publisher && sudo mv mcp-publisher /usr/local/bin/
```

**Windows:**
```powershell
$arch = if ([System.Runtime.InteropServices.RuntimeInformation]::ProcessArchitecture -eq "Arm64") { "arm64" } else { "amd64" }
Invoke-WebRequest -Uri "https://github.com/modelcontextprotocol/registry/releases/latest/download/mcp-publisher_windows_$arch.tar.gz" -OutFile "mcp-publisher.tar.gz"
tar xf mcp-publisher.tar.gz mcp-publisher.exe
# Move mcp-publisher.exe to a directory in your PATH
```

**Homebrew (macOS):**
```bash
brew install mcp-publisher
```

Verify installation:
```bash
mcp-publisher --help
```

### Step 4: Create server.json

Generate the server manifest file:

```bash
# From repo root
mcp-publisher init
```

This creates `server.json`. Edit it to match your configuration:

```json
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
  "name": "io.github.fused-gaming/mcp",
  "description": "Complete ecosystem: 31 AI skills + 28 developer tools for creative design, development, automation, and AI orchestration",
  "repository": {
    "url": "https://github.com/fused-gaming/fused-gaming-skill-mcp",
    "source": "github"
  },
  "version": "1.3.0",
  "packages": [
    {
      "registryType": "npm",
      "identifier": "@h4shed/mcp",
      "version": "1.3.0",
      "transport": {
        "type": "stdio"
      }
    }
  ]
}
```

**Important:** The `name` in `server.json` must match the `mcpName` in `package.json`.

### Step 5: Authenticate with MCP Registry

Authenticate using GitHub (recommended for this username format):

```bash
mcp-publisher login github
```

You'll be prompted to:
1. Visit: https://github.com/login/device
2. Enter the device code displayed in terminal
3. Authorize the MCP Publisher application
4. Return to terminal for confirmation

### Step 6: Publish to MCP Registry

Publish your server:

```bash
mcp-publisher publish
```

Expected output:
```
Publishing to https://registry.modelcontextprotocol.io...
✓ Successfully published
✓ Server io.github.fused-gaming/mcp version 1.3.0
```

### Step 7: Verify Publication

Verify your server appears in the registry:

```bash
# Query the registry API
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.fused-gaming/mcp"
```

Or visit the registry directly:
- URL: https://registry.modelcontextprotocol.io/
- Search for: "Fused Gaming MCP"

---

## Complete Checklist

### Pre-Publication ✅
- [x] Repository merged to main branch
- [x] All tests passing (Node 20.x, 22.x)
- [x] Security checks passing (CodeQL, Socket Security)
- [x] Vercel deployment successful
- [x] TypeScript compilation successful
- [x] Documentation complete
- [ ] Add `mcpName` to package.json
- [ ] Test npm package locally

### Publication
- [ ] Publish package to npm
- [ ] Install mcp-publisher CLI
- [ ] Create server.json
- [ ] Authenticate with GitHub
- [ ] Run mcp-publisher publish
- [ ] Verify listing on registry

### Post-Publication
- [ ] Update README with registry link
- [ ] Announce on GitHub Releases
- [ ] Social media announcement
- [ ] Update website/blog
- [ ] Notify community

---

## What's Being Published

### Server Metadata
- **Name:** io.github.fused-gaming/mcp
- **Package:** @h4shed/mcp
- **Version:** 1.3.0
- **Transport:** stdio (local process)
- **License:** Apache 2.0

### Skills (30 Total)
- Design & Styling (8)
- Development & Build (6)
- Automation & Testing (5)
- Content Creation (3)
- Blockchain & Web3 (2)
- AI Orchestration (3)
- Infrastructure (2)

### Tools (31+)
All tools include full JSON Schema validation

---

## Registry Features

Once published, users will be able to:

1. **Discover on Registry:**
   - Search for "Fused Gaming MCP"
   - View all 30 skills and 31+ tools
   - See tool definitions and documentation

2. **Integrate with Claude Desktop:**
   ```json
   {
     "mcpServers": {
       "fused-gaming-mcp": {
         "command": "npm",
         "args": ["exec", "@h4shed/mcp@latest"],
         "cwd": "/path/to/installation"
       }
     }
   }
   ```

3. **Use in Claude.ai (Coming Soon):**
   - Click "Add Plugin"
   - Search for "Fused Gaming MCP"
   - Select desired skills
   - Start using immediately

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Registry validation failed for package" | Ensure `mcpName` in package.json matches npm package name format |
| "Invalid or expired Registry JWT token" | Re-authenticate: `mcp-publisher login github` |
| "You do not have permission" | Ensure server name starts with `io.github.your-username/` |
| npm 404 error | Verify package was published to npm: `npm view @h4shed/mcp` |

---

## Next Steps

1. **Add mcpName to package.json** — Follow Step 1 above
2. **Publish to npm** — Follow Step 2 above
3. **Install mcp-publisher** — Follow Step 3 above
4. **Create server.json** — Follow Step 4 above
5. **Authenticate with GitHub** — Follow Step 5 above
6. **Publish to MCP Registry** — Follow Step 6 above
7. **Verify publication** — Follow Step 7 above

---

## References

- **Official MCP Registry:** https://registry.modelcontextprotocol.io/
- **Official Documentation:** https://modelcontextprotocol.io/docs/publish/quickstart
- **Publisher CLI:** https://github.com/modelcontextprotocol/registry
- **Our Repository:** https://github.com/fused-gaming/fused-gaming-skill-mcp

---

**The complete Fused Gaming MCP ecosystem is ready for official publication!** 🚀

