#!/usr/bin/env node

/**
 * Fused Gaming MCP - Interactive Installation Terminal
 * Provides an interactive setup experience with Fused Gaming branding
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import figlet from 'figlet';
import { execSync } from 'child_process';

/**
 * Display Fused Gaming banner
 */
function showBanner() {
  console.clear();

  try {
    const text = figlet.textSync('FUSED GAMING', {
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true,
    });
    console.log(chalk.magenta(text));
  } catch {
    console.log(chalk.magenta.bold('\n╔═══════════════════════════════════════════════════════════════╗'));
    console.log(chalk.magenta.bold('║                     🎮 FUSED GAMING MCP 🎮                    ║'));
    console.log(chalk.magenta.bold('╚═══════════════════════════════════════════════════════════════╝\n'));
  }

  console.log(chalk.cyan('Model Context Protocol - Skill Ecosystem Setup\n'));
}

/**
 * Show welcome message
 */
function showWelcome() {
  const message = chalk.green(
    'Welcome to the Fused Gaming MCP interactive installer!\n\n' +
    'This wizard will guide you through initializing the MCP core framework,\n' +
    'configuring your skill registry, and setting up your development environment.\n\n' +
    'Let\'s get started! 🚀'
  );

  console.log(boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan',
  }));
}

/**
 * Gather user preferences
 */
async function gatherPreferences() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'installMode',
      message: 'Select installation mode:',
      choices: [
        {
          name: 'Full Setup (core + all skills + CLI)',
          value: 'full',
        },
        {
          name: 'Minimal Setup (core only)',
          value: 'minimal',
        },
        {
          name: 'Custom Setup (choose components)',
          value: 'custom',
        },
      ],
      default: 'full',
    },
    {
      type: 'list',
      name: 'environment',
      message: 'Select environment:',
      choices: [
        { name: 'Development', value: 'development' },
        { name: 'Production', value: 'production' },
      ],
      default: 'development',
    },
    {
      type: 'confirm',
      name: 'setupRegistry',
      message: 'Generate skill registry during setup?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'installDeps',
      message: 'Install npm dependencies?',
      default: true,
    },
  ]);

  if (answers.installMode === 'custom') {
    const customAnswers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'components',
        message: 'Select components to install:',
        choices: [
          { name: 'MCP Core', value: 'core', checked: true },
          { name: 'MCP CLI', value: 'cli', checked: true },
          { name: 'Design Skills', value: 'design' },
          { name: 'Development Skills', value: 'dev' },
          { name: 'Content Creation Skills', value: 'content' },
          { name: 'Project Management Skills', value: 'project' },
          { name: 'Orchestration Tools', value: 'orchestration' },
        ],
      },
    ]);
    answers.customComponents = customAnswers.components;
  }

  return answers;
}

/**
 * Execute setup steps
 */
async function executeSetup(preferences) {
  const steps = [];

  console.log('\n');
  const setupSpinner = ora('Preparing setup steps...').start();

  // Base steps - use hardcoded relative paths to avoid injection
  // Only generate registry from init if not handled separately
  const registryEnv = preferences.setupRegistry ? 'true' : 'false';
  steps.push({
    name: 'Initialize directories',
    command: `GENERATE_REGISTRY=${registryEnv} bash ./scripts/init-mcp-core.sh ${preferences.environment}`,
  });

  if (preferences.setupRegistry) {
    steps.push({
      name: 'Generate skill registry',
      command: 'node ./scripts/generate-skill-registry.js',
    });
  }

  if (preferences.installDeps) {
    steps.push({
      name: 'Install npm dependencies',
      command: 'npm install',
    });
  }

  // Only build for full or custom installations, skip for minimal
  if (preferences.installMode !== 'minimal') {
    steps.push({
      name: 'Build packages',
      command: 'npm run build',
    });
  }

  setupSpinner.succeed(`Prepared ${steps.length} setup steps`);

  // Execute steps
  console.log('\n');
  let successCount = 0;
  let failureCount = 0;

  for (const step of steps) {
    const spinner = ora(step.name).start();

    try {
      execSync(step.command, {
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      spinner.succeed(chalk.green(step.name));
      successCount++;
    } catch (error) {
      spinner.fail(chalk.red(step.name));
      console.log(chalk.dim(`  Error: ${error.message}`));
      failureCount++;
    }
  }

  return { successCount, failureCount, total: steps.length };
}

/**
 * Show completion summary
 */
function showSummary(preferences, results) {
  console.log('\n');

  const successRate = ((results.successCount / results.total) * 100).toFixed(0);
  const statusColor = results.failureCount === 0 ? 'green' : 'yellow';

  const summary = chalk[statusColor](
    `Setup Complete: ${results.successCount}/${results.total} steps succeeded (${successRate}%)\n\n` +
    `Installation Mode: ${preferences.installMode}\n` +
    `Environment: ${preferences.environment}\n` +
    `Registry Generated: ${preferences.setupRegistry ? 'Yes' : 'No'}\n` +
    `Dependencies Installed: ${preferences.installDeps ? 'Yes' : 'No'}`
  );

  console.log(boxen(summary, {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: statusColor,
  }));
}

/**
 * Show next steps
 */
function showNextSteps() {
  const steps = chalk.cyan(
    '1. Review your MCP configuration:\n' +
    '   cat .mcp/config.json\n\n' +
    '2. View available skills:\n' +
    '   cat registry/REGISTRY.md\n\n' +
    '3. Start the development server:\n' +
    '   npm run dev\n\n' +
    '4. For more information:\n' +
    '   cat docs/getting-started/QUICKSTART.md'
  );

  console.log(boxen(steps, {
    title: chalk.bold.yellow('Next Steps'),
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'yellow',
  }));
}

/**
 * Show support information
 */
function showSupport() {
  const support = chalk.green(
    'Need help? Check out these resources:\n\n' +
    '📚 Documentation: ./docs/\n' +
    '🐛 Report Issues: https://github.com/fused-gaming/fused-gaming-skill-mcp/issues\n' +
    '💬 Discussions: https://github.com/fused-gaming/fused-gaming-skill-mcp/discussions\n' +
    '📧 Support: support@h4shed.io'
  );

  console.log(boxen(support, {
    title: chalk.bold.cyan('Support & Resources'),
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan',
  }));
}

/**
 * Main interactive installer
 */
async function main() {
  try {
    showBanner();
    showWelcome();

    const preferences = await gatherPreferences();

    console.log('\n' + chalk.bold.magenta('Starting installation...\n'));

    const results = await executeSetup(preferences);

    showSummary(preferences, results);

    if (results.failureCount === 0) {
      showNextSteps();
    }

    showSupport();

    console.log('\n' + chalk.magenta.bold('Thank you for choosing Fused Gaming MCP! 🎮\n'));

    process.exit(results.failureCount > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n' + chalk.red.bold('Installation Error:'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

// Run installer
main();
