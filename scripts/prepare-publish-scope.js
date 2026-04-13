#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const rootPkgPath = path.join(rootDir, 'package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));

const rawScope = process.env.NPM_SCOPE?.trim();
if (!rawScope) {
  console.log('NPM_SCOPE not set; keeping existing package names.');
  process.exit(0);
}

const normalizedScope = rawScope.replace(/^@/, '');
if (!normalizedScope) {
  console.error('NPM_SCOPE is empty after normalization.');
  process.exit(1);
}

const scopePrefix = `@${normalizedScope}/`;
const workspacePatterns = Array.isArray(rootPkg.workspaces) ? rootPkg.workspaces : [];

const packageFiles = [rootPkgPath];
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

const renameMap = new Map();
const packageJsons = packageFiles.map((pkgPath) => {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (typeof pkg.name === 'string' && pkg.name.includes('/')) {
    const oldName = pkg.name;
    const unscopedName = oldName.split('/').slice(1).join('/');
    const newName = `${scopePrefix}${unscopedName}`;
    renameMap.set(oldName, newName);
    pkg.name = newName;
  }
  return { pkgPath, pkg };
});

for (const item of packageJsons) {
  for (const depField of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    const deps = item.pkg[depField];
    if (!deps || typeof deps !== 'object') continue;

    for (const [depName, depVersion] of Object.entries(deps)) {
      const remappedName = renameMap.get(depName);
      if (remappedName) {
        delete deps[depName];
        deps[remappedName] = depVersion;
      }
    }
  }

  fs.writeFileSync(item.pkgPath, `${JSON.stringify(item.pkg, null, 2)}\n`);
}

console.log(`Prepared ${packageJsons.length} package manifests for scope ${scopePrefix}`);
