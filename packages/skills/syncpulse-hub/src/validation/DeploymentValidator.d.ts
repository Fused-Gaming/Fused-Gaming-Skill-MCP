export interface ValidationResult {
    passed: boolean;
    timestamp: string;
    tests: TestResult[];
    summary: {
        total: number;
        passed: number;
        failed: number;
        skipped: number;
    };
}
export interface TestResult {
    name: string;
    status: 'passed' | 'failed' | 'skipped';
    duration: number;
    error?: string;
    output?: string;
}
export declare class DeploymentValidator {
    private results;
    private startTime;
    validateFullSetup(): Promise<ValidationResult>;
    private validateBuild;
    private validateTypeScript;
    private validateLinting;
    private validatePackageIntegrity;
    private validateSkillRegistry;
    private validateOrchestration;
    private validateSyncPulseCore;
    private createTest;
    private buildReport;
    private printReport;
}
export declare function validateDeployment(): Promise<ValidationResult>;
//# sourceMappingURL=DeploymentValidator.d.ts.map