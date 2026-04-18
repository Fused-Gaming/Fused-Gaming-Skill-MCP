# Creating New Skills for Fused Gaming MCP

This guide walks you through creating and publishing a new skill for the Fused Gaming MCP ecosystem.

## Quick Start: 5-Minute Skill

### 1. Initialize the Skill Package

```bash
cd packages/skills
npm init -w my-awesome-skill
cd my-awesome-skill
npm install --save @h4shed/mcp-core
```

### 2. Create TypeScript Config

```bash
touch tsconfig.json
```

```json
{
  "extends": "../../../tsconfig.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts"]
}
```

### 3. Create Skill Structure

```bash
mkdir -p src/tools
```

### 4. Implement Your Skill

`src/index.ts`:
```typescript
import type { Skill, SkillConfig } from "@h4shed/mcp-core";
import { myTool } from "./tools/my-tool.js";

export const myAwesomeSkill: Skill = {
  name: "my-awesome-skill",
  version: "1.0.0",
  description: "Does something awesome",
  tools: [myTool],

  async initialize(config: SkillConfig): Promise<void> {
    console.log("[MyAwesomeSkill] Initialized");
  },

  async cleanup(): Promise<void> {
    console.log("[MyAwesomeSkill] Cleaned up");
  },
};

export default myAwesomeSkill;
```

`src/tools/my-tool.ts`:
```typescript
import type { ToolDefinition } from "@h4shed/mcp-core";

export const myTool: ToolDefinition = {
  name: "do-something-awesome",
  description: "Performs an awesome operation with parameters",
  inputSchema: {
    type: "object",
    properties: {
      input: {
        type: "string",
        description: "Input to process",
      },
    },
    required: ["input"],
  },

  async handler(input: Record<string, unknown>) {
    const { input: text } = input as { input: string };
    
    // Your implementation here
    const result = text.toUpperCase();
    
    return {
      success: true,
      result,
      message: `Processed: ${result}`,
    };
  },
};
```

### 5. Build and Test

```bash
npm run build
```

### 6. Test the Skill

Add to `.fused-gaming-mcp.json`:
```json
{
  "skills": {
    "enabled": ["my-awesome-skill"]
  }
}
```

Then run:
```bash
npm run dev
```

---

## Detailed Guide: Complex Skills

### Input Schemas

Use **JSON Schema** to define tool inputs. Full example:

```typescript
inputSchema: {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "User's name",
    },
    age: {
      type: "number",
      description: "User's age (1-150)",
    },
    interests: {
      type: "array",
      description: "Hobbies",
      items: { type: "string" },
    },
    metadata: {
      type: "object",
      description: "Additional data",
      properties: {
        location: { type: "string" },
        verified: { type: "boolean" },
      },
    },
  },
  required: ["name"],
  additionalProperties: false,
}
```

### Error Handling

Always wrap handlers in try-catch:

```typescript
async handler(input: Record<string, unknown>) {
  try {
    // Validate
    if (!input.requiredField) {
      throw new Error("requiredField is required");
    }

    // Process
    const result = await expensiveOperation();

    return { success: true, data: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Don't throw - return error in response
    return {
      success: false,
      error: message,
    };
  }
}
```

### Multiple Tools

Skills can have multiple tools:

```typescript
export const mySkill: Skill = {
  name: "my-skill",
  // ...
  tools: [tool1, tool2, tool3],
};
```

Each tool is independent. Use `src/tools/index.ts` to aggregate:

```typescript
// src/tools/index.ts
export { tool1 } from "./tool1.js";
export { tool2 } from "./tool2.js";
export { tool3 } from "./tool3.js";
```

### Async Operations

Tools support async handlers for:
- API calls
- Database queries
- File operations
- Long computations

```typescript
async handler(input: Record<string, unknown>) {
  const result = await fetch("https://api.example.com");
  const json = await result.json();
  return { success: true, data: json };
}
```

### Accessing Configuration

Skills receive config during initialization:

```typescript
async initialize(config: SkillConfig): Promise<void> {
  const apiKey = config.apiKeys?.myApiKey;
  if (apiKey) {
    // Store for use in tools
    this.apiKey = apiKey;
  }
}
```

---

## Advanced: Custom Skill Template

### Directory Structure

```
packages/skills/my-skill/
├── src/
│   ├── index.ts                # Skill definition
│   ├── types.ts                # Skill-specific types
│   ├── utils.ts                # Helper functions
│   ├── tools/
│   │   ├── index.ts            # Export all tools
│   │   ├── tool-1.ts
│   │   └── tool-2.ts
│   └── __tests__/
│       └── tool-1.test.ts
├── package.json
├── tsconfig.json
├── tsconfig.build.json         # Production build config
├── README.md
└── SKILL.md                    # Original Claude skill (optional)
```

### Package Configuration

```json
{
  "name": "@h4shed/skill-my-skill",
  "version": "1.0.0",
  "description": "Does something awesome",
  "type": "module",
  "main": "./dist/index.js",
  "exports": {
    ".": "./dist/index.js",
    "./types": "./dist/types.js"
  },
  "scripts": {
    "build": "tsc --project tsconfig.json",
    "dev": "tsc --project tsconfig.json --watch",
    "test": "vitest",
    "test:watch": "vitest --watch"
  },
  "dependencies": {
    "@h4shed/mcp-core": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "typescript": "^5.3.2",
    "vitest": "^1.0.0"
  },
  "keywords": ["mcp", "skill", "fused-gaming"],
  "author": "Your Name",
  "license": "Apache-2.0"
}
```

### Testing

```typescript
// src/__tests__/tool-1.test.ts
import { describe, it, expect } from "vitest";
import { myTool } from "../tools/tool-1";

describe("myTool", () => {
  it("should process input correctly", async () => {
    const result = await myTool.handler({ input: "test" });
    expect(result.success).toBe(true);
  });

  it("should handle errors", async () => {
    const result = await myTool.handler({});
    expect(result.success).toBe(false);
  });
});
```

---

## Publishing Your Skill

### 1. Configure `package.json`

- [ ] Name: `@h4shed/skill-{name}`
- [ ] Version: `1.0.0`
- [ ] Main: `./dist/index.js`
- [ ] Author/license set correctly

### 2. Build Locally

```bash
npm run build
ls dist/         # Verify output
```

### 3. Dry-run Publish

```bash
npm publish --dry-run
```

### 4. Publish to npm

```bash
npm publish
```

### 5. Update Root Config

Add to `.fused-gaming-mcp.json`:
```json
{
  "skills": {
    "enabled": ["my-awesome-skill"]
  }
}
```

### 6. Submit to MCP Registry (Optional)

Open PR to [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers):

```yaml
- name: "@h4shed/skill-my-awesome-skill"
  description: "Does something awesome"
  github: "fused-gaming/mcp"
  install: "npm install @h4shed/skill-my-awesome-skill"
```

---

## Best Practices

### ✅ DO

- ✅ Use **descriptive tool names** (kebab-case)
- ✅ Write **clear descriptions** for tools and parameters
- ✅ Include **required fields** in schema
- ✅ **Validate inputs** before processing
- ✅ Return **consistent response structures**
- ✅ Handle **errors gracefully**
- ✅ Add **README with examples**
- ✅ Write **tests** for tools
- ✅ Use **semantic versioning**

### ❌ DON'T

- ❌ Don't throw exceptions from handlers (return error in response)
- ❌ Don't require external dependencies on users' systems
- ❌ Don't hardcode API keys or secrets
- ❌ Don't make blocking synchronous API calls
- ❌ Don't create side effects outside the tool handler
- ❌ Don't use relative imports (`./` instead of `./file.js`)

---

## Example: Weather Skill

```typescript
// src/tools/get-weather.ts
import type { ToolDefinition } from "@h4shed/mcp-core";

export const getWeatherTool: ToolDefinition = {
  name: "get-weather",
  description: "Get current weather for a location",
  inputSchema: {
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "City name",
      },
      units: {
        type: "string",
        enum: ["celsius", "fahrenheit"],
        description: "Temperature units (default: celsius)",
      },
    },
    required: ["city"],
  },

  async handler(input: Record<string, unknown>) {
    const { city, units = "celsius" } = input as {
      city: string;
      units?: string;
    };

    try {
      if (!city || typeof city !== "string") {
        return {
          success: false,
          error: "City name is required and must be a string",
        };
      }

      // Simulate API call
      const response = await fetch(
        `https://api.weather.example.com?city=${encodeURIComponent(city)}`
      );
      const data = await response.json();

      return {
        success: true,
        city,
        units,
        temperature: data.temp,
        condition: data.condition,
        humidity: data.humidity,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
```

---

## Troubleshooting

### "Module not found" error

**Problem:** `Cannot find module '@h4shed/skill-my-skill'`

**Solution:** 
```bash
cd packages/skills/my-skill
npm run build              # Build the skill
npm install -w @h4shed/mcp-core  # Ensure core is installed
```

### Tool not appearing

**Problem:** Skill loads but tool doesn't register

**Solution:**
- Verify skill's `tools` array includes the tool
- Check tool `name` matches registration
- Ensure `initialize()` completes without error

### TypeScript errors

**Problem:** Type errors during build

**Solution:**
```bash
npm run typecheck
npm run build -- --listFiles  # See what's being compiled
```

---

**Ready to create your skill?** Start with the [Quick Start](#quick-start-5-minute-skill) above!
