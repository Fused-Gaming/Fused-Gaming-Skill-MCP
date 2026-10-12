#!/usr/bin/env node
/**
 * CLI entry point (bin: skill-project-status-tool).
 * Prints JSON results to stdout; prints a JSON error to stderr and exits 1 on failure.
 */

import { readFileSync } from 'node:fs';
import { CLI_USAGE, parseCliArgs } from './cli-args.js';
import { runTool } from './handlers.js';
import { TOOL_SPECS } from './tool-definitions.js';

function readStdin(): string {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function fail(error: unknown): never {
  process.stderr.write(`${JSON.stringify({ ok: false, error }, null, 2)}\n`);
  process.exit(1);
}

function main(): void {
  const parsed = parseCliArgs(process.argv.slice(2), readStdin);

  switch (parsed.kind) {
    case 'help':
      process.stdout.write(CLI_USAGE);
      return;
    case 'list':
      process.stdout.write(
        `${JSON.stringify(TOOL_SPECS.map(({ name, description }) => ({ name, description })), null, 2)}\n`
      );
      return;
    case 'error':
      return fail(parsed.error);
    case 'run': {
      const result = runTool(parsed.tool, parsed.input);
      if (!result.ok) return fail(result.error);
      process.stdout.write(`${JSON.stringify(result.data, null, 2)}\n`);
      return;
    }
  }
}

main();
