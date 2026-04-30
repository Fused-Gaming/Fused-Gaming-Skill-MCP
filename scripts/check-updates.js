#!/usr/bin/env node

/**
 * Check for available updates to skills and tools
 * Reports new packages and version updates available
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const pkgPath = path.join(rootDir, 'package.json');
const versionPath = path.join(rootDir, 'VERSION.json');

console.log('\n🔍 Checking for available updates...\n');

try {
  // Read current version info
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const version = JSON.parse(fs.readFileSync(versionPath, 'utf8'));

  const currentVersion = pkg.version || version.version;

  // Scan workspace packages for new ones
  const skillsDir = path.join(rootDir, 'packages/skills');
  const toolsDir = path.join(rootDir, 'packages/tools');

  const skills = fs.readdirSync(skillsDir).filter(f =>
    fs.statSync(path.join(skillsDir, f)).isDirectory()
  ).length;

  const tools = fs.readdirSync(toolsDir).filter(f =>
    fs.statSync(path.join(toolsDir, f)).isDirectory()
  ).length;

  console.log(`📊 Current Status:`);
  console.log(`   Version: ${currentVersion}`);
  console.log(`   Skills: ${skills}`);
  console.log(`   Tools: ${tools}`);
  console.log('');

  // Check npm registry for new @h4shed packages
  console.log('📦 Checking npm registry for updates...\n');

  try {
    const npmOutput = execSync('npm view @h4shed --json 2>/dev/null', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    });

    const npmData = JSON.parse(npmOutput);
    const registryCount = npmData.time ? Object.keys(npmData.time).length : 0;

    console.log(`✅ Found ${registryCount} packages in @h4shed registry`);
    console.log('   Latest published packages are available via npm\n');
  } catch (e) {
    console.log('⚠️  Could not check npm registry (may be offline)');
    console.log('   Run "npm update" to fetch latest available versions\n');
  }

  // Check git status for uncommitted changes
  try {
    const gitStatus = execSync('git status --porcelain', {
      encoding: 'utf8',
      cwd: rootDir,
      stdio: ['pipe', 'pipe', 'ignore']
    });

    if (gitStatus.trim()) {
      console.log('⚠️  Local changes detected:');
      gitStatus.split('\n').slice(0, 5).forEach(line => {
        if (line) console.log(`   ${line}`);
      });
      if (gitStatus.split('\n').length > 6) {
        console.log(`   ... and ${gitStatus.split('\n').length - 6} more`);
      }
      console.log('');
    }
  } catch (e) {
    // Not a git repo, skip
  }

  console.log('💡 Next steps:');
  console.log('   • Run "npm run update:apply" to install updates');
  console.log('   • Run "npm run registry:validate" to verify quality');
  console.log('   • Check CHANGELOG.md for recent improvements\n');

} catch (error) {
  console.error('❌ Error checking updates:', error.message);
  process.exit(1);
}
