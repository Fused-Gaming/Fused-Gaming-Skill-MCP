import { createPrivateKey, sign } from 'crypto';
import { LicensePayload, TrialLicenseOptions, CommercialLicenseOptions } from './types.js';
import { LicenseStorage } from './storage.js';

export class LicenseGenerator {
  private static readonly DEFAULT_TRIAL_KEY = `-----BEGIN PRIVATE KEY-----
MIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQDxM+wB6xCfIzhj
LRbeWzYh0hXw5C8DyIQicHflHRkmu2oZSLpAvASILoBFmUHyvFbfA4sRHyX2b2pz
vvOzPn4BiY3BLVvHH4vmMeBUBTkndOaZ7xhsyzZQiWRxQ1i/VhW2xXzNZpPvw4sL
66ExTOb1n2hqLcFLJUDsBZDnian6fzRZoiFqwal1hUKGyXNoptw/eAhJq/x2/1BP
2AmUdepATIaIKldppNpCUUERNR8L8h1v3wSb99vFtg7mnGITovGulMpbPT1d58fx
feID/DmgPfmFmTgQAfycr/h8V67ak3y15R+TpjB6342etNXNqqEawtGVvvuaej/S
8oew6pN5AgMBAAECgf9mG/TtWvXOaLqWQaBMwZBJAQcI05CTqW9GpRYciBT9sJlZ
2s/+V5oTjJwA2sBwYgrknjthJC6OBNyr40qHtwzg2bqI7QrNYS14ZeTxrMRlT7fP
sshERkLYFVHQIRKQ7YCDv1b2HVbDSaSzhyzWEhg0Iyewy23owfyZ7kFJw52RzTWV
/yO+gLlFw2XW6yDBuIu4yxBCie1BPtNz9Coa4IzpeFOzkuUBuvTPtGVMSp0FEWgk
KJlnRVLFczQ46mhr3g3JRLUObcoNGZ/IDUKQLYbsEQkszRGrEl3pJxwwW3L3h5cX
7HNJmhXpb04V46QfxNprVyXoBfrmsiUEIdMqNEECgYEA+oDv6+Wo8tmTsRnZ1l7K
c7WcO7mT2/iQ65xQPcAo2HgMP06yY1s/R86wSGImHVp95eRcXQfK6GCB198PlRak
dJaLw+FbuN5qon6om7iSQwGrc0N3k3wMSAw/IAaS8V9+qFaRkOOfB3aJse6BOVLu
TxFpbPjxX9aBvNt9J/Kp20ECgYEA9n6+E+F5o1tPW3GA9q6vG5uo7c2Qc6g/jK9T
jRfR3pud5738Agn30YqTMfXG3+M4vuAZQ+0QXUxYl3imxbI7E+jqoLntsW0l7CaI
Z/qoDWoWnCDbFlRwdIgge4dERD6Z3KT6SDWpkFROQmUKCIRlkHwMKwrUX2nK7oj2
yHQSQjkCgYBgWHLucbgXHyO0u9KSpoaLFlBukCOUOPfUBpy+A0gyaYmcV7I4kIG4
JoCadlVeeM1vO/NiPHsIAQYvdrVRjBHYXYaH4gcbBUBSGxDSQ5zNdLjybgJxkQZQ
N5WXxa+Cck4OhK0b4s/pWOgArVC6MXFCq9m2ddCwIZpofqqWULiPgQKBgChfTeaX
sYKN/AtwJb1BkzCkaCC64IPw9KeoN7kOQ7OALXa9aT80PsC1P7KZHL+iybKJpdm4
REvjq0bz3ezXalGyfmtgyIuc4u8wyHqvVUMNMzLTNs8LeXe8rAVPfGDpF+5Jnyyg
jWs0Q7UgM2p9tNzbVGrgVTRjcXdsO29Ng4gRAoGATbStSBVQVl49r7g0BKUeyuGy
Nxe3KBEOoQvLRa9DfI5jBDBeIdrO/htoB/bBq4WQfMngicXT+LrwLfWXo3qvLdx1
f0IMjnz9f8+v1JCt8a4M15mIL6E1Ff8g6zHdf76ZaxgQc1di49cOEBd5saq1LrJl
C+5xo4bL/zxGkXkXAFo=
-----END PRIVATE KEY-----`;

  static generateTrialLicense(options: TrialLicenseOptions = {}): string {
    const days = options.days ?? 14;
    const product = options.product ?? 'syncpulse-cli';
    const version = options.version ?? '1.2.0';

    const now = new Date();
    const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const machineId = LicenseStorage.getMachineId();

    const payload: LicensePayload = {
      type: 'trial',
      issued_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      product,
      version,
      features: {
        concurrent_agents: 1,
        storage_gb: 10,
        team_members: 1,
        priority_support: false,
        custom_branding: false,
      },
      activation: {
        activated_at: now.toISOString(),
        machine_id: machineId,
        license_key: `trial_${Date.now()}`,
      },
    };

    return this.signLicense(payload, this.DEFAULT_TRIAL_KEY);
  }

  static generateCommercialLicense(options: CommercialLicenseOptions, privateKey: string): string {
    const now = new Date();

    const payload: LicensePayload = {
      type: options.type,
      issued_at: now.toISOString(),
      expires_at: options.expiresAt.toISOString(),
      product: 'syncpulse-cli',
      version: options.version ?? '1.2.0',
      sub: options.email,
      features: options.features,
      activation: {
        activated_at: now.toISOString(),
        machine_id: options.machineId ?? LicenseStorage.getMachineId(),
        license_key: options.licenseKey,
      },
    };

    return this.signLicense(payload, privateKey);
  }

  static generateTeamLicense(options: CommercialLicenseOptions, privateKey: string): string {
    return this.generateCommercialLicense({ ...options, type: 'team' }, privateKey);
  }

  static generateEnterpriseLicense(options: CommercialLicenseOptions, privateKey: string): string {
    return this.generateCommercialLicense({ ...options, type: 'enterprise' }, privateKey);
  }

  private static signLicense(payload: LicensePayload, privateKey?: string): string {
    if (!privateKey) {
      throw new Error(
        'Commercial license signing requires a private key. ' +
        'Set via environment variable SYNCPULSE_PRIVATE_KEY or pass as parameter. ' +
        'For development, generate a key with: openssl genrsa -out key.pem 2048'
      );
    }

    const header = {
      alg: 'RS256',
      typ: 'JWT',
      kid: 'syncpulse-2026',
    };

    const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');

    const key = createPrivateKey({
      key: privateKey,
      format: 'pem',
    });

    const signature = sign('sha256', Buffer.from(`${headerB64}.${payloadB64}`), {
      key,
      format: 'pem',
      type: 'pkcs8',
    });

    const signatureB64 = signature.toString('base64url');
    return `${headerB64}.${payloadB64}.${signatureB64}`;
  }
}
