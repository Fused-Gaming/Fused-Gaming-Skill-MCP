# Release Communication Guide (v1.0.4)

This document captures a ready-to-use launch summary and recommendation set for announcing releases.

## Terminal-Friendly Session Summary

Use this in terminal or release-call notes:

```text
Fused Gaming MCP v1.0.4 release prep summary
- Existing: 13 production-ready skills (+ core + CLI) published on npm under @h4shed.
- New: LinkedIn Master Journalist (LIMJ) skill v1.0
  * Autonomous LinkedIn article generation (1,200-1,800 words)
  * Dual social post variants (personal + company) with hashtag research
  * Self-contained LinkedIn cover images with PNG export
  * Full system prompt + guidelines + templates in repo
- Updated: Release automation includes npm namespace corrections and LIMJ documentation
- Risk watch: Ensure GH_TOKEN + NPM_TOKEN + optional NPM_SCOPE are configured in repository settings.
- Blocker watch: GitHub CLI/API visibility required for PR-level deployment diagnostics.
```

## LinkedIn Post (Recommended Draft)

```text
🚀 Fused Gaming MCP v1.0.4 ships with LinkedIn Master Journalist (LIMJ) skill!

We just added full autonomous LinkedIn content generation to the Fused Gaming MCP ecosystem. Transform briefs into publication-ready articles, dual social posts, and branded covers—no human editing needed.

What’s new:
✅ LinkedIn Master Journalist (LIMJ) v1.0 — autonomous article + posts + cover images
✅ 13 total production-ready skills for design, dev, content, and automation
✅ Full LIMJ documentation: system prompt, guidelines, templates, quality gates
✅ Tested with real briefs—articles are publication-ready, zero corporate jargon

Try LIMJ: Copy the system prompt from the repo, paste into Claude with your content brief, get three LinkedIn-ready files in minutes.

GitHub: [link]

#MCP #LinkedIn #ContentAutomation #AIEngineering #TypeScript #DevTools

---

**Follow-up comment suggestion**:
"LIMJ eliminates 4-6 hours per LinkedIn article. Dual posts (personal + company), hashtag research, and cover images—all production-ready. Perfect for founders and thought leaders shipping monthly content."
```

## Recommendations for the Post

1. Attach a visual from the project README social preview for reach and clarity.
2. Include one concrete “time saved” or “workflow improved” metric in a follow-up comment.
3. Add the GitHub repo link in the first comment to keep post body readable.
4. Re-share within 24–48 hours with a short technical thread highlighting one skill.
