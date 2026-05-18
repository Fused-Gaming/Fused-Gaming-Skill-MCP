/**
 * SyncPulse License Client
 * Complete license validation and management library
 */

export * from './types.js';
export { LicenseValidator } from './validator.js';
export { LicenseStorage } from './storage.js';
export { LicenseGenerator } from './generator.js';

// Export convenience functions
import { LicenseValidator } from './validator.js';
import { LicenseStorage } from './storage.js';
import { LicenseGenerator } from './generator.js';

/**
 * Convenience function to validate a license from file
 */
export function validateStoredLicense(): boolean {
  try {
    const token = LicenseStorage.loadLicense();
    if (!token) {
      return false;
    }

    const result = LicenseValidator.validateLicense(token);
    return result.valid;
  } catch {
    return false;
  }
}

/**
 * Convenience function to get stored license status
 */
export function getStoredLicenseStatus() {
  try {
    const token = LicenseStorage.loadLicense();
    if (!token) {
      return null;
    }

    const result = LicenseValidator.validateLicense(token);
    return result;
  } catch {
    return null;
  }
}

/**
 * Convenience function for offline license validation
 */
export function validateOffline() {
  return LicenseValidator.isOfflineValid();
}

/**
 * Initialize license storage (called on first install)
 */
export function initializeLicense(): string {
  const trialLicense = LicenseGenerator.generateTrialLicense({ days: 14 });
  LicenseStorage.saveLicense(trialLicense);

  // Validate and cache the license for offline use
  const result = LicenseValidator.validateLicense(trialLicense);
  if (result.valid && result.payload) {
    LicenseStorage.saveLicenseCache(result.payload as unknown as Record<string, unknown>);
  }

  return trialLicense;
}

/**
 * Activate a license with a token
 */
export function activateLicense(token: string): boolean {
  try {
    const result = LicenseValidator.validateLicense(token);
    if (!result.valid) {
      throw new Error(result.error || 'Invalid license');
    }

    LicenseStorage.saveLicense(token);
    return true;
  } catch (error) {
    throw new Error(`Failed to activate license: ${error}`);
  }
}

/**
 * Clear stored license
 */
export function clearStoredLicense(): void {
  LicenseStorage.deleteLicense();
  LicenseStorage.clearCache();
}

/**
 * Get the current machine ID
 */
export function getMachineId(): string {
  return LicenseStorage.getMachineId();
}
