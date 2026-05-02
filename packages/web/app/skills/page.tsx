'use client';

import { motion } from 'framer-motion';
import ToolCard from '@/components/ToolCard';
import { ChevronRight } from 'lucide-react';

interface ToolCategory {
  name: string;
  description: string;
  tools: Array<{
    name: string;
    description: string;
    icon: string;
    url?: string;
    tags?: string[];
    status?: 'stable' | 'beta' | 'new';
  }>;
}

const toolCategories: ToolCategory[] = [
  {
    name: '🎨 Design & Creative',
    description: 'Tools for visual design, art generation, and UI/UX creation',
    tools: [
      {
        name: 'Algorithmic Art',
        description: 'Generate procedural art and visual effects using p5.js',
        icon: '🎨',
        url: 'https://www.npmjs.com/package/@h4shed/skill-algorithmic-art',
        tags: ['generative', 'p5.js', 'visualization'],
        status: 'stable'
      },
      {
        name: 'Canvas Design',
        description: 'SVG-based visual design and graphic creation',
        icon: '🖌️',
        url: 'https://www.npmjs.com/package/@h4shed/skill-canvas-design',
        tags: ['svg', 'graphics', 'design'],
        status: 'stable'
      },
      {
        name: 'Frontend Design',
        description: 'HTML/CSS component design and prototyping',
        icon: '💻',
        url: 'https://www.npmjs.com/package/@h4shed/skill-frontend-design',
        tags: ['html', 'css', 'components'],
        status: 'stable'
      },
      {
        name: 'Theme Factory',
        description: 'Design system generation and theme creation',
        icon: '🎭',
        url: 'https://www.npmjs.com/package/@h4shed/skill-theme-factory',
        tags: ['design-system', 'theming', 'tokens'],
        status: 'stable'
      },
      {
        name: 'ASCII Mockup',
        description: 'Mobile-first wireframe designs using ASCII art',
        icon: '📱',
        url: 'https://www.npmjs.com/package/@h4shed/skill-ascii-mockup',
        tags: ['wireframing', 'ascii', 'mobile'],
        status: 'stable'
      },
      {
        name: 'SVG Generator',
        description: 'Automated SVG asset generation and manipulation',
        icon: '⚙️',
        tags: ['svg', 'automation', 'graphics'],
        status: 'beta'
      }
    ]
  },
  {
    name: '🛠️ Development Tools',
    description: 'Code generation, scaffolding, and development utilities',
    tools: [
      {
        name: 'MCP Builder',
        description: 'MCP server scaffolding and skill generation',
        icon: '🔧',
        url: 'https://www.npmjs.com/package/@h4shed/skill-mcp-builder',
        tags: ['mcp', 'scaffolding', 'generator'],
        status: 'stable'
      },
      {
        name: 'Skill Creator',
        description: 'Custom skill builder with full MCP integration',
        icon: '⚡',
        url: 'https://www.npmjs.com/package/@h4shed/skill-skill-creator',
        tags: ['mcp', 'skills', 'generator'],
        status: 'stable'
      },
      {
        name: 'Pre-Deploy Validator',
        description: 'Deployment validation and pre-flight checks',
        icon: '✅',
        url: 'https://www.npmjs.com/package/@h4shed/skill-pre-deploy-validator',
        tags: ['validation', 'deployment', 'checks'],
        status: 'stable'
      },
      {
        name: 'Project Manager',
        description: 'Project planning and management tools',
        icon: '📋',
        tags: ['project', 'management', 'planning'],
        status: 'beta'
      },
      {
        name: 'Mermaid Terminal',
        description: 'Real-time diagram generation in terminal',
        icon: '📊',
        tags: ['diagrams', 'visualization', 'terminal'],
        status: 'new'
      }
    ]
  },
  {
    name: '📧 Automation & Integration',
    description: 'Email workflows, agent orchestration, and multi-account management',
    tools: [
      {
        name: 'SyncPulse',
        description: 'Multi-agent coordination with 9 email workflow templates',
        icon: '📬',
        url: 'https://www.npmjs.com/package/@h4shed/skill-syncpulse',
        tags: ['email', 'agents', 'automation', 'templates'],
        status: 'stable'
      },
      {
        name: 'Daily Review',
        description: 'Automated daily review and summary generation',
        icon: '📝',
        tags: ['automation', 'review', 'summary'],
        status: 'beta'
      },
      {
        name: 'Multi-Account Session Tracking',
        description: 'Track and manage multiple account sessions',
        icon: '👥',
        tags: ['accounts', 'sessions', 'tracking'],
        status: 'beta'
      },
      {
        name: 'LinkedIn Master Journalist',
        description: 'AI-powered LinkedIn content creation and automation',
        icon: '📰',
        tags: ['linkedin', 'content', 'ai'],
        status: 'new'
      }
    ]
  },
  {
    name: '📐 Data & Visualization',
    description: 'Data processing, visualization, and analytics tools',
    tools: [
      {
        name: 'UX Journeymapper',
        description: 'Map and visualize user experience journeys',
        icon: '🗺️',
        tags: ['ux', 'journey', 'visualization'],
        status: 'beta'
      },
      {
        name: 'Project Status Tool',
        description: 'Real-time project status monitoring and reporting',
        icon: '📊',
        tags: ['status', 'monitoring', 'reporting'],
        status: 'beta'
      }
    ]
  },
  {
    name: '🔐 Web3 & Smart Contracts',
    description: 'Blockchain, NFT generation, and smart contract tools',
    tools: [
      {
        name: 'NFT Generative Art',
        description: 'NFT artwork generation and blockchain assets',
        icon: '🎨',
        tags: ['nft', 'blockchain', 'generative'],
        status: 'beta'
      },
      {
        name: 'Smart Contract Tools',
        description: 'Hardhat, Truffle, and Foundry integration',
        icon: '⚙️',
        tags: ['solidity', 'contracts', 'web3'],
        status: 'beta'
      }
    ]
  },
  {
    name: '🎬 Content & Creative Writing',
    description: 'Narrative generation, character creation, and storytelling',
    tools: [
      {
        name: 'Underworld Writer',
        description: 'Character and world narrative generation',
        icon: '📖',
        url: 'https://www.npmjs.com/package/@h4shed/skill-underworld-writer',
        tags: ['writing', 'narrative', 'character'],
        status: 'stable'
      },
      {
        name: 'Agentic Flow DevKit',
        description: 'Agentic orchestration GUI and A/B-roll planning',
        icon: '🎥',
        tags: ['orchestration', 'video', 'editing'],
        status: 'new'
      }
    ]
  },
  {
    name: '⚙️ DevOps & Infrastructure',
    description: 'Deployment, configuration, and infrastructure management',
    tools: [
      {
        name: 'Vercel Next.js Deployment',
        description: 'Vercel deployment and Next.js integration',
        icon: '🚀',
        tags: ['vercel', 'nextjs', 'deployment'],
        status: 'beta'
      },
      {
        name: 'Style Dictionary System',
        description: 'Design tokens and cross-platform theming',
        icon: '🎨',
        tags: ['tokens', 'theming', 'design-system'],
        status: 'beta'
      }
    ]
  }
];

export default function SkillsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-swarm-dark via-slate-900 to-swarm-dark">
      {/* Header */}
      <header className="border-b border-swarm-accent/20 sticky top-0 z-40 glass">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-bold glow-accent mb-2">⚡ Skills Catalog</h1>
            <p className="text-swarm-tertiary text-lg">
              Discover our growing ecosystem of AI-powered tools and skills
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-16">
          {toolCategories.map((category, categoryIdx) => (
            <motion.section
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIdx * 0.1 }}
            >
              {/* Category Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {category.name}
                </h2>
                <p className="text-slate-400 text-lg">
                  {category.description}
                </p>
              </div>

              {/* Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools.map((tool, idx) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ToolCard {...tool} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 pt-12 border-t border-slate-700/50"
        >
          <div className="bg-gradient-to-r from-swarm-accent/10 to-blue-500/10 border border-swarm-accent/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to get started?
            </h3>
            <p className="text-slate-300 mb-6">
              Install the MCP server and start using these skills in Claude or other AI tools.
            </p>
            <a
              href="https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-swarm-accent text-swarm-dark font-semibold rounded-lg hover:bg-swarm-accent/90 transition-colors"
            >
              View on GitHub
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
