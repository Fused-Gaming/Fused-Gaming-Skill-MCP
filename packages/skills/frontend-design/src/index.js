import { generateComponentTool } from "./tools/generate-component.js";
export const frontendDesignSkill = {
    name: "frontend-design",
    version: "1.0.0",
    description: "Design frontend components and generate HTML/CSS for modern web applications",
    tools: [generateComponentTool],
    async initialize(_config) {
        console.log("[FrontendDesign] Skill initialized");
    },
    async cleanup() {
        console.log("[FrontendDesign] Skill cleaned up");
    },
};
export default frontendDesignSkill;
//# sourceMappingURL=index.js.map