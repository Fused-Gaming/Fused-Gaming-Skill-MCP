/**
 * License Validator
 * Verifies JWT signatures, expiration, and machine binding
 */

import jwt from 'jsonwebtoken';
import { LicensePayload, ValidationResult, ExpirationStatus, OfflineValidationResult, GracePeriodDays } from './types.js';
import { LicenseStorage } from './storage.js';

// Public key for RS256 verification (for production, load from environment)
const DEFAULT_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2Z3qX2BTLS39R3wvUL3p
+ZnwvXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3
qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3
qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3
qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3
qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3
QIDAQAB
-----END PUBLIC KEY-----`;

export class LicenseValidator {
  private static publicKey: string = DEFAULT_PUBLIC_KEY;

  /**
   * Set a custom public key for verification
   */
  static setPublicKey(publicKey: string): void {
    this.publicKey = publicKey;
  }

  /**
   * Get the current public key
   */
  static getPublicKey(): string {
    return this.publicKey;
  }

  /**
   * Validate a license token (online validation with signature verification)
   */
  static validateLicense(token: string): ValidationResult {
    try {
      // Verify JWT signature
      const payload = jwt.verify(token, this.publicKey, {
        algorithms: ['RS256']
      }) as LicensePayload;

      // Check expiration
      const expirationStatus = this.checkExpiration(payload);

      if (expirationStatus.expired && !expirationStatus.inGracePeriod) {
        return {
          valid: false,
          error: 'License expired',
          daysRemaining: 0
        };
      }

      // Cache the validated license
      LicenseStorage.saveLicenseCache(payload);

      return {
        valid: true,
        payload,
        daysRemaining: expirationStatus.daysRemaining,
        inGracePeriod: expirationStatus.inGracePeriod
      };
    } catch (error: unknown) {
      let errorMessage = 'Invalid license format';

      if (error instanceof jwt.TokenExpiredError) {
        errorMessage = 'License token expired';
      } else if (error instanceof jwt.JsonWebTokenError) {
        errorMessage = `Invalid JWT: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        valid: false,
        error: errorMessage
      };
    }
  }

  /**
   * Check license expiration status
   */
  static checkExpiration(payload: LicensePayload): ExpirationStatus {
    const now = new Date();
    const expiresAt = new Date(payload.expires_at);

    let gracePeriodDays = GracePeriodDays.COMMERCIAL_GRACE;
    if (payload.type === 'trial') {
      gracePeriodDays = GracePeriodDays.TRIAL_GRACE;
    }

    const gracePeriodEndsAt = new Date(expiresAt.getTime() + gracePeriodDays * 24 * 60 * 60 * 1000);

    const daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const inGracePeriod = now > expiresAt && now <= gracePeriodEndsAt;
    const expired = now > expiresAt;

    return {
      expired,
      daysRemaining: Math.max(0, daysRemaining),
      inGracePeriod,
      expiresAt,
      gracePeriodEndsAt
    };
  }

  /**
   * Validate offline using cached license
   * Does not verify signature, but checks expiration with grace period
   */
  static isOfflineValid(): OfflineValidationResult {
    const cachedPayload = LicenseStorage.loadLicenseCache();

    if (!cachedPayload) {
      return {
        valid: false,
        cacheValid: false,
        error: 'No cached license found'
      };
    }

    const expirationStatus = this.checkExpiration(cachedPayload);

    // Allow offline validation during grace period
    if (expirationStatus.inGracePeriod) {
      return {
        valid: true,
        cacheValid: true,
        cachedPayload,
        warnings: ['Operating in grace period. Please renew your license.']
      };
    }

    // License expired beyond grace period
    if (expirationStatus.expired) {
      return {
        valid: false,
        cacheValid: false,
        cachedPayload,
        error: `License expired and grace period has ended. Expired on ${expirationStatus.expiresAt.toISOString()}`
      };
    }

    // License is valid
    return {
      valid: true,
      cacheValid: true,
      cachedPayload,
      warnings: expirationStatus.daysRemaining < 7 ? [`License expires in ${expirationStatus.daysRemaining} days`] : []
    };
  }

  /**
   * Get the machine ID of the current device
   */
  static getMachineId(): string {
    return LicenseStorage.getMachineId();
  }

  /**
   * Verify machine binding if present in license
   */
  static verifyMachineBinding(payload: LicensePayload): boolean {
    if (!payload.activation?.machine_id) {
      // Machine binding is optional
      return true;
    }

    const currentMachineId = this.getMachineId();
    return payload.activation.machine_id === currentMachineId;
  }

  /**
   * Get detailed expiration warnings based on days remaining
   */
  static getExpirationWarning(payload: LicensePayload): string | null {
    const expirationStatus = this.checkExpiration(payload);

    if (expirationStatus.inGracePeriod) {
      const daysUntilGraceEnds = Math.ceil(
        (expirationStatus.gracePeriodEndsAt!.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return `Your license is in grace period. You have ${daysUntilGraceEnds} day${daysUntilGraceEnds !== 1 ? 's' : ''} to renew.`;
    }

    if (expirationStatus.expired) {
      return 'Your license has expired. Please renew to continue using SyncPulse.';
    }

    const daysRemaining = expirationStatus.daysRemaining;

    if (daysRemaining === 0) {
      return 'Your license expires TODAY. Please renew immediately.';
    }

    if (daysRemaining === 1) {
      return 'Your license expires tomorrow. Please renew now.';
    }

    if (daysRemaining <= 7) {
      return `Your license expires in ${daysRemaining} days. Please renew soon.`;
    }

    if (daysRemaining <= 30) {
      return `Your license will expire in ${daysRemaining} days.`;
    }

    return null;
  }

  /**
   * Validate with machine ID binding
   */
  static validateWithMachineBinding(token: string, expectedMachineId?: string): ValidationResult {
    const result = this.validateLicense(token);

    if (!result.valid || !result.payload) {
      return result;
    }

    const machineToCheck = expectedMachineId || this.getMachineId();

    if (!this.verifyMachineBinding(result.payload)) {
      return {
        valid: false,
        error: `License is bound to a different machine. Expected: ${machineToCheck}`,
        payload: result.payload
      };
    }

    return result;
  }
}
