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
  const packageDir = path.relative(rootDir, path.dirname(pkgPath)).replace(/\\/g, '/');
  return { pkgPath, packageDir, pkg };
});

function getChangedFiles() {
  const explicitBase = process.env.VERSION_BUMP_BASE_REF;
  const githubBefore = process.env.GITHUB_EVENT_BEFORE;
  const zeroSha = /^0+$/;
  const baseRef = explicitBase || (githubBefore && !zeroSha.test(githubBefore) ? githubBefore : null);
  const diffRange = baseRef ? `${baseRef}..HEAD` : 'HEAD~1..HEAD';

  try {
    const out = execSync(`git diff --name-only ${diffRange}`, {
      stdio: 'pipe',
      encoding: 'utf8'
    }).trim();
    return out ? out.split('\n').filter(Boolean) : [];
  } catch (error) {
    const stderr = String(error.stderr || error.message || '').trim();
    console.warn(
      `Unable to determine changed files from "${diffRange}". Falling back to all workspace packages.${stderr ? `\n${stderr}` : ''}`
    );
    return null;
  }
}

const changedFiles = getChangedFiles();
const targetRecords = Array.isArray(changedFiles)
  ? packageRecords.filter((record) =>
      changedFiles.some((changedPath) => changedPath === record.packageDir || changedPath.startsWith(`${record.packageDir}/`))
    )
  : packageRecords;

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

function applyPatchBump(records) {
  for (const record of records) {
    record.pkg.version = bumpPatch(record.pkg.version);
  }

  const versionMap = new Map(packageRecords.map((record) => [record.pkg.name, record.pkg.version]));
  for (const record of packageRecords) {
    for (const depField of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
      const deps = record.pkg[depField];
      if (!deps || typeof deps !== 'object') continue;

      for (const depName of Object.keys(deps)) {
        if (versionMap.has(depName)) {
          deps[depName] = versionMap.get(depName);
        }
      }
    }
  }
}

let duplicateSpecs = forceBump ? ['forced-bump'] : checkAlreadyPublished(targetRecords);
let bumps = 0;

while (duplicateSpecs.length) {
  if (bumps >= maxBumps) {
    console.error(`Reached max bump attempts (${maxBumps}) while versions are still published:`);
    for (const spec of duplicateSpecs) {
      console.error(` - ${spec}`);
    }
    process.exit(1);
  }

  const snapshot = targetRecords.map((record) => `${record.pkg.name}@${record.pkg.version}`).join(', ');
  applyPatchBump(targetRecords);
  bumps += 1;

  const nextSnapshot = targetRecords.map((record) => `${record.pkg.name}@${record.pkg.version}`).join(', ');
  console.log(`Auto-bumped changed workspace versions: ${snapshot} -> ${nextSnapshot}`);

  duplicateSpecs = checkAlreadyPublished(targetRecords);
}

if (isDryRun) {
  console.log(`Dry run complete. Changed workspace bump attempts: ${bumps}.`);
  process.exit(0);
}

for (const record of packageRecords) {
  fs.writeFileSync(record.pkgPath, `${JSON.stringify(record.pkg, null, 2)}\n`);
}

if (bumps === 0) {
  if (Array.isArray(changedFiles)) {
    console.log(`No auto-bump needed; ${targetRecords.length} changed workspace package(s) are publishable.`);
  } else {
    console.log(`No auto-bump needed; all workspace packages are publishable.`);
  }
} else {
  console.log('Auto-bump complete for changed workspace packages.');
}
