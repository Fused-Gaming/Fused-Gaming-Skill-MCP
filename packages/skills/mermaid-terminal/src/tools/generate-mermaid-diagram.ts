/**
 * Mermaid Terminal Tool
 * Generate terminal-friendly Mermaid diagrams and flowcharts.
 */

import type { ToolDefinition } from "@h4shed/mcp-core";

interface DiagramGenerationResult extends Record<string, unknown> {
  success: boolean;
  diagramType?: string;
  mermaidCode?: string;
  textPreview?: string;
  description?: string;
  error?: string;
}

/**
 * Analyzes objective text to determine the best diagram type
 */
function detectDiagramType(objective: string): string {
  const lowerObj = objective.toLowerCase();

  if (
    lowerObj.includes("sequence") ||
    lowerObj.includes("interaction") ||
    lowerObj.includes("message") ||
    lowerObj.includes("call")
  ) {
    return "sequenceDiagram";
  }

  if (
    lowerObj.includes("state") ||
    lowerObj.includes("machine") ||
    lowerObj.includes("transition") ||
    lowerObj.includes("status")
  ) {
    return "stateDiagram";
  }

  if (
    lowerObj.includes("dependency") ||
    lowerObj.includes("class") ||
    lowerObj.includes("object")
  ) {
    return "classDiagram";
  }

  if (lowerObj.includes("timeline") || lowerObj.includes("schedule")) {
    return "timeline";
  }

  // Default to flowchart for most objectives
  return "flowchart";
}

/**
 * Generates a basic flowchart diagram from objective description
 */
function generateFlowchart(objective: string, _context: string): string {
  const lines = objective.split(/[,;.]/);
  const steps = lines.filter((l) => l.trim().length > 0).slice(0, 5);

  let mermaid = "flowchart TD\n";
  mermaid += "    Start([Start]) --> Step1\n";

  steps.forEach((step, index) => {
    const stepNum = index + 1;
    const nextStepNum = stepNum + 1;
    const cleanedStep = step.trim().substring(0, 40); // Truncate for readability

    mermaid += `    Step${stepNum}["${cleanedStep}"]`;

    if (stepNum < steps.length) {
      mermaid += ` --> Step${nextStepNum}\n`;
    } else {
      mermaid += ` --> End([End])\n`;
    }
  });

  if (steps.length === 0) {
    mermaid +=
      "    Step1[\"Process: Analyze request\"] --> Step2[\"Generate solution\"] --> End([Complete])\n";
  }

  return mermaid;
}

/**
 * Generates a sequence diagram for interaction-based objectives
 */
function generateSequenceDiagram(objective: string, context: string): string {
  const actors = context.toLowerCase().includes("actor")
    ? context.split(",").slice(0, 3)
    : ["User", "System"];

  let mermaid = "sequenceDiagram\n";
  mermaid += `    participant A as ${actors[0] || "User"}\n`;
  mermaid += `    participant B as ${actors[1] || "System"}\n`;

  const actions = objective.split(/[,;]/);
  const interactions = actions.filter((a) => a.trim().length > 0).slice(0, 4);

  interactions.forEach((interaction, index) => {
    const arrow = index % 2 === 0 ? "->>+" : "-->>-";
    const cleaned = interaction.trim().substring(0, 35);
    const from = index % 2 === 0 ? "A" : "B";
    const to = index % 2 === 0 ? "B" : "A";
    mermaid += `    ${from}${arrow}${to}: ${cleaned}\n`;
  });

  if (interactions.length === 0) {
    mermaid += "    A->>+B: Request information\n";
    mermaid += "    B-->>-A: Return response\n";
  }

  return mermaid;
}

/**
 * Generates a state diagram for state-based objectives
 */
function generateStateDiagram(objective: string, _context: string): string {
  const states = objective
    .split(/[,;]/)
    .filter((s) => s.trim().length > 0)
    .map((s) => s.trim().substring(0, 20))
    .slice(0, 4);

  let mermaid = "stateDiagram-v2\n";
  mermaid += "    [*] --> State1\n";

  if (states.length === 0) {
    mermaid += '    State1 : "Initial State"\n';
    mermaid += "    State1 --> State2\n";
    mermaid += '    State2 : "Processing"\n';
    mermaid += "    State2 --> State3\n";
    mermaid += '    State3 : "Complete"\n';
    mermaid += "    State3 --> [*]\n";
  } else {
    states.forEach((state, index) => {
      const stateName = `State${index + 1}`;
      mermaid += `    ${stateName} : "${state}"\n`;

      if (index < states.length - 1) {
        mermaid += `    ${stateName} --> State${index + 2}\n`;
      }
    });

    mermaid += `    State${states.length} --> [*]\n`;
  }

  return mermaid;
}

/**
 * Generates appropriate diagram based on type
 */
function generateMermaidDiagram(
  objective: string,
  diagramType: string,
  context: string
): string {
  switch (diagramType) {
    case "sequenceDiagram":
      return generateSequenceDiagram(objective, context);
    case "stateDiagram":
      return generateStateDiagram(objective, context);
    case "flowchart":
    default:
      return generateFlowchart(objective, context);
  }
}

/**
 * Creates a text preview of the diagram for terminal display
 */
function createTextPreview(mermaidCode: string): string {
  const lines = mermaidCode.split("\n").slice(0, 10);
  return (
    "```mermaid\n" +
    lines.join("\n") +
    (lines.length < mermaidCode.split("\n").length
      ? "\n... (more diagram code)\n"
      : "\n") +
    "```"
  );
}

export const GenerateMermaidDiagramTool: ToolDefinition = {
  name: "generate-mermaid-diagram",
  description:
    "Generate terminal-friendly Mermaid diagrams and flowcharts based on an objective description.",
  inputSchema: {
    type: "object",
    properties: {
      objective: {
        type: "string",
        description:
          "Description of what the diagram should represent (e.g., 'User login flow, Data validation, API call')",
      },
      context: {
        type: "string",
        description:
          "Optional additional context or details about the diagram (e.g., 'Actors: Client, Server, Database')",
      },
      type: {
        type: "string",
        enum: ["flowchart", "sequenceDiagram", "stateDiagram", "auto"],
        description:
          "Type of diagram to generate. 'auto' detects the best type from objective.",
      },
    },
    required: ["objective"],
  },

  async handler(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      const {
        objective = "",
        context = "",
        type: specifiedType = "auto",
      } = input as {
        objective: string;
        context?: string;
        type?: string;
      };

      if (!objective || objective.trim().length === 0) {
        return {
          success: false,
          error: "objective parameter is required and must not be empty",
        };
      }

      // Determine diagram type
      const diagramType =
        specifiedType === "auto" ? detectDiagramType(objective) : specifiedType;

      // Generate the Mermaid diagram code
      const mermaidCode = generateMermaidDiagram(objective, diagramType, context);

      // Create a text preview for terminal display
      const textPreview = createTextPreview(mermaidCode);

      const result: DiagramGenerationResult = {
        success: true,
        diagramType,
        mermaidCode,
        textPreview,
        description: `Generated ${diagramType} diagram for: ${objective}`,
      };

      return result;
    } catch (error) {
      const err = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Failed to generate Mermaid diagram: ${err}`,
      };
    }
  },
};
