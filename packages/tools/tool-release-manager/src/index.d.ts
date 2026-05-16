export interface ReleaseConfig {
    versionType: 'major' | 'minor' | 'patch';
    releaseDate: string;
    description: string;
    features: string[];
    bugFixes: string[];
    breakingChanges: string[];
    contributors?: string[];
}
export interface VersionInfo {
    version: string;
    majorVersion: number;
    minorVersion: number;
    patchVersion: number;
    releaseDate: string;
    buildNumber: number;
}
export declare class ReleaseManager {
    private rootDir;
    private versionFilePath;
    private packageJsonPath;
    constructor(rootDir?: string);
    getCurrentVersion(): Promise<VersionInfo>;
    calculateNextVersion(current: VersionInfo, type: 'major' | 'minor' | 'patch'): VersionInfo;
    updateVersionFiles(newVersion: VersionInfo): Promise<void>;
    generateReleaseNotes(config: ReleaseConfig, version: VersionInfo): Promise<string>;
    createGitTag(version: string, notes: string): Promise<void>;
    getCommitStats(lastTag?: string): Promise<{
        totalCommits: number;
        filesChanged: number;
        linesAdded: number;
        linesDeleted: number;
    }>;
    validateConfig(config: ReleaseConfig): string[];
}
export default ReleaseManager;
//# sourceMappingURL=index.d.ts.map