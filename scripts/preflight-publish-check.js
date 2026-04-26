#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = new Set(process.argv.slice(2));
const noBump = args.has('--no-bump');
const dryRun = args.has('--dry-run');

const rootDir = process.cwd();
const rootPkgPath = path.join(rootDir, 'package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
const workspacePatterns = Array.isArray(rootPkg.workspaces) ? rootPkg.workspaces : [];

const packageRecords = [];
for (const pattern of workspacePatterns) {
  if (pattern.endsWith('/*')) {
    const dir = path.join(rootDir, pattern.slice(0, -2));
    if (!fs.existsSync(dir)) continue;

    for (const entry of fs.readdirSync(dir)) {
      const pkgPath = path.join(dir, entry, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        packageRecords.push({ pkgPath, pkg, packageDir: path.relative(rootDir, path.dirname(pkgPath)).replace(/\\/g, '/') });
      }
    }
  } else {
    const pkgPath = path.join(rootDir, pattern, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      packageRecords.push({ pkgPath, pkg, packageDir: path.relative(rootDir, path.dirname(pkgPath)).replace(/\\/g, '/') });
    }
  }
}

if (!packageRecords.length) {
  console.error('No workspace package.json files found for preflight publish check.');
  process.exit(1);
}

function npmVersionExists(name, version) {
  try {
    execSync(`npm view ${JSON.stringify(`${name}@${version}`)} version`, {
      stdio: 'pipe',
      encoding: 'utf8'
    });
    return true;
  } catch {
    return false;
  }
}

function bumpPatch(version) {
  const [core] = version.split('-');
  const [major, minor, patch] = core.split('.').map((n) => parseInt(n, 10));
  return `${major}.${minor}.${patch + 1}`;
}

const alreadyPublished = [];
for (const record of packageRecords) {
  const { name, version } = record.pkg;
  if (!name || !version) continue;

  if (npmVersionExists(name, version)) {
    alreadyPublished.push({ name, version, record });
  }
}

if (!alreadyPublished.length) {
  console.log(`✅ Preflight publish check passed for ${packageRecords.length} workspace package(s).`);
  process.exit(0);
}

if (noBump) {
  console.error('Preflight publish check failed. These versions already exist on npm:');
  for (const item of alreadyPublished) {
    console.error(` - ${item.name}@${item.version}`);
  }
  console.error('\nRun without --no-bump to automatically fix versions.');
  process.exit(1);
}

console.log(`🔧 Found ${alreadyPublished.length} published version(s). Auto-bumping...`);

const versionMap = new Map(packageRecords.map((r) => [r.pkg.name, r.pkg.version]));

for (const item of alreadyPublished) {
  const { record } = item;
  const nextVersion = bumpPatch(record.pkg.version);
  console.log(` - ${record.pkg.name}: ${record.pkg.version} → ${nextVersion}`);
  record.pkg.version = nextVersion;
  versionMap.set(record.pkg.name, nextVersion);
}

for (const record of packageRecords) {
  for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    const deps = record.pkg[field];
    if (!deps) continue;

    for (const depName of Object.keys(deps)) {
      if (versionMap.has(depName)) {
        deps[depName] = `^${versionMap.get(depName)}`;
      }
    }
  }
}

if (!dryRun) {
  for (const record of packageRecords) {
    fs.writeFileSync(record.pkgPath, `${JSON.stringify(record.pkg, null, 2)}\n`);
  }
}

console.log(`\n✅ Workspace packages ready for publish.`);
if (dryRun) {
  console.log('(Dry run: no files were modified)');
}
