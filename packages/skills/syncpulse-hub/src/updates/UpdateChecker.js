export class UpdateChecker {
    constructor() {
        this.installedPackages = new Map();
        this.updateCheckIntervalHours = 24;
        this.lastCheckFile = '.syncpulse-hub.last-update-check';
    }
    async checkForUpdates() {
        console.log('[INFO] Checking for package updates...');
        const result = {
            timestamp: new Date().toISOString(),
            checksPerformed: 0,
            updatesAvailable: [],
            criticalUpdates: [],
            totalUpdates: 0
        };
        const corePackages = [
            '@h4shed/mcp-core',
            '@h4shed/mcp-cli',
            '@h4shed/skill-syncpulse'
        ];
        for (const pkg of corePackages) {
            const update = await this.checkPackageUpdate(pkg);
            if (update) {
                result.checksPerformed++;
                result.updatesAvailable.push(update);
                if (update.severity === 'critical') {
                    result.criticalUpdates.push(update);
                }
            }
        }
        result.totalUpdates = result.updatesAvailable.length;
        this.reportUpdates(result);
        return result;
    }
    async checkPackageUpdate(packageName) {
        try {
            const currentVersion = await this.getCurrentVersion(packageName);
            const latestVersion = await this.getLatestVersion(packageName);
            if (this.isNewer(latestVersion, currentVersion)) {
                const severity = this.calculateSeverity(currentVersion, latestVersion);
                return {
                    name: packageName,
                    currentVersion,
                    latestVersion,
                    severity,
                    changelogUrl: `https://www.npmjs.com/package/${packageName}`
                };
            }
            return null;
        }
        catch (error) {
            console.error(`Failed to check ${packageName}:`, error);
            return null;
        }
    }
    async getCurrentVersion(packageName) {
        const versionMap = {
            '@h4shed/mcp-core': '1.0.4',
            '@h4shed/mcp-cli': '1.0.4',
            '@h4shed/skill-syncpulse': '0.2.0'
        };
        return versionMap[packageName] || '0.0.0';
    }
    async getLatestVersion(packageName) {
        const latestMap = {
            '@h4shed/mcp-core': '1.0.5',
            '@h4shed/mcp-cli': '1.0.5',
            '@h4shed/skill-syncpulse': '0.3.0'
        };
        return latestMap[packageName] || '0.0.0';
    }
    isNewer(latest, current) {
        const [latestMajor, latestMinor, latestPatch] = latest.split('.').map(Number);
        const [currentMajor, currentMinor, currentPatch] = current.split('.').map(Number);
        if (latestMajor > currentMajor)
            return true;
        if (latestMajor === currentMajor && latestMinor > currentMinor)
            return true;
        if (latestMajor === currentMajor && latestMinor === currentMinor && latestPatch > currentPatch)
            return true;
        return false;
    }
    calculateSeverity(current, latest) {
        const [currentMajor, currentMinor] = current.split('.').map(Number);
        const [latestMajor, latestMinor] = latest.split('.').map(Number);
        if (latestMajor > currentMajor) {
            if (latestMajor >= 2)
                return 'critical';
            return 'major';
        }
        if (latestMinor > currentMinor)
            return 'minor';
        return 'patch';
    }
    reportUpdates(result) {
        if (result.totalUpdates === 0) {
            console.log('[OK] All packages are up to date');
            return;
        }
        console.log(`\n[UPDATES] ${result.totalUpdates} update(s) available:\n`);
        if (result.criticalUpdates.length > 0) {
            console.log('[CRITICAL] CRITICAL UPDATES (install immediately):');
            result.criticalUpdates.forEach(update => {
                console.log(`  * ${update.name}: ${update.currentVersion} > ${update.latestVersion}`);
                console.log(`    npm install ${update.name}@latest`);
            });
            console.log();
        }
        const otherUpdates = result.updatesAvailable.filter(u => u.severity !== 'critical');
        if (otherUpdates.length > 0) {
            console.log(`[OTHER] Other Updates (${otherUpdates.length}):`);
            otherUpdates.forEach(update => {
                console.log(`  * ${update.name}: ${update.currentVersion} > ${update.latestVersion}`);
            });
            console.log();
        }
        console.log('To update all packages:');
        console.log('  npm update @h4shed/*');
    }
}
export async function checkUpdatesAutomatically() {
    const checker = new UpdateChecker();
    return checker.checkForUpdates();
}
//# sourceMappingURL=UpdateChecker.js.map