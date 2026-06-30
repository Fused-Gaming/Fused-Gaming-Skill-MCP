'use client';

import { motion } from 'framer-motion';
import Icon from '@/components/Icon';
import PageFooter from '@/components/PageFooter';
import ToolCard from '@/components/ToolCard';
import { ChevronRight } from 'lucide-react';

interface ToolCategory {
  name: string;
  description: string;
  icon?: string;
  tools: Array<{
    name: string;
    description: string;
    icon: string;
    url?: string;
    tags?: string[];
    status?: 'stable' | 'beta' | 'new';
    useCases?: string[];
  }>;
}

const toolCategories: ToolCategory[] = [
  {
    name: 'Design & Creative',
    description: 'Tools for visual design, art generation, and UI/UX creation',
    icon: 'palette',
    tools: [
      {
        name: 'Algorithmic Art',
        description: 'Generate procedural art and visual effects using p5.js',
        icon: 'palette',
        url: 'https://www.npmjs.com/package/@h4shed/skill-algorithmic-art',
        tags: ['generative', 'p5.js', 'visualization'],
        status: 'stable',
        useCases: [
          'Create generative art and visual compositions',
          'Build interactive data visualizations',
          'Generate procedural textures and patterns',
          'Design animated visual effects'
        ]
      },
      {
        name: 'Canvas Design',
        description: 'SVG-based visual design and graphic creation',
        icon: 'brush',
        url: 'https://www.npmjs.com/package/@h4shed/skill-canvas-design',
        tags: ['svg', 'graphics', 'design'],
        status: 'stable',
        useCases: [
          'Create scalable vector graphics and logos',
          'Design responsive SVG icons and assets',
          'Build custom data visualization charts',
          'Generate animated SVG illustrations'
        ]
      },
      {
        name: 'Frontend Design',
        description: 'HTML/CSS component design and prototyping',
        icon: 'code',
        url: 'https://www.npmjs.com/package/@h4shed/skill-frontend-design',
        tags: ['html', 'css', 'components'],
        status: 'stable',
        useCases: [
          'Prototype interactive UI components',
          'Build responsive HTML/CSS layouts',
          'Create component libraries and style guides',
          'Design and test component interactions'
        ]
      },
      {
        name: 'Theme Factory',
        description: 'Design system generation and theme creation',
        icon: 'palette',
        url: 'https://www.npmjs.com/package/@h4shed/skill-theme-factory',
        tags: ['design-system', 'theming', 'tokens'],
        status: 'stable',
        useCases: [
          'Generate design systems from token definitions',
          'Create theme variants automatically',
          'Maintain consistent design tokens across projects',
          'Build multi-brand theme systems'
        ]
      },
      {
        name: 'ASCII Mockup',
        description: 'Mobile-first wireframe designs using ASCII art',
        icon: 'mobile',
        url: 'https://www.npmjs.com/package/@h4shed/skill-ascii-mockup',
        tags: ['wireframing', 'ascii', 'mobile'],
        status: 'stable',
        useCases: [
          'Create quick mobile wireframes in terminal',
          'Design layouts for various screen sizes',
          'Prototype user interfaces rapidly',
          'Document interface flows with ASCII diagrams'
        ]
      },
      {
        name: 'SVG Generator',
        description: 'Automated SVG asset generation and manipulation',
        icon: 'settings',
        tags: ['svg', 'automation', 'graphics'],
        status: 'beta',
        useCases: [
          'Batch generate SVG assets from templates',
          'Automate icon set creation',
          'Transform and optimize existing SVGs',
          'Generate responsive image variants'
        ]
      }
    ]
  },
  {
    name: 'Development Tools',
    description: 'Code generation, scaffolding, and development utilities',
    icon: 'wrench',
    tools: [
      {
        name: 'MCP Builder',
        description: 'MCP server scaffolding and skill generation',
        icon: 'wrench',
        url: 'https://www.npmjs.com/package/@h4shed/skill-mcp-builder',
        tags: ['mcp', 'scaffolding', 'generator'],
        status: 'stable',
        useCases: [
          'Scaffold new MCP servers from templates',
          'Generate boilerplate skill structures',
          'Create type-safe MCP configurations',
          'Accelerate MCP development workflows'
        ]
      },
      {
        name: 'Skill Creator',
        description: 'Custom skill builder with full MCP integration',
        icon: 'zap',
        url: 'https://www.npmjs.com/package/@h4shed/skill-skill-creator',
        tags: ['mcp', 'skills', 'generator'],
        status: 'stable',
        useCases: [
          'Create custom skills for AI agents',
          'Build MCP-compatible tool packages',
          'Generate skill documentation automatically',
          'Integrate external APIs as skills'
        ]
      },
      {
        name: 'Pre-Deploy Validator',
        description: 'Deployment validation and pre-flight checks',
        icon: 'check',
        url: 'https://www.npmjs.com/package/@h4shed/skill-pre-deploy-validator',
        tags: ['validation', 'deployment', 'checks'],
        status: 'stable',
        useCases: [
          'Validate deployment configurations',
          'Run pre-flight dependency checks',
          'Verify environment variable setup',
          'Prevent deployment failures'
        ]
      },
      {
        name: 'Project Manager',
        description: 'Project planning and management tools',
        icon: 'document',
        tags: ['project', 'management', 'planning'],
        status: 'beta',
        useCases: [
          'Plan and track project milestones',
          'Manage team workflows and tasks',
          'Generate project documentation',
          'Monitor project progress and metrics'
        ]
      },
      {
        name: 'Mermaid Terminal',
        description: 'Real-time diagram generation in terminal',
        icon: 'chart',
        tags: ['diagrams', 'visualization', 'terminal'],
        status: 'new',
        useCases: [
          'Generate flowcharts in the terminal',
          'Create sequence and class diagrams',
          'Visualize system architecture',
          'Document processes with ASCII diagrams'
        ]
      }
    ]
  },
  {
    name: 'Automation & Integration',
    description: 'Email workflows, agent orchestration, and multi-account management',
    icon: 'mail',
    tools: [
      {
        name: 'SyncPulse',
        description: 'Multi-agent coordination with 9 email workflow templates',
        icon: 'mail',
        url: 'https://www.npmjs.com/package/@h4shed/skill-syncpulse',
        tags: ['email', 'agents', 'automation', 'templates'],
        status: 'stable',
        useCases: [
          'Automate multi-agent coordination workflows',
          'Generate and send templated emails at scale',
          'Create custom agent communication patterns',
          'Monitor and log agent interactions'
        ]
      },
      {
        name: 'Daily Review',
        description: 'Automated daily review and summary generation',
        icon: 'document',
        tags: ['automation', 'review', 'summary'],
        status: 'beta',
        useCases: [
          'Generate daily summary reports automatically',
          'Compile project progress updates',
          'Create team standup documents',
          'Track daily metrics and analytics'
        ]
      },
      {
        name: 'Multi-Account Session Tracking',
        description: 'Track and manage multiple account sessions',
        icon: 'users',
        tags: ['accounts', 'sessions', 'tracking'],
        status: 'beta',
        useCases: [
          'Monitor sessions across multiple accounts',
          'Manage distributed authentication',
          'Track user activity and sessions',
          'Implement multi-tenant session management'
        ]
      },
      {
        name: 'LinkedIn Master Journalist',
        description: 'AI-powered LinkedIn content creation and automation',
        icon: 'document',
        tags: ['linkedin', 'content', 'ai'],
        status: 'new',
        useCases: [
          'Generate and publish LinkedIn posts automatically',
          'Create professional content calendars',
          'Automate engagement and networking',
          'Schedule multi-day content campaigns'
        ]
      }
    ]
  },
  {
    name: 'Data & Visualization',
    description: 'Data processing, visualization, and analytics tools',
    icon: 'chart',
    tools: [
      {
        name: 'UX Journeymapper',
        description: 'Map and visualize user experience journeys',
        icon: 'map',
        tags: ['ux', 'journey', 'visualization'],
        status: 'beta',
        useCases: [
          'Map user journeys and touchpoints',
          'Identify UX pain points and bottlenecks',
          'Visualize customer experience flows',
          'Document user interaction patterns'
        ]
      },
      {
        name: 'Project Status Tool',
        description: 'Real-time project status monitoring and reporting',
        icon: 'chart',
        tags: ['status', 'monitoring', 'reporting'],
        status: 'beta',
        useCases: [
          'Monitor real-time project metrics',
          'Generate status reports automatically',
          'Track project health indicators',
          'Alert on status changes and milestones'
        ]
      }
    ]
  },
  {
    name: 'Web3 & Smart Contracts',
    description: 'Blockchain, NFT generation, and smart contract tools',
    icon: 'shield',
    tools: [
      {
        name: 'NFT Generative Art',
        description: 'NFT artwork generation and blockchain assets',
        icon: 'palette',
        tags: ['nft', 'blockchain', 'generative'],
        status: 'beta',
        useCases: [
          'Generate unique NFT artwork collections',
          'Create dynamic NFT metadata',
          'Automate minting workflows',
          'Build generative art on-chain'
        ]
      },
      {
        name: 'Smart Contract Tools',
        description: 'Hardhat, Truffle, and Foundry integration',
        icon: 'settings',
        tags: ['solidity', 'contracts', 'web3'],
        status: 'beta',
        useCases: [
          'Develop and test smart contracts',
          'Deploy contracts to multiple networks',
          'Generate contract ABIs and type definitions',
          'Automate contract verification and deployment'
        ]
      }
    ]
  },
  {
    name: 'Content & Creative Writing',
    description: 'Narrative generation, character creation, and storytelling',
    icon: 'play',
    tools: [
      {
        name: 'Underworld Writer',
        description: 'Character and world narrative generation',
        icon: 'document',
        url: 'https://www.npmjs.com/package/@h4shed/skill-underworld-writer',
        tags: ['writing', 'narrative', 'character'],
        status: 'stable',
        useCases: [
          'Generate character backgrounds and profiles',
          'Create world-building documentation',
          'Write narrative and story content',
          'Build character relationship maps'
        ]
      },
      {
        name: 'Agentic Flow DevKit',
        description: 'Agentic orchestration GUI and A/B-roll planning',
        icon: 'play',
        tags: ['orchestration', 'video', 'editing'],
        status: 'new',
        useCases: [
          'Orchestrate multi-agent workflows visually',
          'Plan video A/B-roll and editing sequences',
          'Design complex agent interaction flows',
          'Create production timelines and storyboards'
        ]
      }
    ]
  },
  {
    name: 'DevOps & Infrastructure',
    description: 'Deployment, configuration, and infrastructure management',
    icon: 'settings',
    tools: [
      {
        name: 'Vercel Next.js Deployment',
        description: 'Vercel deployment and Next.js integration',
        icon: 'zap',
        tags: ['vercel', 'nextjs', 'deployment'],
        status: 'beta',
        useCases: [
          'Deploy Next.js apps to Vercel',
          'Configure custom domains and subdomains',
          'Set up preview deployments',
          'Manage environment variables and secrets'
        ]
      },
      {
        name: 'Style Dictionary System',
        description: 'Design tokens and cross-platform theming',
        icon: 'palette',
        tags: ['tokens', 'theming', 'design-system'],
        status: 'beta',
        useCases: [
          'Build design token systems',
          'Generate cross-platform theme files',
          'Maintain consistent design language',
          'Export tokens to multiple formats (CSS, JS, JSON)'
        ]
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
            className="flex items-center gap-3"
          >
            <Icon name="zap" size={40} color="#A855F7" />
            <div>
              <h1 className="text-5xl font-bold glow-accent mb-2">Skills Catalog</h1>
              <p className="text-swarm-tertiary text-lg">
                Discover our growing ecosystem of AI-powered tools and skills
              </p>
            </div>
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
                    <ToolCard
                      name={tool.name}
                      description={tool.description}
                      icon={tool.icon}
                      url={tool.url}
                      tags={tool.tags}
                      status={tool.status}
                      useCases={tool.useCases}
                    />
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

      {/* Footer */}
      <PageFooter
        items={[{ label: 'Skills', href: '/skills' }]}
        showVersion={true}
        showStatus={true}
        showCopyright={true}
        links={[
          { label: 'Privacy', href: '/privacy' },
          { label: 'Terms', href: '/terms' },
          { label: 'GitHub', href: 'https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP' },
        ]}
      />
    </main>
  );
}
