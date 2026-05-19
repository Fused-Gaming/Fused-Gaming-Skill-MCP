export type LicenseType = 'trial' | 'commercial' | 'team' | 'enterprise';

export interface LicenseFeatures {
  concurrent_agents: number;
  storage_gb: number;
  team_members: number;
  priority_support: boolean;
  custom_branding: boolean;
}

export interface LicensePayload {
  type: LicenseType;
  issued_at: string;
  expires_at: string;
  product: string;
  version: string;
  features: LicenseFeatures;
  sub?: string;
  activation?: {
    activated_at: string;
    machine_id: string;
    license_key: string;
  };
}

export interface ValidationResult {
  valid: boolean;
  payload?: LicensePayload;
  error?: string;
  daysRemaining?: number;
  inGracePeriod?: boolean;
}

export interface TrialLicenseOptions {
  days?: number;
  product?: string;
  version?: string;
}

export interface CommercialLicenseOptions {
  type: LicenseType;
  email: string;
  issuedAt: Date;
  expiresAt: Date;
  features: LicenseFeatures;
  licenseKey: string;
  machineId?: string;
  version?: string;
}

export interface LicenseConfig {
  privateKeyPath?: string;
  publicKeyPath?: string;
  storagePath?: string;
}

export interface GracePeriodStatus {
  inGracePeriod: boolean;
  daysRemaining: number;
  expiresAt: string;
}

export interface ExpirationStatus {
  expired: boolean;
  daysRemaining: number;
  inGracePeriod: boolean;
  expiresAt: Date;
  gracePeriodEndsAt: Date;
}

export interface OfflineValidationResult {
  valid: boolean;
  cacheValid: boolean;
  cachedPayload?: LicensePayload;
  error?: string;
  warnings?: string[];
}

export enum GracePeriodDays {
  TRIAL_GRACE = 7,
  COMMERCIAL_GRACE = 14,
  TEAM_GRACE = 21,
  ENTERPRISE_GRACE = 30,
}
