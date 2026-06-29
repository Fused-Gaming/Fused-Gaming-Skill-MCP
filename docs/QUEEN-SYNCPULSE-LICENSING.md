# Queen × Syncpulse Licensing & Entitlements

## Overview
Syncpulse is deployed as modular `@h4shed/syncpulse-*` packages in Queen's package hub. Each package carries a licensing tier that Queen's entitlement engine validates at install time. This ensures free features remain unrestricted while premium capabilities are properly gated.

---

## Licensing Tiers

### Free License
**Use Rights**: Non-commercial (personal, educational, community, evaluation)  
**Allowed Packages**: Community tier only

```json
{
  "type": "free",
  "use_rights": ["non-commercial"],
  "features": {
    "max_agents": 3,
    "max_workflows": 10,
    "storage_gb": 1,
    "team_members": 1
  },
  "packages": [
    "@h4shed/syncpulse-core",
    "@h4shed/syncpulse-vision",
    "@h4shed/syncpulse-branch-manager",
    "@h4shed/syncpulse-engine",
    "@h4shed/syncpulse-agent-admin",
    "@h4shed/syncpulse-tools",
    "@h4shed/syncpulse-ui",
    "@h4shed/syncpulse-queen-client",
    "@h4shed/syncpulse-licenses"
  ]
}
```

### Team License
**Use Rights**: Commercial (business/revenue-producing use), team collaboration  
**Allowed Packages**: Free + team-tier premium

```json
{
  "type": "team",
  "use_rights": ["commercial", "team_collaboration"],
  "features": {
    "max_agents": 20,
    "max_workflows": 100,
    "storage_gb": 10,
    "team_members": 5,
    "custom_domains": true,
    "api_access": true
  },
  "packages": [
    "all free packages",
    "@h4shed/syncpulse-branch-diff",
    "@h4shed/syncpulse-rbac",
    "@h4shed/syncpulse-context-engine",
    "@h4shed/syncpulse-graph"
  ]
}
```

### Enterprise License
**Use Rights**: Commercial, unlimited team, advanced governance  
**Allowed Packages**: Free + team + enterprise tiers

```json
{
  "type": "enterprise",
  "use_rights": ["commercial", "unlimited_team", "advanced_governance"],
  "features": {
    "max_agents": "unlimited",
    "max_workflows": "unlimited",
    "storage_gb": "custom",
    "team_members": "unlimited",
    "custom_domains": true,
    "api_access": true,
    "private_catalog": true,
    "sso_saml": true,
    "audit_logs": true,
    "dedicated_support": true
  },
  "packages": [
    "all free and team packages",
    "@h4shed/syncpulse-state-manager",
    "@h4shed/syncpulse-deploy",
    "@h4shed/syncpulse-iac",
    "@h4shed/syncpulse-admin-panel"
  ]
}
```

---

## Package Registry

### Section 1: Vision & Core Concept
| Package | Tier | Version | Status | Purpose |
|---------|------|---------|--------|---------|
| `@h4shed/syncpulse-core` | Free | 1.0.0 | Ready | Core architecture, base framework |
| `@h4shed/syncpulse-vision` | Free | 1.0.0 | Ready | Extensibility framework, ADRs |

### Section 2: Feature Branch-Centric Workflow
| Package | Tier | Version | Status | Purpose |
|---------|------|---------|--------|---------|
| `@h4shed/syncpulse-branch-manager` | Free | 1.0.0 | Ready | Branch environment manager, CLI |
| `@h4shed/syncpulse-branch-diff` | Team/Enterprise | 1.0.0 | Ready | Diff viewer, merge validation |

### Section 3: Orchestration Engine
| Package | Tier | Version | Status | Purpose |
|---------|------|---------|--------|---------|
| `@h4shed/syncpulse-engine` | Free | 1.0.0 | Ready | DAG execution, step schema, flow control |
| `@h4shed/syncpulse-state-manager` | Enterprise | 1.0.0 | Ready | Enterprise state persistence, checkpointing |

### Section 4: Agent Administration Layer
| Package | Tier | Version | Status | Purpose |
|---------|------|---------|--------|---------|
| `@h4shed/syncpulse-agent-admin` | Free | 1.0.0 | Ready | Agent UI, role-based config |
| `@h4shed/syncpulse-rbac` | Team/Enterprise | 1.0.0 | Ready | Advanced RBAC, tool-level permissions |

### Section 5: Tooling System
| Package | Tier | Version | Status | Purpose |
|---------|------|---------|--------|---------|
| `@h4shed/syncpulse-tools` | Free | 1.0.0 | Ready | Tool registry, npm installer |
| `@h4shed/syncpulse-context-engine` | Team/Enterprise | 1.0.0 | Ready | Context-aware tool activation |

### Section 6: Visual Control Panel
| Package | Tier | Version | Status | Purpose |
|---------|------|---------|--------|---------|
| `@h4shed/syncpulse-ui` | Free | 1.0.0 | Ready | Dashboard components, UI library |
| `@h4shed/syncpulse-graph` | Team/Enterprise | 1.0.0 | Ready | Real-time orchestration graph, visualization |

### Queen Integration
| Package | Tier | Version | Status | Purpose |
|---------|------|---------|--------|---------|
| `@h4shed/syncpulse-queen-client` | Free | 1.0.0 | Ready | Queen license client, entitlement validation |
| `@h4shed/syncpulse-licenses` | Free | 1.0.0 | Ready | Local license storage, offline support |

---

## Entitlement Validation Workflow

### At Installation Time (SyncPulse → Queen)

```
1. User runs: npx @h4shed/syncpulse-cli install @h4shed/syncpulse-branch-diff
   
2. SyncPulse calls Queen:
   POST /api/v1/entitlements/validate
   {
     "user_id": "user-xyz",
     "package": "@h4shed/syncpulse-branch-diff",
     "version": "1.0.0",
     "use_context": "commercial"  // i.e., user is using it for business
   }

3. Queen checks:
   - User's active license (free/team/enterprise)
   - License use_rights (non-commercial vs commercial)
   - Package tier (free/team/enterprise)
   - Feature limits (agents, storage, etc.)

4. Queen responds:
   {
     "authorized": true/false,
     "reason": "team_license_granted" | "free_tier_only" | "license_expired",
     "entitlement": {
       "package": "@h4shed/syncpulse-branch-diff",
       "granted_at": "2026-06-29T00:00:00Z",
       "expires_at": "2027-06-29T00:00:00Z",
       "features_unlocked": ["multi-user_diff", "merge_validation"]
     }
   }

5. SyncPulse:
   - If authorized: install package, cache entitlement locally
   - If denied: show upgrade prompt or graceful degradation
```

### Offline Support
```
1. SyncPulse caches entitlements locally after validation
2. If offline (no Queen access), uses cached entitlement
3. On next online: re-validate and update cache
4. Graceful degradation: free features always available even if offline
```

---

## Revenue Model

### Free Tier Conversion Funnel
```
User installs SyncPulse (free)
    ↓
Uses free packages (core, engine, UI, tools)
    ↓
Discovers need for team features (branch-diff, graph, RBAC)
    ↓
Wants to use commercially (team use-rights)
    ↓
Purchases team license from Queen
    ↓
Team packages unlocked + installed
    ↓
Recurring/annual subscription revenue
```

### Pricing Strategy (Hypothetical)
```
Free: $0/mo (non-commercial)
Team: $99/mo (5 team members, 20 agents, custom domains)
Enterprise: $499/mo+ (unlimited, SSO, dedicated support)
Per-seat add-on: $20/user/mo (team members > 5)
Storage add-on: $10/100GB/mo
```

---

## Implementation Checklist (Per Release)

### Pre-Release
- [ ] New packages reviewed for licensing tier accuracy
- [ ] CHANGELOG.md lists "Free Tier" vs "Paid" per section
- [ ] VERSION.json updated in root
- [ ] package.json scopes match (`@h4shed`)

### Release
- [ ] npm publish all @h4shed/syncpulse-* packages
- [ ] Queen integration runs: register packages in hub
- [ ] For each package:
  - [ ] Package metadata updated (tier, description, version)
  - [ ] Entitlement rules defined (free/team/enterprise)
  - [ ] License validation code tested offline + online

### Post-Release
- [ ] Queen dashboard shows all packages live
- [ ] Users can discover packages via CLI: `npx @h4shed/syncpulse-cli search`
- [ ] License validation works end-to-end (test free, team, enterprise)
- [ ] Usage telemetry flowing to Queen (optional: anonymized package usage)

---

## Queen API Integration Points

### Register Package
```
POST /api/v1/packages/register
{
  "name": "@h4shed/syncpulse-branch-diff",
  "version": "1.0.0",
  "description": "...",
  "tier": "team",  // "free" | "team" | "enterprise"
  "publisher": "fused-gaming",
  "repository": "https://github.com/fused-gaming/...",
  "documentation": "https://...",
  "license": "MIT"
}
```

### Validate Entitlement
```
POST /api/v1/entitlements/validate
{
  "user_id": "...",
  "package": "@h4shed/syncpulse-branch-diff",
  "version": "1.0.0",
  "use_context": "commercial" | "non-commercial"
}

Response:
{
  "authorized": true,
  "entitlement": { ... }
}
```

### Report Usage (Optional)
```
POST /api/v1/usage/report
{
  "user_id": "...",
  "agent_id": "...",
  "package": "@h4shed/syncpulse-engine",
  "event_type": "execution_start" | "execution_complete",
  "timestamp": "2026-06-29T12:00:00Z",
  "metadata": { "agents_used": 3, "workflows": 5 }
}
```

---

## Security & Compliance

### License Validation (Fail-Closed)
- If license validation fails → deny access
- Show clear reason ("license_expired", "tier_insufficient", etc.)
- Never silently downgrade or allow expired licenses

### Entitlement Caching
- Cache entitlements locally for offline support
- TTL: 30 days (re-validate every 30 days)
- On network restore: immediate re-validation
- Old cached entitlements must re-validate before use

### Audit Trail
- Queen logs all license validations (user, package, timestamp, result)
- SyncPulse logs local entitlement cache access
- Exportable audit trail for compliance (SOC 2, etc.)

---

## Example: Section 6 Visual Panel (v1.4.0)

### Free Package
```json
{
  "name": "@h4shed/syncpulse-ui",
  "version": "1.0.0",
  "tier": "free",
  "exports": [
    "DashboardLayout",
    "AgentCard",
    "WorkflowList",
    "StatusBadge"
  ]
}
```

### Paid Package
```json
{
  "name": "@h4shed/syncpulse-graph",
  "version": "1.0.0",
  "tier": "team",
  "dependencies": ["@h4shed/syncpulse-ui"],
  "exports": [
    "OrchestrationGraph",      // Real-time DAG visualization
    "GraphAnimations",          // Advanced animations
    "CollaborativeGraph"        // Multi-user cursors
  ],
  "required_license": "team"
}
```

### Queen Rules
```json
[
  {
    "package": "@h4shed/syncpulse-ui",
    "license_tiers": ["free", "team", "enterprise"],
    "features": ["all"]
  },
  {
    "package": "@h4shed/syncpulse-graph",
    "license_tiers": ["team", "enterprise"],
    "features": ["orchestration_graph", "animations", "collaboration"],
    "requires": ["team_license_or_higher"]
  }
]
```

---

*Last updated: 2026-06-29*  
*Integrated with Queen control plane (PR #291 merged)*
