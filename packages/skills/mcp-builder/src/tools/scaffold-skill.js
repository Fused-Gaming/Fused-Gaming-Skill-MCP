export const scaffoldSkillTool = {
    name: "scaffold-skill",
    description: "Scaffold a new MCP skill with complete project structure and templates",
    inputSchema: {
        type: "object",
        properties: {
            skillName: {
                type: "string",
                description: "Name of the skill to scaffold",
            },
            description: {
                type: "string",
                description: "Brief description of the skill",
            },
            tools: {
                type: "array",
                description: "List of tools to include in the skill",
                items: { type: "string" },
            },
        },
        required: ["skillName"],
    },
    async handler(input) {
        const { skillName, description = "", tools = [] } = input;
        try {
            const scaffolding = {
                skillName,
                description,
                tools,
                structure: ["src/index.ts", "src/tools/", "package.json", "README.md"],
            };
            return {
                success: true,
                ...scaffolding,
            };
        }
        catch (error) {
            const err = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to scaffold skill: ${err}`);
        }
    },
};
//# sourceMappingURL=scaffold-skill.js.map