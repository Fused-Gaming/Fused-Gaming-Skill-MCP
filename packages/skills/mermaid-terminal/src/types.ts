/**
 * Local structural types matching the @h4shed/mcp-core Skill and ToolDefinition
 * shapes. Declared here so the package builds with rootDir ./src and does not
 * pull mcp-core sources into the compilation.
 */

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
  handler: (input: Record<string, unknown>) => Promise<string | Record<string, unknown>>;
}

export interface SkillConfig {
  [key: string]: unknown;
}

export interface Skill {
  name: string;
  version: string;
  description: string;
  tools: ToolDefinition[];
  initialize?: (config: SkillConfig) => Promise<void>;
  cleanup?: () => Promise<void>;
}
