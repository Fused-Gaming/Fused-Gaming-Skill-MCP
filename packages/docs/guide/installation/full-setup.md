# 📦 Complete Installation Guide

Full setup of the 50+ @h4shed tool ecosystem.

## Prerequisites

```bash
# Check your setup
node --version  # >= 20.0.0
npm --version   # >= 8.0.0
git --version   # >= 2.30
```

## Installation by Phase

### PHASE 1: Accessibility (by 2026-04-30)

**Goal**: Implement design tokens with accessibility focus

```bash
npm install --save-dev \
  @h4shed/skill-theme-factory \
  @h4shed/skill-project-manager \
  @h4shed/tool-style-dictionary \
  @h4shed/tool-axe-core \
  @h4shed/tool-pa11y \
  @h4shed/tool-postcss
```

**What you get**:
✅ Design token system  
✅ Accessibility testing  
✅ Project tracking  
✅ CSS processing  

**Time**: ~30 minutes setup

---

### PHASE 2: Consistency (by 2026-05-02)

**Goal**: Ensure design consistency across all components

```bash
npm install --save-dev \
  @h4shed/skill-frontend-design \
  @h4shed/tool-tailwindcss \
  @h4shed/tool-postcss \
  @h4shed/tool-jest
```

**What you get**:
✅ Component specifications  
✅ Utility CSS framework  
✅ Unit testing  

**Time**: ~20 minutes additional

---

### PHASE 3: Components (by 2026-05-05)

**Goal**: Build interactive component library

```bash
npm install --save-dev \
  @h4shed/skill-storybook-component-library \
  @h4shed/tool-storybook \
  @h4shed/tool-vite \
  @h4shed/tool-jest
```

**What you get**:
✅ Interactive component browser  
✅ Fast dev server  
✅ Component testing  

**Time**: ~25 minutes additional

---

### PHASE 4: Testing & QA (by 2026-05-12)

**Goal**: Comprehensive quality assurance

```bash
npm install --save-dev \
  @h4shed/skill-playwright-test-automation \
  @h4shed/tool-playwright \
  @h4shed/tool-cypress \
  @h4shed/tool-axe-core
```

**What you get**:
✅ E2E testing  
✅ Visual regression detection  
✅ Cross-browser testing  

**Time**: ~25 minutes additional

---

### PHASE 5: Documentation (by 2026-05-15)

**Goal**: Deploy complete documentation hub

```bash
npm install --save-dev \
  @h4shed/tool-docusaurus \
  @h4shed/tool-vitepress \
  @h4shed/tool-typedoc
```

**What you get**:
✅ Documentation site (docs.vln.gg)  
✅ API reference generation  
✅ Full-text search  

**Time**: ~20 minutes additional

---

## 🔥 Fast Track Installation

Install all core tools at once:

```bash
npm install --save-dev \
  @h4shed/skill-theme-factory \
  @h4shed/skill-frontend-design \
  @h4shed/skill-project-manager \
  @h4shed/skill-storybook-component-library \
  @h4shed/skill-playwright-test-automation \
  @h4shed/tool-style-dictionary \
  @h4shed/tool-storybook \
  @h4shed/tool-axe-core \
  @h4shed/tool-pa11y \
  @h4shed/tool-vite \
  @h4shed/tool-jest \
  @h4shed/tool-playwright \
  @h4shed/tool-cypress \
  @h4shed/tool-docusaurus \
  @h4shed/tool-typedoc
```

**Time**: ~45 minutes for full setup

---

## 📋 Package.json Setup

Update your `package.json` scripts:

```json
{
  "scripts": {
    "tokens:generate": "style-dictionary build",
    
    "dev": "vite",
    "storybook": "storybook dev",
    "build:storybook": "storybook build",
    
    "test": "jest",
    "test:e2e": "playwright test",
    
    "build": "vite build",
    "docs": "docusaurus start",
    "docs:build": "docusaurus build"
  }
}
```

---

## 🔐 Configuration Files

### Token Config (`tokens.json`)
```json
{
  "color": { ... },
  "spacing": { ... },
  "typography": { ... }
}
```

### Tailwind Config (`tailwind.config.js`)
```javascript
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {}
  }
}
```

### Jest Config (`jest.config.js`)
```javascript
export default {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy'
  }
}
```

### Storybook Config (`.storybook/main.js`)
```javascript
export default {
  stories: ['../src/**/*.stories.{js,jsx,ts,tsx}'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials']
}
```

---

## ✅ Verification Checklist

After installation, verify everything works:

```bash
# Check installations
npm list @h4shed/tool-*
npm list @h4shed/skill-*

# Generate tokens
npm run tokens:generate
ls dist/tokens.css  # Should exist

# Run tests
npm run test

# Start dev server
npm run dev
# Open http://localhost:5173

# Build for production
npm run build
```

---

## 🐛 Troubleshooting

### Issue: Package not found
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

### Issue: Port already in use
```bash
# Use different port
npm run dev -- --port 3000
```

### Issue: Build fails
```bash
# Check Node version
node --version  # Must be >= 20.0.0

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

See [Troubleshooting Guide](/resources/troubleshooting/common-issues) for more help.

---

## 📖 Next Steps

1. ✅ Complete installation
2. 📖 Read [Design System Guide](/guide/design-system/tokens)
3. 🎨 Create design tokens
4. 📝 Write components
5. ✓ Run tests
6. 🚀 Deploy

---

**Total Setup Time**: ~2 hours for full ecosystem  
**Maintenance**: Automatic updates via Dependabot  
**Support**: See [FAQ](/resources/faq)
