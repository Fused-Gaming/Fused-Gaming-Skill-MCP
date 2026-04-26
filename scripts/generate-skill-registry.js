#!/usr/bin/env node

/**
 * Skill Registry Generator
 * Scans all skill packages and generates a comprehensive registry
 * of available skills, tools, and their configurations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const skillsDir = path.join(rootDir, 'packages', 'skills');
const registryDir = path.join(rootDir, 'registry');

// Ensure registry directory exists
if (!fs.existsSync(registryDir)) {
  fs.mkdirSync(registryDir, { recursive: true });
}

function extractToolsFromSkill(skillPath) {
  const tools = [];
  const toolsDir = path.join(skillPath, 'src', 'tools');

  if (fs.existsSync(toolsDir)) {
    const files = fs.readdirSync(toolsDir);
    files.forEach(file => {
      if (file.endsWith('.ts')) {
        const toolName = file.replace('.ts', '').replace(/-/g, '_');
        tools.push({
          name: toolName,
          file: file,
          description: `${toolName} from ${path.basename(skillPath)}`
        });
      }
    });
  }

  return tools;
}

function generateRegistry() {
  const registry = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    skills: [],
    totalSkills: 0,
    totalTools: 0,
    categories: {}
  };

  const skills = [];
  const skillDirs = fs.readdirSync(skillsDir);

  skillDirs.forEach(skillDir => {
    const skillPath = path.join(skillsDir, skillDir);
    const packageJsonPath = path.join(skillPath, 'package.json');

    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, 'utf-8')
        );

        const tools = extractToolsFromSkill(skillPath);
        const skillId = packageJson.name.replace('@h4shed/', '').replace(/skill-|skill_/g, '');
        const category = detectCategory(skillId, packageJson.description || '');

        const skill = {
          name: skillId,
          id: skillId,
          description: packageJson.description || 'No description available',
          version: packageJson.version || '0.0.0',
          package: packageJson.name,
          tools: tools,
          enabled: true,
          category: category,
          author: packageJson.author || 'Fused Gaming',
          keywords: packageJson.keywords || [],
          repository: packageJson.repository?.url || '',
          license: packageJson.license || 'Apache-2.0'
        };

        skills.push(skill);
        registry.categories[category] = (registry.categories[category] || 0) + 1;
      } catch (error) {
        console.warn(`Warning: Could not parse ${skillDir}/package.json:`, error.message);
      }
    }
  });

  // Sort skills by name
  skills.sort((a, b) => a.name.localeCompare(b.name));

  registry.skills = skills;
  registry.totalSkills = skills.length;
  registry.totalTools = skills.reduce((sum, s) => sum + s.tools.length, 0);

  // Write registry files
  const registryJson = path.join(registryDir, 'skills.json');
  const registryJs = path.join(registryDir, 'skills.js');
  const registryTS = path.join(registryDir, 'skills.ts');

  fs.writeFileSync(registryJson, JSON.stringify(registry, null, 2));
  console.log(`✅ Generated skill registry: ${registryJson}`);

  // Generate CommonJS module
  fs.writeFileSync(
    registryJs,
    `module.exports = ${JSON.stringify(registry, null, 2)};`
  );
  console.log(`✅ Generated CommonJS registry: ${registryJs}`);

  // Generate TypeScript module
  const tsContent = `export interface Tool {
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

export const registry: SkillRegistry = ${JSON.stringify(registry, null, 2)};

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
`;

  fs.writeFileSync(registryTS, tsContent);
  console.log(`✅ Generated TypeScript registry: ${registryTS}`);

  // Generate HTML documentation
  const htmlContent = generateHtmlRegistry(registry);
  const registryHtml = path.join(registryDir, 'registry.html');
  fs.writeFileSync(registryHtml, htmlContent);
  console.log(`✅ Generated HTML registry: ${registryHtml}`);

  // Generate Markdown documentation
  const mdContent = generateMarkdownRegistry(registry);
  const registryMd = path.join(registryDir, 'REGISTRY.md');
  fs.writeFileSync(registryMd, mdContent);
  console.log(`✅ Generated Markdown registry: ${registryMd}`);

  // Print summary
  console.log(`\n📊 Registry Summary:`);
  console.log(`   Total Skills: ${registry.totalSkills}`);
  console.log(`   Total Tools: ${registry.totalTools}`);
  console.log(`   Categories: ${Object.keys(registry.categories).join(', ')}`);

  return registry;
}

function detectCategory(skillId, description) {
  const desc = description.toLowerCase();
  const id = skillId.toLowerCase();

  if (id.includes('art') || desc.includes('generative') || desc.includes('algorithmic')) return 'generative-art';
  if (id.includes('design') || id.includes('theme') || id.includes('svg') || id.includes('canvas') || desc.includes('design')) return 'design';
  if (id.includes('deploy') || id.includes('validator') || desc.includes('deployment')) return 'development';
  if (id.includes('mcp') || id.includes('builder') || id.includes('scaffold') || desc.includes('mcp')) return 'mcp-tools';
  if (id.includes('project') || id.includes('manager') || id.includes('status')) return 'project-management';
  if (id.includes('journey') || id.includes('ux')) return 'user-experience';
  if (id.includes('journal') || id.includes('writer') || id.includes('linkedin')) return 'content-creation';
  if (id.includes('session') || id.includes('account') || id.includes('tracking')) return 'session-management';
  if (id.includes('mermaid') || id.includes('diagram')) return 'visualization';
  if (id.includes('agentic') || id.includes('flow')) return 'orchestration';
  if (id.includes('review') || id.includes('daily')) return 'productivity';

  return 'general';
}

function generateHtmlRegistry(registry) {
  const categories = {};
  registry.skills.forEach(skill => {
    if (!categories[skill.category]) {
      categories[skill.category] = [];
    }
    categories[skill.category].push(skill);
  });

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fused Gaming Skill Registry</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
      padding: 2rem;
      min-height: 100vh;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    header {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #667eea;
      margin-bottom: 0.5rem;
      font-size: 2.5rem;
    }
    .stats {
      display: flex;
      gap: 2rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }
    .stat {
      display: flex;
      flex-direction: column;
    }
    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #764ba2;
    }
    .stat-label {
      font-size: 0.875rem;
      color: #666;
    }
    .categories {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .category-section {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .category-title {
      color: #667eea;
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #667eea;
    }
    .skill {
      margin-bottom: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
      border-left: 3px solid #667eea;
    }
    .skill-name {
      font-weight: bold;
      color: #333;
      margin-bottom: 0.25rem;
    }
    .skill-description {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 0.5rem;
    }
    .skill-tools {
      font-size: 0.75rem;
      color: #999;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .tool-badge {
      background: #667eea;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      font-size: 0.7rem;
    }
    footer {
      text-align: center;
      color: white;
      margin-top: 2rem;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🎮 Fused Gaming Skill Registry</h1>
      <p>Complete inventory of available MCP skills and tools</p>
      <div class="stats">
        <div class="stat">
          <span class="stat-value">${registry.totalSkills}</span>
          <span class="stat-label">Total Skills</span>
        </div>
        <div class="stat">
          <span class="stat-value">${registry.totalTools}</span>
          <span class="stat-label">Total Tools</span>
        </div>
        <div class="stat">
          <span class="stat-value">${Object.keys(categories).length}</span>
          <span class="stat-label">Categories</span>
        </div>
      </div>
    </header>

    <div class="categories">
`;

  Object.entries(categories).forEach(([category, skills]) => {
    html += `
      <div class="category-section">
        <div class="category-title">${formatCategoryName(category)} (${skills.length})</div>
`;
    skills.forEach(skill => {
      html += `
        <div class="skill">
          <div class="skill-name">📦 ${skill.name}</div>
          <div class="skill-description">${skill.description}</div>
          <div class="skill-tools">
            ${skill.tools.map(tool => `<span class="tool-badge">${tool.name}</span>`).join('')}
          </div>
        </div>
`;
    });
    html += `
      </div>
`;
  });

  html += `
    </div>
    <footer>
      <p>Generated on ${new Date().toLocaleString()} | Fused Gaming MCP v${registry.version}</p>
    </footer>
  </div>
</body>
</html>`;

  return html;
}

function generateMarkdownRegistry(registry) {
  let md = `# 🎮 Fused Gaming Skill Registry

**Generated:** ${new Date().toLocaleString()}
**Version:** ${registry.version}

## 📊 Summary

- **Total Skills:** ${registry.totalSkills}
- **Total Tools:** ${registry.totalTools}
- **Categories:** ${Object.keys(registry.categories).length}

## 📑 Skills by Category

`;

  const categories = {};
  registry.skills.forEach(skill => {
    if (!categories[skill.category]) {
      categories[skill.category] = [];
    }
    categories[skill.category].push(skill);
  });

  Object.entries(categories).forEach(([category, skills]) => {
    md += `\n### ${formatCategoryName(category)} (${skills.length} skills)\n\n`;
    skills.forEach(skill => {
      md += `#### 📦 ${skill.name}\n`;
      md += `- **Package:** \`${skill.package}\`\n`;
      md += `- **Description:** ${skill.description}\n`;
      md += `- **Version:** ${skill.version}\n`;
      if (skill.tools.length > 0) {
        md += `- **Tools:** ${skill.tools.map(t => `\`${t.name}\``).join(', ')}\n`;
      }
      md += '\n';
    });
  });

  md += `\n## 🛠️ All Tools\n\n`;
  md += '| Skill | Tool | File |\n';
  md += '|-------|------|------|\n';
  registry.skills.forEach(skill => {
    skill.tools.forEach(tool => {
      md += `| \`${skill.name}\` | \`${tool.name}\` | \`${tool.file}\` |\n`;
    });
  });

  return md;
}

function formatCategoryName(category) {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Run generator
try {
  const registry = generateRegistry();
  console.log('\n✨ Skill registry generation complete!');
  process.exit(0);
} catch (error) {
  console.error('❌ Error generating registry:', error);
  process.exit(1);
}
