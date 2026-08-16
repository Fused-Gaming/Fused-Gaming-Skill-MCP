#!/usr/bin/env node

/**
 * .claude Directory Synchronizer
 * Maintains .claude/skills, .claude/tools, and .claude/config in sync with repository state
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..');
const PACKAGES_DIR = path.join(REPO_ROOT, 'packages');
const SKILLS_DIR = path.join(PACKAGES_DIR, 'skills');
const CLAUDE_DIR = path.join(REPO_ROOT, '.claude');
const CLAUDE_SKILLS_DIR = path.join(CLAUDE_DIR, 'skills');
const REGISTRY_FILE = path.join(REPO_ROOT, 'registry', 'registry.json');

// Read registry
function readRegistry() {
  try {
    return JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
  } catch (e) {
    console.warn('Failed to read registry.json:', e.message);
    return null;
  }
}

// Ensure directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Generate SKILL.md file for a skill
function generateSkillMarkdown(skillKey, skillData) {
  const { name, version, description, hasTests, testCount, hasBenchmarks } = skillData;

  return `# ${skillKey}

**Package:** ${name}
**Version:** ${version}

## Description
${description || 'No description available'}

## Status
- **Tests:** ${hasTests ? `✅ (${testCount} suite${testCount !== 1 ? 's' : ''})` : '❌'}
- **Benchmarks:** ${hasBenchmarks ? '✅' : '❌'}

## Tool Functions
- Primary tool: \`${skillKey}\` MCP tool

## Configuration
This skill is part of the Fused Gaming MCP ecosystem and is enabled via the \`FUSED_GAMING_SKILLS_ENABLED\` environment variable.

## Development
- **Path:** \`packages/skills/${skillKey}\`
- **Package:** \`${name}\`
- **Test Directory:** \`src/__tests__/\`
- **Benchmark File:** \`src/benchmark.ts\`

## Next Steps
${!hasTests ? '- Add test suite in \`src/__tests__/\`' : '- ✅ Tests exist'}
${!hasBenchmarks ? '- Add benchmark file at \`src/benchmark.ts\`' : '- ✅ Benchmarks exist'}
`;
}

// Update .claude/skills with current skill entries
function syncSkillsDirectory(registry) {
  if (!registry) return;

  ensureDir(CLAUDE_SKILLS_DIR);

  const { skills } = registry;
  let skipped = 0;
  let created = 0;
  let updated = 0;

  for (const [skillKey, skillData] of Object.entries(skills)) {
    const skillDir = path.join(CLAUDE_SKILLS_DIR, skillKey);
    const skillFile = path.join(skillDir, 'SKILL.md');

    // Check if skill doc already exists and is recent (skip if less than 1 day old)
    if (fs.existsSync(skillFile)) {
      const stat = fs.statSync(skillFile);
      const ageHours = (Date.now() - stat.mtime.getTime()) / (1000 * 60 * 60);
      if (ageHours < 24) {
        skipped++;
        continue;
      }
    }

    ensureDir(skillDir);
    const markdown = generateSkillMarkdown(skillKey, skillData);
    fs.writeFileSync(skillFile, markdown, 'utf8');

    if (fs.existsSync(skillFile) && fs.statSync(skillFile).size > 0) {
      if (fs.existsSync(skillFile)) {
        const oldSize = fs.statSync(skillFile).size;
        if (oldSize > 0) {
          updated++;
        } else {
          created++;
        }
      } else {
        created++;
      }
    }
  }

  console.log(`✅ Skills synchronized: ${created} created, ${updated} updated, ${skipped} skipped`);
}

// Generate .claude/tools/INDEX.md with all tools
function syncToolsIndex(registry) {
  if (!registry) return;

  const toolsDir = path.join(CLAUDE_DIR, 'tools');
  ensureDir(toolsDir);

  const { skills, mcp } = registry;
  const tools = mcp.tools || [];

  let toolsMarkdown = `# MCP Tools Registry

**Generated:** ${new Date().toISOString()}
**Total Tools:** ${tools.length}

## Tools by Skill

`;

  for (const [skillKey, skillData] of Object.entries(skills)) {
    // Infer tool name from skill key (convert to camelCase)
    const toolName = skillKey
      .split('-')
      .map((part, i) => i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

    const toolInRegistry = tools.includes(`${toolName}`) ||
                          tools.some(t => t.toLowerCase().includes(skillKey.toLowerCase()));

    if (toolInRegistry || tools.includes(toolName)) {
      toolsMarkdown += `### ${toolName}\n`;
      toolsMarkdown += `- **Skill:** ${skillKey}\n`;
      toolsMarkdown += `- **Package:** ${skillData.name}\n`;
      toolsMarkdown += `- **Description:** ${skillData.description || 'N/A'}\n`;
      toolsMarkdown += `\n`;
    }
  }

  toolsMarkdown += `## All Tools\n\n`;
  tools.forEach(tool => {
    toolsMarkdown += `- \`${tool}\`\n`;
  });

  fs.writeFileSync(path.join(toolsDir, 'INDEX.md'), toolsMarkdown, 'utf8');
  console.log(`✅ Tools index generated: ${tools.length} tools`);
}

// Generate .claude/CONFIG.md with unified configuration
function syncConfigFile(registry) {
  if (!registry) return;

  const { stats, packages, skills, mcp } = registry;

  let configMarkdown = `# Fused Gaming MCP Configuration

**Generated:** ${new Date().toISOString()}
**Registry Version:** ${registry.version}

## Statistics

- **Total Skills:** ${stats.totalSkills}
- **Total Packages:** ${stats.totalPackages}
- **Skills with Tests:** ${stats.skillsWithTests}
- **Skills with Benchmarks:** ${stats.skillsWithBenchmarks}

## Core Packages

`;

  const corePackages = ['core', 'cli', 'design-tokens', 'benchmark-utils'];
  for (const key of corePackages) {
    if (packages[key]) {
      const pkg = packages[key];
      configMarkdown += `### ${key}\n`;
      configMarkdown += `- **Name:** ${pkg.name}\n`;
      configMarkdown += `- **Version:** ${pkg.version}\n`;
      configMarkdown += `- **Description:** ${pkg.description || 'N/A'}\n`;
      configMarkdown += `\n`;
    }
  }

  configMarkdown += `## MCP Servers\n\n`;
  mcp.servers.forEach(server => {
    configMarkdown += `- \`${server}\`\n`;
  });

  configMarkdown += `\n## Environment Configuration\n\n`;
  configMarkdown += `\`\`\`bash\n`;
  configMarkdown += `FUSED_GAMING_SKILLS_ENABLED=${Object.keys(skills).length}\n`;
  configMarkdown += `MCP_SERVERS=claude-flow,fused-gaming\n`;
  configMarkdown += `\`\`\`\n\n`;

  configMarkdown += `## Skills Enabled\n\n`;
  configMarkdown += `All 29 gaming skills are enabled:\n\n`;
  Object.keys(skills).forEach((key, i) => {
    configMarkdown += `${i + 1}. \`${key}\`\n`;
  });

  fs.writeFileSync(path.join(CLAUDE_DIR, 'CONFIG.md'), configMarkdown, 'utf8');
  console.log(`✅ Configuration file updated`);
}

// Main execution
function main() {
  console.log('🔄 Synchronizing .claude directory...\n');

  const registry = readRegistry();
  if (!registry) {
    console.error('❌ Failed to read registry.json - skipping sync');
    process.exit(1);
  }

  syncSkillsDirectory(registry);
  syncToolsIndex(registry);
  syncConfigFile(registry);

  console.log('\n✨ .claude directory synchronization complete!');
}

main();
