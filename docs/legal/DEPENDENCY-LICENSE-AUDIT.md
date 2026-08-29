# Dependency License Audit for Dynagraph

**Date:** 2026-08-29  
**Scope:** Production dependencies required for Dynagraph rendering pipeline  
**Objective:** Identify license risks before implementation

---

## Classification Framework

### 🟢 GREEN — Permissive/Commercial-Compatible

Licenses that pose **no material restrictions** on commercial monetization:

- MIT
- Apache-2.0
- BSD-2-Clause / BSD-3-Clause
- ISC
- 0BSD
- MPL-2.0 (with conditions)

### 🟡 YELLOW — Review Required

Licenses with **obligations that may apply** but are manageable:

- LGPL-2.1 / LGPL-3.0 (library linking only, static linking may require disclosure)
- MPL-2.0 (file-level copyleft)
- EPL-1.0 / EPL-2.0 (file-level copyleft, similar to MPL)
- AGPL-3.0 (requires review if used as library vs. service)

### 🔴 RED — Incompatible or Risky

Licenses that **materially restrict commercialization**:

- AGPL-3.0 (as direct dependency in distributed library)
- GPL-2.0 / GPL-3.0 (strong copyleft infects derived works)
- SSPL (server-side public license — restrictive)
- Commons Clause (prohibits commercial SaaS)
- BUSL-1.1 (Business Source License — use restrictions)

---

## Candidate Dependencies for Dynagraph

### 1. Vector Rendering & Graphics

#### Satori (satori)

| Property | Value |
|----------|-------|
| **Purpose** | Convert HTML/CSS to SVG |
| **License** | MIT ✅ |
| **Risk Level** | 🟢 GREEN |
| **Usage** | Optional; Dynagraph may use as reference for CSS-to-SVG conversion |
| **Status** | ✅ APPROVED |

**Assessment:** MIT-licensed. Can be used in commercial products. If used directly as dependency, ensure any modifications/forks maintain MIT license.

---

#### Skia.js (skia-canvas)

| Property | Value |
|----------|-------|
| **Purpose** | 2D graphics/canvas binding to Skia library |
| **License** | Apache-2.0 (Node.js bindings) |
| **Underlying Library** | Skia (BSD-3-Clause) |
| **Risk Level** | 🟢 GREEN |
| **Usage** | Direct canvas rendering (alternative to Sharp) |
| **Status** | ✅ APPROVED |

**Assessment:** Apache-2.0 / BSD-3-Clause stack. Both permissive. Safe for commercial use.

---

#### Canvas (node-canvas)

| Property | Value |
|----------|-------|
| **Purpose** | Canvas binding to libcairo |
| **License** | MIT |
| **Underlying Library** | Cairo (LGPL-2.1 + MPL-1.1) |
| **Risk Level** | 🟡 YELLOW |
| **Usage** | Optional; alternative rendering backend |
| **Status** | ⚠️ CONDITIONAL APPROVAL |

**Assessment:** Canvas itself is MIT, but libcairo (underlying C library) uses LGPL-2.1 + MPL-1.1. **Not** triggering GPL copyleft because:
- Canvas is wrapper (not derived work of Cairo)
- C library remains separate at runtime
- Node.js binding links dynamically
- Commercial use permitted with binary redistribution clause

**Condition:** If bundling Cairo statically, provide source/build instructions per LGPL-2.1 Section 6(a).

---

#### RESVG (resvg-js)

| Property | Value |
|----------|-------|
| **Purpose** | Rust-based SVG rasterizer |
| **License** | Apache-2.0 (Node binding) + MPL-2.0 (Rust library) |
| **Risk Level** | 🟡 YELLOW |
| **Usage** | Direct SVG → PNG/WebP rasterization |
| **Status** | ✅ APPROVED |

**Assessment:** Apache-2.0 + MPL-2.0 combination. MPL-2.0 file-level copyleft does not affect Apache-2.0 binding (different files). Safe for commercial distribution.

---

### 2. Rasterization & Image Processing

#### Sharp (sharp)

| Property | Value |
|----------|-------|
| **Purpose** | Image processing: PNG/WebP encoding, DPI scaling |
| **License** | Apache-2.0 |
| **Risk Level** | 🟢 GREEN |
| **Usage** | Primary rasterization library |
| **Status** | ✅ APPROVED |

**Assessment:** Apache-2.0. Mature, widely used in commercial products. No licensing concerns.

---

#### ImageMagick (magick)

| Property | Value |
|----------|-------|
| **Purpose** | Advanced image manipulation |
| **License** | Apache-2.0 (ImageMagick) |
| **Underlying Library** | Various (ImageMagick core) |
| **Risk Level** | 🟢 GREEN |
| **Usage** | Optional; fallback for complex transforms |
| **Status** | ✅ APPROVED |

**Assessment:** Apache-2.0. Safe for commercial use.

---

#### Puppeteer (puppeteer)

| Property | Value |
|----------|-------|
| **Purpose** | Headless browser rendering (alternative approach) |
| **License** | Apache-2.0 |
| **Underlying Library** | Chromium (Chromium License — permissive) |
| **Risk Level** | 🟢 GREEN (License) / 🔴 RED (Design Fit) |
| **Usage** | **NOT RECOMMENDED for Dynagraph** |
| **Status** | ❌ REJECTED |

**Rejection Reason:** While Apache-2.0 licensed, using Puppeteer introduces:
- Large runtime dependency (entire browser)
- Non-deterministic output (browser rendering variance)
- Performance overhead (startup, memory)
- Licensing of Chromium updates to monitor

**Recommendation:** Use native graphics libraries instead (Sharp, RESVG, or Skia).

---

### 3. Typography & Fonts

#### Fontkit (fontkit)

| Property | Value |
|----------|-------|
| **Purpose** | Font file parsing and metrics |
| **License** | MIT |
| **Risk Level** | 🟢 GREEN |
| **Usage** | Font loading and text measurement |
| **Status** | ✅ APPROVED |

**Assessment:** MIT. Safe for commercial use.

---

#### Opentype.js (opentype.js)

| Property | Value |
|----------|-------|
| **Purpose** | OpenType font parsing and rendering |
| **License** | MIT |
| **Risk Level** | 🟢 GREEN |
| **Usage** | Font rendering in SVG |
| **Status** | ✅ APPROVED |

**Assessment:** MIT. Safe for commercial use.

---

#### Font Files (Google Fonts, etc.)

| Property | Value |
|----------|-------|
| **Purpose** | Font assets for Dynagraph |
| **License** | Various (OFL-1.1 most common) |
| **Risk Level** | 🟢 GREEN |
| **Usage** | Included in renders as glyphs |
| **Status** | ✅ APPROVED |

**Assessment:** OFL-1.1 (Open Font License) is permissive for embedding. Must include license notice in any generated assets.

---

### 4. HTTP Server (Optional — Phase 2)

#### Express (express)

| Property | Value |
|----------|-------|
| **Purpose** | HTTP server framework |
| **License** | MIT |
| **Risk Level** | 🟢 GREEN |
| **Usage** | Rendering API server (optional) |
| **Status** | ✅ APPROVED |

---

#### Hono (hono)

| Property | Value |
|----------|-------|
| **Purpose** | Lightweight HTTP server (alternative) |
| **License** | MIT |
| **Risk Level** | 🟢 GREEN |
| **Usage** | Rendering API server (optional) |
| **Status** | ✅ APPROVED |

---

### 5. CLI & I/O

#### Commander (commander)

| Property | Value |
|----------|-------|
| **Purpose** | CLI argument parsing |
| **License** | MIT |
| **Risk Level** | 🟢 GREEN |
| **Usage** | CLI commands |
| **Status** | ✅ APPROVED |

---

#### Inquirer (inquirer)

| Property | Value |
|----------|-------|
| **Purpose** | Interactive CLI prompts |
| **License** | MIT |
| **Risk Level** | 🟢 GREEN |
| **Usage** | Interactive template selection |
| **Status** | ✅ APPROVED |

---

### 6. Testing & Benchmarking

#### Jest (jest)

| Property | Value |
|----------|-------|
| **Purpose** | Test framework |
| **License** | MIT |
| **Risk Level** | 🟢 GREEN |
| **Usage** | Unit tests (dev dependency) |
| **Status** | ✅ APPROVED |

**Note:** Dev dependency — not in production bundle.

---

#### Vitest (vitest)

| Property | Value |
|----------|-------|
| **Purpose** | Lightweight test runner |
| **License** | MIT |
| **Risk Level** | 🟢 GREEN |
| **Usage** | Unit tests (dev dependency) |
| **Status** | ✅ APPROVED |

---

### 7. Existing Fused Gaming Dependencies

#### @h4shed/mcp-core

| Property | Value |
|----------|-------|
| **License** | Apache-2.0 |
| **Risk Level** | 🟢 GREEN |
| **Status** | ✅ APPROVED |

---

#### @h4shed/license-client

| Property | Value |
|----------|-------|
| **License** | Apache-2.0 |
| **Risk Level** | 🟢 GREEN |
| **Status** | ✅ APPROVED |

---

#### @h4shed/design-tokens

| Property | Value |
|----------|-------|
| **License** | Apache-2.0 |
| **Risk Level** | 🟢 GREEN |
| **Status** | ✅ APPROVED |

---

## Summary: Approved vs. Rejected

### ✅ APPROVED Dependencies

| Category | Primary Choice | License | Alternative |
|----------|---|---------|---|
| **Vector Rendering** | Satori (MIT) | MIT | — |
| **Canvas/2D** | Skia.js (Apache-2.0) | Apache-2.0 | Canvas (MIT+LGPL) |
| **Rasterization** | Sharp (Apache-2.0) | Apache-2.0 | RESVG (Apache-2.0) |
| **SVG Rasterization** | RESVG (Apache-2.0/MPL-2.0) | Multi | — |
| **Font Parsing** | Fontkit (MIT) | MIT | Opentype.js (MIT) |
| **HTTP Server** | Express or Hono | MIT | Both approved |
| **CLI** | Commander + Inquirer | MIT | — |
| **Testing** | Jest or Vitest | MIT | Both approved |

### ❌ REJECTED Dependencies

| Library | License | Reason |
|---------|---------|--------|
| **Puppeteer** | Apache-2.0 | Non-deterministic output, performance overhead, design mismatch (we want vector-first, not browser) |
| **Any GPL-licensed libs** | GPL-2.0/3.0 | Copyleft infects derived works; incompatible with commercial licensing model |
| **AGPL dependencies** | AGPL-3.0 | Requires source disclosure if modified; incompatible with commercial closed-source use |

---

## Transitive Dependency Considerations

When including dependencies, audit their transitive dependencies for:

1. **GPL licenses** — Would trigger copyleft requirements
2. **AGPL** — Service-side copyleft
3. **Commons Clause** — Prohibits commercial SaaS
4. **Unlicensed packages** — Resolve before inclusion

**Tools to use:**
```bash
# Check for GPL/AGPL transitive deps
npm ls --prod | grep -i gpl

# License report
npm audit --audit-level=none
# (Manual review of output)

# Automated license scanning
npx license-checker --unknown
```

---

## Licensing Obligations Summary

### Dependencies Requiring Attribution Only
- MIT licenses (Satori, Fontkit, Canvas, Express, etc.)
- Apache-2.0 (Sharp, Skia.js, RESVG wrapper)
- BSD licenses

**Action:** Include LICENSE file + NOTICE in distribution.

### Dependencies Requiring Build Instructions
- libcairo (if statically linked with Canvas)

**Action:** If using Canvas with static cairo, provide source/compilation instructions per LGPL-2.1.

### Dependencies with No Restrictions
- All approved choices

**Action:** No special handling needed for commercial licensing.

---

## Recommendation

**Dynagraph's Recommended Dependency Stack:**

```json
{
  "dependencies": {
    "sharp": "^0.33.0",              // Rasterization (Apache-2.0)
    "satori": "^0.10.13",            // HTML→SVG (MIT)
    "fontkit": "^2.5.0",             // Font parsing (MIT)
    "commander": "^12.1.0",          // CLI (MIT)
    "@h4shed/mcp-core": "^1.0.24",   // MCP integration (Apache-2.0)
    "@h4shed/license-client": "^1.0.0", // License validation (Apache-2.0)
    "@h4shed/design-tokens": "^1.0.0"   // Design system (Apache-2.0)
  },
  "devDependencies": {
    "vitest": "^1.0.0",              // Testing (MIT)
    "typescript": "^5.3.2",          // TypeScript (Apache-2.0)
    "@types/node": "^20.0.0"         // Types (MIT)
  }
}
```

**All dependencies are 🟢 GREEN or 🟡 YELLOW (manageable).**

---

## Next Steps

1. ✅ License audit complete
2. ⏳ Final review by legal counsel recommended before production
3. ⏳ Include license notices in distributed packages
4. ⏳ Monitor transitive dependencies during development

---

**Audit Date:** 2026-08-29  
**Recommendation:** APPROVED for implementation with noted conditions  
**Review Status:** Ready for team review and legal sign-off
