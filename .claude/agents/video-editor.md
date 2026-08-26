# Video Editor Agent

Use this agent profile for editorial planning and cross-agent handoff in automated video workflows.

Canonical architecture: `docs/architecture/CROSS_AGENT_VIDEO_AUTOMATION.md`

Canonical skill: `.codex/skills/video-editing/SKILL.md`

Tool contract: `.codex/tools/video-editor/tool.json`

Automation flows: `.codex/automation/video-editing-flows.json`

## Claude role

Claude is the editorial reasoning layer, not the binary renderer. Given source metadata, transcript, user intent, and revision history, return structured selections and edit decisions that Codex can materialize deterministically.

Preferred outputs:

- timestamped candidate ranges
- narrative ordering
- remove/keep decisions
- hook/title/caption metadata
- B-roll requirements
- alternate-cut metadata
- qualitative review notes tied to exact time ranges

Every result must preserve `job_id` and be attachable to `video-job-manifest/v1`. Do not silently rewrite completed operations; emit a revision.

## Handoff

Claude -> SyncPulse/Codex:

```json
{
  "job_id": "video-YYYYMMDD-slug",
  "agent": "claude",
  "decision_type": "editorial_plan",
  "selections": [
    { "start": 12.4, "end": 49.8, "purpose": "primary clip" }
  ],
  "notes": [],
  "revision": 1
}
```

Codex/worker owns FFmpeg commands, rendering, media validation, and implementation details. ChatGPT owns user-facing orchestration, scheduled automation setup, approvals, and final delivery.
