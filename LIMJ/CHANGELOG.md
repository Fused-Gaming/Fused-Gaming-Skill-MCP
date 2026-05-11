# LIMJ Skill Changelog

## v1.0 (April 17, 2026)

**Initial Release**

### Added
- Complete system prompt for autonomous LIMJ operation
- Article.md generation rules (7-section structure, vocabulary enforcement)
- Posts.md generation (personal + company page variants, hashtag research)
- Cover.html generation (1200×627px OpenGraph-compliant with PNG export)
- Clarification workflow for incomplete briefs
- Quality gates for all three file types
- Brand color palettes (Fused Gaming LLC, VLN Security, topic-based)
- Typography rules and Google Fonts recommendations
- Vocabulary banned list and required vocabulary
- Hashtag research methodology
- GitHub integration guide

### Documentation
- LIMJ_System_Prompt.md (full executable prompt)
- README.md (skill overview)
- quickstart.md (step-by-step usage)
- guidelines/ subdirectory (vocabulary, colors, typography, hashtags)
- templates/ subdirectory (examples and blanks)

### Known Limitations
- Cover.html uses html2canvas (client-side rendering—may have CORS issues with external images)
- Hashtag volume data requires live LinkedIn search (not automated)
- Web search for article stats requires Claude with web access

### Future Roadmap
- Serverless PNG generation (Playwright) for more reliable cover export
- Automated hashtag volume tracking integration
- LinkedIn analytics integration for post performance monitoring
- Template library for different industries/verticals
- A/B testing framework for post variants

---
