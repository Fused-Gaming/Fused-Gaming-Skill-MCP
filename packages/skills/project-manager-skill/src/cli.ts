#!/usr/bin/env node
/**
 * Executable entry point: `skill-project-manager <tool> '<json>'`.
 */

import { readFileSync } from 'node:fs';
import { runCli } from './cli-core.js';

const args = process.argv.slice(2);
const [tool] = args;
// Read stdin only when a real tool was named with no JSON argument and input is piped in.
// Help and the missing-tool path must not block on an open pipe.
const readsStdin =
  args.length === 1 && tool !== undefined && tool !== '--help' && tool !== '-h' && !process.stdin.isTTY;
const stdin = readsStdin ? readFileSync(0, 'utf8') : undefined;

const result = runCli(args, stdin);
if (result.exitCode === 0) {
  process.stdout.write(`${result.output}\n`);
} else {
  process.stderr.write(`${result.output}\n`);
}
process.exitCode = result.exitCode;
