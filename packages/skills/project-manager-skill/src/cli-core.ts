/**
 * Pure CLI logic, kept free of process and I/O side effects so it can be unit tested.
 * The executable entry point lives in cli.ts.
 */

import { TOOL_NAMES, runTool } from './handlers.js';

export interface CliResult {
  exitCode: number;
  output: string;
}

export const USAGE = [
  'Usage: skill-project-manager <tool> [json-input]',
  '',
  'JSON input may be passed as the second argument or piped on stdin.',
  '',
  `Tools: ${TOOL_NAMES.join(', ')}`,
].join('\n');

function failure(error: string, issues: string[]): CliResult {
  return { exitCode: 1, output: JSON.stringify({ ok: false, error, issues }) };
}

/**
 * Runs one CLI invocation. `args` excludes the node and script paths.
 * Success yields exit code 0 with the JSON result; any failure yields exit code 1 with a JSON error.
 */
export function runCli(args: string[], stdin?: string): CliResult {
  const [tool, rawInput] = args;

  if (tool === '--help' || tool === '-h') {
    return { exitCode: 0, output: USAGE };
  }
  if (!tool) {
    return failure('Missing tool name', [USAGE]);
  }
  if (args.length > 2) {
    return failure('Too many arguments', [`expected <tool> [json-input], received ${args.length} arguments`]);
  }

  const raw = rawInput ?? stdin ?? '';
  if (raw.trim() === '') {
    return failure('Missing JSON input', ['pass JSON as the second argument or on stdin']);
  }

  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return failure('Invalid JSON input', [reason]);
  }

  const result = runTool(tool, input);
  return { exitCode: result.ok ? 0 : 1, output: JSON.stringify(result) };
}
