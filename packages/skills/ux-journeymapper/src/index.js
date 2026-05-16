import { MapUserJourneyTool } from "./tools/map-user-journey.js";
export const UxJourneymapperSkill = {
    name: "ux-journeymapper",
    version: "1.0.0",
    description: "Create UX journey maps with pain points, touchpoints, and opportunities.",
    tools: [MapUserJourneyTool],
    async initialize(_config) {
        console.log("[UX Journeymapper] Skill initialized");
    },
    async cleanup() {
        console.log("[UX Journeymapper] Skill cleaned up");
    },
};
export default UxJourneymapperSkill;
//# sourceMappingURL=index.js.map