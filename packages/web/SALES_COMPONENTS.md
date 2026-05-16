# SyncPulse Sales Flow Components

Complete set of production-ready components for the SyncPulse sales and marketing landing pages.

## Components Overview

### 1. **PricingPlans** (`components/PricingPlans.tsx`)
A comprehensive pricing tier component with three tiers: Free, Pro, and Enterprise.

**Features:**
- Card-based layout with responsive grid (1 column mobile, 3 columns desktop)
- "Recommended" badge on Pro tier
- Hover animations and scale effects on featured tier
- Feature comparison matrix (checkmarks for included, X for excluded)
- Context-aware CTA buttons:
  - Free/Pro: "Get Started" / "Start Free Trial"
  - Enterprise: "Contact Sales" with optional callback
- Billing period display
- Trust badge (14-day free trial, no credit card)

**Props:**
```typescript
interface PricingPlansProps {
  onContactSales?: () => void;  // Callback when Enterprise tier CTA is clicked
}
```

**Usage:**
```tsx
import PricingPlans from '@/components/PricingPlans';

export default function Page() {
  return (
    <PricingPlans onContactSales={() => openModal()} />
  );
}
```

**Tiers Included:**
- **Free**: $0/month - Up to 3 agents, basic monitoring, community support
- **Pro**: $299/month - Up to 50 agents, advanced features (recommended)
- **Enterprise**: Custom pricing - Unlimited agents, priority support, custom integrations

---

### 2. **FeatureGrid** (`components/FeatureGrid.tsx`)
A responsive grid showcasing 6-8 key SyncPulse features.

**Features:**
- Configurable grid columns (2 or 3)
- Emoji icons with hover animation
- Feature badges (Core Feature, Premium, AI-Powered, etc.)
- Staggered animation on scroll
- Responsive to all screen sizes
- Animated accent line underline on scroll

**Props:**
```typescript
interface FeatureGridProps {
  showBadges?: boolean;  // Default: true
  columns?: 2 | 3;       // Default: 3
}
```

**Usage:**
```tsx
import FeatureGrid from '@/components/FeatureGrid';

export default function Page() {
  return <FeatureGrid columns={3} showBadges={true} />;
}
```

**Features Included:**
1. 🐝 **Swarm Orchestration** - Coordinate multiple AI agents
2. 📊 **Real-time Monitoring** - Live dashboards and metrics
3. ⚡ **Performance Optimization** - Automatic load balancing
4. 🔄 **Seamless Integration** - Connect any LLM or API
5. 🛡️ **Enterprise Security** - End-to-end encryption, compliance
6. 📈 **Advanced Analytics** - Deep insights and optimization

---

### 3. **FeaturedSection** (`components/FeaturedSection.tsx`)
Highlights main differentiators with large compelling copy and animations.

**Features:**
- Two layout variants: "default" (full) and "compact"
- Animated background elements (pulsing gradient blobs)
- Three main differentiators with icons and highlights
- Call-to-action links per differentiator
- Responsive design with staggered animations
- Supports linking to detailed docs

**Props:**
```typescript
interface FeaturedSectionProps {
  variant?: 'default' | 'compact';  // Default: 'default'
}
```

**Usage:**
```tsx
import FeaturedSection from '@/components/FeaturedSection';

export default function Page() {
  return (
    <>
      <FeaturedSection variant="default" />
      {/* or */}
      <FeaturedSection variant="compact" />
    </>
  );
}
```

**Differentiators:**
1. ⚡ **Lightning-Fast Coordination** - Sub-millisecond latency, 1000+ agents
2. 🛡️ **Military-Grade Security** - End-to-end encryption, compliance
3. 📈 **Intelligent Optimization** - ML-powered cost reduction

---

### 4. **ContactForm** (`components/ContactForm.tsx`)
Flexible contact form for capturing enterprise leads.

**Features:**
- Two variants: "full" (6-field form) and "compact" (3-field form)
- Form fields:
  - Full Name (required)
  - Email Address (required)
  - Company (required, full form only)
  - Number of Agents (dropdown, full form only)
  - Message (required)
- Success state with checkmark animation
- Loading state with disabled button
- Optional submit callback
- Auto-reset after submission
- Privacy policy link
- Responsive design with staggered animations

**Props:**
```typescript
interface ContactFormProps {
  variant?: 'full' | 'compact';  // Default: 'full'
  onSubmit?: (data: FormData) => void;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  agents: string;
  message: string;
}
```

**Usage:**
```tsx
import ContactForm from '@/components/ContactForm';

export default function Page() {
  return (
    <ContactForm 
      variant="full"
      onSubmit={(data) => {
        console.log('Form submitted:', data);
        // Send to API
      }}
    />
  );
}
```

---

## Page Routes

### `/sales` (`app/sales/page.tsx`)
Complete landing page with all sales components integrated.

**Includes:**
- Hero section with background animations
- Trust badges and CTAs
- Featured section (differentiators)
- Feature grid
- Pricing plans
- Call-to-action section
- Footer with links and social
- Contact modal for enterprise inquiries

**Navigation Links:**
- Hero CTA: `/signup?plan=free` and `/signup?plan=pro`
- Enterprise Contact: Opens modal or `/contact-sales`
- Footer: Various product, company, and legal links

---

### `/contact-sales` (`app/contact-sales/page.tsx`)
Dedicated contact sales page with form and company info.

**Includes:**
- Hero section with heading
- Left column: Contact methods and FAQ
  - Phone: +1 (555) 123-4567
  - Email: sales@syncpulse.io
  - Office location
  - Business hours
  - Quick FAQ answers
- Right column: Full contact form (sticky)
- Trust metrics section (500+ companies, 99.99% uptime, 24/7 support)

---

## Design System

### Colors (from Tailwind config)
```typescript
colors: {
  'swarm-dark': '#0a0e27',      // Primary dark background
  'swarm-accent': '#00ff88',    // Neon green for CTAs
  'swarm-secondary': '#ff006e', // Pink accent
  'swarm-tertiary': '#00d9ff',  // Cyan accent
}
```

### Key CSS Classes
- `.glow-accent` - Glowing text effect on headings
- `.glass` - Glass morphism effect
- `.glass-dark` - Dark glass effect
- Responsive: `md:`, `lg:` prefixes for Tailwind

### Animations
- `Framer Motion` for all interactive elements
- Hover effects: scale, translate, color transitions
- Scroll triggers with viewport detection
- Staggered item animations for lists
- Animated backgrounds (pulsing gradients)

---

## Integration Guide

### 1. Add to Existing Landing Page
```tsx
'use client';

import PricingPlans from '@/components/PricingPlans';
import FeatureGrid from '@/components/FeatureGrid';
import FeaturedSection from '@/components/FeaturedSection';

export default function Home() {
  return (
    <main>
      {/* ... existing content ... */}
      <FeaturedSection variant="default" />
      <FeatureGrid columns={3} />
      <PricingPlans onContactSales={() => console.log('Contact!')} />
      {/* ... footer ... */}
    </main>
  );
}
```

### 2. Use Compact Variants for Sidebars/Modals
```tsx
<FeaturedSection variant="compact" />
<ContactForm variant="compact" />
<FeatureGrid columns={2} />
```

### 3. Handle Form Submission
```tsx
import ContactForm from '@/components/ContactForm';

export default function Page() {
  const handleFormSubmit = async (data) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    // Handle response
  };

  return <ContactForm onSubmit={handleFormSubmit} />;
}
```

### 4. Customize Pricing Tiers
Edit `pricingTiers` array in `PricingPlans.tsx`:
```typescript
const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$99',
    period: 'month',
    // ... rest of tier config
  },
  // ...
];
```

### 5. Customize Features
Edit `features` array in `FeatureGrid.tsx`:
```typescript
const features: Feature[] = [
  {
    icon: '🎯',
    name: 'Your Feature',
    description: 'Feature description',
    badge: 'New',
  },
  // ...
];
```

---

## Responsive Behavior

### Mobile (< 768px)
- Single column layouts
- Larger touch targets
- Simplified hover states
- Full-width cards and forms

### Tablet (768px - 1024px)
- 2-3 column grids
- Adjusted spacing
- Medium touch targets

### Desktop (> 1024px)
- Full 3-column grids
- Hover effects enabled
- Optimal spacing
- Featured tier scale effect

---

## Accessibility

All components include:
- Semantic HTML (`<section>`, `<button>`, `<form>`, etc.)
- Proper contrast ratios (WCAG AA)
- Focus states on interactive elements
- ARIA labels where needed
- Keyboard navigation support
- Responsive text sizing

---

## Performance Optimization

- **Code Splitting**: Each component is isolated
- **Client-side Rendering**: Uses 'use client' directive
- **Lazy Animation**: Animations trigger on scroll with `viewport={{ once: true }}`
- **Motion Preferences**: Respects `prefers-reduced-motion`
- **Image Optimization**: Emoji icons (no image loading)
- **Bundle Size**: Lightweight dependencies (Framer Motion, Lucide)

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android latest

---

## Example: Full Sales Landing Page

See `/app/sales/page.tsx` for a complete example that integrates all components.

```bash
npm run dev
# Visit http://localhost:3000/sales
```

---

## Customization Tips

### Change Color Scheme
Edit `tailwind.config.ts` and update color values:
```typescript
colors: {
  'brand-primary': '#your-color',
  'brand-accent': '#your-color',
}
```

Then update components to use new color classes.

### Adjust Animation Speed
In components, change `transition={{ duration: 0.6 }}` values:
```typescript
// Faster
transition={{ duration: 0.3 }}

// Slower
transition={{ duration: 1.0 }}
```

### Hide/Show Badges
```tsx
<FeatureGrid showBadges={false} />
```

### Customize Form Fields
Edit `ContactForm.tsx` to add/remove fields from `FormData` interface and JSX.

---

## Support & Updates

For issues, feature requests, or questions about these components:
1. Check the component props interface
2. Review the usage examples
3. Ensure all dependencies are installed: `npm install`
4. Verify TypeScript compilation: `npm run typecheck`

---

**Last Updated**: 2026-05-15  
**Version**: 1.0.0  
**Status**: Production-Ready
