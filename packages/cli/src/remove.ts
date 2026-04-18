/**
 * Remove command
 * Disables a skill in the configuration
 */

import { loadConfig, saveConfig } from "@h4shed/mcp-core";

export async function remove(skill: string): Promise<void> {
  const config = loadConfig();

  if (!config.skills.enabled.includes(skill)) {
    console.log(`\n✓ Skill '${skill}' is already disabled\n`);
    return;
  }

  // Remove from enabled
  config.skills.enabled = config.skills.enabled.filter((s) => s !== skill);

  // Add to disabled if not already there
  if (!config.skills.disabled.includes(skill)) {
    config.skills.disabled.push(skill);
  }

  saveConfig(config);
  console.log(`\n✓ Disabled skill: ${skill}\n`);
  console.log(`Enabled skills: ${config.skills.enabled.join(", ")}\n`);
}
