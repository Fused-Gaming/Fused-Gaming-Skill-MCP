import { scaffoldSkillTool } from "./tools/scaffold-skill.js";
export const mcpBuilderSkill = {
    name: "mcp-builder",
    version: "1.0.0",
    description: "Build and scaffold MCP servers and skills following best practices and architecture patterns",
    tools: [scaffoldSkillTool],
    async initialize(_config) {
        console.log("[MCPBuilder] Skill initialized");
    },
    async cleanup() {
        console.log("[MCPBuilder] Skill cleaned up");
    },
};
export default mcpBuilderSkill;
//# sourceMappingURL=index.js.map