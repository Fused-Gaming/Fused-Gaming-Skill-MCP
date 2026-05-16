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

Use descriptive branch names with prefixes for tracking:

```bash
# Features
git checkout -b feature/skill-name-or-feature-description

# Bug fixes
git checkout -b fix/issue-description

# Hotfixes (urgent production fixes)
git checkout -b hotfix/critical-issue

# Infrastructure/tooling updates
git checkout -b infrastructure/update-description

# Documentation updates
git checkout -b docs/update-description
```

**Branch naming convention:** `{type}/{claude|description}`
- Use `claude/` prefix for agent-driven work
- Use descriptive names that appear in GitHub PR titles
- Examples: `feature/animated-frontend-design`, `fix/workspace-duplicate-naming`, `claude/fix-pr-171-comments`

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

- Node.js 20.x (tested on 20.x and 22.x LTS)
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
- [ ] Implement Skill interface with proper types
- [ ] Add tool definitions with input schemas
- [ ] Write README with usage examples
- [ ] Add unit tests (80%+ coverage target)
- [ ] Update `VERSION.json` with new skill entry
- [ ] Add entry to skill registry if publishing
- [ ] Commit with conventional message: `feat(skill-name): description`
- [ ] Add release notes entry (Unreleased section of CHANGELOG.md)

### Skill Package Naming

- **Internal development:** `@fused-gaming/skill-{name}` (in package.json)
- **Published on npm:** `@h4shed/skill-{name}` (in VERSION.json publishedPackages)
- **Examples:**
  - Internal: `@fused-gaming/skill-algorithmic-art`
  - Published: `@h4shed/skill-algorithmic-art`

### Skill Registry Updates

When adding a new skill, update `VERSION.json`:

```json
{
  "workspaces": {
    "skills": [
      {
        "name": "@fused-gaming/skill-example",
        "version": "1.0.0",
        "published": false  // Set to true after first npm publish
      }
    ],
    "publishedPackages": [
      "@h4shed/skill-example"  // Add if being published
    ]
  }
}
```

### Skill Review Criteria

- ✅ Follows monorepo structure
- ✅ Complete TypeScript types
- ✅ Clear descriptions & documentation
- ✅ Proper error handling
- ✅ Input validation
- ✅ Tests pass
- ✅ No security issues
- ✅ README with usage examples
- ✅ VERSION.json updated
- ✅ Release notes drafted (if for release)

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

## Workspace Installation & Dependency Management

### Safe Install Steps

When installing dependencies in this monorepo workspace:

```bash
# 1. First, sync the lockfile without building (safe in all environments)
npm install --package-lock-only --ignore-scripts

# 2. Then install normally
npm install
```

**Why:** The root `prepare` hook is no-op to prevent install-time build failures. This two-step approach ensures workspace metadata aligns with `package-lock.json` before any CI/production installs.

### Workspace Naming Constraint

All workspace packages must have unique names across `packages/*/package.json`. Duplicate workspace names cause `EDUPLICATEWORKSPACE` errors during install. If you see this error:

```bash
npm ERR! EDUPLICATEWORKSPACE...
```

Check for duplicate `name` fields:
```bash
grep -r '"name":' packages/*/package.json | sort
```

For skill packages, use: `@fused-gaming/skill-{unique-name}` to prevent conflicts.

---

## Documentation

### Documentation Structure

Documentation is organized under `docs/` in the following subdirectories:

- **`docs/architecture/`** — System design, orchestration, implementation details
- **`docs/guides/`** — Setup instructions, agent handoff, troubleshooting
- **`docs/releases/`** — Release notes, publication guides, version information
- **`docs/analysis/`** — Performance reports, benchmarks, security audits
- **`docs/archive/`** — Historical documentation, session notes, prior releases

Essential files remain in root: `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CLAUDE.md`, `STATUS.md`

### README Updates

When adding features, update relevant documentation:
- `README.md` — High-level overview & feature list
- `docs/architecture/` — System design & implementation details
- `docs/SKILLS_GUIDE.md` — Skill development guide
- `docs/API_REFERENCE.md` — API documentation
- `docs/releases/RELEASE_NOTES.md` — Update with new features

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

## Release & Version Management

### For Contributors

When working on features or fixes that will be released:

1. **Update CHANGELOG.md** (Unreleased section)
   ```markdown
   ## [Unreleased]
   
   ### Added
   - New feature description
   
   ### Fixed
   - Bug fix description
   
   ### Changed
   - Breaking change (if any)
   ```

2. **Update VERSION.json** (if adding/modifying skills)
   - Add new skill entry to `workspaces.skills` array
   - Include skill name, version (usually 1.0.0), and published status
   - Update build number and patch version if releasing

3. **Update Skill Registry** (if creating new skills)
   - Add entry to `VERSION.json` publishedPackages list
   - Use @h4shed scope for published packages: `@h4shed/skill-{name}`
   - Keep internal reference as `@fused-gaming/skill-{name}` in package.json

### Version Bump Validation

Before any version bump, ensure all checks pass:

```bash
npm run lint
npm run typecheck
npm run build
npm test
```

**Important:** All checks must pass before updating VERSION.json. Version bumps are coupled to successful validation to prevent releases with broken builds.

### Release Automation

The publish workflow automatically handles version bumping:

1. **Changed-Package Detection:** CI detects which workspace packages changed using git diff
2. **Auto-Bump:** `scripts/prepare-publish-versions.cjs` patches version numbers for already-published packages (collision avoidance)
3. **Lockfile Sync:** `npm install --package-lock-only --ignore-scripts` aligns package-lock.json with bumped versions
4. **Publish:** GitHub Actions publishes updated packages to npm

You don't need to manually bump versions for changed packages—the automation handles it. However, if you need to manually trigger a version bump for a specific reason, use:

```bash
npm version patch|minor|major --workspace=@fused-gaming/skill-{name}
```

See [docs/releases/NPM_PUBLICATION_CHECKLIST.md](./docs/releases/NPM_PUBLICATION_CHECKLIST.md) for the complete release workflow.

### For Maintainers

Release process:

1. **Tag branches for tracking:**
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

2. **Draft release notes in docs/releases/:**
   - Create `RELEASE_NOTES_v{version}.md` file
   - Document features, fixes, and improvements
   - Include migration notes if breaking changes
   - Add performance metrics and validation results

3. **Update root versions:**
   ```bash
   npm version patch|minor|major
   # Updates package.json and VERSION.json
   ```

4. **Update CHANGELOG:**
   ```markdown
   ## [1.0.0] - 2026-05-16
   
   ### Added
   - New feature X
   
   ### Fixed
   - Bug fix Y
   ```

5. **Tag & push:**
   ```bash
   git push --tags
   ```

6. **GitHub Actions:**
   - `publish.yml` automatically publishes to npm
   - Creates GitHub release with release notes
   - Updates VERSION.json in repository

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
- [ ] Branch uses appropriate prefix (feature/, fix/, hotfix/, docs/)
- [ ] CHANGELOG.md updated (Unreleased section) for code changes
- [ ] VERSION.json updated (if adding/modifying skills)
- [ ] Release notes drafted (if for next release)

### PR Description Template

```markdown
## Description
What does this PR do?

## Changes
- Change 1
- Change 2
- Change 3

## Release Notes (if applicable)
### Added
- New feature description

### Fixed
- Bug fix description

### Changed
- Breaking changes (if any)

## Testing
How was this tested?

## Related Issues
Closes #123
```

### For Release-Ready PRs

Include in description:
- [ ] **Version bump:** patch/minor/major
- [ ] **Skills added/modified:** List any new or updated skills
- [ ] **Breaking changes:** None / Describe changes
- [ ] **Release notes:** Included in PR or linked

### Review Process

1. **Automated checks:**
   - Lint (`npm run lint`)
   - Type check (`npm run typecheck`)
   - Build (`npm run build`)
   - Tests (`npm test`)
   - CodeQL security analysis
   - Socket Security scanning

2. **Maintainer review:**
   - Code quality
   - Documentation completeness
   - Release readiness (if applicable)
   - VERSION.json and CHANGELOG.md alignment

3. **Feedback & iteration**

4. **Approval & merge**

5. **Post-merge (for releases):**
   - Tag creation: `git tag v{version}`
   - GitHub Release creation
   - npm publish (automated)

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
