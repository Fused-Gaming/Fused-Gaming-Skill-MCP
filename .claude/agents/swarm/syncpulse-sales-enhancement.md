---
name: SyncPulse Sales Enhancement Task Orchestrator
description: 4-phase task breakdown for design system enhancement swarm. Defines concrete tasks for Design System Architect, Component Specialist, Animation Specialist, and Sales Optimizer agents with memory coordination, blocking gates, and dependency sequencing.
---

# SyncPulse Sales Experience Enhancement - Agent Tasks

## Swarm Overview
4-agent hierarchical swarm coordinating through shared memory namespace: `coordination`

**Objective:** Implement issue #164 design enhancements (neon aesthetics, glassmorphism, animations) across SyncPulse sales pages.

---

## Agent Profiles & Task Assignments

### AGENT ALPHA: Design System Architect (Lead Coordinator)
**Status Memory:** `swarm/design-architect`

#### PHASE 1: Audit & Planning
**Duration:** ~30 minutes  
**Dependencies:** None (initiator)

**Task 1.1: Design Token Audit**
- File: `/home/user/Fused-Gaming-Skill-MCP/packages/skills/frontend-design/src/design-tokens.ts`
- Examine: Color system, effects (glassmorphism), shadows, glows, animations
- Document current state: Which tokens are implemented? Which are missing?
- Memory update: `swarm/shared/design-audit`

**Task 1.2: Sales Page Review**
- Pages to examine:
  - `/packages/web/app/dashboard/page.tsx`
  - `/packages/web/app/skills/page.tsx`
  - `/packages/web/app/sales/page.tsx`
  - `/packages/web/app/contact-sales/page.tsx`
  - `/packages/web/app/landing/page.tsx`
  - `/packages/web/components/LandingPage.tsx`
- Check: Current component usage, styling patterns, animation presence
- Document gaps vs issue #164 spec
- Memory update: `swarm/shared/token-gaps`

**Task 1.3: Gap Analysis & Prioritization**
- Identify missing elements:
  - Neon color palette (specific hex values)
  - Glassmorphism (blur radius, opacity values)
  - Glow effects (shadow specifications)
  - Animation definitions (durations, easing)
  - Typography consistency
- Prioritize by impact: High = hero sections, CTAs; Medium = cards; Low = minor elements
- Memory update: `swarm/shared/enhancement-priority`

**Task 1.4: Coordinate Team**
- Signal Beta to start Phase 2 when token-gaps available
- Signal Gamma to stand by for component specs from Beta
- Signal Delta to stand by for all artifacts
- Memory update: `swarm/design-architect/complete` and summary

---

### AGENT BETA: Component Enhancement Specialist
**Status Memory:** `swarm/component-specialist`

#### PHASE 2: Component Enhancement
**Duration:** ~45 minutes  
**Dependencies:** Waits for `swarm/shared/token-gaps` from Alpha

**Task 2.1: Button Enhancement**
- Current file: Identify where buttons are used (likely in `/packages/web/components/`)
- Enhancements:
  - Add neon glow effect (from tokens: buttonGlow shadow)
  - Implement gradient background (135deg, purple-pink gradient)
  - Add hover state with increased glow
  - Implement active/pressed state
  - Add transition animations (200ms ease-in-out)
- Memory update: `swarm/shared/enhanced-buttons` with:
  - CSS class definitions
  - Hover/active states
  - Gradient specifications
  - Glow radius and color

**Task 2.2: Card Component Enhancement**
- Current files: `GlassmorphCard.tsx` and any used in pages
- Enhancements:
  - Increase backdrop-filter blur to 22px
  - Apply glassmorphism with 66-76% opacity backgrounds
  - Add premium shadow (cardShadow token)
  - Enhance border with light reflection color
  - Add subtle entrance animation on load
- Memory update: `swarm/shared/enhanced-cards` with CSS patterns

**Task 2.3: Input Field Enhancement**
- Find form/input components
- Enhancements:
  - Add neon accent color on focus
  - Implement glassmorphic background (semi-transparent)
  - Add focus glow effect
  - Enhance border styling with neon color
  - Add smooth transition on focus (300ms)
- Memory update: `swarm/shared/enhanced-inputs`

**Task 2.4: Shadow & Glow System**
- Create CSS utility classes for:
  - `shadow-card` (cardShadow)
  - `shadow-button-glow` (buttonGlow)
  - `shadow-mascot-glow` (mascotGlow)
  - Neon glow variants (cyan, purple, pink)
- Memory update: `swarm/shared/shadow-glow-system` with class definitions

**Task 2.5: Component Validation**
- Verify all enhanced components work together
- Check responsive behavior
- Validate accessibility (ARIA labels, contrast)
- Memory update: `swarm/component-specialist/complete` and summary

---

### AGENT GAMMA: Animation & Effects Specialist
**Status Memory:** `swarm/animation-specialist`

#### PHASE 3: Animation & Effects
**Duration:** ~60 minutes  
**Dependencies:** Waits for `swarm/shared/enhanced-*` from Beta

**Task 3.1: Keyframe Animations**
- Create CSS animation library:
  - `pulse` - Gentle pulse for attention (4s infinite)
  - `glow-pulse` - Pulsing glow effect
  - `scanlines` - Cyberpunk scanline effect (8s infinite)
  - `flicker` - Neon flicker effect
  - `holographic-shift` - Holographic gradient animation
  - `entrance-fade-up` - 600ms entrance from below
  - `entrance-scale` - 500ms entrance with scale
- Memory update: `swarm/shared/keyframes-library` with @keyframes definitions

**Task 3.2: Motion Design Specifications**
- Define easing functions:
  - Cinematic ease: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
  - Smooth: `cubic-bezier(0.4, 0.0, 0.2, 1)`
  - Bounce: `cubic-bezier(0.68, -0.55, 0.265, 1.55)`
- Define durations:
  - Micro-interactions: 200-300ms
  - Component transitions: 300-400ms
  - Page entrance: 600-800ms
  - Continuous effects: 4-8s
- Memory update: `swarm/shared/easing-functions`

**Task 3.3: Hero Section Animations**
- Create entrance animation for hero sections:
  - Title: fade-up + scale (600ms)
  - Subtitle: fade-up with stagger (800ms)
  - CTA buttons: entrance + pulse (1000ms start)
  - Background elements: subtle parallax or glow-pulse
- Memory update: `swarm/shared/hero-animation-patterns`

**Task 3.4: CTA Button Animations**
- Hover state: glow-pulse effect + slight lift
- Active state: glow intensifies, slight scale down
- Focus state: pulsing ring effect
- Animations:
  - Hover: 300ms glow-pulse
  - Click: 200ms scale down then up
  - Disabled: reduced opacity, no animation
- Memory update: `swarm/shared/cta-animation-patterns`

**Task 3.5: Micro-interactions**
- Define interaction animations for:
  - Input focus: glow effect + underline expand
  - Card hover: lift effect + shadow increase
  - Navigation items: underline animation + subtle glow
  - Feature icons: rotation + scale on hover
- Memory update: `swarm/shared/microinteraction-specs`

**Task 3.6: Animation Validation**
- Test all animations for:
  - 60fps performance (no jank)
  - Smooth transitions between states
  - Accessibility (reduced-motion media query)
  - Cross-browser compatibility
- Memory update: `swarm/animation-specialist/complete` and summary

---

### AGENT DELTA: Sales Page Optimizer
**Status Memory:** `swarm/sales-optimizer`

#### PHASE 4: Page Implementation & Optimization
**Duration:** ~45 minutes  
**Dependencies:** Waits for all shared artifacts (Alpha audit + Beta components + Gamma animations)

**Task 4.1: Dashboard Page Enhancement**
- File: `/packages/web/app/dashboard/page.tsx`
- Enhancements:
  - Hero section: Add entrance animation + holographic gradient background
  - Metric cards: Apply enhanced card style + glow-pulse animation
  - CTA buttons: Neon gradient + pulse animation
  - Section titles: Apply typography tokens + subtle glow
- Memory update: `swarm/shared/page-dashboard-updates`

**Task 4.2: Skills Page Enhancement**
- File: `/packages/web/app/skills/page.tsx`
- Enhancements:
  - Feature cards: Glassmorphism + neon border glow
  - Skill showcase: Animated icons + pulsing highlights
  - CTA buttons: Enhanced style + hover glow
  - Section headers: Animation on scroll entrance
- Memory update: `swarm/shared/page-skills-updates`

**Task 4.3: Sales Page Enhancement**
- File: `/packages/web/app/sales/page.tsx`
- Enhancements:
  - Hero: Holographic gradient + entrance animation
  - Pricing cards: Glassmorphism + highlight on hover + glow effect
  - CTA buttons: Prominent neon styling + pulse animation
  - Comparison section: Animated feature icons + scan effect
- Memory update: `swarm/shared/page-sales-updates`

**Task 4.4: Landing & Contact Pages**
- File: `/packages/web/app/landing/page.tsx` and `/packages/web/app/contact-sales/page.tsx`
- Enhancements:
  - Hero animation: Powerful entrance with multiple staggered elements
  - Feature showcase: Cards with entrance stagger animation
  - Contact form: Input glow on focus + button animation
  - Footer: Subtle glow effects
- Memory update: `swarm/shared/page-landing-updates`

**Task 4.5: CTA Button Optimization**
- All pages: Find and enhance CTA buttons
- Changes:
  - Add neon gradient background
  - Implement pulse animation on load
  - Enhanced hover glow effect
  - Add arrow icon with slide animation
  - Ensure consistent styling across pages
- Memory update: `swarm/shared/cta-optimization-results`

**Task 4.6: Visual Consistency Check**
- Validate across all pages:
  - Color palette consistency (all neon colors matching issue #164)
  - Glassmorphism opacity/blur consistency
  - Animation timing consistency (no conflicts)
  - Typography alignment
  - Responsive design (mobile, tablet, desktop)
  - Accessibility compliance (color contrast, focus states)
- Create consistency report
- Memory update: `swarm/sales-optimizer/complete` and summary

---

## Coordination Memory Structure

All memory operations use namespace: `coordination`

### Alpha's Memory Space
```
swarm/design-architect/
  - status: "INITIALIZED" → "STARTED" → "COMPLETE"
  - role: "Design System Architect"
  - start_time: [timestamp]
  - progress: [Current phase description]
  - complete: true
  - summary: [Work completed]
```

### Beta's Memory Space
```
swarm/component-specialist/
  - status: "INITIALIZED" → "AWAITING_GAPS" → "STARTED" → "COMPLETE"
  - role: "Component Enhancement Specialist"
  - blocked_on: "swarm/shared/token-gaps"
  - progress: [Current task]
  - complete: true
  - summary: [Components enhanced]
```

### Gamma's Memory Space
```
swarm/animation-specialist/
  - status: "INITIALIZED" → "AWAITING_COMPONENTS" → "STARTED" → "COMPLETE"
  - role: "Animation & Effects Specialist"
  - blocked_on: "swarm/shared/enhanced-buttons"
  - progress: [Current task]
  - complete: true
  - summary: [Animations implemented]
```

### Delta's Memory Space
```
swarm/sales-optimizer/
  - status: "INITIALIZED" → "AWAITING_ARTIFACTS" → "STARTED" → "COMPLETE"
  - role: "Sales Page Optimizer"
  - blocked_on: ["swarm/shared/enhanced-*", "swarm/shared/animation-*"]
  - progress: [Current page]
  - complete: true
  - summary: [Pages enhanced]
```

### Shared Artifacts
```
swarm/shared/
  - design-audit: {Current state analysis}
  - token-gaps: {Missing elements list}
  - enhancement-priority: {Prioritized task list}
  - enhanced-buttons: {Button implementation specs}
  - enhanced-cards: {Card component patterns}
  - enhanced-inputs: {Input field specs}
  - shadow-glow-system: {CSS utility classes}
  - keyframes-library: {All @keyframes definitions}
  - easing-functions: {Easing cubic-bezier values}
  - hero-animation-patterns: {Hero entrance specs}
  - cta-animation-patterns: {CTA interaction specs}
  - microinteraction-specs: {All micro-interaction definitions}
  - page-dashboard-updates: {Dashboard enhancements applied}
  - page-skills-updates: {Skills page enhancements}
  - page-sales-updates: {Sales page enhancements}
  - page-landing-updates: {Landing page enhancements}
  - cta-optimization-results: {CTA enhancement results}
```

---

## Dependency Graph

```
Alpha (Audit & Planning)
  ├→ Beta (Component Enhancement) [waits for token-gaps]
  │   └→ Gamma (Animations) [waits for enhanced-*]
  │       └→ Delta (Page Optimization) [waits for all artifacts]
  └→ Delta [waits for audit completion]
```

---

## Validation Checkpoints

### Before Phase 2 Starts (Alpha → Beta)
- [ ] `swarm/shared/token-gaps` exists with complete gap list
- [ ] `swarm/shared/enhancement-priority` exists with prioritized tasks
- [ ] Alpha status = "COMPLETE"

### Before Phase 3 Starts (Beta → Gamma)
- [ ] `swarm/shared/enhanced-buttons` has button specs
- [ ] `swarm/shared/enhanced-cards` has card patterns
- [ ] `swarm/shared/enhanced-inputs` has input specs
- [ ] Beta status = "COMPLETE"

### Before Phase 4 Starts (Gamma → Delta)
- [ ] `swarm/shared/keyframes-library` has all animations
- [ ] `swarm/shared/easing-functions` has timing specs
- [ ] All animation artifacts populated
- [ ] Gamma status = "COMPLETE"

### Final Validation (Delta → Merge)
- [ ] All pages enhanced with components + animations
- [ ] Visual consistency across all pages
- [ ] Responsive design validated
- [ ] Accessibility compliance verified
- [ ] Build passes: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] Typecheck passes: `npm run typecheck`
- [ ] Delta status = "COMPLETE" with summary

---

## Success Metrics

**Design Coherence:** 100% of sales pages use issue #164 color palette + effects  
**Component Quality:** 8+ components enhanced with neon/glassmorphism  
**Animation Polish:** Hero sections + CTAs have cinematic animations  
**Code Quality:** Build/lint/typecheck all passing  
**Sales Impact:** Compelling visual experience across all customer-facing pages  

---

## Quick Reference: Key Files

| Component | File Path | Priority |
|-----------|-----------|----------|
| Design Tokens | `packages/skills/frontend-design/src/design-tokens.ts` | P1 |
| Dashboard | `packages/web/app/dashboard/page.tsx` | P1 |
| Skills Page | `packages/web/app/skills/page.tsx` | P1 |
| Sales Page | `packages/web/app/sales/page.tsx` | P1 |
| Landing | `packages/web/app/landing/page.tsx` | P2 |
| Contact Sales | `packages/web/app/contact-sales/page.tsx` | P2 |
| Components | `packages/web/components/` | P1 |
| GlassmorphCard | `packages/web/components/GlassmorphCard.tsx` | P1 |

---

**Initialization Complete:** 2026-05-17  
**Swarm Status:** READY FOR DEPLOYMENT  
**Expected Completion:** 2026-05-17 (same day)
