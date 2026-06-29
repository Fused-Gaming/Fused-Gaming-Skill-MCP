# Feature Branch Template: Milestone 14 Sections

Use this template when starting a new section of Milestone 14.

---

## Branch Naming Convention

```
claude/milestone-14-section-<N>-<description>-<random-id>

Examples:
- claude/milestone-14-section-2-branch-workflow-x9k2m
- claude/milestone-14-section-6-visual-panel-a7b3c
```

---

## Branch Setup Checklist

- [ ] Create branch from `main`
- [ ] Add section number to branch name
- [ ] Assign lead agent (architect, coder, etc.)
- [ ] Create GitHub issue: "Section N: [Title]" with section checklist
- [ ] Link issue to Milestone #14
- [ ] Add label: `section-<N>` + `milestone-14`

---

## Development Workflow

### 1. Plan (Days 1–2)
- [ ] Read milestone section description (from `docs/MILESTONE-14-DELIVERY.md`)
- [ ] Define package(s) to create:
  - [ ] Free package: `@h4shed/syncpulse-<name>`
  - [ ] Paid package (if applicable): `@h4shed/syncpulse-<name>-advanced`
- [ ] Write ADR or architecture doc (if significant decision)
- [ ] Create package.json for each new workspace package
- [ ] Estimate effort (use this template for parallel work)

### 2. Implement (Days 2–6)
- [ ] Create src/ directory structure
- [ ] Write code + tests (test as you go)
- [ ] Ensure modular: depends only on free packages or declared dependencies
- [ ] TypeScript: `npm run typecheck` passes
- [ ] Linting: `npm run lint` passes
- [ ] Build: `npm run build` succeeds
- [ ] Tests: `npm test --workspaces --if-present` passes

### 3. Document (Days 6–7)
- [ ] Write package README.md (Installation, Development, License)
- [ ] Update docs/MILESTONE-14-DELIVERY.md with completion %
- [ ] Add CHANGELOG.md entry under "Unreleased":
  ```markdown
  ### Added
  - **Section N: [Title]** — [2–3 sentence summary]
    - [Feature 1]
    - [Feature 2]
  ```
- [ ] Update VERSION.json: `metadata.buildNumber++`
- [ ] Link Queen licensing: mark free/paid status

### 4. Review & Test (Days 7)
- [ ] All CI checks pass (lint, typecheck, build, test)
- [ ] Manual testing of feature
- [ ] Code review (PR comments addressed)
- [ ] Modular validation: dependencies correct
- [ ] Queen licensing verified

### 5. Release (Day 7)
- [ ] Merge PR to main
- [ ] Git tag: (handled by release-coordinator)
- [ ] npm publish: (handled by CI)
- [ ] Queen registration: (handled by queen-integration-lead)

---

## File Structure Template

```
packages/skills/syncpulse-<section-name>/
├── package.json
├── tsconfig.json
├── README.md
├── LICENSE
├── src/
│   ├── index.ts
│   ├── types.ts
│   ├── <feature>.ts
│   └── __tests__/
│       └── <feature>.test.ts
├── docs/
│   └── <section-name>.md
└── .npmignore
```

### package.json Template
```json
{
  "name": "@h4shed/syncpulse-<section-name>",
  "version": "1.0.0",
  "description": "[Section N description]",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "echo 'No tests yet'",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@h4shed/syncpulse-core": "^1.0.0",
    "@h4shed/syncpulse-queen-client": "^1.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.2"
  },
  "license": "MIT"
}
```

---

## Queen Licensing Mapping

Before merging, confirm licensing tier:

### Free Tier Package
```json
{
  "tier": "free",
  "packages": ["@h4shed/syncpulse-<name>"],
  "use_rights": ["non-commercial", "commercial"],
  "max_package_version": "1.0.0"
}
```

### Team/Paid Tier Package
```json
{
  "tier": "team",
  "packages": ["@h4shed/syncpulse-<name>-advanced"],
  "use_rights": ["commercial"],
  "requires_license": true,
  "max_package_version": "1.0.0"
}
```

Update `docs/QUEEN-SYNCPULSE-LICENSING.md` with your package mapping.

---

## PR Checklist

Before submitting PR:

- [ ] Branch name follows convention: `claude/milestone-14-section-*`
- [ ] GitHub issue linked (e.g., "Fixes #999")
- [ ] Title: "Section N: [Title]" (e.g., "Section 6: Visual Control Panel")
- [ ] Description includes:
  - [ ] Summary of work done
  - [ ] New packages created (with tier: free/paid)
  - [ ] Dependencies (avoid circular, prefer base packages)
  - [ ] Queen licensing mapped
  - [ ] CHANGELOG.md entry added
- [ ] All CI checks passing
- [ ] Manual testing completed (screenshot or video if UI)
- [ ] Code review addressed
- [ ] Modular validation: no tight coupling

---

## Example: Section 2 (Feature Branch-Centric Workflow)

### Branch
```
claude/milestone-14-section-2-branch-workflow-a7k9x
```

### Issue
```
Title: Section 2: Feature Branch-Centric Workflow
Description:
- [ ] Branch environment manager CLI
- [ ] Environment isolation layer
- [ ] Diff viewer (free basic + paid advanced)
- [ ] Tests & docs
Assigned: coder-branch-workflow
Label: section-2, milestone-14
```

### Packages Created
- `@h4shed/syncpulse-branch-manager` (free)
- `@h4shed/syncpulse-branch-diff` (paid/team)

### Changelog Entry
```markdown
### Added
- **Section 2: Feature Branch-Centric Workflow** — Branch-scoped environments and visualization
  - Branch environment manager with CLI and UI
  - Environment isolation per branch (dev/staging/prod)
  - Basic diff viewer (free), advanced merge validation (team tier)
```

### Queen Licensing
```
@h4shed/syncpulse-branch-manager:
  - tier: free
  - licenses: [free, team, enterprise]

@h4shed/syncpulse-branch-diff:
  - tier: team
  - requires_license: team_or_higher
```

---

## Tips for Success

✅ **Keep it modular**: One section = 1–2 packages. No God objects.  
✅ **Test as you go**: Don't wait until end of week to test.  
✅ **Communicate**: Update milestone dashboard with daily progress.  
✅ **Reuse free packages**: All sections depend on @h4shed/syncpulse-core and -queen-client.  
✅ **Document early**: Write README + docs while coding.  
✅ **Review often**: Get code reviews on days 3–4, not day 7.  
✅ **Release on schedule**: Hit the 4-week v1.4.0 target to keep momentum.

---

## Troubleshooting

**Q: Circular dependency between packages?**  
A: Refactor into a shared base package. Use @h4shed/syncpulse-core.

**Q: My section is blocked on another section?**  
A: Communicate with release-coordinator and architect. May need dependency injection or async work.

**Q: How do I know if my feature is "paid" tier?**  
A: Refer to `docs/QUEEN-SYNCPULSE-LICENSING.md`. If it's premium/advanced capability (RBAC, graph, deployment), likely paid. If it's core infrastructure, likely free.

**Q: Can I defer tests to next sprint?**  
A: No. Tests are required for CI gate. Write them inline or use simple `echo 'No tests yet'` scripts if prototyping.

---

*Template v1.0 — Created 2026-06-29*  
*Milestone 14 Swarm Orchestration*
