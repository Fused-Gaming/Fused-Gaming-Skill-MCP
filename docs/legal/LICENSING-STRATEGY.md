# Dynagraph Licensing Strategy

**Date:** 2026-08-29  
**Status:** Design Phase  
**Model:** Dual-Licensed (Free Noncommercial + Paid Commercial)

---

## Vision: Three-Tier Licensing Model

Dynagraph is intentionally **not required to be open-source**, but is designed with **transparent licensing** that clearly distinguishes personal/noncommercial use from commercial monetization.

### Tier 1: Personal/Noncommercial Use (FREE)

**License:** PolyForm Noncommercial 1.0.0

**Permitted:**
- Personal projects
- Educational use
- Research
- Internal business analytics (non-monetized)
- Hobby projects
- Noncommercial content

**Restrictions:**
- Cannot monetize rendering output
- Cannot offer rendering as paid service
- Cannot use in commercial SaaS
- Cannot redistribute for commercial purposes

**Enforcement:**
- Source-available (source code provided)
- License header in all files
- Runtime compliance metadata
- No watermark (trust-based model)

---

### Tier 2: Commercial/Professional Use (PAID)

**License:** Separate Commercial License Agreement

**Permitted:**
- Rendering for commercial products
- SaaS applications
- Paid rendering services
- Resale of generated assets
- White-label implementations
- Any monetization or commercial distribution

**Tiers:**
| Tier | Annual Fee | Domains | Use Cases |
|------|-----------|---------|-----------|
| **Starter** | $500 | 1 domain | Small businesses, indie projects with revenue |
| **Professional** | $2,500 | 5 domains | Growing SaaS, agencies, content platforms |
| **Enterprise** | $25,000+ | Unlimited | Large-scale SaaS, Fortune 500, white-label |

**Features:** All tiers receive same core functionality. Tiering is based on commercial scope/revenue.

---

## Dual-License Boundary

```
Dynagraph Core Packages
├── @h4shed/dynagraph (DUAL-LICENSED)
├── @h4shed/dynagraph-renderer (DUAL-LICENSED)
├── @h4shed/dynagraph-templates (DUAL-LICENSED)
└── @h4shed/dynagraph-cli (DUAL-LICENSED)

MCP Adapter
└── @h4shed/skill-dynagraph (Apache-2.0)
    └─ Reason: MCP integration remains permissive for broader ecosystem
```

**Separation:** The MCP adapter (Apache-2.0) can be used in any commercial MCP context. The core Dynagraph library requires appropriate license based on use case.

---

## License Files & Distribution

### Primary: PolyForm Noncommercial 1.0.0

**File:** `LICENSE` (in dynagraph/ repo root)

**Text:** https://polyformproject.org/licenses/noncommercial/1.0.0/

**Key Clauses:**
1. Personal/noncommercial use is free
2. Redistribution permitted under same terms
3. No warranty; as-is
4. No license grant for competitive use
5. Modification only for personal use

### Secondary: Commercial License

**File:** `LICENSE.COMMERCIAL` (or provided via agreement)

**Grants:**
- Unrestricted commercial use
- Redistribution rights
- SaaS/hosting rights
- White-label rights
- Per-tier domain/revenue limits

---

## Enforcement Model: Transparent + Trust-Based

### NOT Implemented:
- ❌ Secret telemetry
- ❌ Aggressive license checking
- ❌ Hardware fingerprinting
- ❌ Phone-home requirements
- ❌ Code obfuscation
- ❌ Watermarks on output

### Implemented:
- ✅ License header in source
- ✅ Runtime license validation (optional)
- ✅ Audit trail via service logs (if API used)
- ✅ Honest licensing model
- ✅ Clear terms
- ✅ Easy commercial licensing path

---

## Evidence Collection for Compliance

If disputes arise, evidence includes:

### 1. Direct Rendering Service

If Dynagraph renders via HTTP API:

```
GET /v1/render/:template
  ├─ Project ID (from request)
  ├─ License token (from request)
  ├─ Dimensions/format (shows scope)
  └─ Response headers
      ├─ X-Dynagraph-Render-ID
      ├─ X-Dynagraph-Project-ID
      └─ X-Dynagraph-License-Type
```

**Server logs capture:**
- Domain/referrer
- IP address
- Timestamp
- Template used
- Render frequency

---

### 2. SDK Usage (Offline)

If SDK is used locally or in private infrastructure:

```typescript
import { render } from '@h4shed/dynagraph';

const result = await render({
  template: 'profile',
  props: {...},
  // License metadata optional in SDK
  // Only checked if connected to license service
});

// Generated SVG/PNG includes metadata:
// <!--
//   Dynagraph v1.0.0
//   Render ID: xxxx-xxxx-xxxx
//   License: PolyForm Noncommercial OR Commercial
//   Generated: 2026-08-29T...
// -->
```

---

### 3. CDN Asset References

If Dynagraph assets hosted on CDN:

```
<meta property="og:image" content="https://cdn.dynagraph.io/v1/assets/[render-id].png" />

CDN access logs show:
  ├─ Asset ID pattern
  ├─ Referrer domain
  ├─ Access frequency
  └─ Time window
```

**Pattern:** Regular renders for commercial platform = evidence of commercial use.

---

### 4. License Metadata in Generated Files

**SVG Output:**
```xml
<svg>
  <metadata>
    <dynagraph version="1.0.0">
      <render-id>render-xxxx-xxxx-xxxx</render-id>
      <license-type>noncommercial | commercial</license-type>
      <project-id>proj-xxxx-xxxx-xxxx</project-id>
      <timestamp>2026-08-29T15:30:00Z</timestamp>
      <copyright>Copyright © 2026 Fused Gaming</copyright>
    </dynagraph>
  </metadata>
  ...
</svg>
```

**PNG Output:**
```
PNG metadata (exif):
  - XMP namespace: Dynagraph
  - render-id, license-type, project-id
  - Social media apps may strip this
```

---

## Licensing Transition Path

### For Existing Projects

If a project was noncommercial and becomes commercial:

**Path 1: Upgrade Commercial License**
1. Purchase commercial license tier matching scope
2. License agreement + documentation
3. Continue using latest version
4. Full commercial rights retroactively

**Path 2: Pause & Transition**
1. Switch to earlier noncommercial version (if available)
2. Replace Dynagraph with alternative (if needed)
3. No penalty; licenses work retroactively

---

## Frequently Anticipated Questions

### Q: Can I use Dynagraph in my SaaS app?
**A (Noncommercial):** No. SaaS monetizes the rendering. Requires commercial license.

**A (Commercial):** Yes. Choose tier based on annual revenue/domains. Starter ($500) covers typical SaaS.

---

### Q: Can I modify Dynagraph source?
**A (Noncommercial):** Yes, for personal use only. Modifications must stay private.

**A (Commercial):** Yes, unlimited. Modifications can be commercialized.

---

### Q: Can I redistribute Dynagraph?
**A (Noncommercial):** Yes, under same PolyForm Noncommercial 1.0.0 terms.

**A (Commercial):** Yes, under commercial license terms (white-label OK).

---

### Q: What if I forget to buy a license and use commercially?
**A:** 
1. Noncommercial license covers "personal" use broadly interpreted
2. If discovered using commercially, contact us
3. Option to purchase commercial license retroactively
4. No penalties for good-faith adoption
5. Honest communication preferred

---

### Q: Do I need a license token/API key?
**A:** 
- Not required for SDK usage
- Optional for API usage (allows per-project tracking)
- Runtime license validation only if configured
- Trust-based model by default

---

### Q: What about open-source SaaS?
**A:** 
- OSS projects are considered noncommercial if no revenue
- If you offer SaaS around Dynagraph (hosting, services), that's commercial
- Free-tier SaaS may qualify for noncommercial; ask
- Commercial license needed for monetization

---

## Implementation Timeline

### Phase 1: Source-Available Release (Now)
- ✅ Source code available under PolyForm Noncommercial
- ✅ License header + README clear about terms
- ✅ Basic metadata in output
- ✅ Honor-based enforcement

### Phase 2: Commercial Licensing (Months 1-2)
- ⏳ Commercial license agreement drafted
- ⏳ License management portal
- ⏳ License validation API (optional)
- ⏳ Upgrade path for existing users

### Phase 3: Compliance Tools (Months 2-3)
- ⏳ License token system
- ⏳ Service-side audit logs
- ⏳ Compliance reporting dashboard

---

## Legal Assumptions & Limitations

**This strategy is NOT:**
- A guarantee of legal validity in all jurisdictions
- A replacement for legal counsel review
- Binding without formal legal review
- Enforceable in courts without additional setup

**This strategy IS:**
- A clear statement of intent
- A reasonable attempt at dual-licensing
- A transparent framework
- Subject to revision based on legal review

**Before Production:**
1. Have a lawyer review PolyForm Noncommercial 1.0.0
2. Draft commercial license agreement
3. Establish licensing enforcement policy
4. Audit for tax/business implications
5. Consider jurisdiction-specific compliance

---

## Related Documents

- **DEPENDENCY-LICENSE-AUDIT.md** — Third-party license compliance
- **CLEAN-ROOM.md** — Reference implementation record
- **COMPLIANCE.md** — Technical enforcement details

---

**Status:** Design Ready for Legal Review  
**Date:** 2026-08-29  
**Next Step:** Engage legal counsel for formal licensing agreement
