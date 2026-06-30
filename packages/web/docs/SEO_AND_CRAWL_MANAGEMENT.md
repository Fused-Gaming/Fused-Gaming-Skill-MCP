# SEO and Crawler Management

This document describes how SyncPulse manages search engine visibility, crawler access, and privacy protection across all domains and subdomains.

## Overview

SyncPulse operates three main endpoints:
- **Primary Domain**: `vln.gg` - Landing page and general content
- **Skill Subdomain**: `skill.vln.gg` - Public skills catalog
- **Sync Subdomain**: `sync.vln.gg` - Protected dashboard (authentication required)

Each endpoint has tailored SEO, crawling, and privacy configurations.

## File Structure

### `/public/robots.txt`
Central crawler control file that applies to all domains. Configures:
- Access rules for Googlebot, Bingbot, and other crawlers
- Blocking of resource-intensive bots (AhrefsBot, SemrushBot, etc.)
- Disallow of internal API and admin routes
- Crawl-delay and request-rate settings
- Sitemap locations for all subdomains

**Key Settings:**
```
Allow: / (public content)
Disallow: /api/ (API routes)
Disallow: /dashboard/ (protected routes)
Disallow: /.next/ and /_next/ (build artifacts)
Crawl-delay: 1 second
Request-rate: 30 requests per 60 seconds
```

### `/public/sitemap.xml`
XML sitemap for search engines. Includes:
- Primary domain (`vln.gg`)
- Skill subdomain pages (`skill.vln.gg/skills`)
- Category section anchors with proper priorities
- Mobile-friendly annotations
- Last modification dates
- Change frequency and priority hints

**Hierarchy:**
```
vln.gg/ (priority: 1.0) - Primary entry point
skill.vln.gg/ (priority: 0.9) - Subdomain landing
skill.vln.gg/skills (priority: 0.95) - Main catalog
skill.vln.gg/skills#categories (priority: 0.8) - Category sections
Privacy/Terms pages (priority: 0.5) - Legal documents
sync.vln.gg - EXCLUDED (authentication required)
```

### `/.well-known/security.txt`
Standard security contact file following RFC 9116. Provides:
- Security contact email
- Policy URL
- Security acknowledgments page
- Hiring information
- Expiration date

**Location:** Accessible at `https://vln.gg/.well-known/security.txt`

### `/public/ads.txt` and `/public/app-ads.txt`
Advertising inventory files following TAG standards. Currently empty but maintained for future partnerships.

## Crawler Rules

### Allowed Crawlers
- Googlebot
- Bingbot
- Baidu Spider
- Yandex Bot
- Standard web crawlers

### Blocked Crawlers
The following crawlers are blocked due to high resource consumption:
- **AhrefsBot** - SEO analysis tool (resource-intensive)
- **SemrushBot** - Competitive analysis (aggressive crawling)
- **DotBot** - Monitoring service
- **MJ12bot** - Monitoring service

### Rules by Section

#### Public Sections (Allowed)
```
Allow: /
Allow: /skills
Allow: /privacy
Allow: /terms
Allow: /
```

#### Protected Sections (Disallowed)
```
Disallow: /api/* - All API routes
Disallow: /admin/* - Admin interfaces
Disallow: /dashboard/* - Authenticated dashboard
Disallow: /.next/* - Next.js build files
Disallow: /_next/* - Next.js assets
```

## Subdomain-Specific Configuration

### Primary Domain (`vln.gg`)
- **Visibility**: Public
- **Content**: Landing page, marketing, ecosystem overview
- **Crawling**: Full indexing allowed
- **Robots.txt**: Standard rules apply
- **Sitemap**: Included in main sitemap.xml

### Skill Subdomain (`skill.vln.gg`)
- **Visibility**: Public
- **Content**: Skills catalog, tool directory
- **Crawling**: Full indexing allowed
- **URL Rewriting**: `/` redirects to `/skills`
- **Sitemap**: Dedicated entries for skills section
- **Analytics**: Tracked for public visibility

### Sync Subdomain (`sync.vln.gg`)
- **Visibility**: Protected (authentication required)
- **Content**: Dashboard, agent coordination, swarm control
- **Crawling**: Blocked for all crawlers
- **Robots.txt**: Disallow rule enforces
- **Sitemap**: Excluded from public sitemap
- **Analytics**: Internal tracking only

## Search Engine Optimization

### Metadata and Canonical URLs
- Each page maintains its own canonical URL
- No forced rewrites for subdomains
- Proper `<head>` viewport configuration
- Mobile-friendly markup

### Structured Data
Currently implemented:
- Page titles and descriptions
- Mobile viewport tags
- Open Graph tags (recommended for social sharing)
- Schema.org markup (planned)

### Performance Optimization
- Response caching configured per route
- `/dashboard` uses `no-store, no-cache` headers
- Static content cached for 1 hour
- Images optimized with Next.js Image component

## Protecting Sensitive Content

### Authentication-Required Routes
The following routes are protected and excluded from crawling:
- `/dashboard` - User dashboard
- `/admin` - Administrative interfaces
- `/api/*` - All API endpoints

### Security Headers
```
Cache-Control: no-store, no-cache, must-revalidate (for /dashboard)
Cache-Control: public, max-age=3600 (for static content)
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
```

## Privacy Considerations

### Data Collection
- Minimal analytics for public pages
- No tracking on protected routes
- GDPR-compliant cookie handling
- Privacy policy available at `/privacy`

### Opt-Out Options
Users can:
- Block cookie placement via browser settings
- Opt-out in privacy preferences
- Request data deletion (contact: privacy@vln.gg)

## Monitoring and Maintenance

### Regular Checks
1. **Monthly**: Verify robots.txt syntax
2. **Monthly**: Check sitemap.xml validity
3. **Quarterly**: Review crawler access logs
4. **Quarterly**: Validate security.txt

### Tools for Verification
- Google Search Console: https://search.google.com/search-console
- Bing Webmaster Tools: https://www.bing.com/webmasters
- Test robots.txt: https://www.robotstxt.org/
- Validate XML: https://www.w3schools.com/xml/xml_validator.asp

### Reporting Issues
If you suspect crawling or indexing issues:
1. Check `robots.txt` syntax
2. Verify sitemap.xml format
3. Review `vercel.json` headers
4. Check for middleware redirects
5. Contact security@vln.gg

## Updating Configurations

### When to Update robots.txt
- Adding new public sections
- Blocking new problematic crawlers
- Changing crawl-delay settings
- Adding new sitemap locations

### When to Update sitemap.xml
- Adding new public pages
- Removing deprecated content
- Changing page priorities
- Updating modification dates

### When to Update security.txt
- Changes to security contact
- New policy documents
- Updated acknowledgments list

## Integration with Vercel

The deployment platform respects:
- `robots.txt` from `/public` directory
- Custom headers defined in `vercel.json`
- Redirects and rewrites
- Environment-specific configurations

## References

- **robots.txt Specification**: https://tools.ietf.org/html/draft-rep-wg-topic
- **XML Sitemap Protocol**: https://www.sitemaps.org/
- **Security.txt RFC 9116**: https://datatracker.ietf.org/doc/html/rfc9116
- **Ads.txt Specification**: https://iabtechlab.com/ads-txt/
- **Google Search Central**: https://developers.google.com/search
- **Bing Webmaster Guidelines**: https://www.bing.com/webmasters/help

## Additional Resources

- Privacy Policy: `/privacy`
- Terms of Service: `/terms`
- Security Information: `/.well-known/security.txt`
- GitHub Repository: https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP
