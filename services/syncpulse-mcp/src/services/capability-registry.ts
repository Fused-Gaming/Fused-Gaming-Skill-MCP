/**
 * CapabilityRegistry - Core service abstraction for capability data
 * Provides clean service contract for accessing capability metadata
 */

import {
  Capability,
  CapabilitySummary,
  CapabilitySearch,
  CapabilityRequirement,
  Resolution,
  CapabilityComparison,
  UpgradeCandidate,
  Deprecation,
  CompatibilityCheckRequest,
  CompatibilityCheckResult,
  RegistryHealth,
  PaginationResult,
} from '../schemas/types.js';

export interface CapabilityRegistry {
  /**
   * Search capabilities by query criteria
   */
  search(query: CapabilitySearch): Promise<PaginationResult<CapabilitySummary>>;

  /**
   * Get full capability details by ID and optional version
   */
  get(id: string, version?: string): Promise<Capability | null>;

  /**
   * List all versions of a capability
   */
  versions(id: string): Promise<{ version: string; releaseDate?: string }[]>;

  /**
   * Resolve capability requirements to matching candidates
   */
  resolve(requirement: CapabilityRequirement): Promise<Resolution>;

  /**
   * Compare multiple capabilities
   */
  compare(ids: string[]): Promise<CapabilityComparison>;

  /**
   * Find upgrade candidates for installed capabilities
   */
  upgrades(installed: { id: string; version: string }[]): Promise<UpgradeCandidate[]>;

  /**
   * Get deprecated capabilities matching filter
   */
  deprecations(filter?: { maxAge?: number; status?: string }): Promise<Deprecation[]>;

  /**
   * Check compatibility between capabilities
   */
  checkCompatibility(request: CompatibilityCheckRequest): Promise<CompatibilityCheckResult>;

  /**
   * Get registry health/status
   */
  health(): Promise<RegistryHealth>;
}

/**
 * Mock/development registry implementation
 * To be replaced with real data sources (npm, database, etc.)
 */
export class MockCapabilityRegistry implements CapabilityRegistry {
  private capabilities: Map<string, Capability> = new Map();

  constructor() {
    this.initializeMockData();
  }

  async search(query: CapabilitySearch): Promise<PaginationResult<CapabilitySummary>> {
    const results: CapabilitySummary[] = [];

    for (const [, capability] of this.capabilities) {
      let matches = true;

      if (query.query) {
        const lowerQuery = query.query.toLowerCase();
        matches =
          capability.name.toLowerCase().includes(lowerQuery) ||
          capability.description.toLowerCase().includes(lowerQuery) ||
          capability.id.toLowerCase().includes(lowerQuery);
      }

      if (matches && query.kind && !query.kind.includes(capability.kind)) {
        matches = false;
      }

      if (matches && query.provides) {
        matches = query.provides.some((p) => capability.provides.includes(p));
      }

      if (matches && query.riskTier && !query.riskTier.includes(capability.risk.tier)) {
        matches = false;
      }

      if (matches && query.status && !query.status.includes(capability.lifecycle.status)) {
        matches = false;
      }

      if (matches) {
        results.push({
          id: capability.id,
          kind: capability.kind,
          name: capability.name,
          version: capability.version.value,
          provides: capability.provides,
          riskTier: capability.risk.tier,
          status: capability.lifecycle.status,
        });
      }
    }

    const limit = query.limit || 20;
    return {
      items: results.slice(0, limit),
      totalCount: results.length,
      hasMore: results.length > limit,
    };
  }

  async get(id: string, version?: string): Promise<Capability | null> {
    const key = version ? `${id}@${version}` : id;
    return this.capabilities.get(key) || null;
  }

  async versions(
    id: string,
  ): Promise<{ version: string; releaseDate?: string }[]> {
    const versions: { version: string; releaseDate?: string }[] = [];
    for (const [, cap] of this.capabilities) {
      if (cap.id === id) {
        versions.push({
          version: cap.version.value,
          releaseDate: cap.provenance.releaseHistory?.[0]?.date,
        });
      }
    }
    return versions;
  }

  async resolve(requirement: CapabilityRequirement): Promise<Resolution> {
    const matching: Capability[] = [];

    for (const [, capability] of this.capabilities) {
      const providesRequired = requirement.provides.every((p) =>
        capability.provides.includes(p),
      );

      if (providesRequired) {
        const riskOk = !requirement.constraints?.maxRisk ||
          this.riskCompare(capability.risk.tier, requirement.constraints.maxRisk) <= 0;

        if (riskOk) {
          matching.push(capability);
        }
      }
    }

    return {
      preferred: matching.slice(0, 1),
      alternatives: matching.slice(1, 3),
      alreadyAvailable: [],
      upgradeCandidates: [],
      gaps: matching.length === 0 ? requirement.provides : [],
      compatibility: { score: matching.length > 0 ? 100 : 0, issues: [] },
      risk: { aggregate: 'P1', perCapability: {} },
      evidence: {
        reasoning: `Found ${matching.length} capabilities matching requirements`,
        sources: ['registry'],
        timestamp: new Date().toISOString(),
      },
    };
  }

  async compare(ids: string[]): Promise<CapabilityComparison> {
    const candidates: Capability[] = [];

    for (const id of ids) {
      const cap = await this.get(id);
      if (cap) {
        candidates.push(cap);
      }
    }

    return {
      candidates,
      comparison: {
        coverage: {},
        version: candidates.reduce((acc, c) => ({ ...acc, [c.id]: c.version.value }), {}),
        compatibility: {},
        risk: candidates.reduce((acc, c) => ({ ...acc, [c.id]: c.risk.tier }), {}),
        quality: candidates.reduce((acc, c) => ({
          ...acc,
          [c.id]: c.quality.verificationRate,
        }), {}),
        maintenance: candidates.reduce(
          (acc, c) => ({ ...acc, [c.id]: !c.lifecycle.deprecated }),
          {},
        ),
        economics: candidates.reduce((acc, c) => ({
          ...acc,
          [c.id]: c.economics.expectedCostDelta || 0,
        }), {}),
        provenance: candidates.reduce((acc, c) => ({
          ...acc,
          [c.id]: c.provenance.verified,
        }), {}),
      },
    };
  }

  async upgrades(
    installed: { id: string; version: string }[],
  ): Promise<UpgradeCandidate[]> {
    const candidates: UpgradeCandidate[] = [];

    for (const inst of installed) {
      const current = await this.get(inst.id, inst.version);
      if (current) {
        const versions = await this.versions(inst.id);
        const newerVersions = versions.filter(
          (v) => this.compareVersions(v.version, inst.version) > 0,
        );

        if (newerVersions.length > 0) {
          const recommended = await this.get(inst.id, newerVersions[0].version);
          candidates.push({
            current,
            candidates: recommended ? [recommended] : [],
            recommended,
            reasoning: `Newer version available: ${newerVersions[0].version}`,
            riskAssessment: 'Low risk - patch level increment',
          });
        }
      }
    }

    return candidates;
  }

  async deprecations(_filter?: { maxAge?: number; status?: string }): Promise<Deprecation[]> {
    const deprecated: Deprecation[] = [];

    for (const [, capability] of this.capabilities) {
      if (capability.lifecycle.deprecated) {
        deprecated.push({
          current: capability,
          replacements: [],
          sunsetDate: capability.lifecycle.sunsetDate,
          reason: capability.lifecycle.deprecationReason || 'No longer maintained',
        });
      }
    }

    return deprecated;
  }

  async checkCompatibility(
    request: CompatibilityCheckRequest,
  ): Promise<CompatibilityCheckResult> {
    const issues: string[] = [];

    for (const capId of request.capabilities) {
      const cap = await this.get(capId);
      if (!cap) {
        issues.push(`Capability not found: ${capId}`);
      }
    }

    return {
      compatible: issues.length === 0,
      issues,
      warnings: [],
      recommendations: [],
    };
  }

  async health(): Promise<RegistryHealth> {
    const capabilities = Array.from(this.capabilities.values());
    const byKind = {} as Record<string, number>;
    const byRisk = {} as Record<string, number>;
    const byStatus = {} as Record<string, number>;

    for (const cap of capabilities) {
      byKind[cap.kind] = (byKind[cap.kind] || 0) + 1;
      byRisk[cap.risk.tier] = (byRisk[cap.risk.tier] || 0) + 1;
      byStatus[cap.lifecycle.status] = (byStatus[cap.lifecycle.status] || 0) + 1;
    }

    return {
      status: 'healthy',
      version: '0.1.0',
      totalCapabilities: capabilities.length,
      lastUpdated: new Date().toISOString(),
      capabilities: {
        byKind,
        byRisk,
        byStatus,
      },
    };
  }

  private initializeMockData(): void {
    const mockCapabilities: Capability[] = [
      {
        id: 'skill.react-production',
        kind: 'skill',
        name: 'React Production',
        description: 'Production-grade React development capability',
        version: { value: '4.3.1', channel: 'stable' },
        source: { publisher: 'syncpulse', package: null, repository: null },
        provides: ['frontend.react', 'frontend.typescript', 'accessibility'],
        requires: [],
        compatibility: { agents: ['frontend-developer', 'reviewer'] },
        permissions: { filesystem: 'read', network: 'none', execution: false },
        risk: { tier: 'P1', notes: 'Well-maintained, widely used' },
        quality: { verificationRate: 0.97, sampleSize: 412 },
        economics: { expectedCostDelta: -0.18 },
        provenance: { verified: true, integrity: null },
        lifecycle: { status: 'active', deprecated: false },
      },
      {
        id: 'tool.browser-e2e',
        kind: 'tool',
        name: 'Browser E2E Testing',
        description: 'End-to-end browser testing capabilities',
        version: { value: '2.1.0', channel: 'stable' },
        source: { publisher: 'syncpulse' },
        provides: ['browser.e2e', 'testing.automation'],
        requires: ['browser-runtime'],
        compatibility: { agents: ['tester', 'qa-engineer'] },
        permissions: { filesystem: 'write', network: 'write', execution: true },
        risk: { tier: 'P2' },
        quality: { verificationRate: 0.95, sampleSize: 250 },
        economics: { expectedCostDelta: 0 },
        provenance: { verified: true },
        lifecycle: { status: 'active', deprecated: false },
      },
    ];

    for (const cap of mockCapabilities) {
      this.capabilities.set(cap.id, cap);
      this.capabilities.set(`${cap.id}@${cap.version.value}`, cap);
    }
  }

  private riskCompare(a: string, b: string): number {
    const order = ['P0', 'P1', 'P2', 'P3', 'P4'];
    return order.indexOf(a) - order.indexOf(b);
  }

  private compareVersions(a: string, b: string): number {
    const [aMajor, aMinor, aPatch] = a.split('.').map(Number);
    const [bMajor, bMinor, bPatch] = b.split('.').map(Number);

    if (aMajor !== bMajor) return aMajor - bMajor;
    if (aMinor !== bMinor) return aMinor - bMinor;
    return aPatch - bPatch;
  }
}
