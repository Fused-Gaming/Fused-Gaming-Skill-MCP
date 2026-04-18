/**
 * LinkedIn Master Journalist Skill
 * Draft polished LinkedIn release and thought-leadership posts.
 */

import type { Skill, SkillConfig } from "@h4shed/mcp-core";
import { DraftLinkedinPostTool } from "./tools/draft-linkedin-post.js";

export const LinkedinMasterJournalistSkill: Skill = {
  name: "linkedin-master-journalist",
  version: "1.0.0",
  description: "Draft polished LinkedIn release and thought-leadership posts.",
  tools: [DraftLinkedinPostTool],

  async initialize(_config: SkillConfig): Promise<void> {
    console.log("[LinkedIn Master Journalist] Skill initialized");
  },

  async cleanup(): Promise<void> {
    console.log("[LinkedIn Master Journalist] Skill cleaned up");
  },
};

export default LinkedinMasterJournalistSkill;
