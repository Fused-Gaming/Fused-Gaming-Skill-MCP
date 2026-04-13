/**
 * Multi Account Session Tracking Skill
 * Track session activity across multiple accounts and workstreams.
 */

import type { Skill, SkillConfig } from "@fused-gaming/mcp-core";
import { TrackSessionActivityTool } from "./tools/track-session-activity.js";

export const MultiAccountSessionTrackingSkill: Skill = {
  name: "multi-account-session-tracking",
  version: "1.0.0",
  description: "Track session activity across multiple accounts and workstreams.",
  tools: [TrackSessionActivityTool],

  async initialize(_config: SkillConfig): Promise<void> {
    console.log("[Multi Account Session Tracking] Skill initialized");
  },

  async cleanup(): Promise<void> {
    console.log("[Multi Account Session Tracking] Skill cleaned up");
  },
};

export default MultiAccountSessionTrackingSkill;
