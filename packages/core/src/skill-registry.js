export class SkillRegistry {
    constructor(logger) {
        this.skills = new Map();
        this.loaded = new Set();
        this.logger = logger || console.log;
    }
    async loadSkill(skillName, config) {
        if (this.loaded.has(skillName)) {
            const skill = this.skills.get(skillName);
            if (skill) {
                return skill;
            }
        }
        try {
            const packageName = `@h4shed/skill-${skillName}`;
            this.logger(`[SkillRegistry] Loading ${packageName}...`);
            const module = await import(packageName);
            const skill = module.default || module.skill;
            if (!skill || !skill.name) {
                throw new Error(`Invalid skill export from ${packageName}: missing name property`);
            }
            if (config) {
                await skill.initialize(config);
            }
            else {
                await skill.initialize({});
            }
            this.skills.set(skillName, skill);
            this.loaded.add(skillName);
            this.logger(`[SkillRegistry] ✓ Loaded ${skillName} (v${skill.version})`);
            return skill;
        }
        catch (error) {
            const err = error instanceof Error ? error.message : String(error);
            this.logger(`[SkillRegistry] ✗ Failed to load ${skillName}: ${err}`);
            return null;
        }
    }
    registerSkill(skill) {
        if (!skill.name) {
            throw new Error("Skill must have a name property");
        }
        this.skills.set(skill.name, skill);
        this.logger(`[SkillRegistry] Registered local skill: ${skill.name}`);
    }
    getSkill(skillName) {
        return this.skills.get(skillName);
    }
    listSkills() {
        return Array.from(this.skills.keys());
    }
    async unloadSkill(skillName) {
        const skill = this.skills.get(skillName);
        if (skill && skill.cleanup) {
            await skill.cleanup();
        }
        this.skills.delete(skillName);
        this.loaded.delete(skillName);
        this.logger(`[SkillRegistry] Unloaded ${skillName}`);
    }
    async unloadAll() {
        for (const skillName of this.listSkills()) {
            await this.unloadSkill(skillName);
        }
    }
}
//# sourceMappingURL=skill-registry.js.map