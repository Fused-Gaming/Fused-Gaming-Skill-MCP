import { validateDeploymentTool } from "./tools/validate-deployment.js";
export const preDeployValidatorSkill = {
    name: "pre-deploy-validator",
    version: "1.0.0",
    description: "Perform pre-deployment validation and quality checks to ensure production readiness",
    tools: [validateDeploymentTool],
    async initialize(_config) {
        console.log("[PreDeployValidator] Skill initialized");
    },
    async cleanup() {
        console.log("[PreDeployValidator] Skill cleaned up");
    },
};
export default preDeployValidatorSkill;
//# sourceMappingURL=index.js.map