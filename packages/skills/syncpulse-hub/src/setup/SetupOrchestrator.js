import { OrchestrationEngine } from '../orchestration/OrchestrationEngine';
import { PackageRegistry } from '../ecosystem/PackageRegistry';
export class SetupOrchestrator {
    constructor(mode = 'full') {
        this.engine = new OrchestrationEngine();
        this.registry = new PackageRegistry();
        this.mode = mode;
    }
    async orchestrateSetup() {
        console.log(`🎮 Setting up SyncPulse Hub in ${this.mode} mode...`);
        this.buildTaskGraph();
        const results = await this.engine.executeParallel();
        this.reportResults(results);
    }
    buildTaskGraph() {
        const packages = this.getPackagesByMode();
        this.engine.addTask({
            id: 'install-mcp-core',
            name: 'Install @h4shed/mcp-core',
            execute: async () => {
                console.log('📦 Installing mcp-core...');
                await this.executeNpm(['install', '@h4shed/mcp-core']);
            },
            dependencies: [],
            priority: 1
        });
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
    getPackagesByMode() {
        const allPackages = this.registry.getAllPackages();
        switch (this.mode) {
            case 'essential':
                return allPackages.filter(p => ['syncpulse', 'mcp-core', 'mcp-cli', 'pre-deploy-validator'].includes(p.id));
            case 'full':
                return allPackages;
            case 'custom':
                return allPackages;
            default:
                return allPackages.filter(p => p.status !== 'scaffolded');
        }
    }
    async executeNpm(args) {
        try {
            const { execSync } = await import('child_process');
            console.log(`  $ npm ${args.join(' ')}`);
            execSync(`npm ${args.join(' ')}`, { stdio: 'inherit' });
        }
        catch (error) {
            console.error(`Failed to execute npm command: ${error}`);
            throw error;
        }
    }
    async executeBash(command) {
        try {
            const { execSync } = await import('child_process');
            console.log(`  $ ${command}`);
            execSync(command, { stdio: 'inherit', shell: '/bin/bash' });
        }
        catch (error) {
            console.error(`Failed to execute bash command: ${error}`);
            throw error;
        }
    }
    reportResults(results) {
        console.log('\n' + '═'.repeat(65));
        console.log('📊 ORCHESTRATION RESULTS');
        console.log('═'.repeat(65));
        let successful = 0;
        let failed = 0;
        results.forEach((result, taskId) => {
            if (result.success) {
                console.log(`✅ ${taskId}`);
                successful++;
            }
            else {
                console.log(`❌ ${taskId}: ${result.error?.message || 'Unknown error'}`);
                failed++;
            }
        });
        console.log('\n' + '─'.repeat(65));
        console.log(`Summary: ${successful} successful, ${failed} failed`);
        console.log('═'.repeat(65) + '\n');
        if (failed === 0) {
            console.log('🎉 All setup tasks completed successfully!');
        }
        else {
            console.log('⚠️  Some tasks failed. Review log for details.');
        }
    }
}
export async function setupSyncPulseHub(mode = 'full') {
    const orchestrator = new SetupOrchestrator(mode);
    await orchestrator.orchestrateSetup();
}
//# sourceMappingURL=SetupOrchestrator.js.map