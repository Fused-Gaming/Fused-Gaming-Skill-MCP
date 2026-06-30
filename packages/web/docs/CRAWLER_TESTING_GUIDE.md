# Crawler Testing and Monitoring Guide

Complete guide for testing crawler access, verifying robots.txt configuration, and monitoring crawl activity.

## Testing robots.txt Syntax

### Online Validators
1. **Robots.txt Tester** (Google Search Console)
   - URL: https://search.google.com/search-console
   - Steps:
     1. Add property: `https://skill.vln.gg`
     2. Go to Crawl → robots.txt Tester
     3. Test specific URLs
     4. Verify allow/disallow rules

2. **Robots.txt Validator**
   - URL: https://www.robotstxt.org/
   - Features:
     - Syntax validation
     - Rule parsing
     - User-agent specific rules
     - Test URL access

### Local Validation
Test robots.txt locally before deployment:

```bash
# Fetch and validate robots.txt
curl -I https://skill.vln.gg/robots.txt

# Check specific allow/disallow rules
curl https://skill.vln.gg/robots.txt | grep -A5 "User-agent: Googlebot"

# Validate XML sitemap referenced in robots.txt
curl -I https://skill.vln.gg/sitemap.xml
```

## Testing Crawler Access

### Simulating Google Bot
Test how Googlebot perceives your site:

```bash
# Request as Googlebot
curl -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  https://skill.vln.gg/skills

# Check response headers
curl -I -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1)" \
  https://skill.vln.gg/skills
```

### Testing Specific User-Agents
```bash
# Bingbot
curl -H "User-Agent: Mozilla/5.0 (compatible; Bingbot/2.0)" \
  https://skill.vln.gg/

# Blocked bot (AhrefsBot)
curl -H "User-Agent: Mozilla/5.0 (compatible; AhrefsBot/7.0)" \
  https://skill.vln.gg/

# Standard browser
curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" \
  https://skill.vln.gg/
```

## Sitemap Validation

### XML Validation
Verify sitemap.xml is well-formed:

```bash
# Fetch sitemap
curl https://skill.vln.gg/sitemap.xml

# Validate XML structure
curl https://skill.vln.gg/sitemap.xml | xmllint --noout -

# Check for common issues
curl https://skill.vln.gg/sitemap.xml | grep -c "<url>"
```

### Online Validators
1. **XML Schema Validator**: https://www.w3schools.com/xml/xml_validator.asp
2. **XML Checker**: http://www.xmlvalidation.com/
3. **Google Search Console**: Automatically validates uploaded sitemaps

### Sitemap Requirements Checklist
- [ ] Valid XML format
- [ ] All URLs include `<loc>` element
- [ ] Dates in ISO 8601 format (YYYY-MM-DD)
- [ ] Priority values between 0.0 and 1.0
- [ ] Max 50,000 URLs per sitemap
- [ ] Max 50MB compressed

## Monitoring Crawl Activity

### Google Search Console
Monitor how Google crawls your site:

1. **Setup**
   ```bash
   # Verify domain ownership
   # Add property: https://skill.vln.gg
   # Verify via DNS or HTML file
   ```

2. **Monitoring Tools**
   - Coverage: Track indexing issues
   - Crawl Stats: Monitor crawl frequency
   - URL Inspection: Check specific page indexing
   - Removals: Request temporary URL removal

3. **Key Metrics to Monitor**
   ```
   - Crawled pages per day
   - Crawl rate
   - Crawl errors
   - Excluded pages
   - Security issues
   ```

### Bing Webmaster Tools
Alternative monitoring platform:

```bash
# Add domain: https://skill.vln.gg
# Configure sitemap
# Monitor crawl activity
```

### Access Logs Analysis
If available, analyze web server logs:

```bash
# Count Googlebot requests
grep "Googlebot" /var/log/nginx/access.log | wc -l

# Count Bingbot requests
grep "Bingbot" /var/log/nginx/access.log | wc -l

# Count blocked crawler requests
grep "AhrefsBot\|SemrushBot" /var/log/nginx/access.log | wc -l

# Most crawled pages
grep "Googlebot" /var/log/nginx/access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -20

# Crawl errors
grep "Googlebot" /var/log/nginx/access.log | grep -E "40[34]" | head -20
```

## Testing Robots.txt Rules

### Create Test Scenarios
Test different access patterns:

```bash
# Test public content access
curl -I https://skill.vln.gg/skills

# Test API blocking
curl -I https://skill.vln.gg/api/health

# Test dashboard blocking
curl -I https://skill.vln.gg/dashboard

# Test next files blocking
curl -I https://skill.vln.gg/.next/data.json

# Test admin blocking
curl -I https://skill.vln.gg/admin
```

### Verify Response Codes
Expected behavior:
- Public pages: HTTP 200
- API routes: HTTP 200 (returned to user, blocked in robots.txt)
- Protected routes: HTTP 200/302 (depends on auth)

### Check Robots Meta Tags
```bash
# Fetch page and check meta tags
curl https://skill.vln.gg/skills | grep -A2 "robots"
```

## Crawl Budget Optimization

### Minimize Crawl Waste
1. **Remove Duplicate Content**
   ```bash
   # Find similar pages
   curl https://skill.vln.gg/skills | md5sum
   curl https://skill.vln.gg/skills/ | md5sum
   ```

2. **Fix Redirect Chains**
   ```bash
   # Trace redirects
   curl -L -v https://skill.vln.gg/ 2>&1 | grep "Location:"
   ```

3. **Remove Infinite Crawl Traps**
   ```bash
   # Test crawl depth
   # Verify no parameters create infinite URLs
   ```

## Performance Monitoring

### Core Web Vitals
Test search performance metrics:

```bash
# Using Google PageSpeed Insights API
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://skill.vln.gg&key=YOUR_API_KEY"

# Using Lighthouse CLI
lighthouse https://skill.vln.gg --output-path=./report.html

# Using Web Vitals API
curl "https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url=https://skill.vln.gg"
```

### Mobile Usability
Test mobile experience:

```bash
# Fetch mobile view
curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" \
  https://skill.vln.gg/skills

# Check viewport meta tag
curl https://skill.vln.gg/skills | grep viewport
```

## Monitoring Tools Setup

### Google Search Console Alerts
Configure email alerts for:
- Critical crawl errors
- Structured data issues
- Security problems
- Mobile usability issues

### Bing Webmaster Tools Alerts
Similar alerts available for Bing:
- Crawl errors
- Security alerts
- Mobile usability

### Custom Monitoring Script
```bash
#!/bin/bash
# daily-crawl-check.sh

DOMAINS=("skill.vln.gg" "sync.vln.gg" "vln.gg")

for domain in "${DOMAINS[@]}"; do
  echo "Checking $domain..."
  
  # Check robots.txt
  status=$(curl -s -o /dev/null -w "%{http_code}" https://$domain/robots.txt)
  echo "  robots.txt: HTTP $status"
  
  # Check sitemap
  status=$(curl -s -o /dev/null -w "%{http_code}" https://$domain/sitemap.xml)
  echo "  sitemap.xml: HTTP $status"
  
  # Check main page
  status=$(curl -s -o /dev/null -w "%{http_code}" https://$domain/)
  echo "  homepage: HTTP $status"
done
```

## Common Issues and Solutions

### Issue: robots.txt Returns 404
**Solution:**
```bash
# Verify file location
ls -la packages/web/public/robots.txt

# Check Vercel deployment
# Ensure next.config.js doesn't interfere
# Verify public folder is included in build
```

### Issue: Crawlers Ignore robots.txt
**Solution:**
1. Check syntax: https://www.robotstxt.org/
2. Verify HTTP 200 response
3. Ensure UTF-8 encoding
4. Check User-agent matching

### Issue: Sitemap Not Discovered
**Solution:**
```bash
# Verify robots.txt points to sitemap
grep -i sitemap /public/robots.txt

# Ensure sitemap.xml is valid
curl https://skill.vln.gg/sitemap.xml | xmllint --noout -

# Submit manually in Google Search Console
```

### Issue: Pages Not Indexed
**Solution:**
1. Check Google Search Console for errors
2. Verify canonical URLs
3. Ensure page isn't blocked by robots.txt
4. Check for noindex meta tags
5. Verify internal linking

## Automation Checklist

### Weekly Checks
- [ ] Google Search Console for new errors
- [ ] Verify robots.txt HTTP 200 response
- [ ] Check sitemap.xml validity
- [ ] Monitor crawl rate in GSC

### Monthly Checks
- [ ] Full SEO audit (Lighthouse)
- [ ] Competitor crawl analysis
- [ ] Core Web Vitals review
- [ ] New crawl rule validation

### Quarterly Reviews
- [ ] Crawl budget analysis
- [ ] Security audit
- [ ] robots.txt optimization
- [ ] Content strategy review

## Resources

- **Google Search Central**: https://developers.google.com/search
- **Bing Webmaster Tools**: https://www.bing.com/webmasters
- **robots.txt Specification**: https://tools.ietf.org/html/draft-rep-wg-topic
- **Sitemap Protocol**: https://www.sitemaps.org
- **Lighthouse**: https://developers.google.com/web/tools/lighthouse
- **PageSpeed Insights**: https://pagespeed.web.dev

## Support

For crawler and SEO issues:
- Email: security@vln.gg
- GitHub Issues: https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/issues
- Documentation: `/docs/SEO_AND_CRAWL_MANAGEMENT.md`
