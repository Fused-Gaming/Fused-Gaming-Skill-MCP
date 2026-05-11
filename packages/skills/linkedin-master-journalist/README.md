# @h4shed/skill-linkedin-master-journalist

**v1.0.1** — Draft polished LinkedIn release and thought-leadership posts with quality validation and performance tracking.

## Installation

```bash
npm install @h4shed/skill-linkedin-master-journalist
```

## Features

- 📝 **Draft LinkedIn Posts** — Generate publication-ready articles, dual posts, and cover images
- ✅ **Verify Hashtags** — Validate hashtag strategy against volume data and best practices
- 🔍 **Analyze Content Quality** — Enforce brand voice, vocabulary rules, and structural requirements
- 📊 **Track Performance** — Monitor and compare content metrics across LinkedIn platforms

## Tools

### 1. `draft-linkedin-post`

Scaffold for drafting polished LinkedIn release and thought-leadership posts.

**Input:**
- `objective` (string, required) — Primary objective for content generation
- `context` (string, optional) — Contextual details about the topic

### 2. `verify-hashtags`

Validates hashtag strategy against a curated database of LinkedIn hashtag volume data.

**Input:**
- `hashtags` (array, required) — List of hashtags to verify (e.g., `["#AI", "#Leadership"]`)
- `strategy` (enum, optional) — Strategy type: `balanced` (3 high + 2 medium), `reach` (5+ high), `niche` (2+ niche)

**Output:**
- Total and valid hashtag count
- Breakdown by tier (high, medium, niche)
- Strategy alignment assessment
- Actionable recommendations

**Example:**
```json
{
  "hashtags": ["#AI", "#Leadership", "#Startups", "#Innovation"],
  "strategy": "balanced"
}
```

### 3. `analyze-content-quality`

Validates generated content against LIMJ quality gates and brand voice guidelines.

**Input:**
- `content` (string, required) — Content to analyze
- `contentType` (enum, required) — `article` or `post`
- `wordCountTarget` (object, optional) — Custom min/max word counts

**Quality Gates:**
- ✓ No banned vocabulary (AI-detectable patterns)
- ✓ Within word count targets
- ✓ Paragraph variety (no excessive short paragraphs)
- ✓ Sentence variety (balanced sentence length)

**Output:**
- Pass/fail status
- List of issues and warnings
- Quality score (gates passed/total gates)
- Metrics: word count, paragraph count, avg sentence length, banned word instances
- Next steps for remediation

### 4. `track-content-performance`

Tracks and analyzes LIMJ-generated content performance metrics across LinkedIn platforms.

**Actions:**

**record** — Log performance metrics for published content
```json
{
  "action": "record",
  "entry": {
    "contentId": "article-001",
    "platform": "linkedin-personal",
    "contentType": "article",
    "title": "How I Cut $47K in Legal Fees",
    "publishDate": "2026-05-01",
    "metrics": {
      "views": 2500,
      "likes": 180,
      "comments": 25,
      "shares": 12,
      "saves": 45,
      "clicks": 125
    }
  }
}
```

**analyze** — Analyze specific content trends
```json
{
  "action": "analyze",
  "contentIds": ["article-001", "article-002"],
  "timeframe": "month"
}
```

**compare** — Compare personal vs. company post performance
```json
{
  "action": "compare",
  "timeframe": "month"
}
```

## Usage Example

```typescript
import { LinkedinMasterJournalistSkill } from "@h4shed/skill-linkedin-master-journalist";

// Initialize skill
await LinkedinMasterJournalistSkill.initialize({});

// Run tools through MCP
// 1. Draft content
// 2. Verify hashtag strategy
// 3. Analyze content quality
// 4. Publish and track performance
```

## Implementation Status

- ✅ Core scaffolding
- ✅ Hashtag verification with 40+ tracked hashtags
- ✅ Content quality analysis with 20+ validation rules
- ✅ Performance tracking infrastructure
- ⏳ LinkedIn API integration for real-time hashtag volume
- ⏳ Cloud storage for performance metrics
- ⏳ Multi-brand template system

## Development

```bash
# Build
npm run build --workspace=packages/skills/linkedin-master-journalist

# Test (placeholder)
npm run test --workspace=packages/skills/linkedin-master-journalist

# Watch mode
npm run dev --workspace=packages/skills/linkedin-master-journalist
```

## Roadmap

**v1.1** — LinkedIn Metadata Scraping
- Extract publication data from LinkedIn URLs
- Validate citations and source credibility

**v1.2** — Real-time Performance Dashboard
- Live metrics sync from LinkedIn API
- Comparative analytics across platforms

**v1.3** — Content Calendar Integration
- Schedule posts across platforms
- Multi-brand publishing

**v2.0** — AI-Powered Variations
- Generate multiple content variants
- A/B testing framework

## License

Apache-2.0
