import type { Skill, SkillConfig } from "@fused-gaming/mcp-core";
import { VisualizeAgenticFlowTool } from "./tools/visualize-agentic-flow.js";
import { PlanTrailerRollsTool } from "./tools/plan-trailer-rolls.js";

export const AgenticFlowDevkitSkill: Skill = {
  name: "agentic-flow-devkit",
  version: "1.0.0",
  description:
    "Visualize agent orchestration flows and generate A/B-roll shot sourcing plans for trailer promotions.",
  tools: [VisualizeAgenticFlowTool, PlanTrailerRollsTool],

  async initialize(_config: SkillConfig): Promise<void> {
    console.log("[Agentic Flow Devkit] Skill initialized");
  },

  async cleanup(): Promise<void> {
    console.log("[Agentic Flow Devkit] Skill cleaned up");
  },
};

export default AgenticFlowDevkitSkill;
