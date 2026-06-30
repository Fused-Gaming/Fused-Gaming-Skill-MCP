# Subdomain Quick Start Guide

Get the `skill.vln.gg` and `sync.vln.gg` subdomains up and running in minutes.

## TL;DR (5-Minute Setup)

```bash
# 1. Clone and setup
git clone https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP.git
cd Fused-Gaming-Skill-MCP
npm install --package-lock-only --ignore-scripts
npm ci

# 2. Build and test locally
npm run build
cd packages/web
npm run dev

# 3. Test routes
# Visit: http://localhost:3000/skills
# Visit: http://localhost:3000/dashboard

# 4. Deploy to Vercel
vercel link
vercel --prod

# 5. Configure DNS
# Add CNAME records in your DNS provider:
# skill → <deployment>.vercel.app
# sync → <deployment>.vercel.app
```

## Local Development

### Start Development Server

```bash
cd packages/web
npm run dev
```

Visit `http://localhost:3000`

### Test Skills Page

```
http://localhost:3000/skills
```

Expected: Skills catalog with 7 categories and 25+ tools

### Test Dashboard

```
http://localhost:3000/dashboard
```

Expected: SyncPulse dashboard (may require authentication)

### Test with Subdomain Simulation

Edit `/etc/hosts` to simulate subdomains locally:

```bash
# Add to /etc/hosts
127.0.0.1  localhost
127.0.0.1  skill.localhost
127.0.0.1  sync.localhost
```

Then temporarily modify `middleware.ts` to recognize `.localhost`:

```typescript
function getSubdomain(host: string): string | null {
  const parts = host.split(':')[0].split('.'); // Remove port
  if (parts.length >= 2 && parts[parts.length - 1] === 'localhost') {
    return parts[0];
  }
  if (parts.length >= 3) {
    return parts[0];
  }
  return null;
}
```

Visit:
- `http://skill.localhost:3000` → redirects to `/skills`
- `http://sync.localhost:3000` → redirects to `/dashboard`

## Building for Production

### 1. Install Dependencies

```bash
npm install --package-lock-only --ignore-scripts
npm ci
```

### 2. Build

```bash
npm run build
cd packages/web
npm run build
```

Expected output:
- ✅ Next.js build succeeds
- ✅ No TypeScript errors
- ✅ All routes compiled

### 3. Type Check

```bash
npm run typecheck
```

Expected: All type checks pass

### 4. Lint

```bash
npm run lint
```

Expected: No critical linting errors

## Vercel Deployment

### Setup (One-time)

```bash
# Install Vercel CLI
npm install -g vercel

# Link project
cd packages/web
vercel link

# This will:
# 1. Prompt for project details
# 2. Create .vercel/project.json
# 3. Set up deployment URL
```

### Configure Domains

```bash
# Login to Vercel dashboard
# Go to Project Settings → Domains
# Add domains:
# - skill.vln.gg
# - sync.vln.gg

# Follow DNS configuration prompts
```

### Set Environment Variables

```bash
# Production environment
vercel env add NEXT_PUBLIC_API_URL --environments production
# Enter value: https://api.vln.gg/api

vercel env add NEXT_PUBLIC_DOMAIN --environments production
# Enter value: vln.gg

vercel env add JWT_SECRET --environments production
# Enter value: your-secure-secret-here
```

### Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

## Verification Checklist

After deployment, verify everything works:

```bash
# ✅ Skills catalog loads
curl https://skill.vln.gg/ | head -20

# ✅ Dashboard loads
curl https://sync.vln.gg/ | head -20

# ✅ API health check
curl https://skill.vln.gg/api/health
curl https://sync.vln.gg/api/health

# ✅ Security headers present
curl -I https://skill.vln.gg/ | grep "X-Content-Type-Options"
curl -I https://sync.vln.gg/ | grep "X-Content-Type-Options"
```

## Mobile Testing

### Using Chrome DevTools

1. Open DevTools (F12)
2. Click device emulation icon (Ctrl+Shift+M)
3. Select device:
   - iPhone SE
   - iPhone 12
   - Samsung Galaxy S21
   - iPad

### Using Physical Devices

1. Connect to same WiFi as development machine
2. Find your machine's IP: `ipconfig getifaddr en0` (macOS) or `hostname -I` (Linux)
3. Visit: `http://<your-ip>:3000/skills`

## Performance Testing

### Lighthouse Audit

```bash
# Using Chrome DevTools
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Click "Generate report"
4. Check metrics:
   - Performance: ≥90
   - Accessibility: ≥90
   - Best Practices: ≥90
   - SEO: ≥90
```

### Network Performance

```bash
# Check with curl
curl -w "DNS: %{time_namelookup}s\nConnect: %{time_connect}s\nTransfer: %{time_starttransfer}s\nTotal: %{time_total}s\n" -o /dev/null -s https://skill.vln.gg/
```

## Troubleshooting

### Issue: Build fails locally

```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install --package-lock-only --ignore-scripts
npm ci
npm run build
```

### Issue: TypeScript errors

```bash
# Solution: Type check with detailed output
npm run typecheck -- --pretty

# Check specific file
cd packages/web
npx tsc src/middleware.ts --noEmit
```

### Issue: Subdomain not routing correctly

```bash
# Solution: Check middleware logic
# 1. Verify middleware.ts has subdomain detection
# 2. Check vercel.json includes proper configuration
# 3. Rebuild and redeploy: vercel --prod
# 4. Check Vercel deployment logs for errors
```

### Issue: Slow performance

```bash
# Solution: Optimize build
# 1. Check bundle size: npm run build -- --analyze
# 2. Enable ISR (Incremental Static Regeneration)
# 3. Optimize images with Next.js Image component
# 4. Check Vercel Analytics for bottlenecks
```

## Common Commands

```bash
# Development
npm run dev                # Start dev server
npm run build             # Build for production
npm run start             # Start production server
npm run typecheck         # TypeScript check
npm run lint              # ESLint check

# Deployment
vercel                    # Preview deployment
vercel --prod            # Production deployment
vercel logs              # View deployment logs
vercel rollback          # Rollback to previous deployment

# Verification
curl https://skill.vln.gg/      # Test skill subdomain
curl https://sync.vln.gg/       # Test sync subdomain
curl -I https://skill.vln.gg/   # Check headers only
```

## Documentation

For more detailed information:

- **Configuration**: See [SUBDOMAIN_CONFIGURATION.md](./SUBDOMAIN_CONFIGURATION.md)
- **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md) and [SKILL_DEPLOYMENT.md](./SKILL_DEPLOYMENT.md)
- **Checklist**: See [SUBDOMAIN_DEPLOYMENT_CHECKLIST.md](./SUBDOMAIN_DEPLOYMENT_CHECKLIST.md)
- **Environment**: See [.env.subdomain.example](./.env.subdomain.example)

## Support

Need help?

1. Check documentation in `packages/web/` directory
2. Review GitHub issues: https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/issues
3. Check Vercel deployment logs
4. Review middleware logic in `packages/web/middleware.ts`

---

**Happy deploying! 🚀**
