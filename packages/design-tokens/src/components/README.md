# Design System Components

Complete component library for SyncPulse design system using atomic design principles.

## Directory Structure

```
components/
├── atoms/                    # Base-level components
│   ├── buttons/             # Button variants and states
│   ├── inputs/              # Form input elements
│   ├── displays/            # Text and content display
│   ├── feedback/            # Loading and progress indicators
│   ├── structure/           # Layout containers
│   └── index.ts             # Atomic component exports
├── molecules/               # Composed components from atoms
│   ├── Card.ts
│   ├── Alert.ts
│   ├── Modal.ts
│   ├── Toast.ts
│   └── index.ts
├── layout/                  # Page-level layout components
│   └── index.ts
└── index.ts                 # Main component export
```

## Component Categories

### Atomic Components (Base Level)

#### Buttons (`atoms/buttons/`)
- **Button**: Primary clickable element
  - Variants: primary, secondary, danger, ghost
  - Sizes: xs, sm, md, lg, xl
  - States: default, hover, active, disabled, loading
  - Props: icon, iconRight, fullWidth, loading, loadingText

- **IconButton**: Icon-optimized button
  - Square shape, no text label
  - Props: icon, size, variant

- **LinkButton**: Link-styled button
  - Minimal styling for secondary actions
  - Props: icon, iconRight, variant

#### Inputs (`atoms/inputs/`)
- **Input**: Single-line text field
  - Types: text, email, password, number, url, tel, search
  - States: default, focus, error, success, disabled
  - Props: label, error, helperText, icon, iconRight, inputSize, shape

- **Textarea**: Multi-line text field
  - Features: auto-resize, character counter
  - Props: label, error, autoResize, maxRows, showCharCount, helperText

- **Toggle**: Binary on/off switch
  - States: on, off, disabled
  - Props: checked, label, labelPosition, description, toggleSize

#### Displays (`atoms/displays/`)
- **Heading**: H1-H6 semantic heading
  - Sizes: xs, sm, md, lg, xl
  - Weights: light, normal, medium, semibold, bold
  - Props: level (1-6), size, intent, textTransform, weight

- **Text**: Paragraph and body text
  - Sizes: xs, sm, md, lg, xl
  - Props: size, intent, weight, lineHeight, muted, truncate, maxLines

- **Code**: Code block and inline code
  - Features: syntax highlighting, line numbers, copyable
  - Props: language, showLineNumbers, inline, copyable

- **Icon**: SVG icon renderer
  - Sizes: xs, sm, md, lg, xl
  - Variants: outline, solid, duotone
  - Props: name, size, color, variant, animated, animation, animationDuration

- **Badge**: Small status label
  - Sizes: xs, sm, md, lg
  - Variants: primary, secondary, success, warning, danger, info, neutral
  - Props: variant, size, shape, dismissible, icon, iconRight, dot

- **Tag**: Keyword label
  - Sizes: xs, sm, md, lg, xl
  - Features: removable, colorable
  - Props: variant, size, removable, icon, shape

#### Feedback (`atoms/feedback/`)
- **Spinner**: Animated loading indicator
  - Types: spinner, dots, pulse, bounce
  - Sizes: xs, sm, md, lg, xl
  - Props: size, variant, type, speed, label, labelPosition

- **Skeleton**: Loading placeholder
  - Variants: text, circle, rectangle, thumbnail
  - Props: variant, width, height, count, animated, gap

- **Progress**: Task completion indicator
  - Sizes: xs, sm, md, lg, xl
  - Props: value, min, max, size, variant, showLabel, animated, shape

- **Divider**: Visual separator
  - Directions: horizontal, vertical
  - Styles: solid, dashed, dotted
  - Props: direction, spacing, variant, label, lineStyle

- **Chip**: Compact interactive element
  - Features: selectable, removable, avatar support
  - Sizes: xs, sm, md, lg, xl
  - Props: variant, size, selected, disabled, removable, icon, avatar

#### Structure (`atoms/structure/`)
- **Flex**: Flexbox layout container
  - Props: direction, justify, align, alignSelf, wrap, gap, grow, shrink, basis

- **Grid**: CSS Grid layout container
  - Props: columns, gap, columnGap, rowGap, autoFlow, align, justify

- **Stack**: Vertical/horizontal spacing container
  - Props: direction, spacing, align, equalWidths

### Molecule Components (Composite)

#### Card (`molecules/Card.ts`)
- Container for grouped content
- Props: elevation, bordered, borderColor, interactive, padding, shape, header, footer
- Variants: outlined, elevated, filled

#### Alert (`molecules/Alert.ts`)
- Status message container
- Variants: success, warning, error, info
- Features: dismissible, action button
- Props: variant, title, icon, dismissible, action, bordered

#### Modal (`molecules/Modal.ts`)
- Overlay dialog for focused interactions
- Features: backdrop, escape handling, focus management
- Sizes: xs, sm, md, lg, xl
- Props: isOpen, onClose, title, description, footer, backdrop, centered, size

#### Toast (`molecules/Toast.ts`)
- Temporary notification message
- Positions: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
- Duration-based auto-dismiss
- Props: message, variant, title, duration, icon, action, position

### Layout Components

Re-exported structure components for page-level layouts:
- **Flex**: Primary layout primitive
- **Grid**: Multi-column layouts
- **Stack**: Consistent spacing

## Type Exports

All component props are typed in `/src/types/components.ts`:

```typescript
import type {
  ButtonProps,
  InputProps,
  FlexProps,
  CardProps,
  // ... etc
} from '@h4shed/design-tokens/components';
```

## Component API Patterns

### Props Pattern
All components follow consistent prop patterns:

```typescript
interface ComponentProps extends Omit<HTMLAttributes, 'className'> {
  // Design system props
  variant?: IntentVariant;
  size?: SizeVariant;
  shape?: ShapeVariant;
  
  // HTML attributes
  className?: string;
  'data-testid'?: string;
  
  // Callbacks
  onChange?: (value: T) => void;
  onDismiss?: () => void;
  
  // Content
  children?: React.ReactNode;
}
```

### Variants Pattern
Consistent variant naming:
- **Intent variants**: primary, secondary, success, warning, danger, info, neutral
- **Size variants**: xs, sm, md, lg, xl
- **Shape variants**: sharp, rounded, pill

### Callback Pattern
Consistent callback naming:
- `onChange`: Value has changed
- `onSelect`: Item was selected
- `onRemove`: Item was removed
- `onDismiss`: Component was dismissed
- `onClick`: Element was clicked

## Usage Examples

### Button
```tsx
import { Button } from '@h4shed/design-tokens/components';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

### Form Input
```tsx
import { Input } from '@h4shed/design-tokens/components';

<Input
  type="email"
  label="Email"
  placeholder="Enter email"
  error={errors.email}
  onChange={handleChange}
/>
```

### Layout
```tsx
import { Flex, Stack } from '@h4shed/design-tokens/components';

<Flex direction="column" gap="md">
  <Stack direction="horizontal" spacing="sm">
    <Item>1</Item>
    <Item>2</Item>
  </Stack>
</Flex>
```

### Card with Content
```tsx
import { Card, Heading, Text, Button } from '@h4shed/design-tokens/components';

<Card elevation="medium" bordered>
  <Card.header>
    <Heading level={2}>Title</Heading>
  </Card.header>
  <Card.body>
    <Text>Card content goes here</Text>
  </Card.body>
  <Card.footer>
    <Button>Action</Button>
  </Card.footer>
</Card>
```

## Component Status

All components are currently **stub implementations** with full TypeScript typing.

### Implementation Phases
1. **Phase 1 (Current)**: Type definitions and stub exports ✓
2. **Phase 2**: React component implementations
3. **Phase 3**: CSS/styling system integration
4. **Phase 4**: Storybook documentation
5. **Phase 5**: Accessibility (a11y) audit and fixes

## Testing

Component tests should be added to respective `__tests__` directories:

```
atoms/buttons/__tests__/Button.test.tsx
molecules/__tests__/Card.test.tsx
```

## Contributing

When adding new components:

1. Define props interface in `/src/types/components.ts`
2. Create component file with stub implementation
3. Export from category `index.ts`
4. Add JSDoc comments with examples
5. Update this README with component specification
6. Implement actual component
7. Add unit and visual tests
8. Document in Storybook
