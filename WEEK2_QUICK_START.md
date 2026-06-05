# Week 2 Sprint Quick Start Guide
## For All Specialists

**Branch**: `feat/atomic-components-w2`  
**Sprint**: May 20-26, 2026  
**Goal**: Merge with 80%+ test coverage and all validation passing

---

## What You Need to Know

### Documents You'll Reference

1. **INTEGRATION_VALIDATION_PLAN.md** (Start here!)
   - Overall integration strategy
   - Validation schedule
   - Quality gates definition
   - Integration test plan

2. **WEEK2_INTEGRATION_STATUS.md** (Daily reference)
   - Day-by-day progress tracking
   - Team coordination matrix
   - Metrics dashboard
   - Risk tracking

3. **MERGE_GATE_CRITERIA.md** (Before merge)
   - Comprehensive blocking criteria
   - Sign-off checklist
   - Final validation steps

4. **LICENSE_CLI_IMPLEMENTATION_PLAN.md** (Specialist 3)
   - CLI command specifications
   - Error handling requirements
   - Output formatting rules

5. **COMPONENT_IMPLEMENTATION_STATUS.md** (Specialist 2)
   - Component hierarchy and priorities
   - Type definitions
   - Implementation phases

---

## Your Daily Checklist

### Every Morning (9:00 AM)

```bash
# 1. Check current branch
git branch --show-current
# Should show: feat/atomic-components-w2

# 2. Pull latest changes
git fetch origin
git rebase origin/main
# (only if you see divergence)

# 3. Review WEEK2_INTEGRATION_STATUS.md
# Check what was done yesterday, what's planned today
```

### Every Afternoon (5:00 PM)

**Specialist 5 runs this automatically**:
```bash
npm run typecheck     # Must pass (0 errors)
npm run lint          # Must pass (0 errors, <20 warnings)
npm test              # Coverage tracking
```

**Everyone else**: Be ready with your progress for standup

### Every Evening

**Specialist 5 updates**: WEEK2_INTEGRATION_STATUS.md  
**You**: Review what was done, what's next

---

## Specialist-Specific Quick Starts

### Specialist 1: Core Server

**Your Responsibility**:
- mcp-core package (v1.0.4)
- MCP protocol handlers
- Skill registry
- Type definitions

**Build Your Package**:
```bash
cd packages/core
npm run build
npm run typecheck
npm run lint
npm test
```

**Integration Point**:
- CLI uses your skill registry (for `list` command)
- Core exports must be stable (no breaking changes)
- Types must be accurate (strict mode)

**Success Criteria**:
- ✅ 0 TypeScript errors
- ✅ 70%+ test coverage
- ✅ All exports working
- ✅ README complete

---

### Specialist 2: Component Coder

**Your Responsibility**:
- design-tokens package (v1.0.0)
- 20+ atomic components
- Component types (22 total)
- Storybook stories
- Design token exports (200+)

**TIER 1 Atoms (May 20-21)**:
1. Button
2. Input
3. Badge
4. Icon
5. Spinner
6. Alert

**TIER 2 Molecules (May 22-24)**:
1. Card
2. Tabs
3. Modal
4. Dropdown
5. Toast
6. Form

**Build Your Package**:
```bash
cd packages/design-tokens
npm run build
npm run typecheck
npm run lint
npm run dev      # Watch mode for development
```

**Integration Points**:
- CLI uses your colors/spacing for output formatting
- Web dashboard uses your components
- Type definitions must match implementations

**Success Criteria**:
- ✅ 20+ components exported
- ✅ 22 type definitions complete
- ✅ 75%+ test coverage
- ✅ Storybook stories for all atoms
- ✅ No `any` types in component props

---

### Specialist 3: License CLI Coder

**Your Responsibility**:
- mcp-cli package (v1.0.4)
- 5 CLI commands
- license-client integration
- Design token integration (colors/formatting)

**5 CLI Commands**:

```bash
# 1. Validate license
fused-gaming-mcp validate <path>

# 2. Install license
fused-gaming-mcp install <path>

# 3. Check status
fused-gaming-mcp status

# 4. List skills
fused-gaming-mcp list

# 5. Initialize new license
fused-gaming-mcp init --type=[trial|commercial]
```

**Build Your Package**:
```bash
cd packages/cli
npm run build
npm run typecheck
npm run lint
npm test
```

**Integration Points**:
- Uses license-client for validation/storage
- Uses design-tokens for colors in output
- Uses mcp-core for skill registry

**Success Criteria**:
- ✅ All 5 commands work
- ✅ 80%+ test coverage
- ✅ Error handling complete
- ✅ Output formatted with design tokens
- ✅ No hardcoded colors/spacing

---

### Specialist 4: Test Architect

**Your Responsibility**:
- 80%+ overall test coverage
- Test structures for all packages
- Integration test framework
- Coverage tracking

**Coverage Targets by Package**:
| Package | Target | Focus Area |
|---------|--------|-----------|
| design-tokens | 75% | Component rendering, prop validation |
| license-client | 85% | Validator, storage, generator |
| mcp-core | 70% | Registry, exports, types |
| mcp-cli | 80% | Command execution, error handling |
| **Overall** | **80%+** | **All critical paths** |

**Test Structure**:
```
packages/XXX/
├── src/
│   ├── index.ts
│   └── ...
├── src/__tests__/
│   ├── index.test.ts
│   ├── integration.test.ts
│   └── ...
└── package.json (with test script)
```

**Setup Test Coverage Tracking**:
```bash
# Run coverage for all packages
npm test -- --coverage

# Run coverage for specific package
cd packages/XXX && npm test -- --coverage
```

**Integration Tests**:
1. Import/export validation
2. Cross-package integration
3. CLI command execution
4. Component rendering
5. License validation flow

**Success Criteria**:
- ✅ 80%+ overall coverage
- ✅ All tests passing (100%)
- ✅ No skipped tests
- ✅ No flaky tests
- ✅ Critical paths covered

---

### Specialist 5: Integration Lead (You)

**Your Responsibility**:
- Daily validation cycles
- Merge gate criteria verification
- Integration testing
- Team coordination
- Risk mitigation

**Daily Tasks** (5:00 PM):
```bash
# 1. TypeScript strict mode
npm run typecheck
# Expected: 0 errors

# 2. Lint check
npm run lint
# Expected: 0 errors, <20 warnings

# 3. Individual builds (memory-safe)
npm run build --workspace=packages/design-tokens
npm run build --workspace=packages/license-client
npm run build --workspace=packages/cli
npm run build --workspace=packages/core
# Expected: All succeed

# 4. Import validation
npm test -- --coverage
# Expected: Coverage metrics visible

# 5. Update status
# Edit WEEK2_INTEGRATION_STATUS.md with results
```

**Success Criteria**:
- ✅ All daily validations passing
- ✅ Integration tests defined and running
- ✅ Coverage tracking active
- ✅ Blockers identified early
- ✅ Team coordinated

---

### Specialist 6: Deployment Manager

**Your Responsibility**:
- Production readiness validation
- npm publishing configuration
- Deployment checklist
- Final sign-off

**Validation Points**:
- ✅ All packages have `publishConfig`
- ✅ Versions follow semantic versioning
- ✅ Node engines >=20.0.0
- ✅ No breaking changes without migration
- ✅ npm publish --dry-run succeeds
- ✅ CHANGELOG updated

**Before Merge** (May 25):
```bash
# Dry run npm publish
npm publish --dry-run --workspaces

# Check all packages
npm view @h4shed/design-tokens
npm view @h4shed/license-client
npm view @h4shed/mcp-cli
npm view @h4shed/mcp-core
```

---

## Integration Test Commands

### Run All Tests
```bash
# Tests for all packages
npm test

# With coverage
npm test -- --coverage
```

### Run Specific Package Tests
```bash
npm test --workspace=packages/design-tokens
npm test --workspace=packages/license-client
npm test --workspace=packages/cli
npm test --workspace=packages/core
```

### Manual Integration Testing

**Test 1: Import Validation**
```bash
node -e "import('@h4shed/design-tokens').then(() => console.log('✓ design-tokens'))"
node -e "import('@h4shed/license-client').then(() => console.log('✓ license-client'))"
node -e "import('@h4shed/mcp-cli').then(() => console.log('✓ cli'))"
```

**Test 2: CLI Commands**
```bash
# After building
fused-gaming-mcp --help
fused-gaming-mcp validate --help
fused-gaming-mcp install --help
fused-gaming-mcp status
fused-gaming-mcp list
fused-gaming-mcp init --help
```

**Test 3: Component Types**
```bash
# Check type definitions exist
ls -la packages/design-tokens/dist/tokens/components.d.ts
head -20 packages/design-tokens/dist/tokens/components.d.ts
```

---

## Common Issues & Solutions

### TypeScript Errors

**Error**: `TS2688: Cannot find type definition`
```bash
# Solution: Rebuild the package
npm run build --workspace=packages/design-tokens

# Check imports reference correct paths
grep -r "from.*design-tokens" packages/cli/src/
```

**Error**: `TS4023: Exported variable X has or is using private name`
```bash
# Solution: Add explicit return type or export the type
export interface ButtonProps { /* ... */ }
export const Button: React.FC<ButtonProps> = (props) => { /* ... */ }
```

### Import Errors

**Error**: `Module not found: @h4shed/design-tokens`
```bash
# Solution: Rebuild and verify exports
npm run build --workspace=packages/design-tokens

# Check package.json exports
cat packages/design-tokens/package.json | grep -A20 exports
```

### Build Issues in Memory-Limited Environment

**Error**: `ENOMEM: out of memory`
```bash
# Solution: Build individual packages, not all at once
npm run build --workspace=packages/design-tokens  # Not full build
npm run build --workspace=packages/cli

# Or increase memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Test Coverage Not Updating

**Error**: Coverage always shows 0%
```bash
# Solution: Check test scripts in package.json
cat packages/XXX/package.json | grep '"test"'

# Should NOT be: "test": "echo \"No tests yet\""
# Should BE: "test": "jest" or "vitest"
```

---

## Daily Standup Template

**Time**: 9:00 AM  
**Duration**: 15 minutes  
**Attendees**: All specialists + Queen Coordinator

### What to Report

**Specialist 1-4 (Implementation)**:
```
Yesterday:
- Completed: [X components/CLI commands/tests]
- Coverage achieved: [X%]
- Blockers faced: [None / List]

Today:
- Will complete: [X components/CLI commands/tests]
- Focus area: [TIER 1/2 atoms / CLI commands / Tests]
- Help needed: [None / Specific request]

Integration:
- All imports working? [Yes/No]
- Any type errors? [Yes/No]
```

**Specialist 5 (Integration Lead)**:
```
Validation Report (from yesterday 5 PM):
- TypeScript: [0 errors ✅ / X errors ❌]
- Lint: [0 errors ✅ / X errors ❌]
- Build: [All pass ✅ / X failures ❌]
- Tests: [Coverage X% / Status]

Blockers to address:
1. [Specific blocker]
2. [Specific blocker]

Priority for today:
1. [Action item]
2. [Action item]
```

---

## Success Looks Like

### By May 24 (Thursday)
```
TypeScript: ✅ 0 errors
Lint: ✅ <20 warnings
Build: ✅ All packages building
Tests: ⚠️ 75%+ coverage (close to 80%)
Components: ✅ 20/20 implemented
CLI: ✅ 5/5 commands working
Integration: ⚠️ Most tests passing
```

### By May 25 (Saturday) - MERGE DAY
```
TypeScript: ✅ 0 errors
Lint: ✅ <20 warnings
Build: ✅ All packages successful
Tests: ✅ 80%+ coverage, 100% passing
Components: ✅ 20/20 with stories
CLI: ✅ 5/5 commands tested e2e
Integration: ✅ All tests passing
Documentation: ✅ Complete
Deployment: ✅ npm ready
Security: ✅ No mocks/secrets
MERGE: ✅ APPROVED
```

---

## Key Documents Map

```
START HERE
    ↓
INTEGRATION_VALIDATION_PLAN.md
    ↓ (detailed daily plan)
WEEK2_INTEGRATION_STATUS.md
    ↓ (comprehensive checklist)
MERGE_GATE_CRITERIA.md
    ↓ (final verification)
    READY TO MERGE ✅
```

---

## Contact & Escalation

**Daily Blockers**: Message during standup (9 AM)  
**Urgent Issues**: Reach out to Queen Coordinator immediately  
**Integration Issues**: Contact Specialist 5 (Integration Lead)  
**Test Coverage**: Contact Specialist 4 (Test Architect)

---

## Commit Message Format

When you commit code, follow this format:

```
type(scope): description

- Detail 1
- Detail 2

https://claude.ai/code/session_01LRQYsmcKNnHr7SPNEzP8gx
```

**Types**: feat, fix, docs, refactor, test, chore  
**Scope**: component, cli, license, core, types, etc.

**Examples**:
```
feat(components): Add Button atom with 4 variants
- Implement primary, secondary, danger, ghost variants
- Add size prop (xs, sm, md, lg, xl)
- Add loading state support

feat(cli): Implement validate command
- Uses license-client validator
- Formats output with design tokens
- Error handling for invalid licenses

test(cli): Add integration tests for validate command
- Test valid license validation
- Test expired license handling
- Test file not found error

docs: Update integration validation plan
- Add daily checklist for May 22
- Update metrics dashboard
```

---

## You're Ready!

**You have everything you need**:
- ✅ Clear integration plan
- ✅ Daily validation framework
- ✅ Team coordination structure
- ✅ Quality gates defined
- ✅ Success criteria documented
- ✅ Merge readiness checklist

**Next steps**:
1. Read INTEGRATION_VALIDATION_PLAN.md completely
2. Understand your specialist responsibilities
3. Be ready for 9 AM standup tomorrow
4. Start implementation with confidence

**Remember**: No mock or fake implementations. All code must be production-ready. This is a validation-driven sprint - we gate the merge on proof that everything works together.

Good luck! 🚀

---

**Created**: May 21, 2026 by Specialist 5  
**For**: Week 2 Sprint Team  
**Status**: Ready to Use
