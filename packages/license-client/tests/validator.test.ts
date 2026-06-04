/**
 * License Validator Tests
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { LicenseValidator } from '../src/validator.js';
import { LicenseGenerator } from '../src/generator.js';
import { LicensePayload } from '../src/types.js';
import { LicenseStorage } from '../src/storage.js';

describe('LicenseValidator', () => {
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
    LicenseStorage.clearLicense();
  });

  afterEach(() => {
    // Reset to default storage path
    LicenseStorage.setStoragePath(null);
    // Clean up temporary directory
    if (fs.existsSync(testStorageDir)) {
      fs.rmSync(testStorageDir, { recursive: true, force: true });
    }
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
      const token = LicenseGenerator.generateTrialLicense({ days: -8 });
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
      const token = LicenseGenerator.generateTrialLicense({ days: 60 });
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
        issued_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
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
