/**
 * Daily Review Skill
 * Produce daily project reviews and execution summaries.
 */

import type { Skill, SkillConfig } from "@fused-gaming/mcp-core";
import { GenerateDailyReviewTool } from "./tools/generate-daily-review.js";

export const DailyReviewSkill: Skill = {
  name: "daily-review",
  version: "1.0.0",
  description: "Produce daily project reviews and execution summaries.",
  tools: [GenerateDailyReviewTool],

  async initialize(_config: SkillConfig): Promise<void> {
    console.log("[Daily Review] Skill initialized");
  },

  async cleanup(): Promise<void> {
    console.log("[Daily Review] Skill cleaned up");
  },
};

export default DailyReviewSkill;
