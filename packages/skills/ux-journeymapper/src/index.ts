/**
 * UX Journeymapper Skill
 * Create UX journey maps with pain points, touchpoints, and opportunities.
 */

import type { Skill, SkillConfig } from "@h4shed/mcp-core";
import { MapUserJourneyTool } from "./tools/map-user-journey.js";

export const UxJourneymapperSkill: Skill = {
  name: "ux-journeymapper",
  version: "1.0.0",
  description: "Create UX journey maps with pain points, touchpoints, and opportunities.",
  tools: [MapUserJourneyTool],

  async initialize(_config: SkillConfig): Promise<void> {
    console.log("[UX Journeymapper] Skill initialized");
  },

  async cleanup(): Promise<void> {
    console.log("[UX Journeymapper] Skill cleaned up");
  },
};

export default UxJourneymapperSkill;
