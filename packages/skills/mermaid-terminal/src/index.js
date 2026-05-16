import { GenerateMermaidDiagramTool } from "./tools/generate-mermaid-diagram.js";
export const MermaidTerminalSkill = {
    name: "mermaid-terminal",
    version: "1.0.0",
    description: "Generate terminal-friendly Mermaid diagrams and flowcharts.",
    tools: [GenerateMermaidDiagramTool],
    async initialize(_config) {
        console.log("[Mermaid Terminal] Skill initialized");
    },
    async cleanup() {
        console.log("[Mermaid Terminal] Skill cleaned up");
    },
};
export default MermaidTerminalSkill;
//# sourceMappingURL=index.js.map