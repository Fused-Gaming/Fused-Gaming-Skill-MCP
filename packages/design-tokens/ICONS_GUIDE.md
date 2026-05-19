# SyncPulse Icon System

Complete guide to the 24-icon system designed for the SyncPulse swarm orchestration platform.

## Overview

The SyncPulse icon system consists of 24 carefully designed SVG icons organized into 5 categories:

- **Navigation** (5 icons) - Primary UI navigation
- **Status** (6 icons) - System and operation states
- **Actions** (7 icons) - User interactions and operations
- **Agents** (4 icons) - Swarm orchestration components
- **Utility** (2 icons) - Miscellaneous UI elements

All icons are built with a consistent 24x24 viewBox and support stroke-based (outline) and filled (solid) variants.

## Installation

```bash
npm install @h4shed/design-tokens
```

## Quick Start

### Basic Usage

```tsx
import { Icon } from '@h4shed/design-tokens/icons';

// Basic icon
<Icon name="home" />

// With size and color
<Icon name="settings" size="lg" color="primary" />

// With label
<Icon name="success" size="md" color="success" title="Success" />
```

### Using Icon Grid

Display multiple icons in a responsive grid:

```tsx
import { Icon, IconGrid, IconBox } from '@h4shed/design-tokens/icons';

<IconGrid columns={4}>
  <IconBox
    icon={<Icon name="home" />}
    label="Home"
    description="Go to home"
  />
  <IconBox
    icon={<Icon name="dashboard" />}
    label="Dashboard"
    description="View dashboard"
  />
</IconGrid>
```

## Icon Categories

### Navigation Icons (5)

Used for primary navigation elements and page transitions.

| Icon | Name | Usage |
|------|------|-------|
| 🏠 | `home` | Homepage link |
| 📊 | `dashboard` | Dashboard link |
| ⚙️ | `settings` | Settings page |
| ❓ | `help` | Help/documentation |
| 🚪 | `logout` | Exit/logout |

```tsx
<Icon name="home" size="md" color="primary" />
<Icon name="dashboard" size="md" color="primary" />
<Icon name="settings" size="md" color="primary" />
<Icon name="help" size="md" color="primary" />
<Icon name="logout" size="md" color="danger" />
```

### Status Icons (6)

Display system and operation states.

| Icon | Name | Usage | Recommended Color |
|------|------|-------|-------------------|
| 🟢 | `active` | Online/running | `success` |
| ⚪ | `inactive` | Offline/stopped | `neutral` |
| ⏳ | `pending` | Loading/processing | `primary` |
| ✕ | `error` | Error state | `danger` |
| ⚠️ | `warning` | Warning state | `warning` |
| ✓ | `success` | Success state | `success` |

```tsx
// Status display
<Icon name="active" color="success" />
<Icon name="inactive" color="neutral" />
<Icon name="pending" color="primary" />
<Icon name="error" color="danger" />
<Icon name="warning" color="warning" />
<Icon name="success" color="success" />
```

### Action Icons (7)

Represent user-triggered actions and operations.

| Icon | Name | Usage |
|------|------|-------|
| ▶ | `play` | Start/execute |
| ⏸ | `pause` | Pause operation |
| ⏹ | `stop` | Stop/end |
| 🔄 | `retry` | Retry/attempt again |
| ↶ | `rollback` | Undo/revert |
| 🗑 | `delete` | Remove/delete |
| ✏️ | `edit` | Edit/modify |

```tsx
<button aria-label="Start"><Icon name="play" /></button>
<button aria-label="Pause"><Icon name="pause" /></button>
<button aria-label="Stop"><Icon name="stop" /></button>
<button aria-label="Retry"><Icon name="retry" /></button>
<button aria-label="Rollback"><Icon name="rollback" /></button>
<button aria-label="Delete"><Icon name="delete" color="danger" /></button>
<button aria-label="Edit"><Icon name="edit" /></button>
```

### Agent Icons (4)

Represent swarm orchestration components.

| Icon | Name | Role | Description |
|------|------|------|-------------|
| ⬡ | `orchestrator` | Coordinator | Manages workflow and delegation |
| 🛡 | `sentinel` | Monitor | Watches system health and security |
| 📈 | `analyst` | Analyzer | Processes data and generates insights |
| ⚡ | `executor` | Worker | Executes tasks and operations |

```tsx
// Agent display in swarm dashboard
<div className="agent-card">
  <Icon name="orchestrator" size="lg" color="primary" />
  <h3>Orchestrator</h3>
</div>

<div className="agent-card">
  <Icon name="sentinel" size="lg" color="warning" />
  <h3>Sentinel</h3>
</div>

<div className="agent-card">
  <Icon name="analyst" size="lg" color="secondary" />
  <h3>Analyst</h3>
</div>

<div className="agent-card">
  <Icon name="executor" size="lg" color="success" />
  <h3>Executor</h3>
</div>
```

### Utility Icons (2)

Miscellaneous UI elements.

| Icon | Name | Usage |
|------|------|-------|
| 🔔 | `bell` | Notifications |
| 👤 | `user` | User profile |

```tsx
<Icon name="bell" size="md" />
<Icon name="user" size="md" />
```

## Customization

### Size Variants

Three predefined sizes for responsive design:

```tsx
<Icon name="home" size="sm" />  {/* 16px */}
<Icon name="home" size="md" />  {/* 24px (default) */}
<Icon name="home" size="lg" />  {/* 32px */}
```

### Color Variants

Semantic colors that map to design tokens:

```tsx
<Icon name="home" color="primary" />      {/* Brand color */}
<Icon name="home" color="secondary" />    {/* Secondary brand */}
<Icon name="home" color="success" />      {/* Green - positive */}
<Icon name="home" color="warning" />      {/* Yellow - caution */}
<Icon name="home" color="danger" />       {/* Red - error */}
<Icon name="home" color="neutral" />      {/* Gray - neutral */}
```

### Styling

Add custom CSS classes:

```tsx
<Icon
  name="settings"
  className="cursor-pointer hover:opacity-80"
/>
```

### Accessibility

Always include proper ARIA labels:

```tsx
<Icon
  name="home"
  aria-label="Go to home page"
  title="Home"
/>

<button aria-label="Delete item">
  <Icon name="delete" color="danger" />
</button>
```

## TypeScript Support

Full TypeScript support with type checking:

```typescript
import type { IconName, IconSize, IconColor } from '@h4shed/design-tokens/icons';

const iconName: IconName = 'home'; // Type-safe
const size: IconSize = 'lg';
const color: IconColor = 'primary';
```

## Icon Registry

Access icons programmatically:

```typescript
import { iconRegistry, getAllIconNames, getIconsByCategory } from '@h4shed/design-tokens/icons';

// Get all icon names
const allIcons = getAllIconNames();
// ['home', 'dashboard', 'settings', ..., 'user']

// Get icons by category
const navigationIcons = getIconsByCategory('navigation');
const statusIcons = getIconsByCategory('status');
const actionIcons = getIconsByCategory('action');
const agentIcons = getIconsByCategory('agent');
const utilityIcons = getIconsByCategory('utility');

// Get specific icon definition
const homeIcon = iconRegistry['home'];
console.log(homeIcon.viewBox); // '0 0 24 24'
console.log(homeIcon.category); // 'navigation'
```

## Common Patterns

### Icon Button

```tsx
<button className="icon-button" aria-label="Settings">
  <Icon name="settings" size="md" />
</button>
```

### Status Indicator

```tsx
<div className="status-indicator">
  <Icon
    name={isActive ? 'active' : 'inactive'}
    color={isActive ? 'success' : 'neutral'}
  />
  <span>{isActive ? 'Online' : 'Offline'}</span>
</div>
```

### Loading State

```tsx
<div className="loading">
  <Icon name="pending" size="lg" color="primary" />
  <span>Loading...</span>
</div>
```

### Notification Badge

```tsx
<button className="notification-button">
  <Icon name="bell" size="md" />
  {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
</button>
```

### Agent Status Grid

```tsx
const agentStatuses = [
  { agent: 'orchestrator', status: 'active' },
  { agent: 'sentinel', status: 'active' },
  { agent: 'analyst', status: 'pending' },
  { agent: 'executor', status: 'inactive' },
];

<div className="agent-grid">
  {agentStatuses.map(({ agent, status }) => (
    <div key={agent} className="agent-box">
      <Icon name={agent as IconName} size="lg" />
      <Icon name={status as IconName} color={statusColor[status]} />
    </div>
  ))}
</div>
```

## Design Principles

### Consistency

- All icons use 24x24 viewBox
- Consistent stroke widths (1.5-2px)
- Unified visual style across categories

### Clarity

- Each icon has a single, clear purpose
- Immediately recognizable at all sizes
- Minimal details to reduce visual noise

### Accessibility

- Support for semantic color meanings
- Optional title attributes for tooltips
- ARIA labels for screen readers
- High contrast in all colors

### Performance

- SVG format for scalability
- Minimal path complexity
- Efficient stroke-based rendering
- No animation overhead by default

## Migration from Old Icons

If migrating from an older icon system:

```tsx
// Old
<i className="icon-home" />

// New
<Icon name="home" />
```

## Contributing

To add new icons:

1. Create SVG in `/src/icons/svg/` (24x24 viewBox)
2. Add entry to `iconRegistry` in `/src/icons/registry.ts`
3. Add TypeScript type to union in `/src/types/icons.ts`
4. Update this documentation
5. Add Storybook story

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## License

Apache 2.0 - See LICENSE file for details

## Resources

- [Design System Repository](https://github.com/fused-gaming/fused-gaming-skill-mcp)
- [SyncPulse Documentation](https://docs.syncpulse.io)
- [Icon SVG Format](https://www.w3.org/TR/SVG2/)
