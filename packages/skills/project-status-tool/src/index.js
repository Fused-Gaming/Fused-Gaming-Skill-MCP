import { SummarizeProjectStatusTool } from "./tools/summarize-project-status.js";
export const ProjectStatusToolSkill = {
    name: "project-status-tool",
    version: "1.0.0",
    description: "Summarize current project status, risks, and next actions.",
    tools: [SummarizeProjectStatusTool],
    async initialize(_config) {
        console.log("[Project Status Tool] Skill initialized");
    },
    async cleanup() {
        console.log("[Project Status Tool] Skill cleaned up");
    },
};
export default ProjectStatusToolSkill;
//# sourceMappingURL=index.js.map