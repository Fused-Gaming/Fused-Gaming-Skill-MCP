import { TrackSessionActivityTool } from "./tools/track-session-activity.js";
export const MultiAccountSessionTrackingSkill = {
    name: "multi-account-session-tracking",
    version: "1.0.0",
    description: "Track session activity across multiple accounts and workstreams.",
    tools: [TrackSessionActivityTool],
    async initialize(_config) {
        console.log("[Multi Account Session Tracking] Skill initialized");
    },
    async cleanup() {
        console.log("[Multi Account Session Tracking] Skill cleaned up");
    },
};
export default MultiAccountSessionTrackingSkill;
//# sourceMappingURL=index.js.map