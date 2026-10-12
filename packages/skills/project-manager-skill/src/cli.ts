#!/usr/bin/env node
/**
 * Executable entry point: `skill-project-manager <tool> '<json>'`.
 */

import { readFileSync } from 'node:fs';
import { runCli } from './cli-core.js';

const args = process.argv.slice(2);
// Read stdin only when no JSON argument was given and input is piped in.
const stdin = args.length < 2 && !process.stdin.isTTY ? readFileSync(0, 'utf8') : undefined;

const result = runCli(args, stdin);
if (result.exitCode === 0) {
  process.stdout.write(`${result.output}\n`);
} else {
  process.stderr.write(`${result.output}\n`);
}
process.exitCode = result.exitCode;
