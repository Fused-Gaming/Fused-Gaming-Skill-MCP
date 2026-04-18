/**
 * List command
 * Shows available and enabled skills
 */

import { loadConfig } from "@h4shed/mcp-core";

const AVAILABLE_SKILLS = [
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
];

export async function list(): Promise<void> {
  const config = loadConfig();
  const enabled = new Set(config.skills.enabled);

  console.log("\n📦 Available Skills:\n");
  console.log("Status | Skill Name");
  console.log("-------|-----------------------------------");

  for (const skill of AVAILABLE_SKILLS) {
    const status = enabled.has(skill) ? "✓" : " ";
    console.log(`  ${status}   | ${skill}`);
  }

  console.log("\n✓ Enabled: " + config.skills.enabled.length);
  console.log(
    "✗ Disabled: " + AVAILABLE_SKILLS.filter((s) => !enabled.has(s)).length
  );
  console.log("\nUse 'fused-gaming-mcp add <skill>' to enable a skill\n");
}
