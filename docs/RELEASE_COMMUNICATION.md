# Release Communication Guide (v1.0.3)

This document captures a ready-to-use launch summary and recommendation set for announcing the first stable release.

## Terminal-Friendly Session Summary

Use this in terminal or release-call notes:

```text
Fused Gaming MCP v1.0.3 release prep summary
- Existing: 9 production-ready skills (+ core + CLI) published on npm under @h4shed.
- Updated: Release automation split into dedicated workflows:
  * npm publish: .github/workflows/publish.yml
  * GitHub release: .github/workflows/github-release.yml
- Risk watch: Ensure GH_TOKEN + NPM_TOKEN + optional NPM_SCOPE are configured in repository settings.
- Blocker watch: GitHub CLI/API visibility required for PR-level deployment diagnostics.
```

## LinkedIn Post (Recommended Draft)

```text
🚀 We just shipped Fused Gaming MCP v1.0.3!

After a full production hardening cycle, we launched our modular Model Context Protocol stack with 9 ready-to-use skills for design, dev, and creative automation.

What’s included:
✅ MCP core + CLI for skill lifecycle management
✅ Skill packages for algorithmic art, frontend/canvas design, theming, validation, and scaffolding
✅ Production CI with npm workspace publishing and dedicated GitHub release automation
✅ Security-focused dependency updates and stable release documentation

Huge thanks to everyone who helped shape the first stable release.
If you’re building AI-native workflows and want composable skills, we’d love your feedback.

#MCP #AIEngineering #TypeScript #OpenSource #DevTools #Release
```

## Recommendations for the Post

1. Attach a visual from the project README social preview for reach and clarity.
2. Include one concrete “time saved” or “workflow improved” metric in a follow-up comment.
3. Add the GitHub repo link in the first comment to keep post body readable.
4. Re-share within 24–48 hours with a short technical thread highlighting one skill.
