/**
 * Flow Field Tool
 * Creates particle flow field visualizations
 */

import type { ToolDefinition } from "@fused-gaming/mcp-core";

export const createFlowFieldTool: ToolDefinition = {
  name: "create-flow-field",
  description:
    "Create a particle flow field visualization with Perlin noise or other algorithms",
  inputSchema: {
    type: "object",
    properties: {
      algorithm: {
        type: "string",
        description: "Flow algorithm: perlin-noise, curl-noise, force-field, or custom",
      },
      particles: {
        type: "number",
        description: "Number of particles (default: 5000)",
      },
      speed: {
        type: "number",
        description: "Particle speed multiplier (0.1 to 10, default: 1)",
      },
      scale: {
        type: "number",
        description: "Noise scale (default: 0.005)",
      },
      trailLength: {
        type: "number",
        description: "Trail fade length in frames (0-100, default: 50)",
      },
      width: {
        type: "number",
        description: "Canvas width in pixels (default: 1024)",
      },
      height: {
        type: "number",
        description: "Canvas height in pixels (default: 768)",
      },
    },
    required: ["algorithm"],
  },

  async handler(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const {
      algorithm,
      particles = 5000,
      speed = 1,
      scale = 0.005,
      trailLength = 50,
      width = 1024,
      height = 768,
    } = input as {
      algorithm: string;
      particles?: number;
      speed?: number;
      scale?: number;
      trailLength?: number;
      width?: number;
      height?: number;
    };

    try {
      // Validate inputs
      if (!algorithm) {
        throw new Error("Algorithm type is required");
      }

      const validAlgorithms = ["perlin-noise", "curl-noise", "force-field", "custom"];
      if (!validAlgorithms.includes(algorithm)) {
        throw new Error(
          `Invalid algorithm. Must be one of: ${validAlgorithms.join(", ")}`
        );
      }

      if (particles < 1 || particles > 100000) {
        throw new Error("Particles must be between 1 and 100000");
      }

      if (speed < 0.1 || speed > 10) {
        throw new Error("Speed must be between 0.1 and 10");
      }

      // TODO: Implement actual flow field generation
      // For now, return template code

      const p5Code = `
let particles = [];
const particleCount = ${particles};
const flowScale = ${scale};
const speedMult = ${speed};
const trailFade = ${trailLength};

function setup() {
  createCanvas(${width}, ${height});
  background(0);

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      trail: []
    });
  }
}

function draw() {
  background(0, ${Math.max(5, 255 - trailLength * 2)});

  // Update particles based on ${algorithm} flow field
  for (let particle of particles) {
    // Get flow direction from ${algorithm}
    let angle = 0; // TODO: Calculate from flow field

    // Update position
    particle.x += cos(angle) * ${speed};
    particle.y += sin(angle) * ${speed};

    // Wrap around edges
    particle.x = (particle.x + width) % width;
    particle.y = (particle.y + height) % height;
  }
}
`;

      return {
        success: true,
        algorithm,
        parameters: {
          particles,
          speed,
          scale,
          trailLength,
          canvas: { width, height },
        },
        p5Code,
        message: `Created ${algorithm} flow field with ${particles} particles. Use this p5.js code in your sketch.`,
      };
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to create flow field: ${err}`);
    }
  },
};
