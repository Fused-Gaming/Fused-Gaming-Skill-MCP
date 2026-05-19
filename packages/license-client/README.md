# License Client

**Complete license validation and management library for SyncPulse CLI**

License validation, trial management, and offline support for the SyncPulse licensing system.

## Installation

```bash
npm install @h4shed/license-client
```

## Features

- **JWT-based licenses** with RS256 signature verification
- **Trial licenses** with configurable duration (default: 14 days)
- **Commercial, Team & Enterprise** license types
- **Offline validation** using cached licenses with grace period support
- **Machine binding** to prevent license copying across devices
- **Grace period** for expired licenses (7 days default)
- **Secure storage** at `~/.syncpulse/` with restrictive permissions (0600)
- **100% TypeScript** with strict type safety
- **Comprehensive test suite** with >90% coverage

## Quick Start

### Initialize Trial License (First Install)

```typescript
import { initializeLicense, validateStoredLicense } from '@h4shed/license-client';

// Generate and save trial license on first run
if (!validateStoredLicense()) {
  const trialToken = initializeLicense();
  console.log('Trial license initialized:', trialToken);
}
```

### Check License Status

```typescript
import { getStoredLicenseStatus } from '@h4shed/license-client';

const status = getStoredLicenseStatus();
if (status?.valid) {
  console.log(`License type: ${status.payload.type}`);
  console.log(`Days remaining: ${status.daysRemaining}`);
  console.log(`Features:`, status.payload.features);
}
```

### Offline Validation (No Internet Required)

```typescript
import { validateOffline } from '@h4shed/license-client';

const offlineStatus = validateOffline();
if (offlineStatus.valid) {
  console.log('License valid (using cached copy)');
  if (offlineStatus.warnings) {
    console.warn('Warnings:', offlineStatus.warnings);
  }
}
```

### Activate a License

```typescript
import { activateLicense } from '@h4shed/license-client';

try {
  activateLicense(licenseKeyFromUser);
  console.log('License activated successfully');
} catch (error) {
  console.error('Failed to activate:', error.message);
}
```

## Advanced Usage

### Generate Trial Licenses (Server-side)

```typescript
import { LicenseGenerator } from '@h4shed/license-client';

// 14-day trial
const trialToken = LicenseGenerator.generateTrialLicense({ days: 14 });

// Custom trial period
const extendedTrial = LicenseGenerator.generateTrialLicense({ days: 30 });
```

### Generate Commercial Licenses

```typescript
import { LicenseGenerator } from '@h4shed/license-client';

const commercialToken = LicenseGenerator.generateCommercialLicense(
  {
    type: 'commercial',
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    licenseKey: 'syncpulse_prod_key',
    version: '1.2.0',
    features: {
      concurrent_agents: 5,
      storage_gb: 100,
      team_members: 1,
      priority_support: true,
      custom_branding: false
    }
  },
  privateKey // RS256 private key for signing
);
```

### Generate Team Licenses

```typescript
import { LicenseGenerator } from '@h4shed/license-client';

const teamToken = LicenseGenerator.generateTeamLicense(
  {
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    licenseKey: 'syncpulse_team_key',
    version: '1.2.0',
    features: {
      concurrent_agents: 10,
      storage_gb: 500,
      team_members: 5,
      priority_support: true,
      custom_branding: false
    }
  },
  privateKey // RS256 private key for signing
);
```

### Generate Enterprise Licenses

```typescript
import { LicenseGenerator } from '@h4shed/license-client';

const enterpriseToken = LicenseGenerator.generateEnterpriseLicense(
  {
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    licenseKey: 'syncpulse_enterprise_key',
    version: '1.2.0',
    features: {
      concurrent_agents: 100,
      storage_gb: 5000,
      team_members: 1000,
      priority_support: true,
      custom_branding: true
    }
  },
  privateKey // RS256 private key for signing
);
```

### Validate License (Online)

```typescript
import { LicenseValidator } from '@h4shed/license-client';

const result = LicenseValidator.validateLicense(token);
if (result.valid) {
  console.log('License is valid');
  console.log(`Days remaining: ${result.daysRemaining}`);
  console.log(`In grace period: ${result.inGracePeriod}`);
} else {
  console.error(`Validation failed: ${result.error}`);
}
```

### Check Expiration Status

```typescript
import { LicenseValidator } from '@h4shed/license-client';

const token = LicenseStorage.loadLicense();
const payload = jwt.decode(token);

const expirationStatus = LicenseValidator.checkExpiration(payload);

console.log(`Expired: ${expirationStatus.expired}`);
console.log(`Days remaining: ${expirationStatus.daysRemaining}`);
console.log(`In grace period: ${expirationStatus.inGracePeriod}`);
console.log(`Expires at: ${expirationStatus.expiresAt}`);
console.log(`Grace ends at: ${expirationStatus.gracePeriodEndsAt}`);
```

### Get Expiration Warning

```typescript
import { LicenseValidator } from '@h4shed/license-client';

const warning = LicenseValidator.getExpirationWarning(payload);
if (warning) {
  console.warn(warning);
}
```

### Direct Storage Operations

```typescript
import { LicenseStorage } from '@h4shed/license-client';

// Get storage directory
const storageDir = LicenseStorage.getStoragePath();
// → ~/.syncpulse

// Check if license exists
const hasLicense = LicenseStorage.hasLicense();

// Get machine ID
const machineId = LicenseStorage.getMachineId();
// → machine_abc123def456...

// Delete license token
LicenseStorage.deleteLicense();

// Clear offline cache
LicenseStorage.clearCache();
```

## License Payload Structure

```typescript
interface LicensePayload {
  type: 'trial' | 'commercial' | 'team' | 'enterprise';
  issued_at: string;           // ISO 8601 timestamp
  expires_at: string;          // ISO 8601 timestamp
  product: string;             // 'syncpulse-cli'
  version: string;             // '1.0.0'
  iss?: string;                // Issuer: 'syncpulse.io'
  sub?: string;                // Subject: user email
  trial_days?: number;         // For trial licenses
  features: {
    concurrent_agents: number;
    storage_gb: number;
    team_members: number;
    priority_support: boolean;
    custom_branding: boolean;
  };
  activation?: {
    activated_at: string;      // ISO 8601 timestamp
    machine_id: string;        // Device identifier
    license_key: string;       // License key
  };
}
```

## Default Features by License Type

### Trial
- 1 concurrent agent
- 10 GB storage
- 1 team member
- No priority support
- No custom branding

### Commercial
- 5 concurrent agents
- 100 GB storage
- 1 team member
- Priority support
- No custom branding

### Team
- 10 concurrent agents
- 500 GB storage
- 5 team members
- Priority support
- No custom branding

### Enterprise
- 100 concurrent agents
- 5,000 GB storage
- 1,000 team members
- Priority support
- Custom branding enabled

## File Storage

Licenses are stored in `~/.syncpulse/` with the following structure:

```
~/.syncpulse/
├── license.jwt           # Main license token (0600 permissions)
├── license.json          # Cached parsed license for offline use
├── machine-id            # Device identifier (0600 permissions)
└── license-history.json  # Activation history (future)
```

**Security notes:**
- All files created with restrictive permissions (0600 for files, 0700 for directory)
- Only the owner can read/write license files
- Machine ID is persisted for consistent device binding

## Expiration & Grace Period

### Timeline

```
Day 0-13: Valid license
Day 14:   Grace period begins
Day 14-20: Grace period (offline validation still works)
Day 21:   License fully expired
```

### Default Grace Periods

- **Trial**: 7 days
- **Commercial**: 7 days
- **Team**: 7 days
- **Enterprise**: 7 days

## Environment Configuration

Set custom issuer and product metadata:

```typescript
import { LicenseValidator, LicenseGenerator } from '@h4shed/license-client';

// Set public key for verification
LicenseValidator.setPublicKey(`-----BEGIN PUBLIC KEY-----
...
-----END PUBLIC KEY-----`);

// Set product information
LicenseGenerator.setProductMetadata('my-product', '2.0.0');
LicenseGenerator.setIssuer('my-company.io');
```

## Testing

Run the full test suite:

```bash
npm test --workspace=@h4shed/license-client
```

**Coverage**: >90% across all modules
- Types validation
- Storage operations with permission checks
- License validation and signature verification
- Trial/Commercial/Team/Enterprise generation
- Offline validation with grace period
- Machine ID consistency
- Integration workflows
- Edge cases and error handling

## Error Handling

All functions provide clear error messages:

```typescript
try {
  const result = LicenseValidator.validateLicense(token);
  if (!result.valid) {
    console.error(`License invalid: ${result.error}`);
    // Possible errors:
    // - "License expired"
    // - "Invalid JWT: ..."
    // - "License bound to different machine"
  }
} catch (error) {
  console.error(`Validation failed: ${error.message}`);
}
```

## Security Considerations

1. **JWT Signature**: All licenses are signed with RS256 (asymmetric)
2. **No key material in logs**: Private keys never appear in error messages
3. **Machine binding**: Optional machine_id prevents copying across devices
4. **Offline validation**: Uses cached payload (no signature re-verification)
5. **Grace period**: Allows offline use after expiration for 7 days
6. **File permissions**: Strict 0600/0700 prevents unauthorized access
7. **Regular rotation**: Keys should be rotated annually

## CLI Integration Example

```typescript
import { getStoredLicenseStatus, validateOffline } from '@h4shed/license-client';

export async function checkLicense() {
  // Try online validation first
  const status = getStoredLicenseStatus();
  
  if (!status) {
    // Fall back to offline
    const offline = validateOffline();
    if (!offline.valid) {
      throw new Error('License required. Use: syncpulse license:activate <key>');
    }
    
    if (offline.warnings) {
      console.warn(offline.warnings.join('\n'));
    }
    return offline.cachedPayload;
  }
  
  if (!status.valid) {
    throw new Error(`License invalid: ${status.error}`);
  }
  
  return status.payload;
}
```

## API Reference

### LicenseValidator

- `validateLicense(token)`: Verify JWT signature and expiration
- `checkExpiration(payload)`: Calculate expiration status
- `isOfflineValid()`: Validate cached license (no internet)
- `getMachineId()`: Get current device identifier
- `verifyMachineBinding(payload)`: Check machine binding
- `getExpirationWarning(payload)`: Get user-friendly warning message
- `validateWithMachineBinding(token, machineId?)`: Full validation with binding check
- `setPublicKey(key)`: Set custom verification key
- `getPublicKey()`: Get current verification key

### LicenseGenerator

- `generateTrialLicense(options?)`: Create trial license
- `generateCommercialLicense(options)`: Create commercial license
- `generateTeamLicense(customerId, email)`: Create team license
- `generateEnterpriseLicense(customerId, email)`: Create enterprise license
- `signLicense(payload, privateKey?)`: Sign JWT manually
- `setPrivateKey(key)`: Set custom signing key
- `setProductMetadata(name, version)`: Set product info
- `setIssuer(issuer)`: Set issuer claim

### LicenseStorage

- `getStoragePath()`: Get `~/.syncpulse` directory
- `ensureStorageDirectory()`: Create directory with 0700 permissions
- `saveLicense(token)`: Store license token
- `loadLicense()`: Read license token
- `saveLicenseCache(payload)`: Store parsed license
- `loadLicenseCache()`: Read cached license
- `clearLicense()`: Delete all license files
- `getMachineId()`: Get/generate device ID
- `hasLicense()`: Check if license file exists
- `getLicenseModificationTime()`: Get file modification time

## License

Apache-2.0

## Support

For issues or questions:
- GitHub: https://github.com/fused-gaming/fused-gaming-skill-mcp
- Email: support@fused-gaming.io
