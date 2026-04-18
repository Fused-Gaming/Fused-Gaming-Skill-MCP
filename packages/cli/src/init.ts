/**
 * Init command
 * Generates .fused-gaming-mcp.json config file
 */

import { getDefaultConfig, saveConfig } from "@h4shed/mcp-core";

export async function init(): Promise<void> {
  const config = getDefaultConfig();
  saveConfig(config);
  console.log("\n✓ Generated .fused-gaming-mcp.json with default configuration\n");
  console.log("Next steps:");
  console.log(
    "  fused-gaming-mcp add <skill>      - Enable a skill"
  );
  console.log(
    "  fused-gaming-mcp remove <skill>   - Disable a skill"
  );
  console.log("  fused-gaming-mcp list             - Show available skills\n");
}
