# Deployment to skill.vln.gg

This document describes how to deploy the Fused Gaming Skill MCP to the `skill.vln.gg` domain.

## Overview

The SyncPulse Ethical Hacking Toolkit is deployed to Vercel with the custom domain `skill.vln.gg`. This domain serves as the primary API endpoint for the skill orchestration system.

## Architecture

```
GitHub Repository
    ↓
GitHub Actions Workflow (.github/workflows/deploy-api-vercel.yml)
    ↓
Vercel Deployment
    ↓
Custom Domain: https://skill.vln.gg
```

## Prerequisites

1. **Vercel Account:** Create an account at https://vercel.com
2. **Vercel API Token:** Generate at https://vercel.com/account/tokens
3. **GitHub Repository Secrets:** Configure in repository settings
4. **Domain Registration:** skill.vln.gg must be registered and DNS configured

## Setup Instructions

### Step 1: Create Vercel Project

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel (interactive)
vercel login

# Create new project for the API
vercel link --confirm
```

### Step 2: Configure GitHub Secrets

Add the following secrets to your GitHub repository:

1. **VERCEL_TOKEN**
   - Go to https://vercel.com/account/tokens
   - Create new token with access to your Vercel organization
   - Add to GitHub secrets as `VERCEL_TOKEN`

2. **VERCEL_ORG_ID** (Optional)
   - Found in Vercel dashboard: Settings → General
   - Add to GitHub secrets as `VERCEL_ORG_ID`

3. **VERCEL_PROJECT_ID_API** (Optional)
   - Found in project settings after linking
   - Speeds up deployment process
   - Add to GitHub secrets as `VERCEL_PROJECT_ID_API`

### Step 3: Configure Custom Domain

1. **In Vercel Dashboard:**
   - Navigate to your project settings
   - Select "Domains"
   - Add custom domain: `skill.vln.gg`

2. **Configure DNS:**
   - Point your domain registrar DNS to Vercel nameservers:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`
     - `ns3.vercel-dns.com`
     - `ns4.vercel-dns.com`
   - OR add CNAME record pointing to: `cname.vercel.app`

3. **Verify Domain:**
   - Vercel will verify domain ownership
   - SSL certificate will be auto-provisioned

### Step 4: Environment Variables

Configure environment variables in Vercel project settings:

```
NODE_ENV=production
CUSTOM_DOMAIN=skill.vln.gg
```

## API Endpoints

Once deployed, the following endpoints are available:

### Health Check
```bash
curl https://skill.vln.gg/health
```

Response:
```json
{
  "status": "ok",
  "service": "fused-gaming-skill-mcp",
  "domain": "skill.vln.gg",
  "timestamp": "2026-05-03T12:00:00.000Z",
  "version": "1.0.3"
}
```

### Skills List
```bash
curl https://skill.vln.gg/skills
```

Response:
```json
{
  "skills": [
    {
      "name": "syncpulse",
      "description": "Task synchronization and session management service",
      "version": "1.0.0"
    },
    {
      "name": "mermaid-terminal",
      "description": "Generate Mermaid diagrams from terminal",
      "version": "1.0.0"
    }
  ]
}
```

### MCP API
```bash
curl -X POST https://skill.vln.gg/api \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "skillmethod",
    "params": {},
    "id": 1
  }'
```

## Deployment Workflow

### Automatic Deployments

The workflow in `.github/workflows/deploy-api-vercel.yml` automatically deploys:

- **Production:** Pushes to `main` branch
- **Preview:** Pushes to `develop` branch or pull requests

### Manual Deployment

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Deploy preview
vercel
```

## Monitoring

### Check Deployment Status

```bash
# Via Vercel CLI
vercel list

# Via API
curl https://skill.vln.gg/health
```

### View Logs

1. **Vercel Dashboard:**
   - Project → Deployments → Select deployment
   - View build logs and runtime logs

2. **GitHub Actions:**
   - Repository → Actions → Deploy API to Vercel
   - View workflow run details

## Troubleshooting

### Domain Not Resolving

- Verify DNS configuration in domain registrar
- Check Vercel DNS settings match your registrar
- Wait up to 48 hours for DNS propagation

### SSL Certificate Issues

- Vercel auto-provisions SSL certificates
- Certificate issues usually resolve within minutes
- Check Vercel dashboard for certificate status

### Build Failures

1. Check GitHub Actions workflow logs
2. Verify all dependencies are in `package.json`
3. Ensure Node.js version matches `engines` in `package.json`
4. Check for TypeScript compilation errors: `npm run typecheck`

### 404 Errors

- Verify endpoint paths in `api/index.ts` match request URLs
- Check Vercel routes configuration in `vercel.json`
- Ensure build successfully deployed latest code

## Integration with Dashboard

The web dashboard (deployed to a separate Vercel project) connects to this API at `https://skill.vln.gg/`.

Configure dashboard environment variables:

```
REACT_APP_API_URL=https://skill.vln.gg
REACT_APP_API_VERSION=v1
```

## Security Considerations

1. **API Rate Limiting:** Configure in Vercel project settings
2. **CORS:** Restrict origins in API responses if needed
3. **Authentication:** Add authentication middleware to protected endpoints
4. **TLS/SSL:** Enabled by default with Vercel's SSL certificates
5. **Environment Variables:** Never commit secrets; use Vercel secrets management

## Deployment Checklist

- [ ] Vercel account created
- [ ] API token generated and added to GitHub secrets
- [ ] Domain registered and DNS configured
- [ ] Vercel project created and linked
- [ ] Custom domain added to Vercel project
- [ ] SSL certificate verified in Vercel dashboard
- [ ] GitHub Actions workflow enabled
- [ ] Test deployment on `develop` branch
- [ ] Verify health endpoint responds
- [ ] Monitor production logs after merge to `main`

## Support

For issues or questions:

1. Check Vercel documentation: https://vercel.com/docs
2. Review GitHub Actions logs in repository
3. Check deployment status in Vercel dashboard
4. Review this documentation for common issues

## Related Documentation

- [NPM Publishing](./NPM_PUBLISHING.md)
- [API Reference](./syncpulse-toolkit/04_TECHNICAL_REFERENCE.md)
- [Executive Summary](./syncpulse-toolkit/01_EXECUTIVE_SUMMARY.md)
