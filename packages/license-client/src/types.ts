/**
 * SyncPulse License Client Types
 * Defines the structure of license payloads, validation results, and feature sets
 */

export type LicenseType = 'trial' | 'commercial' | 'team' | 'enterprise';

export interface LicenseFeatures {
  concurrent_agents: number;
  storage_gb: number;
  team_members: number;
  priority_support: boolean;
  custom_branding: boolean;
}

export interface LicenseActivation {
  activated_at: string;
  machine_id: string;
  license_key: string;
}

export interface LicensePayload {
  type: LicenseType;
  issued_at: string;
  expires_at: string;
  product: string;
  version: string;
  features: LicenseFeatures;
  activation?: LicenseActivation;
  iss?: string;
  sub?: string;
  trial_days?: number;
}

export interface ValidationResult {
  valid: boolean;
  payload?: LicensePayload;
  error?: string;
  daysRemaining?: number;
  inGracePeriod?: boolean;
}

export interface ExpirationStatus {
  expired: boolean;
  daysRemaining: number;
  inGracePeriod: boolean;
  expiresAt: Date;
  gracePeriodEndsAt?: Date;
}

export interface OfflineValidationResult {
  valid: boolean;
  cacheValid: boolean;
  cachedPayload?: LicensePayload;
  error?: string;
  warnings?: string[];
}

export interface LicenseGeneratorOptions {
  days?: number;
  machineId?: string;
  productVersion?: string;
}

export interface TrialLicenseOptions extends LicenseGeneratorOptions {
  days?: number;
}

export interface CommercialLicenseOptions extends LicenseGeneratorOptions {
  customerId: string;
  email: string;
  licenseKey: string;
  features?: Partial<LicenseFeatures>;
}

export interface ActivationInfo {
  machine_id: string;
  timestamp: string;
  license_key: string;
}

export enum GracePeriodDays {
  TRIAL_GRACE = 7,
  COMMERCIAL_GRACE = 7
}
