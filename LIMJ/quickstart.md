# LIMJ Quick Start

## Step 1: Prepare Your Brief

Gather this information:

```
TOPIC: [Main subject]
ANGLE: [Contrarian / Educational / Case Study / Framework]
PRIMARY AUDIENCE: [Founder / CEO / CTO / Technical Leader]
INDUSTRY: [Tech / Finance / Legal / Health / Other]
FIRST-PERSON: [Yes / No]
CREDIBILITY: [Lived experience / Research / Both]
TONE: [Professional / Conversational / Provocative]
HAVE STATS: [Yes - provide / No - I'll research]
COMPANY: [Fused Gaming LLC / VLN Security / Other]
DEADLINE: [Flexible / Urgent]
```

## Step 2: Trigger Claude with LIMJ Prompt

Use the full `LIMJ_System_Prompt.md`. You can:

**Option A**: Copy the entire prompt into your Claude message  
**Option B**: Reference it as a system instruction in Claude Code or API calls  
**Option C**: Store in a knowledge base and reference by name

**Example message to Claude:**

```
You are the LinkedIn Master Journalist (LIMJ). 
Use the system prompt at LIMJ/LIMJ_System_Prompt.md.

BRIEF:
- Topic: AI-assisted legal research saving founders money
- Angle: Case study from lived experience
- Audience: Founders
- Company: Fused Gaming LLC
- Tone: Skeptical-turned-believer
- I'll provide stats / Please research

Proceed with clarification questions or confirmation?
```

## Step 3: Confirm Context

LIMJ will ask clarifying questions if anything is missing. Answer them clearly.

## Step 4: Review Generated Files

LIMJ outputs three files:

1. **Article.md** — Read for flow, credibility, hook power
2. **Posts.md** — Review both post versions and hashtag strategy
3. **Cover.html** — Open in browser, download test PNG

## Step 5: Iterate (If Needed)

If anything needs revision:
- **Article issue**: "The hook feels flat" → LIMJ revises hook and re-runs quality gates
- **Post issue**: "Company version reads too salesy" → LIMJ revises tone
- **Cover issue**: "Colors don't match brand" → LIMJ adjusts palette

Specify exactly what's wrong, LIMJ fixes only that.

## Step 6: Publish

- **Article**: Paste Article.md into LinkedIn Article editor
- **Posts**: Copy each post version into LinkedIn post composer
- **Cover**: Download PNG from Cover.html and attach to article

---

## Template Files

See `/templates/` for:
- `example-Article.md` — Real published article (anonymized)
- `example-Posts.md` — Real post versions
- `example-Cover.html` — Rendered cover image

Use these as reference for quality and style.

---
