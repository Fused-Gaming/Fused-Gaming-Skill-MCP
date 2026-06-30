# Subdomain Deployment Checklist

Complete this checklist to ensure both `skill.vln.gg` and `sync.vln.gg` are properly deployed and responsive.

## Pre-Deployment

- [ ] **Code Review**
  - [ ] `middleware.ts` has subdomain detection logic
  - [ ] `vercel.json` includes Viewport headers
  - [ ] `layout.tsx` has proper viewport metadata
  - [ ] All responsive classes are present in components

- [ ] **Build Verification**
  ```bash
  npm run build
  npm run typecheck
  npm run lint
  ```
  - [ ] Build completes without errors
  - [ ] TypeScript check passes
  - [ ] ESLint warnings resolved

- [ ] **DNS Configuration**
  - [ ] CNAME record created for `skill` → Vercel deployment
  - [ ] CNAME record created for `sync` → Vercel deployment
  - [ ] DNS propagation verified (`dig skill.vln.gg`)
  - [ ] Waiting time (usually 15 minutes to 48 hours)

- [ ] **Vercel Project Setup**
  - [ ] Project linked: `vercel link`
  - [ ] Production domain set to main domain
  - [ ] Additional domains added: `skill.vln.gg`, `sync.vln.gg`
  - [ ] Environment variables configured:
    - [ ] `NEXT_PUBLIC_API_URL`
    - [ ] `NEXT_PUBLIC_DOMAIN=vln.gg`

## Deployment

- [ ] **Push to Branch**
  ```bash
  git add .
  git commit -m "feat: add subdomain configuration for skill.vln.gg and sync.vln.gg"
  git push origin claude/skill-sync-subdomains-z0u8af
  ```

- [ ] **Vercel Deployment**
  - [ ] Automatic deployment triggered on push
  - [ ] Build successful in Vercel dashboard
  - [ ] Production URL accessible

- [ ] **Basic Functionality**
  ```bash
  # Test primary domain
  curl -I https://vln.gg/
  
  # Test skill subdomain
  curl -I https://skill.vln.gg/
  curl https://skill.vln.gg/ | grep -i "skills"
  
  # Test sync subdomain
  curl -I https://sync.vln.gg/
  curl https://sync.vln.gg/ | grep -i "syncpulse"
  ```
  - [ ] All endpoints return HTTP 200
  - [ ] Correct content on each subdomain
  - [ ] CORS headers present for API routes

## Responsive Design Verification

### Mobile (360px - 640px)

**Device Testing** - Use Chrome DevTools or physical devices:

- [ ] iPhone SE (375×667)
  - [ ] Text readable without zooming
  - [ ] Touch targets ≥ 44px
  - [ ] No horizontal scrolling
  - [ ] Navigation menu functional
  - [ ] Cards in single column
  - [ ] Images properly scaled

- [ ] Android Phone (360×800)
  - [ ] Same checks as iPhone SE
  - [ ] Safe area consideration (notches)

**Landscape Orientation:**
- [ ] Elements don't overlap
- [ ] Navigation remains accessible
- [ ] Readable font sizes (minimum 14px)

### Tablet (600px - 820px)

**Device Testing:**

- [ ] iPad Mini (768×1024)
  - [ ] 2-column grid layout active
  - [ ] Reasonable spacing between elements
  - [ ] Navigation bar properly sized
  - [ ] Tap targets comfortable size

- [ ] iPad Air (820×1180)
  - [ ] 2-3 column grid available
  - [ ] Content width reasonable (not full width)

**Both Orientations:**
- [ ] Portrait and landscape both functional
- [ ] No content hidden due to viewport
- [ ] Touch gestures work properly

### Desktop (1024px and above)

**Resolution Breakpoints:**

- [ ] 1024×768 (XGA)
  - [ ] 3-column grid active
  - [ ] Sidebar navigation visible
  - [ ] Full feature set accessible

- [ ] 1280×720 (HD)
  - [ ] All features visible above fold
  - [ ] Comfortable spacing throughout
  - [ ] Animations smooth

- [ ] 1920×1080 (Full HD)
  - [ ] Layout doesn't stretch excessively
  - [ ] Max-width constraint prevents overspreading
  - [ ] All interactive elements accessible

- [ ] 2560×1440 (2K)
  - [ ] Text readable at native resolution
  - [ ] Proper scaling of images

- [ ] Ultra-wide (3440×1440)
  - [ ] Content centered with max-width
  - [ ] No excessive horizontal spacing

## Performance Verification

### Lighthouse Audit

```bash
# Run locally or via Vercel
lighthouse https://skill.vln.gg/
lighthouse https://sync.vln.gg/
```

- [ ] Performance score ≥ 90
- [ ] Accessibility score ≥ 90
- [ ] Best Practices score ≥ 90
- [ ] SEO score ≥ 90

### Core Web Vitals

- [ ] First Contentful Paint (FCP) < 1.5s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Time to Interactive (TTI) < 3.5s

### Network Performance

- [ ] Initial page load < 3s on 4G
- [ ] Subsequent loads < 1s (cached)
- [ ] API responses < 500ms
- [ ] Images optimized (< 100KB total)

## Content Verification

### skill.vln.gg

- [ ] Page title: "Skills Catalog"
- [ ] All 7 categories visible
- [ ] 25+ tools displayed
- [ ] Status badges (Stable/Beta/New) showing
- [ ] External links functional
- [ ] Cards have proper hover effects
- [ ] Footer links work

### sync.vln.gg

- [ ] Page title: "SyncPulse Swarm Controller"
- [ ] Landing page or dashboard visible (depending on auth)
- [ ] Navigation menu responsive
- [ ] All dashboard features accessible
- [ ] Real-time features functional
- [ ] API health endpoint responding

## Security Verification

- [ ] HTTPS enabled on all domains
- [ ] Security headers present:
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `X-Frame-Options: SAMEORIGIN`
  - [ ] `X-XSS-Protection: 1; mode=block`
  - [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] No mixed content warnings
- [ ] No console errors about insecure resources
- [ ] SSL certificate valid

## Analytics & Monitoring

- [ ] **Vercel Analytics Enabled**
  - [ ] Visit count tracking active
  - [ ] Performance metrics visible
  - [ ] Error tracking enabled

- [ ] **Deployment Success**
  - [ ] GitHub Actions completed successfully
  - [ ] Vercel build logs show no warnings
  - [ ] No failed deployments in queue

- [ ] **User Experience Monitoring**
  - [ ] Real User Monitoring (RUM) set up if applicable
  - [ ] Error boundaries working
  - [ ] Graceful degradation on slow connections

## Cross-Browser Testing

- [ ] **Chrome**
  - [ ] Latest stable version
  - [ ] Responsive design tools
  - [ ] DevTools performance profiler

- [ ] **Firefox**
  - [ ] Latest stable version
  - [ ] Accessibility inspector
  - [ ] No rendering issues

- [ ] **Safari**
  - [ ] macOS latest version
  - [ ] iOS latest version
  - [ ] No webkit-specific issues

- [ ] **Edge**
  - [ ] Latest Chromium-based version
  - [ ] No Trident compatibility mode issues

## Accessibility Verification

- [ ] **Keyboard Navigation**
  - [ ] Tab order logical
  - [ ] Focus indicators visible
  - [ ] All interactive elements reachable
  - [ ] No keyboard traps

- [ ] **Screen Reader Testing**
  - [ ] Page structure proper
  - [ ] Images have alt text
  - [ ] Form labels associated
  - [ ] Skip links functional

- [ ] **Color Contrast**
  - [ ] Text ≥ 4.5:1 contrast for normal text
  - [ ] Text ≥ 3:1 contrast for large text
  - [ ] No color-only information conveyance

## Post-Deployment

- [ ] **Documentation Updated**
  - [ ] README reflects subdomain URLs
  - [ ] Deployment guides reference new structure
  - [ ] Environment variables documented
  - [ ] Known limitations noted

- [ ] **Team Communication**
  - [ ] Notify team of live URLs
  - [ ] Share deployment checklist
  - [ ] Alert about feature availability
  - [ ] Provide feedback channel

- [ ] **Monitoring Setup**
  - [ ] Set up alerts for deployment failures
  - [ ] Monitor API response times
  - [ ] Track error rates
  - [ ] Schedule periodic performance audits

- [ ] **Backup Plan**
  - [ ] Know how to rollback if needed
  - [ ] Have DNS records documented
  - [ ] Maintain previous deployment URL
  - [ ] Document emergency contacts

## Sign-Off

- [ ] Technical Lead: _________________ Date: _______
- [ ] Product Owner: _________________ Date: _______
- [ ] QA Tester: _____________________ Date: _______

## Notes

```
[Add any specific notes, issues encountered, or decisions made during deployment]
```

---

## Common Issues & Solutions

### Issue: Subdomain returns 404

**Solution:**
1. Check DNS propagation: `dig skill.vln.gg`
2. Verify domain in Vercel project settings
3. Check middleware subdomain detection logic
4. Rebuild and redeploy: `vercel --prod`

### Issue: Mobile layout broken

**Solution:**
1. Verify viewport meta tag in HTML
2. Test with Chrome DevTools device emulation
3. Check Tailwind responsive classes (sm:, md:, lg:)
4. Use CSS Grid/Flexbox for responsive layouts

### Issue: Performance issues on slow networks

**Solution:**
1. Enable ISR (Incremental Static Regeneration)
2. Optimize images with Next.js Image component
3. Defer non-critical JavaScript
4. Implement skeleton loaders for async content

### Issue: API endpoints not responding

**Solution:**
1. Check API health endpoint: `curl https://skill.vln.gg/api/health`
2. Verify environment variables in Vercel
3. Check function logs in Vercel dashboard
4. Review middleware authentication logic

---

**Last Updated:** 2026-06-30
**Next Review:** 2026-07-30
