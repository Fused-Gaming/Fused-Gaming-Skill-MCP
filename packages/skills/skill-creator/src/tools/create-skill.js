export const createSkillTool = {
    name: "create-skill",
    description: "Create a new custom skill for the Fused Gaming MCP ecosystem",
    inputSchema: {
        type: "object",
        properties: {
            skillName: {
                type: "string",
                description: "Unique name for the skill (kebab-case)",
            },
            description: {
                type: "string",
                description: "Description of what the skill does",
            },
            toolCount: {
                type: "number",
                description: "Number of tools to generate (default: 1)",
            },
            scope: {
                type: "string",
                description: "Scope: public (@h4shed) or custom namespace",
            },
        },
        required: ["skillName"],
    },
    async handler(input) {
        const { skillName, description = "", toolCount = 1, scope = "h4shed" } = input;
        try {
            const packageName = `@${scope}/skill-${skillName}`;
            return {
                success: true,
                packageName,
                skillName,
                description,
                toolCount,
                message: `Created skill template for ${packageName}`,
            };
        }
        catch (error) {
            const err = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to create skill: ${err}`);
        }
    },
};
//# sourceMappingURL=create-skill.js.map