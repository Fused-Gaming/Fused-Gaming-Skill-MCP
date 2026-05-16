export const generateThemeTool = {
    name: "generate-theme",
    description: "Generate design system themes with colors, typography, and spacing",
    inputSchema: {
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "Theme name",
            },
            baseColor: {
                type: "string",
                description: "Primary color in hex format",
            },
            format: {
                type: "string",
                description: "Output format: tailwind, css, json, scss (default: tailwind)",
            },
        },
        required: ["name"],
    },
    async handler(input) {
        const { name, baseColor = "#3B82F6", format = "tailwind" } = input;
        try {
            const theme = `/* Theme: ${name} */`;
            return {
                success: true,
                name,
                baseColor,
                format,
                theme,
            };
        }
        catch (error) {
            const err = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to generate theme: ${err}`);
        }
    },
};
//# sourceMappingURL=generate-theme.js.map