/**
 * Configuration Management
 * Loads and manages .fused-gaming-mcp.json config files
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type { FusedGamingConfig } from "./types.js";

const DEFAULT_CONFIG: FusedGamingConfig = {
  server: {
    name: "fused-gaming-mcp",
    version: "1.0.0",
    transport: "stdio",
  },
  skills: {
    enabled: [
      "algorithmic-art",
      "ascii-mockup",
      "canvas-design",
      "frontend-design",
      "theme-factory",
      "mcp-builder",
      "pre-deploy-validator",
      "skill-creator",
      "web-artifacts-builder",
      "webapp-testing",
      "brand-guidelines",
      "doc-coauthoring",
      "internal-comms",
    ],
    disabled: [],
    custom: [],
  },
  auth: {
    apiKeys: {},
  },
  logging: {
    level: "info",
  },
};

export function loadConfig(configPath?: string): FusedGamingConfig {
  const path = configPath || join(process.cwd(), ".fused-gaming-mcp.json");

  if (existsSync(path)) {
    try {
      const raw = readFileSync(path, "utf-8");
      const config = JSON.parse(raw);
      return { ...DEFAULT_CONFIG, ...config };
    } catch (error) {
      console.error(`Failed to parse config at ${path}:`, error);
      return DEFAULT_CONFIG;
    }
  }

  return DEFAULT_CONFIG;
}

export function saveConfig(config: FusedGamingConfig, configPath?: string): void {
  const path = configPath || join(process.cwd(), ".fused-gaming-mcp.json");
  try {
    writeFileSync(path, JSON.stringify(config, null, 2), "utf-8");
    console.log(`Config saved to ${path}`);
  } catch (error) {
    console.error(`Failed to save config:`, error);
  }
}

export function getDefaultConfig(): FusedGamingConfig {
  return structuredClone(DEFAULT_CONFIG);
}
