export interface UpdateCheckResult {
    timestamp: string;
    checksPerformed: number;
    updatesAvailable: PackageUpdate[];
    criticalUpdates: PackageUpdate[];
    totalUpdates: number;
}
export interface PackageUpdate {
    name: string;
    currentVersion: string;
    latestVersion: string;
    severity: 'critical' | 'major' | 'minor' | 'patch';
    changelogUrl: string;
}
export declare class UpdateChecker {
    private installedPackages;
    private updateCheckIntervalHours;
    private lastCheckFile;
    checkForUpdates(): Promise<UpdateCheckResult>;
    private checkPackageUpdate;
    private getCurrentVersion;
    private getLatestVersion;
    private isNewer;
    private calculateSeverity;
    private reportUpdates;
}
export declare function checkUpdatesAutomatically(): Promise<UpdateCheckResult>;
//# sourceMappingURL=UpdateChecker.d.ts.map