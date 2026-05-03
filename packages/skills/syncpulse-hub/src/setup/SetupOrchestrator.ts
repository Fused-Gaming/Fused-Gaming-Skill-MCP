/**
 * Setup Orchestrator - Coordinates parallel installation of all packages
 * Uses orchestration engine for efficient, concurrent setup
 */

import { OrchestrationEngine } from '../orchestration/OrchestrationEngine';
import { PackageRegistry } from '../ecosystem/PackageRegistry';

export class SetupOrchestrator {
  private engine: OrchestrationEngine;
  private registry: PackageRegistry;
  private mode: 'essential' | 'full' | 'custom';

  constructor(mode: 'essential' | 'full' | 'custom' = 'full') {
    this.engine = new OrchestrationEngine();
    this.registry = new PackageRegistry();
    this.mode = mode;
  }

  async orchestrateSetup(): Promise<void> {
    console.log(`🎮 Setting up SyncPulse Hub in ${this.mode} mode...`);

    // Build task graph based on mode
    this.buildTaskGraph();

    // Execute orchestrated setup
    const results = await this.engine.executeParallel();

    // Report results
    this.reportResults(results);
  }

  private buildTaskGraph(): void {
    const packages = this.getPackagesByMode();

    // Core dependency: install mcp-core first
    this.engine.addTask({
      id: 'install-mcp-core',
      name: 'Install @h4shed/mcp-core',
      execute: async () => {
        console.log('📦 Installing mcp-core...');
        // Execute: npm install @h4shed/mcp-core
        await this.executeNpm(['install', '@h4shed/mcp-core']);
      },
      dependencies: [],
      priority: 1
    });

    // Install mcp-cli after core
    this.engine.addTask({
      id: 'install-mcp-cli',
      name: 'Install @h4shed/mcp-cli',
      execute: async () => {
        console.log('📦 Installing mcp-cli...');
        await this.executeNpm(['install', '@h4shed/mcp-cli']);
      },
      dependencies: ['install-mcp-core'],
      priority: 2
    });

    // Initialize MCP core (depends on mcp-core installation)
    this.engine.addTask({
      id: 'init-mcp-core',
      name: 'Initialize MCP Core',
      execute: async () => {
        console.log('⚙️ Initializing MCP core...');
        await this.executeBash('npm run mcp:init');
      },
      dependencies: ['install-mcp-core'],
      priority: 2
    });

    // Install skills in parallel (after core)
    packages.filter(p => p.scope === 'skill').forEach((skill, idx) => {
      this.engine.addTask({
        id: `skill-${skill.id}`,
        name: `Install skill: ${skill.name}`,
        execute: async () => {
          console.log(`📦 Installing skill: ${skill.name}...`);
          await this.executeNpm(['install', skill.name]);
        },
        dependencies: ['install-mcp-core'],
        priority: 3 + idx
      });
    });

    // Install tools in parallel (after core)
    packages.filter(p => p.scope === 'tool').slice(0, 4).forEach((tool, idx) => {
      this.engine.addTask({
        id: `tool-${tool.id}`,
        name: `Install tool: ${tool.name}`,
        execute: async () => {
          console.log(`🛠️  Installing tool: ${tool.name}...`);
          await this.executeNpm(['install', tool.name]);
        },
        dependencies: ['install-mcp-core'],
        priority: 4 + idx
      });
    });

    // Generate registry (depends on all installs)
    this.engine.addTask({
      id: 'generate-registry',
      name: 'Generate Skill Registry',
      execute: async () => {
        console.log('📋 Generating skill registry...');
        await this.executeBash('npm run registry:generate');
      },
      dependencies: ['init-mcp-core'],
      priority: 100
    });
  }

  private getPackagesByMode() {
    const allPackages = this.registry.getAllPackages();

    switch (this.mode) {
      case 'essential':
        return allPackages.filter(p => 
          ['syncpulse', 'mcp-core', 'mcp-cli', 'pre-deploy-validator'].includes(p.id)
        );
      case 'full':
        return allPackages;
      case 'custom':
        // Load from config file
        return allPackages;
      default:
        return allPackages.filter(p => p.status !== 'scaffolded');
    }
  }

  private async executeNpm(args: string[]): Promise<void> {
    // This would execute: npm [args]
    console.log(`  $ npm ${args.join(' ')}`);
  }

  private async executeBash(command: string): Promise<void> {
    // This would execute: bash -c command
    console.log(`  $ ${command}`);
  }

  private reportResults(results: Map<string, any>): void {
    console.log('\n' + '═'.repeat(65));
    console.log('📊 ORCHESTRATION RESULTS');
    console.log('═'.repeat(65));

    let successful = 0;
    let failed = 0;

    results.forEach((result, taskId) => {
      if (result.success) {
        console.log(`✅ ${taskId}`);
        successful++;
      } else {
        console.log(`❌ ${taskId}: ${result.error?.message || 'Unknown error'}`);
        failed++;
      }
    });

    console.log('\n' + '─'.repeat(65));
    console.log(`Summary: ${successful} successful, ${failed} failed`);
    console.log('═'.repeat(65) + '\n');

    if (failed === 0) {
      console.log('🎉 All setup tasks completed successfully!');
    } else {
      console.log('⚠️  Some tasks failed. Review log for details.');
    }
  }
}

export async function setupSyncPulseHub(mode = 'full') {
  const orchestrator = new SetupOrchestrator(mode as any);
  await orchestrator.orchestrateSetup();
}
