# @fused-gaming/mcp-core

Core MCP server and skill registry for Fused Gaming.

This package provides:
- **SkillRegistry**: Dynamically loads and manages skill instances
- **Type definitions**: Standard interfaces for skills and tools
- **Configuration management**: Load/save `.fused-gaming-mcp.json` config
- **MCP Server**: Stdio-based MCP server with skill tool registration

## Installation

```bash
npm install @fused-gaming/mcp-core
```

## Usage

### As a library

```typescript
import { SkillRegistry } from "@fused-gaming/mcp-core";

const registry = new SkillRegistry();
const skill = await registry.loadSkill("algorithmic-art");
console.log(skill?.tools);
```

### As an MCP server

See parent package `@fused-gaming/mcp` for instructions.

## API Reference

### SkillRegistry

```typescript
class SkillRegistry {
  loadSkill(name: string, config?: SkillConfig): Promise<Skill | null>;
  registerSkill(skill: Skill): void;
  getSkill(name: string): Skill | undefined;
  listSkills(): string[];
  unloadSkill(name: string): Promise<void>;
  unloadAll(): Promise<void>;
}
```

### Types

```typescript
interface Skill {
  name: string;
  version: string;
  description: string;
  tools: ToolDefinition[];
  initialize(config: SkillConfig): Promise<void>;
  cleanup?(): Promise<void>;
}

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
  handler(input: Record<string, unknown>): Promise<string | Record<string, unknown>>;
}
```

See `src/types.ts` for complete type definitions.
