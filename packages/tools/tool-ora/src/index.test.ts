import assert from 'node:assert/strict';
import test from 'node:test';
import { PassThrough } from 'node:stream';
import { createAgentProgress, renderAgentTaskContext, type AgentTaskContext } from './index.js';

const context: AgentTaskContext = {
  agent: 'code-03',
  role: 'executor',
  taskId: 'TASK-42',
  objective: 'Implement queue renderer',
  currentStep: 'Writing tests',
  workspace: 'implementation',
  branch: 'agent/code-03',
  source: 'sync.vln.gg',
  deliverables: ['typed API', 'tests'],
  constraints: ['no destructive changes'],
  queue: [
    { id: 'TASK-42', title: 'Implement queue renderer', state: 'working', owner: 'code-03' },
    { id: 'TASK-43', title: 'Review integration', state: 'queued', dependsOn: ['TASK-42'] },
  ],
  metadata: { priority: 'P0', attempt: 1 },
};

test('renderAgentTaskContext renders the complete assignment snapshot', () => {
  const rendered = renderAgentTaskContext(context);

  assert.match(rendered, /SYNCPULSE TASK CONTEXT/);
  assert.match(rendered, /code-03 · executor/);
  assert.match(rendered, /TASK-42 · Implement queue renderer/);
  assert.match(rendered, /Deliverables/);
  assert.match(rendered, /◉ TASK-42 Implement queue renderer @code-03/);
  assert.match(rendered, /○ TASK-43 Review integration ← TASK-42/);
  assert.match(rendered, /priority: P0/);
});

test('renderAgentTaskContext can hide queue and metadata', () => {
  const rendered = renderAgentTaskContext(context, { showQueue: false, showMetadata: false });

  assert.doesNotMatch(rendered, /Queue/);
  assert.doesNotMatch(rendered, /priority: P0/);
});

test('createAgentProgress writes a stable context snapshot when animation is disabled', () => {
  const stream = new PassThrough();
  let output = '';
  stream.on('data', (chunk) => {
    output += chunk.toString();
  });

  const progress = createAgentProgress({ ...context }, { enabled: false, stream });
  progress.start('Executing task').update('Validating result').succeed('Complete');

  assert.match(output, /Executing task/);
  assert.match(output, /TASK-42/);
  assert.equal(progress.context.currentStep, 'Validating result');
});
