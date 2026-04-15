#!/usr/bin/env node

/**
 * Ensure workspace package versions are publishable.
 * - Checks npm for each workspace package@version.
 * - If already published, bumps patch version.
 * - Rewrites local workspace dependency ranges to bumped versions.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const defaultWorkspaceRoots = ['packages/core', 'packages/cli', 'packages/skills'];

function findWorkspacePackageJsons() {
  const files = [];

  for (const root of defaultWorkspaceRoots) {
    const absRoot = path.join(repoRoot, root);
    if (!fs.existsSync(absRoot)) continue;

    const entries = fs.readdirSync(absRoot, { withFileTypes: true });
    for (const entry of entries) {
      const candidate = entry.isDirectory()
        ? path.join(absRoot, entry.name, 'package.json')
        : path.join(absRoot, 'package.json');

      if (fs.existsSync(candidate) && candidate.endsWith('package.json')) {
        files.push(candidate);
      }
    }

    if (fs.existsSync(path.join(absRoot, 'package.json'))) {
      files.push(path.join(absRoot, 'package.json'));
    }
  }

  return [...new Set(files)];
}

function npmVersionExists(name, version) {
  try {
    const out = execSync(`npm view ${JSON.stringify(`${name}@${version}`)} version --json`, {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8'
    }).trim();

    if (!out) return false;
    const parsed = JSON.parse(out);
    return Boolean(parsed);
  } catch (error) {
    const stderr = String(error.stderr || error.message || '');
    if (/E404|404/.test(stderr)) return false;

    console.error(`❌ Failed to check npm for ${name}@${version}`);
    console.error(stderr.trim());
    process.exit(1);
  }
}

function bumpPatch(version) {
  const [core] = version.split('-');
  const [major, minor, patch] = core.split('.').map((n) => parseInt(n, 10));
  return `${major}.${minor}.${patch + 1}`;
}

const packageFiles = findWorkspacePackageJsons();
const packages = packageFiles.map((file) => {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  return { file, name: json.name, version: json.version, json };
});

const changed = [];
for (const pkg of packages) {
  if (!pkg.name || !pkg.version) continue;
  if (npmVersionExists(pkg.name, pkg.version)) {
    const nextVersion = bumpPatch(pkg.version);
    pkg.json.version = nextVersion;
    changed.push({ name: pkg.name, from: pkg.version, to: nextVersion, file: pkg.file });
    pkg.version = nextVersion;
  }
}

const versionMap = new Map(packages.map((p) => [p.name, p.version]));
for (const pkg of packages) {
  for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    const deps = pkg.json[field];
    if (!deps) continue;

    for (const depName of Object.keys(deps)) {
      if (versionMap.has(depName)) {
        deps[depName] = `^${versionMap.get(depName)}`;
      }
    }
  }
}

for (const pkg of packages) {
  fs.writeFileSync(pkg.file, `${JSON.stringify(pkg.json, null, 2)}\n`);
}

if (changed.length === 0) {
  console.log('✅ All workspace package versions are publishable (no bump needed).');
} else {
  console.log('⚠️ Bumped workspace package versions already present on npm:');
  for (const item of changed) {
    console.log(` - ${item.name}: ${item.from} -> ${item.to}`);
  }
}
