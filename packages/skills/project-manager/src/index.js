import { PlanProjectTool } from "./tools/plan-project.js";
export const ProjectManagerSkill = {
    name: "project-manager",
    version: "1.0.0",
    description: "Plan projects with milestones, dependencies, and delivery phases.",
    tools: [PlanProjectTool],
    async initialize(_config) {
        console.log("[Project Manager] Skill initialized");
    },
    async cleanup() {
        console.log("[Project Manager] Skill cleaned up");
    },
};
export default ProjectManagerSkill;
//# sourceMappingURL=index.js.map