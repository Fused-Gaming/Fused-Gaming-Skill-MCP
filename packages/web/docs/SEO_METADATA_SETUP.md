# SEO Metadata Setup Guide

This guide explains how SEO metadata is configured across the SyncPulse application.

## Metadata Hierarchy

### 1. Root Metadata (`app/layout.tsx`)
Global metadata applied to all pages:

```typescript
export const metadata: Metadata = {
  title: 'SyncPulse Swarm Controller',
  description: 'Artistic control interface for agent swarms',
  metadataBase: new URL('https://vln.gg'),
};
```

**Configuration Details:**
- **Title**: Main brand identifier
- **Description**: SEO description for search results (155-160 characters)
- **metadataBase**: Base URL for relative canonical URLs and og:image

### 2. Viewport Configuration
Ensures proper display on all devices:

```typescript
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  maximumScale: 5,
  minimumScale: 1,
};
```

**Settings:**
- Responsive design on mobile
- No forced zoom restrictions
- Notch/safe-area support
- User-controllable zoom (max 5x, min 1x)

### 3. Page-Specific Metadata
Each page can override root metadata:

#### Skills Page (`app/skills/page.tsx`)
Currently uses root metadata. Can be enhanced with:
```typescript
export const metadata: Metadata = {
  title: 'Skills Catalog - SyncPulse',
  description: 'Discover 25+ AI-powered tools and skills for your swarm',
  openGraph: {
    title: 'Skills Catalog - SyncPulse',
    description: 'Discover 25+ AI-powered tools and skills for your swarm',
    type: 'website',
    url: 'https://skill.vln.gg/skills',
  },
};
```

#### Privacy Page (`app/privacy/page.tsx`)
```typescript
export const metadata: Metadata = {
  title: 'Privacy Policy - SyncPulse',
  description: 'How SyncPulse handles your data and privacy',
  robots: {
    index: true,
    follow: true,
  },
};
```

#### Terms Page (`app/terms/page.tsx`)
```typescript
export const metadata: Metadata = {
  title: 'Terms of Service - SyncPulse',
  description: 'Terms and conditions for using SyncPulse',
  robots: {
    index: true,
    follow: true,
  },
};
```

## Open Graph Configuration

### Purpose
Open Graph tags enable rich previews when links are shared on social media platforms.

### Implemented Tags
```html
<!-- Example for Skills page -->
<meta property="og:title" content="Skills Catalog - SyncPulse">
<meta property="og:description" content="Discover 25+ AI-powered tools">
<meta property="og:type" content="website">
<meta property="og:url" content="https://skill.vln.gg/skills">
<meta property="og:image" content="https://skill.vln.gg/og-image.jpg">
<meta property="og:locale" content="en_US">
```

### Adding OG Images
To enhance social sharing, add images to `/public` and reference in metadata:

```typescript
export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SyncPulse Skills Catalog',
      },
    ],
  },
};
```

## Twitter Card Configuration

### Implementation
Add to page metadata:

```typescript
export const metadata: Metadata = {
  twitter: {
    card: 'summary_large_image',
    title: 'Skills Catalog - SyncPulse',
    description: 'Discover 25+ AI-powered tools',
    creator: '@SyncPulseAI',
    images: ['/twitter-image.jpg'],
  },
};
```

## Canonical URLs

### Strategy
- Each page maintains its own canonical URL
- No hardcoded rewrites to different subdomains
- Allows `skill.vln.gg/skills` and `vln.gg/skills` to coexist as separate resources

### Implementation
Next.js automatically generates canonical URLs based on the current page path. No manual configuration needed.

### Subdomain Considerations
```
https://skill.vln.gg/skills → Canonical: https://skill.vln.gg/skills
https://vln.gg/skills → Canonical: https://vln.gg/skills
https://sync.vln.gg/dashboard → Not indexed (protected)
```

## Schema.org Structured Data

### Planned Implementation
Add structured data to improve search engine understanding:

```typescript
// In page components or layout
const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  'name': 'SyncPulse',
  'description': 'AI-powered swarm coordination platform',
  'applicationCategory': 'Business',
  'offers': {
    '@type': 'Offer',
    'availability': 'https://schema.org/InStock',
  },
};
```

### Current Status
- Basic structure ready
- Needs implementation in Skills catalog
- Recommended for FAQ schema on help pages

## Mobile-Specific Configuration

### Viewport Settings
Properly configured in root layout:
```typescript
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};
```

### Mobile Optimization Checklist
- [ ] Responsive design tested on 5+ devices
- [ ] Touch targets ≥ 44px diameter
- [ ] Text readable without zoom
- [ ] Form inputs properly sized
- [ ] Landscape orientation supported

## Performance Impact on SEO

### Core Web Vitals Monitoring
SyncPulse should track:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Optimization Tools
- Lighthouse: `lighthouse https://skill.vln.gg/`
- PageSpeed Insights: https://pagespeed.web.dev
- Web Vitals: https://web.dev/vitals

## Next.js Specific Features

### Dynamic Metadata
For pages with dynamic content (if implemented):

```typescript
export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  return {
    title: `${tool.name} - SyncPulse Skills`,
    description: tool.description,
  };
}
```

### Static Generation
All current pages are static-generated at build time, providing:
- Best SEO performance
- Instant page loads
- Better Core Web Vitals

### Incremental Static Regeneration (ISR)
If content updates frequently, enable ISR:

```typescript
export const revalidate = 3600; // Revalidate every hour
```

## Robots Meta Tags

### Current Configuration
Managed via `robots.txt`, but can also add page-level tags:

```typescript
export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noimageindex: false,
  },
};
```

### Protected Routes
Dashboard and API routes should use:
```typescript
robots: {
  index: false,
  follow: false,
},
```

## Testing and Validation

### SEO Validation Checklist
1. **Title Tags**
   - [ ] Present on all pages
   - [ ] Unique per page
   - [ ] 50-60 characters
   
2. **Meta Descriptions**
   - [ ] Present on all pages
   - [ ] 155-160 characters
   - [ ] Action-oriented

3. **Headings Hierarchy**
   - [ ] H1 on each page
   - [ ] Logical H2-H6 structure
   - [ ] No skipped levels

4. **Links**
   - [ ] Descriptive anchor text
   - [ ] No "click here" links
   - [ ] Internal links to related content

5. **Images**
   - [ ] Alt text on all images
   - [ ] Optimized file sizes
   - [ ] Proper format (WebP, JPEG, PNG)

### Tools for Testing
- **Google Search Console**: Monitor search appearance
- **Google PageSpeed Insights**: Performance and Core Web Vitals
- **Lighthouse**: Comprehensive audit
- **Screaming Frog**: Technical SEO analysis
- **SEMrush**: Competitor and keyword analysis

## Monitoring

### Monthly Checks
1. Google Search Console for errors
2. Verify sitemap.xml validity
3. Check Core Web Vitals
4. Review search query trends

### Quarterly Reviews
1. Audit page titles and descriptions
2. Check for broken links
3. Verify canonical tags
4. Review crawl stats

## Integration Points

### Vercel Deployment
- Respects `robots.txt` from public folder
- Supports metadata headers via `vercel.json`
- Automatic sitemap validation

### GitHub Integration
- Metadata changes tracked in commits
- SEO audit in CI/CD pipeline
- Documentation kept in sync

## Resources

- **Next.js Metadata API**: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- **Google Search Central**: https://developers.google.com/search
- **Schema.org**: https://schema.org
- **Open Graph Protocol**: https://ogp.me
- **Twitter Cards**: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
