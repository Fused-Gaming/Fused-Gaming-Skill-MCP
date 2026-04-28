---
layout: home

hero:
  name: "@h4shed Design System"
  text: "Complete Ecosystem for Design, Development & Deployment"
  tagline: "50+ integrated tools, skills & agents for building world-class design systems"
  image:
    src: /logo.svg
    alt: Fused Gaming
  actions:
    - theme: brand
      text: Quick Start (5 min)
      link: /guide/installation/quick-start
    - theme: alt
      text: Full Installation
      link: /guide/installation/full-setup

features:
  - icon: 🎨
    title: Design Tokens
    details: "Unified design token system with multi-format export (CSS, JS, SCSS)"
  
  - icon: 🧩
    title: Component Library
    details: "Interactive Storybook with 100+ accessible components"
  
  - icon: ✅
    title: Accessibility First
    details: "WCAG AA compliance with automated axe-core testing"
  
  - icon: ⚡
    title: Performance Optimized
    details: "Sub-second build times with Vite and optimized bundling"
  
  - icon: 🧪
    title: Comprehensive Testing
    details: "E2E testing, visual regression, a11y automation"
  
  - icon: 📚
    title: Complete Documentation
    details: "API docs, guides, examples, and deployment strategies"

  - icon: 🚀
    title: 5-Phase Implementation
    details: "Guided development from accessibility to production deployment"
  
  - icon: 🤖
    title: AI Agent Orchestration
    details: "13+ specialized agents coordinating 50+ tools automatically"

  - icon: 🔐
    title: Security Built-In
    details: "Smart contract auditing, OWASP compliance, vulnerability scanning"

---

<div class="vp-doc">

## 🎯 What is @h4shed?

**@h4shed** (Fused Gaming's npm scope) is a comprehensive ecosystem of **50+ design, development, and deployment tools** unified under a single orchestration framework.

### The 5 Phases

```
Phase 1: Accessibility Tokens (by 2026-04-30)
    ↓
Phase 2: Consistency Tokens (by 2026-05-02)
    ↓
Phase 3: Component Library (by 2026-05-05)
    ↓
Phase 4: Testing & QA (by 2026-05-12)
    ↓
Phase 5: Documentation (by 2026-05-15)
```

### Core Tiers

| Tier | Count | Purpose | Status |
|------|-------|---------|--------|
| **Core** | 3 | MCP foundation | ✅ Published |
| **Design Skills** | 7 | Visual system tools | ✅ Published |
| **Workflow Skills** | 3 | Project management | ✅ Queued |
| **New Skills** | 9 | Latest integrations | 📋 Scaffolding |
| **Tool Wrappers** | 27 | Open-source wrapped | 📋 Scaffolding |
| **Total** | **49** | **Complete Ecosystem** | **~50%** |

---

## 📦 Quick Install

### For Phase 1 (Accessibility)
```bash
npm install --save-dev \
  @h4shed/skill-theme-factory \
  @h4shed/skill-project-manager \
  @h4shed/tool-axe-core \
  @h4shed/tool-pa11y
```

### For Full Ecosystem
```bash
# This will grow with each phase
npm install --save-dev \
  @h4shed/skill-theme-factory \
  @h4shed/skill-frontend-design \
  @h4shed/tool-style-dictionary \
  @h4shed/tool-storybook \
  @h4shed/tool-vite \
  @h4shed/tool-jest \
  @h4shed/tool-playwright
```

See [Full Installation Guide](/guide/installation/full-setup) for complete details.

---

## 🎨 Sample Usage

### Generate Design Tokens
```typescript
import { ThemeFactory } from '@h4shed/skill-theme-factory';

const factory = new ThemeFactory({
  tokens: {
    colors: { primary: '#007AFF', focus: '#FFD60A' },
    spacing: { xs: '4px', sm: '8px', md: '16px' }
  }
});

// Export to multiple formats
await factory.exportCSS('./dist/tokens.css');
await factory.exportJS('./dist/tokens.js');
await factory.exportSCSS('./dist/tokens.scss');
```

### Test Accessibility
```bash
npx @h4shed/tool-axe-core ./dist/index.html
npx @h4shed/tool-pa11y ./dist/index.html
```

### Build with Vite
```bash
npm install --save-dev vite
npx vite build
```

---

## 🤖 Agent Orchestration

13 specialized agents coordinate across all 50+ tools:

- **design-token-consistency-agent** - Validates tokens
- **accessibility-audit-agent** - Runs a11y tests
- **test-orchestration-agent** - Manages Jest/Cypress/Playwright
- **documentation-site-agent** - Deploys to docs.vln.gg
- **smart-contract-security-agent** - Audits Solidity contracts
- **vercel-deployment-agent** - Manages production releases

Learn more: [Agent Architecture](/guide/agents/architecture)

---

## 📚 Documentation Structure

| Section | Purpose |
|---------|---------|
| [Getting Started](/guide/installation/quick-start) | 5-minute quick start |
| [Design System Guide](/guide/design-system/tokens) | Tokens, components, a11y |
| [Tools Reference](/guide/tools/overview) | All 50+ tools documented |
| [Phase Guides](/guide/phases/phase-1-accessibility) | Step-by-step by development phase |
| [Agent Orchestration](/guide/agents/architecture) | How agents coordinate tools |
| [API Reference](/reference/api/mcp-core) | Complete API documentation |
| [Examples](/examples/tokens/generation) | Real-world usage patterns |
| [FAQ & Troubleshooting](/resources/faq) | Common questions & solutions |

---

## 🚀 Getting Started Now

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0;">

<div style="padding: 20px; border: 1px solid var(--vp-c-divider); border-radius: 8px;">
  <h4>⚡ 5-Minute Setup</h4>
  <p>Get a basic design system running in 5 minutes</p>
  <a href="/guide/installation/quick-start" class="vp-button brand">Start Now</a>
</div>

<div style="padding: 20px; border: 1px solid var(--vp-c-divider); border-radius: 8px;">
  <h4>📦 Full Installation</h4>
  <p>Install and configure the complete 50+ tool ecosystem</p>
  <a href="/guide/installation/full-setup" class="vp-button alt">Full Setup</a>
</div>

<div style="padding: 20px; border: 1px solid var(--vp-c-divider); border-radius: 8px;">
  <h4>📚 API Reference</h4>
  <p>Complete documentation for all packages and tools</p>
  <a href="/reference/api/mcp-core" class="vp-button alt">View API</a>
</div>

<div style="padding: 20px; border: 1px solid var(--vp-c-divider); border-radius: 8px;">
  <h4>🤖 Agent Orchestration</h4>
  <p>Learn how AI agents automate your design system</p>
  <a href="/guide/agents/architecture" class="vp-button alt">Learn More</a>
</div>

</div>

---

## 📊 Registry Stats

- **Total Tools**: 50+
- **@h4shed Packages**: 23 (skills + integrations)
- **Open-Source Wrapped**: 27
- **Specialized Agents**: 13+
- **Documentation Pages**: 40+
- **Code Examples**: 30+
- **Development Phases**: 5

---

## 🔗 Important Links

- **GitHub Repository**: [fused-gaming/fused-gaming-skill-mcp](https://github.com/fused-gaming/fused-gaming-skill-mcp)
- **npm Scope**: [@h4shed](https://www.npmjs.com/~h4shed)
- **Issue Tracker**: [GitHub Issues](https://github.com/fused-gaming/fused-gaming-skill-mcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/fused-gaming/fused-gaming-skill-mcp/discussions)
- **Email**: support@fused-gaming.io

---

## 📄 License

All @h4shed packages are licensed under **Apache 2.0**. See individual tool documentation for upstream licenses.

</div>
