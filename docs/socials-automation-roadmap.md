# 🗺️ Socials Automation Skill - Execution Roadmap

**Project:** Fully Automated Social Media Asset Pipeline  
**Skill Name:** `@fused-gaming/skill-socials-automation`  
**Timeline:** 4 phases over 4 sessions (estimated 240 minutes)  
**Status:** Phase 1 ✅ Complete, Phase 2-5 📋 Scheduled

---

## Phase Overview

```
Phase 1 (60 min) ✅ DONE
├─ Discovery: Identify 12 platforms + 70+ assets
├─ Planning: Define asset matrix + output structure
├─ Specification: Document all requirements
└─ Deliverable: socials-asset-pipeline-specification.md

Phase 2 (60 min) 🚀 NEXT
├─ Implementation: Image generation engine
├─ Asset generation: Logo → Avatars → Headers → OG
├─ Batching: Optimize for performance
└─ Deliverable: Core skill scaffolding + first 20 assets

Phase 3 (60 min) 📍 FUTURE
├─ Validation: Dimension + safe zone checks
├─ Error recovery: Auto-regenerate failures
├─ Manifest generation: Asset inventory + hashes
└─ Deliverable: Validation system + platform test suite

Phase 4 (60 min) 🔄 FUTURE
├─ Iteration: Layout optimization
├─ Evolution: Add new platform support
├─ Versioning: Manage asset versions
└─ Deliverable: Evolution system + archive management
```

---

## 📋 Phase 2: Asset Generation Implementation

**Effort:** 60 minutes  
**Blockers:** None  
**Dependencies:** Phase 1 specification ✅

### 2.1 Skill Package Creation (15 min)

```bash
# Create skill package
packages/skills/socials-automation/
├── src/
│   ├── index.ts                    # Skill entry point
│   ├── generator.ts                # Image generation logic
│   ├── config.ts                   # Configuration loader
│   ├── types.ts                    # TypeScript interfaces
│   └── utils/
│       ├── resize.ts               # Image resizing
│       ├── overlay.ts              # Text/logo overlay
│       └── optimize.ts             # PNG/WebP compression
├── assets/
│   └── templates/                  # SVG templates per platform
│       ├── linkedin-og.svg
│       ├── twitter-og.svg
│       ├── instagram-og.svg
│       └── ...
├── test-fixtures/
│   ├── input/                      # Sample brand configs
│   │   └── fused-gaming.json
│   └── expected/                   # Expected output assets
│       └── v1.0.0/
├── package.json
├── tsconfig.json
└── README.md
```

### 2.2 Image Generation Engine (30 min)

**Input:** BrandConfig (from Phase 1 spec)  
**Output:** 70+ PNG assets

```typescript
// src/generator.ts
export class SocialsAssetGenerator {
  constructor(config: BrandConfig) { }
  
  async generateAll(): Promise<GeneratedAssets> {
    // 1. Load logo SVG
    const logo = await loadSvg(this.config.logo_source.svg_path);
    
    // 2. Generate logo variants (5)
    const logoVariants = await this.generateLogoVariants(logo);
    
    // 3. Generate avatars (12 platforms × 1 avatar = 12 files)
    const avatars = await this.generateAvatars(logoVariants.full);
    
    // 4. Generate headers (8 platforms = 8 files)
    const headers = await this.generateHeaders(logoVariants.full);
    
    // 5. Generate OG images (12 platforms = 12 files)
    const ogImages = await this.generateOGImages(logoVariants.full);
    
    // 6. Generate favicons (4 files)
    const favicons = await this.generateFavicons(logoVariants.mark);
    
    // 7. Compile manifest + validation report
    const manifest = await this.createManifest({
      avatars, headers, ogImages, favicons, logoVariants
    });
    
    return { manifest, assets: [avatars, headers, ogImages, favicons] };
  }
  
  private async generateAvatars(logo: SVGElement): Promise<Avatar[]> {
    const specs = PLATFORM_SPECS.filter(p => p.avatar);
    return Promise.all(
      specs.map(spec =>
        this.resizeAndCompose(logo, spec.avatar.width, spec.avatar.height)
      )
    );
  }
}
```

### 2.3 Asset Generation Batching (10 min)

**Optimize:** Process multiple assets in parallel

```typescript
// Use concurrent processing for avatar generation
const avatarPromises = platformSpecs
  .filter(p => p.avatar)
  .map(spec =>
    this.generateAvatar(logo, spec).catch(err => ({
      platform: spec.name,
      error: err.message,
      status: 'FAILED'
    }))
  );

const results = await Promise.allSettled(avatarPromises);
```

### 2.4 Testing & Validation (5 min)

```typescript
// test-fixtures/generator.test.ts
describe('SocialsAssetGenerator', () => {
  it('generates 70+ assets from config', async () => {
    const generator = new SocialsAssetGenerator(fixtureConfig);
    const result = await generator.generateAll();
    
    expect(result.assets).toHaveLength(70);
    expect(result.manifest).toBeDefined();
  });
  
  it('generates correct dimensions for LinkedIn avatar', async () => {
    const avatar = await generator.generateAvatar('linkedin');
    expect(avatar.width).toBe(400);
    expect(avatar.height).toBe(400);
  });
});
```

### 2.5 Deliverables

- [ ] Skill package: `@fused-gaming/skill-socials-automation@1.0.0`
- [ ] Generator class with asset generation methods
- [ ] 20+ sample assets (avatars + headers + favicons)
- [ ] Manifest generation
- [ ] Unit tests (50%+ coverage)
- [ ] PR with results + performance benchmarks

---

## 📋 Phase 3: Validation & Error Recovery

**Effort:** 60 minutes  
**Blockers:** Phase 2 completion  
**Prerequisites:** Asset generation working

### 3.1 Validator Implementation (25 min)

```typescript
// src/validator.ts
export class AssetValidator {
  validate(asset: Asset, spec: PlatformSpec): ValidationResult {
    const checks = {
      dimensions: this.checkDimensions(asset, spec),
      safeZone: this.checkSafeZone(asset),
      contrast: this.checkContrast(asset),
      fileSize: this.checkFileSize(asset, spec),
      naming: this.checkNaming(asset)
    };
    
    return {
      passed: Object.values(checks).every(c => c.passed),
      checks,
      failures: Object.values(checks).filter(c => !c.passed)
    };
  }
  
  private checkDimensions(asset: Asset, spec: PlatformSpec): CheckResult {
    const match = asset.width === spec.width && asset.height === spec.height;
    return {
      passed: match,
      message: match
        ? `✅ ${asset.width}×${asset.height}`
        : `❌ Expected ${spec.width}×${spec.height}, got ${asset.width}×${asset.height}`
    };
  }
}
```

### 3.2 Automatic Regeneration (20 min)

```typescript
// src/recovery.ts
export class ErrorRecovery {
  async regenerateFailedAssets(
    failures: ValidationFailure[],
    generator: SocialsAssetGenerator
  ): Promise<Asset[]> {
    for (const failure of failures) {
      const spec = this.getSpec(failure.platform);
      
      if (failure.reason === 'WRONG_DIMENSIONS') {
        // Adjust generator scale and regenerate
        const adjusted = await generator.generateWithScale(
          failure.platform,
          { scale: spec.width / failure.asset.width }
        );
        yield adjusted;
      }
      
      if (failure.reason === 'LOW_CONTRAST') {
        // Increase contrast and regenerate
        const enhanced = await generator.generateWithEnhancements(
          failure.platform,
          { contrast: 1.2 }
        );
        yield enhanced;
      }
    }
  }
}
```

### 3.3 Manifest & Reporting (15 min)

```typescript
// src/manifest.ts
export interface AssetManifest {
  version: string;
  brand: string;
  generated_at: ISO8601;
  assets: {
    avatars: { [platform: string]: AssetMetadata };
    headers: { [platform: string]: AssetMetadata };
    og_images: { [platform: string]: AssetMetadata };
    favicons: AssetMetadata[];
  };
  validation_report: {
    total_assets: number;
    passed: number;
    failed: number;
    failures: ValidationFailure[];
  };
}
```

### 3.4 Deliverables

- [ ] Validator class with 10+ validation checks
- [ ] Automatic regeneration system
- [ ] Manifest JSON generation
- [ ] Validation report (HTML + JSON)
- [ ] Platform compliance matrix
- [ ] Integration tests (100% of validator paths)

---

## 📋 Phase 4: Iteration & Evolution

**Effort:** 60 minutes  
**Blockers:** Phase 3 completion  
**Prerequisites:** Validation system working

### 4.1 Layout Optimization (20 min)

```typescript
// src/optimizer.ts
export class LayoutOptimizer {
  async optimize(asset: Asset): Promise<Asset> {
    // Detect if content is too crowded or sparse
    const contentDensity = await this.analyzeContentDensity(asset);
    
    if (contentDensity > 0.8) {
      // Too dense: reduce element scale
      return this.adjustLayout(asset, { scale: 0.9, spacing: 1.2 });
    }
    
    if (contentDensity < 0.4) {
      // Too sparse: increase scale
      return this.adjustLayout(asset, { scale: 1.1, spacing: 0.9 });
    }
    
    return asset;
  }
}
```

### 4.2 New Platform Support (15 min)

```typescript
// Add new platform to specification
PLATFORM_SPECS.register({
  name: 'bluesky',
  type: 'TYPE_A',
  avatar: { width: 256, height: 256 },
  header: { width: 1200, height: 630 },
  og_image: { width: 1200, height: 630 }
});

// Automatically generate assets for new platform
const newAssets = await generator.generateForPlatform('bluesky');
```

### 4.3 Version Management (15 min)

```typescript
// src/versioning.ts
export class VersionManager {
  async publish(version: string, assets: Asset[]): Promise<void> {
    const versionDir = `assets/${version}/`;
    await this.createVersionDirectory(versionDir);
    await this.copyAssets(assets, versionDir);
    await this.updateLatestSymlink(versionDir);
    await this.archiveOldVersions();
  }
}
```

### 4.4 Deliverables

- [ ] Layout optimizer with content density analysis
- [ ] New platform addition workflow (documented)
- [ ] Version management system
- [ ] Archive cleanup (keep last 5 versions)
- [ ] Changelog generation
- [ ] Performance benchmarks (asset generation speed)

---

## 🎯 Success Metrics (Overall)

| Phase | Metric | Target | Status |
|-------|--------|--------|--------|
| 1 | Specification complete | ✅ Yes | ✅ DONE |
| 2 | 70+ assets generated | ✅ Yes | 🚀 NEXT |
| 3 | 100% validation pass rate | ✅ Yes | 📍 Future |
| 4 | Support 12+ platforms | ✅ Yes | 🔄 Future |
| Overall | End-to-end skill functional | ✅ Yes | 📋 Scheduled |

---

## 🚀 How to Execute Phase 2

1. **Create feature branch:**
   ```bash
   git checkout -b feat/socials-automation-phase2
   ```

2. **Create skill package:**
   ```bash
   mkdir -p packages/skills/socials-automation/src
   ```

3. **Implement generator.ts** (primary work)

4. **Create test fixtures** (sample configs + expected outputs)

5. **Write tests** with Vitest

6. **Create PR** with:
   - Deliverables checklist
   - Performance benchmarks
   - Asset samples

---

## 📞 Related Issues

- **#55**: Fully Automated Socials Skill Prompt (parent)
- **#56-66**: Platform-specific asset tasks (blocked on Phase 2)

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-16  
**Next Review:** After Phase 2 completion
