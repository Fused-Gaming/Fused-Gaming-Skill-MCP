# License Management CLI System - Design Document

**Project:** Fused Gaming MCP - License CLI Module
**Specialist:** Specialist 3: CLI Developer
**Sprint:** Week 2 (May 19-25, 2026)
**Status:** Design Phase Complete

## Executive Summary

This document outlines the complete architecture for a license management CLI system with 5 commands: `license list`, `license check`, `license activate`, `license renew`, and `license status`. The system integrates with the existing `@h4shed/license-client` package and leverages the CLI framework (yargs) and UI libraries (chalk, inquirer, boxen, ora) already present in the monorepo.

---

## 1. CLI Architecture Overview

### 1.1 Framework & Dependencies

**CLI Framework:** yargs (v17.7.2)
**UI/Output Libraries:**
- `chalk` (v5.6.2) - Terminal text styling
- `inquirer` (v12.10.0) - Interactive prompts
- `ora` (v9.0.0) - Loading spinners
- `boxen` (v8.0.1) - Terminal frames
- `figlet` (v1.9.2) - ASCII art

**License Integration:**
- `@h4shed/license-client` - License validation, storage, and machine binding
- `jsonwebtoken` (v9.0.0) - JWT parsing (transitive dependency)

**Data Persistence:**
- **SQLite** (new) - Local license metadata, cache, and settings
  - Package: `better-sqlite3` (v9.x or v11.x - native binding, high performance)
  - Alternatives: `sqlite3` (node-sqlite3, async) or `sql.js` (WASM)
  - Choice: `better-sqlite3` for synchronous, fast file I/O in CLI context

### 1.2 Command Routing Architecture

Commands follow the existing yargs pattern in `/packages/cli/src/index.ts`:

```
fused-gaming-mcp license [subcommand] [options]
  ├── license list [--all|--active|--expired]
  ├── license check <id> [--refresh]
  ├── license activate [--interactive]
  ├── license renew <id> [--confirm]
  └── license status [--dashboard|--json]
```

Each command is a modular function in `/packages/cli/src/commands/license/`:
- `list.ts` - List installed licenses
- `check.ts` - Validate a license
- `activate.ts` - Activate a new license
- `renew.ts` - Request license renewal
- `status.ts` - Dashboard view

---

## 2. SQLite Schema Design

### 2.1 Database Initialization

**Path:** `~/.syncpulse/licenses.db` (same directory as `license.jwt` and `license.json`)

**Database File Permissions:** `0o600` (user read/write only)

### 2.2 Table Definitions

#### `licenses` Table
Core license metadata and state

```sql
CREATE TABLE licenses (
  id TEXT PRIMARY KEY,
  license_key TEXT NOT NULL UNIQUE,
  jwt_token TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('trial', 'commercial', 'team', 'enterprise')),
  issuer TEXT,
  issued_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  activated_at DATETIME,
  machine_id TEXT,
  status TEXT DEFAULT 'inactive' CHECK(status IN ('inactive', 'active', 'expired', 'grace')),
  features_json TEXT,
  activation_metadata_json TEXT,
  last_verified_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_licenses_status ON licenses(status);
CREATE INDEX idx_licenses_expires_at ON licenses(expires_at);
CREATE INDEX idx_licenses_machine_id ON licenses(machine_id);
```

**Fields Explanation:**
- `id`: UUID or hash of license key
- `license_key`: Human-readable key (encrypted for storage)
- `jwt_token`: Full JWT for online validation
- `type`: trial/commercial/team/enterprise
- `issuer`: Organization that issued the license
- `issued_at`, `expires_at`: License validity window
- `activated_at`: When license was first activated on this machine
- `machine_id`: Hardware binding (from LicenseStorage.getMachineId())
- `status`: Current state (inactive/active/expired/grace)
- `features_json`: Serialized LicenseFeatures object
- `activation_metadata_json`: Additional activation data
- `last_verified_at`: Timestamp of last online validation

#### `cache` Table
Offline validation cache and metadata

```sql
CREATE TABLE cache (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  last_online_check DATETIME,
  last_valid_token TEXT,
  offline_mode_active INTEGER DEFAULT 0,
  grace_period_warnings_sent INTEGER DEFAULT 0,
  next_renewal_reminder DATETIME,
  cache_metadata_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_cache_singleton ON cache(id);
```

**Fields Explanation:**
- `last_online_check`: Timestamp of last successful online validation
- `last_valid_token`: Cache of last validated JWT
- `offline_mode_active`: Boolean flag for offline operation
- `grace_period_warnings_sent`: Counter for warning rate-limiting
- `next_renewal_reminder`: When to show renewal reminder
- `cache_metadata_json`: Additional cache metadata

#### `settings` Table
User preferences and CLI configuration

```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  type TEXT CHECK(type IN ('string', 'number', 'boolean', 'json')) DEFAULT 'string',
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_type ON settings(type);
```

**Predefined Settings:**
- `notify_grace_period`: boolean - Show grace period warnings
- `notify_expiration_days`: number - Days before expiration to warn
- `auto_renewal_enabled`: boolean - Enable auto-renewal checks
- `grace_period_notification_level`: string - 'silent', 'warning', 'critical'
- `last_dashboard_view`: string - Timestamp of last status check
- `preferred_output_format`: string - 'text', 'json', 'table'

#### `audit_log` Table
License validation and operation history

```sql
CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  license_id TEXT,
  operation TEXT NOT NULL,
  result TEXT CHECK(result IN ('success', 'failure', 'warning')),
  details_json TEXT,
  error_message TEXT,
  machine_id TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(license_id) REFERENCES licenses(id)
);

CREATE INDEX idx_audit_log_license_id ON audit_log(license_id);
CREATE INDEX idx_audit_log_operation ON audit_log(operation);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);
```

**Operations Logged:**
- `validate_online` - Online JWT verification attempt
- `validate_offline` - Offline cache validation
- `activate` - License activation
- `deactivate` - License deactivation
- `renew` - Renewal request
- `grace_period_start` - Entered grace period
- `grace_period_end` - Exited grace period
- `expire` - License expiration

### 2.3 Data Encryption Strategy

**Sensitive Fields Encryption:**
- License key: AES-256-GCM encryption using `crypto` module
- JWT token: Encrypted (optional - can be plaintext with file permissions)
- Machine ID: Plaintext (publicly known, derived from hardware)

**Encryption Key Derivation:**
- Master key derived from: `SHA256(HOMEDIR + HOSTNAME + PLATFORM)`
- IV (Initialization Vector): Randomly generated, stored in first 16 bytes
- Implementation: Node.js built-in `crypto` module

**Encrypted Fields Storage:**
```json
{
  "encrypted": true,
  "algorithm": "aes-256-gcm",
  "iv": "hex-encoded-iv",
  "authTag": "hex-encoded-auth-tag",
  "data": "hex-encoded-ciphertext"
}
```

---

## 3. Command Specifications

### 3.1 `license list` Command

**Description:** Display all installed licenses with status and expiration info

**Invocation:**
```bash
fused-gaming-mcp license list [--all] [--active] [--expired] [--json]
```

**Options:**
- `--all` - Show all licenses (default: active + grace period)
- `--active` - Show only active licenses
- `--expired` - Show only expired licenses
- `--json` - JSON output for scripting

**Output (Table Format):**
```
╭─────────────────────────────────────────────────────────────╮
│ 📋 License Inventory                                        │
├──────────────┬──────────┬──────────────┬────────────────────┤
│ License ID   │ Type     │ Status       │ Expires            │
├──────────────┼──────────┼──────────────┼────────────────────┤
│ LIC-ABC123   │ trial    │ ✓ Active     │ 2026-06-15 (25d)  │
│ LIC-DEF456   │ commercial │ ⏳ Grace   │ 2026-05-20 (-1d)  │
│ LIC-GHI789   │ team     │ ✗ Expired    │ 2026-04-01 (-50d) │
╰──────────────┴──────────┴──────────────┴────────────────────╯

Commands: license check <id> | license renew <id> | license status
```

**Implementation Details:**
1. Query `licenses` table with status filter
2. Calculate days remaining from expires_at
3. Apply color coding: green (active), yellow (grace), red (expired)
4. Sort by expires_at ASC (nearest expiration first)
5. Display with boxen frame and chalk colors

### 3.2 `license check` Command

**Description:** Validate a specific license and show detailed info

**Invocation:**
```bash
fused-gaming-mcp license check <license-id> [--refresh] [--verbose]
```

**Arguments:**
- `<license-id>` - License ID or key (required)

**Options:**
- `--refresh` - Force online validation (default: use cache if valid)
- `--verbose` - Show detailed feature breakdown and activation data

**Output:**
```
╭──────────────────────────────────────────╮
│ ✓ License Valid                          │
├──────────────────────────────────────────┤
│ License ID:       LIC-ABC123             │
│ Type:             trial                  │
│ Issued:           2026-05-19             │
│ Expires:          2026-06-15 (25 days)  │
│ Status:           ACTIVE                 │
│ Machine Binding:  Verified               │
│ Last Verified:    2026-05-21 10:30:45   │
├──────────────────────────────────────────┤
│ Features:                                │
│  • Agents:        2 concurrent           │
│  • Storage:       10 GB                  │
│  • Team Members:  Unlimited              │
│  • Support:       Community              │
╰──────────────────────────────────────────╯
```

**Validation Flow:**
1. Look up license in database by ID or key
2. Check `last_verified_at` and cache freshness
3. If `--refresh` or cache stale (>24h), perform online validation:
   - Call `LicenseValidator.validateLicense(jwt_token)`
   - Update `last_verified_at` and status in database
4. Check machine binding: `LicenseValidator.getMachineId()` matches stored machine_id
5. Display validation result with grace period warnings if applicable

**Error Handling:**
```
✗ License Invalid
├─ Error: License expired and grace period has ended
├─ Expired: 2026-04-01 (50 days ago)
├─ Grace Period: 2026-04-15 (35 days ago)
└─ Action: Use 'license renew' to extend your license
```

### 3.3 `license activate` Command

**Description:** Interactive workflow to activate a new license

**Invocation:**
```bash
fused-gaming-mcp license activate [--token <jwt>] [--key <key>] [--non-interactive]
```

**Interactive Prompt Flow:**
```
Activate a License

? License Token or JWT: [paste JWT]
? License Key (optional): [enter key]
? Apply to current machine? Yes
? Binding machine ID: <auto-detected>
? Confirm activation? (Yes/No)
```

**Non-Interactive Mode:**
```bash
fused-gaming-mcp license activate --token <jwt> --key <key> --confirm
```

**Process:**
1. Accept JWT or license key from input
2. Parse JWT and extract payload
3. Validate signature: `LicenseValidator.validateLicense(token)`
4. Check machine binding (prompt for confirmation if not set)
5. Store license in database with `status='active'` and `activated_at=now()`
6. Save JWT to `~/.syncpulse/license.jwt` (via LicenseStorage)
7. Update cache in `cache` table

**Success Output:**
```
╭────────────────────────────────┐
│ ✓ License Activated            │
├────────────────────────────────┤
│ License ID: LIC-ABC123         │
│ Type: trial                    │
│ Expires: 2026-06-15 (25 days) │
│ Machine: MacBook-Pro (bound)  │
│ Features: 2 agents, 10 GB     │
│ Status: READY TO USE          │
╰────────────────────────────────╯
```

**Error Recovery:**
- Invalid JWT: Show parsing error, suggest re-check
- Expired license: Show expiration date, suggest renewal
- Machine mismatch: Show current + license machine IDs, allow override
- Duplicate activation: Check if already active, offer refresh

### 3.4 `license renew` Command

**Description:** Request license renewal or extend trial

**Invocation:**
```bash
fused-gaming-mcp license renew <license-id> [--new-token <jwt>] [--confirm]
```

**Arguments:**
- `<license-id>` - License to renew

**Options:**
- `--new-token <jwt>` - New JWT to apply (skip prompt)
- `--confirm` - Skip confirmation prompt

**Process:**
1. Look up existing license in database
2. Validate current license state
3. Prompt for new JWT or license key
4. Validate new JWT: `LicenseValidator.validateLicense(new_token)`
5. Verify new license doesn't conflict with existing (same/extended term)
6. Update license record: update `jwt_token`, `expires_at`, `activated_at`
7. Log operation to `audit_log` table
8. Clear cache if renewal successful

**Output:**
```
Renewing License LIC-ABC123

Old Expiration: 2026-06-15
New Expiration: 2026-12-15
Extended: 6 months

✓ License renewed successfully
```

**Renewal Failure Cases:**
- Grace period expired: Show "License cannot be renewed (too far expired)"
- Invalid new token: Show validation error
- Mismatched license types: Warn about type change

### 3.5 `license status` Command

**Description:** Dashboard view of license status and system health

**Invocation:**
```bash
fused-gaming-mcp license status [--dashboard] [--json] [--watch]
```

**Options:**
- `--dashboard` - ASCII art dashboard (default)
- `--json` - JSON output
- `--watch` - Refresh dashboard every 5 seconds

**Dashboard Output:**
```
╔════════════════════════════════════════════════════════════╗
║         FUSED GAMING MCP - LICENSE STATUS DASHBOARD        ║
╚════════════════════════════════════════════════════════════╝

┌─ License Summary ────────────────────────────────────────┐
│ Active Licenses:      1                                   │
│ Grace Period:         1                                   │
│ Expired:              0                                   │
│ Last Verified:        2026-05-21 10:30:45                │
└──────────────────────────────────────────────────────────┘

┌─ Primary License ────────────────────────────────────────┐
│ ID:       LIC-ABC123                    Type: trial      │
│ Status:   ✓ ACTIVE                      Verified: Yes    │
│ Issued:   2026-05-19                    Expires: 2026-06-15 │
│ Days Left: 25                           Grace Period: 7d  │
│ Machine:  MacBook-Pro (Bound)           Binding: OK      │
└──────────────────────────────────────────────────────────┘

┌─ System Information ────────────────────────────────────┐
│ Machine ID:    sha256(...)[0:16]                         │
│ Platform:      darwin (macOS)                           │
│ Mode:          Online (Last: 10 min ago)                │
│ Notifications: Enabled                                   │
└──────────────────────────────────────────────────────────┘

Hint: Use 'license renew LIC-ABC123' to extend your license
```

**JSON Output:**
```json
{
  "timestamp": "2026-05-21T10:30:45Z",
  "licenses": {
    "active": 1,
    "grace": 1,
    "expired": 0
  },
  "primary_license": {
    "id": "LIC-ABC123",
    "type": "trial",
    "status": "active",
    "expires_at": "2026-06-15T00:00:00Z",
    "days_remaining": 25,
    "machine_binding": "verified"
  },
  "system": {
    "machine_id": "...",
    "platform": "darwin",
    "offline_mode": false,
    "last_online_check": "2026-05-21T10:20:45Z"
  }
}
```

**Watch Mode:**
- Refresh dashboard every 5 seconds
- Use `ora` spinner during fetch
- Keyboard shortcut: `q` to quit, `r` to refresh now

---

## 4. Integration Strategy

### 4.1 Integration with `@h4shed/license-client`

**Key Integration Points:**

1. **LicenseValidator Integration:**
   - `LicenseValidator.validateLicense(token)` - Online JWT verification
   - `LicenseValidator.validateWithMachineBinding(token)` - Machine binding check
   - `LicenseValidator.checkExpiration(payload)` - Expiration calculation
   - `LicenseValidator.getExpirationWarning(payload)` - Grace period messages

2. **LicenseStorage Integration:**
   - `LicenseStorage.saveLicense(token)` - Persist JWT to `~/.syncpulse/license.jwt`
   - `LicenseStorage.loadLicense()` - Load JWT from file
   - `LicenseStorage.getMachineId()` - Get hardware-based machine ID
   - `LicenseStorage.saveLicenseCache(payload)` - Cache validated payload
   - `LicenseStorage.loadLicenseCache()` - Load cached payload

3. **Custom Wrapping:**
   - Create `/packages/cli/src/lib/license-db.ts` for SQLite operations
   - Create `/packages/cli/src/lib/license-validator-wrapper.ts` for extended validation with offline fallback
   - Create `/packages/cli/src/lib/encryption.ts` for key encryption/decryption

### 4.2 Offline Validation Fallback

**Flow:**
```
1. User runs 'license check LIC-ABC123'
2. Try online validation: LicenseValidator.validateLicense(jwt_token)
3. If online fails (no network):
   a. Check if offline mode is enabled in cache table
   b. Call LicenseValidator.isOfflineValid()
   c. Return cached payload with warnings
4. Cache result in SQLite for next offline attempt
5. Set next_renewal_reminder based on days_remaining
```

**Offline Mode Activation Conditions:**
- Network unreachable (ECONNREFUSED, ETIMEDOUT)
- 5+ consecutive online validation failures
- User explicitly enables offline mode: `license status --offline-mode`

**Grace Period Handling:**
- If expired but in grace period: Allow offline validation with warning
- Show countdown: "Grace period ends in X days"
- Log grace period start/end events in audit_log

### 4.3 Machine Binding Verification

**Process:**
1. On activation: Capture current machine ID
   ```typescript
   const machineId = LicenseStorage.getMachineId();
   // Store in licenses.machine_id
   ```

2. On validation: Verify machine hasn't changed
   ```typescript
   const currentMachineId = LicenseValidator.getMachineId();
   const stored_machine_id = license.machine_id;
   // Alert if different
   ```

3. Machine Change Detection:
   - Hostname changed (e.g., after system rename)
   - Network interfaces changed (MAC address)
   - Platform changed (unlikely but handled)

4. Recovery Options:
   - Show current vs. stored machine ID
   - Offer to re-bind to current machine
   - Require user confirmation
   - Log re-binding to audit_log

---

## 5. Error Handling & Recovery Flows

### 5.1 Error Categories & Responses

#### Network Errors
```
Error: Network unreachable
Status: Falling back to offline validation
Action: Retrying in 30 seconds (press Ctrl+C to cancel)
        Use 'license status --offline-mode' to disable online checks
```

#### JWT Validation Errors
```
Error: Invalid JWT signature
Status: License token is corrupted or tampered with
Action: Activate a new license with 'license activate'
```

#### Expiration Errors
```
Error: License expired
Status: Grace period expires in 5 days
Action: Renew now with 'license renew <id>'
        After grace period, license is no longer usable
```

#### Machine Binding Errors
```
Error: License bound to different machine
Current Machine: MacBook-Pro (M1)
Licensed Machine: Dell-XPS
Status: License is machine-locked
Action: Contact support to change machine binding
        Or use 'license activate --force' to rebind (requires new JWT)
```

### 5.2 Recovery Strategies

**Corrupted Database:**
```bash
fused-gaming-mcp license reset --confirm
# Backs up licenses.db.bak, creates fresh database
# Prompts to re-activate licenses
```

**Stuck Offline Mode:**
```bash
fused-gaming-mcp license status --online-mode-force
# Forces immediate online validation attempt
# Updates cache and status
```

**Grace Period Expired:**
```bash
# Show clear error message with renewal instructions
# Link to renewal page or provide renewal token prompt
# Log recovery attempt to audit_log
```

---

## 6. Implementation Infrastructure

### 6.1 File Structure

```
packages/cli/src/
├── commands/
│   ├── license/
│   │   ├── index.ts           # License command router
│   │   ├── list.ts            # license list implementation
│   │   ├── check.ts           # license check implementation
│   │   ├── activate.ts        # license activate implementation
│   │   ├── renew.ts           # license renew implementation
│   │   └── status.ts          # license status implementation
│   ├── index.ts               # (existing file, add license route)
│   ├── add.ts                 # (existing)
│   └── ... (existing commands)
├── lib/
│   ├── license-db.ts          # SQLite operations wrapper
│   ├── license-validator-wrapper.ts  # Validation with offline fallback
│   ├── encryption.ts          # Key encryption/decryption
│   ├── prompts.ts             # Reusable inquirer prompt helpers
│   └── formatters.ts          # Output formatting utilities
├── ui/
│   ├── dashboard.ts           # License dashboard visualization
│   └── ... (existing UI files)
└── ... (existing structure)
```

### 6.2 SQLite Database Wrapper

**File:** `/packages/cli/src/lib/license-db.ts`

```typescript
import Database from 'better-sqlite3';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

export class LicenseDatabase {
  private static db: Database.Database;

  static init(): void {
    const licenseDir = path.join(os.homedir(), '.syncpulse');
    if (!fs.existsSync(licenseDir)) {
      fs.mkdirSync(licenseDir, { recursive: true, mode: 0o700 });
    }

    const dbPath = path.join(licenseDir, 'licenses.db');
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');

    this.createTables();
  }

  private static createTables(): void {
    // CREATE TABLE statements...
  }

  static getLicense(id: string): License | null {
    // Query and return
  }

  static listLicenses(filter?: 'active' | 'expired' | 'grace'): License[] {
    // Query with filter
  }

  static saveLicense(license: License): void {
    // INSERT or UPDATE
  }

  static updateLicenseStatus(id: string, status: string): void {
    // UPDATE status
  }

  static getCache(): Cache | null {
    // Query cache table
  }

  static updateCache(data: Partial<Cache>): void {
    // UPDATE cache table
  }

  static saveSetting(key: string, value: any, type: string): void {
    // INSERT or UPDATE settings
  }

  static getSetting(key: string): any {
    // Query and return setting value
  }

  static logAudit(
    licenseId: string,
    operation: string,
    result: 'success' | 'failure' | 'warning',
    details?: any,
    error?: string
  ): void {
    // INSERT into audit_log
  }

  static close(): void {
    if (this.db) this.db.close();
  }
}
```

### 6.3 Validator Wrapper with Offline Fallback

**File:** `/packages/cli/src/lib/license-validator-wrapper.ts`

```typescript
import { LicenseValidator, LicensePayload, ValidationResult } from '@h4shed/license-client';
import { LicenseDatabase } from './license-db.js';

export class ValidatorWrapper {
  static async validateWithFallback(
    token: string,
    options?: { refresh: boolean; checkMachine: boolean }
  ): Promise<ValidationResult> {
    const { refresh = false, checkMachine = true } = options || {};

    // Try online validation first
    try {
      const result = LicenseValidator.validateLicense(token, checkMachine);
      
      if (result.valid) {
        // Update cache and last_verified_at
        LicenseDatabase.getCache(); // Update timestamp
      }

      return result;
    } catch (err) {
      // Network or validation error - try offline
      console.warn('Online validation failed, attempting offline validation...');
    }

    // Fallback to offline validation
    const offlineResult = LicenseValidator.isOfflineValid();
    
    if (offlineResult.valid) {
      return {
        valid: true,
        payload: offlineResult.cachedPayload,
        daysRemaining: calculateDaysRemaining(offlineResult.cachedPayload),
        inGracePeriod: true // Offline always implies grace period check
      };
    }

    return offlineResult as ValidationResult;
  }
}
```

### 6.4 Encryption Utility

**File:** `/packages/cli/src/lib/encryption.ts`

```typescript
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import * as os from 'os';

export class Encryption {
  private static masterKey = this.deriveMasterKey();

  private static deriveMasterKey(): Buffer {
    // Derive from HOMEDIR + HOSTNAME + PLATFORM
    // Return 32-byte key for AES-256
  }

  static encrypt(plaintext: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-gcm', this.masterKey, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();

    return JSON.stringify({
      encrypted: true,
      algorithm: 'aes-256-gcm',
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      data: encrypted
    });
  }

  static decrypt(encrypted: string): string {
    const obj = JSON.parse(encrypted);
    const decipher = createDecipheriv('aes-256-gcm', this.masterKey, Buffer.from(obj.iv, 'hex'));
    
    decipher.setAuthTag(Buffer.from(obj.authTag, 'hex'));
    
    let decrypted = decipher.update(obj.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

### 6.5 Prompt Helpers

**File:** `/packages/cli/src/lib/prompts.ts`

```typescript
import inquirer from 'inquirer';

export const LicensePrompts = {
  async askForToken(): Promise<string> {
    const { token } = await inquirer.prompt([
      {
        type: 'password',
        name: 'token',
        message: 'Enter your license token (JWT):',
        mask: '*'
      }
    ]);
    return token;
  },

  async askForLicenseKey(): Promise<string> {
    const { key } = await inquirer.prompt([
      {
        type: 'input',
        name: 'key',
        message: 'License key (optional):',
        prefix: '[OPTIONAL]'
      }
    ]);
    return key;
  },

  async confirmActivation(licenseId: string): Promise<boolean> {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Activate license ${licenseId} on this machine?`,
        default: true
      }
    ]);
    return confirm;
  },

  async selectLicenseToRenew(licenses: License[]): Promise<License> {
    const { selected } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selected',
        message: 'Select a license to renew:',
        choices: licenses.map(l => ({
          name: `${l.id} (${l.type}, expires ${l.expires_at})`,
          value: l
        }))
      }
    ]);
    return selected;
  }
};
```

### 6.6 Output Formatters

**File:** `/packages/cli/src/lib/formatters.ts`

```typescript
import chalk from 'chalk';
import boxen from 'boxen';
import { LicensePayload } from '@h4shed/license-client';

export class Formatters {
  static formatLicenseTable(licenses: License[]): string {
    // Create table with columns: ID, Type, Status, Expires
    // Use colors: green (active), yellow (grace), red (expired)
  }

  static formatLicenseDetails(payload: LicensePayload): string {
    // Format detailed license information with features
  }

  static formatDashboard(data: DashboardData): string {
    // Create ASCII dashboard view
  }

  static formatError(title: string, message: string): string {
    return boxen(
      chalk.red(`${title}\n${message}`),
      { padding: 1, borderColor: 'red' }
    );
  }

  static formatSuccess(title: string, message: string): string {
    return boxen(
      chalk.green(`${title}\n${message}`),
      { padding: 1, borderColor: 'green' }
    );
  }

  static formatWarning(title: string, message: string): string {
    return boxen(
      chalk.yellow(`${title}\n${message}`),
      { padding: 1, borderColor: 'yellow' }
    );
  }
}
```

---

## 7. Integration Plan & Dependencies

### 7.1 Package Dependencies

**New Dependencies to Add to `packages/cli/package.json`:**
```json
{
  "dependencies": {
    "better-sqlite3": "^9.2.2"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.9"
  }
}
```

**Rationale for `better-sqlite3`:**
- Synchronous API (no async overhead in CLI)
- Excellent performance (native C++ binding)
- Battle-tested in production environments
- Small binary footprint
- No external dependencies

### 7.2 Command Registration

**Update `/packages/cli/src/index.ts`:**

```typescript
import { licenseCommand } from './commands/license/index.js';

// Add to yargs command chain:
yargs(hideBin(process.argv))
  .command('init', 'Generate config', {}, async () => { await init(); })
  .command('list', 'List skills', {}, async () => { await list(); })
  .command(
    'license <subcommand>',
    'Manage licenses',
    (yargs: Argv) => licenseCommand(yargs),
    async (argv: Arguments) => { /* handled by subcommand */ }
  )
  // ... other commands
  .parse();
```

**Create `/packages/cli/src/commands/license/index.ts`:**

```typescript
import type { Argv } from 'yargs';
import { list } from './list.js';
import { check } from './check.js';
import { activate } from './activate.js';
import { renew } from './renew.js';
import { status } from './status.js';

export function licenseCommand(yargs: Argv): Argv {
  return yargs
    .command('list [filter]', 'List licenses', listBuilder, listHandler)
    .command('check <id>', 'Check license', checkBuilder, checkHandler)
    .command('activate', 'Activate license', activateBuilder, activateHandler)
    .command('renew <id>', 'Renew license', renewBuilder, renewHandler)
    .command('status', 'Show license status', statusBuilder, statusHandler);
}
```

### 7.3 CLI Integration Points

1. **Database Initialization:**
   - Initialize SQLite on first `license` command invocation
   - Create tables if missing
   - Migrate existing license.jwt and license.json to database

2. **License Client Integration:**
   - Accept `@h4shed/license-client` types
   - Use LicenseValidator and LicenseStorage
   - Maintain compatibility with existing `.syncpulse/` directory

3. **Configuration:**
   - Use existing `.fused-gaming-mcp.json` for CLI-wide settings
   - Store license-specific settings in SQLite `settings` table
   - Allow environment variable overrides: `LICENSE_MODE=offline`

4. **Error Handling:**
   - Catch and format database errors
   - Provide helpful recovery suggestions
   - Log critical errors to audit_log

---

## 8. Timeline & Deliverables

### Phase 1: May 19-20 (Foundation)
- [x] Analyze current CLI architecture (DONE)
- [x] Create this design document (DONE)
- [ ] Setup SQLite package and dependencies
- [ ] Create database schema and initialization
- [ ] Build encryption utility

**Deliverable:** SQLite schema, database initialization code, encryption module

### Phase 2: May 21-22 (Command Structure)
- [ ] Create command routing in `index.ts`
- [ ] Build `license list` command with database queries
- [ ] Build `license check` command with validation
- [ ] Implement prompt helpers and formatters
- [ ] Add dashboard visualization

**Deliverable:** List and check commands, output formatters, dashboard

### Phase 3: May 22-24 (Interactive Commands)
- [ ] Build `license activate` command with interactive flow
- [ ] Build `license renew` command with validation
- [ ] Build `license status` command with watch mode
- [ ] Implement offline fallback logic
- [ ] Add machine binding verification

**Deliverable:** Activate, renew, and status commands, offline validation

### Phase 4: May 24-25 (Testing & Polish)
- [ ] Create integration tests with mocked license-client
- [ ] Test offline validation scenarios
- [ ] Test grace period handling
- [ ] Test machine binding edge cases
- [ ] Error handling and recovery flows
- [ ] Complete documentation

**Deliverable:** Integration tests, error recovery procedures, CLI documentation

---

## 9. Known Constraints & Assumptions

### Constraints
1. **SQLite vs. JSON:** Using SQLite for performance, but maintains `.syncpulse/license.jwt` file for backward compatibility
2. **No Server Integration:** This is client-side only; renewal/activation requires new JWT from separate service
3. **Machine Binding:** Hardware-based (MAC address + hostname), will break on major hardware changes
4. **Offline Mode:** Limited to 30-day grace period max; beyond that requires online validation
5. **File Permissions:** Relies on OS file permissions for `.syncpulse/` directory security

### Assumptions
1. `@h4shed/license-client` remains stable API during implementation
2. Network connectivity available for initial activation and periodic checks
3. Users have write access to `~/.syncpulse/` directory
4. Platform has standard network interface enumeration (not guaranteed on all VMs)
5. Machine ID remains stable within expected bounds (hostname/MAC won't change frequently)

---

## 10. Success Criteria

### Functional Requirements
- [ ] All 5 commands work end-to-end
- [ ] List command displays all licenses with accurate status
- [ ] Check command validates license and shows expiration
- [ ] Activate command accepts JWT and stores license
- [ ] Renew command extends license term
- [ ] Status command displays dashboard or JSON output

### Non-Functional Requirements
- [ ] Database operations complete in <100ms (fast CLI feel)
- [ ] Offline validation works without network
- [ ] Grace period handling prevents false expirations
- [ ] Machine binding prevents license misuse
- [ ] All errors provide actionable recovery steps

### Code Quality
- [ ] 100% TypeScript (no any types)
- [ ] Full JSDoc documentation
- [ ] Consistent error handling patterns
- [ ] Comprehensive integration tests
- [ ] Zero secrets in logs/audit

---

## 11. References & Related Code

### Related Files
- `/packages/license-client/src/types.ts` - License data types
- `/packages/license-client/src/validator.ts` - JWT validation logic
- `/packages/license-client/src/storage.ts` - File storage wrapper
- `/packages/cli/src/index.ts` - Command router (existing pattern)
- `/packages/cli/src/add.ts` - Command implementation example

### External Docs
- better-sqlite3: https://github.com/WiseLibs/better-sqlite3
- yargs: https://yargs.js.org/
- inquirer.js: https://github.com/SBoudrias/Inquirer.js
- chalk: https://github.com/chalk/chalk

### Standards & Patterns
- REST API error codes applied to CLI messages
- Grace period logic follows SyncPulse licensing model
- Machine binding prevents license portability
- Audit logging provides forensics for support issues

---

## Document Version History

| Date | Author | Change | Status |
|------|--------|--------|--------|
| 2026-05-21 | Specialist 3 | Initial design document | Complete |

---

**Next Steps:** Await approval from Specialist 1 (CLI Architecture Lead) before proceeding to Phase 1 implementation. Contact team lead with any clarifications or dependencies.
