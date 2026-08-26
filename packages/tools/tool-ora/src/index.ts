import ora, { type Ora, type Options as OraOptions } from 'ora';

export const name = 'ora';
export const version = '1.1.0';
export const description =
  'Agent-aware terminal progress and task-context rendering for the @h4shed ecosystem';

export type AgentTaskState =
  | 'queued'
  | 'working'
  | 'blocked'
  | 'waiting'
  | 'success'
  | 'failed'
  | 'cancelled';

export interface TaskQueueItem {
  id: string;
  title: string;
  state?: AgentTaskState;
  owner?: string;
  dependsOn?: string[];
}

export interface AgentTaskContext {
  agent: string;
  role?: string;
  taskId: string;
  objective: string;
  deliverables?: string[];
  constraints?: string[];
  queue?: TaskQueueItem[];
  currentStep?: string;
  workspace?: string;
  branch?: string;
  source?: string;
  metadata?: Record<string, string | number | boolean | undefined>;
}

export interface AgentContextRendererOptions {
  /** Prefix used for context header lines. */
  label?: string;
  /** Include queued work underneath the active assignment. */
  showQueue?: boolean;
  /** Include metadata key/value pairs. */
  showMetadata?: boolean;
  /** Force spinner behavior. Defaults to TTY detection. */
  enabled?: boolean;
  /** Output stream used by Ora. */
  stream?: NodeJS.WritableStream;
  /** Ora spinner options. */
  ora?: Omit<OraOptions, 'text' | 'stream' | 'isEnabled'>;
}

export interface AgentProgressController {
  readonly context: AgentTaskContext;
  readonly spinner: Ora;
  start(step?: string): AgentProgressController;
  update(step: string): AgentProgressController;
  succeed(message?: string): AgentProgressController;
  fail(message?: string): AgentProgressController;
  warn(message?: string): AgentProgressController;
  info(message?: string): AgentProgressController;
  stop(): AgentProgressController;
  snapshot(): string;
}

const stateGlyph: Record<AgentTaskState, string> = {
  queued: '○',
  working: '◉',
  blocked: '!',
  waiting: '…',
  success: '✓',
  failed: '✕',
  cancelled: '−',
};

function compact(values: Array<string | undefined>): string[] {
  return values.filter((value): value is string => Boolean(value && value.trim()));
}

function detailLine(label: string, value?: string): string | undefined {
  return value ? `  ${label.padEnd(12)} ${value}` : undefined;
}

export function renderAgentTaskContext(
  context: AgentTaskContext,
  options: Pick<AgentContextRendererOptions, 'label' | 'showQueue' | 'showMetadata'> = {},
): string {
  const label = options.label ?? 'SYNCPULSE TASK CONTEXT';
  const showQueue = options.showQueue ?? true;
  const showMetadata = options.showMetadata ?? true;

  const lines = compact([
    `┌─ ${label}`,
    detailLine('Agent', context.role ? `${context.agent} · ${context.role}` : context.agent),
    detailLine('Task', `${context.taskId} · ${context.objective}`),
    detailLine('Step', context.currentStep),
    detailLine('Workspace', context.workspace),
    detailLine('Branch', context.branch),
    detailLine('Source', context.source),
  ]);

  if (context.deliverables?.length) {
    lines.push('  Deliverables');
    lines.push(...context.deliverables.map((item) => `    • ${item}`));
  }

  if (context.constraints?.length) {
    lines.push('  Constraints');
    lines.push(...context.constraints.map((item) => `    • ${item}`));
  }

  if (showQueue && context.queue?.length) {
    lines.push('  Queue');
    lines.push(
      ...context.queue.map((item) => {
        const state = item.state ?? 'queued';
        const owner = item.owner ? ` @${item.owner}` : '';
        const deps = item.dependsOn?.length ? ` ← ${item.dependsOn.join(', ')}` : '';
        return `    ${stateGlyph[state]} ${item.id} ${item.title}${owner}${deps}`;
      }),
    );
  }

  if (showMetadata && context.metadata) {
    const metadata = Object.entries(context.metadata).filter(([, value]) => value !== undefined);
    if (metadata.length) {
      lines.push('  Metadata');
      lines.push(...metadata.map(([key, value]) => `    ${key}: ${String(value)}`));
    }
  }

  lines.push('└─');
  return lines.join('\n');
}

export function createAgentProgress(
  context: AgentTaskContext,
  options: AgentContextRendererOptions = {},
): AgentProgressController {
  const stream = options.stream ?? process.stderr;
  const isEnabled = options.enabled ?? Boolean((stream as NodeJS.WriteStream).isTTY);
  const initialText = context.currentStep ?? context.objective;
  const spinner = ora({
    ...options.ora,
    text: initialText,
    stream,
    isEnabled,
  });

  const snapshot = () => renderAgentTaskContext(context, options);

  return {
    context,
    spinner,
    start(step?: string) {
      if (step) {
        context.currentStep = step;
        spinner.text = step;
      }
      if (!isEnabled) {
        stream.write(`${snapshot()}\n`);
      }
      spinner.start();
      return this;
    },
    update(step: string) {
      context.currentStep = step;
      spinner.text = step;
      return this;
    },
    succeed(message?: string) {
      spinner.succeed(message ?? context.currentStep ?? context.objective);
      return this;
    },
    fail(message?: string) {
      spinner.fail(message ?? context.currentStep ?? context.objective);
      return this;
    },
    warn(message?: string) {
      spinner.warn(message ?? context.currentStep ?? context.objective);
      return this;
    },
    info(message?: string) {
      spinner.info(message ?? context.currentStep ?? context.objective);
      return this;
    },
    stop() {
      spinner.stop();
      return this;
    },
    snapshot,
  };
}

export function createSpinner(text: string, options: Omit<OraOptions, 'text'> = {}): Ora {
  return ora({ ...options, text });
}

export default {
  name,
  version,
  description,
  createSpinner,
  createAgentProgress,
  renderAgentTaskContext,
};
