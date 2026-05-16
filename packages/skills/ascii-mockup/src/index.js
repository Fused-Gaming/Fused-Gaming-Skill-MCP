import { generateMockupTool } from "./tools/generate-mockup.js";
export const asciiMockupSkill = {
    name: "ascii-mockup",
    version: "1.0.0",
    description: "Generate mobile-first ASCII wireframe mockups for rapid UI prototyping and layout planning",
    tools: [generateMockupTool],
    async initialize(_config) {
        console.log("[ASCIIMockup] Skill initialized");
    },
    async cleanup() {
        console.log("[ASCIIMockup] Skill cleaned up");
    },
};
export default asciiMockupSkill;
//# sourceMappingURL=index.js.map