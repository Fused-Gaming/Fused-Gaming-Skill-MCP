#!/usr/bin/env node

/**
 * Uniform workspace version bump
 * Sets all workspace packages to the same version
 */

const fs = require('fs');
const path = require('path');

const targetVersion = process.argv[2];

if (!targetVersion) {
  console.error('Usage: node uniform-bump-workspaces.js <version>');
  console.error('Example: node uniform-bump-workspaces.js 1.0.5');
  process.exit(1);
}

// Validate version format
if (!/^\d+\.\d+\.\d+/.test(targetVersion)) {
  console.error('Invalid version format. Expected semver (e.g., 1.0.5)');
  process.exit(1);
}

const repoRoot = path.resolve(__dirname, '..');
const workspacePaths = ['packages/core', 'packages/cli', 'packages/skills', 'packages/tools'];

let bumped = 0;

console.log(`\n🚀 Bumping all workspace packages to ${targetVersion}\n`);

function bumpPackage(pkgPath) {
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const oldVersion = pkg.version;
    pkg.version = targetVersion;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`✓ ${pkg.name || 'unnamed'}: ${oldVersion} → ${targetVersion}`);
    bumped++;
  } catch (e) {
    console.error(`✗ Error bumping ${pkgPath}: ${e.message}`);
  }
}

function findAndBumpPackages(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;

      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const pkgPath = path.join(fullPath, 'package.json');
        if (fs.existsSync(pkgPath)) {
          bumpPackage(pkgPath);
        }
        // Recurse into subdirectories (max 4 levels deep)
        const depth = fullPath.split('/').length - repoRoot.split('/').length;
        if (depth < 4) {
          findAndBumpPackages(fullPath);
        }
      }
    }
  } catch (e) {}
}

// Bump root package.json
const rootPkgPath = path.join(repoRoot, 'package.json');
bumpPackage(rootPkgPath);

// Bump workspace packages
for (const wsPath of workspacePaths) {
  const fullPath = path.join(repoRoot, wsPath);
  if (fs.existsSync(fullPath)) {
    findAndBumpPackages(fullPath);
  }
}

// Bump VERSION.json metadata
try {
  const versionPath = path.join(repoRoot, 'VERSION.json');
  if (fs.existsSync(versionPath)) {
    const version = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
    const parts = targetVersion.split('.');
    version.version = targetVersion;
    version.majorVersion = parseInt(parts[0], 10);
    version.minorVersion = parseInt(parts[1], 10);
    version.patchVersion = parseInt(parts[2], 10);
    version.releaseDate = new Date().toISOString().split('T')[0];
    fs.writeFileSync(versionPath, JSON.stringify(version, null, 2) + '\n');
    console.log(`✓ VERSION.json updated`);
  }
} catch (e) {
  console.error(`✗ Error updating VERSION.json: ${e.message}`);
}

console.log(`\n📊 Bumped ${bumped} packages to ${targetVersion}\n`);
console.log('Next steps:');
console.log('1. Review changes: git diff package.json');
console.log('2. Commit: git add -A && git commit -m "chore: bump all packages to ' + targetVersion + '"');
console.log('3. Tag: git tag -s v' + targetVersion + ' -m "Release ' + targetVersion + '"');
console.log('4. Push: git push origin main && git push origin v' + targetVersion + '\n');
