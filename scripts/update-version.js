#!/usr/bin/env node

/**
 * Update VERSION.json when npm version is run
 *
 * Usage: npm version <major|minor|patch>
 * This script is called automatically via the "version" script in package.json
 */

const fs = require('fs');
const path = require('path');

try {
  // Read package.json to get current version
  const packageJsonPath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const version = packageJson.version;

  // Read VERSION.json
  const versionJsonPath = path.join(__dirname, '../VERSION.json');
  let versionJson = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));

  // Update version fields
  versionJson.version = version;
  versionJson.releaseDate = new Date().toISOString().split('T')[0];

  // Parse semantic version
  const versionParts = version.split('.');
  const major = versionParts[0].split('-')[0]; // Handle pre-release versions
  const minor = versionParts[1] || '0';
  const patchWithPre = versionParts[2] || '0';
  const patch = patchWithPre.split('-')[0];
  const prerelease = patchWithPre.includes('-') ? patchWithPre.split('-')[1] : null;

  versionJson.majorVersion = parseInt(major);
  versionJson.minorVersion = parseInt(minor);
  versionJson.patchVersion = parseInt(patch);
  versionJson.prerelease = prerelease;

  // Update metadata
  if (versionJson.metadata) {
    versionJson.metadata.buildNumber = (versionJson.metadata.buildNumber || 1000) + 1;
  }

  // Write updated VERSION.json
  fs.writeFileSync(versionJsonPath, JSON.stringify(versionJson, null, 2) + '\n');

  console.log(`✅ Updated VERSION.json to ${version}`);
  console.log(`   Release Date: ${versionJson.releaseDate}`);
  console.log(`   Build Number: ${versionJson.metadata?.buildNumber || 'N/A'}`);

  process.exit(0);
} catch (error) {
  console.error('❌ Failed to update VERSION.json:', error.message);
  process.exit(1);
}
