# Fused Gaming MCP — Execution Checklist & Task Breakdown

**Created:** April 1, 2026  
**Target Completion:** 4 weeks (Week of April 7 → May 2)  
**Owner:** j. (Jesse Lucus)  
**Repos:** Public: `fused-gaming/mcp`, Optional Private: `fused-gaming-mcp-private`

---

## PRE-EXECUTION VALIDATION

### Strategy Alignment
- [ ] Review manifest strategy (confirm monorepo + plugin pattern)
- [ ] Confirm public vs. private skill split
- [ ] Decide on `@fused-gaming` vs. co-branding
- [ ] Align with VLN Security on any shared skills
- [ ] Define "MVP skills" (minimum set for v1.0.0)

### Tools & Permissions
- [ ] Verify GitHub account has org/repo creation capability
- [ ] Confirm npm access token for `@fused-gaming` scope (may need to reserve)
- [ ] Set up GPG signing for commits (optional but recommended)
- [ ] Plan MCP Registry submission (coordinate with Anthropic)

---

## WEEK 1: FOUNDATION (Apr 7–11)

### Day 1: GitHub Repo Setup & Local Init

**Tasks:**

1. **Create GitHub repo**
   - [ ] Create `fused-gaming/mcp` (public, MIT OR Apache 2.0 license)
   - [ ] Clone locally: `git clone https://github.com/fused-gaming/mcp`
   - [ ] Create main branch protection rules (require PR reviews)

2. **Initialize Node project**
   - [ ] `npm init` at root
   - [ ] Install root devDependencies: `typescript`, `eslint`, `prettier`, `@types/node`
   - [ ] Create `tsconfig.json` (shared, base config)
   - [ ] Create `.eslintrc.json`
   - [ ] Create `.prettierrc`

3. **Create workspaces structure**
   - [ ] `mkdir -p packages/core packages/skills packages/cli`
   - [ ] Run `npm init -w packages/core` (private: false)
   - [ ] Run `npm init -w packages/cli`
   - [ ] Update root `package.json` with workspaces config

4. **Add to git**
   - [ ] `git add .`
   - [ ] `git commit -m "chore: initialize monorepo structure"`
   - [ ] `git push origin main`

**Deliverables:**
- Root `package.json` with npm 8 workspaces
- `tsconfig.json`, `.eslintrc.json`
- Clean folder structure ready for packages

---

### Day 2–3: Core Server Implementation

**Tasks:**

1. **Implement `packages/core/`**

   - [ ] Create `packages/core/src/types.ts`
     ```typescript
     export interface ToolDefinition { ... }
     export interface Skill { ... }
     export interface SkillConfig { ... }
     ```

   - [ ] Create `packages/core/src/skill-registry.ts`
     ```typescript
     export class SkillRegistry {
       async loadSkill(skillName: string): Promise<Skill | null>
       registerSkill(skill: Skill): void
       listSkills(): string[]
     }
     ```

   - [ ] Create `packages/core/src/config.ts`
     ```typescript
     export function loadConfig(): FusedGamingConfig
     export function saveConfig(config: FusedGamingConfig): void
     ```

   - [ ] Create `packages/core/src/server.ts` (MCP Server entrypoint)
     ```typescript
     async function main(): Promise<void>
     function registerSkillTools(server, skill): void
     ```

   - [ ] Create `packages/core/package.json`
   - [ ] Create `packages/core/tsconfig.json`

2. **Build & test**
   - [ ] `npm run build --workspace=packages/core`
   - [ ] Verify no TypeScript errors
   - [ ] Create `packages/core/README.md`

**Deliverables:**
- Core MCP server scaffold
- Type definitions + interfaces
- Skill loader + registry
- Configuration management

---

### Day 4: CLI Tool Setup

**Tasks:**

1. **Create `packages/cli/`**
   - [ ] `npm init -w packages/cli`
   - [ ] Install yargs: `npm install yargs --workspace=packages/cli`
   - [ ] Create `packages/cli/src/index.ts` (main CLI entry)
   - [ ] Create `packages/cli/src/init.ts` (generate config)
   - [ ] Create `packages/cli/src/list.ts` (list skills)
   - [ ] Create `packages/cli/src/add.ts` (enable skill)
   - [ ] Create `packages/cli/src/remove.ts` (disable skill)

2. **Add CLI commands**
   - [ ] `fused-gaming-mcp init` → generates `.fused-gaming-mcp.json`
   - [ ] `fused-gaming-mcp list` → shows available + enabled skills
   - [ ] `fused-gaming-mcp add {skill}` → add to enabled list
   - [ ] `fused-gaming-mcp remove {skill}` → remove from enabled list

3. **Add bin entry to `packages/cli/package.json`**
   ```json
   "bin": {
     "fused-gaming-mcp": "./dist/index.js"
   }
   ```

4. **Build & test**
   - [ ] `npm run build --workspace=packages/cli`
   - [ ] Test: `npm exec fused-gaming-mcp -- init`

**Deliverables:**
- Fully functional CLI
- Config generation + management
- Executable via `npm exec fused-gaming-mcp` or `npx @fused-gaming/mcp`

---

### Day 5: CI/CD Workflows

**Tasks:**

1. **Create GitHub Actions workflows**
   - [ ] `.github/workflows/test.yml` (lint + build on PR)
     ```yaml
     name: Test
     on: [pull_request, push]
     jobs:
       test:
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v5
           - uses: actions/setup-node@v5
           - run: npm ci
           - run: npm run lint
           - run: npm run build
           - run: npm run typecheck
     ```

   - [ ] `.github/workflows/publish.yml` (auto-publish on tag)
     ```yaml
     name: Publish
     on:
       push:
         tags:
           - 'v*'
           - 'skill-*'
     jobs:
       publish:
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v5
           - uses: actions/setup-node@v5
           - run: npm ci
           - run: npm run build
           - run: npm publish --workspaces
             env:
               NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
     ```

2. **Add npm scripts to root `package.json`**
   ```json
   "scripts": {
     "build": "npm run build --workspaces",
     "test": "npm run test --workspaces",
     "lint": "eslint . --ext .ts",
     "typecheck": "tsc --noEmit"
   }
   ```

3. **Test locally**
   - [ ] `npm run lint`
   - [ ] `npm run build`
   - [ ] `npm run typecheck`

4. **Add GitHub secrets**
   - [ ] Create/configure `NPM_TOKEN` secret in repo settings

**Deliverables:**
- Automated linting + build checks on PR
- Auto-publish to npm on version tag
- Clean CI/CD pipeline

---

## WEEK 2: SKILL MIGRATION (Apr 14–18)

### Day 1–2: Skill Package Template

**Tasks:**

1. **Create template skill: `packages/skills/algorithmic-art/`**
   - [ ] `npm init -w packages/skills/algorithmic-art`
   - [ ] Create `src/index.ts` → exports Skill
   - [ ] Create `src/tools/generate-art.ts` → sample tool
   - [ ] Create `SKILL.md` (copy from TrystPilot/skills reference)
   - [ ] Create `package.json` with name `@fused-gaming/skill-algorithmic-art`
   - [ ] Create `README.md` with usage example
   - [ ] Create `tsconfig.json`

2. **Example skill implementation**
   ```typescript
   // src/index.ts
   export const algorithmicArtSkill: Skill = {
     name: "algorithmic-art",
     version: "1.0.0",
     description: "Generative art using p5.js with seeded randomness...",
     tools: [generateArtTool],
     async initialize(config) { ... }
   }
   ```

3. **Build + test**
   - [ ] `npm run build --workspace=packages/skills/algorithmic-art`
   - [ ] Verify exports work: `node -e "import(...).then(m => console.log(m.algorithmicArtSkill))"`

**Deliverables:**
- Template skill structure
- First working skill package
- Pattern for remaining skills

---

### Day 3–5: Bulk Skill Migration

For each of these 12 skills, repeat the process:

**Skills to migrate (priority order):**

1. ✅ **algorithmic-art** (Day 1–2, done above)
2. **ascii-mockup** (Day 3)
3. **canvas-design** (Day 3)
4. **frontend-design** (Day 4)
5. **theme-factory** (Day 4)
6. **mcp-builder** (Day 5)
7. **pre-deploy-validator** (Day 5)
8. **skill-creator** (Day 5)
9. **web-artifacts-builder** (optional, Week 2–3)
10. **webapp-testing** (optional, Week 2–3)
11. **brand-guidelines** (optional, Week 2–3)
12. **doc-coauthoring** (optional, Week 2–3)
13. **internal-comms** (optional, Week 2–3)

**Per skill:**
- [ ] Create folder: `packages/skills/{skill}/`
- [ ] Copy `SKILL.md` from TrystPilot/skills
- [ ] Implement Skill interface in `src/index.ts`
- [ ] Create tools (adapt Claude instructions → MCP tools)
- [ ] Create `package.json` with `@fused-gaming/skill-{name}`
- [ ] Create `README.md`
- [ ] Build: `npm run build --workspace=packages/skills/{skill}`
- [ ] Test import/export
- [ ] Commit: `git commit -m "feat: add {skill} to monorepo"`

**Note:** Don't need full tool implementations yet — focus on structure + exports. Tools can be scaffolded with `// TODO: implement` placeholders.

**Deliverables by end of Week 2:**
- [ ] 8 core skills migrated (algorithmic-art through skill-creator)
- [ ] All skills follow same structure
- [ ] All build without errors
- [ ] Root config updated with all skill names

---

## WEEK 3: TOOLING & DOCUMENTATION (Apr 21–25)

### Day 1–2: Implement Skill Tools

**Tasks:**

For the 8 migrated skills, flesh out **tool implementations**:

1. Pick **3 "hero" skills** (most important):
   - algorithmic-art
   - mcp-builder
   - frontend-design

2. For each hero skill:
   - [ ] Implement 2–3 primary tools (full implementation)
   - [ ] Add input/output schemas (Zod)
   - [ ] Add error handling
   - [ ] Create simple test file (e.g., `src/tools/__tests__/generate-art.test.ts`)
   - [ ] Build + test

3. For remaining 5 skills:
   - [ ] Implement skeleton tools (placeholder implementations)
   - [ ] Add schemas
   - [ ] Create `TODO.md` tracking what needs finishing

**Deliverables:**
- 3 fully-implemented hero skills with tests
- 5 skills with skeleton tools (ready for future PRs)

---

### Day 3–5: Documentation

**Tasks:**

1. **Root `README.md`** (main landing page)
   - [ ] Project overview + badges
   - [ ] Installation instructions
   - [ ] Quick start guide
   - [ ] Skills table (with status: ✅, 🟡, 📝)
   - [ ] Architecture overview
   - [ ] Contributing guide link
   - [ ] License

2. **`docs/ARCHITECTURE.md`** (system design)
   - [ ] Monorepo structure diagram
   - [ ] Skill loader + registry flow
   - [ ] Configuration system
   - [ ] MCP server initialization
   - [ ] Deployment architecture

3. **`docs/SKILLS_GUIDE.md`** (create new skills)
   - [ ] Step-by-step: create a skill
   - [ ] Skill interface + types
   - [ ] Tool definition format
   - [ ] Package.json requirements
   - [ ] Example: "Create a custom weather skill"

4. **`docs/API_REFERENCE.md`** (technical reference)
   - [ ] Core types (Skill, ToolDefinition, etc.)
   - [ ] SkillRegistry API
   - [ ] Config file schema
   - [ ] CLI commands
   - [ ] Code examples

5. **`docs/EXAMPLES.md`** (real-world usage)
   - [ ] "Use algorithmic-art in Claude.ai"
   - [ ] "Add custom internal skill"
   - [ ] "Integrate with Claude API"
   - [ ] "Extend with private skills"

6. **`CONTRIBUTING.md`**
   - [ ] Code style (ESLint, Prettier)
   - [ ] PR process
   - [ ] Skill review checklist
   - [ ] Release process

7. **`CHANGELOG.md`**
   - [ ] Version 1.0.0 notes
   - [ ] Skills included
   - [ ] Known limitations

**Deliverables:**
- Professional documentation
- Multiple entry points for different audiences
- Clear contribution pathway

---

## WEEK 4: LAUNCH (Apr 28–May 2)

### Day 1: Final Polish

**Tasks:**

1. **Code cleanup**
   - [ ] Run full lint: `npm run lint`
   - [ ] Run full build: `npm run build`
   - [ ] Run full typecheck: `npm run typecheck`
   - [ ] Fix any warnings/errors

2. **Test installation flow**
   - [ ] Delete `node_modules` + `dist/`
   - [ ] `npm clean-install`
   - [ ] `npm run build`
   - [ ] Try: `npm exec fused-gaming-mcp -- init`
   - [ ] Try: `npm exec fused-gaming-mcp -- list`

3. **Review all files**
   - [ ] LICENSE file (Apache 2.0)
   - [ ] `.gitignore` (ignore `dist/`, `node_modules/`, `*.log`)
   - [ ] Root `package.json` metadata complete
   - [ ] All package.json files have correct `@fused-gaming/*` names

**Deliverables:**
- Production-ready codebase
- No build warnings
- Clean CI checks passing

---

### Day 2: npm Publishing Prep

**Tasks:**

1. **Configure npm scope**
   - [ ] Create npm organization: `npm org create fused-gaming`
   - [ ] Or: publish under personal scope + later migrate
   - [ ] Add npm token to GitHub Actions

2. **Dry-run publish**
   - [ ] `npm publish --dry-run --workspace=packages/core`
   - [ ] Verify core package will publish correctly
   - [ ] Check: metadata, README, files included

3. **Create version tag**
   - [ ] Update root `package.json` version to `1.0.0`
   - [ ] Update all `packages/*/package.json` to `1.0.0`
   - [ ] Update `CHANGELOG.md`
   - [ ] `git commit -m "chore: release v1.0.0"`
   - [ ] `git tag v1.0.0`
   - [ ] `git push origin main --tags`

4. **GitHub Actions publishes**
   - [ ] Wait for `publish.yml` workflow to complete
   - [ ] Verify on npm: `npm view @fused-gaming/mcp`

**Deliverables:**
- All packages published to npm
- Publicly accessible at `npm.com`
- Installation working: `npm install @fused-gaming/mcp`

---

### Day 3: GitHub & Social Setup

**Tasks:**

1. **GitHub repo optimization**
   - [ ] Add repo topics: `mcp`, `skills`, `claude`, `gaming`, `ai`
   - [ ] Set repo description
   - [ ] Add social preview image (optional)
   - [ ] Create GitHub Discussion board (optional)

2. **MCP Registry submission** (optional but recommended)
   - [ ] Prepare metadata (name, description, homepage, repo)
   - [ ] Submit PR to [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers)
   - [ ] List entry format: `name: @fused-gaming/mcp`, `description: ...`, `github: fused-gaming/mcp`

3. **Announcements**
   - [ ] Post in relevant communities (dev forums, Reddit, Discord)
   - [ ] Mention Fused Gaming + VLN Security as power users
   - [ ] Link to GitHub + npm
   - [ ] Invite contributions

**Deliverables:**
- Public GitHub project fully set up
- Listed on MCP Registry (if approved)
- Community awareness

---

### Day 4–5: Post-Launch & Iteration

**Tasks:**

1. **Gather feedback**
   - [ ] Monitor GitHub Issues for bug reports
   - [ ] Respond to early adopters
   - [ ] Track usage (analytics on npm downloads)

2. **Plan next phase**
   - [ ] Schedule skill improvements (Week 5+)
   - [ ] Document community contribution process
   - [ ] Create roadmap (public or internal)

3. **Private skills setup** (for you)
   - [ ] Create `fused-gaming-mcp-private` repo (optional, can be branch)
   - [ ] Set up private skill structure
   - [ ] Add internal VLN/Fused Gaming skills
   - [ ] Configure your personal `.fused-gaming-mcp.json`

**Deliverables:**
- Public launch complete
- Community feedback loop established
- Private customization layer ready

---

## OPTIONAL: POST-LAUNCH (Week 5+)

- [ ] Port remaining skills (web-artifacts-builder, webapp-testing, etc.)
- [ ] Create skill marketplace/registry UI (optional)
- [ ] Build community examples repo
- [ ] Add CI integration (Slack notifications, Discord bot, etc.)
- [ ] Collaborate with VLN Security on `@vln-security` branded skills
- [ ] Integrate with Claude Code marketplace

---

## DEPENDENCY MATRIX

| Task | Depends On | Blocks |
|------|-----------|--------|
| Root setup | None | Everything |
| Core server | Root | CLI, skills |
| CLI | Core | Testing |
| Skills | Core | Publishing |
| Docs | Skills + CLI | Launch |
| CI/CD | Root | Publishing |
| Publishing | Core + Skills + CI/CD | Launch |

---

## TIME ESTIMATES (Total: ~80 hours)

- **Week 1:** 20 hours (foundation)
- **Week 2:** 20 hours (skill migration)
- **Week 3:** 25 hours (tools + docs)
- **Week 4:** 15 hours (launch + polish)

**Can be accelerated:** Combine weeks 1–2, parallelize skill migration.

---

## Success Criteria Checklist

### Infrastructure
- [ ] Monorepo with npm workspaces
- [ ] Core MCP server working
- [ ] Skill registry + loader functional
- [ ] CLI tool deployable
- [ ] CI/CD passing on all PRs

### Content
- [ ] 8+ skills migrated
- [ ] 3 skills fully implemented
- [ ] Comprehensive documentation
- [ ] Contributing guide
- [ ] Examples + use cases

### Publishing
- [ ] Published to npm (`@fused-gaming/*`)
- [ ] Listed on MCP Registry
- [ ] Installation works: `npm install @fused-gaming/mcp`
- [ ] GitHub Actions auto-publish working
- [ ] Community feedback loop open

### Personal (Private Layer)
- [ ] Private skills repo ready
- [ ] Can load internal tools without publishing
- [ ] Configuration merging working

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Skill migration slow | Pre-build skill templates, parallelize, accept v1 with placeholders |
| npm scope conflicts | Test scope early (Day 1), have backup names |
| CI/CD failures | Set up locally first, test publish dry-run |
| Community confusion | Clear README + multi-entry-point docs |
| Breaking changes | Strict semver, deprecation warnings, changelog |

---

## Next Action

**Start Week 1, Day 1:**

```bash
cd /path/to/workspace
git clone https://github.com/fused-gaming/mcp
cd mcp
npm init
# Follow "Day 1" tasks above
```

**Questions before starting?**

1. Confirm npm scope: `@fused-gaming` or alternative?
2. Private skills repo: separate GitHub repo or branch?
3. VLN Security skills: co-branded or separate?
4. Timeline: strict 4 weeks or flexible?
5. Help needed: solo build or pair with someone?

---

**Prepared by:** Claude  
**Date:** April 1, 2026  
**Status:** Ready to execute ✅
