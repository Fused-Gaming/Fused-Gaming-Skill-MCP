# Scaling Guide: Adding Skills & Features

This guide explains how to design and add new skills to the Fused Gaming MCP platform as it grows, ensuring scalability and maintainability.

## Design Principles for Scalability

### 1. **Modular Design**
Each skill is an independent npm package with:
- Own `package.json` with semantic versioning
- Isolated dependencies (no shared versions across skills)
- Self-contained build process
- Complete documentation

### 2. **Loose Coupling**
- Skills communicate through well-defined interfaces
- No direct imports between skill packages
- Configuration-driven activation/deactivation
- Framework-agnostic implementations

### 3. **High Cohesion**
- Related functionality grouped in single skills
- Clear purpose and scope for each skill
- Minimal external dependencies
- Focused tooling

## Adding a New Skill

### Step 1: Plan Your Skill

Before implementing, document:

**`packages/skills/{skill-name}/.skillplan`**

```markdown
# Skill Plan: {skill-name}

## Purpose
[What problem does this skill solve?]

## Scope
- [Feature 1]
- [Feature 2]
- [Feature 3]

## Dependencies
- [External libraries needed]

## Target Users
[Who benefits from this skill?]

## Success Criteria
- [ ] Passes all tests
- [ ] Documentation complete
- [ ] 0 TypeScript errors
- [ ] Linting passed
```

### Step 2: Create Skill Scaffolding

Use the skill creator:

```bash
npx fused-gaming-mcp skill-creator \
  --name "my-feature" \
  --description "My new feature skill" \
  --category "design|development|utility" \
  --version "1.0.0"
```

This creates:

```
packages/skills/my-feature/
├── src/
│   ├── index.ts                 # Skill definition
│   ├── tools/                   # Individual tools
│   │   ├── tool-1.ts
│   │   └── tool-2.ts
│   └── types.ts                 # TypeScript definitions
├── package.json                 # Skill metadata
├── tsconfig.json                # TypeScript config
├── README.md                    # Skill documentation
├── .skillplan                   # Planning document
└── test/
    ├── index.test.ts
    └── tools/
```

### Step 3: Define the Skill Interface

**`packages/skills/my-feature/src/index.ts`**

```typescript
import { BaseMCPServer, Tool } from "@fused-gaming/mcp-core";

export class MyFeatureSkill extends BaseMCPServer {
  name = "my-feature";
  description = "Description of my skill";
  version = "1.0.0";

  constructor() {
    super();
    this.registerTool(new MyTool());
    this.registerTool(new AnotherTool());
  }

  // Lifecycle hooks for scalability
  async initialize(): Promise<void> {
    // Setup database connections, external services, etc.
  }

  async validate(): Promise<ValidationResult> {
    // Ensure skill is properly configured
    return { valid: true };
  }

  async shutdown(): Promise<void> {
    // Cleanup resources
  }
}
```

### Step 4: Create Individual Tools

Each tool should be:
- Single responsibility
- Fully documented
- Thoroughly tested
- Type-safe

**`packages/skills/my-feature/src/tools/my-tool.ts`**

```typescript
import { Tool } from "@fused-gaming/mcp-core";

export class MyTool implements Tool {
  name = "my-tool";
  description = "What this tool does";
  
  inputSchema = {
    type: "object",
    properties: {
      param1: {
        type: "string",
        description: "First parameter"
      },
      param2: {
        type: "number",
        description: "Second parameter"
      }
    },
    required: ["param1"]
  };

  async execute(input: Record<string, unknown>): Promise<string> {
    // Validate input
    if (!input.param1 || typeof input.param1 !== "string") {
      throw new Error("param1 must be a string");
    }

    // Execute logic
    const result = await this.processInput(input.param1);

    // Return structured output
    return JSON.stringify(result);
  }

  private async processInput(param: string): Promise<Record<string, unknown>> {
    // Implementation
    return { success: true, output: param };
  }
}
```

### Step 5: Write Tests

**`packages/skills/my-feature/test/tools/my-tool.test.ts`**

```typescript
import { MyTool } from "../../src/tools/my-tool";
import { describe, it, expect } from "@jest/globals";

describe("MyTool", () => {
  const tool = new MyTool();

  it("should execute successfully with valid input", async () => {
    const result = await tool.execute({ param1: "test" });
    expect(result).toBeDefined();
  });

  it("should reject invalid input", async () => {
    await expect(tool.execute({ param1: 123 })).rejects.toThrow();
  });

  it("should handle edge cases", async () => {
    const result = await tool.execute({ param1: "" });
    expect(result).toBeDefined();
  });
});
```

### Step 6: Update VERSION.json

```bash
# Manually update VERSION.json
{
  "workspaces": {
    "skills": [
      // ... existing skills
      {
        "name": "@fused-gaming/skill-my-feature",
        "version": "1.0.0",
        "published": true
      }
    ]
  }
}
```

### Step 7: Document the Skill

**`packages/skills/my-feature/README.md`**

```markdown
# My Feature Skill

Brief description of what this skill does.

## Installation

\`\`\`bash
npm install @fused-gaming/skill-my-feature
\`\`\`

## Usage

\`\`\`bash
# Enable the skill
npx fused-gaming-mcp add my-feature

# Use the skill
npx fused-gaming-mcp my-tool --param1 "value"
\`\`\`

## Tools

### my-tool
Description and parameters

### another-tool
Description and parameters

## Configuration

Optional configuration in `.fused-gaming-mcp.json`:

\`\`\`json
{
  "skills": {
    "my-feature": {
      "option1": "value",
      "option2": true
    }
  }
}
\`\`\`

## Examples

## API Reference
```

### Step 8: Build & Test

```bash
# Build the skill
npm run build --workspace=packages/skills/my-feature

# Test the skill
npm test --workspace=packages/skills/my-feature

# Type check
npm run typecheck

# Lint
npm run lint --fix
```

## Updating the Root CHANGELOG

When adding a new skill, update `CHANGELOG.md` under `[Unreleased]`:

```markdown
### Added
- **Skills**: New `my-feature` skill for [description] (my-feature)
```

## Managing Dependencies

### Shared Dependencies

For libraries used across multiple skills:

1. Add to root `package.json` devDependencies
2. Add to `VERSION.json` in `metadata.sharedDependencies`
3. Update all affected skills to use the shared version

### Skill-Specific Dependencies

Keep skill-specific dependencies in the skill's `package.json`:

```json
{
  "dependencies": {
    "library-only-for-this-skill": "^1.0.0"
  }
}
```

## Versioning Strategy

### For New Skills

Start at `1.0.0` and increment:
- **MAJOR (X.0.0)**: Breaking API changes in the skill
- **MINOR (0.X.0)**: New tools added to the skill
- **PATCH (0.0.X)**: Bug fixes and improvements

### For Root Package

Follow the same SemVer but consider:
- **MAJOR**: Any skill has breaking changes
- **MINOR**: New skill added or significant feature
- **PATCH**: Skill patch updates, docs, or tooling fixes

## Publishing Skills

### Manual Publishing

```bash
# Build all skills
npm run build

# Test all skills
npm test

# Publish individual skill
npm publish --workspace=packages/skills/my-feature

# Or publish all skills
npm run publish:packages
```

### Automated Publishing (CI/CD)

See [NPM_PUBLISHING.md](../NPM_PUBLISHING.md) for GitHub Actions setup.

## Breaking Changes

When introducing breaking changes:

1. **Documentation**: Update skill README and API_REFERENCE.md
2. **Migration Guide**: Create `MIGRATION.md` in the skill
3. **Deprecation Period**: Warn users 6 months before removal
4. **Changelog**: Document in CHANGELOG.md with ⚠️ warning

Example:

```markdown
## [2.0.0] - 2026-10-01

### Breaking Changes
⚠️ **Skills**: `old-tool` has been removed. Use `new-tool` instead. [Migration Guide](./MIGRATION.md)
```

## Performance Considerations

### Lazy Loading

For heavy dependencies, implement lazy loading:

```typescript
export class MySkill extends BaseMCPServer {
  private heavyLibrary: Promise<HeavyLib> | null = null;

  private async loadHeavyLibrary(): Promise<HeavyLib> {
    if (!this.heavyLibrary) {
      this.heavyLibrary = import("heavy-lib").then(m => m.default);
    }
    return this.heavyLibrary;
  }
}
```

### Caching

Cache computation-heavy results:

```typescript
private cache = new Map<string, CacheEntry>();

private getOrCompute(key: string, compute: () => unknown): unknown {
  if (this.cache.has(key)) {
    return this.cache.get(key);
  }
  const result = compute();
  this.cache.set(key, { result, timestamp: Date.now() });
  return result;
}
```

## Monitoring & Observability

Add logging for debugging:

```typescript
import { Logger } from "@fused-gaming/mcp-core";

export class MyTool implements Tool {
  private logger = new Logger("my-tool");

  async execute(input: Record<string, unknown>): Promise<string> {
    this.logger.debug("Tool executed", { input });
    try {
      const result = await this.process(input);
      this.logger.info("Tool completed successfully");
      return result;
    } catch (error) {
      this.logger.error("Tool failed", error);
      throw error;
    }
  }
}
```

## Testing at Scale

### Unit Tests

Test individual tools in isolation:

```bash
npm test --workspace=packages/skills/my-feature
```

### Integration Tests

Test skills interacting with core:

```typescript
import { MCPServer } from "@fused-gaming/mcp-core";

describe("MySkill Integration", () => {
  let server: MCPServer;

  beforeEach(async () => {
    server = new MCPServer();
    await server.registerSkill(new MyFeatureSkill());
  });

  it("should load and execute tool from core", async () => {
    const result = await server.executeTool("my-tool", { param1: "test" });
    expect(result).toBeDefined();
  });
});
```

### End-to-End Tests

Test through CLI:

```bash
npx fused-gaming-mcp add my-feature
npx fused-gaming-mcp my-tool --param1 "test"
```

## Documentation for Scalability

Maintain these documents for each skill:

1. **README.md**: Overview and quick start
2. **CHANGELOG.md**: Version history (root only)
3. **API Reference**: Detailed tool documentation (in root API_REFERENCE.md)
4. **EXAMPLES.md**: Real-world usage (in root EXAMPLES.md)
5. **ARCHITECTURE.md**: Design decisions (in root ARCHITECTURE.md)

## Governance

For large-scale growth:

1. **RFC Process**: Complex features need an RFC before implementation
2. **Review Process**: All PRs require at least 2 approvals
3. **Deprecation Policy**: 6-month notice before removal
4. **Versioning Council**: Agree on major version bumps
5. **Skill Registry**: Maintain official list in VERSION.json

## Resources

- [SKILLS_GUIDE.md](./SKILLS_GUIDE.md) — Creating skills
- [ARCHITECTURE.md](./ARCHITECTURE.md) — System design
- [API_REFERENCE.md](./API_REFERENCE.md) — Complete API
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Contribution guidelines
