# ⚡ Quick Start (5 Minutes)

Get a basic design system running in just 5 minutes!

## Step 1: Create Project (1 min)

```bash
mkdir my-design-system
cd my-design-system
npm init -y
```

## Step 2: Install Core Tools (2 min)

```bash
npm install --save-dev \
  @h4shed/skill-theme-factory \
  @h4shed/tool-style-dictionary \
  @h4shed/tool-postcss
```

## Step 3: Create Tokens (1 min)

Create `tokens.json`:
```json
{
  "color": {
    "primary": { "value": "#007AFF" },
    "focus": { "value": "#FFD60A" },
    "error": { "value": "#FF3B30" }
  },
  "spacing": {
    "xs": { "value": "4px" },
    "sm": { "value": "8px" },
    "md": { "value": "16px" },
    "lg": { "value": "24px" }
  }
}
```

## Step 4: Done! (1 min)

Your project is now set up with design tokens.

**Note**: These skills are currently in scaffolding phase. For complete setup with working implementations, see the [Full Installation Guide](/guide/installation/full-setup).

## ✅ Done!

Your project is now configured with design tokens. To generate CSS output, see the [Full Installation Guide](/guide/installation/full-setup) for build setup instructions.

### Next Steps

- **Phase 1**: [Add Accessibility Testing](/guide/phases/phase-1-accessibility)
- **Phase 2**: [Add Component Library](/guide/phases/phase-2-consistency)
- **Full Guide**: [Complete Setup](/guide/installation/full-setup)

---

**Time**: ~5 minutes  
**Next**: See [Full Installation Guide](/guide/installation/full-setup) for all 50+ tools
