# SyncPulse Design Enhancement Swarm - Quick Start Guide

**Initialized**: 2026-05-17
**Status**: Ready for Agent Spawning
**Memory Namespace**: `coordination`

---

## One-Line Summary

Initialize a 4-agent hierarchical swarm to implement cyberpunk/neon sales experience enhancements across dashboard, sales, and skills pages based on Issue #164 design tokens, with mandatory memory coordination using blocking gates.

---

## Files to Reference

1. **Swarm Configuration**: `/home/user/Fused-Gaming-Skill-MCP/.claude/swarm-config-syncpulse.json`
2. **Agent Roles & Responsibilities**: `/home/user/Fused-Gaming-Skill-MCP/.claude/agents/swarm/syncpulse-design-enhancement.md`
3. **Detailed Task Breakdown**: `/home/user/Fused-Gaming-Skill-MCP/.claude/agents/swarm/agent-task-breakdown.md`
4. **Memory Protocol**: `/home/user/Fused-Gaming-Skill-MCP/.claude/agents/swarm/MEMORY_PROTOCOL.md`

---

## Swarm Topology

```
Lead Coordinator (1 agent)
├── design-system-architect (audits, gates others)
└── Subordinate Specialists (3 agents, blocked until lead completes)
    ├── component-enhancement (enhances UI components)
    ├── animation-effects (defines cinematic motion)
    └── sales-optimizer (applies to sales pages)
```

---

## Execution Steps

### Step 1: Spawn Design System Architect (Lead)
**Duration**: 45-60 minutes
**Blocks**: All other agents

Tasks:
1. Initialize status in memory
2. Audit design tokens (colors, typography, effects, shadows)
3. Analyze current sales pages
4. Identify gaps vs. token spec
5. Create implementation priority list
6. Write audit-results artifact to memory
7. Set `readyForImplementation: true` to unblock other agents

**Success Criteria**: 
- `coordination/syncpulse-design-enhancement/audit-results` exists
- `readyForImplementation: true`
- All other agents unblocked

**Output Files Modified**: None (audit only)
**Output Artifacts Written**: 
- `coordination/syncpulse-design-enhancement/audit-results`
- `coordination/syncpulse-design-enhancement/hub`

---

### Step 2: Spawn Component Enhancement Specialist (Parallel with Animation)
**Duration**: 30-45 minutes (waits for Architect)
**Blocks**: Animation & Sales Optimizer

Tasks:
1. Initialize status, wait for audit completion
2. Read audit-results from memory
3. Enhance button components (primary, secondary)
4. Enhance card components (glassmorphism)
5. Enhance input fields (neon focus states)
6. Enhance hero sections (gradients, effects)
7. Update icon system (no emojis)
8. Update badge components
9. Write component-specs artifact to memory
10. Set `readyForImplementation: true`

**Success Criteria**:
- `coordination/syncpulse-design-enhancement/component-specs` exists
- `readyForImplementation: true`
- Animation & Sales Optimizer agents unblocked

**Output Files Modified**:
- Component files (buttons, cards, inputs, badges)
- Hero section components

**Output Artifacts Written**:
- `coordination/syncpulse-design-enhancement/component-specs`

---

### Step 3: Spawn Animation & Effects Specialist (Parallel with Components)
**Duration**: 30-45 minutes (waits for Component specs)
**Blocks**: Sales Optimizer

Tasks:
1. Initialize status, wait for component specs
2. Read component-specs from memory
3. Define cinematic motion library:
   - Pulse animation (900ms)
   - Float animation (2s)
   - Scanline effect (8s)
   - Neon glow animation (1.5s)
   - Holographic shimmer (3s)
4. Define button hover sequences
5. Define hero motion sequences
6. Define card interaction animations
7. Define input focus animations
8. Write animation-library artifact to memory
9. Set `readyForImplementation: true`

**Success Criteria**:
- `coordination/syncpulse-design-enhancement/animation-library` exists
- `readyForImplementation: true`
- Sales Optimizer agent unblocked

**Output Files Modified**: None (animation library definition)

**Output Artifacts Written**:
- `coordination/syncpulse-design-enhancement/animation-library`

---

### Step 4: Spawn Sales Page Optimizer (Sequential, Last Agent)
**Duration**: 2-3 hours (waits for all specs)
**Blocks**: Nothing (final agent)

Tasks:
1. Initialize status, wait for all specs (component & animation)
2. Read all artifacts from memory
3. Enhance dashboard page:
   - Apply hero enhancements
   - Update CTAs
   - Apply card styling
   - Add animations
4. Enhance sales page (max visual impact):
   - Hero with holographic gradient + cinematic entrance
   - Pricing cards with glassmorphism + neon borders
   - Testimonials with cards + animations
   - Trust section with icons & badges
   - CTAs with glow + float
5. Enhance skills page:
   - Cards with glassmorphism
   - Icons from token system
   - Animations
6. Verify cross-page consistency:
   - All buttons unified
   - All cards unified
   - All colors from tokens
   - All animations unified
7. Optimize for visual impact
8. Validate accessibility (WCAG AA)
9. Write sales-plan artifact
10. Update hub registry with final status

**Success Criteria**:
- All sales pages enhanced and visually compelling
- 100% design system compliance
- Accessibility validated
- `readyForDeployment: true` in hub registry

**Output Files Modified**:
- `/packages/web/app/dashboard/page.tsx`
- `/packages/web/app/sales/page.tsx`
- `/packages/web/app/skills/page.tsx`

**Output Artifacts Written**:
- `coordination/syncpulse-design-enhancement/sales-plan`

---

## Key Files & Paths

### Design Token Source
`/packages/skills/frontend-design/src/design-tokens.ts`

### Sales Pages to Enhance
- `/packages/web/app/dashboard/page.tsx`
- `/packages/web/app/sales/page.tsx`
- `/packages/web/app/skills/page.tsx`
- `/packages/web/app/contact-sales/page.tsx` (if needed)

### Component Directories (Likely)
- `/packages/web/components/` (buttons, cards, inputs, etc.)
- `/packages/web/lib/` (utilities, design tokens)

### Memory Namespace
**ALL memory operations use**: `coordination/syncpulse-design-enhancement`

---

## Memory Gating Pattern

Each agent follows this pattern:

```
INITIALIZE
  ↓
CHECK DEPENDENCIES
  ↓ (if blocked)
  POLL MEMORY EVERY 10 SECONDS
  UNTIL dependency.readyForImplementation === true
  ↓ (timeout after 1 hour)
WORK ON TASKS
  ↓
WRITE ARTIFACT WITH readyForImplementation: true
  ↓
SIGNAL COMPLETION
```

---

## Parallel Execution Timeline

```
Time 0:00      Architect starts
               ↓
Time 0:45-1:00 Architect completes, unblocks others
               ├─ Component specialist starts
               └─ Animation specialist starts (waits for components)
               ↓
Time 1:15-1:45 Components complete, Animation unblocked
               ↓
Time 1:45-2:15 Animation completes, Sales Optimizer unblocked
               ↓
Time 2:15-5:15 Sales Optimizer works (can run in parallel with prep work)
               ↓
Time 5:15      All agents complete, swarm ready for deployment
```

**Estimated Total Duration**: 4-6 hours (with 3 parallel agents, saves ~1-2 hours vs sequential)

---

## Success Checklist

### Phase 1 (Architect) Complete
- [ ] `audit-results` artifact written with `readyForImplementation: true`
- [ ] Priority list created
- [ ] Hub registry updated
- [ ] All other agents unblocked

### Phase 2 (Components) Complete
- [ ] `component-specs` artifact written with `readyForImplementation: true`
- [ ] All buttons enhanced (primary, secondary)
- [ ] All cards using glassmorphism
- [ ] Input fields with neon focus states
- [ ] Hero sections with gradients and effects
- [ ] Icons using SVG system
- [ ] Animation & Sales Optimizer agents unblocked

### Phase 2 (Animation) Complete
- [ ] `animation-library` artifact written with `readyForImplementation: true`
- [ ] Pulse, float, scanline, glow, holographic animations defined
- [ ] Button hover sequences defined
- [ ] Hero motion sequences defined
- [ ] Card & input animations defined
- [ ] Sales Optimizer agent unblocked

### Phase 3 (Sales Optimizer) Complete
- [ ] Dashboard page enhanced with components and animations
- [ ] Sales page enhanced with maximum visual impact
- [ ] Skills page enhanced with consistency
- [ ] Cross-page consistency verified
- [ ] Visual impact optimized
- [ ] Accessibility validated (WCAG AA)
- [ ] `sales-plan` artifact written
- [ ] Hub registry shows `readyForDeployment: true`

### Deployment Ready
- [ ] All 4 agents complete
- [ ] 100% design system compliance confirmed
- [ ] All sales pages tested on desktop/tablet/mobile
- [ ] No hardcoded colors (all from tokens)
- [ ] All animations smooth and performant
- [ ] Ready to merge and deploy

---

## Quick Commands Reference

### Check Swarm Config
```bash
cat /home/user/Fused-Gaming-Skill-MCP/.claude/swarm-config-syncpulse.json | jq '.agents[].id'
# Output: design-system-architect, component-enhancement, animation-effects, sales-optimizer
```

### Check Swarm Status
```bash
# Read hub registry (after initialization)
# Path: coordination/syncpulse-design-enhancement/hub
```

### Check Blocking Gates
```bash
# To unblock component agent:
# Check: coordination/syncpulse-design-enhancement/audit-results
# Watch for: readyForImplementation: true

# To unblock animation agent:
# Check: coordination/syncpulse-design-enhancement/component-specs
# Watch for: readyForImplementation: true

# To unblock sales agent:
# Check: coordination/syncpulse-design-enhancement/animation-library
# Watch for: readyForImplementation: true
```

---

## Troubleshooting

### Agent Blocked Longer Than 1 Hour
1. Check hub registry for blocker details
2. Verify previous agent's output artifact exists
3. Check `readyForImplementation` field in blocking artifact
4. If missing/false, previous agent may have stalled or encountered error
5. Escalate to lead coordinator (architect)

### Memory Path Not Found
1. Verify using exact path: `coordination/syncpulse-design-enhancement/[artifact]`
2. Verify namespace is `coordination`
3. Check spelling of artifact name
4. Verify previous agent has completed and written artifact

### Artifact Exists But readyForImplementation is False
- Agent completed task but didn't set gate flag
- Agent encountered error and didn't clean up
- Manual intervention needed - review agent's output
- May need to force-complete artifact or restart agent

---

## Next Steps After Completion

1. Review all changes in `/packages/web/app/` for completeness
2. Run build verification: `npm run build --workspaces`
3. Test pages visually on all viewports
4. Verify no console errors or warnings
5. Check git diff for unexpected changes
6. Create PR with all enhancements
7. Request design review before merge
8. Deploy to staging for final visual QA
9. Merge and deploy to production

---

**Status**: Swarm Initialized and Ready
**Next Action**: Spawn Design System Architect agent
**Estimated Project Duration**: 4-6 hours
**Success Rate Target**: 100% design system compliance
