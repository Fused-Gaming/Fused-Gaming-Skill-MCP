# Swarm Script Guide

## Overview

The `npm run swarm` command initializes and manages the Fused Gaming Swarm Session for local development. This is a **development-only feature** that requires access to the `.claude-flow/` project configuration directory.

## When to Use

### ✅ Development (npm link or local checkout)
```bash
git clone https://github.com/fused-gaming/fused-gaming-skill-mcp.git
cd fused-gaming-skill-mcp
npm install
npm run swarm  # ✓ Works in development
```

### ❌ Published Package (npm install)
```bash
npm install @h4shed/mcp
npm run swarm  # ✗ Fails - .claude-flow/ not included in published package
```

## Why Development-Only?

1. **Project-Internal Configuration**: The `.claude-flow/` directory contains:
   - Agent store and configuration (`.claude-flow/agents/`)
   - Swarm runtime state (`.claude-flow/swarm/`)
   - Runtime capabilities (`.claude-flow/CAPABILITIES.md`)
   - These are development artifacts, not production features

2. **Session-Local State**: Swarm state is meant for local development workflows where agents coordinate tasks across branches and packages

3. **Not a Production Feature**: The published `@h4shed/mcp` package exports skills and MCP server components, not swarm orchestration

## How It Works

### State Validation & Recreation

The swarm initialization script now:

1. **Checks for `.claude-flow/` directory** - Detects if running in development mode
2. **Validates existing state** - Checks `.claude-flow/swarm/swarm-state.json` for:
   - Valid JSON structure
   - Required swarm properties (topology, status)
   - Non-empty swarm configuration
3. **Recreates if invalid** - If state is missing, corrupted, or invalid:
   - Generates new swarm ID with timestamp
   - Creates fresh state with hierarchical-mesh topology
   - Writes to `.claude-flow/swarm/` directory

### Error Handling

If running in published package context:

```
❌ Error: Swarm initialization is only available in development mode.
   The "npm run swarm" command requires .claude-flow/ directory.
   This feature is not available in published packages.

ℹ️  To use swarm features:
   1. Clone the repository: git clone https://github.com/fused-gaming/fused-gaming-skill-mcp.git
   2. Install dependencies: npm install
   3. Run swarm: npm run swarm
```

## Session Initialization Flow

When Claude Code starts a session:

```
1. SessionStart hook triggered
2. Runs: node .claude/helpers/hook-handler.cjs swarm-init
3. Executes: npm run swarm
4. Script checks: .claude-flow/ exists?
   - YES → Validate/recreate state → Initialize agents → Ready
   - NO  → Print dev-only error → Exit gracefully (1)
```

## Development Usage

### Initialize Swarm Session
```bash
npm run swarm
```

Output shows:
- Configuration files being loaded
- Agents loaded and health status
- Swarm topology and configuration
- Session metrics and next steps

### Manual State Reset (if needed)
```bash
rm -rf .claude-flow/swarm/swarm-state.json
npm run swarm  # Recreates fresh state
```

### Check Agent Status
```bash
npm run swarm  # Shows real-time agent health (100% in dev)
```

## Files & Directories

### Required for Development
- `scripts/swarm-init.js` - Initialization script
- `.claude-flow/config.yaml` - Runtime configuration  
- `.claude-flow/agents/store.json` - Agent definitions
- `.claude-flow/swarm/swarm-state.json` - Runtime state

### NOT Included in Published Package
- `scripts/` directory
- `.claude-flow/` directory  
- `.claude/` helpers

This is intentional - the published package provides MCP skills, not swarm orchestration.

## Design Rationale

### State Validation (PR #190, Issue 1)
- **Before**: Script trusted checked-in state without validation
- **After**: Validates structure and recreates if needed
- **Benefit**: Fresh, valid swarm on each session even if state file is stale

### Published Package Handling (PR #190, Issue 2)  
- **Before**: Script in package.json but assets not in `files` list → confusing failure
- **After**: Development check with helpful error message
- **Benefit**: Clear guidance for users, no mysterious npm errors

## Troubleshooting

### "Swarm initialization is only available in development mode"
**Cause**: Running in published `@h4shed/mcp` package  
**Solution**: Clone repository and run locally

### Swarm shows stale agent state
**Cause**: Cached `.claude-flow/swarm/swarm-state.json` from previous session  
**Solution**: Script validates and recreates automatically on next `npm run swarm`

### Agents still show wrong branch
**Cause**: `.claude-flow/agents/store.json` may be outdated  
**Solution**: Update agent configurations in store.json or reset swarm state

## Future Enhancements

1. **Command-line options**: `npm run swarm -- --reset` to force state recreation
2. **Health checks**: Validate agent health as part of initialization
3. **Migration helpers**: Tools to update agent store when project structure changes
4. **Metrics export**: Save before/after benchmarks to release notes

## Related Documentation

- [PROJECT_STATUS_DASHBOARD.md](./PROJECT_STATUS_DASHBOARD.md) - Overall v1.2.0 status
- [v1.2.0-BENCHMARK_REPORT.json](./v1.2.0-BENCHMARK_REPORT.json) - Performance metrics
- [.claude/settings.json](../.claude/settings.json) - SessionStart hooks configuration
- [scripts/swarm-init.js](../scripts/swarm-init.js) - Implementation

---

**Document Status**: Complete  
**Last Updated**: 2026-05-17  
**Scope**: Development-only swarm initialization and state management
