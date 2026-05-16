export interface Package {
    id: string;
    name: string;
    version: string;
    scope: string;
    status: 'implemented' | 'partial' | 'scaffolded';
    dependencies: string[];
    entryPoint: string;
    description: string;
}
export declare class PackageRegistry {
    private packages;
    private installed;
    constructor();
    private initializeRegistry;
    getAllPackages(): Package[];
    getPackagesByStatus(status: string): Package[];
    markInstalled(id: string): void;
    getInstalled(): string[];
    checkNpmRegistry(_packageName: string): Promise<string | null>;
}
export declare const registry: PackageRegistry;
//# sourceMappingURL=PackageRegistry.d.ts.map