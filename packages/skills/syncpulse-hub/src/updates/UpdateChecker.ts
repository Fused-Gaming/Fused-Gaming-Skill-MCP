/**
 * Auto-Update Checker
 * Checks for new versions of packages in each chat session
 * Reports available updates to users
 */

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

export class UpdateChecker {
  private installedPackages: Map<string, string> = new Map();
  private updateCheckIntervalHours: number = 24;
  private lastCheckFile: string = '.syncpulse-hub.last-update-check';

  async checkForUpdates(): Promise<UpdateCheckResult> {
    console.log('[INFO] Checking for package updates...');

    const result: UpdateCheckResult = {
      timestamp: new Date().toISOString(),
      checksPerformed: 0,
      updatesAvailable: [],
      criticalUpdates: [],
      totalUpdates: 0
    };

    // Core packages to always check
    const corePackages = [
      '@h4shed/mcp-core',
      '@h4shed/mcp-cli',
      '@h4shed/skill-syncpulse'
    ];

    // Check each package
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

  private async checkPackageUpdate(packageName: string): Promise<PackageUpdate | null> {
    try {
      // Get current version from package.json
      const currentVersion = await this.getCurrentVersion(packageName);
      
      // Get latest version from npm registry
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
    } catch (error) {
      console.error(`Failed to check ${packageName}:`, error);
      return null;
    }
  }

  private async getCurrentVersion(packageName: string): Promise<string> {
    // Simulate reading from package.json or npm ls
    const versionMap: Record<string, string> = {
      '@h4shed/mcp-core': '1.0.4',
      '@h4shed/mcp-cli': '1.0.4',
      '@h4shed/skill-syncpulse': '0.2.0'
    };
    return versionMap[packageName] || '0.0.0';
  }

  private async getLatestVersion(packageName: string): Promise<string> {
    // Simulate fetching from npm registry
    // In real implementation: npm view packageName version
    const latestMap: Record<string, string> = {
      '@h4shed/mcp-core': '1.0.5',
      '@h4shed/mcp-cli': '1.0.5',
      '@h4shed/skill-syncpulse': '0.3.0'
    };
    return latestMap[packageName] || '0.0.0';
  }

  private isNewer(latest: string, current: string): boolean {
    const [latestMajor, latestMinor, latestPatch] = latest.split('.').map(Number);
    const [currentMajor, currentMinor, currentPatch] = current.split('.').map(Number);

    if (latestMajor > currentMajor) return true;
    if (latestMajor === currentMajor && latestMinor > currentMinor) return true;
    if (latestMajor === currentMajor && latestMinor === currentMinor && latestPatch > currentPatch) return true;

    return false;
  }

  private calculateSeverity(current: string, latest: string): 'critical' | 'major' | 'minor' | 'patch' {
    const [currentMajor, currentMinor] = current.split('.').map(Number);
    const [latestMajor, latestMinor] = latest.split('.').map(Number);

    if (latestMajor > currentMajor) {
      if (latestMajor >= 2) return 'critical';
      return 'major';
    }
    if (latestMinor > currentMinor) return 'minor';
    return 'patch';
  }

  private reportUpdates(result: UpdateCheckResult): void {
    if (result.totalUpdates === 0) {
      console.log('[OK] All packages are up to date');
      return;
    }

    console.log(`\n[UPDATES] ${result.totalUpdates} update(s) available:\n`);

    // Critical updates
    if (result.criticalUpdates.length > 0) {
      console.log('[CRITICAL] CRITICAL UPDATES (install immediately):');
      result.criticalUpdates.forEach(update => {
        console.log(`  * ${update.name}: ${update.currentVersion} > ${update.latestVersion}`);
        console.log(`    npm install ${update.name}@latest`);
      });
      console.log();
    }

    // Other updates
    const otherUpdates = result.updatesAvailable.filter(
      u => u.severity !== 'critical'
    );

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
