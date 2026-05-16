import { promises as fs } from 'fs';
import { execFileSync } from 'child_process';
import path from 'path';
export class ReleaseManager {
    constructor(rootDir = process.cwd()) {
        this.rootDir = rootDir;
        this.versionFilePath = path.join(rootDir, 'VERSION.json');
        this.packageJsonPath = path.join(rootDir, 'package.json');
    }
    async getCurrentVersion() {
        const content = await fs.readFile(this.versionFilePath, 'utf-8');
        const parsed = JSON.parse(content);
        return {
            version: parsed.version,
            majorVersion: parsed.majorVersion,
            minorVersion: parsed.minorVersion,
            patchVersion: parsed.patchVersion,
            releaseDate: parsed.releaseDate,
            buildNumber: parsed.metadata?.buildNumber || 0,
        };
    }
    calculateNextVersion(current, type) {
        const next = { ...current };
        switch (type) {
            case 'major':
                next.majorVersion++;
                next.minorVersion = 0;
                next.patchVersion = 0;
                break;
            case 'minor':
                next.minorVersion++;
                next.patchVersion = 0;
                break;
            case 'patch':
                next.patchVersion++;
                break;
        }
        next.version = `${next.majorVersion}.${next.minorVersion}.${next.patchVersion}`;
        next.releaseDate = new Date().toISOString().split('T')[0];
        next.buildNumber++;
        return next;
    }
    async updateVersionFiles(newVersion) {
        const versionContent = await fs.readFile(this.versionFilePath, 'utf-8');
        const existing = JSON.parse(versionContent);
        const updated = {
            ...existing,
            version: newVersion.version,
            releaseDate: newVersion.releaseDate,
            status: 'stable',
            majorVersion: newVersion.majorVersion,
            minorVersion: newVersion.minorVersion,
            patchVersion: newVersion.patchVersion,
            prerelease: null,
            metadata: {
                ...existing.metadata,
                buildNumber: newVersion.buildNumber,
            },
        };
        await fs.writeFile(this.versionFilePath, JSON.stringify(updated, null, 2) + '\n');
        const pkgContent = await fs.readFile(this.packageJsonPath, 'utf-8');
        const pkg = JSON.parse(pkgContent);
        pkg.version = newVersion.version;
        await fs.writeFile(this.packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
    }
    async generateReleaseNotes(config, version) {
        const releaseNotes = `# 🚀 Release v${version.version} - ${config.description}
**Release Date:** ${config.releaseDate}
**Status:** 🟢 Production Ready
**Build Number:** ${version.buildNumber}

---

## 🎉 What's New in v${version.version}

### ✨ Features (${config.features.length})
${config.features.map((f) => `- ${f}`).join('\n')}

### 🐛 Bug Fixes (${config.bugFixes.length})
${config.bugFixes.length > 0 ? config.bugFixes.map((f) => `- ${f}`).join('\n') : '- No bug fixes in this release'}

${config.breakingChanges.length > 0 ? `### ⚠️ Breaking Changes (${config.breakingChanges.length})
${config.breakingChanges.map((f) => `- ${f}`).join('\n')}

` : ''}### 📊 Release Statistics

| Metric | Value |
|--------|-------|
| **Version** | ${version.version} |
| **Release Date** | ${config.releaseDate} |
| **Build Number** | ${version.buildNumber} |
| **Features** | ${config.features.length} |
| **Bug Fixes** | ${config.bugFixes.length} |
| **Breaking Changes** | ${config.breakingChanges.length} |
${config.contributors ? `| **Contributors** | ${config.contributors.join(', ')} |` : ''}

---

## 🚀 Next Steps

1. Review release notes and changelog
2. Test all features on target environment
3. Publish to npm registry
4. Create GitHub release
5. Post announcement to channels

---

**This release is production-ready and recommended for immediate adoption.**

---

Generated: ${new Date().toISOString()}`;
        return releaseNotes;
    }
    async createGitTag(version, notes) {
        try {
            const message = notes.split('\n')[0];
            execFileSync('git', ['add', 'VERSION.json', 'package.json'], { stdio: 'inherit' });
            execFileSync('git', ['commit', '-m', `chore: Bump version to v${version} for release`], {
                stdio: 'inherit',
            });
            execFileSync('git', ['tag', '-a', `v${version}`, '-m', message], {
                stdio: 'inherit',
            });
            console.log(`✅ Created git tag v${version}`);
        }
        catch (error) {
            console.error('Error creating git tag:', error);
            throw error;
        }
    }
    async getCommitStats(lastTag) {
        try {
            const range = lastTag ? `${lastTag}..HEAD` : 'HEAD~10..HEAD';
            const totalCommits = execFileSync('git', ['rev-list', '--count', range]).toString().trim();
            const diffStat = execFileSync('git', ['diff', '--stat', range]).toString();
            let filesChanged = 0;
            let linesAdded = 0;
            let linesDeleted = 0;
            const lines = diffStat.split('\n');
            for (const line of lines) {
                const match = line.match(/(\d+) files? changed(?:, (\d+) insertions?\(\+\))?(?:, (\d+) deletions?\(-\))?/);
                if (match) {
                    filesChanged = parseInt(match[1], 10);
                    linesAdded = parseInt(match[2] || '0', 10);
                    linesDeleted = parseInt(match[3] || '0', 10);
                }
            }
            return { totalCommits: parseInt(totalCommits, 10), filesChanged, linesAdded, linesDeleted };
        }
        catch {
            return { totalCommits: 0, filesChanged: 0, linesAdded: 0, linesDeleted: 0 };
        }
    }
    validateConfig(config) {
        const errors = [];
        if (!config.versionType) {
            errors.push('versionType is required (major, minor, or patch)');
        }
        if (!config.releaseDate) {
            errors.push('releaseDate is required');
        }
        if (!config.description || config.description.length < 10) {
            errors.push('description is required and must be at least 10 characters');
        }
        if (!Array.isArray(config.features) || config.features.length === 0) {
            errors.push('At least one feature is required');
        }
        return errors;
    }
}
export default ReleaseManager;
//# sourceMappingURL=index.js.map