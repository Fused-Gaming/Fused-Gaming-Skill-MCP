# SyncPulse Swarm - Memory Coordination Protocol

**Namespace**: `coordination`
**Parent Path**: `syncpulse-design-enhancement`
**All paths relative to namespace root**

---

## Memory Operations Reference

### WRITE Status Updates
Agent MUST write status on initialization and after every major task.

```javascript
// On agent initialization
WRITE to: `swarm/[agent-name]/status`
{
  "agent": "design-system-architect|component-enhancement|animation-effects|sales-optimizer",
  "status": "active|complete|blocked|waiting",
  "phase": "[current-phase]",
  "timestamp": new Date().toISOString(),
  "taskCount": N,
  "tasksCompleted": N,
  "blockers": []
}
```

### READ Blocking Gate Artifacts
Before proceeding, agents MUST check if they are blocked.

```javascript
// Component-enhancement agent startup
const auditResults = READ `coordination/syncpulse-design-enhancement/audit-results`

// POLL with timeout
const waitUntilAuditComplete = async () => {
  const maxRetries = 60 // 10 minutes at 10s intervals
  let retries = 0
  
  while (retries < maxRetries) {
    const audit = READ `coordination/syncpulse-design-enhancement/audit-results`
    if (audit.readyForImplementation === true) {
      return audit
    }
    retries++
    await sleep(10000) // Wait 10 seconds
  }
  
  throw new Error("Audit timeout exceeded")
}
```

### WRITE Artifact Outputs
After completing a major phase, write the output artifact.

```javascript
// Component enhancement agent finishing
WRITE to: `coordination/syncpulse-design-enhancement/component-specs`
{
  "timestamp": new Date().toISOString(),
  "components": {
    "button": { /* detailed specs */ },
    "card": { /* detailed specs */ },
    "input": { /* detailed specs */ },
    "hero": { /* detailed specs */ }
  },
  "allComponentsUpdated": true,
  "readyForImplementation": true
}
```

### UPDATE Hub Registry
Lead coordinator updates shared hub status.

```javascript
// Update hub on status changes
WRITE to: `coordination/syncpulse-design-enhancement/hub`
{
  "timestamp": new Date().toISOString(),
  "agents": {
    "design-system-architect": {
      "status": "complete|active|blocked",
      "lastUpdate": "ISO-8601",
      "tasksCompleted": N,
      "blockers": []
    },
    "component-enhancement": {
      "status": "unblocked|blocked|active",
      "dependencyMet": true|false
    },
    // ... other agents
  }
}
```

---

## Memory Paths - Complete Reference

### Status Tracking (Individual Agent)
```
swarm/design-system-architect/status
swarm/component-enhancement/status
swarm/animation-effects/status
swarm/sales-optimizer/status
```

### Progress Tracking (Individual Agent)
```
swarm/design-system-architect/progress
swarm/component-enhancement/progress
swarm/animation-effects/progress
swarm/sales-optimizer/progress
```

### Shared Coordination Artifacts
```
coordination/syncpulse-design-enhancement/hub              (READ by all, WRITE by architect)
coordination/syncpulse-design-enhancement/audit-results    (BLOCKING GATE 1)
coordination/syncpulse-design-enhancement/component-specs  (BLOCKING GATE 2)
coordination/syncpulse-design-enhancement/animation-library (BLOCKING GATE 3)
coordination/syncpulse-design-enhancement/sales-plan       (OUTPUT artifact)
coordination/syncpulse-design-enhancement/progress         (SHARED progress)
```

---

## Blocking Gate Pattern

### Gate 1: Audit Results (Architect Output)
```json
{
  "readyForImplementation": false,  // Changes to true when complete
  "auditComplete": false,
  "tokenCompliance": { /* compliance data */ },
  "pages": { /* page analysis */ },
  "priorityList": [ /* ordered by priority */ ]
}
```

**Blocked Agents**: component-enhancement, animation-effects, sales-optimizer

**Pattern**:
```javascript
while (true) {
  const audit = READ `coordination/syncpulse-design-enhancement/audit-results`
  if (audit.readyForImplementation === true) {
    PROCEED_WITH_WORK()
    break
  }
  sleep(10000) // Wait 10 seconds, retry
}
```

### Gate 2: Component Specifications (Component-Enhancement Output)
```json
{
  "readyForImplementation": false,  // Changes to true when complete
  "components": { /* component specs */ },
  "allComponentsUpdated": false
}
```

**Blocked Agents**: animation-effects, sales-optimizer

### Gate 3: Animation Library (Animation-Effects Output)
```json
{
  "readyForImplementation": false,  // Changes to true when complete
  "animations": { /* animation definitions */ },
  "cinematicSequences": { /* motion sequences */ }
}
```

**Blocked Agents**: sales-optimizer

---

## Dependency Flow Chart

```
┌─────────────────────────────────────────┐
│ ARCHITECT starts immediately            │
│ Phase: Audit (45-60 min)                │
│ → Writes: audit-results                 │
│ → Sets: readyForImplementation = true   │
└─────────────┬───────────────────────────┘
              │ (Unblocks all agents)
    ┌─────────┴──────────────────────────┬─────────────┐
    │                                    │             │
┌───▼──────────────────┐  ┌─────────────▼──────────┐  │
│ COMPONENT-ENH waits  │  │ ANIMATION waits        │  │
│ Phase: Design (30m)  │  │ Phase: Design (30m)    │  │
│ → Reads: audit       │  │ → Reads: audit         │  │
│ → Writes: specs      │  │ → Reads: specs (wait)  │  │
│ → Sets: ready = true │  │ → Writes: animations   │  │
└───┬──────────────────┘  │ → Sets: ready = true   │  │
    │ (Unblocks anim)     └─────────────┬──────────┘  │
    │                                    │             │
    └────────────────────┬───────────────┘             │
                         │                             │
                  ┌──────▼──────────────────────┐     │
                  │ SALES-OPT waits for all     │     │
                  │ Phase: Impl (2-3 hours)     │     │
                  │ → Reads: audit              │     │
                  │ → Reads: specs              │     │
                  │ → Reads: animations         │     │
                  │ → Applies all to pages      │     │
                  │ → Writes: sales-plan        │     │
                  │ → Sets: ready = true        │     │
                  └─────────────────────────────┘     │
                                                       │
                                              ┌────────▼─┐
                                              │ COMPLETE │
                                              └──────────┘
```

---

## MANDATORY Protocol Rules

### Rule 1: Status Initialization
EVERY agent MUST write initial status immediately on startup:
```javascript
WRITE `swarm/[agent-name]/status` { status: "active", ... }
```

### Rule 2: Blocking Gate Polling
Agent blocked by gate MUST poll memory with 10-second intervals:
```javascript
for (let i = 0; i < 360; i++) {  // 1 hour timeout
  const gate = READ `coordination/.../[gate-artifact]`
  if (gate.readyForImplementation === true) return gate
  await sleep(10000)
}
throw new Error("Blocking gate timeout")
```

### Rule 3: Artifact Completion Flag
Agent completing phase MUST set `readyForImplementation: true`:
```javascript
WRITE `coordination/syncpulse-design-enhancement/[artifact]`
{
  // ... all content fields ...
  "readyForImplementation": true  // CRITICAL
}
```

### Rule 4: Hub Updates on Change
Coordinator MUST update hub registry when agent status changes:
```javascript
// Always after major state changes
WRITE `coordination/syncpulse-design-enhancement/hub` {
  agents: {
    [agent-name]: { status: "...", lastUpdate: ISO, ... },
    ...
  }
}
```

### Rule 5: No Direct Agent Communication
Agents communicate ONLY through memory. No direct message passing.

### Rule 6: Timestamps on All Writes
All memory writes MUST include ISO-8601 timestamp.

### Rule 7: Final Signals
Completing agent MUST write:
```javascript
WRITE `swarm/[agent-name]/status`
{
  status: "complete",
  phase: "...",
  nextAgentUnblocked: "[next-agent-name]",
  timestamp: ISO
}
```

---

## Error & Recovery

### Timeout Recovery
If agent times out waiting for gate:
```javascript
try {
  await waitForGate(60 * 60 * 1000) // 1 hour
} catch (e) {
  WRITE `coordination/syncpulse-design-enhancement/hub` {
    blockers: [{
      agent: "[this-agent]",
      issue: "Gate timeout",
      timestamp: ISO,
      waitingFor: "[blocking-agent]"
    }]
  }
  throw e // Escalate
}
```

### Missing Artifact Recovery
If expected artifact missing:
```javascript
const artifact = READ `coordination/.../[artifact]`
if (!artifact || !artifact.readyForImplementation) {
  WRITE `coordination/syncpulse-design-enhancement/hub` {
    blockers: [{
      agent: "[this-agent]",
      issue: "Artifact missing or incomplete",
      missingArtifact: "[artifact-path]",
      timestamp: ISO
    }]
  }
  throw new Error("Dependency artifact incomplete")
}
```

---

## Testing the Protocol

### Minimal Test Case
```javascript
// Initialize all agents' status
WRITE swarm/design-system-architect/status { status: "active" }

// Architect completes
WRITE coordination/syncpulse-design-enhancement/audit-results { readyForImplementation: true }

// Component agent wakes up
const audit = READ coordination/syncpulse-design-enhancement/audit-results
// Should return with readyForImplementation: true

// Agent completes
WRITE coordination/syncpulse-design-enhancement/component-specs { readyForImplementation: true }

// Animation agent unblocked
const specs = READ coordination/syncpulse-design-enhancement/component-specs
// Should return with readyForImplementation: true

// ... and so on
```

---

## Memory Cleanup (After Completion)

Once swarm completes successfully, artifacts remain in memory for:
- Reference by future agents
- Audit trail
- Documentation

Keep all coordination paths intact for 30 days minimum.

