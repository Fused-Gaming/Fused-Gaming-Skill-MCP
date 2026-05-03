/**
 * 🎮 Fused Gaming SyncPulse Hub - Centralized Installation & Orchestration
 * 
 * Unified system for managing 63 packages:
 * - 31 Skills (@h4shed/skill-*)
 * - 28 Tools (@h4shed/tool-*)
 * - 3 Core packages (@h4shed/mcp-*, @h4shed/docs)
 * - 1 Session manager (@h4shed/multi-account-session-tracking)
 */

import { PackageRegistry } from './ecosystem/PackageRegistry';
import { SetupOrchestrator } from './setup/SetupOrchestrator';
import { DeploymentValidator } from './validation/DeploymentValidator';
import { UpdateChecker } from './updates/UpdateChecker';

export class SyncPulseHub {
  private registry: PackageRegistry;
  private orchestrator: SetupOrchestrator;
  private validator: DeploymentValidator;
  private updateChecker: UpdateChecker;
  private mode: 'essential' | 'full' | 'custom' = 'full';

  constructor(mode: 'essential' | 'full' | 'custom' = 'full') {
    this.mode = mode;
    this.registry = new PackageRegistry();
    this.orchestrator = new SetupOrchestrator(mode);
    this.validator = new DeploymentValidator();
    this.updateChecker = new UpdateChecker();

    console.log(`🎮 SyncPulse Hub initialized (mode: ${mode})`);
  }

  /**
   * Complete orchestrated setup of all packages
   */
  async setup(): Promise<void> {
    console.log('\n' + '═'.repeat(70));
    console.log('🚀 SYNCPULSE HUB ORCHESTRATED SETUP');
    console.log('═'.repeat(70) + '\n');

    // Step 1: Setup orchestration
    console.log('📋 Step 1: Beginning orchestrated setup...\n');
    await this.orchestrator.orchestrateSetup();

    // Step 2: Validate deployment
    console.log('📋 Step 2: Running pre-deployment validation...\n');
    const validationResult = await this.validator.validateFullSetup();

    if (!validationResult.passed) {
      throw new Error('Deployment validation failed');
    }

    // Step 3: Check for updates
    console.log('📋 Step 3: Checking for package updates...\n');
    await this.updateChecker.checkForUpdates();

    console.log('\n' + '═'.repeat(70));
    console.log('✅ SYNCPULSE HUB SETUP COMPLETE!');
    console.log('═'.repeat(70) + '\n');

    this.printSuccessSummary();
  }

  /**
   * Check for package updates
   */
  async checkUpdates(): Promise<void> {
    const result = await this.updateChecker.checkForUpdates();
    
    if (result.criticalUpdates.length > 0) {
      console.log('\n⚠️  Critical updates available. Install immediately:');
      result.criticalUpdates.forEach(u => {
        console.log(`   npm install ${u.name}@latest`);
      });
    }
  }

  /**
   * Get ecosystem information
   */
  getEcosystemInfo() {
    const packages = this.registry.getAllPackages();
    return {
      total: packages.length,
      skills: packages.filter(p => p.scope === 'skill').length,
      tools: packages.filter(p => p.scope === 'tool').length,
      core: packages.filter(p => p.scope === 'core').length,
      implemented: packages.filter(p => p.status === 'implemented').length,
      partial: packages.filter(p => p.status === 'partial').length,
      scaffolded: packages.filter(p => p.status === 'scaffolded').length
    };
  }

  private printSuccessSummary(): void {
    const info = this.getEcosystemInfo();

    console.log('📊 INSTALLATION SUMMARY:');
    console.log(`   Total Packages: ${info.total}`);
    console.log(`   - Skills: ${info.skills}`);
    console.log(`   - Tools: ${info.tools}`);
    console.log(`   - Core: ${info.core}`);
    console.log(`\n📈 IMPLEMENTATION STATUS:`);
    console.log(`   - Fully Implemented: ${info.implemented}`);
    console.log(`   - Partially Implemented: ${info.partial}`);
    console.log(`   - Scaffolded: ${info.scaffolded}`);
    console.log(`\n🎯 NEXT STEPS:`);
    console.log(`   1. Review configuration: cat .syncpulse-hub.config.json`);
    console.log(`   2. List installed packages: npm ls --depth=0 | grep @h4shed`);
    console.log(`   3. Check for updates: npm run update:check`);
    console.log(`   4. View skill registry: npm run registry:view`);
    console.log(`\n📚 DOCUMENTATION:`);
    console.log(`   - Architecture: SYNCPULSE_INTEGRATION_STRATEGY.md`);
    console.log(`   - Status: REVISED_ASSESSMENT_POST_INSTALL.md`);
    console.log(`   - CLI: npm run mcp:install`);
  }
}

// Export for CLI usage
export async function initializeSyncPulseHub(mode: string = 'full') {
  const hub = new SyncPulseHub(mode as any);
  await hub.setup();
  return hub;
}

// Export modules
export { PackageRegistry } from './ecosystem/PackageRegistry';
export { OrchestrationEngine } from './orchestration/OrchestrationEngine';
export { SetupOrchestrator } from './setup/SetupOrchestrator';
export { DeploymentValidator } from './validation/DeploymentValidator';
export { UpdateChecker } from './updates/UpdateChecker';

console.log('🎮 SyncPulse Hub module loaded');
