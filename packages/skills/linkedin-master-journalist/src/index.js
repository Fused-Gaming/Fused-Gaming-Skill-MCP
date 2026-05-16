import { DraftLinkedinPostTool } from "./tools/draft-linkedin-post.js";
import { VerifyHashtagsTool } from "./tools/verify-hashtags.js";
import { AnalyzeContentQualityTool } from "./tools/analyze-content-quality.js";
import { TrackContentPerformanceTool } from "./tools/track-content-performance.js";
export const LinkedinMasterJournalistSkill = {
    name: "linkedin-master-journalist",
    version: "1.0.1",
    description: "Draft polished LinkedIn release and thought-leadership posts.",
    tools: [
        DraftLinkedinPostTool,
        VerifyHashtagsTool,
        AnalyzeContentQualityTool,
        TrackContentPerformanceTool,
    ],
    async initialize(_config) {
        console.log("[LinkedIn Master Journalist] Skill initialized");
    },
    async cleanup() {
        console.log("[LinkedIn Master Journalist] Skill cleaned up");
    },
};
export default LinkedinMasterJournalistSkill;
//# sourceMappingURL=index.js.map