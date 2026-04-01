# Contributing to Fused Gaming MCP

Thank you for your interest in contributing! This guide will help you get started.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## Getting Started

### 1. Fork & Clone

```bash
git clone https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP.git
cd Fused-Gaming-Skill-MCP
npm install
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Changes

Follow the coding standards and create tests.

### 4. Test Locally

```bash
npm run lint
npm run typecheck
npm run build
npm run test
```

### 5. Commit

```bash
git commit -m "feat: description of changes"
```

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Build/tooling

### 6. Push & Open PR

```bash
git push origin feature/your-feature-name
```

Then open a pull request on GitHub.

---

## Development Setup

### Prerequisites

- Node.js 18+
- npm 8+
- Git

### Install Dependencies

```bash
npm install
```

### Build

```bash
npm run build        # Build all packages
npm run dev          # Build in watch mode
```

### Lint & Type Check

```bash
npm run lint         # ESLint
npm run typecheck    # TypeScript
```

### Test

```bash
npm test             # Run all tests
npm run test:watch   # Watch mode
```

---

## Contributing a New Skill

See [docs/SKILLS_GUIDE.md](./docs/SKILLS_GUIDE.md) for detailed instructions.

### Quick Checklist

- [ ] Create skill in `packages/skills/{skill-name}/`
- [ ] Implement Skill interface
- [ ] Add tool definitions with input schemas
- [ ] Write README with examples
- [ ] Add tests
- [ ] Update root config
- [ ] Commit with conventional message

### Skill Review Criteria

- ✅ Follows monorepo structure
- ✅ Complete TypeScript types
- ✅ Clear descriptions & documentation
- ✅ Proper error handling
- ✅ Input validation
- ✅ Tests pass
- ✅ No security issues

---

## Bug Reports

When reporting bugs, include:

1. **Environment:**
   - OS (Windows, macOS, Linux)
   - Node version: `node --version`
   - npm version: `npm --version`

2. **Steps to reproduce:**
   ```
   1. ...
   2. ...
   3. ...
   ```

3. **Expected behavior:**
   What should happen?

4. **Actual behavior:**
   What actually happens?

5. **Error logs:**
   ```
   (Include full error message)
   ```

---

## Feature Requests

When requesting features:

1. **Description:** What should the feature do?
2. **Use case:** Why is it needed?
3. **Example:** How would it be used?

---

## Code Style

### TypeScript

- Use strict mode (`"strict": true`)
- Explicit type annotations for functions
- No `any` unless necessary
- Avoid `var`, use `const`/`let`

### Naming

- Files: `kebab-case`
- Variables/functions: `camelCase`
- Classes/types: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`

### Formatting

```bash
npm run lint -- --fix  # Auto-format
```

We use ESLint + Prettier for consistency.

### Comments

```typescript
// Single line for simple explanations
const x = 5; // This is x

// Multi-line for complex logic
/**
 * This function does something complex.
 * 
 * @param input - The input value
 * @returns The processed result
 */
function complex(input: string): string {
  // Implementation
}
```

---

## Testing

### Unit Tests

```typescript
// src/__tests__/my-tool.test.ts
import { describe, it, expect } from "vitest";
import { myTool } from "../tools/my-tool";

describe("myTool", () => {
  it("should process input", async () => {
    const result = await myTool.handler({ input: "test" });
    expect(result.success).toBe(true);
  });
});
```

Run tests:
```bash
npm test
npm run test:watch
```

### Coverage

Aim for 80%+ coverage. Check with:
```bash
npm test -- --coverage
```

---

## Documentation

### README Updates

When adding features, update relevant READMEs:
- `README.md` — High-level overview
- `docs/ARCHITECTURE.md` — System design
- `docs/SKILLS_GUIDE.md` — Skill development
- `docs/API_REFERENCE.md` — API docs

### Code Comments

Document complex logic:
```typescript
// Validate input before processing expensive operation
if (!input || input.length === 0) {
  return { error: "Input is required" };
}

// Use binary search for O(log n) lookup
const index = binarySearch(data, target);
```

### Examples

Add examples for new features:
```typescript
/**
 * Example usage:
 * 
 * ```typescript
 * const result = await myFunction({ param: "value" });
 * console.log(result);
 * ```
 */
```

---

## Release Process

Releases are handled by maintainers. Process:

1. **Update versions:**
   ```bash
   npm version patch|minor|major
   ```

2. **Update CHANGELOG:**
   Document changes in `CHANGELOG.md`

3. **Tag & push:**
   ```bash
   git push --tags
   ```

4. **GitHub Actions:**
   - `publish.yml` automatically publishes to npm
   - Creates GitHub release

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(skill-name): add new feature
fix(core): resolve registry issue
docs(api): update type documentation
refactor(server): simplify initialization
test(tools): add coverage for edge cases
```

Examples:
```bash
git commit -m "feat(algorithmic-art): add mandala pattern generator"
git commit -m "fix(core): handle missing skill gracefully"
git commit -m "docs: add examples and troubleshooting guide"
```

---

## PR Guidelines

### Before Submitting

- [ ] Code is well-formatted (`npm run lint -- --fix`)
- [ ] All tests pass (`npm test`)
- [ ] Types check out (`npm run typecheck`)
- [ ] No `console.log()` statements (use logging)
- [ ] Commits follow conventional format
- [ ] PR description explains changes

### PR Description Template

```markdown
## Description
What does this PR do?

## Changes
- Change 1
- Change 2
- Change 3

## Testing
How was this tested?

## Related Issues
Closes #123
```

### Review Process

1. Automated checks (lint, test, build)
2. Maintainer review
3. Feedback & iteration
4. Approval & merge

---

## Troubleshooting

### Build fails

```bash
npm run clean  # Remove dist/node_modules
npm install
npm run build
```

### Type errors

```bash
npm run typecheck
# Check errors and fix them
```

### Tests fail

```bash
npm test -- --reporter=verbose
# Check which tests are failing
```

### Git conflicts

```bash
git fetch origin
git rebase origin/main
# Resolve conflicts in your editor
git add .
git rebase --continue
```

---

## Questions?

- 📖 See [docs/](./docs/) for documentation
- 💬 Open a GitHub issue to discuss
- 🐛 Report bugs with details

Thank you for contributing! 🙏
