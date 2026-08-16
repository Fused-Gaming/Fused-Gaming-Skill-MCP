#!/usr/bin/env node

/**
 * Registry Generator - Updates all registry files with current package information
 * Generates: registry.json, REGISTRY.md, skills.json, .claude sync
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..');
const PACKAGES_DIR = path.join(REPO_ROOT, 'packages');
const SKILLS_DIR = path.join(PACKAGES_DIR, 'skills');
const REGISTRY_DIR = path.join(REPO_ROOT, 'registry');

// Read package.json files and extract metadata
function readPackageMetadata() {
  const packages = {};
  const dirs = fs.readdirSync(PACKAGES_DIR);

  for (const dir of dirs) {
    const pkgPath = path.join(PACKAGES_DIR, dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const content = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        packages[dir] = {
          name: content.name,
          version: content.version,
          description: content.description,
          type: 'package',
          hasBenchmarks: fs.existsSync(path.join(PACKAGES_DIR, dir, 'benchmarks')) ||
                        fs.existsSync(path.join(PACKAGES_DIR, dir, 'src', 'benchmark.ts')),
          hasTests: fs.existsSync(path.join(PACKAGES_DIR, dir, 'src', '__tests__')) ||
                   fs.existsSync(path.join(PACKAGES_DIR, dir, 'test')),
        };
      } catch (e) {
        console.warn(`Failed to read ${pkgPath}:`, e.message);
      }
    }
  }

  return packages;
}

// Read all skills and extract metadata
function readSkillMetadata() {
  const skills = {};
  const dirs = fs.readdirSync(SKILLS_DIR);

  for (const dir of dirs) {
    const pkgPath = path.join(SKILLS_DIR, dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const content = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const testDir = path.join(SKILLS_DIR, dir, 'src', '__tests__');
        const benchmarkFile = path.join(SKILLS_DIR, dir, 'src', 'benchmark.ts');

        let testCount = 0;
        if (fs.existsSync(testDir)) {
          const files = fs.readdirSync(testDir);
          testCount = files.filter(f => f.endsWith('.test.ts')).length;
        }

        skills[dir] = {
          name: content.name,
          version: content.version,
          description: content.description,
          type: 'skill',
          hasTests: fs.existsSync(testDir),
          testCount: testCount,
          hasBenchmarks: fs.existsSync(benchmarkFile),
        };
      } catch (e) {
        console.warn(`Failed to read skill ${dir}:`, e.message);
      }
    }
  }

  return skills;
}

// Read MCP configuration
function readMCPConfig() {
  const mcpPath = path.join(REPO_ROOT, '.mcp.json');
  if (!fs.existsSync(mcpPath)) {
    return { mcpServers: {} };
  }

  try {
    return JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
  } catch (e) {
    console.warn('Failed to read .mcp.json:', e.message);
    return { mcpServers: {} };
  }
}

// Generate markdown registry
function generateMarkdownRegistry(packages, skills) {
  const now = new Date().toLocaleString();
  let markdown = `# 🎮 Fused Gaming Skill Registry

**Generated:** ${now}
**Version:** 1.2.0

## 📊 Summary

- **Total Skills:** ${Object.keys(skills).length}
- **Total Packages:** ${Object.keys(packages).length}
- **Skills with Tests:** ${Object.values(skills).filter(s => s.hasTests).length}
- **Skills with Benchmarks:** ${Object.values(skills).filter(s => s.hasBenchmarks).length}

## 📋 Core Packages

`;

  const corePackages = ['core', 'cli', 'design-tokens', 'benchmark-utils'];
  for (const pkg of corePackages) {
    if (packages[pkg]) {
      markdown += `### 📦 ${pkg}
- **Name:** ${packages[pkg].name}
- **Version:** ${packages[pkg].version}
- **Description:** ${packages[pkg].description || 'N/A'}
- **Tests:** ${packages[pkg].hasTests ? '✅' : '❌'}

`;
    }
  }

  markdown += `## 🎯 Skills (${Object.keys(skills).length} Total)

`;

  const skillKeys = Object.keys(skills).sort();
  for (const key of skillKeys) {
    const skill = skills[key];
    markdown += `### ${key}
- **Package:** ${skill.name}
- **Version:** ${skill.version}
- **Description:** ${skill.description || 'N/A'}
- **Tests:** ${skill.hasTests ? `✅ (${skill.testCount} test suites)` : '❌'}
- **Benchmarks:** ${skill.hasBenchmarks ? '✅' : '❌'}

`;
  }

  return markdown;
}

// Generate JSON registry
function generateJSONRegistry(packages, skills, mcpConfig) {
  const registry = {
    generated: new Date().toISOString(),
    version: '1.2.0',
    stats: {
      totalSkills: Object.keys(skills).length,
      totalPackages: Object.keys(packages).length,
      skillsWithTests: Object.values(skills).filter(s => s.hasTests).length,
      skillsWithBenchmarks: Object.values(skills).filter(s => s.hasBenchmarks).length,
    },
    packages,
    skills,
    mcp: {
      servers: Object.keys(mcpConfig.mcpServers || {}),
      tools: [],
    },
  };

  if (mcpConfig.mcpServers && mcpConfig.mcpServers['fused-gaming']) {
    registry.mcp.tools = mcpConfig.mcpServers['fused-gaming'].tools || [];
  }

  return registry;
}

// Main execution
function main() {
  console.log('🔄 Generating registry...\n');

  const packages = readPackageMetadata();
  const skills = readSkillMetadata();
  const mcpConfig = readMCPConfig();

  console.log(`📦 Found ${Object.keys(packages).length} packages`);
  console.log(`🎯 Found ${Object.keys(skills).length} skills`);
  console.log(`📡 Found ${Object.keys(mcpConfig.mcpServers || {}).length} MCP servers\n`);

  // Generate markdown
  const markdown = generateMarkdownRegistry(packages, skills);
  const mdPath = path.join(REGISTRY_DIR, 'REGISTRY.md');
  fs.writeFileSync(mdPath, markdown);
  console.log(`✅ Generated ${mdPath}`);

  // Generate JSON
  const jsonRegistry = generateJSONRegistry(packages, skills, mcpConfig);
  const jsonPath = path.join(REGISTRY_DIR, 'registry.json');
  fs.writeFileSync(jsonPath, JSON.stringify(jsonRegistry, null, 2));
  console.log(`✅ Generated ${jsonPath}`);

  // Summary
  console.log(`\n📊 Registry Summary:`);
  console.log(`   Skills with Tests: ${jsonRegistry.stats.skillsWithTests}/${jsonRegistry.stats.totalSkills}`);
  console.log(`   Skills with Benchmarks: ${jsonRegistry.stats.skillsWithBenchmarks}/${jsonRegistry.stats.totalSkills}`);
  console.log(`   MCP Tools: ${jsonRegistry.mcp.tools.length}`);

  console.log('\n✨ Registry update complete!');
}

main();
