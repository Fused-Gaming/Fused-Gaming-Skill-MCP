# @fused-gaming/mcp-cli

CLI tool for managing Fused Gaming MCP skills and configuration

## Installation

```bash
npm install @fused-gaming/mcp-cli
```

## Development

```bash
# from repository root
npm run build --workspace=packages/cli
npm run test --workspace=packages/cli
```

## Commands

```bash
fused-gaming-mcp init          # Generate config
fused-gaming-mcp list          # List skills
fused-gaming-mcp add <skill>   # Enable a skill
fused-gaming-mcp remove <skill> # Disable a skill
fused-gaming-mcp panel         # One-command SyncPulse panel launcher
fused-gaming-mcp syncpulse     # Alias of `panel`
```

## License

Apache-2.0
