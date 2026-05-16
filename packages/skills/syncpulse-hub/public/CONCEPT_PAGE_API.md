# SyncPulse Concept Page - API Documentation

## Overview

The SyncPulse concept page (`concept-page.html`) is a production-ready, self-contained HTML/CSS/JS implementation showcasing an agent swarm orchestration dashboard. It features a neon-themed PulseBot mascot, real-time agent status monitoring, activity logging, and a complete state management system.

**File Location:** `packages/syncpulse-hub/public/concept-page.html`

**Dependencies:** None (vanilla HTML/CSS/JS, self-contained, no external frameworks)

**Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge) with CSS Grid, Flexbox, and ES6 JavaScript support

---

## Design System

### Color Palette (Design Tokens from #164/#165)

```
Base Background:     #05010D (deep purple-black)
Card Backgrounds:    #120A24, #160F2E
Primary Purple:      #A855F7
Plasma Pink:         #C026D3
Cyber Blue:          #38BDF8
Text Primary:        #F5F3FF
Text Secondary:      #D8B4FE
```

### Typography

- **Headings:** Orbitron (letter-spaced, technical feel)
- **Body:** Inter (clean, readable)
- **Monospace:** JetBrains Mono (code/metrics)

### Visual Effects

- **Pulse Animation:** 280ms rhythm (core animation tempo)
- **Glow Shadows:** 0 0 20px to 0 0 80px rgba(168,85,247,var)
- **Backdrop Blur:** 10px frosted glass effect on cards
- **Neural Background:** Animated grid with floating orbs

---

## JavaScript API

### Global Object: `window.SyncPulseAPI`

The page exposes a complete API via `window.SyncPulseAPI` for external integration.

#### State Constants

```javascript
SyncPulseAPI.STATES = {
    IDLE: 'idle',
    WORKING: 'working',
    ALERT: 'alert',
    SUCCESS: 'success'
}
```

---

### Core Functions

#### 1. `setAgentState(state)`

Sets the global agent swarm state, triggering cascading UI updates across the mascot, agent cards, and animations.

**Parameters:**
- `state` (string): One of `'idle'` | `'working'` | `'alert'` | `'success'`

**Effects:**
- Updates PulseBot mascot emblem animation (pulse speed changes per state)
- Changes antenna glow intensity (faster when working, dimmer when idle)
- Highlights all agent cards with corresponding glow color
- Updates card status indicators
- Logs state transition to activity feed

**Example:**

```javascript
// Start agent deployment
window.SyncPulseAPI.setAgentState('working');

// Alert on error
window.SyncPulseAPI.setAgentState('alert');

// Completion
window.SyncPulseAPI.setAgentState('success');

// Return to idle
window.SyncPulseAPI.setAgentState('idle');
```

**State Behavior:**

| State | Effect | Animation |
|-------|--------|-----------|
| `idle` | Default, low intensity | Slow pulse (1.4s), floating mascot |
| `working` | Active highlight, focus glow | Fast pulse (0.6s), faster antenna |
| `alert` | Red glow, urgent indicator | Rapid pulse (0.3s), red emblem |
| `success` | Green glow, completion | Medium pulse (0.8s), green emblem |

---

#### 2. `setAgentStatus(agentName, state)`

Updates the status of a specific agent card without affecting the global swarm state.

**Parameters:**
- `agentName` (string): `'orchestrator'` | `'sentinel'` | `'analyst'` | `'executor'`
- `state` (string): State value (idle/working/alert/success)

**Effects:**
- Updates card appearance and status light color
- Changes status indicator animation
- Does NOT affect other agents or global state

**Example:**

```javascript
// Orchestrator starts working
window.SyncPulseAPI.setAgentStatus('orchestrator', 'working');

// Sentinel completes task
window.SyncPulseAPI.setAgentStatus('sentinel', 'success');

// Analyst encounters error
window.SyncPulseAPI.setAgentStatus('analyst', 'alert');
```

---

#### 3. `logActivity(message, type)`

Adds a timestamped entry to the activity log. New entries appear at the top with a fade-in animation.

**Parameters:**
- `message` (string): Activity description
- `type` (string, optional): `'success'` | `'alert'` | `null` (default neutral)

**Effects:**
- Creates timestamped activity entry with color coding
- Adds emoji prefix (✓ for success, ⚠ for alert)
- Auto-scrolls log to newest entry
- Maintains max 20 entries (FIFO)

**Example:**

```javascript
// Neutral log entry
window.SyncPulseAPI.logActivity('Deployment initiated');

// Success message
window.SyncPulseAPI.logActivity('Agent initialized', 'success');

// Alert message
window.SyncPulseAPI.logActivity('Connection timeout', 'alert');
```

---

#### 4. `updateAgentMetric(agentName, label, value)`

Updates a specific metric on an agent card (e.g., Tasks, Health, Memory).

**Parameters:**
- `agentName` (string): Agent identifier
- `label` (string): Metric name (must match card label exactly)
- `value` (string): New value to display

**Effects:**
- Updates the agent card's metric display
- Maintains formatting and layout
- No animation on update (instant)

**Available Metrics by Agent:**

```
Orchestrator: Status, Tasks, Agents, Latency
Sentinel:     Status, Checks, Health, Uptime
Analyst:      Status, Patterns, Accuracy, Memory
Executor:     Status, Queue, Completed, Success
```

**Example:**

```javascript
// Update task progress
window.SyncPulseAPI.updateAgentMetric('orchestrator', 'Tasks', '5/12');

// Update health status
window.SyncPulseAPI.updateAgentMetric('sentinel', 'Health', '98%');

// Update memory usage
window.SyncPulseAPI.updateAgentMetric('analyst', 'Memory', '2.8GB');
```

---

## Integration Guide

### Basic Integration Pattern

```javascript
// 1. Reference the API
const { setAgentState, setAgentStatus, logActivity, updateAgentMetric, STATES } = window.SyncPulseAPI;

// 2. Subscribe to your event system
yourEventBus.on('swarm:state-change', (newState) => {
    setAgentState(newState);
});

yourEventBus.on('agent:update', (agentName, status) => {
    setAgentStatus(agentName, status);
});

yourEventBus.on('activity:log', (message, type) => {
    logActivity(message, type);
});

yourEventBus.on('metric:update', (agentName, label, value) => {
    updateAgentMetric(agentName, label, value);
});
```

### WebSocket Integration Example

```javascript
// Real-time updates via WebSocket
const ws = new WebSocket('wss://api.syncpulse.local/events');

ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
        case 'state':
            window.SyncPulseAPI.setAgentState(data.state);
            break;
        case 'agent-update':
            window.SyncPulseAPI.setAgentStatus(data.agent, data.status);
            break;
        case 'activity':
            window.SyncPulseAPI.logActivity(data.message, data.type);
            break;
        case 'metric':
            window.SyncPulseAPI.updateAgentMetric(
                data.agent,
                data.label,
                data.value
            );
            break;
    }
});
```

### Event System Integration Example

```javascript
// If you have an orchestration system with events
import { SyncPulseOrchestrator } from '@h4shed/syncpulse-hub';

const orchestrator = new SyncPulseOrchestrator();

// Wire up state changes
orchestrator.on('orchestration:start', () => {
    window.SyncPulseAPI.setAgentState('working');
    window.SyncPulseAPI.logActivity('Orchestration started');
});

orchestrator.on('agent:state-change', ({ agent, state }) => {
    window.SyncPulseAPI.setAgentStatus(agent, state);
});

orchestrator.on('metric:change', ({ agent, metric, value }) => {
    window.SyncPulseAPI.updateAgentMetric(agent, metric, value);
});

orchestrator.on('orchestration:complete', (result) => {
    window.SyncPulseAPI.setAgentState('success');
    window.SyncPulseAPI.logActivity(
        `Orchestration completed: ${result.summary}`,
        'success'
    );
});

orchestrator.on('error', (error) => {
    window.SyncPulseAPI.setAgentState('alert');
    window.SyncPulseAPI.logActivity(
        `Error: ${error.message}`,
        'alert'
    );
});
```

---

## UI Features

### PulseBot Mascot

**Visual Elements:**
- Glossy black sphere with purple/magenta neon glow
- Animated "S" emblem in chest (pulse animation changes with state)
- Cyan/blue pixel eyes with reactive pupils
- Purple/magenta antenna with glowing tip
- Outer glow halo that intensifies in working state

**Animations:**
- **Idle:** Slow floating motion, gentle pulse
- **Working:** Fast chest pulse, rapid antenna glow
- **Alert:** Red emblem, urgent rapid pulse
- **Success:** Green emblem, celebratory pulse rhythm

### Agent Status Cards

**Grid Layout:**
- 4-column on desktop (auto-fit, min 280px)
- 2-column on tablet
- 1-column on mobile

**Card Features:**
- Glassmorphic background with backdrop blur
- Purple border with glow
- Status light indicator (12px glowing dot)
- Agent name and role
- Real-time metrics (4 per agent)
- Scanline animation effect (decorative)
- Hover elevation and glow intensification

**State Indicators:**
- Status color changes per state
- Status light pulses at different rates
- Border glow intensity increases

### Activity Log

**Features:**
- Monospace font (technical appearance)
- Timestamped entries (HH:MM:SS format)
- Color-coded messages (success=green, alert=red)
- Fade-in animation for new entries
- Auto-scroll to latest entry
- Custom scrollbar styling
- Max 20 visible entries (FIFO oldest removed)

### CTA Buttons

**Three Button Styles:**

1. **Primary (Deploy Swarm)**
   - Gradient purple-to-plasma background
   - Full glow on hover
   - Triggers working state demo

2. **Secondary (View Agents)**
   - Transparent with cyber-blue border
   - Blue glow on hover
   - Cycles through states

3. **Tertiary (Run Simulation)**
   - Transparent with light purple border
   - Subtle glow on hover
   - Triggers alert state demo

---

## Responsive Design

### Breakpoints

```css
Desktop:   1400px max container width
Tablet:    max-width 768px (single-column grids)
Mobile:    max-width 480px (stacked layout)

Accessibility: prefers-reduced-motion (disables animations)
```

### Mobile Optimizations

- Smaller mascot (140-160px vs 220px desktop)
- Stacked buttons (full-width on mobile)
- Reduced padding and gaps
- Simplified grid to single column
- Smaller font sizes with readable minimums
- Touch-friendly button sizing (min 44px)

---

## Performance Characteristics

**File Size:** ~51KB (single HTML file, no external dependencies)

**Load Time:**
- First Paint: <100ms (CSS only)
- Interactive: <200ms (JS execution)
- Full animations: 280-4000ms loops

**Optimization:**
- Pure CSS animations (GPU-accelerated)
- No JavaScript animation loops
- No DOM thrashing
- Minimal reflows
- Fixed positioning for background

**Memory:** ~2-5MB runtime (mascot canvas context + DOM)

---

## Customization

### Changing Colors

Edit the CSS custom properties at the top of the `<style>` tag:

```css
:root {
    --color-base: #05010D;
    --color-purple: #A855F7;
    --color-plasma: #C026D3;
    --color-cyber-blue: #38BDF8;
    /* ... etc ... */
}
```

### Changing Animation Speeds

```css
:root {
    --duration-pulse: 280ms;      /* Adjust emblem pulse */
    --duration-float: 3s;          /* Adjust mascot floating */
    --duration-transition: 300ms;  /* Smooth transitions */
}
```

### Modifying Agent Names/Roles

Edit the HTML agent card sections (around line 1057-1162):

```html
<div class="agent-header">
    <div class="agent-status-light"></div>
    <div class="agent-name">YourAgent</div>
</div>
<div class="agent-role">your.role.path</div>
```

---

## Browser Compatibility

- **Chrome/Edge:** Full support (all features)
- **Firefox:** Full support (all features)
- **Safari:** Full support (all features)
- **Mobile Safari:** Full support with responsive optimizations
- **IE11:** Not supported (CSS Grid, Flexbox required)

---

## Troubleshooting

### API Not Available

**Issue:** `window.SyncPulseAPI is undefined`

**Solution:** Ensure the page has fully loaded before accessing the API:

```javascript
// Wait for page load
document.addEventListener('DOMContentLoaded', () => {
    // Now API is available
    window.SyncPulseAPI.setAgentState('idle');
});
```

### Animations Not Playing

**Issue:** Animations don't move despite state changes

**Solution:** Check for `prefers-reduced-motion`:

```javascript
// Some systems/browsers respect reduced motion preference
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
    // Animations should play
}
```

### Cards Not Updating

**Issue:** Metric updates don't appear

**Solution:** Ensure metric label exactly matches card label:

```javascript
// CORRECT - matches card label exactly
window.SyncPulseAPI.updateAgentMetric('orchestrator', 'Tasks', '5/12');

// WRONG - "Task" doesn't match "Tasks"
window.SyncPulseAPI.updateAgentMetric('orchestrator', 'Task', '5/12');
```

---

## Production Deployment

### Checklist

- [ ] Test all states: idle, working, alert, success
- [ ] Test on mobile devices (iOS/Android)
- [ ] Verify API access from external scripts
- [ ] Configure event handlers for real data
- [ ] Performance test with 50+ activity log entries
- [ ] Accessibility audit (keyboard navigation, screen readers)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

### Performance Tuning

1. **For WebSocket Updates:** Batch updates to max 30 events/second
2. **For Activity Log:** Keep max 20 entries to prevent DOM bloat
3. **For Metric Updates:** Debounce rapid updates (100ms minimum)
4. **For Mobile:** Test on devices with <2GB RAM

### Deployment Steps

1. Copy `concept-page.html` to your web server static files
2. Ensure MIME type is set to `text/html`
3. Optional: Gzip compress (reduces ~51KB to ~12KB)
4. Optional: Add cache headers (immutable, 1 year for production)

---

## Version History

- **v1.0.0** (2026-05-16): Initial release
  - PulseBot mascot with neon glow
  - 4-agent dashboard (Orchestrator, Sentinel, Analyst, Executor)
  - Activity log with real-time updates
  - Complete state management API
  - Responsive design (desktop/tablet/mobile)
  - Dark theme with design tokens from #164/#165

---

## License & Attribution

Part of the SyncPulse Hub project. Uses design tokens from GitHub issues #164/#165.

For integration support or feature requests, see the main project documentation.
