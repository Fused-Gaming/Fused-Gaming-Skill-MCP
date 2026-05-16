import { loadConfig, saveConfig } from "@h4shed/mcp-core";
export async function add(skill) {
    const config = loadConfig();
    if (config.skills.enabled.includes(skill)) {
        console.log(`\n✓ Skill '${skill}' is already enabled\n`);
        return;
    }
    config.skills.disabled = config.skills.disabled.filter((s) => s !== skill);
    config.skills.enabled.push(skill);
    saveConfig(config);
    console.log(`\n✓ Enabled skill: ${skill}\n`);
    console.log(`Enabled skills: ${config.skills.enabled.join(", ")}\n`);
}
//# sourceMappingURL=add.js.map