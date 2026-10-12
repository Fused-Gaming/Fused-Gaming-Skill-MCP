/**
 * Pure CLI argument parsing. The stdin reader is injected so this is testable
 * without spawning a process.
 *
 * Usage:
 *   skill-project-status-tool <tool-name> '<json-input>'
 *   echo '<json-input>' | skill-project-status-tool <tool-name>
 *   skill-project-status-tool --list
 */

import { TOOL_NAMES, type ToolError } from './contracts.js';

export type CliParseResult =
  | { kind: 'help' }
  | { kind: 'list' }
  | { kind: 'run'; tool: string; input: unknown }
  | { kind: 'error'; error: ToolError };

export const CLI_USAGE = `Usage:
  skill-project-status-tool <tool-name> '<json-input>'
  echo '<json-input>' | skill-project-status-tool <tool-name>
  skill-project-status-tool --list
`;

function argError(message: string): CliParseResult {
  return { kind: 'error', error: { code: 'INVALID_ARGUMENTS', message } };
}

export function parseCliArgs(args: readonly string[], readStdin: () => string): CliParseResult {
  if (args.length === 0) return argError(`No tool name given.\n${CLI_USAGE}`);
  const [first] = args;
  if (first === '--help' || first === '-h') return { kind: 'help' };
  if (first === '--list') return { kind: 'list' };
  if (first.startsWith('-')) return argError(`Unknown option "${first}".\n${CLI_USAGE}`);
  // Reject unknown names before reading stdin, so a typo fails at once instead of waiting for input.
  if (!(TOOL_NAMES as readonly string[]).includes(first)) {
    return { kind: 'error', error: { code: 'UNKNOWN_TOOL', message: `Unknown tool "${first}". Run --list for the tool names.` } };
  }
  if (args.length > 2) {
    return argError('Too many arguments: quote the JSON input as a single argument.');
  }

  const raw = args.length === 2 ? args[1] : readStdin();
  if (raw.trim() === '') {
    return argError('No JSON input: pass it as the second argument or on stdin.');
  }

  try {
    return { kind: 'run', tool: first, input: JSON.parse(raw) as unknown };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    return { kind: 'error', error: { code: 'INVALID_JSON', message: `Input is not valid JSON: ${reason}` } };
  }
}
