#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = new Set(process.argv.slice(2));
const isDryRun = args.has('--dry-run');
const forceBump = args.has('--force-bump');
const maxBumpsArg = [...args].find((arg) => arg.startsWith('--max-bumps='));
const maxBumps = Number.parseInt(maxBumpsArg?.split('=')[1] ?? '20', 10);

if (!Number.isInteger(maxBumps) || maxBumps < 0) {
  console.error('Invalid --max-bumps value. Use a non-negative integer.');
  process.exit(1);
}

const rootDir = process.cwd();
const rootPkgPath = path.join(rootDir, 'package.json');
const versionJsonPath = path.join(rootDir, 'VERSION.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));

function collectWorkspacePackagePaths(pkg) {
  const workspacePatterns = Array.isArray(pkg.workspaces) ? pkg.workspaces : [];
  const packageFiles = [];

  for (const pattern of workspacePatterns) {
    if (pattern.endsWith('/*')) {
      const dir = path.join(rootDir, pattern.slice(0, -2));
      if (!fs.existsSync(dir)) continue;

      for (const entry of fs.readdirSync(dir)) {
        const pkgPath = path.join(dir, entry, 'package.json');
        if (fs.existsSync(pkgPath)) {
          packageFiles.push(pkgPath);
        }
      }
    } else {
      const pkgPath = path.join(rootDir, pattern, 'package.json');
      if (fs.existsSync(pkgPath)) {
        packageFiles.push(pkgPath);
      }
    }
  }

  return packageFiles;
}

const workspacePackagePaths = collectWorkspacePackagePaths(rootPkg);
if (!workspacePackagePaths.length) {
  console.error('No workspace package.json files found.');
  process.exit(1);
}

const packageRecords = workspacePackagePaths.map((pkgPath) => {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  return { pkgPath, pkg };
});

function checkAlreadyPublished(records) {
  const duplicates = [];

  for (const record of records) {
    const { name, version } = record.pkg;
    if (!name || !version) continue;

    const spec = `${name}@${version}`;
    try {
      execSync(`npm view ${JSON.stringify(spec)} version`, {
        stdio: 'pipe',
        encoding: 'utf8'
      });
      duplicates.push(spec);
    } catch {
      // Missing version is expected and means publish is possible.
    }
  }

  return duplicates;
}

function bumpPatch(version) {
  const [core] = version.split('-');
  const [major, minor, patch] = core.split('.').map((v) => Number.parseInt(v, 10));
  if (![major, minor, patch].every(Number.isInteger)) {
    throw new Error(`Unsupported semver format: ${version}`);
  }
  return `${major}.${minor}.${patch + 1}`;
}

function applyVersion(nextVersion) {
  rootPkg.version = nextVersion;

  const internalNames = new Set(packageRecords.map((record) => record.pkg.name).filter(Boolean));
  for (const record of packageRecords) {
    record.pkg.version = nextVersion;

    for (const depField of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
      const deps = record.pkg[depField];
      if (!deps || typeof deps !== 'object') continue;

      for (const depName of Object.keys(deps)) {
        if (depName === rootPkg.name || internalNames.has(depName)) {
          deps[depName] = nextVersion;
        }
      }
    }
  }
}

let duplicateSpecs = forceBump ? ['forced-bump'] : checkAlreadyPublished(packageRecords);
let bumps = 0;

while (duplicateSpecs.length) {
  if (bumps >= maxBumps) {
    console.error(`Reached max bump attempts (${maxBumps}) while versions are still published:`);
    for (const spec of duplicateSpecs) {
      console.error(` - ${spec}`);
    }
    process.exit(1);
  }

  const currentVersion = rootPkg.version;
  const nextVersion = bumpPatch(currentVersion);
  applyVersion(nextVersion);
  bumps += 1;

  console.log(`Auto-bumped workspace versions: ${currentVersion} -> ${nextVersion}`);

  duplicateSpecs = checkAlreadyPublished(packageRecords);
}

if (isDryRun) {
  console.log(`Dry run complete. Final candidate version: ${rootPkg.version} (bumps applied: ${bumps}).`);
  process.exit(0);
}

fs.writeFileSync(rootPkgPath, `${JSON.stringify(rootPkg, null, 2)}\n`);
for (const record of packageRecords) {
  fs.writeFileSync(record.pkgPath, `${JSON.stringify(record.pkg, null, 2)}\n`);
}

if (bumps > 0 && fs.existsSync(versionJsonPath)) {
  const versionJson = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));
  const [major, minor, patch] = rootPkg.version.split('.').map((v) => Number.parseInt(v, 10));
  versionJson.version = rootPkg.version;
  versionJson.majorVersion = major;
  versionJson.minorVersion = minor;
  versionJson.patchVersion = patch;
  versionJson.prerelease = null;
  versionJson.releaseDate = new Date().toISOString().split('T')[0];

  if (versionJson.metadata) {
    versionJson.metadata.buildNumber = (versionJson.metadata.buildNumber || 1000) + bumps;
  }

  fs.writeFileSync(versionJsonPath, `${JSON.stringify(versionJson, null, 2)}\n`);
}

if (bumps === 0) {
  console.log(`No auto-bump needed; version ${rootPkg.version} is publishable.`);
} else {
  console.log(`Auto-bump complete. Updated manifests to ${rootPkg.version}.`);
}
