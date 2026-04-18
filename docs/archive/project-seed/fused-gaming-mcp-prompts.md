# Quick Start: Fused Gaming MCP Scaffold Prompt

**Use this prompt in Claude Code or with Claude API to auto-generate the entire project structure.**

---

## Prompt: Full Monorepo Scaffold

```
You are an expert TypeScript / Node.js developer building a production-ready MCP (Model Context Protocol) server 
with a modular skills system for Fused Gaming.

Create a complete monorepo scaffold for @h4shed/mcp with:

STRUCTURE:
- Root package.json with npm workspaces for packages/core, packages/skills/*, packages/cli
- Shared tsconfig.json, .eslintrc.json, .prettierrc
- GitHub Actions workflows for test + publish

PACKAGES:

1. packages/core/ (@h4shed/mcp-core)
   - src/types.ts: Skill, ToolDefinition, SkillConfig, SkillRegistry interfaces
   - src/skill-registry.ts: SkillRegistry class with loadSkill(), registerSkill(), listSkills()
   - src/config.ts: loadConfig(), saveConfig(), mergeConfigs()
   - src/server.ts: MCP server initialization + tool registration
   - src/index.ts: Main exports
   - package.json, tsconfig.json, README.md

2. packages/cli/ (@h4shed/mcp)
   - src/index.ts: yargs CLI with commands: init, list, add <skill>, remove <skill>
   - src/init.ts: Generate .fused-gaming-mcp.json
   - src/list.ts: Display enabled/available skills
   - src/add.ts, remove.ts: Update skill configuration
   - package.json (with "bin": { "fused-gaming-mcp": "./dist/index.js" })
   - README.md

3. packages/skills/algorithmic-art/ (@h4shed/skill-algorithmic-art)
   - src/index.ts: Export algorithmicArtSkill implementing Skill interface
   - src/tools/generate-art.ts: Sample tool with Zod schema
   - SKILL.md: Original Claude skill documentation (reference)
   - package.json, tsconfig.json, README.md
   - Repeat this structure for: ascii-mockup, canvas-design, frontend-design, theme-factory, 
     mcp-builder, pre-deploy-validator, skill-creator

ROOT FILES:
- package.json: workspaces config, root devDependencies, scripts (build, test, lint, typecheck)
- tsconfig.json: base config with target ES2020, module esnext, strict: true
- .eslintrc.json: typescript-eslint rules
- .gitignore: dist/, node_modules/, *.log, .env
- .github/workflows/test.yml: lint + build on PR
- .github/workflows/publish.yml: publish to npm on version tags
- .fused-gaming-mcp.json: example root configuration
- README.md: project overview, installation, quick start, skills table
- docs/ARCHITECTURE.md: system design + diagrams
- docs/SKILLS_GUIDE.md: how to create new skills
- LICENSE: Apache 2.0

REQUIREMENTS:
- All TypeScript, strict mode, no any
- Use MCP SDK from @modelcontextprotocol/sdk
- Use Zod for schema validation where needed
- Skills are loadable at runtime via dynamic import()
- Each skill exports a Skill object as default export
- Tools have input schema + description
- Error messages are actionable
- README files have examples
- All code is well-commented

STYLE:
- Terse, direct code with clear intent
- Skip verbose comments—code speaks for itself
- Use async/await throughout
- No hardcoded values
- Configuration-driven

Start with the complete root package.json and tsconfig.json, then scaffold each package in order:
core → cli → skills/{1-7}.

Output all files as structured text (markdown code blocks). Ready to copy/paste directly into files.
```

---

## Prompt: Generate Individual Skill

```
Convert the {SKILL_NAME} Claude skill from Anthropic's TrystPilot/skills into a modular MCP package.

SKILL INFO:
Name: {SKILL_NAME}
Description: {SKILL_DESCRIPTION}
Original SKILL.md location: https://github.com/TrystPilot/skills/blob/main/skills/{SKILL_NAME}/SKILL.md

TARGET PACKAGE STRUCTURE:
packages/skills/{skill-name}/
├── src/
│   ├── index.ts               # Export Skill interface
│   ├── tools/                 # Tool implementations
│   │   ├── index.ts           # Tool registry
│   │   └── {tool-name}.ts     # Individual tools
│   └── types.ts               # Skill-specific types
├── SKILL.md                   # Original skill (reference)
├── package.json               # @h4shed/skill-{name}
├── tsconfig.json
└── README.md

IMPLEMENTATION:
1. Fetch the original SKILL.md from TrystPilot
2. Extract key functions/tools from the skill description
3. Implement src/index.ts exporting a Skill object with:
   - name: string
   - version: "1.0.0"
   - description: string
   - tools: ToolDefinition[] (2-3 primary tools)
   - initialize(config): Promise<void>
4. For each tool, create a tool file with:
   - Zod input schema
   - handler function (async)
   - Clear description
5. Create package.json with name @h4shed/skill-{name}
6. Create README with usage examples

IMPORTANT:
- Preserve the original skill's intent + functionality
- Make tools composable + reusable
- Include error handling
- Add examples in README
- Assume tools are loaded on-demand

Output: Complete file listing for this skill package, ready to create locally.
```

---

## Prompt: Create Skill Tools from Claude Instructions

```
I have a Claude skill (SKILL.md) that teaches Claude how to {TASK}.

The skill includes instructions for:
{LIST MAIN OPERATIONS}

Convert these into 2-3 MCP tool definitions with:
- Descriptive name (e.g., generateArt, analyzeCode, createMockup)
- Clear description of what the tool does
- Input schema (Zod) with:
  - required parameters
  - parameter descriptions
  - constraints (min/max, allowed values)
- Example input/output
- Implementation stub or full code (if possible)

Format as TypeScript:

const {toolName}Tool: ToolDefinition = {
  name: "{tool-name}",
  description: "...",
  inputSchema: z.object({ ... }).describe("..."),
  handler: async (input) => { ... },
};

Tools should be independently usable by an AI agent calling the MCP server.
```

---

## Prompt: Generate Documentation

```
Create professional markdown documentation for the @h4shed/mcp monorepo:

FILES TO GENERATE:

1. README.md
   - 200-word project overview
   - Feature highlights (3-4 key points)
   - Installation instructions
   - Quick start (5 min example)
   - Skills table (name | description | status)
   - Links to docs + contributing

2. docs/ARCHITECTURE.md
   - System design (monorepo + skill loading)
   - Diagram: "Core → Skill Registry → Tools"
   - Configuration flow
   - MCP server lifecycle
   - Deployment topology

3. docs/SKILLS_GUIDE.md
   - Step-by-step: create a new skill
   - Skill interface + types
   - Tool definition format
   - Package.json requirements
   - Example: weather skill
   - Testing + publishing

4. docs/API_REFERENCE.md
   - Core types (Skill, ToolDefinition, SkillRegistry)
   - SkillRegistry methods with examples
   - Configuration schema (JSON)
   - CLI commands
   - Error types

5. CONTRIBUTING.md
   - Code style (ESLint, Prettier)
   - Git workflow (fork → PR)
   - Skill review checklist
   - Release process (semver)
   - License (Apache 2.0)

STYLE:
- Clear, terse, professional
- Include code examples
- Use h2/h3 for structure
- Add diagrams where helpful
- Link between docs
```

---

## Prompt: Generate CI/CD Workflows

```
Create GitHub Actions workflows for @h4shed/mcp monorepo:

FILES:

1. .github/workflows/test.yml
   - Trigger: PR + push to main
   - Node 18 + npm install
   - npm run lint
   - npm run build
   - npm run typecheck
   - Report status

2. .github/workflows/publish.yml
   - Trigger: git tag v* or skill-*
   - Node 18 + npm install
   - npm run build
   - npm publish --workspaces (with NPM_TOKEN)
   - Post success message (optional)

REQUIREMENTS:
- Use actions/checkout@v5
- Use actions/setup-node@v5
- Fail fast on errors
- Clear job names
- Optional: codecov or coverage reporting
```

---

## Prompt: Configuration Schema

```
Generate the JSON schema + example for .fused-gaming-mcp.json configuration file.

SCHEMA SHOULD INCLUDE:

{
  server: {
    name: string,
    version: string,
    transport: "stdio" | "http",
    port?: number
  },
  skills: {
    enabled: string[] (skill names),
    disabled: string[],
    custom: string[] (local paths)
  },
  auth: {
    apiKeys: Record<string, string>
  },
  logging: {
    level: "debug" | "info" | "warn" | "error"
  }
}

Provide:
1. Full JSON schema (with $schema, $id, etc.)
2. Example configuration (for user with 5 skills enabled)
3. Explanation of each field
4. Validation rules
```

---

## How to Use These Prompts

### Option A: Claude Code (Recommended)
1. Paste **Full Monorepo Scaffold** prompt
2. Follow with file output
3. Use `/create` or editor to add files locally
4. Run `npm install && npm run build`

### Option B: Claude.ai
1. Paste prompts one at a time
2. Copy/save each file output
3. Manually create files locally
4. Build + test

### Option C: In Conversation Thread (This Session)
Just reply with:
```
Generate the core package scaffold for @h4shed/mcp-core
```

Or:

```
Generate the CLI package with init/list/add/remove commands
```

Or for individual skills:

```
Convert {SKILL_NAME} to @h4shed/skill-{name} package
```

---

## One-Liner: Full Project Generation

If you want everything in one shot (may be very long):

```
Generate the complete @h4shed/mcp monorepo scaffold: 
- Root config + workspaces
- packages/core with server + registry
- packages/cli with yargs commands
- packages/skills/{algorithmic-art, ascii-mockup, canvas-design} as template skills
- .github/workflows for test + publish
- Complete documentation (README, ARCHITECTURE, SKILLS_GUIDE, CONTRIBUTING)
- Example .fused-gaming-mcp.json

Output all files in structured format. Use TypeScript + ESM. Assume MCP SDK available.
```

---

## File Checklist: What Gets Generated

After using these prompts, you should have:

### Root
- [ ] package.json (workspaces)
- [ ] tsconfig.json
- [ ] .eslintrc.json
- [ ] .prettierrc
- [ ] .gitignore
- [ ] README.md
- [ ] CONTRIBUTING.md
- [ ] CHANGELOG.md
- [ ] LICENSE (Apache 2.0)
- [ ] .fused-gaming-mcp.json (example)

### packages/core
- [ ] package.json
- [ ] tsconfig.json
- [ ] src/types.ts
- [ ] src/skill-registry.ts
- [ ] src/config.ts
- [ ] src/server.ts
- [ ] src/index.ts
- [ ] README.md

### packages/cli
- [ ] package.json (with bin)
- [ ] tsconfig.json
- [ ] src/index.ts
- [ ] src/init.ts
- [ ] src/list.ts
- [ ] src/add.ts
- [ ] src/remove.ts
- [ ] README.md

### packages/skills/{x7}
For each of: algorithmic-art, ascii-mockup, canvas-design, frontend-design, theme-factory, mcp-builder, pre-deploy-validator, skill-creator
- [ ] package.json (@h4shed/skill-{name})
- [ ] tsconfig.json
- [ ] src/index.ts (exports Skill)
- [ ] src/tools/*.ts (2-3 tools per skill)
- [ ] SKILL.md (reference)
- [ ] README.md

### docs/
- [ ] ARCHITECTURE.md
- [ ] SKILLS_GUIDE.md
- [ ] API_REFERENCE.md

### .github/workflows/
- [ ] test.yml
- [ ] publish.yml

**Total: ~60 files for complete v1.0.0**

---

## Tips for Success

1. **Generate incrementally:** Start with root + core, test, then add skills
2. **Use workspaces:** Once root + packages exist, `npm install` once for all
3. **Test locally before pushing:** `npm run build && npm run test`
4. **Keep tool implementations simple at first:** Can expand later with PRs
5. **Version consistently:** All packages start at v1.0.0, then semver independently
6. **Build often:** Catch errors early with `npm run typecheck`

---

## Next: Copy & Paste Instructions

**To start building now:**

1. Open **Claude Code** or **new Claude.ai session**
2. Paste the **Full Monorepo Scaffold** prompt above
3. Copy output files into a new folder: `fused-gaming-mcp/`
4. Run:
   ```bash
   cd fused-gaming-mcp
   npm install
   npm run build
   npm run test
   ```
5. If successful, follow **Week 1 checklist** in execution document

---

**Ready? Let's build!** 🚀

*Questions: Reply in this thread or use the companion execution checklist.*
