/**
 * Canonical SyncPulse Capability Schema
 * Normalized model for all capability kinds
 */

export type CapabilityKind =
  | 'plugin'
  | 'skill'
  | 'agent'
  | 'tool'
  | 'mcp-server'
  | 'model-profile'
  | 'policy'
  | 'hook'
  | 'reference'
  | 'workflow';

export type RiskTier = 'P0' | 'P1' | 'P2' | 'P3' | 'P4';
export type ReleaseChannel = 'stable' | 'beta' | 'alpha' | 'rc' | 'experimental';
export type LifecycleStatus = 'active' | 'maintenance' | 'deprecated' | 'archived';

export interface CapabilityVersion {
  value: string;
  channel: ReleaseChannel;
  releaseDate?: string;
}

export interface CapabilitySource {
  publisher: string;
  package?: string;
  repository?: string;
  url?: string;
}

export interface CapabilityCompatibility {
  agents?: string[];
  skills?: string[];
  tools?: string[];
  models?: string[];
  minNodeVersion?: string;
  maxNodeVersion?: string;
}

export interface CapabilityPermissions {
  filesystem?: 'read' | 'write' | 'none';
  network?: 'read' | 'write' | 'none';
  execution?: boolean;
  subprocess?: boolean;
  environment?: boolean;
}

export interface CapabilityRisk {
  tier: RiskTier;
  notes?: string;
  cves?: string[];
  dependencies?: {
    name: string;
    version: string;
    riskTier: RiskTier;
  }[];
}

export interface QualityMetrics {
  verificationRate: number;
  sampleSize: number;
  testCoverage?: number;
  maintainabilityIndex?: number;
  complexityMean?: number;
  complexityMax?: number;
  duplicationPercent?: number;
}

export interface CapabilityEconomics {
  expectedCostDelta?: number;
  licenseCost?: number;
  installSize?: number;
  dependencyCount?: number;
}

export interface CapabilityProvenance {
  verified: boolean;
  integrity?: string;
  signatureAlgorithm?: string;
  signedBy?: string;
  releaseHistory?: Array<{
    version: string;
    date: string;
    notes?: string;
  }>;
}

export interface CapabilityLifecycle {
  status: LifecycleStatus;
  deprecated: boolean;
  deprecationDate?: string;
  deprecationReason?: string;
  replacedBy?: string[];
  sunsetDate?: string;
}

export interface Capability {
  id: string;
  kind: CapabilityKind;
  name: string;
  description: string;

  version: CapabilityVersion;
  source: CapabilitySource;

  provides: string[];
  requires: string[];

  compatibility: CapabilityCompatibility;
  permissions: CapabilityPermissions;
  risk: CapabilityRisk;
  quality: QualityMetrics;
  economics: CapabilityEconomics;
  provenance: CapabilityProvenance;
  lifecycle: CapabilityLifecycle;

  // Additional metadata
  tags?: string[];
  category?: string;
  documentation?: string;
  supportContact?: string;
}

export interface CapabilitySummary {
  id: string;
  kind: CapabilityKind;
  name: string;
  version: string;
  provides: string[];
  riskTier: RiskTier;
  status: LifecycleStatus;
}

export interface CapabilitySearch {
  query?: string;
  kind?: CapabilityKind[];
  provides?: string[];
  requires?: string[];
  publisher?: string;
  status?: LifecycleStatus[];
  riskTier?: RiskTier[];
  releaseChannel?: ReleaseChannel[];
  limit?: number;
  cursor?: string;
}

export interface CapabilityRequirement {
  provides: string[];
  requires?: string[];
  constraints?: {
    workspace?: string;
    maxRisk?: RiskTier;
    writeAccess?: boolean;
    budgetClass?: 'economy' | 'standard' | 'premium';
    mandatoryVerification?: boolean;
  };
}

export interface Resolution {
  preferred: Capability[];
  alternatives: Capability[];
  alreadyAvailable: Capability[];
  upgradeCandidates: Capability[];
  gaps: string[];
  compatibility: {
    score: number;
    issues: string[];
  };
  risk: {
    aggregate: RiskTier;
    perCapability: Record<string, RiskTier>;
  };
  evidence: {
    reasoning: string;
    sources: string[];
    timestamp: string;
  };
}

export interface CapabilityComparison {
  candidates: Capability[];
  comparison: {
    coverage: Record<string, number>;
    version: Record<string, string>;
    compatibility: Record<string, boolean>;
    risk: Record<string, RiskTier>;
    quality: Record<string, number>;
    maintenance: Record<string, boolean>;
    economics: Record<string, number>;
    provenance: Record<string, boolean>;
  };
  recommendation?: string;
}

export interface UpgradeCandidate {
  current: Capability;
  candidates: Capability[];
  recommended?: Capability;
  reasoning: string;
  riskAssessment: string;
}

export interface Deprecation {
  current: Capability;
  replacements: Capability[];
  sunsetDate?: string;
  reason: string;
}

export interface CompatibilityCheckRequest {
  capabilities: string[];
  context?: {
    workspace?: string;
    models?: string[];
    runtime?: string;
  };
}

export interface CompatibilityCheckResult {
  compatible: boolean;
  issues: string[];
  warnings: string[];
  recommendations: string[];
}

export interface EntitlementRequest {
  userId?: string;
  organizationId?: string;
  capabilityId: string;
  scopes: string[];
}

export interface EntitlementResult {
  allowed: boolean;
  reason?: string;
  requiresUpgrade?: boolean;
  requiresCommercialLicense?: boolean;
  expired?: boolean;
  scopesGranted?: string[];
}

export interface RegistryHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  totalCapabilities: number;
  lastUpdated: string;
  capabilities: {
    byKind: Record<CapabilityKind, number>;
    byRisk: Record<RiskTier, number>;
    byStatus: Record<LifecycleStatus, number>;
  };
  upstream?: {
    status: string;
    latency: number;
  };
}

export interface PaginationResult<T> {
  items: T[];
  totalCount?: number;
  nextCursor?: string;
  hasMore: boolean;
}
