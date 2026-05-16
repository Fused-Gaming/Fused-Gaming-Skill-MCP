import type { Skill, SkillConfig } from "./types.js";
export declare class SkillRegistry {
    private skills;
    private loaded;
    private logger;
    constructor(logger?: (msg: string) => void);
    loadSkill(skillName: string, config?: SkillConfig): Promise<Skill | null>;
    registerSkill(skill: Skill): void;
    getSkill(skillName: string): Skill | undefined;
    listSkills(): string[];
    unloadSkill(skillName: string): Promise<void>;
    unloadAll(): Promise<void>;
}
//# sourceMappingURL=skill-registry.d.ts.map