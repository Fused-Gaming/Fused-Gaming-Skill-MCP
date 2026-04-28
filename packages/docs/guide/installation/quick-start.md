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

## Step 4: Generate CSS (1 min)

Create `generate-tokens.js`:
```javascript
import { ThemeFactory } from '@h4shed/skill-theme-factory';
import tokens from './tokens.json' assert { type: 'json' };

const factory = new ThemeFactory({ tokens });
await factory.exportCSS('./dist/design-tokens.css');
console.log('✅ Design tokens generated!');
```

```bash
node generate-tokens.js
```

## ✅ Done!

Your design tokens are now in `dist/design-tokens.css`. 

### Next Steps

- **Phase 1**: [Add Accessibility Testing](/guide/phases/phase-1-accessibility)
- **Phase 2**: [Add Component Library](/guide/phases/phase-2-consistency)
- **Full Guide**: [Complete Setup](/guide/installation/full-setup)

---

**Time**: ~5 minutes  
**Next**: See [Full Installation Guide](/guide/installation/full-setup) for all 50+ tools
