# Ecosystem Infrastructure & Extensibility Guide

## Overview

The Fused Gaming MCP (@h4shed namespace) ecosystem is designed as a **modular, extensible platform** for composable AI skills and tools. This document describes the infrastructure improvements that enable developers to contribute skills, tools, and specialized modules (including ethical hacking tools) while maintaining ecosystem integrity and proper versioning.

## Architecture Principles

### 1. Modular Skill Architecture
Each skill is an **independent npm package** with its own:
- Version lifecycle (`@h4shed/skill-{name}@X.Y.Z`)
- Source code and dependencies
- Type definitions and documentation
- Build and test configuration

### 2. Tag-Based Version Control
**Tags are the source of truth** for what gets published:
- Skill tags: `skill-{name}@X.Y.Z` (triggers npm publish)
- Root tags: `vX.Y.Z` (coordinates ecosystem releases)
- No branch naming is required if properly tagged

### 3. Validation-First Publishing
All changes are validated against:
- Branch-to-skill matching (prevents accidental publishing)
- Skill isolation (one skill per PR/branch preferred)
- Type safety (strict TypeScript mode)
- Code quality (linting, testing)

## For Skill Contributors

### Adding a New Skill

```bash
# 1. Create appropriately named branch
git checkout -b feat/skill-name

# 2. Scaffold skill package manually
mkdir -p packages/skills/skill-name/{src/tools}
cd packages/skills/skill-name

# Create package.json
cat > package.json <<EOF
{
  "name": "@h4shed/skill-skill-name",
  "version": "1.0.0",
  "description": "Description of your skill",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc",
    "test": "echo \"No tests yet\""
  },
  "dependencies": {},
  "devDependencies": {
    "@h4shed/mcp-core": "workspace:*",
    "typescript": "^5.0.0"
  }
}
EOF

# Create tsconfig.json
cat > tsconfig.json <<EOF
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
EOF

# 3. Create skill implementation
cat > src/index.ts <<'EOF'
import type { Skill, ToolDefinition } from "@h4shed/mcp-core";

export const YourSkill: Skill = {
  name: "skill-name",
  version: "1.0.0",
  description: "Brief description of what this skill does",
  tools: [],

  async initialize(_config): Promise<void> {
    // Initialize skill resources if needed
  },

  async cleanup(): Promise<void> {
    // Cleanup resources if needed
  },
};
EOF

# 4. Add comprehensive README.md
cat > README.md <<'EOF'
# @h4shed/skill-skill-name

Brief description of the skill.

## Installation

\`\`\`bash
npm install @h4shed/skill-skill-name
\`\`\`

## Usage

\`\`\`typescript
import { YourSkill } from "@h4shed/skill-skill-name";
\`\`\`

## License

Apache-2.0
EOF

# 5. Build and test locally
npm run build --workspace=packages/skills/skill-name
npm test --workspace=packages/skills/skill-name

# 6. Commit changes
git add packages/skills/skill-name
git commit -m "feat(skill-name): Add new skill with X tools"

# 7. Push and create PR
git push origin feat/skill-name
# Create PR to main branch

# 8. After merge, tag for publishing
git tag skill-skill-name@1.0.0
git push origin skill-skill-name@1.0.0

# ✓ Automatic: publish workflow publishes to npm
```

### Skill Package Structure
```
packages/skills/skill-name/
├── src/
│   ├── index.ts              # Skill export (implement Skill interface)
│   ├── tools/
│   │   ├── tool-one.ts       # Tool implementations (ToolDefinition)
│   │   └── tool-two.ts
│   └── types.ts              # Type definitions (if complex)
├── package.json              # Name: @h4shed/skill-skill-name
├── README.md                 # Usage guide + examples
├── tsconfig.json             # TypeScript config (strict mode)
└── dist/                     # Compiled output (gitignored)
```

### Required Interfaces

**Skill:**
```typescript
interface Skill {
  name: string;              // "skill-name"
  version: string;           // "1.0.0"
  description: string;       // What it does
  tools: ToolDefinition[];   // Available tools
  initialize(config: SkillConfig): Promise<void>;
  cleanup(): Promise<void>;
}
```

**Tool:**
```typescript
interface ToolDefinition {
  name: string;              // "tool-name"
  description: string;       // What it does
  inputSchema: JSONSchema;   // Input validation
  handler(input: Record<string, unknown>): Promise<Record<string, unknown>>;
}
```

## For Ethical Hacking Contributors

The ecosystem supports specialized modules for security research, penetration testing, and defensive security work:

### Ethical Hacking Module Categories

```
packages/skills/
├── security-assessment-framework/     # Vulnerability assessment tools
├── penetration-testing-suite/          # Authorized pentest tools
├── defensive-security-toolkit/         # Defensive monitoring tools
├── threat-modeling-accelerator/        # Threat modeling utilities
└── compliance-automation/              # Compliance checking tools
```

### Guidelines for Security Modules

1. **Authorization First**
   - Always include authorization context checking
   - Document required permissions
   - Implement scope boundaries

2. **Defensive-First Design**
   - Tools should enable defenders
   - Clear warnings for potentially destructive operations
   - Audit logging support

3. **Educational Value**
   - Include learning resources
   - Document security concepts
   - Provide safe testing environments

4. **Responsible Disclosure**
   - Tag findings with severity levels
   - Support vendor notification workflows
   - Respect embargo periods

### Example: Security Assessment Skill

```typescript
// packages/skills/security-assessment-framework/src/index.ts
export const SecurityAssessmentSkill: Skill = {
  name: "security-assessment-framework",
  version: "1.0.0",
  description: "Framework for authorized security assessments",
  tools: [
    VulnerabilityAnalyzerTool,
    RiskScorerTool,
    ReportGeneratorTool,
  ],
  
  async initialize(config: SkillConfig): Promise<void> {
    // Verify authorization context
    if (!config.authorizedFor?.includes('security-assessment')) {
      throw new Error('Security assessment requires explicit authorization');
    }
  },
};
```

## Infrastructure Components

### 1. Branch-Skill Validation System
**File:** `scripts/validate-branch-skill-match.cjs`

Validates that:
- Branch names follow naming convention (feat/skill-name)
- OR changes are tagged with skill version tag
- Changes don't accidentally modify unrelated skills
- Prevents accidental publishing of wrong packages

**Triggers:** Every push to feature branches, every PR

### 2. Tagging Strategy
**File:** `docs/BRANCH_SKILL_TAGGING_STRATEGY.md`

Defines:
- How to tag skills for publishing (`skill-name@X.Y.Z`)
- How to tag root releases (`vX.Y.Z`)
- Tag-based validation as fallback to branch naming
- Publishing workflow integration

**Effect:** Tags determine what gets published to npm

### 3. Validation Examples
**File:** `docs/VALIDATION_EXAMPLES.md`

Shows:
- Real scenarios and expected validation outputs
- How validation passes/fails
- Remediation steps for common issues
- Both branch naming and tag-based approaches

**Purpose:** Clarity for contributors on what's allowed

## Publishing Workflow

### Standard Flow
```
Feature Branch → Tests Pass → Merge to Main → Tag → Auto-Publish
     (feat/*)      (CI)        (PR review)    (git tag)  (GH Actions)
```

### Multi-Skill Coordination
```
Branch 1: feat/skill-a  ──┐
                           ├─→ Main → Root Tag (v1.1.0) → All Publish
Branch 2: feat/skill-b  ──┘
```

### Standalone Skill Release
```
Branch: feat/skill-x
  ↓
Tag: skill-x@1.0.0
  ↓
Auto: publish @h4shed/skill-x@1.0.0 to npm
```

## Extensibility Patterns

### 1. Tool Composition
Skills can reuse tools from other skills:
```typescript
import { AnalyzeContentQualityTool } from "@h4shed/skill-linkedin-master-journalist";

export const MySkill: Skill = {
  tools: [
    AnalyzeContentQualityTool,  // Reuse
    MyCustomTool,               // Add new
  ]
};
```

### 2. Type Extension
```typescript
import type { ToolDefinition } from "@h4shed/mcp-core";

export const ExtendedTool: ToolDefinition = {
  // Custom implementation extending base interface
};
```

### 3. Skill Pipelines
Chain skills together:
```bash
# Use output of one skill as input to another
skill-a-output | skill-b-input | skill-c-input
```

## Quality Standards

### All Skills Must
- ✓ Compile with TypeScript strict mode
- ✓ Pass eslint validation
- ✓ Include comprehensive README
- ✓ Implement all required interfaces
- ✓ Handle errors gracefully
- ✓ Include example usage

### Recommended
- ✓ 80%+ code coverage (when applicable)
- ✓ Type definitions for all public APIs
- ✓ Integration tests
- ✓ Documentation with examples
- ✓ Semantic versioning

## Integration Points

### With MCP Core
```typescript
// Skill registers with MCP server
import { loadConfig, saveConfig } from "@h4shed/mcp-core";

// Access ecosystem configuration
const config = loadConfig();
config.skills.enabled.includes("skill-name");
```

### With CLI
```bash
# Add/remove skills
@h4shed/mcp-cli add @h4shed/skill-name
@h4shed/mcp-cli remove @h4shed/skill-name

# List installed skills
@h4shed/mcp-cli list
```

### With Workspace
```bash
# Build specific skill
npm run build --workspace=packages/skills/skill-name

# Test across ecosystem
npm test --workspaces --if-present

# Publish all changed skills
npm publish --workspaces
```

## Contributing Security Modules

### 1. Design Review
- Submit RFC (request for comments) in issues
- Get approval for scope and approach
- Ensure alignment with ethical guidelines

### 2. Implementation
```bash
# Create security module
git checkout -b feat/security-assessment-framework

# Implement with proper safeguards
# - Authorization checks
# - Audit logging
# - Error boundaries
# - Documentation

npm run build && npm test

# Commit
git commit -m "feat: Add security assessment framework"
```

### 3. Security Review
- Request review from @h4shed/security-team
- Address feedback
- Verify safeguards

### 4. Publish
```bash
# Tag for publishing
git tag skill-security-assessment-framework@1.0.0
git push origin skill-security-assessment-framework@1.0.0

# ✓ Auto-publish to npm with security tag
```

## Troubleshooting

### Issue: Validation Fails - "Branch skill mismatch"
```bash
# Solution 1: Rename branch
git checkout -b feat/correct-skill-name
git push origin feat/correct-skill-name

# Solution 2: Tag changes
git tag skill-correct-skill-name@1.0.0
```

### Issue: Test Fails - Module not found
```bash
# Solution: Ensure workspace linking
npm ci --workspaces
npm run build --workspaces
```

### Issue: Publishing blocked
```bash
# Check tag format
git tag  # Should show: skill-name@X.Y.Z

# Verify package.json name
cat packages/skills/skill-name/package.json | grep '"name"'
# Should show: "@h4shed/skill-name"
```

## Resources

- **BRANCH_SKILL_TAGGING_STRATEGY.md** — Detailed tagging and branching guide
- **VALIDATION_EXAMPLES.md** — Real validation scenarios
- **LIMJ_IMPROVEMENTS_SUMMARY.md** — Example of production-ready skill
- **npm registry** — `npm search @h4shed` to explore ecosystem

---

**Status:** Active - Infrastructure in production  
**Last Updated:** May 11, 2026  
**Maintained By:** Fused Gaming / @h4shed  
**License:** Apache-2.0
