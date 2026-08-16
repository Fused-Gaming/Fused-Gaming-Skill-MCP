# Atomic Components Manifest

## Week 2 Sprint: 20+ Atomic React Components

### Component Categories & Implementation Status

#### 1. Buttons (4 components)
- [ ] `Button` - Primary, secondary, tertiary variants
- [ ] `IconButton` - Icon-only button
- [ ] `ButtonGroup` - Grouped button set
- [ ] `FloatingActionButton` - FAB component

#### 2. Inputs (5 components)
- [ ] `Input` - Text input with validation
- [ ] `TextArea` - Multi-line text input
- [ ] `Checkbox` - Checkbox control
- [ ] `Radio` - Radio button group
- [ ] `Select` - Dropdown select

#### 3. Cards (3 components)
- [ ] `Card` - Base card container
- [ ] `CardHeader` - Card header section
- [ ] `CardFooter` - Card footer section

#### 4. Layouts (3 components)
- [ ] `Container` - Max-width container
- [ ] `Grid` - CSS Grid wrapper
- [ ] `Flex` - Flexbox wrapper

#### 5. Typography (4 components)
- [ ] `Heading` - H1-H6 variants
- [ ] `Paragraph` - Text paragraph
- [ ] `Label` - Form label
- [ ] `Caption` - Small caption text

#### 6. Forms (2 components)
- [ ] `Form` - Form wrapper
- [ ] `FormField` - Field wrapper with label/error

#### 7. Feedback (3 components)
- [ ] `Alert` - Alert message
- [ ] `Badge` - Badge indicator
- [ ] `Chip` - Chip/tag component

#### 8. Navigation (2 components)
- [ ] `Tabs` - Tab navigation
- [ ] `Breadcrumb` - Breadcrumb navigation

#### 9. Data Display (2 components)
- [ ] `Table` - Data table
- [ ] `List` - Ordered/unordered list

#### 10. Surfaces (2 components)
- [ ] `Dialog` - Modal dialog
- [ ] `Drawer` - Side drawer/sidebar

#### 11. Utilities (1 component)
- [ ] `Loader` - Loading indicator

---

## Directory Structure

```
packages/web/components/atomic/
├── buttons/
│   ├── Button.tsx
│   ├── IconButton.tsx
│   ├── ButtonGroup.tsx
│   └── FloatingActionButton.tsx
├── inputs/
│   ├── Input.tsx
│   ├── TextArea.tsx
│   ├── Checkbox.tsx
│   ├── Radio.tsx
│   └── Select.tsx
├── cards/
│   ├── Card.tsx
│   ├── CardHeader.tsx
│   └── CardFooter.tsx
├── layouts/
│   ├── Container.tsx
│   ├── Grid.tsx
│   └── Flex.tsx
├── typography/
│   ├── Heading.tsx
│   ├── Paragraph.tsx
│   ├── Label.tsx
│   └── Caption.tsx
├── forms/
│   ├── Form.tsx
│   └── FormField.tsx
├── feedback/
│   ├── Alert.tsx
│   ├── Badge.tsx
│   └── Chip.tsx
├── navigation/
│   ├── Tabs.tsx
│   └── Breadcrumb.tsx
├── data-display/
│   ├── Table.tsx
│   └── List.tsx
├── surfaces/
│   ├── Dialog.tsx
│   └── Drawer.tsx
├── utils/
│   └── Loader.tsx
├── index.ts (barrel export)
└── MANIFEST.md (this file)
```

---

## Component Specifications

### Button
- **Props**: `variant`, `size`, `disabled`, `loading`, `onClick`
- **Variants**: `primary`, `secondary`, `tertiary`, `danger`
- **Sizes**: `sm`, `md`, `lg`
- **Test Coverage**: Click handlers, disabled state, loading state

### Input
- **Props**: `type`, `value`, `onChange`, `placeholder`, `disabled`, `error`, `required`
- **Features**: Validation feedback, error states
- **Test Coverage**: Input handling, validation

### Card
- **Props**: `variant`, `elevation`, `children`
- **Structure**: Composable with CardHeader/CardFooter
- **Test Coverage**: Rendering, composition

### Table
- **Props**: `columns`, `data`, `striped`, `hoverable`
- **Features**: Sortable columns, pagination ready
- **Test Coverage**: Data rendering, column structure

---

## Testing Strategy (80%+ Coverage Target)

### Unit Tests
- Component rendering
- Props validation
- Event handlers
- State management
- Edge cases (empty, loading, error states)

### Integration Tests
- Component composition
- Form field integration
- Table with pagination

### Snapshot Tests
- Visual regression detection

---

## Implementation Timeline

**Week 2**: Foundation
- Day 1-2: Buttons, Inputs, Cards (Phase 1)
- Day 3-4: Typography, Forms, Layouts (Phase 2)
- Day 5: Feedback, Navigation, Data Display (Phase 3)

**Estimated**: 40-50 hours total development

---

## CLI Commands (License Module - 5 Commands)

### Implemented Commands
1. `license activate <key>` - Activate license with provided key
2. `license check` - Check current license status
3. `license list` - List all active licenses
4. `license status` - Get detailed license information
5. `license renew` - Renew existing license

### CLI Directory Structure
```
packages/cli/src/commands/license/
├── index.ts (command router)
├── activate.ts
├── check.ts
├── list.ts
├── status.ts
├── renew.ts
├── types.ts (shared types)
└── tests/ (test suite - 80% target)
```

---

## Success Criteria

✓ TypeScript passes without errors (baseUrl deprecation suppressed)
✓ Lint passes (58 warnings acceptable for Week 2)
✓ Directory structure scaffolded
✓ Component manifests created
✓ 20+ components registered in index
✓ CLI commands verified
✓ Build validation passes (typecheck ✓, lint ✓)

---

## Notes

- All components use React 18 with TypeScript strict mode
- Tailwind CSS for styling
- Framer Motion for animations
- 80%+ test coverage target (unit + integration)
- Components follow atomic design principles (atom < molecule < organism)
