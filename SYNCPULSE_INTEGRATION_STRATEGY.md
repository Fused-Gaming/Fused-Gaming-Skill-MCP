# SyncPulse Integration Strategy: Centralizing Skills

**Date:** May 3, 2026  
**Context:** User asked if daily-review, ux-journeymapper, and underworld-writer can be centralized into SyncPulse  
**Recommendation:** Plugin architecture (Option B) - Best balance between modularity and user experience

---

## Current State Analysis

### SyncPulse Architecture (Status: Production-Ready)

**File Structure:**
```
packages/skills/syncpulse/
├─ src/
│  ├─ index.ts (25 LoC - exports)
│  ├─ types/
│  │  ├─ index.ts (25 LoC)
│  │  ├─ Agent.ts (27 LoC)
│  │  ├─ Swarm.ts (29 LoC)
│  │  ├─ Task.ts (18 LoC)
│  │  ├─ Memory.ts (24 LoC)
│  │  └─ Session.ts (10 LoC)
│  ├─ services/
│  │  ├─ EmailService.ts (198 LoC) ← Core functionality
│  │  ├─ EmailTemplates.ts (458 LoC) ← 9 templates
│  │  ├─ SwarmOrchestrator.ts (151 LoC)
│  │  ├─ SessionManager.ts (119 LoC)
│  │  ├─ MemorySystem.ts (139 LoC)
│  │  └─ CacheService.ts (46 LoC)
│  └─ tools/
│     ├─ index.ts (150 LoC)
│     ├─ email-tools.ts (157 LoC)
│     └─ email-workflows.ts (460 LoC)
└─ dist/ (built output)

Total: ~2,000 LoC of implementation
```

### Candidates for Integration

#### 1. Daily Review Skill (66 LoC)
**Current State:**
- Standalone productivity tool
- Has 3 tool files (placeholder structure)
- Focus: Daily summaries and reviews

**Integration Point:** Email notifications
```typescript
// Could become:
tools/daily-review-templates.ts
└─ Daily summary templates for SyncPulse email service
```

**Effort:** 1-2 hours (just needs template definitions)

#### 2. UX Journeymapper Skill (24 LoC)
**Current State:**
- User journey visualization tool
- Has tool file with visualization logic
- Focus: Journey mapping and workflow

**Integration Point:** Visual templates for SyncPulse outputs
```typescript
// Could become:
services/VisualizationService.ts
└─ Generate journey maps as email attachments/visuals
```

**Effort:** 2-3 hours

#### 3. Underworld Writer Skill (304 LoC)
**Current State:**
- Character and world narrative generation
- Fully implemented (biggest besides SyncPulse)
- Focus: Narrative templates and story generation

**Integration Point:** Rich narrative templates
```typescript
// Could become:
services/NarrativeService.ts
└─ Narrative generation for complex workflow descriptions
```

**Effort:** 4-6 hours (most complex, significant refactor)

---

## Three Integration Options

### Option A: Keep Separate Skills ❌ Not Recommended

**Configuration:**
```bash
npm install @h4shed/skill-syncpulse
npm install @h4shed/skill-daily-review
npm install @h4shed/skill-ux-journeymapper
npm install @h4shed/skill-underworld-writer
```

**Pros:**
- Clear separation of concerns
- Each skill independent
- Easier to test in isolation

**Cons:**
- Users need 4 separate npm packages
- Duplicated dependencies (all depend on @h4shed/mcp-core)
- CLI commands scattered: `add syncpulse`, `add daily-review`, etc.
- Configuration feels fragmented
- Memory/session system duplicated

**Verdict:** Works but poor UX

---

### Option B: Plugin Architecture ✅ RECOMMENDED

**Architecture:**
```
@h4shed/skill-syncpulse (core)
  ├─ SyncPulse.ts (existing email automation)
  ├─ plugins/
  │  ├─ daily-review-plugin.ts (new)
  │  ├─ ux-journey-plugin.ts (new)
  │  └─ underworld-writer-plugin.ts (new)
  ├─ shared/
  │  ├─ PluginInterface.ts (new)
  │  ├─ SessionManager.ts (used by all)
  │  └─ MemorySystem.ts (used by all)
  └─ tools/
     ├─ email-tools.ts (existing)
     └─ plugin-tools.ts (new - aggregates all plugin tools)

Configuration (.syncpulse.config.json):
{
  "plugins": {
    "daily-review": { enabled: true },
    "ux-journey": { enabled: true },
    "underworld-writer": { enabled: true }
  }
}
```

**Installation:**
```bash
npm install @h4shed/skill-syncpulse-extended

# Automatically includes all plugins
# Users control via config or CLI:
# mcp config set plugins.daily-review.enabled true
```

**Implementation Steps:**

**Step 1: Create Plugin Interface** (2 hours)
```typescript
// services/PluginInterface.ts
export interface SyncPulsePlugin {
  id: string;
  version: string;
  initialize: (context: PluginContext) => Promise<void>;
  getTools: () => ToolDefinition[];
  onSessionStart?: (session: Session) => Promise<void>;
  onSessionEnd?: (session: Session) => Promise<void>;
  onMemoryUpdate?: (event: MemoryEvent) => Promise<void>;
}

export interface PluginContext {
  emailService: EmailService;
  sessionManager: SessionManager;
  memorySystem: MemorySystem;
  logger: Logger;
}
```

**Step 2: Convert Daily Review to Plugin** (1-2 hours)
```typescript
// plugins/daily-review-plugin.ts
export const DailyReviewPlugin: SyncPulsePlugin = {
  id: 'daily-review',
  version: '1.0.2',
  initialize: async (context) => {
    // Register with session manager
    context.sessionManager.on('session:daily-start', 
      (session) => generateDailyReview(context, session)
    );
  },
  getTools: () => [
    {
      name: 'generate-daily-review',
      description: 'Generate and email daily review summary',
      inputSchema: { /* ... */ }
    }
  ]
};

async function generateDailyReview(context, session) {
  const review = await buildReviewContent(session);
  await context.emailService.sendEmail({
    to: session.user.email,
    template: 'daily-review',
    data: { review }
  });
}
```

**Step 3: Implement Plugin Manager** (3 hours)
```typescript
// services/PluginManager.ts
export class PluginManager {
  private plugins: Map<string, SyncPulsePlugin>;
  private context: PluginContext;
  
  constructor(context: PluginContext) {
    this.context = context;
    this.plugins = new Map();
  }
  
  async registerPlugin(plugin: SyncPulsePlugin) {
    await plugin.initialize(this.context);
    this.plugins.set(plugin.id, plugin);
  }
  
  getAllTools(): ToolDefinition[] {
    const tools = [];
    for (const plugin of this.plugins.values()) {
      tools.push(...plugin.getTools());
    }
    return tools;
  }
  
  async onSessionEvent(event: 'start' | 'end', session: Session) {
    const method = event === 'start' ? 'onSessionStart' : 'onSessionEnd';
    for (const plugin of this.plugins.values()) {
      if (plugin[method]) {
        await plugin[method](session);
      }
    }
  }
}
```

**Step 4: Update SyncPulse Main** (2 hours)
```typescript
// src/index.ts
import { PluginManager } from './services/PluginManager';
import { DailyReviewPlugin } from './plugins/daily-review-plugin';
import { UXJourneyPlugin } from './plugins/ux-journey-plugin';
import { UnderWorldWriterPlugin } from './plugins/underworld-writer-plugin';

export const SyncPulse: Skill = {
  name: 'syncpulse',
  version: '0.3.0', // Bumped for plugin system
  initialize: async (config) => {
    const context: PluginContext = {
      emailService: new EmailService(),
      sessionManager: new SessionManager(),
      memorySystem: new MemorySystem(),
      logger: console
    };
    
    const pluginManager = new PluginManager(context);
    
    // Load enabled plugins from config
    if (config.plugins?.daily_review) {
      await pluginManager.registerPlugin(DailyReviewPlugin);
    }
    if (config.plugins?.ux_journey) {
      await pluginManager.registerPlugin(UXJourneyPlugin);
    }
    if (config.plugins?.underworld_writer) {
      await pluginManager.registerPlugin(UnderWorldWriterPlugin);
    }
    
    return {
      tools: pluginManager.getAllTools(),
      onSessionStart: (s) => pluginManager.onSessionEvent('start', s),
      onSessionEnd: (s) => pluginManager.onSessionEvent('end', s)
    };
  }
};
```

**Pros:**
- ✅ Single npm package for users: `npm install @h4shed/skill-syncpulse-extended`
- ✅ Each plugin independently testable
- ✅ Plugins can be hot-loaded (enable/disable without rebuild)
- ✅ Shared services (SessionManager, MemorySystem, EmailService)
- ✅ Clean separation: core SyncPulse unchanged, plugins bolt-on
- ✅ Easy to add more plugins later
- ✅ Single configuration file
- ✅ Unified CLI: `mcp config set plugins.daily-review true`

**Cons:**
- ⚠️ More complex architecture (but worth it)
- ⚠️ Plugins share state (by design)

**Effort:** ~10-12 hours total

---

### Option C: Full Merge ❌ Not Recommended

**Architecture:**
```
@h4shed/skill-syncpulse (all-in-one)
├─ Email Automation
├─ Daily Review
├─ UX Journey Visualization
├─ Underworld Writer Narrative
└─ Single config, single package
```

**Pros:**
- Single installation
- Simplest UX

**Cons:**
- ✗ Large monolithic package (~2500+ LoC)
- ✗ Tightly coupled code
- ✗ Hard to test in isolation
- ✗ Can't disable features
- ✗ Harder to maintain
- ✗ Difficult to add new skills later

**Effort:** 16-20 hours

**Verdict:** Creates technical debt, not recommended

---

## Recommended Implementation Plan (Option B)

### Week 1: Foundation (12-16 hours)
- [ ] Day 1: Design PluginInterface (2 hours)
- [ ] Day 2: Implement PluginManager (3 hours)
- [ ] Day 3: Update SyncPulse main (2 hours)
- [ ] Day 4: Tests for plugin system (3 hours)
- [ ] Day 5: Documentation (2-3 hours)

### Week 2: Daily Review Plugin (6-8 hours)
- [ ] Day 1: Convert to plugin format (2 hours)
- [ ] Day 2: Integrate with SyncPulse services (2 hours)
- [ ] Day 3: Tests + documentation (2-3 hours)

### Week 3: UX Journey Plugin (6-8 hours)
- [ ] Similar process for UX Journey skill

### Week 4: Underworld Writer Plugin (8-10 hours)
- [ ] Most complex, requires careful refactoring
- [ ] Ensure narrative service doesn't conflict

### Week 5: Integration & Polish (6-8 hours)
- [ ] End-to-end testing
- [ ] CLI enhancements
- [ ] Documentation
- [ ] Version bump to 0.3.0

**Total Time:** ~40-50 hours (5 weeks, 1 developer)

---

## Configuration & Usage

### For Users (Simple)

**Installation:**
```bash
npm install @h4shed/skill-syncpulse-extended

# Create config
mcp config init syncpulse

# Enable plugins (they're on by default)
mcp config set plugins.daily-review.enabled true
mcp config set plugins.ux-journey.enabled true
mcp config set plugins.underworld-writer.enabled true

# Or manually edit .syncpulse.config.json:
{
  "email": {
    "service": "gmail",
    "from": "your-email@gmail.com"
  },
  "plugins": {
    "daily-review": {
      "enabled": true,
      "schedule": "daily_9am"
    },
    "ux-journey": {
      "enabled": true,
      "format": "html"
    },
    "underworld-writer": {
      "enabled": true,
      "model": "claude-opus-4-7"
    }
  }
}
```

### For Developers (Extensible)

**Adding a New Plugin:**
```typescript
// Create new plugin
export const MyCustomPlugin: SyncPulsePlugin = {
  id: 'my-custom',
  version: '1.0.0',
  initialize: async (context) => {
    // Custom initialization
  },
  getTools: () => [/* tools */]
};

// Register it
await pluginManager.registerPlugin(MyCustomPlugin);
```

---

## Migration Path

### Current State
```
@h4shed/skill-syncpulse (v0.2.0)
@h4shed/skill-daily-review (v1.0.2)
@h4shed/skill-ux-journeymapper (v1.0.2)
@h4shed/skill-underworld-writer (v1.0.4)
```

### After Implementation
```
@h4shed/skill-syncpulse-extended (v0.3.0)
  └─ Includes all 4 skills as plugins

@h4shed/skill-syncpulse (v0.2.0) [deprecated]
  └─ Keep for backwards compatibility, mark @deprecated

@h4shed/skill-daily-review (v1.0.2) [deprecated]
  └─ Redirect to plugin system

@h4shed/skill-ux-journeymapper (v1.0.2) [deprecated]
  └─ Redirect to plugin system

@h4shed/skill-underworld-writer (v1.0.4) [deprecated]
  └─ Redirect to plugin system
```

### For Existing Users
```bash
# Old way (still works)
npm install @h4shed/skill-syncpulse
npm install @h4shed/skill-daily-review

# New way (recommended)
npm install @h4shed/skill-syncpulse-extended
# Automatically includes daily-review plugin
```

---

## Success Metrics

After implementation, you should have:

- ✅ Single installation: `npm install @h4shed/skill-syncpulse-extended`
- ✅ Unified configuration: `.syncpulse.config.json`
- ✅ Modular architecture: Plugins can be added/removed
- ✅ Shared services: SessionManager, MemorySystem, EmailService reused
- ✅ User-friendly: `mcp config set plugins.daily-review true`
- ✅ Developer-friendly: Easy to add new plugins
- ✅ Backwards compatible: Old packages still work
- ✅ Test coverage: Each plugin tested independently

---

## Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| Breaking existing SyncPulse users | Keep v0.2.0 available, provide migration guide |
| Plugin conflicts (state sharing) | Document shared state model clearly |
| Complex debugging (multi-plugin issues) | Add detailed logging, plugin debug mode |
| Performance (loading all plugins) | Lazy-load plugins, add config for disabled plugins |
| Test complexity | Test each plugin independently before integration |

---

## Conclusion

**Option B (Plugin Architecture) is the clear winner because:**
1. Best user experience (single install)
2. Best developer experience (modular, extensible)
3. Reasonable implementation time (~40-50 hours)
4. Sets up system for future skill integration
5. Maintains code quality and testability

**Start with this approach. Implement weekly.**

