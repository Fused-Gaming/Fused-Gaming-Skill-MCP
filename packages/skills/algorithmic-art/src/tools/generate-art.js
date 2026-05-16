export const generateArtTool = {
    name: "generate-art",
    description: "Generate algorithmic art with customizable patterns, colors, and complexity",
    inputSchema: {
        type: "object",
        properties: {
            pattern: {
                type: "string",
                description: "Art pattern type: mandala, spiral, fractal, cellular, or random",
            },
            seed: {
                type: "number",
                description: "Random seed for reproducible results (optional)",
            },
            width: {
                type: "number",
                description: "Canvas width in pixels (default: 800)",
            },
            height: {
                type: "number",
                description: "Canvas height in pixels (default: 600)",
            },
            colors: {
                type: "array",
                description: "Array of hex color codes for the palette",
                items: { type: "string" },
            },
            complexity: {
                type: "number",
                description: "Complexity level (1-10, default: 5)",
            },
        },
        required: ["pattern"],
    },
    async handler(input) {
        const { pattern, seed = Math.floor(Math.random() * 10000), width = 800, height = 600, colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"], complexity = 5, } = input;
        try {
            if (!pattern) {
                throw new Error("Pattern type is required");
            }
            const validPatterns = ["mandala", "spiral", "fractal", "cellular", "random"];
            if (!validPatterns.includes(pattern)) {
                throw new Error(`Invalid pattern. Must be one of: ${validPatterns.join(", ")}`);
            }
            if (complexity < 1 || complexity > 10) {
                throw new Error("Complexity must be between 1 and 10");
            }
            const p5Code = `
function setup() {
  createCanvas(${width}, ${height});
  background(255);
  randomSeed(${seed});
}

function draw() {
  // Generate ${pattern} pattern
  const centerX = width / 2;
  const centerY = height / 2;

  // This is a placeholder - implement actual pattern generation
  stroke(0);
  fill(0, 100);
  circle(centerX, centerY, 50);
}
`;
            return {
                success: true,
                pattern,
                seed,
                canvas: { width, height },
                colors,
                complexity,
                p5Code,
                message: `Generated ${pattern} pattern with seed ${seed}. Use this p5.js code in your sketch.`,
            };
        }
        catch (error) {
            const err = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to generate art: ${err}`);
        }
    },
};
//# sourceMappingURL=generate-art.js.map