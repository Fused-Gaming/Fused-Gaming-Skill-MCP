#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const rootPkgPath = path.join(rootDir, 'package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
const workspacePatterns = Array.isArray(rootPkg.workspaces) ? rootPkg.workspaces : [];

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

if (!packageFiles.length) {
  console.error('No workspace package.json files found for preflight publish check.');
  process.exit(1);
}

const alreadyPublished = [];
for (const pkgPath of packageFiles) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (!pkg.name || !pkg.version) continue;

  const spec = `${pkg.name}@${pkg.version}`;
  try {
    execSync(`npm view ${JSON.stringify(spec)} version`, {
      stdio: 'pipe',
      encoding: 'utf8'
    });
    alreadyPublished.push(spec);
  } catch {
    // npm view returns non-zero when the version does not exist, which is expected.
  }
}

if (alreadyPublished.length) {
  console.error('Preflight publish check failed. These versions already exist on npm:');
  for (const spec of alreadyPublished) {
    console.error(` - ${spec}`);
  }
  console.error('\nBump versions before publishing to avoid E403 publish failures.');
  process.exit(1);
}

console.log(`Preflight publish check passed for ${packageFiles.length} workspace package(s).`);
