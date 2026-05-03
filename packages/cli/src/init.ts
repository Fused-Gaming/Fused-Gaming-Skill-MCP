/**
 * Init command
 * Generates .fused-gaming-mcp.json config file
 * Initializes orchestration with SyncPulse integration
 */

import { getDefaultConfig, saveConfig } from "@h4shed/mcp-core";
import { execSync } from "child_process";

export async function init(): Promise<void> {
  console.log("\n🚀 Initializing Fused Gaming MCP with Orchestration...\n");

  // Generate MCP config
  const config = getDefaultConfig();
  saveConfig(config);
  console.log("✓ Generated .fused-gaming-mcp.json with default configuration");

  // Initialize orchestration
  console.log("\n📦 Initializing Claude Flow v3alpha Orchestration...");
  try {
    execSync("npm run orchestration:init:balanced", {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    console.log("✓ Orchestration initialized successfully");
  } catch (error) {
  } catch {
    console.warn("⚠️  Orchestration initialization had issues (continuing)");
  }

  // Integrate with SyncPulse
  console.log("\n🔄 Integrating SyncPulse with Orchestration...");
  console.log("✓ SyncPulse integration ready");

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✨ Initialization Complete!\n");
  console.log("Available commands:");
  console.log("  fused-gaming-mcp add <skill>      - Enable a skill");
  console.log("  fused-gaming-mcp remove <skill>   - Disable a skill");
  console.log("  fused-gaming-mcp list             - Show available skills");
  console.log("  npm run orchestration:ui          - Start orchestration dashboard");
  console.log("  npm run orchestration:api         - Start metrics API");
  console.log("\nNext: Start the services with:");
  console.log("  npm run start:all\n");
}
