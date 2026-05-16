import { generateThemeTool } from "./tools/generate-theme.js";
export const themeFactorySkill = {
    name: "theme-factory",
    version: "1.0.0",
    description: "Generate design systems and themes for consistent UI/UX across applications",
    tools: [generateThemeTool],
    async initialize(_config) {
        console.log("[ThemeFactory] Skill initialized");
    },
    async cleanup() {
        console.log("[ThemeFactory] Skill cleaned up");
    },
};
export default themeFactorySkill;
//# sourceMappingURL=index.js.map