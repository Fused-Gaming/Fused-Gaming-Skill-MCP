/**
 * License Validator
 * Verifies JWT signatures, expiration, and machine binding
 */

import jwt from 'jsonwebtoken';
import { LicensePayload, ValidationResult, ExpirationStatus, OfflineValidationResult, GracePeriodDays } from './types.js';
import { LicenseStorage } from './storage.js';

// Public key for RS256 verification (for production, load from environment)
const DEFAULT_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA8TPsAesQnyM4Yy0W3ls2
IdIV8OQvA8iEInB35R0ZJrtqGUi6QLwEiC6ARZlB8rxW3wOLER8l9m9qc77zsz5+
AYmNwS1bxx+L5jHgVAU5J3Tmme8YbMs2UIlkcUNYv1YVtsV8zWaT78OLC+uhMUzm
9Z9oai3BSyVA7AWQ54mp+n80WaIhasGpdYVChslzaKbcP3gISav8dv9QT9gJlHXq
QEyGiCpXaaTaQlFBETUfC/Idb98Em/fbxbYO5pxiE6LxrpTKWz09XefH8X3iA/w5
oD35hZk4EAH8nK/4fFeu2pN8teUfk6Ywet+NnrTVzaqhGsLRlb77mno/0vKHsOqT
eQIDAQAB
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
   * Check if using the default (embedded) public key
   */
  private static isDefaultPublicKey(): boolean {
    return this.publicKey === DEFAULT_PUBLIC_KEY;
  }

  /**
   * Validate a license token (online validation with signature verification)
   * @param token - The license token to validate
   * @param checkMachineBinding - Whether to verify machine binding (default: true)
   */
  static validateLicense(token: string, checkMachineBinding = true): ValidationResult {
    try {
      // Verify JWT signature
      const payload = jwt.verify(token, this.publicKey, {
        algorithms: ['RS256']
      }) as LicensePayload;

      // Security: Reject commercial/team/enterprise licenses signed with default (embedded) key
      // Paid licenses must be verified with server-side keys, not client-embedded keys
      if (['commercial', 'team', 'enterprise'].includes(payload.type) && this.isDefaultPublicKey()) {
        return {
          valid: false,
          error: 'Paid licenses must be verified with server-side keys, not embedded client keys',
          payload
        };
      }

      // Check expiration
      const expirationStatus = this.checkExpiration(payload);

      if (expirationStatus.expired && !expirationStatus.inGracePeriod) {
        return {
          valid: false,
          error: 'License expired',
          daysRemaining: 0
        };
      }

      // Verify machine binding (if enabled)
      if (checkMachineBinding && !this.verifyMachineBinding(payload)) {
        return {
          valid: false,
          error: `License is bound to a different machine. Current: ${this.getMachineId()}`,
          payload
        };
      }

      // Cache the validated license after all validations pass
      LicenseStorage.saveLicenseCache(payload as unknown as Record<string, unknown>);

      return {
        valid: true,
        payload,
        daysRemaining: expirationStatus.daysRemaining,
        inGracePeriod: expirationStatus.inGracePeriod
      };
    } catch (err: unknown) {
      const errorMessage =
        err instanceof jwt.TokenExpiredError
          ? 'License token expired'
          : err instanceof jwt.JsonWebTokenError
            ? `Invalid JWT: ${err.message}`
            : err instanceof Error
              ? err.message
              : String(err);

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

    if (isNaN(expiresAt.getTime())) {
      throw new Error(`Invalid expiration date: ${payload.expires_at}`);
    }

    const gracePeriodDays =
      payload.type === 'trial' ? GracePeriodDays.TRIAL_GRACE :
      payload.type === 'team' ? GracePeriodDays.TEAM_GRACE :
      payload.type === 'enterprise' ? GracePeriodDays.ENTERPRISE_GRACE :
      GracePeriodDays.COMMERCIAL_GRACE;

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
   * Does not verify signature, but checks expiration with grace period and machine binding
   */
  static isOfflineValid(): OfflineValidationResult {
    const cachedData = LicenseStorage.loadLicenseCache();

    if (!cachedData) {
      return {
        valid: false,
        cacheValid: false,
        error: 'No cached license found'
      };
    }

    const cachedPayload = cachedData as unknown as LicensePayload;

    // Security: Reject commercial/team/enterprise licenses cached from default (embedded) key
    if (['commercial', 'team', 'enterprise'].includes(cachedPayload.type) && this.isDefaultPublicKey()) {
      return {
        valid: false,
        cacheValid: false,
        cachedPayload,
        error: 'Paid licenses must be verified with server-side keys, not embedded client keys'
      };
    }

    // Check machine binding
    if (!this.verifyMachineBinding(cachedPayload)) {
      return {
        valid: false,
        cacheValid: false,
        cachedPayload,
        error: `License is bound to a different machine. Current: ${this.getMachineId()}`
      };
    }

    let expirationStatus: ExpirationStatus;
    try {
      expirationStatus = this.checkExpiration(cachedPayload);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return {
        valid: false,
        cacheValid: false,
        cachedPayload,
        error: `Invalid cached license: ${errorMessage}`
      };
    }

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
   * Validate with machine ID binding (supports both local and remote validation)
   * @param token - The license token to validate
   * @param expectedMachineId - Optional machine ID for remote validation; if not provided, validates against current machine
   */
  static validateWithMachineBinding(token: string, expectedMachineId?: string): ValidationResult {
    // Skip automatic machine binding check; we'll handle it explicitly
    const result = this.validateLicense(token, false);

    if (!result.valid || !result.payload) {
      return result;
    }

    const licenseMachineId = result.payload.activation?.machine_id;

    // If expectedMachineId is provided, check against it (remote/API validation)
    if (expectedMachineId) {
      if (!licenseMachineId || licenseMachineId !== expectedMachineId) {
        return {
          valid: false,
          error: `License is bound to machine ${licenseMachineId || 'unbound'}, expected ${expectedMachineId}`,
          payload: result.payload
        };
      }
    } else if (licenseMachineId && !this.verifyMachineBinding(result.payload)) {
      // If no expectedMachineId but license has machine binding, verify against current machine (local validation)
      return {
        valid: false,
        error: `License is bound to a different machine. Current: ${this.getMachineId()}`,
        payload: result.payload
      };
    }

    return result;
  }
}
