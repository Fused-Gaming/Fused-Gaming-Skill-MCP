/**
 * Fused Gaming MCP Core Types
 * Defines interfaces for skills, tools, and configuration
 */

export interface ToolInputSchema {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
  handler: (input: Record<string, unknown>) => Promise<string | Record<string, unknown>>;
}

export interface SkillConfig {
  apiKeys?: Record<string, string>;
  [key: string]: unknown;
}

export interface Skill {
  name: string;
  version: string;
  description: string;
  tools: ToolDefinition[];
  initialize(config: SkillConfig): Promise<void>;
  cleanup?(): Promise<void>;
}

export interface FusedGamingConfig {
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
