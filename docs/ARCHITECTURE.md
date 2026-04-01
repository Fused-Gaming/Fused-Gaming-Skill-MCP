# Fused Gaming MCP Architecture

## System Overview

Fused Gaming MCP is a **modular, scalable MCP server** built on npm workspaces with a plugin-based skill system.

```
Claude ──→ MCP Protocol ──→ Stdio Server ──→ Skill Registry ──→ Skills
                                    ↓
                            Config Loader
                            (.fused-gaming-mcp.json)
```

## Core Components

### 1. MCP Server (`packages/core/src/server.ts`)

The main MCP server that:
- Listens on stdio transport
- Initializes skill registry
- Registers skill tools with the MCP protocol
- Handles tool invocations

```typescript
class FusedGamingMCPServer {
  initialize()    // Load config & skills
  registerSkillTools(skill)  // Register tools with MCP
  run()           // Start server
  shutdown()      // Cleanup
}
```

### 2. Skill Registry (`packages/core/src/skill-registry.ts`)

Dynamically loads and manages skill instances:

```typescript
class SkillRegistry {
  loadSkill(name, config): Promise<Skill>
  registerSkill(skill): void
  getSkill(name): Skill
  listSkills(): string[]
  unloadSkill(name): Promise<void>
}
```

**How it works:**
1. User enables skill in config (e.g., `"algorithmic-art"`)
2. Registry attempts dynamic import: `@fused-gaming/skill-algorithmic-art`
3. Skill's `initialize()` is called with config
4. Skill's tools are extracted and registered with MCP server

### 3. Configuration (`packages/core/src/config.ts`)

Loads `.fused-gaming-mcp.json` with schema:

```typescript
interface FusedGamingConfig {
  server: {
    name: string
    version: string
    transport: "stdio" | "sse"
    port?: number
  }
  skills: {
    enabled: string[]      // Skills to load
    disabled: string[]     // Skills to skip
    custom: string[]       // Local/private skills
  }
  auth: {
    apiKeys: Record<string, string>
  }
  logging: {
    level: "debug" | "info" | "warn" | "error"
  }
}
```

### 4. Type System (`packages/core/src/types.ts`)

Core interfaces for skills and tools:

```typescript
interface Skill {
  name: string
  version: string
  description: string
  tools: ToolDefinition[]
  initialize(config: SkillConfig): Promise<void>
  cleanup?(): Promise<void>
}

interface ToolDefinition {
  name: string
  description: string
  inputSchema: ToolInputSchema
  handler(input: Record<string, unknown>): Promise<string | Record<string, unknown>>
}

interface ToolInputSchema {
  type: "object"
  properties: Record<string, unknown>
  required?: string[]
}
```

## Skill Architecture

Each skill is an **independent npm package** following the same pattern:

```
packages/skills/my-skill/
├── src/
│   ├── index.ts              # Exports Skill interface
│   └── tools/
│       ├── index.ts          # Aggregates tools
│       └── tool-name.ts      # Individual tool
├── package.json              # @fused-gaming/skill-my-skill
├── tsconfig.json
└── README.md
```

### Skill Package Template

```typescript
// src/index.ts
export const mySkill: Skill = {
  name: "my-skill",
  version: "1.0.0",
  description: "Does something useful",
  tools: [tool1, tool2],

  async initialize(config) {
    // Setup (API keys, DB connections, etc.)
  },

  async cleanup() {
    // Teardown
  }
}

export default mySkill
```

### Tool Definition Template

```typescript
export const myTool: ToolDefinition = {
  name: "do-something",
  description: "Describes what the tool does",
  inputSchema: {
    type: "object",
    properties: {
      param1: { type: "string", description: "..." },
      param2: { type: "number", description: "..." }
    },
    required: ["param1"]
  },

  async handler(input) {
    // Implementation
    return { result: "..." }
  }
}
```

## Data Flow

### Skill Loading Flow

```
1. Server starts
   ↓
2. loadConfig() → reads .fused-gaming-mcp.json
   ↓
3. For each enabled skill in config:
   ├─ SkillRegistry.loadSkill(skillName)
   ├─ Dynamic import: @fused-gaming/skill-{skillName}
   ├─ skill.initialize(config)
   └─ registerSkillTools(skill)
   ↓
4. Server listens on stdio
```

### Tool Invocation Flow

```
Claude API/UI
    ↓
calls MCP tool
    ↓
MCP Server receives tool call
    ↓
Server finds tool handler (from skill)
    ↓
Calls handler(input)
    ↓
handler returns result
    ↓
MCP formats response
    ↓
Returns to Claude
```

## Monorepo Structure (npm Workspaces)

```json
{
  "workspaces": [
    "packages/core",
    "packages/skills/*",
    "packages/cli"
  ]
}
```

**Benefits:**
- 📦 Single `node_modules` shared across all packages
- 🔗 Packages reference each other via `workspace:*`
- 🚀 Single `npm install` installs everything
- 🏗️ Single `npm run build` builds all packages

## CLI Tool (`packages/cli/`)

Provides commands for configuration management:

```bash
fused-gaming-mcp init      # Generate .fused-gaming-mcp.json
fused-gaming-mcp list      # Show available skills
fused-gaming-mcp add <skill>    # Enable skill
fused-gaming-mcp remove <skill> # Disable skill
```

## Deployment Architecture

### Local Development

```
npm install
npm run build
npm run dev        # Runs core server in watch mode
```

### Production

```
npm install
npm run build
NODE_ENV=production npm run dev

# Or with stdin/stdout piping
echo '{}' | npm run dev
```

### Cloud Deployment (e.g., AWS Lambda)

Could add `packages/serverless/` with:
- Lambda handler wrapper
- HTTP → stdin/stdout adapter
- Cloud-specific configuration

## Security Considerations

### 1. API Key Management

- Store keys in `.env` file or environment variables
- Pass via config during skill initialization
- Never commit credentials

### 2. Skill Isolation

- Each skill runs in same Node process (no sandboxing)
- Trust the source of skills you install
- For untrusted skills, use separate MCP server instance

### 3. Input Validation

- Schemas enforce input validation
- Tools should validate sensitive operations
- Use `required` fields for critical parameters

## Future Enhancements

### Immediate (Post v1.0)

- [ ] Skill marketplace/registry UI
- [ ] Better error recovery & logging
- [ ] Caching layer for expensive operations
- [ ] Skill hot-reloading

### Mid-term (v1.x)

- [ ] Private skill layer (separate repo)
- [ ] Community skill templates
- [ ] Skill profiling & performance metrics
- [ ] Multi-process skill sandboxing

### Long-term (v2.0+)

- [ ] Distributed MCP servers
- [ ] Skill version management
- [ ] GraphQL interface
- [ ] Web UI for skill management

## Glossary

- **Skill** — A package containing one or more related tools
- **Tool** — A single, callable function exposed to Claude
- **MCP** — Model Context Protocol (Anthropic standard)
- **Registry** — Dynamic loader managing available skills
- **Schema** — JSON Schema defining tool input/output types
- **Handler** — The async function that executes a tool
