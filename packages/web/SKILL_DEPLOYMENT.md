# Skills Catalog Deployment (skill.vln.gg)

This document explains how to deploy the Skills Catalog to skill.vln.gg and manage custom domains.

## Overview

The Skills Catalog is a Next.js application that showcases all available skills in the Fused Gaming MCP ecosystem, organized by category:

- 🎨 Design & Creative
- 🛠️ Development Tools
- 📧 Automation & Integration
- 📐 Data & Visualization
- 🔐 Web3 & Smart Contracts
- 🎬 Content & Creative Writing
- ⚙️ DevOps & Infrastructure

## Deployment Platforms

### Option 1: Vercel (Recommended)

Vercel provides seamless Next.js deployment with built-in optimizations.

**Prerequisites:**
- Vercel account (https://vercel.com)
- GitHub repository access
- Custom domain (skill.vln.gg)

**Setup:**

1. **Connect Repository**
   ```bash
   # Option A: Via Vercel Dashboard
   # 1. Go to https://vercel.com/new
   # 2. Import your GitHub repository
   # 3. Select the root project
   
   # Option B: Via CLI
   npm install -g vercel
   vercel
   ```

2. **Configure Custom Domain**
   - In Vercel Dashboard → Project Settings → Domains
   - Add custom domain: `skill.vln.gg`
   - Follow DNS configuration instructions

3. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   # Enter value: https://sync.vln.gg/api or similar
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: Docker + VPS/Cloud

Deploy as a containerized application.

**Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# Run
EXPOSE 3000
CMD ["npm", "start"]
```

**Deploy:**
```bash
# Build image
docker build -t skill-catalog:latest .

# Run container
docker run -p 3000:3000 -e NODE_ENV=production skill-catalog:latest

# Or with Docker Compose
docker-compose up -d
```

### Option 3: PM2 on Linux VPS

**Setup:**
```bash
# Install PM2
npm install -g pm2

# Navigate to project
cd packages/web

# Install dependencies
npm ci

# Build
npm run build

# Start with PM2
pm2 start npm --name "skill-catalog" -- start

# Configure auto-restart
pm2 startup
pm2 save
```

**NGINX Reverse Proxy:**
```nginx
server {
    server_name skill.vln.gg;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## DNS Configuration

### Cloudflare (Recommended)

1. Go to Cloudflare Dashboard
2. Select your domain (vln.gg)
3. Navigate to DNS Records
4. Add CNAME record:
   - Name: `skill`
   - Target: `cname.vercel-dns.com` (for Vercel)
   - TTL: Auto

### Manual DNS

For other providers, follow these steps:

1. Get the target IP/CNAME from your hosting provider
2. Add DNS record:
   - Type: CNAME
   - Host: skill
   - Value: your-deployment-url

## Features

### Skill Categories

The catalog automatically displays skills organized by:

1. **Design & Creative** (6 tools)
   - Algorithmic Art, Canvas Design, Frontend Design, Theme Factory, ASCII Mockup, SVG Generator

2. **Development Tools** (5 tools)
   - MCP Builder, Skill Creator, Pre-Deploy Validator, Project Manager, Mermaid Terminal

3. **Automation & Integration** (4 tools)
   - SyncPulse, Daily Review, Multi-Account Session Tracking, LinkedIn Master Journalist

4. **Data & Visualization** (2 tools)
   - UX Journeymapper, Project Status Tool

5. **Web3 & Smart Contracts** (2 tools)
   - NFT Generative Art, Smart Contract Tools

6. **Content & Creative Writing** (2 tools)
   - Underworld Writer, Agentic Flow DevKit

7. **DevOps & Infrastructure** (2 tools)
   - Vercel Next.js Deployment, Style Dictionary System

### Tool Status Indicators

Each tool displays its current status:
- 🟢 **Stable** - Production-ready
- 🟡 **Beta** - Active development
- 🔵 **New** - Recently added

### Interactive Features

- Hover animations for tool cards
- Smooth scroll-triggered animations
- External links to npm packages
- Responsive grid layout (1-3 columns)
- Dark theme with accent colors

## Updating the Skills Catalog

### Add New Skill

Edit `packages/web/app/skills/page.tsx` and add to the appropriate category:

```typescript
{
  name: 'Skill Name',
  description: 'Short description of the skill',
  icon: '🎨',
  url: 'https://www.npmjs.com/package/@h4shed/skill-name',
  tags: ['tag1', 'tag2'],
  status: 'stable' // or 'beta', 'new'
}
```

### Update Category

Modify the category description or add new categories by editing the `toolCategories` array.

### Redeploy

```bash
# After making changes
git add packages/web/app/skills/page.tsx
git commit -m "docs: update skills catalog"
git push origin main

# Vercel auto-deploys on push
# Or manually:
vercel --prod
```

## Environment Variables

### Required
- `NEXT_PUBLIC_API_URL` - Backend API endpoint (optional)

### Optional
- `NODE_ENV` - Set to `production` for deployment
- `NEXT_PUBLIC_ANALYTICS` - Analytics tracking ID

## Performance Optimization

The Skills Catalog includes:

- ✅ Image optimization with Next.js Image
- ✅ CSS optimization with Tailwind
- ✅ Animation performance with Framer Motion
- ✅ Lazy loading with viewport triggers
- ✅ Cache control headers
- ✅ Responsive design (mobile-first)

## Monitoring

### Vercel Analytics

Monitor at: https://vercel.com/[team]/[project]/analytics

Track:
- Page load times
- Core Web Vitals
- Error rates
- Real User Monitoring (RUM)

### Health Check

```bash
# Check if service is running
curl https://skill.vln.gg/

# Check specific route
curl https://skill.vln.gg/skills
```

## Troubleshooting

### 404 Not Found

**Issue:** `/skills` route returns 404
**Solution:** 
- Rebuild project: `npm run build`
- Clear Vercel cache
- Redeploy: `vercel --prod`

### Slow Performance

**Issue:** Page loads slowly
**Solution:**
- Check Vercel analytics for bottlenecks
- Enable ISR (Incremental Static Regeneration)
- Optimize images and assets
- Check network waterfall

### Domain Not Resolving

**Issue:** skill.vln.gg not accessible
**Solution:**
- Verify DNS records propagated (24-48 hours)
- Check Vercel domain settings
- Test with: `dig skill.vln.gg`
- Clear browser cache: Ctrl+Shift+Delete

### Build Fails

**Issue:** Deployment build fails
**Solution:**
- Check build logs in Vercel dashboard
- Verify all dependencies: `npm ci`
- Test locally: `npm run build && npm start`
- Check TypeScript errors: `npm run typecheck`

## Integration with sync.vln.gg

The Skills Catalog complements the main SyncPulse dashboard:

- **sync.vln.gg** - Live agent swarm dashboard and control panel
- **skill.vln.gg** - Skill discovery and documentation catalog
- **vln.gg/tools** - Main tools and resources hub

Users flow from:
1. vln.gg/tools (discovery)
2. skill.vln.gg (explore specific skills)
3. GitHub (install/contribute)
4. sync.vln.gg (use and orchestrate)

## Support

For issues or questions:

- **GitHub Issues**: https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/issues
- **Documentation**: https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/docs
- **Email**: support@fused-gaming.io
