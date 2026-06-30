# Subdomain Configuration Guide

This document explains how to configure and deploy the SyncPulse ecosystem across multiple subdomains: `skill.vln.gg` and `sync.vln.gg`.

## Overview

The Fused Gaming ecosystem is deployed across three domains:

| Domain | Purpose | Route | Content |
|--------|---------|-------|---------|
| `skill.vln.gg` | Skills Catalog | `/skills` | Organized skill discovery portal with 25+ tools |
| `sync.vln.gg` | SyncPulse Dashboard | `/` (or `/dashboard`) | Real-time agent swarm control and monitoring |
| `vln.gg` | Main Hub | `/` | Landing page and tools hub |

## Architecture

The subdomain routing is handled through:

1. **Middleware** (`middleware.ts`) - Detects subdomain and routes appropriately
2. **Vercel Configuration** (`vercel.json`) - Sets up domain mappings and caching
3. **Next.js App Router** - Serves different content based on routes

### Subdomain Detection Flow

```
Request → Middleware → Subdomain Detected → Route Handler
                              ↓
                    skill.vln.gg → /skills
                    sync.vln.gg → /dashboard or /
                    vln.gg → /landing (or /)
```

## DNS Configuration

### Cloudflare Setup

1. Go to your Cloudflare dashboard
2. Select your domain (`vln.gg`)
3. Navigate to DNS Records
4. Add CNAME records:

```dns
skill  CNAME  <your-vercel-deployment>.vercel.app
sync   CNAME  <your-vercel-deployment>.vercel.app
```

### Other DNS Providers

For non-Cloudflare providers, follow the same CNAME pattern:

- **Host**: `skill` → **Value**: `<your-vercel-deployment>.vercel.app`
- **Host**: `sync` → **Value**: `<your-vercel-deployment>.vercel.app`

## Vercel Setup

### Linking Multiple Domains

In your Vercel project settings:

1. **Project Settings** → **Domains**
2. Add each domain:
   - `skill.vln.gg` - Primary domain
   - `sync.vln.gg` - Additional domain
   - `vln.gg` - Optional (for main hub)

### Environment Variables

Set these in Vercel Project Settings → Environment Variables:

```env
# Shared across all domains
NEXT_PUBLIC_API_URL=https://api.vln.gg
NEXT_PUBLIC_DOMAIN=vln.gg

# Optional: Domain-specific configuration
NEXT_PUBLIC_SKILL_DOMAIN=skill.vln.gg
NEXT_PUBLIC_SYNC_DOMAIN=sync.vln.gg
```

### Build Configuration

The `vercel.json` file is pre-configured to:
- Build the entire monorepo
- Route API requests correctly
- Set up proper caching headers
- Add viewport/responsive design headers

## Responsive Design

Both subdomain endpoints are optimized for all device types:

### Mobile-First Breakpoints

```css
/* sm: 640px */
/* md: 768px */
/* lg: 1024px */
/* xl: 1280px */
/* 2xl: 1536px */
```

### Viewport Configuration

The layout includes proper viewport meta tags:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

### Tested Resolutions

✅ **Mobile**
- iPhone SE (375×667)
- iPhone 12 (390×844)
- iPhone 14 Pro (393×852)
- Samsung Galaxy S21 (360×800)
- Android tablets (600×1024)

✅ **Tablet**
- iPad Mini (768×1024)
- iPad Air (820×1180)
- iPad Pro (1024×1366)

✅ **Desktop**
- 1024×768 (XGA)
- 1280×720 (HD)
- 1920×1080 (Full HD)
- 2560×1440 (2K)
- 3840×2160 (4K)

## Features by Subdomain

### skill.vln.gg (Skills Catalog)

**Purpose**: Discover and learn about available skills

**Features**:
- 7 skill categories
- 25+ available tools
- Status indicators (Stable, Beta, New)
- Direct npm package links
- Tag-based organization
- Responsive grid layout (1-3 columns based on screen size)

**Responsive Behavior**:
- Mobile: Single column layout with full-width cards
- Tablet: 2-column grid layout
- Desktop: 3-column grid layout with wider cards

**Performance**:
- Lazy-loaded category sections
- Viewport-triggered animations
- Optimized images with Next.js Image
- CSS animations for smooth transitions

### sync.vln.gg (SyncPulse Dashboard)

**Purpose**: Real-time agent swarm control and monitoring

**Features**:
- Swarm orbital visualization
- Agent status monitoring
- Task tracking dashboard
- Execution roadmap
- Real-time metrics
- Control panel with play/pause/reset

**Responsive Behavior**:
- Mobile: Stacked layout with full-width components
- Tablet: Side-by-side layout for visualizer and control
- Desktop: Multi-pane layout with enhanced visualizations

**Performance**:
- Hardware-accelerated animations (Framer Motion)
- Optimized re-renders with Zustand state
- Efficient WebSocket connections for real-time updates
- Progressive enhancement for slower connections

## Development

### Local Testing

```bash
# Run development server
cd packages/web
npm run dev

# Visit:
# http://localhost:3000 (main hub)
# http://localhost:3000/skills (skills catalog)
# http://localhost:3000/dashboard (dashboard)
```

### Subdomain Testing Locally

To test subdomains locally, add entries to your `/etc/hosts`:

```bash
127.0.0.1  localhost
127.0.0.1  skill.localhost
127.0.0.1  sync.localhost
```

Then update `middleware.ts` temporarily for local testing to recognize `.localhost` subdomains.

### Deployment Testing

After deploying to Vercel:

1. Verify DNS propagation:
   ```bash
   dig skill.vln.gg
   dig sync.vln.gg
   ```

2. Test endpoints:
   ```bash
   curl https://skill.vln.gg/
   curl https://sync.vln.gg/
   ```

3. Verify responsive design:
   - Use Chrome DevTools device emulation
   - Test on physical devices across orientations
   - Check performance metrics in Vercel Analytics

## Caching Strategy

### Static Content (Skills Catalog)

- Cache control: `max-age=3600, s-maxage=3600` (1 hour)
- Good for: Skill descriptions, categories, static pages
- Revalidation: Push new deployment to update

### Dynamic Content (Dashboard)

- Cache control: `no-store` for API routes
- Good for: Real-time swarm status, task updates
- Updates: Instant via WebSocket or polling

## Security Headers

All subdomains include standard security headers:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## Monitoring

### Vercel Analytics

Monitor performance and usage at:
- `https://vercel.com/[team]/[project]/analytics`

### Key Metrics

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s

### Health Checks

```bash
# Skills catalog
curl https://skill.vln.gg/api/health

# Dashboard
curl https://sync.vln.gg/api/health

# Expected response:
# {"status":"ok","service":"fused-gaming-skill-mcp","timestamp":"..."}
```

## Troubleshooting

### Subdomain Not Resolving

**Issue**: `skill.vln.gg` or `sync.vln.gg` returns DNS error

**Solution**:
1. Check DNS propagation: `dig skill.vln.gg`
2. Verify CNAME records in Cloudflare
3. Wait 24-48 hours for global DNS propagation
4. Clear browser cache (Ctrl+Shift+Delete)

### Wrong Content on Subdomain

**Issue**: `skill.vln.gg` shows dashboard instead of skills catalog

**Solution**:
1. Verify middleware.ts subdomain detection logic
2. Check Vercel deployment logs
3. Verify custom domains are linked in Vercel
4. Rebuild and redeploy: `vercel --prod`

### Mobile Layout Issues

**Issue**: Page layout looks broken on mobile devices

**Solution**:
1. Check viewport meta tag in layout.tsx
2. Verify Tailwind responsive classes (sm:, md:, lg:)
3. Test with Chrome DevTools device emulation
4. Check images are optimized with Next.js Image component

### Performance Issues

**Issue**: Page loads slowly on certain devices

**Solution**:
1. Check Vercel Performance tab in dashboard
2. Analyze Core Web Vitals in PageSpeed Insights
3. Optimize images and animations
4. Check for unnecessary JavaScript bundles
5. Enable ISR (Incremental Static Regeneration) if applicable

## Deployment Checklist

Before deploying to production:

- [ ] DNS records configured (CNAME for skill and sync)
- [ ] Vercel project domains linked (skill.vln.gg, sync.vln.gg)
- [ ] Environment variables set in Vercel
- [ ] Build passes locally: `npm run build`
- [ ] Type checking passes: `npm run typecheck`
- [ ] Linting passes: `npm run lint`
- [ ] Responsive design tested on 3+ devices
- [ ] Performance metrics verified (Lighthouse > 90)
- [ ] All API endpoints responding with correct status codes
- [ ] Security headers present in response
- [ ] Analytics/monitoring set up in Vercel

## Next Steps

1. **Configure DNS**: Set up CNAME records for subdomains
2. **Link Domains in Vercel**: Add custom domains to project
3. **Set Environment Variables**: Configure NEXT_PUBLIC_DOMAIN
4. **Deploy**: Push branch and trigger Vercel deployment
5. **Verify**: Test both subdomains are working correctly
6. **Monitor**: Watch Vercel analytics for performance issues

## Support

For issues or questions:
- GitHub Issues: https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/issues
- Documentation: https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/docs
