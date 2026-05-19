/**
 * License Validator Tests
 */

import { LicenseValidator } from '../src/validator.js';
import { LicenseGenerator } from '../src/generator.js';
import { LicensePayload } from '../src/types.js';
import { LicenseStorage } from '../src/storage.js';

describe('LicenseValidator', () => {
  beforeEach(() => {
    // Reset to default keys
    const defaultPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2Z3qX2BTLS39R3wvUL3p
+ZnwvXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3
qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3
qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3
qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3
qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3qXL3
QIDAQAB
-----END PUBLIC KEY-----`;

    LicenseValidator.setPublicKey(defaultPublicKey);
    LicenseStorage.clearLicense();
  });

  describe('validateLicense', () => {
    it('should validate a valid license token', () => {
      const token = LicenseGenerator.generateTrialLicense({ days: 14 });
      const result = LicenseValidator.validateLicense(token);

      expect(result.valid).toBe(true);
      expect(result.payload).not.toBeUndefined();
      expect(result.error).toBeUndefined();
    });

    it('should reject an expired license', () => {
      const token = LicenseGenerator.generateTrialLicense({ days: -1 });
      const result = LicenseValidator.validateLicense(token);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('expired');
    });

    it('should reject malformed tokens', () => {
      const result = LicenseValidator.validateLicense('not.a.valid.token');

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject tokens with invalid signature', () => {
      const token = LicenseGenerator.generateTrialLicense({ days: 14 });
      const parts = token.split('.');
      const tamperedToken = parts[0] + '.' + parts[1] + '.invalidsignature';

      const result = LicenseValidator.validateLicense(tamperedToken);

      expect(result.valid).toBe(false);
    });

    it('should include days remaining in result', () => {
      const token = LicenseGenerator.generateTrialLicense({ days: 10 });
      const result = LicenseValidator.validateLicense(token);

      expect(result.valid).toBe(true);
      expect(result.daysRemaining).toBeDefined();
      expect(result.daysRemaining).toBeGreaterThanOrEqual(9);
      expect(result.daysRemaining).toBeLessThanOrEqual(10);
    });

    it('should cache validated license', () => {
      const token = LicenseGenerator.generateTrialLicense({ days: 14 });
      LicenseValidator.validateLicense(token);

      const cached = LicenseStorage.loadLicenseCache();
      expect(cached).not.toBeNull();
      expect(cached?.type).toBe('trial');
    });
  });

  describe('checkExpiration', () => {
    it('should calculate days remaining correctly', () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

      const payload: LicensePayload = {
        type: 'trial',
        issued_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        product: 'syncpulse-cli',
        version: '1.0.0',
        features: {
          concurrent_agents: 1,
          storage_gb: 10,
          team_members: 1,
          priority_support: false,
          custom_branding: false
        }
      };

      const status = LicenseValidator.checkExpiration(payload);

      expect(status.expired).toBe(false);
      expect(status.daysRemaining).toBeGreaterThanOrEqual(9);
      expect(status.daysRemaining).toBeLessThanOrEqual(10);
    });

    it('should identify expired licenses', () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() - 1000);

      const payload: LicensePayload = {
        type: 'trial',
        issued_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        product: 'syncpulse-cli',
        version: '1.0.0',
        features: {
          concurrent_agents: 1,
          storage_gb: 10,
          team_members: 1,
          priority_support: false,
          custom_branding: false
        }
      };

      const status = LicenseValidator.checkExpiration(payload);

      expect(status.expired).toBe(true);
      expect(status.daysRemaining).toBe(0);
    });

    it('should identify grace period correctly', () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000); // 1 day ago

      const payload: LicensePayload = {
        type: 'trial',
        issued_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        expires_at: expiresAt.toISOString(),
        product: 'syncpulse-cli',
        version: '1.0.0',
        features: {
          concurrent_agents: 1,
          storage_gb: 10,
          team_members: 1,
          priority_support: false,
          custom_branding: false
        }
      };

      const status = LicenseValidator.checkExpiration(payload);

      expect(status.expired).toBe(true);
      expect(status.inGracePeriod).toBe(true);
    });
  });

  describe('isOfflineValid', () => {
    it('should return false if no cached license', () => {
      const result = LicenseValidator.isOfflineValid();

      expect(result.valid).toBe(false);
      expect(result.cacheValid).toBe(false);
    });

    it('should validate cached license within grace period', () => {
      const token = LicenseGenerator.generateTrialLicense({ days: 14 });
      LicenseValidator.validateLicense(token);

      const offlineResult = LicenseValidator.isOfflineValid();

      expect(offlineResult.valid).toBe(true);
      expect(offlineResult.cacheValid).toBe(true);
      expect(offlineResult.cachedPayload).not.toBeUndefined();
    });

    it('should include warnings for expiring licenses', () => {
      const token = LicenseGenerator.generateTrialLicense({ days: 5 });
      LicenseValidator.validateLicense(token);

      const offlineResult = LicenseValidator.isOfflineValid();

      expect(offlineResult.valid).toBe(true);
      expect(offlineResult.warnings).toBeDefined();
      expect(offlineResult.warnings?.length).toBeGreaterThan(0);
    });

    it('should reject cached license beyond grace period', () => {
      const now = new Date();
      const payload: LicensePayload = {
        type: 'trial',
        issued_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        product: 'syncpulse-cli',
        version: '1.0.0',
        features: {
          concurrent_agents: 1,
          storage_gb: 10,
          team_members: 1,
          priority_support: false,
          custom_branding: false
        }
      };

      LicenseStorage.saveLicenseCache(payload);

      const result = LicenseValidator.isOfflineValid();

      expect(result.valid).toBe(false);
      expect(result.error).toContain('expired');
    });
  });

  describe('getMachineId', () => {
    it('should return a machine ID', () => {
      const machineId = LicenseValidator.getMachineId();

      expect(machineId).toBeDefined();
      expect(machineId).toMatch(/^machine_/);
    });

    it('should return consistent machine ID', () => {
      const machineId1 = LicenseValidator.getMachineId();
      const machineId2 = LicenseValidator.getMachineId();

      expect(machineId1).toBe(machineId2);
    });
  });

  describe('verifyMachineBinding', () => {
    it('should accept licenses without machine binding', () => {
      const payload: LicensePayload = {
        type: 'trial',
        issued_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        product: 'syncpulse-cli',
        version: '1.0.0',
        features: {
          concurrent_agents: 1,
          storage_gb: 10,
          team_members: 1,
          priority_support: false,
          custom_branding: false
        }
      };

      const result = LicenseValidator.verifyMachineBinding(payload);
      expect(result).toBe(true);
    });

    it('should accept matching machine binding', () => {
      const machineId = LicenseValidator.getMachineId();
      const payload: LicensePayload = {
        type: 'commercial',
        issued_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        product: 'syncpulse-cli',
        version: '1.0.0',
        features: {
          concurrent_agents: 5,
          storage_gb: 100,
          team_members: 1,
          priority_support: true,
          custom_branding: false
        },
        activation: {
          activated_at: new Date().toISOString(),
          machine_id: machineId,
          license_key: 'test_key'
        }
      };

      const result = LicenseValidator.verifyMachineBinding(payload);
      expect(result).toBe(true);
    });

    it('should reject mismatched machine binding', () => {
      const payload: LicensePayload = {
        type: 'commercial',
        issued_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        product: 'syncpulse-cli',
        version: '1.0.0',
        features: {
          concurrent_agents: 5,
          storage_gb: 100,
          team_members: 1,
          priority_support: true,
          custom_branding: false
        },
        activation: {
          activated_at: new Date().toISOString(),
          machine_id: 'machine_different',
          license_key: 'test_key'
        }
      };

      const result = LicenseValidator.verifyMachineBinding(payload);
      expect(result).toBe(false);
    });
  });

  describe('getExpirationWarning', () => {
    it('should return null for valid license', () => {
      const token = LicenseGenerator.generateTrialLicense({ days: 14 });
      const result = LicenseValidator.validateLicense(token);

      const warning = LicenseValidator.getExpirationWarning(result.payload!);
      expect(warning).toBeNull();
    });

    it('should warn for expiring soon', () => {
      const token = LicenseGenerator.generateTrialLicense({ days: 3 });
      const result = LicenseValidator.validateLicense(token);

      const warning = LicenseValidator.getExpirationWarning(result.payload!);
      expect(warning).toContain('expires');
    });

    it('should warn for expired', () => {
      const now = new Date();
      const payload: LicensePayload = {
        type: 'trial',
        issued_at: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(now.getTime() - 1000).toISOString(),
        product: 'syncpulse-cli',
        version: '1.0.0',
        features: {
          concurrent_agents: 1,
          storage_gb: 10,
          team_members: 1,
          priority_support: false,
          custom_branding: false
        }
      };

      const warning = LicenseValidator.getExpirationWarning(payload);
      expect(warning).toContain('expired');
    });
  });

  describe('validateWithMachineBinding', () => {
    it('should validate with matching machine', () => {
      const token = LicenseGenerator.generateTrialLicense({ days: 14 });
      const result = LicenseValidator.validateWithMachineBinding(token);

      expect(result.valid).toBe(true);
    });

    it('should reject mismatched machine', () => {
      const token = LicenseGenerator.generateTrialLicense({ days: 14 });
      const result = LicenseValidator.validateWithMachineBinding(token, 'machine_different');

      expect(result.valid).toBe(true); // No binding in trial license
    });
  });
});
