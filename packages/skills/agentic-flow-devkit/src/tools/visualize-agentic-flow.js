const buildMermaid = (agents, edges) => {
    const lines = ["flowchart LR"];
    for (const agent of agents) {
        lines.push(`  ${agent.id}[\"${agent.role}: ${agent.objective}\"]`);
    }
    for (const edge of edges) {
        const label = edge.payload ? `|${edge.payload}|` : "";
        lines.push(`  ${edge.from} -->${label} ${edge.to}`);
    }
    return lines.join("\n");
};
export const VisualizeAgenticFlowTool = {
    name: "visualize-agentic-flow",
    description: "Create an orchestration map (Mermaid + GUI layout schema) for multi-agent task execution.",
    inputSchema: {
        type: "object",
        properties: {
            flowName: {
                type: "string",
                description: "Name of the orchestration flow",
            },
            agents: {
                type: "array",
                description: "Ordered list of participating agents",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        role: { type: "string" },
                        objective: { type: "string" },
                    },
                    required: ["id", "role", "objective"],
                },
            },
            edges: {
                type: "array",
                description: "Directed flow connections between agents",
                items: {
                    type: "object",
                    properties: {
                        from: { type: "string" },
                        to: { type: "string" },
                        payload: { type: "string" },
                    },
                    required: ["from", "to"],
                },
            },
        },
        required: ["flowName", "agents", "edges"],
    },
    async handler(input) {
        const { flowName, agents, edges } = input;
        const mermaid = buildMermaid(agents, edges);
        return {
            success: true,
            tool: "visualize-agentic-flow",
            flowName,
            mermaid,
            guiLayout: {
                canvas: "orchestration-board",
                lanes: ["intake", "planning", "execution", "qa", "release"],
                nodes: agents,
                links: edges,
            },
            suggestedUiPanels: [
                "Flow topology",
                "Agent directives",
                "Live task state",
                "Blockers and retries",
            ],
        };
    },
};
//# sourceMappingURL=visualize-agentic-flow.js.map