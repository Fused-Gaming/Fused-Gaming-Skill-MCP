/**
 * Add command
 * Enables a skill in the configuration
 */

import { loadConfig, saveConfig } from "@h4shed/mcp-core";

export async function add(skill: string): Promise<void> {
  const config = loadConfig();

  if (config.skills.enabled.includes(skill)) {
    console.log(`\n✓ Skill '${skill}' is already enabled\n`);
    return;
  }

  // Remove from disabled if present
  config.skills.disabled = config.skills.disabled.filter((s: string) => s !== skill);

  // Add to enabled
  config.skills.enabled.push(skill);

  saveConfig(config);
  console.log(`\n✓ Enabled skill: ${skill}\n`);
  console.log(`Enabled skills: ${config.skills.enabled.join(", ")}\n`);
}
