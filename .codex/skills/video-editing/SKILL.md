# Video Editing Skill

Use this skill when a task asks an agent to cut, caption, reframe, summarize, remix, render, inspect, or automate video production.

## Goal

Convert a user or automation intent into a deterministic `video-job-manifest/v1`, execute the least-expensive viable operations, and leave enough state for another agent to resume the job safely.

## Workflow

1. Inspect the source media and collect duration, streams, dimensions, frame rate, audio channels, and codec information.
2. Translate the request into explicit editing operations. Never rely on prose alone once execution begins.
3. Prefer FFmpeg for deterministic media operations.
4. Use WhisperX/Whisper only when transcript or word timing is necessary.
5. Use subject tracking, segmentation, semantic search, or generative models only when the edit requires them.
6. Prefer local execution. Escalate selected expensive steps to Modal rather than moving the entire pipeline to GPU.
7. Render a low-cost preview before an expensive final export when the workflow contains subjective editorial choices.
8. Inspect the resulting output for duration, aspect ratio, stream health, clipping, silence, missing captions, and expected artifact presence.
9. Persist job state and artifact references so Codex, Claude, ChatGPT, and SyncPulse can continue from the same manifest.

## Agent routing

### Codex

Use for implementation tasks: adapters, FFmpeg command construction, tests, manifests, repository changes, CI, Modal functions, model wrappers, and deterministic render logic.

### Claude

Use for editorial tasks that benefit from long context: narrative selection, transcript analysis, story sequencing, alternate cuts, title/caption suggestions, and qualitative review.

### ChatGPT

Use for conversational orchestration: collecting user intent, invoking connected services, starting or changing scheduled automations, presenting previews, and obtaining approval for subjective decisions.

### SyncPulse

Use for durable workflow state: queue ownership, retries, worker selection, handoff events, failure state, artifact state, and cross-agent fan-out/fan-in.

## Handoff rules

Every handoff must preserve:

- `job_id`
- original `intent`
- exact source artifact reference
- normalized operation list
- completed operation IDs
- pending operation IDs
- artifact references
- execution/cost policy
- errors and retry count
- agent that last mutated state

Agents MUST NOT silently reinterpret completed operations. If editorial intent changes, append a revision and create a new render target.

## Suggested implementation order

1. FFmpeg adapter and probe/render tests.
2. WhisperX transcription adapter.
3. Job manifest validator.
4. Local worker CLI.
5. Modal remote worker adapter.
6. SynthCut MCP adapter.
7. SyncPulse queue/handoff integration.
8. Optional semantic scene search using CLIP.
9. Optional SAM2 subject segmentation/tracking.
10. Optional generative B-roll worker.

## Definition of done

A video job is complete only when the output was rendered, inspected, artifact metadata was recorded, and the manifest has terminal state `completed` or `failed` with an actionable error.
