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
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Quick Start (5 min)', link: '/guide/installation/quick-start' },
            { text: 'Full Installation', link: '/guide/installation/full-setup' },
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
