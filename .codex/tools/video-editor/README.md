# Video Editor Tool

Reusable, automation-first video editing tool for Codex, Claude, ChatGPT, and SyncPulse flows.

## Purpose

Provide one stable interface for scripted and agentic video editing without coupling workflows to a single commercial renderer.

## Recommended runtime

- FFmpeg: canonical media cutting, muxing, encoding, filters
- WhisperX or Whisper: transcription and word timestamps
- SynthCut: MCP-oriented editing operations when available
- video-use / AutoBroll: higher-level agent editing patterns
- Remotion: optional motion graphics and template composition
- MoviePy: Python escape hatch for transforms that are awkward in FFmpeg
- Modal: optional serverless CPU/GPU execution
- Hugging Face: model registry for Whisper, CLIP, SAM2, CogVideo-family models

## Stable interface

Agents should reason in terms of these operations, even if the backend changes:

```text
probe(input)
transcribe(input, model?)
trim(input, start, end)
split(input, timestamps[])
concat(inputs[])
remove_silence(input, threshold_ms)
remove_fillers(input, transcript)
caption(input, transcript, style)
reframe(input, aspect_ratio, subject_tracking?)
overlay(input, asset, placement)
mix_audio(input, music?, ducking?, loudness?)
render(timeline, output_profile)
inspect(output)
```

## Job manifest

All cross-agent jobs should be serializable as JSON so Codex, Claude, ChatGPT, CI, and scheduled automations can resume the same work.

```json
{
  "version": "1.0",
  "job_id": "video-YYYYMMDD-slug",
  "source": { "uri": "...", "kind": "video" },
  "intent": "Create a 45 second vertical social clip",
  "operations": [
    { "op": "transcribe", "engine": "whisperx" },
    { "op": "remove_silence", "threshold_ms": 450 },
    { "op": "reframe", "aspect_ratio": "9:16" },
    { "op": "caption", "preset": "social-bold" },
    { "op": "mix_audio", "target_lufs": -14 },
    { "op": "render", "codec": "h264", "container": "mp4" }
  ],
  "execution": {
    "preferred": "local",
    "fallback": "modal",
    "gpu_only_for": ["transcribe", "vision", "generation"]
  },
  "artifacts": []
}
```

## Cost routing

1. Use local FFmpeg/CPU first.
2. Run transcription locally when practical.
3. Escalate only AI-heavy steps to Modal GPU workers.
4. Cache model weights and transcripts.
5. Re-render only changed timeline segments where possible.
6. Avoid generative video unless the job explicitly requires it.

## Agent behavior

- Codex: implementation, tests, manifests, renderer adapters, CI.
- Claude: long-context editorial decisions, story structure, review, alternate cuts.
- ChatGPT: user-facing orchestration, automation scheduling, connector calls, approval loops.
- SyncPulse: queueing, handoff, retries, job state, cross-agent coordination.

See `docs/architecture/CROSS_AGENT_VIDEO_AUTOMATION.md` for the canonical architecture and `.codex/automation/video-editing-flows.json` for reusable flows.
