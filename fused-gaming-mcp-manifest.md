# Fused Gaming MCP — Manifest & Implementation Prompt

**Status:** Ready for scaffolding  
**Target:** Transform TrystPilot/skills contributions into `@fused-gaming/mcp` ecosystem  
**Scope:** Claude skills → modular npm packages + scalable MCP server  
**Audience:** Open-source consumers + internal (VLN/Fused Gaming) power users

---

## Phase 0: Strategic Context

You have curated a portfolio of **Claude skills from TrystPilot/skills** (Anthropic's official skills repository). These are **Claude skill definitions** (SKILL.md-based instructions for Claude), not traditional MCP tools.

**Your goal:** Package these skills as:

1. **A reusable npm package** (`@fused-gaming/mcp`) that anyone can install
2. **A Claude-compatible skill loader** that bootstraps an MCP server and auto-registers skills
3. **A modular system** where each skill is independently versioned and maintainable
4. **A personal customization layer** where you can keep proprietary/internal skills private while contributing public ones
5. **Scalable architecture** that grows without refactoring

---

## Phase 1: Repository Structure

Create a new **public GitHub repository** (separate from TrystPilot/skills):

```
fused-gaming-mcp/
├── .github/
│   └── workflows/
│       ├── publish.yml                    # npm publish on tag
│       ├── test.yml                       # lint + build checks
│       └── mcp-registry.yml                # auto-submit to MCP registry
│
├── packages/
│   ├── core/                              # Main MCP server + skill loader
│   │   ├── src/
│   │   │   ├── server.ts                  # MCP server entry point
│   │   │   ├── skill-registry.ts          # Dynamic skill loading
│   │   │   ├── config.ts                  # Config management
│   │   │   └── types.ts                   # Shared types
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── skills/                            # Individual skill packages
│   │   ├── algorithmic-art/
│   │   │   ├── src/index.ts               # Exports Skill interface
│   │   │   ├── SKILL.md                   # Original Claude skill definition
│   │   │   ├── package.json               # @fused-gaming/skill-algorithmic-art
│   │   │   └── README.md
│   │   ├── ascii-mockup/
│   │   ├── canvas-design/
│   │   ├── frontend-design/
│   │   ├── theme-factory/
│   │   ├── mcp-builder/
│   │   ├── pre-deploy-validator/
│   │   ├── skill-creator/
│   │   ├── web-artifacts-builder/
│   │   ├── webapp-testing/
│   │   ├── brand-guidelines/
│   │   ├── doc-coauthoring/
│   │   └── internal-comms/
│   │
│   └── cli/                               # Installation & config CLI
│       ├── src/
│       │   ├── index.ts                   # CLI entrypoint
│       │   ├── install.ts                 # Skill installer
│       │   ├── list.ts                    # List available skills
│       │   └── init.ts                    # Generate .fused-gaming-mcp.json
│       ├── package.json
│       └── README.md
│
├── docs/
│   ├── ARCHITECTURE.md                   # System design
│   ├── SKILLS_GUIDE.md                   # How to create new skills
│   ├── API_REFERENCE.md                  # Core + skill interfaces
│   └── EXAMPLES.md                       # Real-world usage examples
│
├── examples/
│   ├── custom-skill/                     # Template: how to add skills
│   └── integration-guide/
│
├── spec/
│   └── skill-schema.json                 # JSON schema for skill definition
│
├── .fused-gaming-mcp.json                # Root config (example)
├── package.json                          # Root workspace config (npm 8+ workspaces)
├── tsconfig.json                         # Shared TypeScript config
├── .eslintrc.json
├── .gitignore
├── LICENSE                               # Apache 2.0
├── README.md
└── CHANGELOG.md
```

---

## Phase 2: Core Implementation

### 2.1 Root `package.json` (Monorepo Workspace)

```json
{
  "name": "@fused-gaming/mcp",
  "version": "1.0.0",
  "description": "Modular MCP server with scalable Claude skills for Fused Gaming and VLN Security",
  "type": "module",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/fused-gaming/mcp"
  },
  "workspaces": [
    "packages/core",
    "packages/skills/*",
    "packages/cli"
  ],
  "scripts": {
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "dev": "npm run dev --workspace=packages/core"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0"
  }
}
```

### 2.2 Core Server (`packages/core/src/server.ts`)

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SkillRegistry } from "./skill-registry.js";
import type { Skill } from "./types.js";

const skillRegistry = new SkillRegistry();

async function main() {
  const server = new Server({
    name: "fused-gaming-mcp",
    version: "1.0.0",
  });

  // Load skills from config or default set
  const config = loadConfig();
  const enabledSkills = config.skills.enabled || [
    "algorithmic-art",
    "ascii-mockup",
    "canvas-design",
  ];

  // Dynamically register skills
  for (const skillName of enabledSkills) {
    const skill = await skillRegistry.loadSkill(skillName);
    if (skill) {
      await skill.initialize({ apiKeys: config.auth });
      registerSkillTools(server, skill);
    }
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

function registerSkillTools(server: Server, skill: Skill) {
  // Register all tools from skill
  skill.tools.forEach((tool) => {
    server.registerTool(tool);
  });
}

main().catch(console.error);
```

### 2.3 Skill Interface (`packages/core/src/types.ts`)

```typescript
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
  handler: (input: unknown) => Promise<string | object>;
}

export interface SkillConfig {
  apiKeys?: Record<string, string>;
  [key: string]: unknown;
}

export interface Skill {
  name: string;
  version: string;
  description: string;
  tools: ToolDefinition[];
  initialize(config: SkillConfig): Promise<void>;
}
```

### 2.4 Skill Loader (`packages/core/src/skill-registry.ts`)

```typescript
import type { Skill } from "./types.js";

export class SkillRegistry {
  private skills = new Map<string, Skill>();
  private loaded = new Set<string>();

  async loadSkill(skillName: string): Promise<Skill | null> {
    if (this.loaded.has(skillName)) {
      return this.skills.get(skillName) || null;
    }

    try {
      // Dynamic import: @fused-gaming/skill-{skillName}
      const module = await import(`@fused-gaming/skill-${skillName}`);
      const skill: Skill = module.default || module.skill;

      this.skills.set(skillName, skill);
      this.loaded.add(skillName);
      return skill;
    } catch (error) {
      console.error(`Failed to load skill: ${skillName}`, error);
      return null;
    }
  }

  registerSkill(skill: Skill) {
    this.skills.set(skill.name, skill);
  }

  listSkills(): string[] {
    return Array.from(this.skills.keys());
  }
}
```

---

## Phase 3: Convert Skills → Modular Packages

For **each** Claude skill in TrystPilot/skills, create a new package:

### 3.1 Skill Package Template (`packages/skills/{skill-name}/`)

```
packages/skills/algorithmic-art/
├── src/
│   ├── index.ts                    # Exports Skill interface
│   ├── tools/
│   │   ├── generate-art.ts         # Tool implementation
│   │   └── index.ts                # Tool registry
│   └── types.ts                    # Skill-specific types
├── SKILL.md                        # Original Claude skill (reference)
├── package.json
├── tsconfig.json
└── README.md
```

### 3.2 Example Skill Export (`packages/skills/algorithmic-art/src/index.ts`)

```typescript
import type { Skill, ToolDefinition } from "@fused-gaming/mcp-core";
import { generateArtTool } from "./tools/generate-art.js";

export const algorithmicArtSkill: Skill = {
  name: "algorithmic-art",
  version: "1.0.0",
  description:
    "Generative art using p5.js with seeded randomness, flow fields, and particle systems",
  tools: [generateArtTool],
  async initialize(config) {
    // Any setup (API keys, etc.)
    console.log("Algorithmic Art skill initialized");
  },
};

export default algorithmicArtSkill;
```

### 3.3 Skill Package `package.json`

```json
{
  "name": "@fused-gaming/skill-algorithmic-art",
  "version": "1.0.0",
  "description": "Algorithmic art skill for Fused Gaming MCP",
  "type": "module",
  "main": "./dist/index.js",
  "exports": {
    ".": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@fused-gaming/mcp-core": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## Phase 4: CLI Tool

Create `packages/cli/` for easy installation and config:

```typescript
// packages/cli/src/index.ts
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { initConfig } from "./init.js";
import { listSkills } from "./list.js";

yargs(hideBin(process.argv))
  .command(
    "init",
    "Generate .fused-gaming-mcp.json config file",
    {},
    initConfig
  )
  .command(
    "list",
    "List available skills",
    {},
    listSkills
  )
  .command(
    "add <skill>",
    "Enable a skill in config",
    (yargs) =>
      yargs.positional("skill", {
        describe: "Skill name to add",
        type: "string",
      }),
    (argv) => addSkill(argv.skill as string)
  )
  .command(
    "remove <skill>",
    "Disable a skill in config",
    (yargs) =>
      yargs.positional("skill", {
        describe: "Skill name to remove",
        type: "string",
      }),
    (argv) => removeSkill(argv.skill as string)
  )
  .strictCommands()
  .demandCommand(1)
  .parse();
```

---

## Phase 5: Configuration

### 5.1 `.fused-gaming-mcp.json` (root example)

```json
{
  "server": {
    "name": "fused-gaming-mcp",
    "version": "1.0.0",
    "transport": "stdio",
    "port": 3000
  },
  "skills": {
    "enabled": [
      "algorithmic-art",
      "ascii-mockup",
      "canvas-design",
      "frontend-design",
      "theme-factory",
      "mcp-builder",
      "pre-deploy-validator",
      "skill-creator",
      "web-artifacts-builder",
      "webapp-testing",
      "brand-guidelines",
      "doc-coauthoring",
      "internal-comms"
    ],
    "disabled": [],
    "custom": []
  },
  "auth": {
    "apiKeys": {}
  },
  "logging": {
    "level": "info"
  }
}
```

### 5.2 Private Overlay (your personal use)

Create a **separate private repo** (or branch):

```
fused-gaming-mcp-private/
├── .claude-mcp.config.json         # Your personal config
├── skills/
│   ├── internal-tools/             # Proprietary VLN skills
│   ├── custom-overrides/           # Your tweaked versions
│   └── personal-utils/
└── README.md
```

In your personal `.claude-mcp.config.json`:

```json
{
  "skills": {
    "enabled": [
      "@fused-gaming/skill-algorithmic-art",
      "@fused-gaming/skill-mcp-builder",
      "./skills/internal-tools",
      "./skills/custom-overrides"
    ]
  }
}
```

---

## Phase 6: Publishing Strategy

### 6.1 NPM Scope & Versioning

All skills published under `@fused-gaming` scope:

- `@fused-gaming/mcp` (v1.0.0) — main package + CLI
- `@fused-gaming/mcp-core` (v1.0.0) — core server + types
- `@fused-gaming/skill-{name}` (v1.0.0) — individual skills

**Semantic versioning:**
- Core: patch for bug fixes, minor for new features, major for breaking changes
- Skills: independent versions. Update only when skill changes.

### 6.2 GitHub Actions: Publish Workflow

```yaml
# .github/workflows/publish.yml
name: Publish to npm

on:
  push:
    tags:
      - "v*"
      - "skill-*"

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 18
          registry-url: https://registry.npmjs.org
      - run: npm ci
      - run: npm run build
      - run: npm publish --workspaces
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 6.3 MCP Registry Submission

After publishing, auto-submit to [MCP Registry](https://github.com/modelcontextprotocol/servers):

```yaml
# .github/workflows/mcp-registry.yml
name: Submit to MCP Registry

on:
  push:
    tags:
      - "v*"

jobs:
  submit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Generate MCP metadata
        run: npm run gen:mcp-metadata
      - name: Create PR to MCP registry
        run: |
          # Fork modelcontextprotocol/servers
          # Add fused-gaming-mcp entry
          # Open PR
```

---

## Phase 7: Installation & Usage

### 7.1 User Installation (npm)

```bash
# Install core + all default skills
npm install @fused-gaming/mcp

# Or: install core + pick skills
npm install @fused-gaming/mcp \
  @fused-gaming/skill-algorithmic-art \
  @fused-gaming/skill-mcp-builder

# Generate config
npx fused-gaming-mcp init

# Enable additional skills
npx fused-gaming-mcp add canvas-design
npx fused-gaming-mcp add theme-factory

# List available
npx fused-gaming-mcp list
```

### 7.2 Claude.ai / Claude API Integration

Once `@fused-gaming/mcp` is published:

**Claude.ai users:**
1. Go to **Skills** → **Upload a skill**
2. Select `fused-gaming-mcp` from npm or GitHub
3. Auto-loads all enabled skills from `.fused-gaming-mcp.json`

**Claude API users:**

```javascript
const client = new Anthropic();
const response = await client.messages.create({
  model: "claude-opus-4-20250514",
  max_tokens: 2048,
  skills: [
    {
      type: "file",
      source: {
        type: "file",
        path: "./fused-gaming-mcp/packages/skills/algorithmic-art/SKILL.md",
      },
    },
  ],
  messages: [
    {
      role: "user",
      content: "Generate a p5.js flow field art piece",
    },
  ],
});
```

---

## Phase 8: Documentation

### 8.1 Main README.md

```markdown
# Fused Gaming MCP

Modular, scalable MCP server with curated Claude skills for creative & technical tasks.

## Features

- 🎨 **13+ curated skills** (algorithmic art, UI design, MCP builders, etc.)
- 📦 **Modular design** — install only what you need
- 🔄 **Auto-updating** — npm workspaces handle versions
- 🔐 **Private customization** — add internal skills without publishing
- 🚀 **Production-ready** — used by Fused Gaming + VLN Security

## Installation

\`\`\`bash
npm install @fused-gaming/mcp

# Or individual skills
npm install @fused-gaming/skill-algorithmic-art @fused-gaming/skill-mcp-builder
\`\`\`

## Quick Start

\`\`\`bash
# Generate config
npx fused-gaming-mcp init

# Enable skills
npx fused-gaming-mcp add canvas-design theme-factory

# Start MCP server
npm run dev
\`\`\`

## Skills

| Skill | Description | Status |
|-------|-------------|--------|
| algorithmic-art | Generative art using p5.js | ✅ |
| ascii-mockup | Mobile-first wireframes | ✅ |
| canvas-design | Visual design (PNG/PDF) | ✅ |
| ... | ... | ... |

## Architecture

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed system design.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for skill development guidelines.

## License

Apache 2.0 — See LICENSE for details.
```

### 8.2 SKILLS_GUIDE.md

```markdown
# Creating a New Skill for Fused Gaming MCP

## Structure

See `packages/skills/` for examples.

## Steps

1. Create skill package: `npm init -w packages/skills/my-skill`
2. Implement Skill interface
3. Add tools
4. Test with MCP Inspector
5. Update root config
6. Open PR with changeset

## Example: Custom Skill

[Full walkthrough with TypeScript code samples]
```

---

## Phase 9: GitHub Setup

### 9.1 Repository Configuration

```
fused-gaming/mcp
├── Settings → Branches → Require PR reviews
├── Settings → Code security → Dependabot enabled
├── Settings → Environments → production (npm token)
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── ISSUE_TEMPLATE/
    ├── bug.yml
    ├── skill-request.yml
    └── feature.yml
```

### 9.2 GitHub Issues Template

**Bug Report:**
```yaml
name: Bug Report
description: Report a skill or server issue
labels: ["bug"]
body:
  - type: textarea
    attributes:
      label: Describe the bug
  - type: input
    attributes:
      label: Affected skill
```

**New Skill Request:**
```yaml
name: Skill Request
description: Suggest a new skill
labels: ["enhancement"]
body:
  - type: textarea
    attributes:
      label: Skill description
  - type: textarea
    attributes:
      label: Use case
```

---

## Phase 10: Metrics & Maintenance

### 10.1 Track (README badges)

```markdown
![npm version](https://img.shields.io/npm/v/@fused-gaming/mcp)
![npm downloads](https://img.shields.io/npm/dm/@fused-gaming/mcp)
![License](https://img.shields.io/badge/license-Apache%202.0-blue)
![Build](https://github.com/fused-gaming/mcp/workflows/test/badge.svg)
```

### 10.2 Release Cadence

- **Core:** Monthly or as-needed
- **Skills:** Independent versioning, publish on change
- **Patch releases:** Weekly aggregate

### 10.3 CHANGELOG.md

```markdown
# Changelog

## [1.0.0] — 2026-04-01

### Added
- Initial release with 13 skills
- Core MCP server + skill loader
- CLI tool for config management
- Documentation & examples

### Skills Included
- algorithmic-art (v1.0.0)
- ascii-mockup (v1.0.0)
- ... (12 more)
```

---

## Execution Checklist

### Week 1: Foundation
- [ ] Create `fused-gaming/mcp` repository on GitHub
- [ ] Initialize monorepo structure (packages/core, skills/*, cli/)
- [ ] Implement core server + skill registry
- [ ] Set up TypeScript, ESLint, CI/CD

### Week 2: Skill Migration
- [ ] Convert 3-5 top skills (algorithmic-art, ascii-mockup, canvas-design)
- [ ] Test skill loading & registration
- [ ] Create skill development guide

### Week 3: Scaling & Polish
- [ ] Migrate remaining 8+ skills
- [ ] Build CLI tool (init, list, add, remove)
- [ ] Write comprehensive documentation

### Week 4: Launch
- [ ] Set up npm publishing (GitHub Actions)
- [ ] Submit to MCP Registry
- [ ] Open-source announcement
- [ ] Create example projects & integrations

---

## Files to Create Now

1. **`.github/workflows/`** — publish.yml, test.yml
2. **`packages/core/`** — server.ts, skill-registry.ts, types.ts
3. **`packages/skills/{skill}/`** — index.ts, SKILL.md (from TrystPilot)
4. **`packages/cli/`** — CLI entrypoint
5. **`docs/`** — ARCHITECTURE.md, SKILLS_GUIDE.md, API_REFERENCE.md
6. **Root files** — README.md, package.json, tsconfig.json, .eslintrc.json

---

## Success Criteria

✅ **Public npm package** installable via `npm install @fused-gaming/mcp`  
✅ **13+ modular skills** independently versioned and maintained  
✅ **Claude.ai integration** — users can load skills directly  
✅ **Private customization** — you can keep internal skills separate  
✅ **Scalable** — add skills without refactoring core  
✅ **Open source** — community can contribute new skills  
✅ **Production-ready** — used by Fused Gaming + VLN in real deployments

---

## Next Step

**Run this prompt to scaffold the entire project:**

```
I want you to scaffold the complete Fused Gaming MCP monorepo structure. 
Start with:

1. Root package.json with workspaces
2. packages/core/src/ (server.ts, skill-registry.ts, types.ts, config.ts)
3. packages/cli/ (init, list, add, remove commands)
4. packages/skills/algorithmic-art/ (template skill)
5. .github/workflows/ (publish.yml, test.yml)
6. docs/ (ARCHITECTURE.md, SKILLS_GUIDE.md)
7. Root README.md + configuration examples

Use TypeScript + MCP SDK best practices. Make it production-ready.
```

**Then, for each TrystPilot skill, migrate it:**

```
Convert {SKILL_NAME} from TrystPilot/skills into a modular package 
under packages/skills/{skill-name}/:

- Preserve SKILL.md as reference documentation
- Implement Skill interface + ToolDefinition exports
- Create package.json with @fused-gaming scope
- Write README with examples

Repeat for: ascii-mockup, canvas-design, frontend-design, theme-factory, 
mcp-builder, pre-deploy-validator, skill-creator, web-artifacts-builder, 
webapp-testing, brand-guidelines, doc-coauthoring, internal-comms.
```

---

## Questions for Refinement

Before execution:

1. **Private skills layer:** Do you want a separate private repo or a branch in the main repo?
2. **Hosting:** Will you host MCP registry server, or use GitHub registry?
3. **VLN integration:** Should VLN Security also publish `@vln-security` skills to the same monorepo?
4. **Versioning:** Sync all skill versions to core, or independent semver per skill?
5. **Branding:** Use `@fused-gaming` or co-brand with `@jlucus` or `@vln`?

---

**Ready to execute? Reply with:**

- ✅ Confirm strategy & structure
- 🎯 Specify any customizations
- 🚀 "Build now" to start scaffolding
