---
name: SyncPulse Design Enhancement Swarm Coordinator
description: 4-agent hierarchical swarm orchestrating design system enhancement and glassmorphism integration for SyncPulse sales pages. Coordinates Design System Architect, Component Enhancement Specialist, Animation Effects Specialist, and Sales Page Optimizer through shared memory namespace.
---

# SyncPulse Sales Experience Enhancement - Agent Swarm Configuration
**Initialized**: 2026-05-17 | **Memory Namespace**: `coordination/syncpulse-design-enhancement`

## Swarm Topology: Hierarchical Star
- **Lead Coordinator**: Design System Architect
- **Direct Reports**: Component Enhancement, Animation & Effects, Sales Optimizer
- **Shared Memory Channel**: `coordination/syncpulse-design-enhancement`

## Memory Coordination Protocol

### Initial Status Writes (On Agent Spawn)
Each agent MUST write initial status to: `swarm/[agent-name]/status`
```
{
  "agent": "design-system-architect|component-enhancement|animation-effects|sales-optimizer",
  "role": "[role description]",
  "timestamp": "ISO-8601",
  "status": "initializing",
  "taskCount": [number of tasks],
  "dependencies": ["list of shared artifacts needed"]
}
```

### Shared Memory Artifacts (Coordination Namespace)
All reads/writes use namespace: **`coordination`**

#### Hub Registry
**Path**: `coordination/syncpulse-design-enhancement/hub`
```json
{
  "swarm": "SyncPulse Sales Enhancement",
  "timestamp": "2026-05-17T00:00:00Z",
  "agents": {
    "architect": {
      "status": "active|pending|blocked",
      "lastUpdate": "ISO-8601",
      "blockers": []
    },
    "component-specialist": {
      "status": "active|pending|waiting_for_audit",
      "lastUpdate": "ISO-8601",
      "blockers": []
    },
    "animation-specialist": {
      "status": "active|pending|waiting_for_audit",
      "lastUpdate": "ISO-8601",
      "blockers": []
    },
    "sales-optimizer": {
      "status": "active|pending|waiting_for_audit",
      "lastUpdate": "ISO-8601",
      "blockers": []
    }
  }
}
```

#### Design Audit Results (Architect Output)
**Path**: `coordination/syncpulse-design-enhancement/audit-results`
```json
{
  "timestamp": "ISO-8601",
  "tokenCompliance": {
    "colorSystem": { "compliant": false, "gaps": [] },
    "typography": { "compliant": false, "gaps": [] },
    "shadows": { "compliant": false, "gaps": [] },
    "effects": { "compliant": false, "gaps": [] }
  },
  "pages": {
    "dashboard": { "status": "analyzed", "issues": [] },
    "skills": { "status": "analyzed", "issues": [] },
    "sales": { "status": "analyzed", "issues": [] },
    "landing": { "status": "analyzed", "issues": [] }
  },
  "priorityList": [
    { "component": "button", "priority": "high", "reason": "" },
    { "component": "card", "priority": "high", "reason": "" }
  ],
  "readyForImplementation": false
}
```

#### Component Enhancement Specs (Shared Blueprint)
**Path**: `coordination/syncpulse-design-enhancement/component-specs`
```json
{
  "timestamp": "ISO-8601",
  "components": {
    "button": {
      "primary": { "gradient": "", "shadow": "", "animation": "" },
      "secondary": { "gradient": "", "shadow": "", "animation": "" },
      "implementations": []
    },
    "card": { "glassmorphism": "", "shadow": "", "border": "" },
    "hero": { "gradient": "", "effects": "" },
    "input": { "border": "", "focus": "", "effects": "" }
  },
  "readyForImplementation": false
}
```

#### Motion & Animation Library
**Path**: `coordination/syncpulse-design-enhancement/animation-library`
```json
{
  "timestamp": "ISO-8601",
  "animations": {
    "pulse": { "duration": "900ms", "easing": "ease-in-out", "definition": "" },
    "scanline": { "duration": "", "easing": "" },
    "holographic": { "duration": "", "easing": "" },
    "neonGlow": { "duration": "", "easing": "" }
  },
  "cinematicMotions": {
    "heroEnter": { "duration": "", "sequence": "" },
    "buttonHover": { "duration": "", "sequence": "" }
  },
  "readyForImplementation": false
}
```

#### Sales Page Enhancement Plan
**Path**: `coordination/syncpulse-design-enhancement/sales-plan`
```json
{
  "timestamp": "ISO-8601",
  "pages": {
    "dashboard": {
      "sections": ["hero", "features", "cta"],
      "enhancements": [],
      "componentChanges": [],
      "status": "pending"
    },
    "sales": {
      "sections": ["hero", "pricing", "testimonials", "cta"],
      "enhancements": [],
      "componentChanges": [],
      "status": "pending"
    },
    "skills": {
      "sections": ["hero", "grid", "cta"],
      "enhancements": [],
      "componentChanges": [],
      "status": "pending"
    }
  },
  "readyForImplementation": false
}
```

#### Implementation Progress
**Path**: `coordination/syncpulse-design-enhancement/progress`
```json
{
  "phase": "audit|design|implementation|optimization",
  "completedTasks": [],
  "inProgressTasks": [],
  "blockedTasks": [],
  "timestamp": "ISO-8601"
}
```

---

## Agent Responsibilities & Task Breakdown

### 1. Design System Architect (LEAD)
**Memory Write Points**: Status, Audit Results, Hub Registry updates
**Dependencies**: Frontend design tokens file

#### Tasks:
1. **Audit Current Design Implementation** (BLOCKING)
   - Read `/packages/skills/frontend-design/src/design-tokens.ts`
   - Verify color palette compliance (8 neon colors: purple, electric, ultraviolet, plasma, cyberBlue, secureGreen, warningPink, plus primaries)
   - Check shadow/glow accuracy (sm, md, lg, xl, cardShadow, buttonGlow, mascotGlow)
   - Verify typography hierarchy (Orbitron headings, Inter body, JetBrains Mono code)
   - Validate effects (glassmorphism params, neon borders, holographic gradients)
   - Write results to `coordination/syncpulse-design-enhancement/audit-results`
   - **Dependency Gate**: Must complete before other agents proceed

2. **Analyze Current Sales Pages**
   - Examine `/packages/web/app/sales/page.tsx`
   - Examine `/packages/web/app/dashboard/page.tsx`
   - Examine `/packages/web/app/skills/page.tsx`
   - Document current component usage vs. token spec
   - Identify visual gaps against GitHub Issue #164 mockups
   - Create priority list: high (hero, buttons, CTAs) → medium (cards, sections) → low (minor UI)

3. **Identify Implementation Gaps**
   - Color system gaps (missing neon applications)
   - Shadow/glow deficiencies
   - Typography consistency issues
   - Effects not applied to components
   - Animation timing mismatches
   - Write to `coordination/syncpulse-design-enhancement/audit-results`

4. **Gate Other Agents**
   - Set `auditComplete: true` in hub registry only when ready
   - Component specialists wait on `audit-results.readyForImplementation`

---

### 2. Component Enhancement Specialist
**Memory Read**: Audit results (WAIT for completion)
**Memory Write**: Component specs, progress updates

#### Tasks (BLOCKED until Architect audit completes):
1. **Enhance Button Components**
   - Primary button: Apply holographic gradient `linear-gradient(135deg, #7C3AED, #C026D3)`
   - Primary shadow: `0 0 28px rgba(168,85,247,0.45)` with pulse on hover
   - Secondary button: Glassmorphism background `rgba(255,255,255,0.05)` + border `rgba(168,85,247,0.25)`
   - Implement focus states with neon glow effect
   - Write specs to `coordination/syncpulse-design-enhancement/component-specs`

2. **Enhance Card Components**
   - Apply glassmorphism: `background: linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.015))`, `backdrop-filter: blur(22px)`
   - Border: `1px solid rgba(168,85,247,0.15)` with top light border
   - Shadow: `0 24px 80px rgba(0,0,0,0.45), inset 0 0 28px rgba(168,85,247,0.06)`
   - Apply to all card surfaces: feature cards, testimonial cards, pricing cards

3. **Update Input Fields**
   - Background: `#120A24`
   - Border: `1px solid rgba(168,85,247,0.2)` → hover: `rgba(168,85,247,0.4)` → focus: `rgba(168,85,247,0.65)`
   - Text color: `#F5F3FF`
   - Placeholder: `#A78BFA`
   - Add neon glow on focus

4. **Hero Section Enhancements**
   - Background gradient: `linear-gradient(135deg, #05010D 0%, #120A24 35%, #7C3AED 100%)`
   - Apply holographic text gradient: `linear-gradient(90deg, #ffffff, #d8b4fe 42%, #C026D3)`
   - Add glassmorphism panel for headline
   - Implement grid pattern overlay: `linear-gradient(rgba(168,85,247,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.06) 1px, transparent 1px)`

5. **Icon & Badge Updates**
   - Implement neon colored badges from token system
   - Update icon rendering to use SVG icon system (not emojis)
   - Apply glow effects to action icons

---

### 3. Animation & Effects Specialist
**Memory Read**: Component specs (WAIT for completion)
**Memory Write**: Animation library, progress updates

#### Tasks (BLOCKED until Component specs ready):
1. **Define Cinematic Motion Library**
   - Pulse animation: `0 0 10px → 0 0 30px` over `900ms ease-in-out`
   - Float animation: `translateY(0px) → translateY(-6px)` over animation duration
   - Scanline effect: vertical scroll over `2s linear` infinite
   - Holographic shimmer: multi-color shift over `3s ease-in-out` infinite
   - Write to `coordination/syncpulse-design-enhancement/animation-library`

2. **Implement Cinematic Button Animations**
   - Idle: subtle pulse glow `900ms`
   - Hover: glow intensifies, text becomes brighter
   - Active/click: brief flash to full saturation then settle
   - Focus state: neon border animate-in effect

3. **Add Hero Section Motion**
   - Title entrance: fade + scale `280ms cubic-bezier(0.22, 1, 0.36, 1)`
   - Subtitle stagger: fade in `80ms` offset per word
   - CTA float: continuous float animation starting after hero loads
   - Background gradient animation: subtle hue shift over `8s`

4. **Card Interaction Animations**
   - Hover: lift effect + shadow expand `280ms smooth easing`
   - Border glow animate on hover
   - Content fade-in on mount

5. **Input Focus Animations**
   - Border color animate `160ms` to neon
   - Glow radiate outward `280ms`
   - Label/placeholder color shift

6. **Scanline & Grid Overlay Effects**
   - Implement scanline overlay animation with reduced opacity on certain pages
   - Grid pattern subtle movement (optional, for depth)

---

### 4. Sales Page Optimizer
**Memory Read**: Audit results, component specs, animation library (WAIT for all)
**Memory Write**: Sales plan, implementation progress, final optimizations

#### Tasks (BLOCKED until all specialist outputs ready):
1. **Enhance Dashboard Page**
   - Apply hero section enhancements (gradient, text gradient, glassmorphism title panel)
   - Update all CTA buttons with enhanced styles
   - Apply card styling to feature showcases
   - Add pulse animations to active metrics/statuses
   - Verify typography hierarchy matches tokens

2. **Enhance Sales Page** (Primary revenue driver)
   - Hero section: holographic gradient + cinematic text entrance
   - Pricing cards: glassmorphism + neon borders + pulse on hover
   - Testimonial cards: enhanced shadow + subtle hover animations
   - Primary CTA buttons: maximum visual impact with button glow + float animation
   - Trust badges: neon styling with icon system

3. **Enhance Skills Page**
   - Skill cards: apply glassmorphism + neon borders
   - Hover animations with glow effects
   - Icon updates to SVG system
   - Typography consistency checks

4. **Apply Consistency Across Pages**
   - Verify all pages use same button component specs
   - Ensure card styling is consistent
   - Check animation timing alignment across pages (use motion token durations)
   - Validate color palette usage (no hardcoded colors, all from tokens)

5. **Optimize for Visual Impact**
   - Ensure sufficient contrast for accessibility
   - Test neon glow effects at various viewport sizes
   - Verify animations don't cause performance issues
   - Check glassmorphism effect quality across browsers

6. **Final Validation**
   - All components match token specs
   - All pages follow design system
   - No inline styles (all from tokens)
   - Animation timings cohesive
   - Accessibility maintained

---

## Dependency Flow & Blocking Rules

```
┌─────────────────────────────────────────┐
│  1. Design System Architect (LEAD)      │
│     Audit current design & pages        │
│     → audit-results.readyForImplementation
└─────────────────┬───────────────────────┘
                  │ (blocks other agents)
        ┌─────────┴──────────────────────────┬──────────────────┬──────────────────┐
        │                                    │                  │                  │
┌───────▼──────────────────────┐  ┌────────▼──────────┐  ┌────▼─────────────────┐
│  2. Component Enhancement     │  │  3. Animation &   │  │  4. Sales Optimizer  │
│     Wait for: audit-results   │  │     Effects       │  │     Wait for ALL     │
│     Output: component-specs   │  │     Wait for:     │  │     specialists      │
└───────┬──────────────────────┘  │     component-    │  │     Input: all       │
        │ button, card, input      │     specs         │  │     shared artifacts │
        │ hero, icon, badge        │     Output:       │  └────────────────────┘
        │                          │     animation-lib │
        └──────────┬───────────────┴────────┬─────────┘
                   │                        │
        ┌──────────▼─────────────────────────▼────────────┐
        │  Shared Memory Hub (coordination namespace)     │
        │  - audit-results                                │
        │  - component-specs                              │
        │  - animation-library                            │
        │  - progress tracking                            │
        └─────────────────────────────────────────────────┘
```

---

## Progress Tracking

### Phase 1: Audit (Architect)
- [ ] Design tokens validation complete
- [ ] Current pages analyzed
- [ ] Gap identification complete
- [ ] Priority list created
- [ ] Shared memory hub initialized

### Phase 2: Design (Architects output → Specialists input)
- [ ] Component specifications finalized
- [ ] Animation library defined
- [ ] Sales enhancement plan locked

### Phase 3: Implementation (Specialists in parallel)
- [ ] Button components enhanced
- [ ] Cards updated
- [ ] Input fields styled
- [ ] Hero sections redesigned
- [ ] Animations implemented
- [ ] Sales pages optimized

### Phase 4: Validation & Optimization (All agents)
- [ ] Consistency across pages verified
- [ ] Accessibility checked
- [ ] Performance validated
- [ ] Design system compliance 100%
- [ ] Ready for deployment

---

## Key References

**Design Token Source**: `/packages/skills/frontend-design/src/design-tokens.ts`

**Sales Pages to Enhance**:
- `/packages/web/app/sales/page.tsx`
- `/packages/web/app/dashboard/page.tsx`
- `/packages/web/app/skills/page.tsx`
- `/packages/web/app/landing/page.tsx` (if exists)

**Design Specification**: GitHub Issue #164
- Color system (8 neon colors + primaries)
- Typography (Orbitron headings, Inter body)
- Effects (glassmorphism, neon borders, holographic gradients)
- Visual mockups: 9 cyberpunk/neon aesthetic examples

**Codepen Reference**: https://codepen.io/VoXelo/pen/dPMeGze

---

## Communication Rules

1. **Status updates** every task completion → `swarm/[agent-name]/progress`
2. **Blockers** written immediately to hub registry
3. **All component changes** committed to `coordination/syncpulse-design-enhancement` namespace
4. **No agent proceeds** until dependency gate satisfied
5. **Final validation** by Sales Optimizer before merge

---

## Expected Deliverables

1. **Audit Report** (Architect) - Component-by-component gaps vs. tokens
2. **Component Enhancement Specs** (Specialist) - Exact CSS/style values for each component
3. **Animation Library** (Specialist) - Reusable motion definitions
4. **Enhanced Sales Pages** (Optimizer) - Fully styled and animated pages
5. **Design System Alignment** - 100% token compliance across all pages

---

**Swarm Status**: Ready for initialization
**Lead Coordinator**: Design System Architect (Ready)
**Subordinate Agents**: Pending lead completion
**Estimated Duration**: 4-6 hours for full implementation cycle
