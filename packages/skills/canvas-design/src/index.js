import { generateSVGDesignTool } from "./tools/generate-svg.js";
export const canvasDesignSkill = {
    name: "canvas-design",
    version: "1.0.0",
    description: "Generate visual designs for web with SVG and canvas rendering capabilities",
    tools: [generateSVGDesignTool],
    async initialize(_config) {
        console.log("[CanvasDesign] Skill initialized");
    },
    async cleanup() {
        console.log("[CanvasDesign] Skill cleaned up");
    },
};
export default canvasDesignSkill;
//# sourceMappingURL=index.js.map