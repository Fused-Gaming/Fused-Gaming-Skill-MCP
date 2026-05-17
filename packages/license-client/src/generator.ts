/**
 * License Generator
 * Creates and signs license tokens
 */

import jwt from 'jsonwebtoken';
import { LicensePayload, LicenseFeatures, TrialLicenseOptions, CommercialLicenseOptions } from './types.js';
import { LicenseStorage } from './storage.js';

export class LicenseGenerator {
  private static privateKey: string | null = null;
  private static issuer: string = 'syncpulse.io';
  private static productName: string = 'syncpulse-cli';
  private static productVersion: string = '1.0.0';

  // Internal default key for trial license initialization only

  /**
   * Set the private key for signing licenses
   */
  static setPrivateKey(privateKey: string): void {
    this.privateKey = privateKey;
  }

  /**
   * Set the issuer claim
   */
  static setIssuer(issuer: string): void {
    this.issuer = issuer;
  }

  /**
   * Set product metadata
   */
  static setProductMetadata(name: string, version: string): void {
    this.productName = name;
    this.productVersion = version;
  }

  /**
   * Generate a trial license
   */
  static generateTrialLicense(options: TrialLicenseOptions = {}): string {
    const days = options.days || 14;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const payload: LicensePayload = {
      type: 'trial',
      issued_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      product: this.productName,
      version: this.productVersion,
      trial_days: days,
      features: this.getDefaultTrialFeatures(),
      iss: this.issuer
    };

    return this.signLicense(payload);
  }

  /**
   * Generate a commercial license
   */
  static generateCommercialLicense(options: CommercialLicenseOptions): string {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year default
    const machineId = options.machineId || LicenseStorage.getMachineId();

    const payload: LicensePayload = {
      type: 'commercial',
      issued_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      product: this.productName,
      version: this.productVersion,
      sub: options.email,
      features: {
        ...this.getDefaultCommercialFeatures(),
        ...options.features
      },
      iss: this.issuer,
      activation: {
        activated_at: now.toISOString(),
        machine_id: machineId,
        license_key: options.licenseKey
      }
    };

    return this.signLicense(payload, this.privateKey);
  }

  /**
   * Generate a team license
   */
  static generateTeamLicense(customerId: string, email: string): string {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year default
    const machineId = LicenseStorage.getMachineId();

    const payload: LicensePayload = {
      type: 'team',
      issued_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      product: this.productName,
      version: this.productVersion,
      sub: email,
      features: this.getDefaultTeamFeatures(),
      iss: this.issuer,
      activation: {
        activated_at: now.toISOString(),
        machine_id: machineId,
        license_key: `team_${customerId}`
      }
    };

    return this.signLicense(payload, this.privateKey);
  }

  /**
   * Generate an enterprise license
   */
  static generateEnterpriseLicense(customerId: string, email: string): string {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year default
    const machineId = LicenseStorage.getMachineId();

    const payload: LicensePayload = {
      type: 'enterprise',
      issued_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      product: this.productName,
      version: this.productVersion,
      sub: email,
      features: this.getDefaultEnterpriseFeatures(),
      iss: this.issuer,
      activation: {
        activated_at: now.toISOString(),
        machine_id: machineId,
        license_key: `enterprise_${customerId}`
      }
    };

    return this.signLicense(payload, this.privateKey);
  }

  /**
   * Sign a license payload with RS256
   */
  static signLicense(payload: LicensePayload, privateKey?: string | null): string {
    const key = privateKey || this.privateKey;

    if (!key) {
      throw new Error('Private key not configured. Call setPrivateKey() first.');
    }

    try {
      const token = jwt.sign(payload, key, {
        algorithm: 'RS256',
        header: {
          alg: 'RS256',
          kid: 'syncpulse-2026'
        }
      });

      return token;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to sign license: ${errorMessage}`);
    }
  }

  /**
   * Get default features for trial licenses
   */
  private static getDefaultTrialFeatures(): LicenseFeatures {
    return {
      concurrent_agents: 1,
      storage_gb: 10,
      team_members: 1,
      priority_support: false,
      custom_branding: false
    };
  }

  /**
   * Get default features for commercial licenses
   */
  private static getDefaultCommercialFeatures(): LicenseFeatures {
    return {
      concurrent_agents: 5,
      storage_gb: 100,
      team_members: 1,
      priority_support: true,
      custom_branding: false
    };
  }

  /**
   * Get default features for team licenses
   */
  private static getDefaultTeamFeatures(): LicenseFeatures {
    return {
      concurrent_agents: 10,
      storage_gb: 500,
      team_members: 5,
      priority_support: true,
      custom_branding: false
    };
  }

  /**
   * Get default features for enterprise licenses
   */
  private static getDefaultEnterpriseFeatures(): LicenseFeatures {
    return {
      concurrent_agents: 100,
      storage_gb: 5000,
      team_members: 1000,
      priority_support: true,
      custom_branding: true
    };
  }
}
