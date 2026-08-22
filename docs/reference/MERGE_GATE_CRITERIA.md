# Merge Gate Criteria - Week 2 Sprint
## Production Validation Checklist

**PR Target**: Merge `feat/atomic-components-w2` to `main`  
**Date**: May 25-26, 2026  
**Gate Keeper**: Specialist 5 (Integration Lead)  
**Approval Required**: YES - All criteria must be MET before merge

---

## BLOCKING CRITERIA (MUST PASS)

### 1. Code Quality

#### TypeScript Strict Mode
```bash
npm run typecheck
```
**Requirement**: 0 errors  
**Current Status**: ✅ PASSING  
**Validation**: Run `npm run typecheck` - must output no errors  
**Evidence Required**: 
- [ ] Command output shows "no errors"
- [ ] All `.d.ts` files generated successfully

#### Lint Pass (ESLint)
```bash
npm run lint
```
**Requirement**: 0 errors (warnings OK if <20)  
**Current Status**: ⚠️ 17 warnings (ACCEPTABLE)  
**Validation**: Run `npm run lint` - must show <20 warnings  
**Evidence Required**:
- [ ] Command output shows 0 errors
- [ ] Total warnings <20
- [ ] All warnings are `no-explicit-any` (acceptable for now)

#### Build Success
```bash
npm run build --workspace=packages/design-tokens
npm run build --workspace=packages/license-client
npm run build --workspace=packages/cli
npm run build --workspace=packages/core
npm run build --workspace=packages/core
```
**Requirement**: All workspace builds succeed  
**Current Status**: ⚠️ PENDING (OOM in full build, but individual should pass)  
**Validation**: Each package builds without errors  
**Evidence Required**:
- [ ] `packages/design-tokens` builds successfully
- [ ] `packages/license-client` builds successfully
- [ ] `packages/cli` builds successfully
- [ ] `packages/core` builds successfully
- [ ] All `.d.ts` files are generated
- [ ] All `.js` files in `dist/` directory

### 2. Test Coverage

**Requirement**: ≥80% coverage  
**Current Status**: ❌ BLOCKING - 0% coverage (no tests implemented)  
**Validation**: 
```bash
npm test -- --coverage
```
**Evidence Required**:
- [ ] Coverage report shows ≥80% overall
- [ ] All critical paths covered:
  - Design tokens exports
  - License client validator
  - License client storage
  - CLI command execution
  - Component type exports
- [ ] No uncovered branches in core packages

**Per-Package Targets**:
| Package | Target | Achieved | Status |
|---------|--------|----------|--------|
| design-tokens | 75% | ? | ❌ |
| license-client | 85% | ? | ❌ |
| mcp-cli | 80% | ? | ❌ |
| mcp-core | 70% | ? | ❌ |

### 3. Test Pass Rate

**Requirement**: 100% of implemented tests passing  
**Current Status**: ⚠️ No tests implemented (just placeholders)  
**Validation**:
```bash
npm test
```
**Evidence Required**:
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] No flaky tests
- [ ] No skipped tests (`.skip` or `.pending`)

---

## INTEGRATION VALIDATION CRITERIA

### 4. Component Library Integration

#### Design Tokens Exports
**Requirement**: All 200+ tokens exported and typed  
**Validation Points**:
```typescript
// Test each export path
import * as designTokens from '@h4shed/design-tokens';
import colors from '@h4shed/design-tokens/colors';
import typography from '@h4shed/design-tokens/typography';
import spacing from '@h4shed/design-tokens/spacing';
import shadows from '@h4shed/design-tokens/shadows';
import motion from '@h4shed/design-tokens/motion';
import components from '@h4shed/design-tokens/components';
```

**Evidence Required**:
- [ ] All export paths work without errors
- [ ] All tokens are typed (no `any`)
- [ ] 200+ color values accessible
- [ ] 13 typography sizes accessible
- [ ] Spacing scale complete (4px base)
- [ ] Shadow definitions complete
- [ ] Animation definitions complete
- [ ] Component type definitions (22 types)

#### Component Type Definitions
**Requirement**: 22 component types properly defined and exported  
**Types**:
1. Button
2. Input
3. Badge
4. Icon
5. Spinner
6. Alert
7. Card
8. Tabs
9. Modal
10. Dropdown
11. Toast
12. Form
13. Field
14. Label
15. Checkbox
16. Radio
17. Switch
18. Select
19. Textarea
20. Link
21. Text
22. Container

**Evidence Required**:
- [ ] All 22 types have interface definitions
- [ ] All types export from main entry
- [ ] All types have JSDoc comments
- [ ] TypeScript can infer prop types correctly
- [ ] No `any` in component prop definitions

### 5. License Client Integration

#### Validator Implementation
**Requirement**: License validation fully functional  
**Test Cases**:
```typescript
import { Validator } from '@h4shed/license-client';

const validator = new Validator();

// Valid commercial license
const validLicense = { /* valid JWT */ };
assert(validator.validate(validLicense).valid === true);

// Expired license
const expiredLicense = { /* expired JWT */ };
assert(validator.validate(expiredLicense).valid === false);

// Invalid signature
const invalidLicense = { /* tampered JWT */ };
assert(validator.validate(invalidLicense).valid === false);

// Trial license
const trialLicense = { /* trial JWT */ };
assert(validator.validate(trialLicense).valid === true);
```

**Evidence Required**:
- [ ] `Validator` class instantiates
- [ ] `validate()` method works for valid licenses
- [ ] `validate()` method rejects expired licenses
- [ ] `validate()` method rejects tampered licenses
- [ ] All license types (trial, commercial) handled

#### Storage Implementation
**Requirement**: License persistence fully functional  
**Test Cases**:
```typescript
import { Storage } from '@h4shed/license-client';

const storage = new Storage();

// Save license
await storage.save(license);

// Read license
const saved = await storage.read();
assert(saved.id === license.id);

// Delete license
await storage.delete();

// Offline cache
const cached = await storage.getOfflineCache();
assert(cached !== null);
```

**Evidence Required**:
- [ ] `Storage` class instantiates
- [ ] `save()` persists license data
- [ ] `read()` retrieves saved license
- [ ] `delete()` removes license
- [ ] Offline cache works
- [ ] No data loss on expiry

#### Generator Implementation
**Requirement**: License creation fully functional  
**Test Cases**:
```typescript
import { Generator } from '@h4shed/license-client';

const generator = new Generator({ secret: 'test-secret' });

// Create trial license
const trial = generator.createTrialLicense({
  email: 'test@example.com',
  expiresIn: 30
});
assert(trial.type === 'trial');

// Create commercial license
const commercial = generator.createCommercialLicense({
  email: 'user@company.com',
  seats: 5,
  expiresIn: 365
});
assert(commercial.type === 'commercial');
```

**Evidence Required**:
- [ ] `Generator` instantiates with secret
- [ ] Trial licenses created with expiry
- [ ] Commercial licenses created with seat count
- [ ] Generated licenses pass validation
- [ ] JWT structure is correct

### 6. CLI Integration

#### Command: `validate <licenseFile>`
**Requirement**: Validate license files  
**Test Cases**:
```bash
# Valid license
fused-gaming-mcp validate ./test-license.json
# Expected output: Green checkmark, license details

# Invalid license
fused-gaming-mcp validate ./invalid.json
# Expected output: Red X, error message

# Missing file
fused-gaming-mcp validate ./nonexistent.json
# Expected output: Error message, exit code 1
```

**Evidence Required**:
- [ ] Command accepts file path argument
- [ ] Valid licenses show success output
- [ ] Invalid licenses show error output
- [ ] Missing files handled gracefully
- [ ] Output uses design tokens for colors

#### Command: `install <licenseFile>`
**Requirement**: Install license to local storage  
**Test Cases**:
```bash
# Install valid license
fused-gaming-mcp install ./license.json
# Expected: License saved to ~/.fused-gaming/license.json

# Verify installation
ls ~/.fused-gaming/license.json
# Expected: File exists

# Reinstall overwrites
fused-gaming-mcp install ./license2.json
# Expected: Old license replaced
```

**Evidence Required**:
- [ ] Command creates `~/.fused-gaming/` directory
- [ ] License file saved to correct location
- [ ] Existing license is overwritten
- [ ] Success message displayed
- [ ] Exit code 0 on success, non-zero on error

#### Command: `status`
**Requirement**: Show current license status  
**Test Cases**:
```bash
# No license installed
fused-gaming-mcp status
# Expected: "No license installed"

# License installed
fused-gaming-mcp status
# Expected: Shows license type, expiry, seat count

# License expired
fused-gaming-mcp status
# Expected: "License expired on ..."
```

**Evidence Required**:
- [ ] Command executes without args
- [ ] Shows "No license" if none installed
- [ ] Shows license details if installed
- [ ] Shows expiry date
- [ ] Shows license type (trial/commercial)

#### Command: `list`
**Requirement**: List available skills  
**Test Cases**:
```bash
# List skills
fused-gaming-mcp list
# Expected: Table of skills with descriptions

# Require valid license
# If no valid license: show upgrade message
```

**Evidence Required**:
- [ ] Command executes without args
- [ ] Lists all available skills
- [ ] Shows skill descriptions
- [ ] Shows skill status (available/disabled)
- [ ] Properly formats table output

#### Command: `init [--type=trial|commercial]`
**Requirement**: Initialize new license  
**Test Cases**:
```bash
# Create trial license
fused-gaming-mcp init --type=trial
# Expected: Interactive prompts for email, generates license

# Create commercial license
fused-gaming-mcp init --type=commercial
# Expected: Interactive prompts for email/seats, generates license

# Default to trial
fused-gaming-mcp init
# Expected: Same as trial
```

**Evidence Required**:
- [ ] Command accepts `--type` flag
- [ ] Trial type creates trial license
- [ ] Commercial type prompts for seats
- [ ] License generated and saved
- [ ] License key displayed in output

### 7. No Mock/Fake Implementations

**Requirement**: All production code uses real implementations  
**Validation**: Grep for forbidden patterns
```bash
# Should return NO results in src/
grep -r "mock\|fake\|stub" packages/*/src/ --exclude-dir=__tests__
grep -r "TODO.*implement\|FIXME.*mock" packages/*/src/
grep -r "throw new Error.*not implemented" packages/*/src/
grep -r "console\\.log\|console\\.warn\|console\\.error" packages/*/src/ \
  | grep -v "// intentional" | head -20
```

**Evidence Required**:
- [ ] No mock implementations in src/
- [ ] No stub functions in production
- [ ] No placeholder "not implemented" errors
- [ ] No console logging in libraries (CLI output OK)
- [ ] All implementations are real and functional

---

## DOCUMENTATION CRITERIA

### 8. Complete Documentation

#### README Files
**Requirement**: Every package has comprehensive README  
**Check**:
- [ ] `packages/design-tokens/README.md` exists
- [ ] `packages/license-client/README.md` exists
- [ ] `packages/cli/README.md` exists
- [ ] `packages/core/README.md` exists

**Content Required**:
- [ ] Installation instructions
- [ ] Quick start example
- [ ] API documentation
- [ ] CLI usage (`--help` output)
- [ ] Contributing guidelines

#### CHANGELOG
**Requirement**: Document all changes  
**Check**:
- [ ] `CHANGELOG.md` includes Week 2 changes
- [ ] Entries follow [Keep a Changelog](https://keepachangelog.com/) format
- [ ] Links to relevant PRs and issues
- [ ] Breaking changes clearly marked

**Section Required**:
```markdown
## [1.2.0] - 2026-05-26

### Added
- Atomic component library (20+ components)
- License client integration
- CLI commands (5 new)
- Design tokens (200+)

### Changed
- Updated component architecture
- Refactored license storage

### Fixed
- License validation edge cases
- CLI output formatting

### Breaking
- Component prop names changed from `v1.0`
```

#### Type Documentation
**Requirement**: All public types have JSDoc  
**Check**:
```bash
# Find undocumented exports
grep -r "^export " packages/*/src/*.ts | grep -v "^\s*//" | head -20
```

**Evidence Required**:
- [ ] All exported types have JSDoc comments
- [ ] All component props documented
- [ ] All CLI commands documented
- [ ] License types documented

#### Storybook Stories
**Requirement**: At least TIER 1 components have stories  
**Check**:
- [ ] `packages/design-tokens/src/components/atoms/buttons/Button.stories.tsx` exists
- [ ] `packages/design-tokens/src/components/atoms/inputs/Input.stories.tsx` exists
- [ ] `packages/design-tokens/src/components/atoms/displays/Badge.stories.tsx` exists
- [ ] And for all other TIER 1 atoms

**Evidence Required**:
- [ ] Stories render without errors
- [ ] Variants shown (size, state, color)
- [ ] Controls/knobs allow prop editing
- [ ] Accessibility checklist passed

---

## PERFORMANCE CRITERIA

### 9. Package Size & Build Performance

#### Package Sizes
**Requirement**: Individual packages <500KB  
**Check**:
```bash
du -h packages/design-tokens/dist
du -h packages/license-client/dist
du -h packages/cli/dist
```

**Targets**:
| Package | Target | Current | Status |
|---------|--------|---------|--------|
| design-tokens dist/ | <300KB | ? | ❌ |
| license-client dist/ | <100KB | ? | ❌ |
| cli dist/ | <200KB | ? | ❌ |

**Evidence Required**:
- [ ] design-tokens dist <300KB
- [ ] license-client dist <100KB
- [ ] cli dist <200KB
- [ ] No extraneous files in dist/

#### Build Performance
**Requirement**: Individual package builds <30s  
**Check**:
```bash
time npm run build --workspace=packages/design-tokens
time npm run build --workspace=packages/license-client
time npm run build --workspace=packages/cli
```

**Targets**:
| Package | Target | Current | Status |
|---------|--------|---------|--------|
| design-tokens | <20s | ? | ❌ |
| license-client | <10s | ? | ❌ |
| cli | <15s | ? | ❌ |

**Evidence Required**:
- [ ] Each package builds in <30s
- [ ] Incremental builds <5s
- [ ] No warnings during build

---

## DEPLOYMENT CRITERIA

### 10. npm Publishing Ready

#### Package Configuration
**Requirement**: All packages have correct publishing config  
**Check**:
```bash
grep -A5 '"publishConfig"' packages/*/package.json
```

**Requirements**:
- [ ] All public packages have `"publishConfig": { "access": "public" }`
- [ ] registry correct: `https://registry.npmjs.org/`
- [ ] No private packages accidentally public
- [ ] No files accidentally included in npm package

#### Version Alignment
**Requirement**: Semantic versioning followed  
**Check**:
```bash
grep '"version"' packages/*/package.json | sort
```

**Requirements**:
- [ ] Patch bumps for bug fixes
- [ ] Minor bumps for new features
- [ ] Major bumps for breaking changes
- [ ] Root version consistent with published packages

#### Node Engines
**Requirement**: Consistent minimum Node version  
**Check**:
```bash
grep '"engines"' packages/*/package.json | grep -v '^packages'
```

**Requirements**:
- [ ] All packages: `"node": ">=20.0.0"`
- [ ] Documented in README
- [ ] No use of Node 18 or earlier features

#### Dependencies
**Requirement**: No unintended external dependencies  
**Check**:
```bash
# List production dependencies
grep -A10 '"dependencies"' packages/design-tokens/package.json
grep -A10 '"dependencies"' packages/license-client/package.json
grep -A10 '"dependencies"' packages/cli/package.json
```

**Evidence Required**:
- [ ] design-tokens has 0 production dependencies
- [ ] license-client has only `jsonwebtoken`
- [ ] cli has only specified UI libraries
- [ ] No accidental dev dependencies in production

---

## SECURITY CRITERIA

### 11. No Secrets or Credentials

**Requirement**: No API keys, passwords, or tokens in code  
**Check**:
```bash
grep -r "sk_\|APIKEY\|password\|secret" src/ packages/*/src/ \
  | grep -v "// test\|// example" | head -20
```

**Evidence Required**:
- [ ] No hardcoded API keys
- [ ] No embedded credentials
- [ ] No test secrets in production code
- [ ] All secrets use environment variables

### 12. License Validation Secure

**Requirement**: License validation cannot be bypassed  
**Test Cases**:
```typescript
// Cannot create valid JWT without secret
const forged = jwt.sign({ type: 'commercial' }, 'wrong-secret');
assert(validator.validate(forged).valid === false);

// Cannot modify JWT payload
const modified = jwt.sign(original.payload, 'correct-secret');
assert(validator.validate(modified).valid === true);

// Cannot use trial license for commercial features
const trial = generateTrialLicense();
assert(validator.validate(trial).requiresUpgrade === true);
```

**Evidence Required**:
- [ ] JWT signature verification enforced
- [ ] License expiry checked
- [ ] License type respected
- [ ] Tampered licenses rejected

---

## GIT & PR CRITERIA

### 13. Clean Git History

**Requirement**: Meaningful commit messages, no merge commits  
**Check**:
```bash
git log --oneline feat/atomic-components-w2..origin/main | head -20
```

**Requirements**:
- [ ] Commits have clear, descriptive messages
- [ ] Messages follow format: `type(scope): description`
- [ ] No "WIP", "fix", "temp", or "test" commits
- [ ] No duplicate commits
- [ ] Rebased on latest main (no merge commits)

**Examples**:
- ✅ `feat(components): add Button component with 4 variants`
- ✅ `fix(license-client): handle expired certificates`
- ✅ `docs(cli): add command documentation`
- ❌ `WIP: working on components`
- ❌ `fix fix fix`
- ❌ `Merge branch main`

### 14. No Conflicts with Main

**Requirement**: Branch cleanly merges to main  
**Check**:
```bash
git fetch origin
git merge-base feat/atomic-components-w2 origin/main
git diff --name-only origin/main...feat/atomic-components-w2 | head -50
```

**Requirements**:
- [ ] No merge conflicts
- [ ] All changed files documented
- [ ] No accidental deletions
- [ ] Git history clean

### 15. Comprehensive PR Description

**Requirement**: PR clearly documents all changes  
**Sections Required**:

```markdown
## Summary
Clear description of changes made

## What's New
- Component library with 20+ atoms
- License client integration
- 5 CLI commands
- 200+ design tokens

## Breaking Changes
- Component prop names changed (migration guide provided)
- Design token file structure changed

## Testing
- [x] All unit tests passing (80%+ coverage)
- [x] Integration tests for CLI
- [x] Component stories in Storybook
- [x] Manual testing of all 5 CLI commands

## Checklist
- [x] Tests added/updated
- [x] Documentation updated
- [x] Types updated
- [x] CHANGELOG updated
- [x] No breaking changes without migration
- [x] Ready for production
```

**Evidence Required**:
- [ ] PR has clear title
- [ ] Summary explains the feature
- [ ] Test results documented
- [ ] Breaking changes listed
- [ ] Migration guide provided
- [ ] Screenshots/videos if UI changes

---

## FINAL VERIFICATION CHECKLIST

### Before Merge

**Day of Merge (May 25, 2026)**:

```
MORNING CHECK
- [ ] Pull latest main: git fetch origin && git rebase origin/main
- [ ] Run npm run typecheck → 0 errors
- [ ] Run npm run lint → <20 warnings, 0 errors
- [ ] Build packages individually (memory safe)
- [ ] All git conflicts resolved
- [ ] PR description complete and approved

AFTERNOON CHECK
- [ ] Run npm test -- --coverage → ≥80% coverage
- [ ] All tests passing (100% pass rate)
- [ ] Manual testing of all 5 CLI commands
- [ ] Storybook stories render without errors
- [ ] npm publish --dry-run succeeds

EVENING CHECK (FINAL)
- [ ] All blocking criteria met
- [ ] All integration criteria met
- [ ] All documentation criteria met
- [ ] All performance criteria met
- [ ] All deployment criteria met
- [ ] All security criteria met
- [ ] All git criteria met
- [ ] Ready for merge to main
```

---

## SIGN-OFF

**Merge approved by**: Specialist 5 (Integration Lead)  
**Date**: __________________  
**All criteria met**: YES / NO

**If NO, list blockers**:
1. 
2. 
3. 

**Prepared by**: Integration Lead  
**Reviewed by**: [Queen Coordinator / Deployment Manager]  
**Approved by**: [Development Lead / Release Manager]

---

**This is a LIVE document. Update it as each criterion is verified.**

**Do NOT merge without completing this checklist.**
