# 📚 @h4shed Documentation Hub (docs.vln.gg)

Complete design system and tool ecosystem documentation for Fused Gaming (@h4shed).

## 🚀 Getting Started

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173
```

### Building

```bash
# Build for production
npm run build

# Preview build
npm run preview
```

## 📂 Documentation Structure

```
.vitepress/
  └─ config.ts          # VitePress configuration
index.md                # Home page
guide/
  ├─ installation/      # Installation guides
  │  ├─ quick-start.md         # 5-minute setup
  │  ├─ full-setup.md          # Complete installation
  │  └─ architecture.md        # System architecture
  ├─ design-system/     # Design system documentation
  │  ├─ tokens.md             # Design tokens guide
  │  ├─ components.md         # Component library
  │  ├─ accessibility.md      # A11y guidelines
  │  └─ theming.md            # Theming & dark mode
  ├─ tools/             # Tools documentation
  │  ├─ overview.md           # Tools overview
  │  ├─ skills.md             # @h4shed skills
  │  ├─ open-source.md        # Open-source tools
  │  └─ cli.md                # CLI commands
  ├─ phases/            # Development phases
  │  ├─ phase-1-accessibility.md
  │  ├─ phase-2-consistency.md
  │  ├─ phase-3-components.md
  │  ├─ phase-4-testing.md
  │  └─ phase-5-documentation.md
  └─ agents/            # Agent orchestration
     ├─ architecture.md
     ├─ patterns.md
     ├─ security.md
     └─ monitoring.md
reference/
  ├─ api/               # API reference
  │  ├─ mcp-core.md
  │  ├─ mcp-cli.md
  │  └─ skills.md
  └─ tools-reference/   # Tools reference
     ├─ design.md
     ├─ testing.md
     ├─ build.md
     └─ docs.md
examples/
  ├─ tokens/            # Token generation examples
  │  └─ generation.md
  ├─ components/        # Component creation examples
  │  └─ creation.md
  ├─ testing/           # Testing automation examples
  │  └─ automation.md
  └─ deployment/        # Deployment examples
     └─ workflows.md
resources/
  ├─ faq.md             # Frequently asked questions
  ├─ troubleshooting/   # Troubleshooting guides
  │  └─ common-issues.md
  ├─ security/          # Security documentation
  │  └─ best-practices.md
  └─ support.md         # Support information
```

## 🔧 Configuration

### VitePress Config (`config.ts`)

- **Title**: Fused Gaming Design System
- **Logo**: `/logo.svg`
- **Navigation**: Main nav + sidebar
- **Search**: Local search enabled
- **Sitemap**: Auto-generated
- **Social Links**: GitHub, npm

### Deployment

The docs are deployed to **docs.vln.gg** via:
- **Host**: Vercel / Netlify
- **Auto-deploy**: On push to main
- **Custom Domain**: docs.vln.gg (via CNAME)

## 📝 Writing Documentation

### Page Structure

```markdown
# Title (h1)

Brief description of the page.

## Section 1 (h2)

Content here.

### Subsection (h3)

Detailed content.

## Section 2

More content.

---

**Time**: Estimated reading time
**Next**: Link to next page in sequence
```

### Code Examples

Use markdown code blocks with language:
````markdown
```typescript
// Code here
```

```bash
npm install something
```

```json
{ "config": "example" }
```
````

### Links

- **Internal**: `/path/to/page`
- **External**: `https://example.com`
- **Anchors**: `#section-name`

### Alerts

```markdown
::: info
This is an info box
:::

::: warning
This is a warning
:::

::: danger
This is a danger alert
:::

::: tip
This is a helpful tip
:::
```

## 🎨 Styling

VitePress includes default styling. Custom CSS can be added in:
- `.vitepress/theme/custom.css`
- Individual component `<style>` blocks

## 📊 Navigation

### Main Nav
- Home
- Getting Started
- Design System
- Tools
- Phases
- Agents
- API Reference
- Examples
- FAQ

### Sidebar
- Grouped by section
- Auto-expanded when viewing that section
- Collapsible subsections

## 🔍 Search

Local search is enabled. Users can:
- Search by keyword
- Filter by section
- Use keyboard shortcuts (Cmd+K / Ctrl+K)

## 📱 Responsive Design

All docs are mobile-responsive:
- Touch-friendly navigation
- Readable on all screen sizes
- Works offline after first load

## 🚀 Deployment to docs.vln.gg

### Setup

1. Build the site:
   ```bash
   npm run build
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

3. Configure custom domain at `docs.vln.gg`

### Auto-Deploy

GitHub Actions workflow (in `.github/workflows/docs-deploy.yml`):
```yaml
on:
  push:
    branches: [main]
    paths: ['packages/docs/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - uses: vercel/action@master
```

## 📞 Contributing

To contribute to documentation:

1. Clone the repo
2. Create a new branch
3. Write/update documentation
4. Build locally to test
5. Submit a PR

## 📋 Maintenance

### Weekly
- Review new issues for doc requests
- Update examples if APIs change

### Monthly
- Review outdated content
- Update version numbers
- Add new tool documentation

### Quarterly
- Major documentation updates
- Reorganize sections if needed
- Version documentation

## 🔗 Related Files

- Main docs: `/docs/`
- Tools registry: `/docs/TOOLS_REGISTRY.md`
- Orchestration guide: `/docs/TOOL_INTEGRATIONS_ORCHESTRATION.md`
- GitHub repo: https://github.com/fused-gaming/fused-gaming-skill-mcp

---

**Maintainer**: Fused Gaming Team  
**Last Updated**: April 28, 2026  
**Status**: Active Development
