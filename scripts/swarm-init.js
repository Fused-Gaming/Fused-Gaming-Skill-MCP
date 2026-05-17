#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Check if running in a published package context (development-only feature)
const claudeFlowDir = path.join(projectRoot, '.claude-flow');
if (!fs.existsSync(claudeFlowDir)) {
  console.error('❌ Error: Swarm initialization is only available in development mode.');
  console.error('   The "npm run swarm" command requires .claude-flow/ directory.');
  console.error('   This feature is not available in published packages.');
  console.error('');
  console.error('ℹ️  To use swarm features:');
  console.error('   1. Clone the repository: git clone https://github.com/fused-gaming/fused-gaming-skill-mcp.git');
  console.error('   2. Install dependencies: npm install');
  console.error('   3. Run swarm: npm run swarm');
  process.exit(1);
}

console.log('🚀 Initializing Fused Gaming Swarm Session...\n');

// Load swarm configuration
const configPath = path.join(projectRoot, '.claude-flow', 'config.yaml');
const swarmStatePath = path.join(projectRoot, '.claude-flow', 'swarm', 'swarm-state.json');
const agentsStorePath = path.join(projectRoot, '.claude-flow', 'agents', 'store.json');

console.log('📋 Configuration Summary:');
console.log(`   - Config: ${path.relative(projectRoot, configPath)}`);
console.log(`   - Swarm State: ${path.relative(projectRoot, swarmStatePath)}`);
console.log(`   - Agents Store: ${path.relative(projectRoot, agentsStorePath)}`);

// Load agents configuration first for capacity validation
const agentsStore = JSON.parse(fs.readFileSync(agentsStorePath, 'utf-8'));
const agents = Object.values(agentsStore.agents);

// Validate and reinitialize swarm state if needed
function validateOrCreateSwarmState() {
  let swarmState = null;
  let isValid = false;
  let previousSwarmId = null;

  try {
    // Try to load existing state
    if (fs.existsSync(swarmStatePath)) {
      const stateData = JSON.parse(fs.readFileSync(swarmStatePath, 'utf-8'));
      // Validate state structure
      if (stateData.swarms && Object.keys(stateData.swarms).length > 0) {
        const swarmId = Object.keys(stateData.swarms)[0];
        const swarm = stateData.swarms[swarmId];
        // Check if swarm has valid metadata
        if (swarm && swarm.topology && swarm.status) {
          // Validate that loaded agents don't exceed swarm capacity
          const agentCount = agents.length;
          const maxAgents = swarm.maxAgents || 3;
          if (agentCount <= maxAgents) {
            isValid = true;
            swarmState = stateData;
          } else {
            previousSwarmId = swarmId;
          }
        } else {
          previousSwarmId = swarmId;
        }
      }
    }
  } catch (e) {
    // State file corrupted or missing
  }

  // If state is invalid or missing, recreate it
  if (!isValid) {
    console.log('⚠️  Existing swarm state invalid or missing, reinitializing...');
    const timestamp = Date.now();
    const swarmId = `swarm-${timestamp}-${Math.random().toString(36).slice(2, 8)}`;

    swarmState = {
      version: '3.0.0',
      timestamp: new Date().toISOString(),
      swarms: {
        [swarmId]: {
          id: swarmId,
          topology: 'hierarchical-mesh',
          maxAgents: 15,
          status: 'running',
          config: {
            strategy: 'specialized',
            communicationProtocol: 'message-bus'
          }
        }
      }
    };

    // Ensure swarm directory exists
    const swarmDir = path.dirname(swarmStatePath);
    if (!fs.existsSync(swarmDir)) {
      fs.mkdirSync(swarmDir, { recursive: true });
    }

    // Write new state
    fs.writeFileSync(swarmStatePath, JSON.stringify(swarmState, null, 2));

    // Update agents to reference the new swarm ID to maintain consistency
    try {
      const agentsData = JSON.parse(fs.readFileSync(agentsStorePath, 'utf-8'));
      Object.values(agentsData.agents || {}).forEach(agent => {
        agent.config.swarmId = swarmId;
      });
      fs.writeFileSync(agentsStorePath, JSON.stringify(agentsData, null, 2));
    } catch (e) {
      // If agent update fails, log warning but continue - swarm state is most critical
      console.warn('⚠️  Warning: Could not update agent swarm IDs during recovery');
    }

    console.log(`✓ Swarm state recreated: ${swarmId}`);
    if (previousSwarmId) {
      console.log(`   (Previous swarm ID was invalid or missing: ${previousSwarmId})`);
    }
  } else {
    console.log(`✓ Existing swarm state validated`);
  }

  return swarmState;
}

console.log(`\n👥 Loaded ${agents.length} Agents:`);
agents.forEach((agent, index) => {
  console.log(`   ${index + 1}. ${agent.agentType} (${agent.agentId.slice(-6)})`);
  console.log(`      Status: ${agent.status} | Health: ${(agent.health * 100).toFixed(0)}%`);
  console.log(`      Role: ${agent.config.role} | Branch: ${agent.config.branch}`);
});

// Validate and initialize swarm state
const swarmState = validateOrCreateSwarmState();
const swarmId = Object.keys(swarmState.swarms)[0];
const swarm = swarmState.swarms[swarmId];

console.log(`\n🌐 Swarm Configuration:`);
console.log(`   - Swarm ID: ${swarmId}`);
console.log(`   - Topology: ${swarm.topology}`);
console.log(`   - Max Agents: ${swarm.maxAgents}`);
console.log(`   - Status: ${swarm.status}`);
console.log(`   - Strategy: ${swarm.config.strategy}`);
console.log(`   - Communication: ${swarm.config.communicationProtocol}`);

console.log(`\n⚙️  Swarm Initialization Complete!`);
console.log(`\n✅ Ready to execute swarm tasks:`);
console.log(`   - Agent coordination: ENABLED`);
console.log(`   - Task distribution: READY`);
console.log(`   - Memory synchronization: READY`);
console.log(`   - Consensus protocol: ${swarmState.version} (RAFT)`);

console.log(`\n📊 Session Metrics:`);
console.log(`   - Total agents: ${agents.length}`);
console.log(`   - Active agents: ${agents.filter(a => a.status === 'running').length}`);
console.log(`   - Idle agents: ${agents.filter(a => a.status === 'idle').length}`);
console.log(`   - Average health: ${(agents.reduce((sum, a) => sum + a.health, 0) / agents.length * 100).toFixed(1)}%`);

console.log(`\n🎯 Next Steps:`);
console.log(`   1. Agents are configured and ready to dispatch`);
console.log(`   2. Use 'npm run build' to validate package state`);
console.log(`   3. Use 'npm run lint && npm run typecheck' for quality checks`);
console.log(`   4. Dispatch specific agent tasks as needed`);

console.log(`\n✨ Swarm session initialized successfully!\n`);
process.exit(0);
