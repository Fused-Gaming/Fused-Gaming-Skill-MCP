# License Management CLI System - Design Phase Summary

**Project:** Fused Gaming MCP - License CLI Module  
**Specialist:** Specialist 3: CLI Developer  
**Sprint:** Week 2 (May 19-25, 2026)  
**Status:** Design Phase Complete - Ready for Implementation  
**Date Completed:** 2026-05-21

---

## Executive Summary

The license management CLI system has been fully designed and architected. The system provides 5 core commands (`list`, `check`, `activate`, `renew`, `status`) integrated with the existing `@h4shed/license-client` package and yargs-based CLI framework. This document summarizes the key design decisions and provides the foundation for implementation.

**Key Decisions:**
- **Database:** SQLite with `better-sqlite3` (synchronous API, high performance)
- **Command Framework:** yargs (existing) with modular command functions
- **UI Libraries:** chalk, inquirer, ora, boxen, figlet (already in dependencies)
- **Data Persistence:** SQLite at `~/.syncpulse/licenses.db` + JWT file at `~/.syncpulse/license.jwt`
- **Encryption:** AES-256-GCM for sensitive data (license keys)
- **Validation:** Integration with `@h4shed/license-client` with offline fallback

---

## System Architecture

### Command Routing (yargs)

```
fused-gaming-mcp license [subcommand] [options]
├── list [--all|--active|--expired] [--json]
├── check <id> [--refresh] [--verbose]
├── activate [--token <jwt>] [--key <key>]
├── renew <id> [--new-token <jwt>] [--confirm]
└── status [--dashboard|--json|--watch]
```

### Data Flow Layers

```
CLI Commands (index.ts)
    ↓
License Commands (commands/license/*.ts)
    ↓
Validation & Formatting (lib/*.ts)
    ↓
License Database (lib/license-db.ts)
    ↓
SQLite Database (~/.syncpulse/licenses.db)

License Client Integration:
├── LicenseValidator (JWT signature verification)
├── LicenseStorage (File I/O for license.jwt)
└── Custom Wrappers (Offline fallback, encryption)
```

---

## SQLite Schema Overview

### Tables (4 core tables)

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `licenses` | License metadata & status | id, license_key, jwt_token, type, expires_at, machine_id, status |
| `cache` | Offline validation cache | last_online_check, last_valid_token, offline_mode_active |
| `settings` | User preferences | key, value, type, description |
| `audit_log` | Operation history | license_id, operation, result, error_message, timestamp |

### Database Initialization

- **Location:** `~/.syncpulse/licenses.db`
- **Permissions:** `0o600` (user read/write only)
- **Pragmas:** `journal_mode=WAL`, `foreign_keys=ON`
- **Auto-init:** Creates tables on first license command

---

## Command Specifications Summary

### 1. `license list` - Display all licenses

```bash
fused-gaming-mcp license list [--all|--active|--expired] [--json]
```

**Output:** Table with columns (License ID, Type, Status, Expires)
- Color coded: green (active), yellow (grace), red (expired)
- Shows days remaining from today
- Sorts by nearest expiration first

**Database Query:** `SELECT * FROM licenses ORDER BY expires_at ASC`

---

### 2. `license check` - Validate a specific license

```bash
fused-gaming-mcp license check <id> [--refresh] [--verbose]
```

**Validation Flow:**
1. Look up license in database
2. Check if cache fresh (< 24h)
3. If `--refresh` or stale: Call `LicenseValidator.validateLicense(jwt_token)`
4. Verify machine binding
5. Display result with grace period warnings

**Output:** Detailed box with license info, features, and status

---

### 3. `license activate` - Interactive activation workflow

```bash
fused-gaming-mcp license activate [--token <jwt>] [--key <key>] [--non-interactive]
```

**Interactive Prompts:**
1. "Enter your license token (JWT)"
2. "License key (optional)"
3. "Apply to current machine?"
4. "Confirm activation?"

**Process:**
- Parse JWT and extract payload
- Validate signature via `LicenseValidator`
- Store in database with `status='active'`, `activated_at=now()`
- Save JWT to `~/.syncpulse/license.jwt`

---

### 4. `license renew` - Extend license term

```bash
fused-gaming-mcp license renew <id> [--new-token <jwt>] [--confirm]
```

**Process:**
1. Look up existing license
2. Prompt for new JWT (or use `--new-token`)
3. Validate new token
4. Update database: `jwt_token`, `expires_at`, `activated_at`
5. Log operation to `audit_log`
6. Show old/new expiration comparison

---

### 5. `license status` - Dashboard view

```bash
fused-gaming-mcp license status [--dashboard|--json|--watch]
```

**Dashboard Output:** ASCII art with sections:
- License Summary (counts: active, grace, expired)
- Primary License (detailed info)
- System Information (machine ID, platform, mode)

**JSON Output:** Structured data for scripting
**Watch Mode:** Auto-refresh every 5 seconds

---

## File Structure (To Be Created)

```
packages/cli/src/
├── commands/
│   ├── license/
│   │   ├── index.ts              ← Command router
│   │   ├── list.ts               ← List command
│   │   ├── check.ts              ← Check command
│   │   ├── activate.ts           ← Activate command
│   │   ├── renew.ts              ← Renew command
│   │   └── status.ts             ← Status command
│   └── ... (existing commands)
├── lib/
│   ├── license-db.ts             ← SQLite wrapper
│   ├── license-validator-wrapper.ts  ← Validation with fallback
│   ├── encryption.ts             ← Key encryption
│   ├── prompts.ts                ← Inquirer helpers
│   └── formatters.ts             ← Output formatting
├── ui/
│   ├── ... (existing files)
│   └── license-panel.ts          ← License dashboard
└── ... (existing structure)
```

---

## Integration Points

### With `@h4shed/license-client`

**Exports Used:**
```typescript
import { LicenseValidator } from '@h4shed/license-client/validator';
import { LicenseStorage } from '@h4shed/license-client/storage';
import type { 
  LicensePayload, 
  ValidationResult, 
  LicenseType 
} from '@h4shed/license-client/types';
```

**Key Methods:**
- `LicenseValidator.validateLicense(token)` - Verify JWT signature
- `LicenseValidator.checkExpiration(payload)` - Calculate expiration
- `LicenseValidator.getMachineId()` - Get hardware binding
- `LicenseStorage.saveLicense(token)` - Persist JWT
- `LicenseStorage.loadLicense()` - Load JWT
- `LicenseStorage.getMachineId()` - Machine ID generation

### Offline Validation Fallback

**Trigger Conditions:**
- Network unreachable (ECONNREFUSED, ETIMEDOUT)
- 5+ consecutive online failures
- User enables offline mode

**Process:**
1. Try online validation with `LicenseValidator.validateLicense()`
2. On failure, call `LicenseValidator.isOfflineValid()`
3. Return cached payload with warnings
4. Log grace period start/end events

---

## Dependencies

### New Packages to Add

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

### Existing Packages (Already Available)

- `yargs` v17.7.2 - CLI framework
- `chalk` v5.6.2 - Text styling
- `inquirer` v12.10.0 - Interactive prompts
- `ora` v9.0.0 - Loading spinners
- `boxen` v8.0.1 - Terminal frames
- `jsonwebtoken` v9.0.0 - JWT parsing (transitive)

---

## Implementation Roadmap

### Phase 1: Foundation (May 20-21)
- [ ] Add SQLite dependencies to CLI package
- [ ] Create database initialization module (`lib/license-db.ts`)
- [ ] Implement database schema creation
- [ ] Create encryption utility (`lib/encryption.ts`)
- [ ] Set up migration system

**Deliverable:** Working SQLite database, schema, encryption module

### Phase 2: Command Infrastructure (May 21-22)
- [ ] Create license command router (`commands/license/index.ts`)
- [ ] Register license commands in main CLI (`index.ts`)
- [ ] Implement formatters (`lib/formatters.ts`)
- [ ] Implement prompt helpers (`lib/prompts.ts`)
- [ ] Create validation wrapper with offline fallback

**Deliverable:** Command structure, formatters, utilities

### Phase 3: Core Commands (May 22-24)
- [ ] Implement `license list` command
- [ ] Implement `license check` command
- [ ] Implement `license activate` command with prompts
- [ ] Implement `license renew` command
- [ ] Implement `license status` command with dashboard
- [ ] Implement watch mode for status

**Deliverable:** All 5 commands fully functional

### Phase 4: Testing & Refinement (May 24-25)
- [ ] Create integration tests
- [ ] Test offline validation scenarios
- [ ] Test grace period handling
- [ ] Test machine binding edge cases
- [ ] Error handling and recovery flows
- [ ] Documentation and examples

**Deliverable:** Comprehensive tests, documentation, examples

---

## Error Handling Strategy

### Network Errors
```
Error: Network unreachable
Status: Falling back to offline validation
Action: Retrying in 30 seconds (press Ctrl+C to cancel)
```

### JWT Validation Errors
```
Error: Invalid JWT signature
Status: License token is corrupted or tampered with
Action: Activate a new license with 'license activate'
```

### Expiration Errors
```
Error: License expired
Status: Grace period expires in 5 days
Action: Renew now with 'license renew <id>'
```

### Machine Binding Errors
```
Error: License bound to different machine
Current Machine: MacBook-Pro (M1)
Licensed Machine: Dell-XPS
Action: Contact support to change machine binding
```

---

## Security Considerations

### Encryption
- **Algorithm:** AES-256-GCM for license keys
- **Master Key Derivation:** SHA256(HOMEDIR + HOSTNAME + PLATFORM)
- **IV Generation:** Random, stored with ciphertext

### File Permissions
- Database: `0o600` (user read/write only)
- License JWT: `0o600` (via LicenseStorage)
- Directory: `0o700` (user access only)

### Secrets Management
- License keys: Encrypted before storage
- JWT tokens: Encrypted in database
- Machine ID: Plaintext (derived from public hardware info)
- Audit logs: Plain text (operation history only)

### No Secrets in Logs
- Error messages don't include JWT or keys
- Audit logs don't expose sensitive data
- Console output sanitizes sensitive information

---

## Success Criteria

### Functional
- All 5 commands work end-to-end
- List displays accurate status for all licenses
- Check validates and shows expiration correctly
- Activate accepts JWT and stores license
- Renew extends license term
- Status displays dashboard or JSON output

### Non-Functional
- Database operations complete in <100ms
- Offline validation works without network
- Grace period handling prevents false expirations
- Machine binding prevents license misuse
- All errors provide actionable recovery steps

### Code Quality
- 100% TypeScript (no `any` types)
- Full JSDoc documentation
- Consistent error handling
- Comprehensive tests (unit + integration)
- Zero secrets in logs/output

---

## Design Document References

### Full Documentation
1. **DESIGN_LICENSE_CLI.md** - Complete specification (1140 lines)
   - Detailed command specs
   - SQL schema with all tables
   - Encryption strategy
   - Integration plan

2. **docs/LICENSE-CLI-ARCHITECTURE.md** - Architecture details
   - System diagram
   - Module structure
   - Data flow
   - Integration points

### Key Files Already Analyzed
- `/packages/cli/src/index.ts` - CLI entry point & routing
- `/packages/cli/src/add.ts` - Command pattern example
- `/packages/cli/src/list.ts` - UI pattern example
- `/packages/cli/src/ui/boot.ts` - UI initialization
- `/packages/cli/src/ui/menu.ts` - Interactive prompts
- `/packages/license-client/src/types.ts` - License types
- `/packages/license-client/src/validator.ts` - Validation logic
- `/packages/license-client/src/storage.ts` - File storage

---

## Next Actions

### Immediate (Before Implementation Begins)
1. Review this design summary with team
2. Confirm SQLite choice (vs. alternative databases)
3. Approve encryption strategy
4. Verify license-client API stability

### Implementation Start (Phase 1)
1. Add `better-sqlite3` and `@types/better-sqlite3` to CLI package.json
2. Run `npm install` to verify no conflicts
3. Create database initialization module
4. Implement schema creation
5. Create encryption utility

### Dependencies Check
```bash
npm list better-sqlite3
npm list @types/better-sqlite3
npm run build --workspace=@h4shed/mcp-cli
```

---

## Knowledge Base

### Related Packages
- `@h4shed/license-client` (v1.0.0) - License validation and storage
- `@h4shed/mcp-core` (v1.0.4) - CLI config and skill registry
- `yargs` (v17.7.2) - CLI framework
- `inquirer` (v12.10.0) - Interactive prompts

### Standards Applied
- REST API error codes for CLI messages
- Grace period logic from SyncPulse licensing model
- Machine binding for license security
- Audit logging for forensics

### Compatibility Notes
- Maintains backward compatibility with `~/.syncpulse/license.jwt`
- Uses existing `@h4shed/license-client` for validation
- Integrates with existing CLI framework (yargs)
- Leverages existing UI libraries

---

## Document Status

**Prepared By:** Specialist 3: CLI Developer  
**Reviewed By:** Design Analysis Phase  
**Status:** Ready for Implementation Phase  
**Last Updated:** 2026-05-21

---

## Appendix: Quick Reference

### Database Location
```
~/.syncpulse/licenses.db
~/.syncpulse/license.jwt  (existing, preserved)
~/.syncpulse/license.json (existing, preserved)
```

### Command Examples
```bash
# List all active licenses
fused-gaming-mcp license list --active

# Check specific license
fused-gaming-mcp license check LIC-ABC123 --refresh

# Activate new license (interactive)
fused-gaming-mcp license activate

# Renew existing license
fused-gaming-mcp license renew LIC-ABC123

# View status dashboard
fused-gaming-mcp license status --dashboard

# Watch status (auto-refresh)
fused-gaming-mcp license status --watch
```

### Database Queries (Reference)
```sql
-- List active licenses
SELECT * FROM licenses WHERE status = 'active';

-- Check expiration status
SELECT id, expires_at, 
  CAST((julianday(expires_at) - julianday('now')) AS INT) as days_remaining 
FROM licenses;

-- Get cache info
SELECT * FROM cache WHERE id = 1;

-- View audit history
SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT 20;
```

---

**Next Milestone:** Implementation Phase 1 - SQLite Foundation (May 20-21)
