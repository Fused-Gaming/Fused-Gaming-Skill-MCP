# 🎨 Automated Socials Asset Pipeline - Specification v1.0

**Version:** 1.0  
**Status:** Phase 1 Complete (Discovery + Planning)  
**Date:** 2026-04-16  
**Related Issue:** [#55 - Fully Automated Socials Skill Prompt](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/issues/55)

---

## Executive Summary

This specification defines a **production-grade, fully automated pipeline** for generating, validating, and maintaining social media branding assets across 12+ platforms. The system operates in 5 execution phases:

1. **DISCOVER** — Identify platforms, assets, and requirements
2. **PLAN** — Define asset matrix and dependencies
3. **GENERATE** — Produce assets using image pipeline tools
4. **VALIDATE** — Enforce constraints (dimensions, safe zones, file sizes)
5. **ITERATE** — Improve layouts and optimize outputs

This document covers **Phase 1: Discovery + Planning**.

---

## 📋 PLATFORM MATRIX

### Classification Schema

All platforms are categorized by asset requirement complexity:

#### **TYPE A: STRICT DIMENSION SPEC**
Requires exact dimensions, exact safe zone compliance.

| Platform | Avatar | Profile Header | OG Image | Favicon | Notes |
|----------|--------|-----------------|----------|---------|-------|
| **LinkedIn** | 400×400 | 1200×627 | 1200×627 | 16×16 | Strict brand guidelines |
| **Instagram** | 320×320 | 1200×627 | 1080×1080 | N/A | Square + feed focus |
| **Reddit** | 256×256 | 4000×215 | 1200×627 | 32×32 | Banner: icon + brand name |
| **GitHub** | 300×300 | 1280×640 | 1200×628 | 32×32 | Org avatar strictly square |
| **Twitter/X** | 400×400 | 1500×500 | 1200×675 | 32×32 | Aspect ratio strict |
| **Facebook** | 300×300 | 1200×628 | 1200×630 | 32×32 | OG preview critical |
| **TikTok** | 200×200 | N/A | 1080×1920 | N/A | Vertical video-first |
| **YouTube** | 800×800 | 2560×1440 | 1280×720 | 32×32 | Channel art strict |
| **Telegram** | 512×512 | 1200×630 | 1200×630 | N/A | OG preview critical |
| **Discord** | 512×512 | 960×540 | 1200×630 | N/A | Embed sizing critical |
| **Medium** | 400×400 | 1200×628 | 1200×628 | 32×32 | Publication logo |
| **Trystpilot.xyz** | 512×512 | 1200×630 | 1200×630 | N/A | Custom site asset |

**Count:** 12 core platforms  
**Unique Avatar Sizes:** 7 (200×200, 256×256, 300×300, 320×320, 400×400, 512×512, 800×800)  
**Unique Header/OG Sizes:** 8 unique dimensions

---

### Asset Type Matrix

#### **CATEGORY 1: IDENTITY ASSETS**
Core brand identity elements, platform-agnostic.

| Asset | Format | Versions | Notes |
|-------|--------|----------|-------|
| **Logo** | SVG + PNG | 5 (full, mark, inverted, outline, monochrome) | Source of truth |
| **Logo Variants** | PNG | 20+ | Sized per platform |
| **Color Palette** | SCSS + JSON | 1 | Brand colors (primary, secondary, accent, neutral) |
| **Typography** | CSS + Web Fonts | 1-2 | Primary + secondary font specs |

#### **CATEGORY 2: PLATFORM-SPECIFIC ASSETS**
Tailored per platform.

| Platform | Avatar | Profile Header | Favicon | OG Image | Additional |
|----------|--------|-----------------|---------|----------|-------------|
| LinkedIn | ✅ | ✅ | ✅ | ✅ | Article thumbnail |
| Instagram | ✅ | ✅ (stories) | ❌ | ✅ | Feed square |
| Reddit | ✅ | ✅ | ✅ | ✅ | Sidebar banner |
| GitHub | ✅ | ✅ | ✅ | ✅ | Org card preview |
| Twitter | ✅ | ✅ | ✅ | ✅ | Quote card |
| Facebook | ✅ | ✅ | ✅ | ✅ | Event image |
| TikTok | ✅ | ❌ | ❌ | ✅ | Video thumbnail |
| YouTube | ✅ | ✅ | ✅ | ✅ | Video thumbnail |
| Telegram | ✅ | ✅ | ❌ | ✅ | Bot avatar |
| Discord | ✅ | ✅ | ❌ | ✅ | Embed image |
| Medium | ✅ | ❌ | ✅ | ✅ | Publication image |
| Trystpilot | ✅ | ✅ | ❌ | ✅ | Custom card |

**Total Platform Assets:** 60+ (across 12 platforms)  
**Identity Assets:** 8  
****Grand Total:** 70+ unique asset files

---

## 🧱 SYSTEM INPUTS

The pipeline operates on standardized input configuration.

### Input Schema: BrandConfig

```json
{
  "brand_name": "string",
  "brand_slug": "string",
  "version_tag": "semver",
  "logo_source": {
    "svg_path": "string",
    "colors": {
      "primary": "#hex",
      "secondary": "#hex",
      "accent": "#hex",
      "neutral_dark": "#hex",
      "neutral_light": "#hex"
    }
  },
  "typography": {
    "primary_font": "string",
    "secondary_font": "string",
    "heading_weight": "600-900",
    "body_weight": "400-500"
  },
  "visual_style": "glitch|brutalist|minimal|playful",
  "target_platforms": ["linkedin", "instagram", "reddit", "github", "twitter", "facebook", "tiktok", "youtube", "telegram", "discord", "medium", "trystpilot"],
  "safe_zone_percentage": 75,
  "output_format": "png|webp|both"
}
```

### Example Config: Fused Gaming Brand

```json
{
  "brand_name": "Fused Gaming",
  "brand_slug": "fused-gaming",
  "version_tag": "1.0.0",
  "logo_source": {
    "svg_path": "assets/logos/fused-gaming-logo.svg",
    "colors": {
      "primary": "#FF6B35",
      "secondary": "#004E89",
      "accent": "#F7B801",
      "neutral_dark": "#1A1A1A",
      "neutral_light": "#FFFFFF"
    }
  },
  "typography": {
    "primary_font": "Inter",
    "secondary_font": "Playfair Display",
    "heading_weight": "700",
    "body_weight": "500"
  },
  "visual_style": "playful",
  "target_platforms": ["all"],
  "safe_zone_percentage": 75,
  "output_format": "png"
}
```

---

## 📐 DESIGN RULES & CONSTRAINTS

### Safe Zone & Composition Rules

```
┌─────────────────────────────────┐
│  ╔═════════════════════════════╗ │
│  ║  SAFE ZONE (70-80% center)  ║ │
│  ║                             ║ │
│  ║  Logo + Text + Callout      ║ │
│  ║  (protected from crop)      ║ │
│  ║                             ║ │
│  ╚═════════════════════════════╝ │
│         Effects Only             │
│     (shadows, gradients)         │
└─────────────────────────────────┘
```

**Rules:**
- Safe zone must contain all critical elements (logo, text, primary visual)
- Edges (20-30%) reserved for effects (shadows, glows, blur)
- No text outside safe zone
- No critical information at edges
- Minimum padding: 5% of dimensions

### Hierarchy Rules

1. **Identity** (Logo) — Always centered, never distorted
2. **Readability** (Text) — High contrast (WCAG AA minimum)
3. **Style** (Effects) — Secondary, never compromises above two

### Color & Contrast

- **Brand consistency**: Use defined color palette only
- **Contrast**: Minimum WCAG AA (4.5:1 text, 3:1 graphics)
- **Color space**: sRGB (assume 24-bit color)
- **Platform adaptation**: Respect platform color space limits (e.g., Twitter limited to 16M colors, some platforms use 8-bit)

### Typography Rules

- **Headings**: Primary font, 700+ weight
- **Body**: Secondary font, 400-500 weight
- **Minimum size**: 12px (on exported asset)
- **Line height**: 1.4-1.6
- **Character spacing**: -0.02em to 0.04em

---

## 📦 OUTPUT STRUCTURE

All assets are organized in a versioned, platform-segmented hierarchy.

```
assets/
├── v1.0.0/                              # Version tag
│   ├── _manifest.json                   # Asset inventory + hashes
│   ├── _validation_report.json           # Compliance report
│   ├── README.md                         # Version notes
│   │
│   ├── core/
│   │   ├── logo.svg                      # Source logo (SVG)
│   │   ├── logo-full.png                 # Full color version
│   │   ├── logo-mark.png                 # Mark only (for favicons)
│   │   ├── logo-inverted.png             # Light background version
│   │   ├── logo-outline.png              # Outline-only version
│   │   └── logo-monochrome.png           # Single color version
│   │
│   ├── avatars/
│   │   ├── 200x200_tiktok.png
│   │   ├── 256x256_reddit.png
│   │   ├── 300x300_github.png
│   │   ├── 300x300_facebook.png
│   │   ├── 320x320_instagram.png
│   │   ├── 400x400_linkedin.png
│   │   ├── 400x400_twitter.png
│   │   ├── 512x512_telegram.png
│   │   ├── 512x512_discord.png
│   │   ├── 512x512_medium.png
│   │   ├── 512x512_trystpilot.png
│   │   └── 800x800_youtube.png
│   │
│   ├── headers/
│   │   ├── linkedin_1200x627.png
│   │   ├── instagram_1200x627.png        # or 1080x1080 for story
│   │   ├── reddit_4000x215.png           # Banner format
│   │   ├── github_1280x640.png
│   │   ├── twitter_1500x500.png
│   │   ├── facebook_1200x628.png
│   │   ├── youtube_2560x1440.png
│   │   ├── medium_1200x628.png
│   │   └── trystpilot_1200x630.png
│   │
│   ├── og-images/                        # Open Graph / Preview Images
│   │   ├── linkedin_1200x627.png
│   │   ├── twitter_1200x675.png
│   │   ├── facebook_1200x630.png
│   │   ├── reddit_1200x627.png
│   │   ├── instagram_1080x1080.png       # Feed + story fallback
│   │   ├── tiktok_1080x1920.png          # Vertical video thumbnail
│   │   ├── youtube_1280x720.png
│   │   ├── telegram_1200x630.png
│   │   ├── discord_1200x630.png
│   │   ├── github_1200x628.png
│   │   ├── medium_1200x628.png
│   │   └── trystpilot_1200x630.png
│   │
│   ├── favicons/
│   │   ├── 16x16.png
│   │   ├── 32x32.png
│   │   ├── 64x64.png
│   │   ├── favicon.ico
│   │   └── favicon-svg.svg
│   │
│   ├── design-tokens/
│   │   ├── colors.json                   # Color palette (hex, rgb, hsl)
│   │   ├── typography.json               # Font specs
│   │   ├── spacing.json                  # Padding/margin rules
│   │   └── effects.json                  # Shadow, blur, gradient specs
│   │
│   └── metadata/
│       ├── brand-config.json              # Input configuration
│       ├── platform-specs.json            # Platform requirements reference
│       └── generation-log.json            # Build log + timestamps
│
└── latest/                              # Symlink to latest version
```

**Total Assets per Version:** 70+  
**Storage per Version (PNG):** ~10-15 MB  
**Storage per Version (WebP):** ~5-8 MB

---

## 🔄 ASSET DEPENDENCY GRAPH

```
logo.svg (SOURCE OF TRUTH)
│
├→ logo-full.png
│  ├→ 200×200 avatar (TikTok)
│  ├→ 256×256 avatar (Reddit)
│  ├→ 300×300 avatar (GitHub, Facebook)
│  ├→ 320×320 avatar (Instagram)
│  ├→ 400×400 avatar (LinkedIn, Twitter)
│  ├→ 512×512 avatar (Telegram, Discord, Medium, Trystpilot)
│  └→ 800×800 avatar (YouTube)
│
├→ logo-mark.png
│  └→ Favicon variants (16×16, 32×32, 64×64, .ico)
│
├→ Header images per platform
│  └→ Applied to 4000×215 (Reddit), 1500×500 (Twitter), etc.
│
├→ OG Images per platform
│  └→ Applied with safe zone + text overlay
│
└→ Design tokens
   └→ Applied to all generated assets
```

**Dependency Count:** 70+ (logo + avatars + headers + og-images + favicons)  
**Generation Order:** Source → Variants → Platform-Specific → Validation

---

## ✅ VALIDATION CHECKLIST

Every asset must pass validation before approval.

### Dimension Validation
- [ ] Avatar: Exactly matches platform spec (±0 pixels)
- [ ] Headers: Exactly matches platform spec (±0 pixels)
- [ ] OG Images: Exactly matches platform spec (±0 pixels)
- [ ] Favicons: Standard sizes (16, 32, 64, +svg)

### Safe Zone Validation
- [ ] Logo centered
- [ ] No text outside safe zone
- [ ] Safe zone integrity check (no crop/distortion)
- [ ] Padding consistent (≥5%)

### Visual Quality
- [ ] Text readable (≥12px, WCAG AA contrast)
- [ ] Logo not distorted
- [ ] Colors match brand palette
- [ ] No compression artifacts (PNG-8 vs PNG-24)

### File Standards
- [ ] PNG: Optimized (OptiPNG or TinyPNG)
- [ ] WebP: If provided, smaller than PNG
- [ ] SVG: Valid XML, optimized paths
- [ ] Naming: snake_case_dimensions.png

### Platform Compatibility
- [ ] Test in platform preview (where possible)
- [ ] Verify upload handles file size
- [ ] Check safe zone display in actual UI

---

## 📊 Phase 1 Deliverables (This Document)

- ✅ Platform matrix (12 platforms identified)
- ✅ Asset type classification (Identity + Platform-Specific)
- ✅ Input configuration schema
- ✅ Output directory structure
- ✅ Design rules & constraints
- ✅ Asset dependency graph
- ✅ Validation checklist
- ✅ Phase 2 prerequisites identified

---

## 🚀 Phase 2: Generation (Future)

**What's Next:**
1. Image generation engine (using Mermaid, SVG, or Canvas API)
2. Asset batching (resize logo → generate avatars → generate OG images)
3. Dynamic text overlay (brand name + platform-specific messaging)
4. Automatic safe zone enforcement

**Implementation Tools:**
- Canvas API or sharp (Node.js) for resizing
- SVG rendering for vector assets
- Playwright for screenshot-based OG generation
- Batch processing for efficiency

---

## 🎯 Success Criteria (Phase 1: Complete)

- [x] Platform matrix defined (12 platforms)
- [x] Asset types categorized (Identity + Platform-Specific)
- [x] Output structure specified
- [x] Design rules documented
- [x] Input schema defined
- [x] Validation criteria established
- [x] Dependency graph mapped
- [x] Phase 2 prerequisites ready

---

## 📞 Related Issues & Tasks

- **Issue #55**: Fully Automated Socials Skill Prompt (parent issue)
- **Issues #56-66**: Platform-specific asset generation tasks (blocked until Phase 2)
- **Skill**: `@fused-gaming/skill-socials-automation` (to be created)

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-16  
**Status:** ✅ Phase 1 Complete (Ready for Phase 2 Implementation)
