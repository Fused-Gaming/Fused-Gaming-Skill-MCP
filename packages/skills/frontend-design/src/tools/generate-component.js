export const generateComponentTool = {
    name: "generate-component",
    description: "Generate modern frontend components with HTML, CSS, and JavaScript",
    inputSchema: {
        type: "object",
        properties: {
            component: {
                type: "string",
                description: "Component type: button, card, form, navbar, modal, hero",
            },
            framework: {
                type: "string",
                description: "Framework: react, vue, vanilla, svelte (default: vanilla)",
            },
            variant: {
                type: "string",
                description: "Component variant or style",
            },
        },
        required: ["component"],
    },
    async handler(input) {
        const { component, framework = "vanilla", variant = "default" } = input;
        try {
            const html = `<!-- ${framework.toUpperCase()} ${component.toUpperCase()} (${variant}) -->`;
            return {
                success: true,
                component,
                framework,
                variant,
                html,
            };
        }
        catch (error) {
            const err = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to generate component: ${err}`);
        }
    },
};
//# sourceMappingURL=generate-component.js.map