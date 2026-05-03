/**
 * SyncPulse Hub - Centralized Package Registry
 * Manages all 63 packages (@h4shed scope)
 */

export interface Package {
  id: string;
  name: string;
  version: string;
  scope: string; // 'skill', 'tool', 'core'
  status: 'implemented' | 'partial' | 'scaffolded';
  dependencies: string[];
  entryPoint: string;
  description: string;
}

export class PackageRegistry {
  private packages: Map<string, Package>;
  private installed: Set<string>;

  constructor() {
    this.packages = new Map();
    this.installed = new Set();
    this.initializeRegistry();
  }

  private initializeRegistry() {
    // 31 Skills
    const skills = [
      { id: 'syncpulse', name: '@h4shed/skill-syncpulse', version: '0.2.0', status: 'implemented' },
      { id: 'underworld-writer', name: '@h4shed/skill-underworld-writer', version: '1.0.4', status: 'implemented' },
      { id: 'daily-review', name: '@h4shed/skill-daily-review', version: '1.0.2', status: 'partial' },
      { id: 'agentic-flow-devkit', name: '@h4shed/skill-agentic-flow-devkit', version: '1.0.1', status: 'partial' },
      { id: 'algorithmic-art', name: '@h4shed/skill-algorithmic-art', version: '1.0.4', status: 'partial' },
      { id: 'ascii-mockup', name: '@h4shed/skill-ascii-mockup', version: '1.0.4', status: 'partial' },
      { id: 'canvas-design', name: '@h4shed/skill-canvas-design', version: '1.0.4', status: 'partial' },
      { id: 'frontend-design', name: '@h4shed/skill-frontend-design', version: '1.0.4', status: 'partial' },
      { id: 'linkedin-journalist', name: '@h4shed/skill-linkedin-master-journalist', version: '1.0.2', status: 'partial' },
      { id: 'mcp-builder', name: '@h4shed/skill-mcp-builder', version: '1.0.4', status: 'partial' },
      { id: 'mermaid-terminal', name: '@h4shed/skill-mermaid-terminal', version: '1.0.2', status: 'partial' },
      { id: 'nft-art', name: '@h4shed/skill-nft-generative-art', version: '1.0.0', status: 'scaffolded' },
      { id: 'playwright', name: '@h4shed/skill-playwright-test-automation', version: '1.0.0', status: 'scaffolded' },
      { id: 'pre-deploy-validator', name: '@h4shed/skill-pre-deploy-validator', version: '1.0.4', status: 'partial' },
      { id: 'project-manager', name: '@h4shed/skill-project-manager', version: '1.0.2', status: 'partial' },
      { id: 'project-status', name: '@h4shed/skill-project-status-tool', version: '1.0.2', status: 'partial' },
      { id: 'skill-creator', name: '@h4shed/skill-skill-creator', version: '1.0.4', status: 'partial' },
      { id: 'smart-contracts', name: '@h4shed/skill-smart-contract-tools', version: '1.0.0', status: 'scaffolded' },
      { id: 'storybook', name: '@h4shed/skill-storybook-component-library', version: '1.0.0', status: 'scaffolded' },
      { id: 'style-dictionary', name: '@h4shed/skill-style-dictionary-system', version: '1.0.0', status: 'scaffolded' },
      { id: 'tailwindcss', name: '@h4shed/skill-tailwindcss-style-builder', version: '1.0.0', status: 'scaffolded' },
      { id: 'theme-factory', name: '@h4shed/skill-theme-factory', version: '1.0.4', status: 'partial' },
      { id: 'typescript-toolchain', name: '@h4shed/skill-typescript-toolchain', version: '1.0.0', status: 'scaffolded' },
      { id: 'vercel-nextjs', name: '@h4shed/skill-vercel-nextjs-deployment', version: '1.0.0', status: 'scaffolded' },
      { id: 'vite-bundler', name: '@h4shed/skill-vite-module-bundler', version: '1.0.0', status: 'scaffolded' },
      { id: 'svg-generator', name: '@h4shed/skill-svg-generator', version: '1.0.2', status: 'partial' },
      { id: 'ux-journeymapper', name: '@h4shed/skill-ux-journeymapper', version: '1.0.2', status: 'partial' },
      { id: 'multi-account', name: '@h4shed/multi-account-session-tracking', version: '1.0.2', status: 'partial' },
    ];

    skills.forEach(skill => {
      this.packages.set(skill.id, {
        id: skill.id,
        name: skill.name,
        version: skill.version,
        status: skill.status as 'implemented' | 'partial' | 'scaffolded',
        scope: 'skill',
        dependencies: ['@h4shed/mcp-core'],
        entryPoint: `dist/index.js`,
        description: skill.name
      });
    });
  }

  getAllPackages() {
    return Array.from(this.packages.values());
  }

  getPackagesByStatus(status: string) {
    return this.getAllPackages().filter(p => p.status === status);
  }

  markInstalled(id: string) {
    this.installed.add(id);
  }

  getInstalled() {
    return Array.from(this.installed);
  }

  async checkNpmRegistry(_packageName: string): Promise<string | null> {
    // Placeholder for npm registry check
    return null;
  }
}

export const registry = new PackageRegistry();
