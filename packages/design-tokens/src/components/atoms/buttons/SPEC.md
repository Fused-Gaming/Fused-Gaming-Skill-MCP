# Button Components Specification

## Component Overview

Button components provide clickable interactive elements with multiple variants, sizes, and states for user interactions.

## Components

### Button (Primary)

Main clickable button element for primary and secondary actions.

**Variants:**
- `primary`: Default filled button (uses intent color)
- `secondary`: Outlined button (less emphasis)
- `danger`: Destructive action (red/warning color)
- `ghost`: Minimal styling, transparent background

**Sizes:**
- `xs`: 24px height, 0.75rem padding
- `sm`: 32px height, 0.875rem padding
- `md`: 40px height, 1rem padding (default)
- `lg`: 48px height, 1.25rem padding
- `xl`: 56px height, 1.5rem padding

**States:**
- Default: Normal appearance
- Hover: Slight opacity/color change
- Active/Pressed: Darker shade
- Focus: Ring outline (accessibility)
- Disabled: Reduced opacity, cursor not-allowed
- Loading: Spinner animation, text optional

**Props:**
```typescript
variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
shape?: 'sharp' | 'rounded' | 'pill';
icon?: ReactNode;        // Left icon
iconRight?: ReactNode;   // Right icon
fullWidth?: boolean;     // Stretch to container width
loading?: boolean;       // Show spinner
loadingText?: string;    // Text during loading
disabled?: boolean;      // Disabled state
className?: string;      // Custom CSS
onClick?: () => void;
```

**Examples:**
```tsx
<Button variant="primary">Primary Button</Button>
<Button variant="secondary" size="lg">Large Secondary</Button>
<Button variant="danger" icon={<DeleteIcon />}>Delete</Button>
<Button loading loadingText="Saving...">Save</Button>
<Button fullWidth>Full Width Button</Button>
```

### IconButton

Square button optimized for icon content without text labels.

**Use Cases:**
- Toolbar buttons
- Icon-only actions
- Navigation controls

**Sizes:** Same as Button (xs, sm, md, lg, xl)
**Variants:** primary, secondary, danger, ghost

**Props:**
```typescript
icon: ReactNode;      // Required icon
size?: SizeVariant;
variant?: ButtonVariant;
tooltip?: string;     // Hover tooltip
disabled?: boolean;
className?: string;
onClick?: () => void;
```

**Examples:**
```tsx
<IconButton icon={<SettingsIcon />} size="md" tooltip="Settings" />
<IconButton icon={<CloseIcon />} variant="ghost" />
<IconButton icon={<MenuIcon />} size="lg" />
```

### LinkButton

Button styled as a hyperlink for secondary or tertiary actions.

**Use Cases:**
- Secondary actions
- Alternative navigation
- Minimal emphasis

**Variants:** primary (underline), secondary, ghost
**Sizes:** inherit from text size, typically sm to md

**Props:**
```typescript
children: ReactNode;
variant?: 'primary' | 'secondary' | 'ghost';
size?: 'sm' | 'md' | 'lg';
icon?: ReactNode;
iconRight?: ReactNode;
className?: string;
onClick?: () => void;
```

**Examples:**
```tsx
<LinkButton>Learn more</LinkButton>
<LinkButton icon={<ExternalLinkIcon />}>Open in new tab</LinkButton>
<LinkButton variant="secondary">Secondary action</LinkButton>
```

## Styling System

### Colors by Variant
- **primary**: intent-color (primary color from theme)
- **secondary**: intent-color with reduced opacity or border
- **danger**: warning/error color
- **ghost**: transparent with text color

### Loading State
- Shows animated spinner (24px by default)
- Disables interactions
- Optional loading text
- Maintains button dimensions

### Disabled State
- Reduced opacity (0.5)
- Cursor: not-allowed
- No hover effects
- Still keyboard focusable

## Accessibility (a11y)

- ✓ Keyboard navigation (Tab, Enter, Space)
- ✓ Focus visible indicator (outline)
- ✓ aria-label for icon-only buttons
- ✓ aria-busy during loading
- ✓ aria-disabled for disabled state
- ✓ Semantic <button> element
- ✓ Color not only means (icon + color)

## Component Hierarchy

```
ButtonComponents
├── Button (Primary)
│   ├── variant: primary|secondary|danger|ghost
│   ├── size: xs|sm|md|lg|xl
│   └── shape: sharp|rounded|pill
├── IconButton (Square icon container)
│   ├── variant: same as Button
│   └── size: same as Button
└── LinkButton (Link-styled button)
    ├── variant: primary|secondary|ghost
    └── size: sm|md|lg
```

## Testing Checklist

- [ ] All variants render correctly
- [ ] All sizes display proper dimensions
- [ ] Loading state shows spinner
- [ ] Disabled state disables clicks
- [ ] Keyboard navigation works
- [ ] Icons render correctly (left + right)
- [ ] Full width stretches container
- [ ] Custom className applies
- [ ] onClick fires when clicked
- [ ] Accessibility attributes present

## Notes

- Default variant is `primary`
- Default size is `md`
- Default shape is `rounded`
- Loading state takes precedence over disabled
- Icons should be roughly square aspect ratio
