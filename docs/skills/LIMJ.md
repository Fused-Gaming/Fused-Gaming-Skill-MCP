# LinkedIn Master Journalist (LIMJ) Skill

**Version**: 1.0.0  
**Status**: Production Ready  
**Published**: Yes (`@h4shed/skill-linkedin-master-journalist`)

## Overview

The LinkedIn Master Journalist (LIMJ) skill enables autonomous generation of publication-ready LinkedIn content from high-level briefs. LIMJ transforms a single input—a content brief—into three production-ready deliverables:

1. **Article.md** — 1,200–1,800 word LinkedIn article optimized for C-suite engagement
2. **Posts.md** — Dual social post variants (personal profile + company page) with hashtag research and engagement strategy
3. **Cover.html** — Self-contained 1200×627px LinkedIn OpenGraph cover image with PNG export button

---

## What LIMJ Solves

**Problem**: Creating LinkedIn thought leadership content is time-consuming.
- Writing articles takes 4-6 hours
- Adapting for dual posting (personal + company) adds complexity
- Designing cover images requires design skills
- Hashtag research is tedious

**Solution**: LIMJ automates the entire workflow.
- **Autonomy**: Asks clarifying questions, never assumes context
- **Credibility**: Every claim is sourced and defensible
- **Voice**: Outputs read like a human expert, not AI
- **Production-ready**: Copy-paste directly into LinkedIn with no edits

---

## How LIMJ Works

### Step 1: Clarification
User provides a content brief. LIMJ asks:
- Topic and angle (contrarian/educational/case-study/framework)
- Primary audience (founder/CEO/CTO/investor)
- Tone preference (professional/conversational/provocative)
- Data sources (provided or researcher-sourced)
- Brand guidelines (colors, company, personal/company profile)

### Step 2: Research
LIMJ conducts:
- Web search for current statistics and trends
- Competitive landscape analysis (what's been published)
- Technical/legal/financial validation (fact-checking)
- Hashtag research with volume tiers
- Engagement target identification

### Step 3: Generation
LIMJ generates three complete files:
- **Article.md**: 7-section structure (Hook → Problem → Conventional → Alternative → Nuance → ROI → CTA)
- **Posts.md**: Personal + company post variants with hashtag strategy and engagement templates
- **Cover.html**: Functional HTML cover with CSS variables, Google Fonts, and html2canvas PNG export

### Step 4: Validation
LIMJ runs quality gates:
- ✅ Hook creates genuine tension/curiosity
- ✅ 3+ specific data points with sources
- ✅ No banned vocabulary (AI-detectable patterns)
- ✅ Authentic voice (peer-to-peer, not corporate)
- ✅ CTA is specific and actionable
- ✅ Cover dimensions and contrast validated

---

## Using LIMJ

### Option 1: Copy-Paste System Prompt (Fastest)

```bash
# Copy the full system prompt
cat LIMJ/LIMJ_System_Prompt.md

# Paste into Claude with your brief:
TOPIC: AI-assisted legal research for founders
ANGLE: Case study
AUDIENCE: Founders
TONE: Data-driven
HAVE_STATS: Please research

# Get: Article.md + Posts.md + Cover.html
```

### Option 2: Reference GitHub Documentation

```
Use LIMJ by referencing the skill docs:
- System Prompt: https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/blob/main/LIMJ/LIMJ_System_Prompt.md
- Quick Start: https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/blob/main/LIMJ/quickstart.md
- Guidelines: https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/tree/main/LIMJ/guidelines
- Templates: https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/tree/main/LIMJ/templates
```

### Option 3: Import as MCP Skill (Once Published)

```bash
npm install @h4shed/skill-linkedin-master-journalist

# Add to your MCP config
fused-gaming-mcp add linkedin-master-journalist

# Trigger with brief
```

---

## LIMJ System Requirements

- **Claude API access** (with web search enabled for research)
- **Brief**: Topic, angle, audience, tone, data sources
- **Optional**: Brand colors, company name, specific statistics

---

## Article Structure (7 Sections)

### 1. HOOK (100-150 words)
Open with specific scenario or surprising data point. Create cognitive dissonance. No generic openings.

**Example**: "I spent 3 years paying a law firm $18K annually for work I can now do with a $20/month AI subscription."

### 2. THE PROBLEM (200-300 words)
Quantify pain with specific numbers. Show stakes. Include 1+ surprising statistic.

### 3. THE CONVENTIONAL APPROACH (150-250 words)
Describe what most people do. Calculate true cost (time, money, opportunity). Set up why it's becoming obsolete.

### 4. THE ALTERNATIVE/INSIGHT (300-400 words)
Present contrarian approach with step-by-step methodology. Provide specific tools/frameworks. Back claims with data.

### 5. THE NUANCE (150-200 words)
Acknowledge limitations honestly. Specify where conventional approach still applies. Demonstrate intellectual honesty.

### 6. THE ROI/IMPACT (150-200 words)
Concrete numbers: time saved, money saved, outcomes improved. Before/after comparisons. Make math undeniable.

### 7. CALL TO ACTION (75-125 words)
Specific next step reader can take TODAY. Position as competitive advantage. Create urgency without being salesy.

---

## Vocabulary Enforcement

### Banned (Hard Stop)
- "In today's [adjective] world"
- "It's important to note that"
- "Best practices"
- "Robust," "seamless," "cutting-edge"
- Starting consecutive paragraphs with same word

### Required (Must Include)
- Industry-specific terminology
- Colloquialisms and idioms
- Precise technical language
- Sentence fragments. For emphasis.

---

## Color Palettes & Typography

### Brand Defaults
- **Fused Gaming LLC**: Dark (#0D1117), Bright blue (#58A6FF), Off-white (#F0F6FC)
- **VLN Security**: Near-black (#060810), Neon lime (#B4FC38), Pure white (#FFFFFF)

### Topic-Based Palettes
- **Tech/AI**: Navy + Cyan + Gold
- **Finance**: Green + Mint + Gold
- **Legal**: Navy + Burgundy + Gold
- **Health**: Slate + Green + Red

### Fonts (Google Fonts Only)
- **Display**: Space Grotesk, Bebas Neue, Playfair Display, Oswald
- **Body**: Source Sans Pro, Lato, Work Sans, Karla

---

## Hashtag Strategy

### Volume Tiers
- **High (1M+)**: 1-2 hashtags for broad reach (#AI, #Leadership, #Startups)
- **Medium (100K-1M)**: 2-3 for targeted reach (#LegalTech, #SaaS, #FounderLife)
- **Niche (<100K)**: 1-2 for community (#ArbitrationLaw, #Web3Gaming)

### Recommended Mix
Total 5-7 hashtags per post: 1-2 high + 2-3 medium + 1-2 niche

---

## Cover Image Specs

- **Dimensions**: Exactly 1200 × 627px (LinkedIn OpenGraph standard)
- **Format**: Self-contained HTML file
- **Export**: html2canvas-powered PNG download button
- **Design Variations**:
  - Data-Driven: Large number, minimal text, geometric shapes
  - Editorial: Prominent headline, sophisticated typography
  - Technical: Diagram/flowchart, icon grid, monospace
  - Story-Driven: Headline as hero, narrative hierarchy

---

## Quality Checklist

### Before Publishing

- [ ] **Article.md**: 1,200-1,800 words, all sections present
- [ ] **Posts.md**: Dual variants with hashtag research and engagement targets
- [ ] **Cover.html**: 1200×627px, PNG export working, colors WCAG AA compliant
- [ ] **Vocabulary**: No banned words, authentic voice
- [ ] **Sources**: 3+ data points with citations
- [ ] **CTA**: Specific and actionable
- [ ] **Metadata**: Extracted pull quotes and keywords

---

## Examples & Templates

### Files in Repository
- `LIMJ/templates/article-template.md` — Blank article template with structure
- `LIMJ/templates/posts-template.md` — Blank posts template
- `LIMJ/templates/cover-template.html` — Blank HTML cover
- `LIMJ/templates/example-Article.md` — Real published article (anonymized)
- `LIMJ/templates/example-Posts.md` — Real post variants
- `LIMJ/templates/example-Cover.html` — Real rendered cover

---

## Common Use Cases

### 1. Founder Thought Leadership
**Brief**: Industry insight from lived experience  
**Angle**: Case study or contrarian take  
**Audience**: Other founders, VCs  
**Output**: Long-form article + personal posts + branded cover

### 2. Company Announcements
**Brief**: Product launch, milestone, company news  
**Angle**: Educational or celebratory  
**Audience**: Customers, industry, employees  
**Output**: Article + dual posts (personal + company) + cover

### 3. Technical Deep Dives
**Brief**: Engineering insight or methodology  
**Angle**: Educational or framework  
**Audience**: CTOs, engineers, architects  
**Output**: Article with code snippets + technical posts + minimalist cover

### 4. Market Research
**Brief**: Industry trend or data analysis  
**Angle**: Data-driven contrarian  
**Audience**: Investors, researchers, operators  
**Output**: Article with primary sources + analytical posts + data visualization cover

---

## Implementation Status

### ✅ Complete
- System prompt (full, executable)
- Article generation rules (7-section structure, vocabulary enforcement)
- Posts generation (personal + company variants)
- Cover HTML generation (1200×627px with PNG export)
- Quality gates and validation
- Brand palettes and typography rules
- Hashtag research methodology
- Example outputs and templates
- Full documentation

### 🔄 Future Enhancements
- Serverless PNG generation (Playwright) for more reliable cover export
- Automated hashtag volume tracking integration
- LinkedIn analytics integration for post performance monitoring
- Template library for different industries/verticals
- A/B testing framework for post variants
- Multi-language support (currently English-only)

---

## Support & Contribution

### Questions?
- **GitHub**: [Fused-Gaming/Fused-Gaming-Skill-MCP/issues](https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/issues)
- **Documentation**: [LIMJ/README.md](../../LIMJ/README.md)
- **Author**: J. (supitsj) — Fused Gaming LLC

### Contributing
Found a bug? Have a suggestion? Please open an issue with:
- What you tried
- What happened
- What you expected
- Relevant error messages or example content

---

## Version History

### v1.0 (April 17, 2026)
- Initial release
- Complete system prompt
- Full documentation
- Example outputs
- Quality gates
- Brand customization

---

**Last Updated**: April 18, 2026  
**License**: Apache 2.0  
**Scope**: `@h4shed/skill-linkedin-master-journalist`
