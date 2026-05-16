import { GenerateSvgAssetTool } from "./tools/generate-svg-asset.js";
export const SvgGeneratorSkill = {
    name: "svg-generator",
    version: "1.0.0",
    description: "Generate SVG assets and icon concepts from structured prompts.",
    tools: [GenerateSvgAssetTool],
    async initialize(_config) {
        console.log("[SVG Generator] Skill initialized");
    },
    async cleanup() {
        console.log("[SVG Generator] Skill cleaned up");
    },
};
export default SvgGeneratorSkill;
//# sourceMappingURL=index.js.map