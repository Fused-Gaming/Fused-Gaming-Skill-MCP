export declare class SetupOrchestrator {
    private engine;
    private registry;
    private mode;
    constructor(mode?: 'essential' | 'full' | 'custom');
    orchestrateSetup(): Promise<void>;
    private buildTaskGraph;
    private getPackagesByMode;
    private executeNpm;
    private executeBash;
    private reportResults;
}
export declare function setupSyncPulseHub(mode?: string): Promise<void>;
//# sourceMappingURL=SetupOrchestrator.d.ts.map