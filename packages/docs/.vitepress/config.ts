import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Fused Gaming Design System',
  description: 'Complete design system & tool ecosystem documentation for @h4shed',

  head: [
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['link', { rel: 'icon', href: '/logo.svg' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '@h4shed Design System',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/guide/installation/quick-start' },
      { text: 'Design System', link: '/guide/design-system/tokens' },
      { text: 'Tools', link: '/guide/tools/overview' },
      { text: 'Phases', link: '/guide/phases/phase-1-accessibility' },
      { text: 'Agents', link: '/guide/agents/architecture' },
      { text: 'API Reference', link: '/reference/api/mcp-core' },
      { text: 'Examples', link: '/examples/tokens/generation' },
      { text: 'FAQ', link: '/resources/faq' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Quick Start (5 min)', link: '/guide/installation/quick-start' },
            { text: 'Full Installation', link: '/guide/installation/full-setup' },
            { text: 'Architecture Overview', link: '/guide/installation/architecture' },
            { text: 'Phase-by-Phase Guide', link: '/guide/installation/phases' },
          ]
        },
        {
          text: 'Design System',
          items: [
            { text: 'Design Tokens', link: '/guide/design-system/tokens' },
            { text: 'Component Library', link: '/guide/design-system/components' },
            { text: 'Accessibility Guidelines', link: '/guide/design-system/accessibility' },
            { text: 'Theming & Dark Mode', link: '/guide/design-system/theming' },
          ]
        },
        {
          text: 'Tools',
          items: [
            { text: 'Tools Overview', link: '/guide/tools/overview' },
            { text: '@h4shed Skills', link: '/guide/tools/skills' },
            { text: 'Open-Source Integrations', link: '/guide/tools/open-source' },
            { text: 'CLI Commands', link: '/guide/tools/cli' },
          ]
        },
        {
          text: 'Development Phases',
          items: [
            { text: 'Phase 1: Accessibility', link: '/guide/phases/phase-1-accessibility' },
            { text: 'Phase 2: Consistency', link: '/guide/phases/phase-2-consistency' },
            { text: 'Phase 3: Components', link: '/guide/phases/phase-3-components' },
            { text: 'Phase 4: Testing', link: '/guide/phases/phase-4-testing' },
            { text: 'Phase 5: Documentation', link: '/guide/phases/phase-5-documentation' },
          ]
        },
        {
          text: 'Agent Orchestration',
          items: [
            { text: 'Agent Architecture', link: '/guide/agents/architecture' },
            { text: 'Workflow Patterns', link: '/guide/agents/patterns' },
            { text: 'Security & Compliance', link: '/guide/agents/security' },
            { text: 'Monitoring', link: '/guide/agents/monitoring' },
          ]
        }
      ],
      '/reference/': [
        {
          text: 'API Reference',
          items: [
            { text: '@h4shed/mcp-core', link: '/reference/api/mcp-core' },
            { text: '@h4shed/mcp-cli', link: '/reference/api/mcp-cli' },
            { text: 'Skills API', link: '/reference/api/skills' },
          ]
        },
        {
          text: 'Tools Reference',
          items: [
            { text: 'Design Tools', link: '/reference/tools-reference/design' },
            { text: 'Testing Tools', link: '/reference/tools-reference/testing' },
            { text: 'Build Tools', link: '/reference/tools-reference/build' },
            { text: 'Documentation Tools', link: '/reference/tools-reference/docs' },
          ]
        }
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Token Generation', link: '/examples/tokens/generation' },
            { text: 'Component Creation', link: '/examples/components/creation' },
            { text: 'Testing Automation', link: '/examples/testing/automation' },
            { text: 'Deployment Workflows', link: '/examples/deployment/workflows' },
          ]
        }
      ],
      '/resources/': [
        {
          text: 'Resources',
          items: [
            { text: 'FAQ', link: '/resources/faq' },
            { text: 'Troubleshooting', link: '/resources/troubleshooting/common-issues' },
            { text: 'Security Best Practices', link: '/resources/security/best-practices' },
            { text: 'Support', link: '/resources/support' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/fused-gaming/fused-gaming-skill-mcp' },
      { icon: 'npm', link: 'https://www.npmjs.com/~h4shed' },
    ],

    footer: {
      message: 'Built with ❤️ by Fused Gaming',
      copyright: 'Copyright © 2026 Fused Gaming. Apache 2.0 License.'
    },

    search: {
      provider: 'local'
    }
  },

  sitemap: {
    hostname: 'https://docs.vln.gg',
    lastmodDateOnly: true
  }
})
