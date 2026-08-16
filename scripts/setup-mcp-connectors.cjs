#!/usr/bin/env node

/**
 * Setup MCP Connectors
 * Initializes Claude MCP connector configuration for sync.vln.gg/mcp and skill.vln.gg/mcp
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PROJECT_ROOT = path.join(__dirname, '..');
const MCP_CONFIG_PATH = path.join(PROJECT_ROOT, '.mcp.json');
const ENV_TEMPLATE_PATH = path.join(PROJECT_ROOT, 'docs/MCP-CONNECTORS-ENV-TEMPLATE.md');

/**
 * Generate a secure random API key
 */
function generateApiKey(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Read existing MCP config or create default
 */
function readMcpConfig() {
  if (fs.existsSync(MCP_CONFIG_PATH)) {
    const content = fs.readFileSync(MCP_CONFIG_PATH, 'utf-8');
    return JSON.parse(content);
  }
  return { mcpServers: {} };
}

/**
 * Validate MCP config has required servers
 */
function validateMcpConfig(config) {
  const required = ['sync-coordinator', 'skill-repository'];
  const missing = required.filter(server => !config.mcpServers[server]);

  if (missing.length > 0) {
    console.error(`\n❌ Missing MCP servers: ${missing.join(', ')}`);
    return false;
  }

  // Validate server structure
  for (const [name, server] of Object.entries(config.mcpServers)) {
    if (!server.type) {
      console.error(`\n❌ Server '${name}' missing 'type'`);
      return false;
    }
    if (!server.url && server.type === 'sse') {
      console.error(`\n❌ Server '${name}' (type: sse) missing 'url'`);
      return false;
    }
  }

  return true;
}

/**
 * Display MCP server details
 */
function displayServerInfo(config) {
  console.log('\n📋 Configured MCP Servers:\n');

  for (const [name, server] of Object.entries(config.mcpServers)) {
    console.log(`  ✓ ${name}`);
    console.log(`    Type: ${server.type}`);
    if (server.url) {
      console.log(`    URL: ${server.url}`);
    }
    if (server.description) {
      console.log(`    Description: ${server.description}`);
    }
    console.log();
  }
}

/**
 * Generate environment setup instructions
 */
function generateSetupInstructions() {
  const syncKey = generateApiKey();
  const skillKey = generateApiKey();

  return `
# Environment Setup Instructions

Add these to your .env.local or environment variables:

\`\`\`bash
# Sync Coordinator
SYNC_MCP_API_KEY=${syncKey}

# Skill Repository
SKILL_MCP_API_KEY=${skillKey}

# Remote URLs (production)
SYNC_MCP_URL=https://sync.vln.gg/mcp
SKILL_MCP_URL=https://skill.vln.gg/mcp

# Optional: Development settings
NODE_ENV=development
CLAUDE_FLOW_MODE=v3
\`\`\`

For more configuration options, see: ${path.relative(PROJECT_ROOT, ENV_TEMPLATE_PATH)}
`;
}

/**
 * Check Docker installation
 */
function checkDocker() {
  try {
    require('child_process').execSync('docker --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Main setup
 */
function main() {
  console.log('\n🚀 Setting up MCP Connectors for Fused Gaming');
  console.log('═'.repeat(50));

  // 1. Validate .mcp.json
  console.log('\n1️⃣  Validating MCP configuration...');
  const mcpConfig = readMcpConfig();

  if (!validateMcpConfig(mcpConfig)) {
    console.log('\n⚠️  Please update .mcp.json with required servers.');
    process.exit(1);
  }

  console.log('   ✓ MCP configuration is valid');

  // 2. Display server info
  console.log('\n2️⃣  MCP Servers:');
  displayServerInfo(mcpConfig);

  // 3. Check Docker
  const dockerAvailable = checkDocker();
  console.log(`\n3️⃣  Docker: ${dockerAvailable ? '✓ Available' : '⚠️  Not installed'}`);
  if (!dockerAvailable) {
    console.log('   Docker is optional but recommended for containerized deployment');
  }

  // 4. Generate setup instructions
  console.log('\n4️⃣  Environment Setup:');
  const instructions = generateSetupInstructions();
  console.log(instructions);

  // 5. Display next steps
  console.log('\n5️⃣  Next Steps:');
  console.log('   a) Copy environment variables to .env.local');
  console.log('   b) Run: npm run build');
  console.log('   c) Run: npm run server:sync (in terminal 1)');
  console.log('   d) Run: npm run server:skills (in terminal 2)');
  if (dockerAvailable) {
    console.log('   e) Or: npm run docker:up (for Docker deployment)');
  }

  console.log('\n6️⃣  Verification:');
  console.log('   curl -H "Authorization: Bearer $SYNC_MCP_API_KEY" http://localhost:3002/mcp/health');
  console.log('   curl -H "Authorization: Bearer $SKILL_MCP_API_KEY" http://localhost:3003/mcp/health');

  console.log('\n📚 Documentation:');
  console.log('   - Setup Guide: docs/MCP-CONNECTORS-SETUP.md');
  console.log('   - Environment: docs/MCP-CONNECTORS-ENV-TEMPLATE.md');

  console.log('\n✅ MCP Connectors setup complete!');
  console.log('═'.repeat(50));
}

// Run setup
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

module.exports = { generateApiKey, validateMcpConfig };
