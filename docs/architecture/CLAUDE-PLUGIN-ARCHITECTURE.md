# Claude Plugin Architecture & Installation Flow

**Date:** 2026-08-29  
**Status:** Design Phase  
**Scope:** User-facing plugin system for Claude Desktop and Claude.ai  
**Related:** Phases 0-6 complete (Audit), Phase 7+ (Implementation)

---

## Executive Summary

A comprehensive plugin system enabling users to:
- Install Fused Gaming skills, agents, and tools as a single Claude plugin
- Discover and add individual skills from a registry (npm-scoped packages)
- Auto-update plugins while preserving context cache
- Use both npm and npx installation methods for flexibility
- Manage licensing and benchmark performance telemetry
- Develop new plugins with clean-room methodology and security guardrails

The plugin serves as the **primary distribution mechanism** for the Fused Gaming ecosystem, replacing manual skill registration and enabling enterprise adoption.

---

## Part 1: Plugin Distribution Architecture

### 1.1 Installation Methods

#### Method A: Claude Desktop Config (Recommended for Users)

Users edit `~/.config/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "fused-gaming": {
      "command": "npx",
      "args": ["@h4shed/claude-plugin@latest", "--mcp"],
      "env": {
        "FUSED_GAMING_LICENSE_KEY": "ncl_xxxx",
        "FUSED_GAMING_TELEMETRY": "true"
      }
    }
  }
}
```

**Advantages:**
- No local installation needed
- Auto-update via npx (latest flag)
- Single entry point for all skills
- Context cache preserved across invocations

#### Method B: Direct npm Installation

For developers or offline environments:

```bash
npm install -g @h4shed/claude-plugin
npx @h4shed/claude-plugin --desktop-setup
```

This creates/updates `claude_desktop_config.json` automatically.

#### Method C: Claude.ai Plugin Marketplace

The plugin is published to Claude.ai marketplace:
- One-click installation
- Automatic updates
- Built-in license verification
- Analytics and usage tracking

### 1.2 Plugin Entry Point Package

**Package:** `@h4shed/claude-plugin`  
**License:** Apache-2.0 (permissive for ecosystem)  
**Version:** 1.0.0+  
**Node:** >= 20.0.0

**Directory Structure:**
```
packages/plugins/claude-plugin/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── plugin.ts             # Plugin orchestration
│   ├── registry.ts           # Skill discovery & loading
│   ├── licensing/
│   │   ├── validator.ts      # License key validation
│   │   ├── compliance.ts     # Usage tracking
│   │   └── enforcer.ts       # License enforcement
│   ├── updates/
│   │   ├── checker.ts        # Update detection
│   │   ├── installer.ts      # Offline update installation
│   │   └── cache.ts          # Context cache management
│   ├── benchmark/
│   │   ├── metrics.ts        # Performance collection
│   │   └── reporter.ts       # Metrics reporting
│   ├── cli/
│   │   ├── commands.ts       # CLI interface
│   │   ├── setup.ts          # Desktop config setup
│   │   └── status.ts         # Plugin status checks
│   └── security/
│       ├── sandbox.ts        # Tool execution sandboxing
│       └── permissions.ts    # Permission enforcement
├── bin/
│   └── fused-gaming-plugin   # CLI executable
└── README.md
```

---

## Part 2: Skill Discovery & Dynamic Loading

### 2.1 Plugin Registry

The plugin maintains a **skills registry** that dynamically loads tools from installed npm packages.

**Registry Design:**
```typescript
interface SkillRegistry {
  skills: Map<string, SkillDefinition>;
  agents: Map<string, AgentDefinition>;
  tools: Map<string, ToolDefinition>;
}

interface SkillDefinition {
  id: string;                    // e.g., "skill-mermaid-terminal"
  name: string;
  version: string;
  package: string;               // e.g., "@h4shed/skill-mermaid-terminal"
  license: "Apache-2.0" | "PolyForm";
  tools: ToolDefinition[];
  resources?: ResourceDefinition[];
  enabled: boolean;
  installed: true;
}
```

### 2.2 Discovery Mechanism

**On Plugin Startup:**

1. **Scan workspace packages** (if running from monorepo):
   - Glob `packages/skills/*/package.json`
   - Glob `packages/tools/*/package.json`
   - Load SKILL.md from each package

2. **Scan npm_modules** (production):
   - Read `node_modules/@h4shed/` packages
   - Parse package.json `skills` field (custom metadata)
   - Validate SKILL.md manifest in each package

3. **Query skill registry endpoint** (enterprise):
   - POST to `https://skills.fused-gaming.com/v1/registry/discover`
   - Provides federated skill registry across organizations

**Example package.json with skill metadata:**
```json
{
  "name": "@h4shed/skill-mermaid-terminal",
  "version": "1.0.0",
  "skills": {
    "id": "skill-mermaid-terminal",
    "tools": ["generate_mermaid_diagram"],
    "resources": ["mermaid_templates"]
  },
  "exports": {
    ".": "./dist/index.js",
    "./skill": "./dist/skill.js"
  }
}
```

### 2.3 Lazy Loading & Performance

The plugin uses **lazy loading** to optimize startup time:

```typescript
class SkillLoader {
  private loadedSkills = new Map();
  
  async getSkill(skillId: string): Promise<SkillDefinition> {
    // Return cached skill if already loaded
    if (this.loadedSkills.has(skillId)) {
      return this.loadedSkills.get(skillId);
    }
    
    // Load on demand from npm package
    const skill = await this.loadSkillFromPackage(skillId);
    this.loadedSkills.set(skillId, skill);
    return skill;
  }
  
  // Load only enabled skills for MCP registration
  getEnabledSkills(): SkillDefinition[] {
    return Array.from(this.loadedSkills.values())
      .filter(skill => skill.enabled);
  }
}
```

---

## Part 3: Installation & Setup Workflow

### 3.1 User Setup Flow

**Step 1: Install Plugin**
```bash
# Option A: Use npx (recommended)
npx @h4shed/claude-plugin@latest --desktop-setup

# Option B: Install globally
npm install -g @h4shed/claude-plugin
fused-gaming-plugin setup
```

**Step 2: Configure License (Optional)**
```bash
# Interactive license setup
fused-gaming-plugin license set

# Or via environment variable
export FUSED_GAMING_LICENSE_KEY="ncl_1234567890"
```

**Step 3: Enable Skills**
```bash
# List available skills
fused-gaming-plugin skills list

# Enable specific skill
fused-gaming-plugin skills enable skill-mermaid-terminal

# Or enable all
fused-gaming-plugin skills enable --all
```

**Step 4: Verify Installation**
```bash
fused-gaming-plugin status
# Output:
# ✓ MCP Server: Running
# ✓ Claude Desktop: Connected
# ✓ Skills Available: 30
# ✓ Skills Enabled: 8
# ✓ License: Valid (ncl_xxxx, Tier: Professional)
# ✓ Last Updated: 2 hours ago
```

### 3.2 Claude Desktop Integration

Plugin automatically:
1. Detects Claude Desktop installation
2. Creates/updates `claude_desktop_config.json`
3. Adds MCP server entry if not present
4. Tests MCP connection
5. Registers tools with Claude Desktop daemon

**Auto-detection paths:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

### 3.3 Installation Verification

```typescript
class InstallationValidator {
  async verify(): Promise<ValidationResult> {
    const checks = [
      this.checkNodeVersion(),
      this.checkDesktopConfig(),
      this.checkMcpServer(),
      this.checkSkillPackages(),
      this.checkLicensing(),
    ];
    
    return Promise.all(checks);
  }
}
```

---

## Part 4: Auto-Update Mechanism

### 4.1 Update Detection

The plugin checks for updates **on startup** and **hourly** in background:

```typescript
class UpdateChecker {
  async checkForUpdates(): Promise<UpdateInfo | null> {
    const current = require('../package.json').version;
    const latest = await this.fetchLatestVersion();
    
    if (semver.gt(latest, current)) {
      return {
        currentVersion: current,
        latestVersion: latest,
        changelog: await this.fetchChangelog(),
        breakingChanges: this.detectBreakingChanges(),
      };
    }
  }
}
```

### 4.2 Context Cache Preservation

**Critical:** Updates must preserve Claude's context cache token.

**Strategy:**
1. **Version-tied cache:** Store cache metadata tagged with plugin version
2. **Graceful degradation:** If update incompatible, clear cache with user consent
3. **Cache reuse:** npm `@latest` with npx reuses semver cache if no breaking changes
4. **User control:** Settings allow `always-update`, `prompt`, or `manual` modes

**Implementation:**
```typescript
class CacheManager {
  // Before update
  async saveCache(): Promise<string> {
    return JSON.stringify({
      version: currentVersion,
      timestamp: Date.now(),
      enabledSkills: this.registry.getEnabledSkills(),
      // Metadata only, not actual cache
    });
  }
  
  // After update
  async validateCacheCompatibility(oldMetadata: string): Promise<boolean> {
    const old = JSON.parse(oldMetadata);
    // Check if skill versions are compatible
    return this.areSkillVersionsCompatible(old.enabledSkills);
  }
}
```

### 4.3 Update Installation

**Interactive update flow:**

```
Update available: 1.0.5 → 1.2.0

What would you like to do?
  1. Auto-update (npm fetch latest, restart MCP)
  2. Schedule update (next Claude restart)
  3. Manual update (you'll run npm install)
  4. View changelog
  5. Skip this version

> 1

[Downloading @h4shed/claude-plugin@1.2.0...]
[Verifying signatures...]
[Restarting MCP server...]
✓ Update complete. Claude will reload skills on next message.
```

---

## Part 5: Licensing & Compliance

### 5.1 License Validation

The plugin validates licenses **on startup** and **periodically** (every 24h):

```typescript
class LicenseValidator {
  async validateLicense(): Promise<LicenseStatus> {
    const key = process.env.FUSED_GAMING_LICENSE_KEY;
    
    if (!key) {
      // Noncommercial mode (free tier)
      return { tier: "noncommercial", active: true };
    }
    
    // Verify commercial license with server
    const response = await fetch('https://license.fused-gaming.com/v1/validate', {
      method: 'POST',
      body: JSON.stringify({
        key,
        timestamp: Date.now(),
        hardwareId: this.getHardwareId(),
      }),
    });
    
    const status = await response.json();
    return status;
  }
}
```

### 5.2 License Tiers & Enforcement

| Tier | License | Price | Capabilities | Enforcement |
|------|---------|-------|--------------|-------------|
| **Noncommercial** | PolyForm Noncommercial 1.0.0 | Free | All skills, no commercial use | Soft enforcement (warning) |
| **Starter** | Commercial | $500/year | All skills, up to 5 users | Hard enforcement (blocks features) |
| **Professional** | Commercial | $5,000/year | All skills, up to 50 users + API access | Hard enforcement |
| **Enterprise** | Commercial | Custom | Everything + priority support | Hard enforcement |

**Enforcement:**
- **Noncommercial:** Log warning, allow all tools (user must comply)
- **Commercial (expired):** Block new tool calls after 7-day grace period
- **Commercial (valid):** Full access to all features

### 5.3 License Key Format

```
ncl_<base62-encoded>

Structure:
- ncl_ = Noncommercial License prefix
- cl_  = Commercial License prefix
- 32 base62 characters (timestamp + hash + signature)

Example: ncl_K3mZ8vR2tQ5nL9xB1cV4pWqY6jF8aS
```

### 5.4 Usage Telemetry (Optional)

If enabled, plugin reports:
- Tools used (not data passed through them)
- Skill enable/disable events
- Version information
- Error rates (anonymized)

**Telemetry transmission:**
- Batched every 1 hour
- Sent to `https://telemetry.fused-gaming.com/v1/events`
- Includes license key for usage tier tracking
- Can be disabled: `FUSED_GAMING_TELEMETRY=false`

---

## Part 6: Benchmark Integration

### 6.1 Performance Metrics Collection

The plugin automatically collects performance metrics for:
- Tool execution time
- Memory usage per skill
- Cache hit rates
- Update frequency/duration
- License validation latency

```typescript
class BenchmarkCollector {
  async measureToolExecution(
    toolId: string,
    fn: () => Promise<any>
  ): Promise<ExecutionMetrics> {
    const start = performance.now();
    const memBefore = process.memoryUsage().heapUsed;
    
    const result = await fn();
    
    const duration = performance.now() - start;
    const memAfter = process.memoryUsage().heapUsed;
    
    return {
      toolId,
      duration,
      memoryDelta: memAfter - memBefore,
      timestamp: Date.now(),
    };
  }
}
```

### 6.2 Benchmark Reports

Users can view performance data:

```bash
fused-gaming-plugin benchmark report

Tool Performance (Last 7 days):
┌─────────────────────────┬────────┬─────────┬──────────┐
│ Tool                    │ Calls  │ Avg Time│ Mem Peak │
├─────────────────────────┼────────┼─────────┼──────────┤
│ skill-mermaid-terminal  │ 124    │ 342ms   │ 45.2 MB  │
│ skill-project-manager   │ 89     │ 156ms   │ 28.1 MB  │
│ skill-svg-generator     │ 45     │ 1,203ms │ 112 MB   │
└─────────────────────────┴────────┴─────────┴──────────┘
```

### 6.3 Opt-in Benchmark Sharing

Enterprise users can share benchmarks:

```bash
fused-gaming-plugin benchmark share --enterprise

Shared benchmark ID: bm_K8xQ2vN5pL3tR9mW1zV4cB6aD
View at: https://benchmarks.fused-gaming.com/bm_K8xQ2vN5pL3tR9mW1zV4cB6aD
```

---

## Part 7: Security & Sandbox

### 7.1 Tool Execution Sandbox

All tools run in a sandboxed context with permission checks:

```typescript
class ToolSandbox {
  async executeWithPermissions(
    toolId: string,
    input: Record<string, any>
  ): Promise<any> {
    // Check tool permissions
    const permissions = await this.getToolPermissions(toolId);
    
    if (!permissions.allowed) {
      throw new Error(`Tool ${toolId} not permitted in this context`);
    }
    
    // Execute in isolated context
    const result = await this.isolatedExecute(toolId, input);
    
    // Log execution for audit
    await this.auditLog({
      toolId,
      timestamp: Date.now(),
      license: this.getCurrentLicense(),
    });
    
    return result;
  }
}
```

### 7.2 Permission Model

Users grant permissions on first tool use:

```
Tool Permissions
┌──────────────────────────────────────────────┐
│ skill-mermaid-terminal wants to:             │
│                                              │
│ ☑ Generate and render Mermaid diagrams       │
│ ☑ Access filesystem (read-only)              │
│ ☐ Access network (currently denied)          │
│ ☐ Execute shell commands (currently denied)  │
│                                              │
│ [Allow All]  [Customize]  [Deny]             │
└──────────────────────────────────────────────┘
```

### 7.3 Signing & Verification

The plugin verifies integrity of skill packages:

```typescript
class PackageVerifier {
  async verifyPackage(packageName: string): Promise<boolean> {
    const manifest = await npm.getPackageManifest(packageName);
    const signature = await npm.getPackageSignature(packageName);
    
    // Verify package signed by @h4shed organization
    return this.verifySignature(manifest, signature);
  }
}
```

---

## Part 8: Plugin Configuration

### 8.1 Config File Format

**Location:** `~/.fused-gaming/plugin-config.json`

```json
{
  "version": "1.0.0",
  "license": {
    "key": "ncl_K3mZ8vR2tQ5nL9xB1cV4pWqY6jF8aS",
    "tier": "noncommercial",
    "hardwareId": "hw_xxxxx",
    "lastValidated": 1693305600000
  },
  "skills": {
    "skill-mermaid-terminal": {
      "enabled": true,
      "version": "1.0.23",
      "permissions": ["filesystem:read", "renderer:mermaid"]
    },
    "skill-project-manager": {
      "enabled": true,
      "version": "1.0.24",
      "permissions": ["filesystem:read", "filesystem:write"]
    }
  },
  "updates": {
    "checkInterval": 3600000,
    "mode": "prompt",
    "preserveCache": true,
    "lastChecked": 1693305600000
  },
  "telemetry": {
    "enabled": true,
    "lastReported": 1693305600000
  },
  "benchmark": {
    "enabled": true,
    "retentionDays": 30
  }
}
```

### 8.2 Environment Variables

```bash
# License
FUSED_GAMING_LICENSE_KEY=ncl_xxxx

# Update behavior
FUSED_GAMING_UPDATE_MODE=prompt|manual|auto
FUSED_GAMING_PRESERVE_CACHE=true|false

# Telemetry
FUSED_GAMING_TELEMETRY=true|false

# Debugging
FUSED_GAMING_DEBUG=true
FUSED_GAMING_LOG_LEVEL=info|debug|warn|error

# Registry
FUSED_GAMING_REGISTRY_URL=https://skills.fused-gaming.com
FUSED_GAMING_LICENSE_SERVER=https://license.fused-gaming.com
```

---

## Part 9: Clean-Room Plugin Development

### 9.1 Plugin Development Guide

Developers creating plugins for the Fused Gaming ecosystem must follow:

1. **Independent Implementation** (no code copying from reference projects)
2. **License Compatibility** (only permissive licenses: MIT, Apache-2.0, BSD)
3. **Security Review** (sandbox permissions, input validation)
4. **Performance Baseline** (benchmark against standards)
5. **Documentation** (SKILL.md, API docs, examples)

### 9.2 Plugin Template

```bash
# Generate new plugin from template
fused-gaming-plugin create my-plugin --template=skill

# Creates:
# packages/skills/my-plugin/
# ├── package.json (with @h4shed scope)
# ├── SKILL.md
# ├── src/index.ts (skeleton)
# ├── src/tools/ (tools directory)
# ├── README.md
# └── LICENSE (Apache-2.0)
```

### 9.3 Plugin Publishing

```bash
# Tag version
npm version minor

# Verify package
fused-gaming-plugin verify

# Publish to npm
npm publish

# Register with skill registry
fused-gaming-plugin register --skill-id=skill-my-plugin
```

---

## Part 10: Rollout Plan

### Phase 1: Foundation (Weeks 1-2)
- [x] Design plugin architecture
- [ ] Implement core plugin entry point
- [ ] Implement skill registry discovery
- [ ] Build CLI interface

### Phase 2: Installation (Weeks 3-4)
- [ ] Implement Claude Desktop setup
- [ ] Implement npx installation
- [ ] Test on macOS, Linux, Windows
- [ ] Create installation documentation

### Phase 3: Licensing (Weeks 5-6)
- [ ] Implement license validation
- [ ] Implement compliance tracking
- [ ] Create license server API
- [ ] Implement enforcement logic

### Phase 4: Updates & Benchmarks (Weeks 7-8)
- [ ] Implement auto-update mechanism
- [ ] Implement context cache preservation
- [ ] Implement benchmark collection
- [ ] Create reporting dashboard

### Phase 5: Security (Weeks 9-10)
- [ ] Implement sandbox permissions
- [ ] Implement package verification
- [ ] Security audit
- [ ] Create security guidelines

### Phase 6: Release (Weeks 11-12)
- [ ] Beta testing with early adopters
- [ ] Publish to Claude.ai marketplace
- [ ] Launch documentation site
- [ ] Community onboarding

---

## Part 11: Success Metrics

| Metric | Target | Measure |
|--------|--------|---------|
| Installation success rate | > 95% | Automated setup tests |
| Average setup time | < 2 minutes | User surveys |
| Update adoption rate | > 80% | Telemetry data |
| Context cache preservation | 100% | No-regression tests |
| License compliance | > 95% | Audit logs |
| Skill discovery time | < 500ms | Benchmark metrics |
| Tool execution overhead | < 5% | Performance tests |
| User satisfaction | > 4.5/5 | NPS surveys |

---

## Part 12: Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Update breaking Claude integration | Medium | High | Extensive testing, staged rollout |
| Context cache loss during update | Low | High | Cache preservation layer, rollback mechanism |
| License server outage | Low | Medium | Offline validation mode, grace period |
| Plugin conflicts with user config | Medium | Medium | Config backup, conflict resolution UI |
| Security vulnerabilities in tools | Low | High | Sandbox isolation, package verification |
| Slow skill discovery (30+ skills) | Low | Medium | Lazy loading, caching, async initialization |

---

## Conclusion

The Claude plugin system transforms Fused Gaming from a developer-focused toolkit into a user-friendly platform. By combining:
- **Easy installation** (one command)
- **Flexible skill management** (enable/disable as needed)
- **Auto-updates** (with cache preservation)
- **Licensing** (free + commercial tiers)
- **Benchmarking** (built-in performance tracking)
- **Security** (sandboxed execution, permissions)

We enable enterprise adoption while maintaining the technical rigor of the underlying architecture.

---

**Next Steps:**
1. Review plugin architecture with team
2. Implement Phase 1 (foundation)
3. Conduct security review
4. Beta test with early adopters
5. Launch to Claude.ai marketplace

**Related Documents:**
- REPOSITORY-CREATION-PLAN.md (plugin repository setup)
- LICENSING-STRATEGY.md (license model details)
- CLEAN-ROOM.md (development guidelines)
- AUDIT-SUMMARY.md (broader architecture context)

---

**Status:** Ready for Implementation Planning  
**Owner:** Fused Gaming Architecture Team  
**Last Updated:** 2026-08-29
