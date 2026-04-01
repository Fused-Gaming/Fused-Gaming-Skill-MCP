/**
 * Skill Registry
 * Dynamically loads and manages skill instances
 */

import type { Skill, SkillConfig } from "./types.js";

export class SkillRegistry {
  private skills = new Map<string, Skill>();
  private loaded = new Set<string>();
  private logger: (msg: string) => void;

  constructor(logger?: (msg: string) => void) {
    this.logger = logger || console.log;
  }

  /**
   * Dynamically load a skill by name
   * Expects package name: @fused-gaming/skill-{skillName}
   */
  async loadSkill(skillName: string, config?: SkillConfig): Promise<Skill | null> {
    if (this.loaded.has(skillName)) {
      const skill = this.skills.get(skillName);
      if (skill) {
        return skill;
      }
    }

    try {
      const packageName = `@fused-gaming/skill-${skillName}`;
      this.logger(`[SkillRegistry] Loading ${packageName}...`);

      // Dynamic import for skill packages
      const module = await import(packageName);
      const skill: Skill = module.default || module.skill;

      if (!skill || !skill.name) {
        throw new Error(`Invalid skill export from ${packageName}: missing name property`);
      }

      // Initialize skill
      if (config) {
        await skill.initialize(config);
      } else {
        await skill.initialize({});
      }

      this.skills.set(skillName, skill);
      this.loaded.add(skillName);
      this.logger(`[SkillRegistry] ✓ Loaded ${skillName} (v${skill.version})`);
      return skill;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      this.logger(`[SkillRegistry] ✗ Failed to load ${skillName}: ${err}`);
      return null;
    }
  }

  /**
   * Register a skill directly (for custom/local skills)
   */
  registerSkill(skill: Skill): void {
    if (!skill.name) {
      throw new Error("Skill must have a name property");
    }
    this.skills.set(skill.name, skill);
    this.logger(`[SkillRegistry] Registered local skill: ${skill.name}`);
  }

  /**
   * Get a registered skill
   */
  getSkill(skillName: string): Skill | undefined {
    return this.skills.get(skillName);
  }

  /**
   * List all registered skill names
   */
  listSkills(): string[] {
    return Array.from(this.skills.keys());
  }

  /**
   * Unload a skill (call cleanup if available)
   */
  async unloadSkill(skillName: string): Promise<void> {
    const skill = this.skills.get(skillName);
    if (skill && skill.cleanup) {
      await skill.cleanup();
    }
    this.skills.delete(skillName);
    this.loaded.delete(skillName);
    this.logger(`[SkillRegistry] Unloaded ${skillName}`);
  }

  /**
   * Unload all skills
   */
  async unloadAll(): Promise<void> {
    for (const skillName of this.listSkills()) {
      await this.unloadSkill(skillName);
    }
  }
}
