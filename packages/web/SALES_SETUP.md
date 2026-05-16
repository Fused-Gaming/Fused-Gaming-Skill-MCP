# SyncPulse Sales Components - Setup Checklist

Complete guide to set up and deploy the SyncPulse sales flow components.

## Pre-Flight Checklist

### Environment Setup
- [ ] Node.js 18.x or higher installed
- [ ] npm or yarn available
- [ ] Working in `/packages/web` directory
- [ ] Git repository initialized

### Dependencies
- [ ] Run `npm install` to install all dependencies
- [ ] Verify `framer-motion` is installed (`npm list framer-motion`)
- [ ] Verify `lucide-react` is installed (`npm list lucide-react`)
- [ ] Verify `next` is installed (`npm list next`)

## Component Integration

### Option 1: Use Complete Sales Landing Page (Recommended)
The `/sales` page includes all components pre-integrated.

```bash
# Development
npm run dev
# Visit: http://localhost:3000/sales
```

**Files involved:**
- `app/sales/page.tsx` - Main landing page
- All component files

### Option 2: Add Components to Existing Page

#### Step 1: Import Components
```tsx
'use client';

import PricingPlans from '@/components/PricingPlans';
import FeatureGrid from '@/components/FeatureGrid';
import FeaturedSection from '@/components/FeaturedSection';
import ContactForm from '@/components/ContactForm';
```

#### Step 2: Add to Your Page JSX
```tsx
export default function YourPage() {
  return (
    <main>
      {/* Existing content */}
      
      <FeaturedSection variant="default" />
      <FeatureGrid columns={3} />
      <PricingPlans />
      
      {/* Footer */}
    </main>
  );
}
```

#### Step 3: Verify Styling
Ensure your page has the dark theme background:
```tsx
<main className="min-h-screen bg-gradient-to-br from-swarm-dark via-slate-900 to-swarm-dark">
```

## Configuration

### Update Contact Information
Edit `/app/contact-sales/page.tsx`:
```typescript
// Find and update these values:
href="tel:+1-555-123-4567"           // Phone number
href="mailto:sales@syncpulse.io"     // Email address

// Address section:
123 Innovation Drive
San Francisco, CA 94105

// Hours:
Monday–Friday: 9am–6pm EST
```

### Customize Pricing Tiers
Edit `/components/PricingPlans.tsx`:
```typescript
const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',           // Change tier name
    price: '$99',              // Change price
    period: 'month',           // Change period (month, year)
    cta: 'Get Started',        // Change button text
    ctaHref: '/signup',        // Change CTA link
    features: [
      { name: 'Your feature', included: true },
      // Add or remove features
    ],
  },
  // ...
];
```

### Customize Features List
Edit `/components/FeatureGrid.tsx`:
```typescript
const features: Feature[] = [
  {
    icon: '🎯',                        // Change emoji
    name: 'Your Feature Name',         // Change name
    description: 'Description here',   // Change description
    badge: 'New',                      // Change badge
  },
  // ...
];
```

### Customize Differentiators
Edit `/components/FeaturedSection.tsx`:
```typescript
const differentiators: FeaturedDifferentiator[] = [
  {
    icon: <Zap className="w-12 h-12" />,  // Change icon
    title: 'Your Title',
    description: 'Your description',
    highlights: ['Highlight 1', 'Highlight 2'],
    cta: { label: 'Learn More', href: '/docs' },
  },
  // ...
];
```

## Styling Customization

### Color Scheme
Update in `/tailwind.config.ts`:
```typescript
colors: {
  'swarm-dark': '#0a0e27',      // Change dark bg
  'swarm-accent': '#00ff88',    // Change accent (CTAs)
  'swarm-secondary': '#ff006e', // Change secondary
  'swarm-tertiary': '#00d9ff',  // Change tertiary
}
```

Then update component references:
```tsx
className="glow-accent"           // Uses accent color
className="bg-swarm-accent"       // Uses accent color
className="text-swarm-secondary"  // Uses secondary color
```

### Animation Speed
Adjust animation timing by changing `duration` values:
```typescript
// In any component
transition={{ duration: 0.6 }}  // Default
transition={{ duration: 0.3 }}  // Faster
transition={{ duration: 1.0 }}  // Slower
```

### Responsive Breakpoints
Tailwind breakpoints already configured:
- `sm`: 640px
- `md`: 768px (primary breakpoint)
- `lg`: 1024px
- `xl`: 1280px

Use in components:
```tsx
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

## Form Handling

### Basic Setup
The ContactForm component includes a demo submit handler. To connect to your backend:

```tsx
import ContactForm from '@/components/ContactForm';

export default function Page() {
  const handleSubmit = async (data) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit');
      }
      
      // Success - component will show success state
    } catch (error) {
      console.error('Submission error:', error);
      // Handle error
    }
  };

  return <ContactForm onSubmit={handleSubmit} />;
}
```

### Create API Endpoint
Create `/app/api/contact/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();
  
  // Process form data:
  // - Send email via SendGrid/Mailgun/etc
  // - Store in database
  // - Create CRM lead
  
  return NextResponse.json(
    { success: true, message: 'Thank you for your inquiry' },
    { status: 200 }
  );
}
```

### Form Data Structure
```typescript
interface FormData {
  name: string;          // Full name
  email: string;         // Email address
  company: string;       // Company name
  agents: string;        // Number of agents (5 options)
  message: string;       // Custom message
}
```

## Testing

### Run TypeScript Check
```bash
npm run typecheck
```

**Expected output:**
- 0 errors (if dependencies installed)
- May show warnings about untyped modules (ignore)

### Run Development Server
```bash
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Test Each Page
1. **Sales Landing**: http://localhost:3000/sales
   - [ ] All sections visible
   - [ ] Animations smooth
   - [ ] CTAs clickable
   - [ ] Responsive on mobile

2. **Contact Sales**: http://localhost:3000/contact-sales
   - [ ] Form fields visible
   - [ ] Form submit works
   - [ ] Contact info displays
   - [ ] FAQ visible

### Browser Testing
Test in these browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### Mobile Responsiveness
Test on device sizes:
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)

Use Chrome DevTools:
```
F12 > Toggle device toolbar (Ctrl+Shift+M)
```

## Deployment

### Build for Production
```bash
npm run build
```

**Expected output:**
```
Route (kind)      Size      First Load JS
...
/sales            X KB      X KB
/contact-sales    X KB      X KB
```

### Environment Variables
Create `.env.local`:
```env
# Add any required environment variables
NEXT_PUBLIC_API_URL=https://your-api.com
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**Alternative:** Push to GitHub and enable auto-deploy on Vercel.

### Deploy to Other Platforms
Components are compatible with:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker containers

## Monitoring & Analytics

### Track Form Submissions
Add to your form handler:
```typescript
// Google Analytics
gtag('event', 'contact_form_submitted', {
  form_type: 'sales_contact',
  company: data.company,
});
```

### Monitor Page Performance
```bash
# Use Lighthouse
npm install -g lighthouse
lighthouse http://localhost:3000/sales
```

### Check SEO
Each page includes:
- Semantic HTML
- Meta tags (add to layout.tsx)
- Mobile responsiveness
- Fast load times

Add meta tags:
```typescript
// app/sales/layout.tsx
export const metadata = {
  title: 'SyncPulse - AI Swarm Orchestration Platform',
  description: 'Coordinate intelligent agents at scale...',
};
```

## Common Issues & Solutions

### Issue: Animations Not Working
**Solution:** Ensure `framer-motion` is installed
```bash
npm install framer-motion@latest
```

### Issue: Icons Missing
**Solution:** Verify `lucide-react` installation
```bash
npm install lucide-react@latest
```

### Issue: Styling Looks Wrong
**Solution:** Ensure `tailwindcss` is configured
```bash
# Check tailwind.config.ts exists
ls packages/web/tailwind.config.ts

# Rebuild styles
npm run build
```

### Issue: Form Not Submitting
**Solution:** Check browser console for errors
```javascript
// In DevTools Console
console.log('Form handler called');
```

### Issue: Component Type Errors
**Solution:** Verify TypeScript types
```bash
npm run typecheck
```

## Performance Optimization

### Lazy Load Components
```typescript
import dynamic from 'next/dynamic';

const PricingPlans = dynamic(
  () => import('@/components/PricingPlans'),
  { loading: () => <div>Loading...</div> }
);
```

### Image Optimization
Components use only emoji and SVG icons - no image optimization needed.

### CSS Optimization
Tailwind automatically purges unused styles in production build.

### Bundle Analysis
```bash
npm install -D @next/bundle-analyzer

# Add to next.config.js and build
```

## Documentation Links

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Next.js Docs](https://nextjs.org/docs)

## Support & Help

### Check Existing Files
- Review `SALES_COMPONENTS.md` for component details
- Check component source code for implementation
- Look at `app/sales/page.tsx` for complete example

### Common Patterns
See `/packages/web/components/` for examples of:
- Animation patterns (Framer Motion)
- Form handling (React hooks)
- Responsive design (Tailwind)
- Component composition

## Maintenance Checklist

Regularly:
- [ ] Update dependencies: `npm update`
- [ ] Run security audit: `npm audit`
- [ ] Check TypeScript: `npm run typecheck`
- [ ] Test on multiple browsers
- [ ] Monitor error tracking (Sentry, etc.)
- [ ] Review analytics
- [ ] Update contact information (emails, phone)

Before major release:
- [ ] Test all forms
- [ ] Verify all links work
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit
- [ ] Update pricing if changed
- [ ] Test email notifications
- [ ] Update documentation

## Rollback Plan

If issues occur:
```bash
# Revert last commit
git revert HEAD

# Redeploy
vercel --prod
```

## Success Criteria

Your sales flow is ready when:
- [ ] All components render without errors
- [ ] TypeScript passes: `npm run typecheck`
- [ ] Build succeeds: `npm run build`
- [ ] Pages responsive on mobile/tablet/desktop
- [ ] Forms submit successfully
- [ ] Animations are smooth
- [ ] Contact information accurate
- [ ] All links work
- [ ] Performance score > 80 (Lighthouse)
- [ ] No console errors

---

**Created**: 2026-05-15  
**Last Updated**: 2026-05-15  
**Status**: Production Ready

For questions or issues, refer to `/packages/web/SALES_COMPONENTS.md`
