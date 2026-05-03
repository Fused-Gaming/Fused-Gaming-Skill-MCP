export interface Tool {
  name: string;
  file: string;
  description?: string;
}

export interface SkillMetadata {
  name: string;
  id: string;
  description: string;
  version: string;
  package: string;
  tools: Tool[];
  enabled: boolean;
  category: string;
  author: string;
  keywords: string[];
  repository: string;
  license: string;
}

export interface SkillRegistry {
  version: string;
  timestamp: string;
  skills: SkillMetadata[];
  totalSkills: number;
  totalTools: number;
  categories: Record<string, number>;
}

export const registry: SkillRegistry = {
  "version": "1.0.0",
  "timestamp": "2026-05-03T05:05:35.786Z",
  "skills": [
    {
      "name": "agentic-flow-devkit",
      "id": "agentic-flow-devkit",
      "description": "Design and visualize agentic orchestration flows with trailer A/B-roll planning support.",
      "version": "1.0.1",
      "package": "@h4shed/skill-agentic-flow-devkit",
      "tools": [
        {
          "name": "plan_trailer_rolls",
          "file": "plan-trailer-rolls.ts",
          "description": "plan_trailer_rolls from agentic-flow-devkit"
        },
        {
          "name": "visualize_agentic_flow",
          "file": "visualize-agentic-flow.ts",
          "description": "visualize_agentic_flow from agentic-flow-devkit"
        }
      ],
      "enabled": true,
      "category": "design",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "agentic-flow",
        "orchestration",
        "trailer"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "algorithmic-art",
      "id": "algorithmic-art",
      "description": "Generative art using p5.js with seeded randomness, flow fields, and particle systems",
      "version": "1.0.4",
      "package": "@h4shed/skill-algorithmic-art",
      "tools": [
        {
          "name": "flow_field",
          "file": "flow-field.ts",
          "description": "flow_field from algorithmic-art"
        },
        {
          "name": "generate_art",
          "file": "generate-art.ts",
          "description": "generate_art from algorithmic-art"
        }
      ],
      "enabled": true,
      "category": "generative-art",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "art",
        "generative",
        "p5js",
        "visualization"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "ascii-mockup",
      "id": "ascii-mockup",
      "description": "Mobile-first ASCII wireframe mockup generator for rapid UI prototyping",
      "version": "1.0.4",
      "package": "@h4shed/skill-ascii-mockup",
      "tools": [
        {
          "name": "generate_mockup",
          "file": "generate-mockup.ts",
          "description": "generate_mockup from ascii-mockup"
        }
      ],
      "enabled": true,
      "category": "general",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "wireframe",
        "mockup",
        "ascii",
        "ui",
        "prototyping"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "canvas-design",
      "id": "canvas-design",
      "description": "Visual design generation for web with SVG and canvas rendering",
      "version": "1.0.4",
      "package": "@h4shed/skill-canvas-design",
      "tools": [
        {
          "name": "generate_svg",
          "file": "generate-svg.ts",
          "description": "generate_svg from canvas-design"
        }
      ],
      "enabled": true,
      "category": "design",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "design",
        "canvas",
        "svg",
        "graphics",
        "visualization"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "creator",
      "id": "creator",
      "description": "Create custom skills and tools for the Fused Gaming MCP ecosystem",
      "version": "1.0.4",
      "package": "@h4shed/skill-skill-creator",
      "tools": [
        {
          "name": "create_skill",
          "file": "create-skill.ts",
          "description": "create_skill from skill-creator"
        }
      ],
      "enabled": true,
      "category": "mcp-tools",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "builder",
        "scaffold",
        "tooling"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "daily-review",
      "id": "daily-review",
      "description": "Productivity tracking and daily review skill for session aggregation, metrics analysis, and multi-account reporting",
      "version": "1.0.2",
      "package": "@h4shed/skill-daily-review",
      "tools": [
        {
          "name": "analyze_weekly",
          "file": "analyze-weekly.ts",
          "description": "analyze_weekly from daily-review-skill"
        },
        {
          "name": "generate_daily_review",
          "file": "generate-daily-review.ts",
          "description": "generate_daily_review from daily-review-skill"
        },
        {
          "name": "log_session",
          "file": "log-session.ts",
          "description": "log_session from daily-review-skill"
        }
      ],
      "enabled": true,
      "category": "productivity",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "daily-review",
        "productivity",
        "session-tracking",
        "metrics",
        "reporting"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "frontend-design",
      "id": "frontend-design",
      "description": "Frontend component design and HTML/CSS generation for modern web applications",
      "version": "1.0.4",
      "package": "@h4shed/skill-frontend-design",
      "tools": [
        {
          "name": "generate_component",
          "file": "generate-component.ts",
          "description": "generate_component from frontend-design"
        }
      ],
      "enabled": true,
      "category": "design",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "frontend",
        "design",
        "html",
        "css",
        "components"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "linkedin-master-journalist",
      "id": "linkedin-master-journalist",
      "description": "Draft polished LinkedIn release and thought-leadership posts.",
      "version": "1.0.2",
      "package": "@h4shed/skill-linkedin-master-journalist",
      "tools": [
        {
          "name": "draft_linkedin_post",
          "file": "draft-linkedin-post.ts",
          "description": "draft_linkedin_post from linkedin-master-journalist"
        }
      ],
      "enabled": true,
      "category": "content-creation",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "planning",
        "automation"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "mcp-builder",
      "id": "mcp-builder",
      "description": "Build and scaffold MCP servers and skills with best practices",
      "version": "1.0.4",
      "package": "@h4shed/skill-mcp-builder",
      "tools": [
        {
          "name": "scaffold_skill",
          "file": "scaffold-skill.ts",
          "description": "scaffold_skill from mcp-builder"
        }
      ],
      "enabled": true,
      "category": "mcp-tools",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "scaffold",
        "builder",
        "tooling"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "mermaid-terminal",
      "id": "mermaid-terminal",
      "description": "Generate terminal-friendly Mermaid diagrams and flowcharts.",
      "version": "1.0.2",
      "package": "@h4shed/skill-mermaid-terminal",
      "tools": [
        {
          "name": "generate_mermaid_diagram",
          "file": "generate-mermaid-diagram.ts",
          "description": "generate_mermaid_diagram from mermaid-terminal"
        }
      ],
      "enabled": true,
      "category": "visualization",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "planning",
        "automation"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "multi-account-session-tracking",
      "id": "multi-account-session-tracking",
      "description": "Track session activity across multiple accounts and workstreams.",
      "version": "1.0.2",
      "package": "@h4shed/multi-account-session-tracking",
      "tools": [
        {
          "name": "track_session_activity",
          "file": "track-session-activity.ts",
          "description": "track_session_activity from multi-account-session-tracking"
        }
      ],
      "enabled": true,
      "category": "session-management",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "planning",
        "automation"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "nft-generative-art",
      "id": "nft-generative-art",
      "description": "NFT artwork generation, metadata creation, and blockchain-ready asset creation",
      "version": "1.0.0",
      "package": "@h4shed/skill-nft-generative-art",
      "tools": [],
      "enabled": true,
      "category": "generative-art",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "nft",
        "generative-art",
        "blockchain",
        "web3"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "playwright-test-automation",
      "id": "playwright-test-automation",
      "description": "End-to-end testing automation framework for web applications with cross-browser support",
      "version": "1.0.0",
      "package": "@h4shed/skill-playwright-test-automation",
      "tools": [],
      "enabled": true,
      "category": "general",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "playwright",
        "testing",
        "e2e",
        "automation"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "pre-deploy-validator",
      "id": "pre-deploy-validator",
      "description": "Pre-deployment validation and quality checks for production readiness",
      "version": "1.0.4",
      "package": "@h4shed/skill-pre-deploy-validator",
      "tools": [
        {
          "name": "validate_deployment",
          "file": "validate-deployment.ts",
          "description": "validate_deployment from pre-deploy-validator"
        }
      ],
      "enabled": true,
      "category": "development",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "validation",
        "testing",
        "deployment",
        "qa"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "project-manager",
      "id": "project-manager",
      "description": "Plan projects with milestones, dependencies, and delivery phases.",
      "version": "1.0.2",
      "package": "@h4shed/skill-project-manager",
      "tools": [
        {
          "name": "plan_project",
          "file": "plan-project.ts",
          "description": "plan_project from project-manager"
        }
      ],
      "enabled": true,
      "category": "project-management",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "planning",
        "automation"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "project-status-tool",
      "id": "project-status-tool",
      "description": "Summarize current project status, risks, and next actions.",
      "version": "1.0.2",
      "package": "@h4shed/skill-project-status-tool",
      "tools": [
        {
          "name": "summarize_project_status",
          "file": "summarize-project-status.ts",
          "description": "summarize_project_status from project-status-tool"
        }
      ],
      "enabled": true,
      "category": "project-management",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "planning",
        "automation"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "smart-contract-tools",
      "id": "smart-contract-tools",
      "description": "Smart contract development tools for Hardhat, Truffle, and Foundry ecosystems",
      "version": "1.0.0",
      "package": "@h4shed/skill-smart-contract-tools",
      "tools": [],
      "enabled": true,
      "category": "generative-art",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "smart-contracts",
        "solidity",
        "hardhat",
        "truffle",
        "foundry",
        "blockchain"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "storybook-component-library",
      "id": "storybook-component-library",
      "description": "Component library documentation and visual testing with Storybook integration",
      "version": "1.0.0",
      "package": "@h4shed/skill-storybook-component-library",
      "tools": [],
      "enabled": true,
      "category": "general",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "storybook",
        "component-library",
        "documentation",
        "ui-testing"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "style-dictionary-system",
      "id": "style-dictionary-system",
      "description": "Design tokens and style dictionary generation for cross-platform design system management",
      "version": "1.0.0",
      "package": "@h4shed/skill-style-dictionary-system",
      "tools": [],
      "enabled": true,
      "category": "design",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "style-dictionary",
        "design-tokens",
        "design-system",
        "theming"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "svg-generator",
      "id": "svg-generator",
      "description": "Generate SVG assets and icon concepts from structured prompts.",
      "version": "1.0.2",
      "package": "@h4shed/skill-svg-generator",
      "tools": [
        {
          "name": "generate_svg_asset",
          "file": "generate-svg-asset.ts",
          "description": "generate_svg_asset from svg-generator"
        }
      ],
      "enabled": true,
      "category": "design",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "planning",
        "automation"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "syncpulse",
      "id": "syncpulse",
      "description": "SyncPulse - intelligent project state caching, multi-agent coordination, and secure email automation with 9 production-ready templated workflows",
      "version": "0.2.0",
      "package": "@h4shed/skill-syncpulse",
      "tools": [
        {
          "name": "email_tools",
          "file": "email-tools.ts",
          "description": "email_tools from syncpulse"
        },
        {
          "name": "email_workflows",
          "file": "email-workflows.ts",
          "description": "email_workflows from syncpulse"
        },
        {
          "name": "index",
          "file": "index.ts",
          "description": "index from syncpulse"
        }
      ],
      "enabled": true,
      "category": "general",
      "author": "Fused Gaming",
      "keywords": [],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "tailwindcss-style-builder",
      "id": "tailwindcss-style-builder",
      "description": "Tailwind CSS utility-first styling and design system builder for rapid UI development",
      "version": "1.0.0",
      "package": "@h4shed/skill-tailwindcss-style-builder",
      "tools": [],
      "enabled": true,
      "category": "design",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "tailwindcss",
        "styling",
        "design-system",
        "ui-development"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "theme-factory",
      "id": "theme-factory",
      "description": "Design system and theme generation for consistent UI/UX across applications",
      "version": "1.0.4",
      "package": "@h4shed/skill-theme-factory",
      "tools": [
        {
          "name": "generate_theme",
          "file": "generate-theme.ts",
          "description": "generate_theme from theme-factory"
        }
      ],
      "enabled": true,
      "category": "design",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "theme",
        "design-system",
        "tailwind",
        "css"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "typescript-toolchain",
      "id": "typescript-toolchain",
      "description": "Advanced TypeScript configuration, type generation, and static analysis tooling",
      "version": "1.0.0",
      "package": "@h4shed/skill-typescript-toolchain",
      "tools": [],
      "enabled": true,
      "category": "general",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "typescript",
        "type-generation",
        "static-analysis",
        "toolchain"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "underworld-writer",
      "id": "underworld-writer",
      "description": "Create detailed character profiles, mythologies, and narrative worlds for underworld-themed stories",
      "version": "1.0.4",
      "package": "@h4shed/skill-underworld-writer",
      "tools": [],
      "enabled": true,
      "category": "content-creation",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "underworld",
        "character",
        "narrative",
        "creative-writing"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "ux-journeymapper",
      "id": "ux-journeymapper",
      "description": "Create UX journey maps with pain points, touchpoints, and opportunities.",
      "version": "1.0.2",
      "package": "@h4shed/skill-ux-journeymapper",
      "tools": [
        {
          "name": "map_user_journey",
          "file": "map-user-journey.ts",
          "description": "map_user_journey from ux-journeymapper"
        }
      ],
      "enabled": true,
      "category": "user-experience",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "planning",
        "automation"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "vercel-nextjs-deployment",
      "id": "vercel-nextjs-deployment",
      "description": "Vercel deployment optimization and Next.js framework integration for serverless applications",
      "version": "1.0.0",
      "package": "@h4shed/skill-vercel-nextjs-deployment",
      "tools": [],
      "enabled": true,
      "category": "development",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "vercel",
        "nextjs",
        "deployment",
        "serverless"
      ],
      "repository": "",
      "license": "Apache-2.0"
    },
    {
      "name": "vite-module-bundler",
      "id": "vite-module-bundler",
      "description": "Next-generation JavaScript module bundler for lightning-fast development and optimized production builds",
      "version": "1.0.0",
      "package": "@h4shed/skill-vite-module-bundler",
      "tools": [],
      "enabled": true,
      "category": "general",
      "author": "Fused Gaming",
      "keywords": [
        "mcp",
        "skill",
        "vite",
        "bundler",
        "build",
        "module"
      ],
      "repository": "",
      "license": "Apache-2.0"
    }
  ],
  "totalSkills": 28,
  "totalTools": 24,
  "categories": {
    "design": 7,
    "generative-art": 3,
    "general": 6,
    "productivity": 1,
    "content-creation": 2,
    "mcp-tools": 2,
    "visualization": 1,
    "session-management": 1,
    "development": 2,
    "project-management": 2,
    "user-experience": 1
  }
};

export function getSkill(name: string): SkillMetadata | undefined {
  return registry.skills.find(s => s.name === name || s.id === name);
}

export function getSkillsByCategory(category: string): SkillMetadata[] {
  return registry.skills.filter(s => s.category === category);
}

export function getAllTools(): { skillName: string; tools: Tool[] }[] {
  return registry.skills.map(skill => ({
    skillName: skill.name,
    tools: skill.tools
  }));
}
