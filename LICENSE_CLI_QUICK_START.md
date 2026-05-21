# License CLI - Quick Start Guide for Implementation

**Created:** 2026-05-21  
**Target Implementers:** Specialist 3 (CLI Developer) & Development Team  
**Status:** Design Complete - Ready for Coding

---

## TL;DR - What You're Building

A CLI command system for managing software licenses with these 5 commands:

```bash
fused-gaming-mcp license list      # Show all licenses
fused-gaming-mcp license check <id> # Validate a license  
fused-gaming-mcp license activate  # Add a new license (interactive)
fused-gaming-mcp license renew <id> # Extend license term
fused-gaming-mcp license status    # Dashboard view
```

**Data Storage:** SQLite database at `~/.syncpulse/licenses.db`  
**Integration:** Uses `@h4shed/license-client` for JWT validation  
**Framework:** yargs (existing CLI framework)

---

## Where to Start

### 1. Read This First (You Are Here)
- Understand what's being built
- Know the 4-phase timeline
- Get file locations

### 2. Read Full Design Documents
1. `DESIGN_LICENSE_CLI.md` (1140 lines) - Complete spec
2. `docs/LICENSE-CLI-ARCHITECTURE.md` - Architecture diagram
3. `LICENSE_CLI_DESIGN_SUMMARY.md` - Summary of key decisions

### 3. Understand Current CLI Structure
- `/packages/cli/src/index.ts` - Entry point (uses yargs)
- `/packages/cli/src/commands/` - Command implementations
- `/packages/cli/src/ui/` - UI utilities (chalk, inquirer, ora, boxen)

### 4. Know the License Client
- `/packages/license-client/src/types.ts` - Type definitions
- `/packages/license-client/src/validator.ts` - JWT validation
- `/packages/license-client/src/storage.ts` - File storage

---

## 4-Phase Implementation Timeline

### Phase 1: SQLite Foundation (May 20-21) - 2 days
**What:** Database setup  
**Files:** `lib/license-db.ts`, `lib/encryption.ts`  
**Packages:** Add `better-sqlite3`  
**Status:** Not Started

### Phase 2: Command Infrastructure (May 21-22) - 1-2 days
**What:** Routing and utilities  
**Files:** `commands/license/index.ts`, `lib/formatters.ts`, `lib/prompts.ts`  
**Status:** Not Started

### Phase 3: Core Commands (May 22-24) - 2 days
**What:** All 5 commands  
**Files:** `commands/license/{list,check,activate,renew,status}.ts`  
**Status:** Not Started

### Phase 4: Testing & Polish (May 24-25) - 1 day
**What:** Tests, docs, refinement  
**Files:** `tests/`, docs  
**Status:** Not Started

---

## File Structure You'll Create

```
packages/cli/src/
├── commands/
│   └── license/                    ← NEW FOLDER
│       ├── index.ts                ← Router
│       ├── list.ts                 ← List command
│       ├── check.ts                ← Check command
│       ├── activate.ts             ← Activate command
│       ├── renew.ts                ← Renew command
│       └── status.ts               ← Status command
├── lib/
│   ├── license-db.ts               ← SQLite wrapper (NEW)
│   ├── license-validator-wrapper.ts ← Validation (NEW)
│   ├── encryption.ts               ← Encryption util (NEW)
│   ├── prompts.ts                  ← Inquirer helpers (NEW)
│   └── formatters.ts               ← Output formatting (NEW)
├── ui/
│   └── license-panel.ts            ← Dashboard (NEW)
├── index.ts                        ← Update to register license command
└── ... (existing structure)
```

---

## Key Technology Choices

### SQLite (better-sqlite3)
- Synchronous (fast for CLI)
- Native binary (excellent performance)
- Already in use patterns: `db.prepare().run()`, `db.prepare().all()`
- File: `~/.syncpulse/licenses.db`

### Command Framework (yargs)
- Already in use in `/packages/cli/src/index.ts`
- Pattern: `yargs.command(name, desc, builder, handler)`
- Type: Import `Argv` and `Arguments` from yargs

### UI Libraries (already available)
- `chalk` - Colors and styling
- `inquirer` - Interactive prompts
- `ora` - Loading spinners
- `boxen` - Terminal frames
- `figlet` - ASCII art

### License Client Integration
- `@h4shed/license-client` - Existing package
- Exports: `LicenseValidator`, `LicenseStorage` classes
- Use: `LicenseValidator.validateLicense(token)`, `LicenseStorage.getMachineId()`

---

## Critical Implementation Rules

### 1. Always Encrypt Sensitive Data
```typescript
import { Encryption } from '../lib/encryption.js';

const encrypted = Encryption.encrypt(licenseKey);
// Store: { encrypted: true, algorithm: 'aes-256-gcm', iv: '...', authTag: '...', data: '...' }

const decrypted = Encryption.decrypt(encryptedData);
```

### 2. Always Log to Audit Trail
```typescript
import { LicenseDatabase } from '../lib/license-db.js';

LicenseDatabase.logAudit(
  licenseId,
  'activate',           // Operation type
  'success',            // Result: success|failure|warning
  { details: '...' },   // Details
  null                  // Error (if any)
);
```

### 3. Always Handle Offline Mode
```typescript
try {
  result = LicenseValidator.validateLicense(token);
} catch (err) {
  // Network error - fallback to offline
  const offlineResult = LicenseValidator.isOfflineValid();
  result = offlineResult;
}
```

### 4. Always Color-Code Output
```typescript
import chalk from 'chalk';

console.log(chalk.green('✓ License Valid'));      // Active
console.log(chalk.yellow('⏳ Grace Period'));     // Grace
console.log(chalk.red('✗ License Expired'));     // Expired
```

### 5. Always Validate Input
```typescript
if (!token || !token.startsWith('eyJ')) {
  console.error(chalk.red('Invalid JWT format'));
  process.exit(1);
}
```

---

## Common Patterns

### Command Implementation Template
```typescript
import { Arguments, Argv } from 'yargs';
import chalk from 'chalk';
import { LicenseDatabase } from '../../lib/license-db.js';

export const listBuilder = (yargs: Argv) => yargs
  .option('filter', { type: 'string', description: 'Filter option' });

export const listHandler = async (argv: Arguments) => {
  try {
    LicenseDatabase.init();
    const licenses = LicenseDatabase.listLicenses(argv.filter as string);
    console.log(formatOutput(licenses));
  } catch (err) {
    console.error(chalk.red('Error: ' + (err as Error).message));
    process.exit(1);
  }
};

export async function list(): Promise<void> {
  await listHandler({} as Arguments);
}
```

### Database Query Pattern
```typescript
import Database from 'better-sqlite3';

const licenses = db.prepare(
  'SELECT * FROM licenses WHERE status = ? ORDER BY expires_at ASC'
).all('active') as License[];
```

### Interactive Prompt Pattern
```typescript
import inquirer from 'inquirer';

const { token } = await inquirer.prompt([
  {
    type: 'password',
    name: 'token',
    message: 'Enter your license token:',
    mask: '*'
  }
]);
```

### Error Output Pattern
```typescript
import boxen from 'boxen';
import chalk from 'chalk';

console.error(
  boxen(
    chalk.red('Error: Invalid License\n' +
              'The license token signature is invalid.'),
    { padding: 1, borderColor: 'red' }
  )
);
```

---

## Testing Checklist

### Before Merging Each Phase

```bash
# Phase 1: Database Foundation
npm run build --workspace=@h4shed/mcp-cli
node -e "require('./dist/lib/license-db.js')"
ls -la ~/.syncpulse/licenses.db

# Phase 2: Command Infrastructure
npm run build --workspace=@h4shed/mcp-cli
fused-gaming-mcp license --help

# Phase 3: Commands
fused-gaming-mcp license list
fused-gaming-mcp license status
fused-gaming-mcp license check --help

# Phase 4: Full Test Suite
npm test --workspace=@h4shed/mcp-cli
npm run typecheck --workspace=@h4shed/mcp-cli
npm run lint --workspace=@h4shed/mcp-cli
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feat/license-cli-management

# After each phase, commit
git add packages/cli/src/
git commit -m "Phase 1: SQLite foundation and encryption"

# Before merging, ensure tests pass
npm run build && npm test

# Create PR when ready
# Link to issue/milestone for tracking
```

---

## Common Pitfalls to Avoid

1. **Don't forget to initialize database on first run**
   - Check if db exists before operations
   - Create tables if missing
   - Set proper file permissions (0o600)

2. **Don't commit secrets to git**
   - Never commit .env or license keys
   - Add sensitive files to .gitignore
   - Use encryption for stored keys

3. **Don't ignore offline scenarios**
   - Always implement offline fallback
   - Cache validated licenses
   - Provide grace period support

4. **Don't break existing files**
   - Keep `~/.syncpulse/license.jwt` file
   - Maintain backward compatibility
   - Don't delete user's licenses

5. **Don't forget error handling**
   - Catch all thrown errors
   - Provide helpful error messages
   - Suggest recovery steps

6. **Don't skip TypeScript types**
   - Use strict typing (no `any`)
   - Type all function parameters
   - Export types from modules

---

## Database Schema Quick Reference

### licenses table
```sql
CREATE TABLE licenses (
  id TEXT PRIMARY KEY,
  license_key TEXT NOT NULL UNIQUE,
  jwt_token TEXT NOT NULL,
  type TEXT NOT NULL,  -- 'trial'|'commercial'|'team'|'enterprise'
  expires_at DATETIME NOT NULL,
  activated_at DATETIME,
  machine_id TEXT,
  status TEXT,  -- 'inactive'|'active'|'expired'|'grace'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### cache table (singleton - only 1 row)
```sql
CREATE TABLE cache (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  last_online_check DATETIME,
  last_valid_token TEXT,
  offline_mode_active INTEGER DEFAULT 0,
  ...
);
```

### audit_log table
```sql
CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  license_id TEXT,
  operation TEXT NOT NULL,  -- 'validate', 'activate', 'renew', etc.
  result TEXT,  -- 'success'|'failure'|'warning'
  error_message TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## Command Interface Examples

### List Command
```bash
$ fused-gaming-mcp license list
╭──────────────┬──────────┬──────────────┬────────────────╮
│ License ID   │ Type     │ Status       │ Expires        │
├──────────────┼──────────┼──────────────┼────────────────┤
│ LIC-ABC123   │ trial    │ ✓ Active     │ 2026-06-15 (25d) │
│ LIC-DEF456   │ commercial │ ⏳ Grace  │ 2026-05-20 (-1d) │
╰──────────────┴──────────┴──────────────┴────────────────╯
```

### Check Command
```bash
$ fused-gaming-mcp license check LIC-ABC123
╭──────────────────────────────────────╮
│ ✓ License Valid                      │
├──────────────────────────────────────┤
│ License ID:       LIC-ABC123         │
│ Type:             trial              │
│ Status:           ACTIVE             │
│ Expires:          2026-06-15 (25d)  │
│ Machine Binding:  Verified           │
│ Last Verified:    2026-05-21         │
╰──────────────────────────────────────╯
```

### Status Command
```bash
$ fused-gaming-mcp license status
╔════════════════════════════════════════════════════════════╗
║         FUSED GAMING MCP - LICENSE STATUS DASHBOARD        ║
╚════════════════════════════════════════════════════════════╝

┌─ License Summary ────────────────────────────────────────┐
│ Active Licenses:      1                                   │
│ Grace Period:         1                                   │
│ Expired:              0                                   │
└──────────────────────────────────────────────────────────┘

Hint: Use 'license renew LIC-ABC123' to extend your license
```

---

## Dependencies You'll Need

### Already Available (Don't Add)
- `yargs` - CLI framework
- `chalk` - Colors
- `inquirer` - Prompts
- `ora` - Spinners
- `boxen` - Frames
- `figlet` - ASCII art
- `@h4shed/license-client` - JWT validation
- `@h4shed/mcp-core` - Config management

### Need to Add to `packages/cli/package.json`
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

### Installation
```bash
cd packages/cli
npm install better-sqlite3@^9.2.2
npm install -D @types/better-sqlite3@^7.6.9
```

---

## Useful Commands During Development

```bash
# Build CLI only
npm run build --workspace=@h4shed/mcp-cli

# Run with new license command
node ./packages/cli/dist/index.js license list

# Type check
npm run typecheck --workspace=@h4shed/mcp-cli

# Lint
npm run lint --workspace=@h4shed/mcp-cli

# Test
npm test --workspace=@h4shed/mcp-cli

# Full validation
npm run build && npm run typecheck && npm run lint && npm test
```

---

## Resources & Documentation

### Official Docs
- yargs: https://yargs.js.org/
- inquirer.js: https://github.com/SBoudrias/Inquirer.js
- chalk: https://github.com/chalk/chalk
- better-sqlite3: https://github.com/WiseLibs/better-sqlite3
- boxen: https://github.com/sindresorhus/boxen

### Project Files
- Design spec: `/DESIGN_LICENSE_CLI.md`
- Architecture: `/docs/LICENSE-CLI-ARCHITECTURE.md`
- Summary: `/LICENSE_CLI_DESIGN_SUMMARY.md`
- This guide: `/LICENSE_CLI_QUICK_START.md`
- Implementation plan: `/LICENSE_CLI_IMPLEMENTATION_PLAN.md`

### Example Code
- CLI routing: `/packages/cli/src/index.ts`
- Command pattern: `/packages/cli/src/add.ts`
- License client: `/packages/license-client/src/`
- UI patterns: `/packages/cli/src/ui/`

---

## Ask for Help With

- **JWT parsing questions:** See `/packages/license-client/src/types.ts`
- **Database issues:** Check SQLite docs or test with sqlite3 CLI
- **UI formatting:** Look at existing commands and ui/ folder
- **Interactive prompts:** Inquirer.js docs
- **Type issues:** Review TypeScript compiler output
- **Integration issues:** Check license-client exports

---

## Success Looks Like

When you're done with each phase, you should be able to:

### Phase 1
```bash
node -e "const db = require('./dist/lib/license-db.js'); db.init(); console.log('✓ Database ready')"
```

### Phase 2
```bash
fused-gaming-mcp license --help
# Shows: list, check, activate, renew, status commands
```

### Phase 3
```bash
fused-gaming-mcp license list        # Works
fused-gaming-mcp license status      # Shows dashboard
fused-gaming-mcp license check --help # Shows options
```

### Phase 4
```bash
npm test --workspace=@h4shed/mcp-cli
# All tests pass
```

---

## Final Notes

- **Start small:** Each command can be implemented independently
- **Test often:** Build after each file, test after each function
- **Ask questions:** Design is solid, but clarify any ambiguities
- **Keep it simple:** Start with basic functionality, add polish later
- **Document as you go:** Comments now save time for team members
- **Celebrate wins:** Each command is a working feature!

---

**Good luck! You've got this. 💪**

Start with Phase 1, reach out if you have questions, and let's ship this!

**Next Step:** Begin Phase 1 - Add SQLite dependencies and create `lib/license-db.ts`
