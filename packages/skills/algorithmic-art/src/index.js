import { generateArtTool } from "./tools/generate-art.js";
import { createFlowFieldTool } from "./tools/flow-field.js";
export const algorithmicArtSkill = {
    name: "algorithmic-art",
    version: "1.0.0",
    description: "Generate algorithmic and generative art using p5.js with seeded randomness, flow fields, and particle systems",
    tools: [generateArtTool, createFlowFieldTool],
    async initialize(config) {
        if (config.apiKeys?.algArtKey) {
        }
        console.log("[AlgorithmicArt] Skill initialized");
    },
    async cleanup() {
        console.log("[AlgorithmicArt] Skill cleaned up");
    },
};
export default algorithmicArtSkill;
//# sourceMappingURL=index.js.map