# API Reference

Complete API documentation for Fused Gaming MCP core and skill interfaces.

## Core Package (`@fused-gaming/mcp-core`)

### Exports

#### Type: `Skill`

Main skill interface that every skill must implement.

```typescript
interface Skill {
  name: string;
  version: string;
  description: string;
  tools: ToolDefinition[];
  initialize(config: SkillConfig): Promise<void>;
  cleanup?(): Promise<void>;
}
```

**Properties:**
- `name` (string) — Unique skill identifier (kebab-case)
- `version` (string) — Semantic version (e.g., "1.0.0")
- `description` (string) — What the skill does
- `tools` (ToolDefinition[]) — Array of tool definitions
- `initialize()` — Async initialization hook (required)
- `cleanup()` — Optional cleanup hook

**Example:**
```typescript
const mySkill: Skill = {
  name: "my-skill",
  version: "1.0.0",
  description: "Does something useful",
  tools: [tool1, tool2],
  async initialize(config) {
    // Setup
  },
  async cleanup() {
    // Teardown
  }
};
```

---

#### Type: `ToolDefinition`

Defines a single tool that Claude can call.

```typescript
interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
  handler(input: Record<string, unknown>): Promise<string | Record<string, unknown>>;
}
```

**Properties:**
- `name` (string) — Tool identifier (kebab-case)
- `description` (string) — What the tool does
- `inputSchema` (ToolInputSchema) — JSON Schema for inputs
- `handler()` — Async function that executes the tool

**Example:**
```typescript
const myTool: ToolDefinition = {
  name: "my-tool",
  description: "Processes data",
  inputSchema: {
    type: "object",
    properties: {
      data: { type: "string" }
    },
    required: ["data"]
  },
  async handler(input) {
    const { data } = input as { data: string };
    return { result: data.toUpperCase() };
  }
};
```

---

#### Type: `ToolInputSchema`

JSON Schema definition for tool inputs.

```typescript
interface ToolInputSchema {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
}
```

**Common JSON Schema types:**

```typescript
// String
{
  type: "string",
  description: "A text value",
  minLength?: 1,
  maxLength?: 100,
  pattern?: "^[a-z]+$"
}

// Number
{
  type: "number",
  description: "A numeric value",
  minimum?: 0,
  maximum?: 100
}

// Boolean
{
  type: "boolean",
  description: "A true/false value"
}

// Array
{
  type: "array",
  description: "A list of items",
  items: { type: "string" },
  minItems?: 1,
  maxItems?: 10
}

// Enum
{
  type: "string",
  enum: ["option1", "option2", "option3"]
}

// Object
{
  type: "object",
  properties: {
    field1: { type: "string" },
    field2: { type: "number" }
  },
  required: ["field1"]
}
```

---

#### Type: `SkillConfig`

Configuration passed to skill's `initialize()` method.

```typescript
interface SkillConfig {
  apiKeys?: Record<string, string>;
  [key: string]: unknown;
}
```

**Example:**
```typescript
async initialize(config: SkillConfig) {
  const apiKey = config.apiKeys?.myService;
  const customSetting = config.customSetting;
}
```

---

#### Type: `FusedGamingConfig`

Root configuration from `.fused-gaming-mcp.json`.

```typescript
interface FusedGamingConfig {
  server: {
    name: string;
    version: string;
    transport: "stdio" | "sse";
    port?: number;
  };
  skills: {
    enabled: string[];
    disabled: string[];
    custom?: string[];
  };
  auth: {
    apiKeys?: Record<string, string>;
  };
  logging: {
    level: "debug" | "info" | "warn" | "error";
  };
}
```

---

### Class: `SkillRegistry`

Manages skill loading and registration.

#### Methods

##### `loadSkill(name: string, config?: SkillConfig): Promise<Skill | null>`

Dynamically load a skill by name.

```typescript
const registry = new SkillRegistry();
const skill = await registry.loadSkill("algorithmic-art");
if (skill) {
  console.log(skill.tools);
}
```

**Parameters:**
- `name` (string) — Skill name (e.g., "algorithmic-art")
- `config` (optional) — Configuration to pass to skill

**Returns:** Skill instance or null if not found

**Throws:** Never throws; returns null on error

---

##### `registerSkill(skill: Skill): void`

Register a skill directly (for local/custom skills).

```typescript
const mySkill: Skill = { ... };
registry.registerSkill(mySkill);
```

**Parameters:**
- `skill` — Skill instance to register

**Throws:** Error if skill has no name

---

##### `getSkill(name: string): Skill | undefined`

Retrieve a registered skill by name.

```typescript
const skill = registry.getSkill("my-skill");
```

---

##### `listSkills(): string[]`

Get all registered skill names.

```typescript
const names = registry.listSkills();
console.log(names); // ["algorithmic-art", "theme-factory", ...]
```

---

##### `unloadSkill(name: string): Promise<void>`

Unload a skill and call its cleanup hook.

```typescript
await registry.unloadSkill("my-skill");
```

---

##### `unloadAll(): Promise<void>`

Unload all registered skills.

```typescript
await registry.unloadAll();
```

---

### Functions

#### `loadConfig(configPath?: string): FusedGamingConfig`

Load configuration from file or return defaults.

```typescript
import { loadConfig } from "@fused-gaming/mcp-core";

const config = loadConfig();
// or
const config = loadConfig("/path/to/.fused-gaming-mcp.json");
```

---

#### `saveConfig(config: FusedGamingConfig, configPath?: string): void`

Save configuration to file.

```typescript
import { saveConfig } from "@fused-gaming/mcp-core";

config.skills.enabled.push("new-skill");
saveConfig(config);
```

---

#### `getDefaultConfig(): FusedGamingConfig`

Get default configuration object.

```typescript
import { getDefaultConfig } from "@fused-gaming/mcp-core";

const defaults = getDefaultConfig();
```

---

## CLI Package (`@fused-gaming/mcp-cli`)

### Commands

#### `init`

Generate `.fused-gaming-mcp.json` config file.

```bash
npx fused-gaming-mcp init
```

Creates config in current directory with default settings.

---

#### `list`

Show available and enabled skills.

```bash
npx fused-gaming-mcp list
```

Output:
```
📦 Available Skills:

Status | Skill Name
-------|-----------------------------------
  ✓   | algorithmic-art
  ✓   | canvas-design
      | my-skill

✓ Enabled: 2
✗ Disabled: 1
```

---

#### `add <skill>`

Enable a skill in configuration.

```bash
npx fused-gaming-mcp add frontend-design
```

---

#### `remove <skill>`

Disable a skill in configuration.

```bash
npx fused-gaming-mcp remove internal-comms
```

---

## Configuration File (`.fused-gaming-mcp.json`)

### Schema

```json
{
  "server": {
    "name": "string",
    "version": "string",
    "transport": "stdio" | "sse",
    "port": "number (optional)"
  },
  "skills": {
    "enabled": ["string"],
    "disabled": ["string"],
    "custom": ["string"]
  },
  "auth": {
    "apiKeys": {
      "key_name": "string"
    }
  },
  "logging": {
    "level": "debug" | "info" | "warn" | "error"
  }
}
```

### Example

```json
{
  "server": {
    "name": "fused-gaming-mcp",
    "version": "1.0.0",
    "transport": "stdio"
  },
  "skills": {
    "enabled": [
      "algorithmic-art",
      "frontend-design",
      "mcp-builder"
    ],
    "disabled": ["internal-comms"],
    "custom": ["./skills/my-custom-skill"]
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

## Error Handling

### Tool Handlers

Tools should **never throw exceptions**. Always return error in response:

```typescript
async handler(input: Record<string, unknown>) {
  try {
    // Implementation
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
```

### Skill Initialization

If `initialize()` throws, skill loading fails silently:

```typescript
async initialize(config: SkillConfig) {
  try {
    // Setup
  } catch (error) {
    console.error(`Failed to initialize: ${error}`);
    // Error is logged, skill is skipped
  }
}
```

---

## Type Safety

### Using TypeScript

All interfaces are fully typed for TypeScript support:

```typescript
import type {
  Skill,
  ToolDefinition,
  SkillConfig,
  FusedGamingConfig
} from "@fused-gaming/mcp-core";
```

### Generic Types

```typescript
// Custom skill type
type MySkill = Skill & {
  metadata: {
    author: string;
    tags: string[];
  };
};

// Custom tool type
type MyTool = ToolDefinition & {
  category: "data" | "rendering" | "utility";
};
```

---

## Examples

### Complete Skill Example

```typescript
import type { Skill, ToolDefinition, SkillConfig } from "@fused-gaming/mcp-core";

const processTool: ToolDefinition = {
  name: "process-text",
  description: "Process text with options",
  inputSchema: {
    type: "object",
    properties: {
      text: { type: "string", description: "Text to process" },
      operation: {
        type: "string",
        enum: ["uppercase", "lowercase", "reverse"],
        description: "Operation to perform"
      }
    },
    required: ["text", "operation"]
  },
  async handler(input) {
    const { text, operation } = input as { text: string; operation: string };
    
    let result: string;
    switch (operation) {
      case "uppercase":
        result = text.toUpperCase();
        break;
      case "lowercase":
        result = text.toLowerCase();
        break;
      case "reverse":
        result = text.split("").reverse().join("");
        break;
      default:
        return { success: false, error: "Invalid operation" };
    }
    
    return { success: true, result };
  }
};

export const textProcessingSkill: Skill = {
  name: "text-processing",
  version: "1.0.0",
  description: "Text processing utilities",
  tools: [processTool],
  async initialize(config: SkillConfig) {
    console.log("Initialized");
  }
};

export default textProcessingSkill;
```

---

See [SKILLS_GUIDE.md](./SKILLS_GUIDE.md) for creating new skills and [EXAMPLES.md](./EXAMPLES.md) for real-world use cases.
