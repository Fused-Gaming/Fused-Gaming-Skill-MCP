# 80% Code Coverage Strategy

## Overview

Target: **80%+ code coverage** across all packages (statements, branches, functions, lines).

Enforced globally in root `jest.config.js` - tests fail if coverage drops below threshold.

---

## Coverage Thresholds

### Global (Root `jest.config.js`)

```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}
```

### Package-Specific Overrides

Some packages may have higher thresholds:

- **Core:** 85%
- **License-client:** 90%
- **Design-tokens:** 85%
- **Skills:** 80% (baseline)
- **Web:** 80% (baseline)

---

## What to Exclude from Coverage

Coverage collection ignores:

```javascript
collectCoverageFrom: [
  'packages/**/src/**/*.{ts,tsx}',
  '!packages/**/src/**/*.d.ts',      // Type definitions
  '!packages/**/src/**/index.ts',    // Re-exports
  '!packages/**/src/**/index.tsx',   // Re-exports
  '!packages/**/src/**/*.stories.tsx', // Storybook stories
  '!**/node_modules/**',             // Dependencies
]
```

**Why exclude these:**

1. **Type definitions** (`.d.ts`): No runtime code
2. **Index/re-exports:** Just pass-through files
3. **Stories:** Documentation, not product code
4. **node_modules:** Dependencies tracked separately

---

## Coverage Metrics Explained

### Statements
Percentage of all JavaScript statements executed by tests.

```typescript
const x = 1;  // Statement
const y = 2;  // Statement
console.log(x + y);  // Statement

// If tests only run first 2: 66.7% coverage
```

### Branches
Percentage of code branches (if/else, switch cases, ternaries) tested.

```typescript
if (user.isAdmin) {  // 2 branches: true/false
  grantAccess();
} else {
  denyAccess();
}

// Both branches tested = 100%
// Only true branch tested = 50%
```

### Functions
Percentage of functions that were called during tests.

```typescript
function create() { }  // Function
function update() { }  // Function
function delete() { }  // Function

// If tests call create() and update(): 66.7% coverage
```

### Lines
Percentage of lines of code executed.

```typescript
function processUser(user) {
  if (!user) return null;  // Line 1
  return user.name;         // Line 2
}

// If only tested with valid user: 1/2 = 50%
```

---

## Coverage Report

### Generate Coverage

```bash
# Full coverage report
npm test -- --coverage

# Output: coverage/lcov-report/index.html
# Open in browser to see detailed breakdown
```

### Coverage Summary

View in console:

```
------|----------|----------|----------|----------|------|------
File  | % Stmts  | % Branch | % Funcs  | % Lines  | Uncov
------|----------|----------|----------|----------|------|------
All   |   85.23  |   82.15  |   87.40  |   85.20  | 
------|----------|----------|----------|----------|------|------
 src/ |   85.23  |   82.15  |   87.40  |   85.20  |
  auth.ts   |   92.1  |   90.0  |   95.2  |   92.1  |
  utils.ts  |   76.5  |   68.0  |   75.0  |   76.0  | 45,67
------|----------|----------|----------|----------|------|------
```

**Red flags:**
- Lines like `utils.ts` show uncovered lines (45, 67)
- Branch coverage significantly lower than line coverage

---

## Coverage-Driven Development

### Step 1: Write Test First (TDD)

Before implementation:

```typescript
describe('validateEmail', () => {
  it('should accept valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should reject invalid email', () => {
    expect(validateEmail('not-an-email')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
});
```

### Step 2: Implement with Coverage in Mind

```typescript
export function validateEmail(email: string): boolean {
  if (!email) return false;  // Covers: empty string test
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);  // Covers: valid/invalid tests
}
```

### Step 3: Verify Coverage

```bash
npm test -- --coverage --testPathPattern="email"
```

Expect output:
```
validateEmail.ts | 100 | 100 | 100 | 100 |
```

---

## Common Coverage Gaps

### Gap 1: Error Paths

```typescript
function processUser(user: User) {
  if (!user) {
    throw new Error('User required');  // ❌ Uncovered
  }
  return user.email;
}
```

**Fix:** Test error condition

```typescript
it('should throw when user null', () => {
  expect(() => processUser(null)).toThrow('User required');
});
```

### Gap 2: Else Branches

```typescript
function getStatus(active: boolean) {
  if (active) {
    return 'Active';  // ✅ Covered
  } else {
    return 'Inactive';  // ❌ Uncovered
  }
}
```

**Fix:** Test both branches

```typescript
it('should return Active for active users', () => {
  expect(getStatus(true)).toBe('Active');
});

it('should return Inactive for inactive users', () => {
  expect(getStatus(false)).toBe('Inactive');
});
```

### Gap 3: Switch Cases

```typescript
function getLevel(score: number) {
  switch (true) {
    case score >= 90:
      return 'A';
    case score >= 80:
      return 'B';  // ❌ May be uncovered
    default:
      return 'F';
  }
}
```

**Fix:** Test each case

```typescript
it('should return A for 90+', () => {
  expect(getLevel(95)).toBe('A');
});

it('should return B for 80-89', () => {
  expect(getLevel(85)).toBe('B');
});

it('should return F for below 80', () => {
  expect(getLevel(75)).toBe('F');
});
```

### Gap 4: Optional Chaining

```typescript
function getName(user?: { name?: string }) {
  return user?.name ?? 'Unknown';  // Multiple branches
}
```

**Fix:** Test all combinations

```typescript
it('should return name when present', () => {
  expect(getName({ name: 'John' })).toBe('John');
});

it('should return Unknown when name missing', () => {
  expect(getName({})).toBe('Unknown');
});

it('should return Unknown when user missing', () => {
  expect(getName()).toBe('Unknown');
});
```

---

## Strategies to Reach 80%

### 1. Prioritize High-Impact Code

Test business logic first:
- User authentication
- Data validation
- Core algorithms
- Error handling

Leave until later:
- Logging
- Analytics
- UI effects
- Styling

### 2. Use Edge Case Coverage

```typescript
// ✅ Good: Tests edge cases
describe('calculateDiscount', () => {
  it('should apply discount for normal price', () => {
    expect(calculateDiscount(100, 0.1)).toBe(90);
  });

  it('should handle zero price', () => {
    expect(calculateDiscount(0, 0.1)).toBe(0);
  });

  it('should handle 0% discount', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });

  it('should handle 100% discount', () => {
    expect(calculateDiscount(100, 1)).toBe(0);
  });

  it('should handle negative price gracefully', () => {
    expect(calculateDiscount(-50, 0.1)).toBeDefined();
  });
});
```

### 3. Integration Tests Cover Multiple Paths

```typescript
// One integration test may cover 30% of branches
// That's more efficient than writing 3 unit tests
describe('Full auth flow', () => {
  it('should complete registration to login', async () => {
    const user = await register({ email, password });
    const session = await login({ email, password });
    expect(session.userId).toBe(user.id);
    // Covers: register valid path, login success path, etc.
  });
});
```

### 4. Use Coverage Reports to Guide Testing

```bash
# Generate report and review uncovered lines
npm test -- --coverage

# Open coverage/lcov-report/index.html
# Click on files to see which lines are uncovered
```

**In HTML report, red lines = uncovered code**

---

## Incremental Coverage Growth

### Week 1: Bootstrap (40-50%)
- Write unit tests for core logic
- Focus on happy paths
- Basic integration tests

### Week 2: Coverage (60-70%)
- Add error handling tests
- Cover branches and edge cases
- Add async/await tests

### Week 3: Completeness (80%+)
- Cover remaining branches
- Edge cases and boundary conditions
- Accessibility and performance tests

### Week 4+: Maintenance (80%+)
- Keep coverage above threshold
- Add tests for new features first
- Refactor for testability

---

## CI/CD Integration

### GitHub Actions Check

```yaml
- name: Verify Coverage
  run: npm test -- --coverage
  
# Fails if any package drops below threshold
```

### Pre-commit Hook (Optional)

```bash
#!/bin/bash
npm test -- --coverage --bail
[ $? -eq 0 ] || exit 1
```

---

## Coverage Badges

Track coverage progress in README:

```markdown
[![Coverage Status](https://codecov.io/github/fused-gaming/fused-gaming-skill-mcp/branch/main/graph/badge.svg)](https://codecov.io/github/fused-gaming/fused-gaming-skill-mcp)

Current Coverage: **85.2%**
- Statements: 85.2%
- Branches: 82.1%
- Functions: 87.4%
- Lines: 85.2%
```

---

## Uncoverable Code

Some code legitimately cannot be tested:

```typescript
// Error handling for unrecoverable errors
if (process.platform === 'win32') {  // ❌ If testing on Linux
  setupWindowsSpecificCode();
}

// External API errors
try {
  response = await externalAPI.call();
} catch (error) {  // ❌ May not have error conditions in test
  handleError(error);
}

// React conditional rendering
if (process.env.NODE_ENV === 'development') {  // ❌ Not in test
  enableDebugMode();
}
```

**Mark as uncoverable:**

```typescript
// istanbul ignore next
if (process.env.NODE_ENV === 'development') {
  enableDebugMode();
}
```

---

## Success Metrics

- **Target:** 80% coverage on all packages
- **Stretch:** 85%+ on critical packages (core, auth)
- **Cadence:** Check coverage weekly
- **Regression:** Block merges that reduce coverage
- **Trend:** Coverage increases or stays constant each week

---

## Resources

- View coverage: `coverage/lcov-report/index.html`
- Coverage thresholds: `jest.config.js`
- Per-package thresholds: `packages/<pkg>/jest.config.js`
- Best practices: `docs/TESTING_INFRASTRUCTURE.md`

