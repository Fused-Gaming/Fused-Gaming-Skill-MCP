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
  let testStorageDir: string;

  // Test private key for signing licenses in tests
  const testPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC83ValQN0h3vBe
fdf9qce6WTY5h8rafRbIG+KWmaG9bB5D50ymLBFXRyx2Eruxnp08f1VIBD86dZ0c
evAS6VL3UHnpCtNFbfIHJUTg+/UHXB68CFFSBu23zBLgmx1Ur0QcEikHwm2NR16F
32ObNBMOgleWQFq+f6X0UmgWNT1wISkCbPba7iUehKyhh0uFhHiINaEgENz/w05f
eIOIjGOooKh0Jj0h34oSuQaR/cA/BdjV6dmNOVb1S6Zc0UnOltlasuNPUy9eqTAM
ZfkvXzw4T+x9WsYrgYMm+6yv8zdf4FZVd9eRSpVQmhvuNRC5+kO6G3jaNYBGgZks
HmxHou8TAgMBAAECggEAOPKAesmpI9pmHgfSBdGYwK6/s+8nEmRfZy1JUGG4rDYa
lhz7NqvY+rkiReP2JmOOQ7ydSV7Gdeka24iSNRGXi6z/ZW53L9sr/E2XjENMqdB0
D/xuEM64BRCKrKD44h0K62/qYUWV5OCdNr6Z+SVljZ1trYdwFTrGHnpumiupf9Jq
TPfVCptWZ7Oj+tjtIJ4eK1Lccmvgag7HJAHTIwHM2u3o0kxbBwJTNAmIraEFCZoQ
uY6Ukpd2K4dvzHQznS9l6XYKkWLEj0AG4JAjnk1NaLJMVfFnWQEwo7CGibUkw+W3
0YdiXHInpP8lCMw4plIOtoQV8x8gck+optXf3KAeSQKBgQD37CYQJG++AX0dGC3b
RPxnQSYkJgWfOBtHsnO6j5GyaR9PKsiN0DrJBeVwsJEKg8DKpToPapbpB+o4q7Wv
vNWqDOBycLxW1j50XjGxXayx04x+6NQTc5WEQzszF2qZamA4SyNAdxTarTrVfnPi
vdS1oUcAb7TECVspNJ9Mn5oc/QKBgQDDBJrZKAz7t673hLnIor0exVFT12/65SOW
I+R5UMz9Vc21KM7n2Vc0MBEmgYYroAzkYH+5vsdDVPw79bDJ3hqIaLQw5/ODJcIp
2n8a7MzHIDKHME+mPNgdWRTYwkPmCf0b6Z3tyQPxSuS/hqEmSGO5ij0tlhuW+aQq
DmTUTgMBTwKBgQDsf3uryGZD1X25JFiSI5O3F8G/l/mi8c2sLkIRhGUS0Q7J4WEh
TrLVEmfVgMlLQ3XEmaryC9bbgu5ekwYlFzinF9N/t6UiHQvEzBoRPO/BTrFmWsn7
qDXHzq6JRVwt7vjMmniNRUtCcx99izwW3skrXiax9t10aAxrGUSgvlswLQKBgGU1
kpd4raRFY8yZWUHDE5tQlDCK8lanbJyS7BP51yjyyttl3lt89EDlYUE2n0csvQQZ
ALCJTiinhnAnxiQ93E9G550qA7rgca/+8VAr7Oq6zv5SGEQR96bjgGouB8bvECjY
SVoKpL0pPSYY3LFdiEPWdoGeEZt827Hn3nRAOFcJAoGAfKdWurM7RuN4pF/XtX9I
rRC8+ifBQHv6J1RaZUDp1cO8uGDLaI41OTZINh1VLqLMbvOkxjq5AdrBTCrRtPo0
HRCGZ/goclpVCyeH6ZdSrG2JPDuQxYXe3Oe1e3Mm+ev0Zwp0nLsAtHoTmjK7lYHh
DsXz9GMRESdSNrsBPDzQA0E=
-----END PRIVATE KEY-----`;

  beforeEach(() => {
    // Create a temporary directory for testing
    testStorageDir = fs.mkdtempSync(path.join(os.tmpdir(), 'license-test-'));
    LicenseStorage.setStoragePath(testStorageDir);

    // Set correct public key for validator
    const correctPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvN1WpUDdId7wXn3X/anH
ulk2OYfK2n0WyBvilpmhvWweQ+dMpiwRV0csdhK7sZ6dPH9VSAQ/OnWdHHrwEulS
91B56QrTRW3yByVE4Pv1B1wevAhRUgbtt8wS4JsdVK9EHBIpB8JtjUdehd9jmzQT
DoJXlkBavn+l9FJoFjU9cCEpAmz22u4lHoSsoYdLhYR4iDWhIBDc/8NOX3iDiIxj
qKCodCY9Id+KErkGkf3APwXY1enZjTlW9UumXNFJzpbZWrLjT1MvXqkwDGX5L188
OE/sfVrGK4GDJvusr/M3X+BWVXfXkUqVUJob7jUQufpDuht42jWARoGZLB5sR6Lv
EwIDAQAB
-----END PUBLIC KEY-----`;

    LicenseValidator.setPublicKey(correctPublicKey);
    LicenseGenerator.setPrivateKey(testPrivateKey);

    // Clean up any existing licenses
    clearStoredLicense();
  });

  afterEach(() => {
    // Clean up after tests
    clearStoredLicense();
    // Reset to default storage path
    LicenseStorage.setStoragePath(null);
    // Clean up temporary directory
    if (fs.existsSync(testStorageDir)) {
      fs.rmSync(testStorageDir, { recursive: true, force: true });
    }
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
      // Validate to populate cache
      LicenseValidator.validateLicense(expiredToken);

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
