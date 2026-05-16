export const PlanProjectTool = {
    name: "plan-project",
    description: "Plan projects with milestones, dependencies, and delivery phases.",
    inputSchema: {
        type: "object",
        properties: {
            objective: {
                type: "string",
                description: "Primary objective for this tool invocation",
            },
            context: {
                type: "string",
                description: "Optional contextual details",
            },
        },
        required: ["objective"],
    },
    async handler(input) {
        const { objective, context = "" } = input;
        return {
            success: true,
            tool: "plan-project",
            objective,
            context,
            note: "Scaffold implementation complete; full logic pending.",
        };
    },
};
//# sourceMappingURL=plan-project.js.map