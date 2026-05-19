/**
 * License Client Integration Tests
 * End-to-end license flow tests
 */

import fs from 'fs';
import path from 'path';
import {
  validateStoredLicense,
  getStoredLicenseStatus,
  validateOffline,
  initializeLicense,
  activateLicense,
  clearStoredLicense,
  getMachineId
} from '../src/index.js';
import { LicenseStorage } from '../src/storage.js';
import { LicenseGenerator } from '../src/generator.js';

describe('License Client Integration', () => {
  beforeEach(() => {
    // Clean up any existing licenses
    clearStoredLicense();
  });

  afterEach(() => {
    // Clean up after tests
    clearStoredLicense();
  });

  describe('Trial License Flow', () => {
    it('should initialize with trial license on first install', () => {
      const token = initializeLicense();

      expect(token).toBeDefined();
      expect(token.split('.').length).toBe(3);

      const stored = LicenseStorage.loadLicense();
      expect(stored).toBe(token);
    });

    it('should validate initialized trial license', () => {
      initializeLicense();

      const valid = validateStoredLicense();
      expect(valid).toBe(true);
    });

    it('should get status of stored license', () => {
      initializeLicense();

      const status = getStoredLicenseStatus();
      expect(status).not.toBeNull();
      expect(status?.valid).toBe(true);
      expect(status?.payload?.type).toBe('trial');
      expect(status?.daysRemaining).toBeGreaterThanOrEqual(13);
    });

    it('should work offline with cached license', () => {
      initializeLicense();

      const offlineResult = validateOffline();
      expect(offlineResult.valid).toBe(true);
      expect(offlineResult.cacheValid).toBe(true);
      expect(offlineResult.cachedPayload?.type).toBe('trial');
    });
  });

  describe('Commercial License Activation', () => {
    it('should activate a commercial license', () => {
      const commercialToken = LicenseGenerator.generateCommercialLicense({
        customerId: 'cust_123',
        email: 'user@example.com',
        licenseKey: 'syncpulse_abc123'
      });

      expect(() => {
        activateLicense(commercialToken);
      }).not.toThrow();

      const valid = validateStoredLicense();
      expect(valid).toBe(true);
    });

    it('should reject invalid activation token', () => {
      expect(() => {
        activateLicense('invalid.token.here');
      }).toThrow();
    });

    it('should upgrade from trial to commercial', () => {
      // Start with trial
      initializeLicense();
      let status = getStoredLicenseStatus();
      expect(status?.payload?.type).toBe('trial');

      // Upgrade to commercial
      const commercialToken = LicenseGenerator.generateCommercialLicense({
        customerId: 'cust_123',
        email: 'user@example.com',
        licenseKey: 'syncpulse_abc123'
      });
      activateLicense(commercialToken);

      status = getStoredLicenseStatus();
      expect(status?.payload?.type).toBe('commercial');
    });

    it('should preserve activation info in commercial license', () => {
      const commercialToken = LicenseGenerator.generateCommercialLicense({
        customerId: 'cust_123',
        email: 'user@example.com',
        licenseKey: 'syncpulse_abc123'
      });

      activateLicense(commercialToken);
      const status = getStoredLicenseStatus();

      expect(status?.payload?.activation).toBeDefined();
      expect(status?.payload?.activation?.license_key).toBe('syncpulse_abc123');
    });
  });

  describe('License Expiration & Grace Period', () => {
    it('should detect expired license with valid grace period', () => {
      // Generate an expired license (technically expired but within grace period)
      const expiredToken = LicenseGenerator.generateTrialLicense({ days: -1 });
      LicenseStorage.saveLicense(expiredToken);

      const offlineResult = validateOffline();
      // Should be in grace period
      expect(offlineResult.valid).toBe(true);
      expect(offlineResult.cachedPayload?.type).toBe('trial');
    });

    it('should reject license expired beyond grace period', () => {
      const now = new Date();
      const payload = {
        type: 'trial' as const,
        issued_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
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
      const offlineResult = validateOffline();

      expect(offlineResult.valid).toBe(false);
      expect(offlineResult.error).toContain('expired');
    });
  });

  describe('Machine ID Consistency', () => {
    it('should return consistent machine ID', () => {
      const machineId1 = getMachineId();
      const machineId2 = getMachineId();

      expect(machineId1).toBe(machineId2);
    });

    it('should bind commercial license to machine', () => {
      const machineId = getMachineId();

      const commercialToken = LicenseGenerator.generateCommercialLicense({
        customerId: 'cust_123',
        email: 'user@example.com',
        licenseKey: 'syncpulse_abc123',
        machineId
      });

      activateLicense(commercialToken);
      const status = getStoredLicenseStatus();

      expect(status?.payload?.activation?.machine_id).toBe(machineId);
    });
  });

  describe('Storage Security', () => {
    it('should store license with restricted permissions', () => {
      initializeLicense();

      const storagePath = LicenseStorage.getStoragePath();
      const licensePath = path.join(storagePath, 'license.jwt');

      const stats = fs.statSync(licensePath);
      const mode = stats.mode & parseInt('0777', 8);

      expect(mode).toBe(parseInt('0600', 8));
    });

    it('should create storage directory with restrictive permissions', () => {
      initializeLicense();

      const storagePath = LicenseStorage.getStoragePath();
      const stats = fs.statSync(storagePath);
      const mode = stats.mode & parseInt('0777', 8);

      expect(mode).toBe(parseInt('0700', 8));
    });
  });

  describe('Full Workflow', () => {
    it('should complete full trial to commercial workflow', () => {
      // 1. First install - trial license
      initializeLicense();
      expect(validateStoredLicense()).toBe(true);

      // 2. Check trial status
      const trialStatus = getStoredLicenseStatus();
      expect(trialStatus?.payload?.type).toBe('trial');
      expect(trialStatus?.daysRemaining).toBeGreaterThanOrEqual(13);

      // 3. User upgrades to commercial
      const commercialToken = LicenseGenerator.generateCommercialLicense({
        customerId: 'cust_abc123',
        email: 'user@company.com',
        licenseKey: 'syncpulse_prod_key'
      });

      activateLicense(commercialToken);

      // 4. Verify commercial license is active
      const commercialStatus = getStoredLicenseStatus();
      expect(commercialStatus?.payload?.type).toBe('commercial');
      expect(commercialStatus?.payload?.sub).toBe('user@company.com');

      // 5. Offline validation still works
      const offlineStatus = validateOffline();
      expect(offlineStatus.valid).toBe(true);
      expect(offlineStatus.cachedPayload?.type).toBe('commercial');

      // 6. Clear license (e.g., uninstall)
      clearStoredLicense();
      expect(validateStoredLicense()).toBe(false);
      expect(validateOffline().valid).toBe(false);
    });

    it('should handle team license workflow', () => {
      const teamToken = LicenseGenerator.generateTeamLicense('team_cust_123', 'team@company.com');

      activateLicense(teamToken);

      const status = getStoredLicenseStatus();
      expect(status?.payload?.type).toBe('team');
      expect(status?.payload?.features.team_members).toBe(5);
      expect(status?.payload?.sub).toBe('team@company.com');
    });

    it('should handle enterprise license workflow', () => {
      const enterpriseToken = LicenseGenerator.generateEnterpriseLicense(
        'enterprise_cust_123',
        'enterprise@company.com'
      );

      activateLicense(enterpriseToken);

      const status = getStoredLicenseStatus();
      expect(status?.payload?.type).toBe('enterprise');
      expect(status?.payload?.features.team_members).toBe(1000);
      expect(status?.payload?.features.custom_branding).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing cache gracefully', () => {
      clearStoredLicense();

      const offlineResult = validateOffline();
      expect(offlineResult.valid).toBe(false);
      expect(offlineResult.error).toContain('No cached license');
    });

    it('should handle corrupted cache gracefully', () => {
      initializeLicense();

      // Corrupt the cache
      const storagePath = LicenseStorage.getStoragePath();
      const cachePath = path.join(storagePath, 'license.json');
      fs.writeFileSync(cachePath, 'not valid json', { mode: 0o600 });

      // Should still work with stored license
      const valid = validateStoredLicense();
      expect(valid).toBe(true);
    });

    it('should recover from missing machine-id file', () => {
      getMachineId();

      // Delete the machine-id file
      const storagePath = LicenseStorage.getStoragePath();
      const machineIdPath = path.join(storagePath, 'machine-id');
      if (fs.existsSync(machineIdPath)) {
        fs.unlinkSync(machineIdPath);
      }

      // Should still get a consistent machine ID
      const machineId2 = getMachineId();
      expect(machineId2).toBeDefined();
    });

    it('should handle malformed license gracefully', () => {
      const storagePath = LicenseStorage.getStoragePath();
      const licensePath = path.join(storagePath, 'license.jwt');
      LicenseStorage.ensureStorageDirectory();

      fs.writeFileSync(licensePath, 'not.a.valid.jwt', { mode: 0o600 });

      const valid = validateStoredLicense();
      expect(valid).toBe(false);
    });
  });
});
