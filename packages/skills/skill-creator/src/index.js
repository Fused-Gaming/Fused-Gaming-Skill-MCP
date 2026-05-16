import { createSkillTool } from "./tools/create-skill.js";
export const skillCreatorSkill = {
    name: "skill-creator",
    version: "1.0.0",
    description: "Create custom skills and tools for the Fused Gaming MCP ecosystem with templates and generators",
    tools: [createSkillTool],
    async initialize(_config) {
        console.log("[SkillCreator] Skill initialized");
    },
    async cleanup() {
        console.log("[SkillCreator] Skill cleaned up");
    },
};
export default skillCreatorSkill;
//# sourceMappingURL=index.js.map