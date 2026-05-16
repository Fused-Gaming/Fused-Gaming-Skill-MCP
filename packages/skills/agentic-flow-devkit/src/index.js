import { VisualizeAgenticFlowTool } from "./tools/visualize-agentic-flow.js";
import { PlanTrailerRollsTool } from "./tools/plan-trailer-rolls.js";
export const AgenticFlowDevkitSkill = {
    name: "agentic-flow-devkit",
    version: "1.0.0",
    description: "Visualize agent orchestration flows and generate A/B-roll shot sourcing plans for trailer promotions.",
    tools: [VisualizeAgenticFlowTool, PlanTrailerRollsTool],
    async initialize(_config) {
        console.log("[Agentic Flow Devkit] Skill initialized");
    },
    async cleanup() {
        console.log("[Agentic Flow Devkit] Skill cleaned up");
    },
};
export default AgenticFlowDevkitSkill;
//# sourceMappingURL=index.js.map