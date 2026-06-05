# License Management CLI - Implementation Plan

**Status:** Design Complete - Implementation Ready  
**Start Date:** May 20, 2026  
**Target Completion:** May 25, 2026  
**Specialist:** Specialist 3: CLI Developer

---

## Phase 1: SQLite Foundation (May 20-21)

### 1.1 Add Dependencies

**File:** `packages/cli/package.json`

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

**Tasks:**
- [ ] Update package.json with sqlite packages
- [ ] Run `npm install` to verify no conflicts
- [ ] Run `npm run build` to verify type compilation
- [ ] Document any dependency conflicts

**Validation:**
```bash
npm list better-sqlite3
npm run typecheck --workspace=@h4shed/mcp-cli
npm run build --workspace=@h4shed/mcp-cli
```

---

### 1.2 Create Database Module (`lib/license-db.ts`)

**Purpose:** SQLite wrapper for all database operations

**Key Methods Required:**
- `init()` - Initialize database and create tables
- `getLicense(id)` - Query single license
- `listLicenses(filter?)` - Query multiple licenses
- `saveLicense(license)` - INSERT or UPDATE
- `updateLicenseStatus(id, status)` - UPDATE status
- `deleteLicense(id)` - DELETE (soft delete)
- `getCache()` - Query cache singleton
- `updateCache(data)` - UPDATE cache
- `saveSetting(key, value, type)` - INSERT or UPDATE setting
- `getSetting(key)` - Query setting
- `logAudit(licenseId, operation, result, details, error)` - INSERT audit log
- `close()` - Close database connection

**Type Definitions Required:**
```typescript
interface License {
  id: string;
  license_key: string;
  jwt_token: string;
  type: LicenseType;
  issuer?: string;
  issued_at: string;
  expires_at: string;
  activated_at?: string;
  machine_id?: string;
  status: 'inactive' | 'active' | 'expired' | 'grace';
  features_json?: string;
  activation_metadata_json?: string;
  last_verified_at?: string;
  created_at: string;
  updated_at: string;
}

interface Cache {
  id: 1;
  last_online_check?: string;
  last_valid_token?: string;
  offline_mode_active: boolean;
  grace_period_warnings_sent: number;
  next_renewal_reminder?: string;
  cache_metadata_json?: string;
  created_at: string;
  updated_at: string;
}

interface AuditLog {
  id: number;
  license_id?: string;
  operation: string;
  result: 'success' | 'failure' | 'warning';
  details_json?: string;
  error_message?: string;
  machine_id?: string;
  timestamp: string;
}
```

**Tasks:**
- [ ] Create `/packages/cli/src/lib/license-db.ts`
- [ ] Implement database initialization with proper file permissions
- [ ] Add schema creation with SQL statements
- [ ] Implement all CRUD methods
- [ ] Add index creation for performance
- [ ] Test database creation and table structure
- [ ] Add JSDoc documentation

**Testing:**
```bash
# Manual test
node -e "
  const db = require('better-sqlite3')('test.db');
  db.exec('CREATE TABLE test (id INTEGER PRIMARY KEY)');
  console.log(db.prepare('SELECT * FROM sqlite_master').all());
  db.close();
"
```

---

### 1.3 Create Encryption Module (`lib/encryption.ts`)

**Purpose:** AES-256-GCM encryption for sensitive data

**Key Methods Required:**
- `deriveMasterKey()` - Static method to generate encryption key
- `encrypt(plaintext)` - Returns JSON with encrypted data
- `decrypt(encrypted)` - Parses JSON and decrypts

**Implementation Details:**
- Algorithm: AES-256-GCM
- Key derivation: SHA256(HOMEDIR + HOSTNAME + PLATFORM)
- IV: Random 16 bytes per encryption
- Auth tag: Included in output

**Output Format:**
```json
{
  "encrypted": true,
  "algorithm": "aes-256-gcm",
  "iv": "hex-string",
  "authTag": "hex-string",
  "data": "hex-string"
}
```

**Tasks:**
- [ ] Create `/packages/cli/src/lib/encryption.ts`
- [ ] Implement master key derivation
- [ ] Implement encrypt() method
- [ ] Implement decrypt() method
- [ ] Add error handling for corruption
- [ ] Test encryption/decryption roundtrip
- [ ] Add JSDoc documentation

**Testing:**
```typescript
const enc = new Encryption();
const plaintext = "LIC-ABC123-SECRET";
const encrypted = enc.encrypt(plaintext);
const decrypted = enc.decrypt(encrypted);
console.assert(plaintext === decrypted, "Roundtrip failed");
```

---

### 1.4 Schema Creation SQL

**File:** `/packages/cli/src/lib/license-db.ts` (embedded SQL)

```sql
-- Licenses table
CREATE TABLE IF NOT EXISTS licenses (
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

CREATE INDEX IF NOT EXISTS idx_licenses_status ON licenses(status);
CREATE INDEX IF NOT EXISTS idx_licenses_expires_at ON licenses(expires_at);
CREATE INDEX IF NOT EXISTS idx_licenses_machine_id ON licenses(machine_id);

-- Cache table (singleton pattern - only one row)
CREATE TABLE IF NOT EXISTS cache (
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

CREATE UNIQUE INDEX IF NOT EXISTS idx_cache_singleton ON cache(id);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  type TEXT CHECK(type IN ('string', 'number', 'boolean', 'json')) DEFAULT 'string',
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_settings_type ON settings(type);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
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

CREATE INDEX IF NOT EXISTS idx_audit_log_license_id ON audit_log(license_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_operation ON audit_log(operation);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);
```

**Tasks:**
- [ ] Define all SQL CREATE TABLE statements
- [ ] Create all indexes for performance
- [ ] Add CHECK constraints for data validity
- [ ] Test schema creation
- [ ] Verify foreign key constraints work

---

### 1.5 Validation Checklist

**After Phase 1 completion, verify:**

- [ ] `npm install` completes without errors
- [ ] CLI package builds with `npm run build`
- [ ] TypeScript has no compilation errors
- [ ] Database file created at `~/.syncpulse/licenses.db`
- [ ] All tables exist with correct schema
- [ ] File permissions are `0o600` (user-only access)
- [ ] Encryption roundtrip works correctly
- [ ] No secrets in console output

**Phase 1 Deliverables:**
1. Updated `packages/cli/package.json` with SQLite deps
2. `/packages/cli/src/lib/license-db.ts` - Complete database wrapper
3. `/packages/cli/src/lib/encryption.ts` - Complete encryption module
4. SQLite schema in database initialization
5. All methods documented with JSDoc

---

## Phase 2: Command Infrastructure (May 21-22)

### 2.1 Create License Command Router

**File:** `/packages/cli/src/commands/license/index.ts`

**Purpose:** Route subcommands to individual handlers

```typescript
import type { Argv } from 'yargs';
import { list, listBuilder, listHandler } from './list.js';
import { check, checkBuilder, checkHandler } from './check.js';
import { activate, activateBuilder, activateHandler } from './activate.js';
import { renew, renewBuilder, renewHandler } from './renew.js';
import { status, statusBuilder, statusHandler } from './status.js';

export function licenseCommand(yargs: Argv): Argv {
  return yargs
    .command(
      'list [filter]',
      'List all installed licenses',
      listBuilder,
      listHandler
    )
    .command(
      'check <id>',
      'Validate a specific license',
      checkBuilder,
      checkHandler
    )
    .command(
      'activate',
      'Activate a new license',
      activateBuilder,
      activateHandler
    )
    .command(
      'renew <id>',
      'Renew an expiring license',
      renewBuilder,
      renewHandler
    )
    .command(
      'status',
      'Show license status dashboard',
      statusBuilder,
      statusHandler
    );
}
```

**Tasks:**
- [ ] Create `/packages/cli/src/commands/license/index.ts`
- [ ] Implement licenseCommand router function
- [ ] Export all subcommand functions
- [ ] Add JSDoc documentation

---

### 2.2 Register License Commands in Main CLI

**File:** `/packages/cli/src/index.ts` (update existing)

**Changes:**
1. Import license command router at top
2. Add license command to yargs chain before `.parse()`

```typescript
import { licenseCommand } from './commands/license/index.js';

// In the yargs chain:
yargs(hideBin(process.argv))
  .command('init', 'Generate config', {}, async () => { await init(); })
  .command('list', 'List skills', {}, async () => { await list(); })
  .command('add <skill>', 'Enable a skill', ...) // existing
  .command('remove <skill>', 'Disable a skill', ...) // existing
  .command(
    'license <subcommand>',
    'Manage licenses',
    (yargs: Argv) => licenseCommand(yargs),
    async () => { /* handled by subcommand */ }
  )
  .parse();
```

**Tasks:**
- [ ] Add license command import
- [ ] Register license command with yargs
- [ ] Test that `fused-gaming-mcp license` shows subcommands

**Testing:**
```bash
npm run build --workspace=@h4shed/mcp-cli
node ./dist/index.js license --help
```

---

### 2.3 Create Formatters Module

**File:** `/packages/cli/src/lib/formatters.ts`

**Key Functions:**
```typescript
export class Formatters {
  static formatLicenseTable(licenses: License[]): string
  static formatLicenseDetails(license: License, verbose?: boolean): string
  static formatDashboard(data: DashboardData): string
  static formatError(title: string, message: string): string
  static formatSuccess(title: string, message: string): string
  static formatWarning(title: string, message: string): string
  static formatGracePeriodWarning(payload: LicensePayload): string
  static formatExpirationStatus(days: number): string
  static formatMachineBinding(machineId: string, bound: boolean): string
}
```

**Output Examples:**

Table format for `list`:
```
╭──────────────┬──────────┬──────────────┬────────────────╮
│ License ID   │ Type     │ Status       │ Expires        │
├──────────────┼──────────┼──────────────┼────────────────┤
│ LIC-ABC123   │ trial    │ ✓ Active     │ 2026-06-15 (25d) │
│ LIC-DEF456   │ commercial │ ⏳ Grace   │ 2026-05-20 (-1d) │
╰──────────────┴──────────┴──────────────┴────────────────╯
```

**Tasks:**
- [ ] Create `/packages/cli/src/lib/formatters.ts`
- [ ] Implement all formatting functions
- [ ] Use chalk for colors: green (active), yellow (grace), red (expired)
- [ ] Use boxen for frames and padding
- [ ] Test output with various data
- [ ] Add JSDoc documentation

---

### 2.4 Create Prompts Module

**File:** `/packages/cli/src/lib/prompts.ts`

**Key Functions:**
```typescript
export class LicensePrompts {
  static async askForToken(): Promise<string>
  static async askForLicenseKey(): Promise<string>
  static async confirmActivation(licenseId: string): Promise<boolean>
  static async selectLicenseToRenew(licenses: License[]): Promise<License>
  static async confirmRenewal(oldExpiry: Date, newExpiry: Date): Promise<boolean>
  static async askForNewToken(): Promise<string>
  static async selectRefreshOption(): Promise<'online' | 'offline' | 'cancel'>
}
```

**Tasks:**
- [ ] Create `/packages/cli/src/lib/prompts.ts`
- [ ] Implement all prompt functions using inquirer
- [ ] Use appropriate prompt types (input, password, confirm, list)
- [ ] Add input validation
- [ ] Test interactive workflows
- [ ] Add JSDoc documentation

---

### 2.5 Create Validator Wrapper

**File:** `/packages/cli/src/lib/license-validator-wrapper.ts`

**Purpose:** Wrap @h4shed/license-client with offline fallback

```typescript
export class ValidatorWrapper {
  static async validateWithFallback(
    token: string,
    options?: { refresh?: boolean; checkMachine?: boolean }
  ): Promise<ValidationResult>

  static async validateLicenseWithDB(
    id: string,
    options?: { refresh?: boolean }
  ): Promise<ValidationResult>

  static async checkOfflineValidity(): Promise<OfflineValidationResult>

  private static async tryOnlineValidation(
    token: string,
    checkMachine: boolean
  ): Promise<ValidationResult>

  private static async fallbackToOffline(
    error: Error
  ): Promise<ValidationResult>
}
```

**Tasks:**
- [ ] Create `/packages/cli/src/lib/license-validator-wrapper.ts`
- [ ] Implement online validation with try/catch
- [ ] Implement offline fallback using cached payload
- [ ] Update database with validation timestamp
- [ ] Handle network errors gracefully
- [ ] Log validation attempts to audit_log
- [ ] Add JSDoc documentation

---

### 2.6 Validation Checklist

**After Phase 2 completion, verify:**

- [ ] License command router compiles without errors
- [ ] `fused-gaming-mcp license --help` shows all subcommands
- [ ] Formatters output works correctly with test data
- [ ] Prompts module loads without errors
- [ ] Validator wrapper integrates with license-client
- [ ] All modules have TypeScript types
- [ ] JSDoc documentation is complete

**Phase 2 Deliverables:**
1. `/packages/cli/src/commands/license/index.ts` - Command router
2. Updated `/packages/cli/src/index.ts` - License command registration
3. `/packages/cli/src/lib/formatters.ts` - Output formatting
4. `/packages/cli/src/lib/prompts.ts` - Interactive prompts
5. `/packages/cli/src/lib/license-validator-wrapper.ts` - Validation wrapper

---

## Phase 3: Core Commands (May 22-24)

### 3.1 Implement `license list` Command

**File:** `/packages/cli/src/commands/license/list.ts`

**Functions:**
```typescript
export const listBuilder = (yargs: Argv) => yargs
  .option('all', { type: 'boolean', description: 'Show all licenses' })
  .option('active', { type: 'boolean', description: 'Show only active' })
  .option('expired', { type: 'boolean', description: 'Show only expired' })
  .option('grace', { type: 'boolean', description: 'Show only grace period' })
  .option('json', { type: 'boolean', description: 'JSON output' });

export const listHandler = async (argv: Arguments) => {
  // Implementation
};

export async function list(): Promise<void> {
  // Implementation
}
```

**Implementation Steps:**
1. Initialize database
2. Determine filter (all/active/expired/grace)
3. Query licenses from database
4. Calculate days remaining for each
5. Sort by expiration date
6. Format output (table or JSON)
7. Display with boxen frame

**Tasks:**
- [ ] Create `/packages/cli/src/commands/license/list.ts`
- [ ] Query licenses with optional filter
- [ ] Calculate days remaining
- [ ] Color code by status (green/yellow/red)
- [ ] Sort by nearest expiration
- [ ] Support JSON output
- [ ] Test with various filters
- [ ] Add JSDoc documentation

**Testing:**
```bash
fused-gaming-mcp license list
fused-gaming-mcp license list --active
fused-gaming-mcp license list --json
```

---

### 3.2 Implement `license check` Command

**File:** `/packages/cli/src/commands/license/check.ts`

**Implementation Steps:**
1. Look up license in database by ID or key
2. Check if cache fresh (< 24h) or use `--refresh` flag
3. If refresh needed, call LicenseValidator
4. Verify machine binding
5. Update last_verified_at
6. Format detailed output
7. Show grace period warnings if applicable

**Tasks:**
- [ ] Create `/packages/cli/src/commands/license/check.ts`
- [ ] Query license by ID
- [ ] Implement refresh logic
- [ ] Call LicenseValidator.validateLicense()
- [ ] Check machine binding
- [ ] Update database timestamps
- [ ] Format detailed output with features
- [ ] Display grace period info
- [ ] Test with online and offline scenarios
- [ ] Add JSDoc documentation

**Testing:**
```bash
fused-gaming-mcp license check LIC-ABC123
fused-gaming-mcp license check LIC-ABC123 --refresh --verbose
```

---

### 3.3 Implement `license activate` Command

**File:** `/packages/cli/src/commands/license/activate.ts`

**Interactive Flow:**
1. Prompt for JWT or use `--token`
2. Prompt for license key (optional)
3. Confirm machine binding
4. Validate with LicenseValidator
5. Store in database
6. Save JWT to file
7. Update cache
8. Show success message

**Tasks:**
- [ ] Create `/packages/cli/src/commands/license/activate.ts`
- [ ] Implement interactive prompts
- [ ] Parse JWT and extract payload
- [ ] Validate signature with LicenseValidator
- [ ] Store license in database
- [ ] Save JWT via LicenseStorage
- [ ] Encrypt license key if present
- [ ] Handle duplicate activation
- [ ] Show detailed success output
- [ ] Test interactive and non-interactive modes
- [ ] Add JSDoc documentation

**Testing:**
```bash
# Interactive
fused-gaming-mcp license activate

# Non-interactive
fused-gaming-mcp license activate --token <jwt> --confirm
```

---

### 3.4 Implement `license renew` Command

**File:** `/packages/cli/src/commands/license/renew.ts`

**Implementation Steps:**
1. Look up license by ID
2. Show current expiration
3. Prompt for new JWT (or use `--new-token`)
4. Validate new JWT
5. Compare old vs. new expiration
6. Update database with new token and expiry
7. Log to audit_log
8. Show renewal summary

**Tasks:**
- [ ] Create `/packages/cli/src/commands/license/renew.ts`
- [ ] Query existing license
- [ ] Prompt for new JWT
- [ ] Validate new JWT
- [ ] Check for type mismatch warnings
- [ ] Update database
- [ ] Log renewal to audit_log
- [ ] Clear offline cache on success
- [ ] Show detailed renewal output
- [ ] Handle grace period expiration case
- [ ] Test renewal scenarios
- [ ] Add JSDoc documentation

**Testing:**
```bash
fused-gaming-mcp license renew LIC-ABC123
fused-gaming-mcp license renew LIC-ABC123 --new-token <jwt> --confirm
```

---

### 3.5 Implement `license status` Command

**File:** `/packages/cli/src/commands/license/status.ts`

**Dashboard Output Sections:**
1. License Summary (counts: active, grace, expired)
2. Primary License (main/first active license)
3. System Information (machine ID, platform, mode)
4. Helpful hint for next steps

**Implementation Steps:**
1. Query licenses grouped by status
2. Get primary (first active or earliest expiring)
3. Get current machine info
4. Get offline mode status from cache
5. Format dashboard with boxen and colors
6. Support JSON output for scripting
7. Support `--watch` mode for live updates

**Tasks:**
- [ ] Create `/packages/cli/src/commands/license/status.ts`
- [ ] Query license counts by status
- [ ] Identify primary license
- [ ] Get system information (machine ID, platform)
- [ ] Format ASCII dashboard
- [ ] Support JSON output
- [ ] Implement watch mode (5-second refresh)
- [ ] Handle keyboard input (q to quit, r to refresh)
- [ ] Test dashboard formatting
- [ ] Test watch mode
- [ ] Add JSDoc documentation

**Testing:**
```bash
fused-gaming-mcp license status
fused-gaming-mcp license status --json
fused-gaming-mcp license status --watch
```

---

### 3.6 Offline Validation Logic

**Integrate into check command:**

```typescript
// In license check:
try {
  result = await ValidatorWrapper.validateWithFallback(token, { refresh });
} catch (err) {
  // Log error
  result = await ValidatorWrapper.checkOfflineValidity();
}
```

**Tasks:**
- [ ] Implement offline validation fallback
- [ ] Update cache with validation timestamp
- [ ] Log offline validation attempts
- [ ] Show appropriate warnings for grace period
- [ ] Handle network error conditions
- [ ] Test network failure scenarios

---

### 3.7 Machine Binding Verification

**Integrate into activate and check commands:**

```typescript
const currentMachineId = LicenseValidator.getMachineId();
const storedMachineId = license.machine_id;

if (storedMachineId && currentMachineId !== storedMachineId) {
  // Show warning or error
  showWarning(`Machine binding mismatch`);
}
```

**Tasks:**
- [ ] Implement machine ID verification
- [ ] Show current vs. stored machine ID
- [ ] Handle machine binding errors
- [ ] Log machine binding changes
- [ ] Test on different machines (or simulate)

---

### 3.8 Validation Checklist

**After Phase 3 completion, verify:**

- [ ] All 5 commands compile without errors
- [ ] Each command produces expected output
- [ ] Interactive prompts work correctly
- [ ] Offline validation fallback works
- [ ] Machine binding verification works
- [ ] Database updates are correct
- [ ] Colors and formatting look good
- [ ] JSON output is valid

**Phase 3 Deliverables:**
1. `/packages/cli/src/commands/license/list.ts` - List command
2. `/packages/cli/src/commands/license/check.ts` - Check command
3. `/packages/cli/src/commands/license/activate.ts` - Activate command
4. `/packages/cli/src/commands/license/renew.ts` - Renew command
5. `/packages/cli/src/commands/license/status.ts` - Status command

---

## Phase 4: Testing & Refinement (May 24-25)

### 4.1 Create Integration Tests

**File:** `/packages/cli/tests/commands/license.test.ts`

**Test Categories:**

1. **Database Operations**
   - [ ] Database initializes correctly
   - [ ] Tables exist with correct schema
   - [ ] CRUD operations work
   - [ ] Indexes function properly

2. **License List Command**
   - [ ] Lists all licenses
   - [ ] Filters by status work
   - [ ] JSON output is valid
   - [ ] Table formatting works

3. **License Check Command**
   - [ ] Valid license passes check
   - [ ] Expired license shows error
   - [ ] Grace period licenses work
   - [ ] Machine binding validation works
   - [ ] Offline validation fallback works

4. **License Activate Command**
   - [ ] Valid JWT activates successfully
   - [ ] Invalid JWT shows error
   - [ ] License stored in database
   - [ ] JWT saved to file
   - [ ] Duplicate activation prevented

5. **License Renew Command**
   - [ ] License renewed with new JWT
   - [ ] Expiration date updated
   - [ ] Audit log recorded
   - [ ] Grace period expiration handled

6. **License Status Command**
   - [ ] Dashboard displays correctly
   - [ ] JSON output is valid
   - [ ] Watch mode works
   - [ ] Counts are accurate

**Tasks:**
- [ ] Create test file structure
- [ ] Mock LicenseValidator and LicenseStorage
- [ ] Create test fixtures (sample JWTs, licenses)
- [ ] Write tests for each command
- [ ] Write tests for error scenarios
- [ ] Write tests for offline scenarios
- [ ] Run tests and achieve >90% coverage

**Testing Command:**
```bash
npm test --workspace=@h4shed/mcp-cli
```

---

### 4.2 Error Scenarios & Recovery

**Test Cases:**

1. **Network Errors**
   - [ ] Network unreachable - fallback to offline
   - [ ] Timeout during validation
   - [ ] Failed to save to database

2. **JWT Validation Errors**
   - [ ] Invalid JWT signature
   - [ ] Expired token
   - [ ] Corrupted token

3. **Grace Period Scenarios**
   - [ ] License in grace period (valid)
   - [ ] Grace period expired (invalid)
   - [ ] Days remaining calculations correct

4. **Machine Binding Errors**
   - [ ] License bound to different machine
   - [ ] Machine ID changed (hardware)
   - [ ] Rebinding with new token

5. **Database Errors**
   - [ ] Corrupted database file
   - [ ] Permission denied errors
   - [ ] Duplicate license key error

6. **Recovery Flows**
   - [ ] Reset command recreates database
   - [ ] Migration to new license
   - [ ] Cache clearing procedures

**Tasks:**
- [ ] Implement error test cases
- [ ] Test recovery procedures
- [ ] Verify error messages are helpful
- [ ] Test command suggestions in errors

---

### 4.3 Edge Cases & Performance

**Test Cases:**

1. **Performance**
   - [ ] List command <100ms with 10 licenses
   - [ ] Check command <200ms with online
   - [ ] Status command <100ms for dashboard
   - [ ] Database queries use indexes

2. **Edge Cases**
   - [ ] License with no expiration
   - [ ] License with no machine binding
   - [ ] Empty database operations
   - [ ] Very long license keys
   - [ ] Special characters in license data

3. **Concurrency** (if applicable)
   - [ ] Multiple commands don't conflict
   - [ ] Database locking works

**Tasks:**
- [ ] Performance benchmark each command
- [ ] Test edge cases
- [ ] Verify database integrity
- [ ] Check memory usage

---

### 4.4 Documentation & Examples

**Documentation Files:**

1. **User Guide**
   - Command reference for each subcommand
   - Common use cases
   - Troubleshooting guide

2. **Developer Guide**
   - Architecture overview
   - Adding new commands
   - Testing strategy
   - Database schema

3. **Examples**
   - Activate a trial license
   - Renew before expiration
   - Handle machine change
   - Offline validation

**Tasks:**
- [ ] Write user guide
- [ ] Write developer guide
- [ ] Create usage examples
- [ ] Document troubleshooting
- [ ] Add inline JSDoc comments

---

### 4.5 Final Validation

**Checklist:**

- [ ] All 5 commands work end-to-end
- [ ] All tests pass (unit + integration)
- [ ] TypeScript compilation clean
- [ ] Linting passes
- [ ] No console errors
- [ ] Proper error handling everywhere
- [ ] Documentation complete
- [ ] Examples work correctly

**Final Verification Commands:**
```bash
npm run lint --workspace=@h4shed/mcp-cli
npm run typecheck --workspace=@h4shed/mcp-cli
npm run build --workspace=@h4shed/mcp-cli
npm test --workspace=@h4shed/mcp-cli
fused-gaming-mcp license --help
fused-gaming-mcp license list
```

---

## Implementation Timeline

| Date | Phase | Deliverable | Status |
|------|-------|-------------|--------|
| May 20-21 | 1 | SQLite foundation, encryption | TBD |
| May 21-22 | 2 | Command infrastructure, formatters | TBD |
| May 22-24 | 3 | All 5 commands + validation | TBD |
| May 24-25 | 4 | Tests, docs, final polish | TBD |

---

## Risk Mitigation

### Known Risks

1. **SQLite Performance**
   - Mitigation: Use `better-sqlite3` (native, fast)
   - Test: Benchmark with 100+ licenses

2. **Network Timeouts**
   - Mitigation: Implement offline fallback
   - Test: Mock network errors

3. **Machine Binding Issues**
   - Mitigation: Clear error messages
   - Test: Simulate hardware changes

4. **Database Corruption**
   - Mitigation: Backup and recovery procedures
   - Test: Corrupt database file and recover

### Contingency Plans

- If SQLite causes issues: Switch to simple JSON file storage
- If prompts have issues: Revert to simple argument passing
- If performance poor: Add caching layer
- If database locks: Implement retry logic

---

## Success Metrics

### Code Quality
- 100% TypeScript coverage (no `any` types)
- Full JSDoc documentation
- >90% test coverage
- All tests passing
- No linting errors

### Functionality
- All 5 commands work correctly
- Offline validation works
- Grace period handling accurate
- Machine binding verified
- Error messages helpful

### User Experience
- Commands execute in <500ms
- Output is readable and colorful
- Interactive prompts are intuitive
- Help text is clear
- Examples are practical

### Documentation
- User guide complete
- Developer guide complete
- Inline comments comprehensive
- Examples work correctly
- Troubleshooting guide helpful

---

## Notes for Implementation

1. **Start with Phase 1 immediately** - Database foundation is critical
2. **Database initialization on first command** - No manual setup required
3. **Backward compatibility** - Keep existing license.jwt file
4. **Security first** - Encrypt sensitive data, use file permissions
5. **User friendly** - Clear error messages, helpful hints
6. **Test driven** - Write tests as you implement
7. **Documentation** - Document as you code

---

## Sign-Off

**Prepared By:** Specialist 3: CLI Developer  
**Target Start Date:** May 20, 2026  
**Target Completion:** May 25, 2026  
**Approved By:** [Awaiting Review]

---

**Next Action:** Begin Phase 1 implementation once approved.
