# Branch-Skill Validation Examples

This document shows real examples of how the validation script works in different scenarios.

## Example 1: Valid Branch - Skill Name Matches (Passing)

**Scenario**: Feature branch for LinkedIn Master Journalist skill with matching changes

```bash
$ git checkout -b feat/linkedin-master-journalist
$ npm run build --workspace=packages/skills/linkedin-master-journalist
$ git add packages/skills/linkedin-master-journalist
$ git commit -m "feat(limj): Add hashtag verification tool"
$ node scripts/validate-branch-skill-match.cjs
```

**Output**:
```
📋 Validating branch: feat/linkedin-master-journalist
🎯 Skills modified: linkedin-master-journalist
✓ Branch skill "linkedin-master-journalist" matches changed files

🔍 Validation Summary:
   ✓ Skill validation source: BRANCH
   ✓ Skill: linkedin-master-journalist
✓ Validation passed
```

## Example 2: Non-Conventional Branch + Proper Tag (Passing)

**Scenario**: Branch doesn't follow naming convention but is tagged with skill version

```bash
$ git checkout -b improve-theme-factory
$ npm run build --workspace=packages/skills/theme-factory
$ git add packages/skills/theme-factory
$ git commit -m "Improve color system"
$ git tag skill-theme-factory@2.2.0
$ node scripts/validate-branch-skill-match.cjs
```

**Output**:
```
📋 Validating branch: improve-theme-factory
⚠️  Warning: Branch name "improve-theme-factory" doesn't follow conventions
   Expected format: feat/skill-name, skill/skill-name, etc.
   OR tag changes with: git tag skill-skill-name@X.Y.Z
🎯 Skills modified: theme-factory
✓ Branch changes validated via tag: skill-theme-factory@2.2.0 (skill: theme-factory)
⚠️  Tip: Consider renaming branch to feat/theme-factory for clarity

🔍 Validation Summary:
   ✓ Skill validation source: TAG
   ✓ Skill: theme-factory
✓ Validation passed
```

## Example 3: Branch-Skill Mismatch (Failing)

**Scenario**: Branch claims one skill but changes another skill

```bash
$ git checkout -b feat/linkedin-master-journalist
$ npm run build --workspace=packages/skills/theme-factory
$ git add packages/skills/theme-factory
$ git commit -m "Add colors to wrong skill"
$ node scripts/validate-branch-skill-match.cjs
```

**Output**:
```
📋 Validating branch: feat/linkedin-master-journalist
🎯 Skills modified: theme-factory
❌ Branch skill mismatch!
   Branch claims: "linkedin-master-journalist"
   Actually changed: theme-factory
   No matching tags found (format: skill-{name}@X.Y.Z)
❌ Validation failed
```

**Resolution**:
- Option 1: Move changes to correct branch `feat/theme-factory`
- Option 2: Tag with correct skill `git tag skill-theme-factory@X.Y.Z`

## Example 4: Documentation Changes Only (Passing)

**Scenario**: Documentation branch that touches multiple skills

```bash
$ git checkout -b docs/update-readme
$ echo "Updated documentation" >> README.md
$ git add README.md docs/
$ git commit -m "docs: Update project documentation"
$ node scripts/validate-branch-skill-match.cjs
```

**Output**:
```
📋 Validating branch: docs/update-readme
🎯 Skills modified: none

📝 Non-skill changes (allowed):
   - README.md
   - docs/skills/LIMJ.md
   - docs/ROADMAP.md

🔍 Validation Summary:
   ✓ No skill changes detected (docs/config branch OK)
✓ Validation passed
```

## Example 5: Multiple Skills (Warning but Passing)

**Scenario**: Feature branch changes multiple related skills

```bash
$ git checkout -b feat/linkedin-master-journalist
$ npm run build --workspace=packages/skills/linkedin-master-journalist
$ npm run build --workspace=packages/cli  # CLI also updated for LIMJ
$ git add packages/skills/linkedin-master-journalist packages/cli
$ git commit -m "feat: Add LIMJ and update CLI"
$ node scripts/validate-branch-skill-match.cjs
```

**Output**:
```
📋 Validating branch: feat/linkedin-master-journalist
🎯 Skills modified: linkedin-master-journalist
✓ Branch skill "linkedin-master-journalist" matches changed files
⚠️  Warning: Changes also affect other skills: cli
   Consider splitting changes into separate branches

🔍 Validation Summary:
   ✓ Skill validation source: BRANCH
   ✓ Skill: linkedin-master-journalist
✓ Validation passed (but with warnings)
```

## Example 6: Untagged Non-Conventional Branch (Failing)

**Scenario**: Branch doesn't follow naming convention and has no tag

```bash
$ git checkout -b my-changes
$ npm run build --workspace=packages/skills/theme-factory
$ git add packages/skills/theme-factory
$ git commit -m "Update theme"
$ node scripts/validate-branch-skill-match.cjs
```

**Output**:
```
📋 Validating branch: my-changes
⚠️  Warning: Branch name "my-changes" doesn't follow conventions
   Expected format: feat/skill-name, skill/skill-name, etc.
   OR tag changes with: git tag skill-skill-name@X.Y.Z
📁 Changed files: 25
🎯 Skills modified: theme-factory
⚠️  Skills changed but branch doesn't specify skill in name
   Changed skills: theme-factory
   To validate without branch naming: git tag skill-theme-factory@X.Y.Z

🔍 Validation Summary:
   ⚠️  No skill validation performed
✓ Validation passed (but unvalidated)
```

**Recommendation**: Tag with skill version or rename branch for proper validation

## Running the Validator

### Manual Validation
```bash
# Check current branch
node scripts/validate-branch-skill-match.cjs

# Check different branch
git checkout feat/linkedin-master-journalist
node scripts/validate-branch-skill-match.cjs
```

### Automatic (In CI)
The validation runs automatically:
- On every push to feature branches
- On every PR to main/develop
- On every merge to main/develop

### Pre-Commit Hook (Optional)
To enable pre-commit validation:
```bash
# Add to .git/hooks/pre-commit
#!/bin/sh
node scripts/validate-branch-skill-match.cjs
```

## Summary

| Scenario | Branch Name | Changes | Tag | Result |
|----------|------------|---------|-----|--------|
| Clean skill feature | `feat/skill-name` | Matches | Optional | ✓ PASS |
| Non-conventional + tagged | Any name | Matches | `skill-*@*.*.*` | ✓ PASS |
| Skill mismatch | `feat/skill-a` | skill-b | None | ❌ FAIL |
| Docs only | `docs/*` | docs/ | Optional | ✓ PASS |
| Multiple skills | `feat/skill-a` | skill-a + other | None | ⚠️ WARN |
| Unvalidated | Any name | Any skill | None | ⚠️ UNVALIDATED |

---

**Key Takeaway**: Either use proper branch naming OR tag your changes. Doing both is recommended for clarity.
