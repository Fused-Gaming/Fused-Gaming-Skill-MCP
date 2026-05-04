#!/usr/bin/env node

/**
 * SyncPulse Hub Postinstall Hook
 *
 * Runs automatically after npm install to:
 * 1. Check if SyncPulse Hub is installed
 * 2. Set up auto-update checking
 * 3. Display quick start instructions
 * 4. Check for existing installations that can be updated
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SYNCPULSE_CONFIG = path.join(process.env.HOME || process.env.USERPROFILE || '.', '.syncpulse-hub');
const STATE_FILE = path.join(SYNCPULSE_CONFIG, '.state.json');
const AUTO_UPDATE_CONFIG = path.join(SYNCPULSE_CONFIG, '.autoupdate.json');

// Ensure config directory exists
if (!fs.existsSync(SYNCPULSE_CONFIG)) {
  fs.mkdirSync(SYNCPULSE_CONFIG, { recursive: true });
}

/**
 * Check for installed packages and their versions
 */
function checkInstalledPackages() {
  const packages = [
    '@h4shed/mcp-core',
    '@h4shed/mcp-cli',
    '@h4shed/skill-syncpulse',
    '@h4shed/syncpulse-hub'
  ];

  const installed = {};

  packages.forEach(pkg => {
    try {
      const result = execSync(`npm list ${pkg} --depth=0 2>/dev/null`, {
        encoding: 'utf-8',
        stdio: 'pipe'
      }).trim();

      const match = result.match(/\s+(\S+)\s+(.+)/);
      if (match) {
        installed[pkg] = match[2];
      }
    } catch (e) {
      // Package not installed
    }
  });

  return installed;
}

/**
 * Check for package updates
 */
function checkForUpdates() {
  const updates = [];
  const packages = [
    '@h4shed/mcp-core',
    '@h4shed/mcp-cli',
    '@h4shed/skill-syncpulse',
    '@h4shed/syncpulse-hub'
  ];

  packages.forEach(pkg => {
    try {
      const current = execSync(`npm view ${pkg} version --depth=0 2>/dev/null`, {
        encoding: 'utf-8'
      }).trim();

      const installed = execSync(`npm list ${pkg} --depth=0 2>/dev/null`, {
        encoding: 'utf-8',
        stdio: 'pipe'
      }).match(/\s+(\S+)\s+([0-9.]+)/);

      if (installed && installed[2] && installed[2] !== current) {
        updates.push({
          package: pkg,
          current: installed[2],
          latest: current,
          command: `npm install ${pkg}@latest`
        });
      }
    } catch (e) {
      // Ignore errors
    }
  });

  return updates;
}

/**
 * Initialize state file
 */
function initializeState() {
  const state = {
    installed: true,
    installedAt: new Date().toISOString(),
    installMode: 'full',
    lastUpdatedAt: null,
    updateCount: 0,
    packages: Object.keys(checkInstalledPackages())
  };

  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  return state;
}

/**
 * Setup auto-update configuration
 */
function setupAutoUpdate() {
  if (fs.existsSync(AUTO_UPDATE_CONFIG)) {
    return JSON.parse(fs.readFileSync(AUTO_UPDATE_CONFIG, 'utf-8'));
  }

  const config = {
    enabled: true,
    checkOnSessionStart: true,
    notifyOnUpdates: true,
    autoUploadAvailable: false,
    lastCheck: null,
    checkInterval: 86400,
    severityFilter: ['critical', 'major']
  };

  fs.writeFileSync(AUTO_UPDATE_CONFIG, JSON.stringify(config, null, 2));
  return config;
}

/**
 * Display welcome message with quick start
 */
function displayWelcome() {
  const installed = checkInstalledPackages();
  const updates = checkForUpdates();

  console.log('');
  console.log('═════════════════════════════════════════════════════════════════');
  console.log('  🎮 SyncPulse Hub - Fused Gaming Ecosystem Orchestrator');
  console.log('═════════════════════════════════════════════════════════════════');
  console.log('');

  if (Object.keys(installed).length > 0) {
    console.log('✅ Installed Packages:');
    Object.entries(installed).forEach(([pkg, version]) => {
      console.log(`   • ${pkg} @ ${version}`);
    });
    console.log('');
  }

  if (updates.length > 0) {
    console.log('⬆️  Available Updates:');
    updates.forEach(update => {
      console.log(`   • ${update.package}: ${update.current} → ${update.latest}`);
    });
    console.log('');
    console.log('💡 Update all packages:');
    console.log('   npm update @h4shed/mcp-* @h4shed/skill-*');
    console.log('');
  }

  console.log('🚀 Quick Start:');
  console.log('   npm run syncpulse:hub:setup              # Full installation');
  console.log('   npm run syncpulse:hub:setup:essential    # Minimal setup');
  console.log('   npm run validate:deployment              # Pre-merge checks');
  console.log('');

  console.log('📚 Documentation:');
  console.log('   https://github.com/fused-gaming/fused-gaming-skill-mcp/tree/main/packages/skills/syncpulse-hub');
  console.log('');

  console.log('✨ Auto-update checking: Enabled');
  console.log('   You will be notified of updates in new Claude chat sessions');
  console.log('');
}

/**
 * Main execution
 */
try {
  // Initialize state
  initializeState();

  // Setup auto-update
  setupAutoUpdate();

  // Display welcome message
  displayWelcome();

} catch (error) {
  // Silently fail postinstall so it doesn't block npm install
  if (process.env.DEBUG) {
    console.error('Postinstall hook error:', error.message);
  }
}
