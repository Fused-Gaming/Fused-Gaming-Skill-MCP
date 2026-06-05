# Input Components Specification

## Component Overview

Input components provide form entry elements for user data input and interaction.

## Components

### Input (Text Field)

Single-line text input for various data types.

**Input Types:**
- `text`: Generic text input (default)
- `email`: Email validation
- `password`: Masked character input
- `number`: Numeric input
- `url`: URL input
- `tel`: Telephone number
- `search`: Search-optimized

**Sizes:**
- `xs`: 28px height
- `sm`: 32px height
- `md`: 40px height (default)
- `lg`: 48px height
- `xl`: 56px height

**States:**
- Default: Normal appearance
- Focus: Border highlight, focus ring
- Error: Red border, error message display
- Success: Green border or checkmark
- Disabled: Reduced opacity, cursor not-allowed
- Loading: Spinner in right addon

**Props:**
```typescript
type?: string;           // email, password, number, etc.
label?: string;          // Above input label
placeholder?: string;    // Input placeholder
error?: string;          // Error message below input
success?: boolean;       // Success state
inputSize?: SizeVariant; // xs|sm|md|lg|xl
iconLeft?: ReactNode;    // Icon addon left
iconRight?: ReactNode;   // Icon addon right
helperText?: string;     // Helper text below
showCharCount?: boolean; // Show char count if maxLength set
shape?: ShapeVariant;    // sharp|rounded|pill
disabled?: boolean;
required?: boolean;
maxLength?: number;
onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
className?: string;
```

**Examples:**
```tsx
<Input type="email" label="Email" placeholder="user@example.com" />
<Input
  type="text"
  label="Username"
  iconLeft={<UserIcon />}
  error="Username already taken"
/>
<Input
  type="password"
  label="Password"
  iconRight={<EyeIcon />}
  helperText="Min 8 characters"
/>
<Input
  type="text"
  maxLength={50}
  showCharCount
  helperText="Describe your project"
/>
```

### Textarea

Multi-line text input with optional auto-resize.

**Features:**
- Configurable row count
- Auto-resize to content
- Character counter
- Max length validation

**Props:**
```typescript
label?: string;
placeholder?: string;
error?: string;
rows?: number;           // Initial height
autoResize?: boolean;    // Grow with content
maxRows?: number;        // Limit when auto-resizing
maxLength?: number;
showCharCount?: boolean;
helperText?: string;
inputSize?: SizeVariant;
disabled?: boolean;
required?: boolean;
onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
className?: string;
```

**Examples:**
```tsx
<Textarea
  label="Description"
  placeholder="Enter description..."
  rows={4}
  autoResize
  maxLength={500}
  showCharCount
/>
```

### Toggle/Switch

Binary on/off choice input.

**Variants:**
- Standard toggle switch
- Optional description text
- Label positioning (left/right)

**Sizes:**
- `sm`: 32px width, 18px height
- `md`: 40px width, 22px height (default)
- `lg`: 48px width, 26px height

**Props:**
```typescript
checked?: boolean;
label?: string;
labelPosition?: 'left' | 'right';
description?: string;
toggleSize?: SizeVariant;
disabled?: boolean;
onChange?: (checked: boolean) => void;
className?: string;
'data-testid'?: string;
```

**Examples:**
```tsx
<Toggle
  checked={isEnabled}
  label="Enable notifications"
  onChange={handleChange}
/>

<Toggle
  label="Dark mode"
  labelPosition="right"
  description="Use dark theme"
/>

<Toggle
  toggleSize="lg"
  checked={agreedToTerms}
  onChange={handleAgree}
/>
```

## Validation Patterns

### Email Validation
```typescript
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

### URL Validation
```typescript
const urlPattern = /^https?:\/\/.+/;
```

### Phone Validation
```typescript
const phonePattern = /^[\d\s\-\+\(\)]+$/;
```

## Accessibility (a11y)

- ✓ Associated <label> element
- ✓ Keyboard navigation (Tab)
- ✓ Focus visible indicator
- ✓ aria-label for unlabeled inputs
- ✓ aria-describedby for helper text
- ✓ aria-invalid for error state
- ✓ Required field indicator (*)
- ✓ Error message association
- ✓ Type-appropriate input handling

## Component Hierarchy

```
InputComponents
├── Input (Single-line)
│   ├── type: text|email|password|number|url|tel|search
│   ├── size: xs|sm|md|lg|xl
│   └── addons: iconLeft, iconRight
├── Textarea (Multi-line)
│   ├── autoResize: true|false
│   └── size: xs|sm|md|lg|xl
└── Toggle (Binary)
    ├── size: sm|md|lg
    └── label position: left|right
```

## State Combinations

**Valid Input:**
- No error message
- Optional success indicator
- Normal styling

**Invalid Input:**
- Error message displayed
- Red/warning border
- Helper text replaced with error
- aria-invalid="true"

**Disabled Input:**
- Reduced opacity (0.6)
- cursor: not-allowed
- No user interaction
- Still focusable for accessibility

## Testing Checklist

- [ ] All input types work
- [ ] All sizes display correctly
- [ ] Error state shows message
- [ ] Success indicator appears
- [ ] Labels associate correctly
- [ ] Icons render properly
- [ ] Character count updates
- [ ] Auto-resize works (textarea)
- [ ] Keyboard navigation works
- [ ] Disabled state prevents input
- [ ] Focus ring visible
- [ ] onChange fires correctly
- [ ] Validation patterns work

## Notes

- Default size is `md`
- Default shape is `rounded`
- Helper text and error message use same space
- Textarea auto-resize is optional, default false
- Toggle defaults to unchecked
