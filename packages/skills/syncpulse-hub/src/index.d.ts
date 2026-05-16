export declare class SyncPulseHub {
    private registry;
    private orchestrator;
    private validator;
    private updateChecker;
    private mode;
    constructor(mode?: 'essential' | 'full' | 'custom');
    setup(): Promise<void>;
    checkUpdates(): Promise<void>;
    getEcosystemInfo(): {
        total: number;
        skills: number;
        tools: number;
        core: number;
        implemented: number;
        partial: number;
        scaffolded: number;
    };
    private printSuccessSummary;
}
export declare function initializeSyncPulseHub(mode?: string): Promise<SyncPulseHub>;
export { PackageRegistry } from './ecosystem/PackageRegistry';
export { OrchestrationEngine } from './orchestration/OrchestrationEngine';
export { SetupOrchestrator } from './setup/SetupOrchestrator';
export { DeploymentValidator } from './validation/DeploymentValidator';
export { UpdateChecker } from './updates/UpdateChecker';
//# sourceMappingURL=index.d.ts.map