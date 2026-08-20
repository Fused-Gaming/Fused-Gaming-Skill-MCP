# @h4shed/skill-underworld-writer

A comprehensive creative and journalistic skill for developing narratives that explore hidden worlds, criminal enterprises, and underworld themes. Provides **dual methodologies** for fictional underworld character development and factually sourced true crime narratives.

## Installation

```bash
npm install @h4shed/skill-underworld-writer
```

## Tools

### `create-character`

Create detailed character profiles using structured methodologies:

**For Fiction:**
1. **Character Foundation** - Identity, origin, characteristics, background
2. **Underworld Integration** - Role, motivations, relationships, powers
3. **Narrative Architecture** - Mythology, hierarchies, conflicts, themes

**For True Crime:**
1. **Source-Tier Triage** - Classify claims by evidence quality (Tier 1-4)
2. **Verification Workflow** - Query construction, cross-source reconciliation
3. **Narrative Structuring** - Scene-by-scene sourcing with tier attribution

## Use Cases

### 📖 Fiction Narratives
- Underworld character development (vampires, demons, supernatural hierarchies)
- Organized crime fiction (mafia families, gang structures)
- Character-driven underworld stories with invented scenarios
- Fantasy world systems with underworld elements

### 📚 True Crime Narratives
- Long-form true crime grounded in court records and primary sources
- Factually accurate chapter structure without invented dialogue
- Source tier classification and claim verification
- Editorial transparency and sourcing audits

### 🌍 World-Building
- Mythology and hierarchical systems
- Character relationship mapping
- Multi-faction organizational structures
- Thematic narrative arcs

### 🎭 Character Development
- Deep character profiling (fiction or real people)
- Motivation and conflict analysis
- Relationship dynamics and dependencies
- Transformation arcs and story positioning

## Quick Start

### Choose Your Path

**Writing fictional underworld stories?**
→ Start with [`use-cases/fiction/METHODOLOGY.md`](./use-cases/fiction/METHODOLOGY.md)

**Writing true crime narratives?**
→ Start with [`use-cases/true-crime/protocols/SKILL.md`](./use-cases/true-crime/protocols/SKILL.md)

## Directory Structure

```
packages/skills/underworld-writer-skill/
├── SKILL.md                                   # Main skill router
├── README.md                                  # This file
├── use-cases/
│   ├── fiction/
│   │   └── METHODOLOGY.md                     # Fiction methodology (3-phase)
│   └── true-crime/
│       └── protocols/
│           ├── SKILL.md                       # True crime router
│           ├── verification-engine.md         # Source-tier triage system
│           ├── query-construction-guide.md    # Search patterns
│           ├── cross-source-reconciliation.md # Conflict resolution
│           └── escalation-protocols.md        # Gap management & PACER
├── shared/
│   ├── character-template.md                  # Character profiles
│   ├── narrative-architecture.md              # Scene structure & pacing
│   ├── editorial-checklist.md                 # Pre-submission audit
│   └── author-note-conventions.md             # Disclosure templates
├── examples/
│   ├── chapter-source-audit.md                # Brett Johnson case study
│   ├── claim-verification-walkthrough.md      # Tier classification walkthrough
│   └── gap-escalation-case-study.md           # Gap resolution walkthrough
└── package.json
```

## Core Principles

### All Methodologies Share
- **Systematic Development** - Structured, phase-based approaches
- **Consistency** - All elements align and support each other
- **Transparency** - Editorial decisions are disclosed
- **Depth** - Thorough character and world development
- **Integration** - Elements connect into cohesive narratives

### Fiction-Specific
- Believable character choices within world rules
- Thematic resonance with underworld setting
- Multi-level power structures and hierarchies

### True Crime-Specific
- Tier-ranked sourcing (legal records prioritized)
- No invention without disclosure
- Primary-source priority over paraphrased accounts
- Auditable, transparent sourcing throughout

## Key Features

✅ **Dual-methodology support** (Fiction + True Crime)  
✅ **Systematic verification workflows** (4-tier source classification)  
✅ **Character development frameworks** (3-phase for fiction, cite-as-you-write for true crime)  
✅ **Editorial auditing tools** (Pre-submission checklists, gap management)  
✅ **Narrative architecture guidance** (Scene structure, pacing, thematic framing)  
✅ **Source escalation protocols** (PACER, BOP, archive strategies)  
✅ **Worked case studies** (Brett Johnson/ShadowCrew and more)  
✅ **Relationship mapping support** (Character connections and hierarchies)  

## Implementation Status

- ✅ Dual-methodology skill definition
- ✅ Fiction character development framework
- ✅ True crime verification engine with tier-based triage
- ✅ Shared editorial resources and templates
- ✅ Case study examples for both methodologies
- ✅ Source escalation protocols and search strategies
- ✅ Full specification compliance for both paths

## Usage

This package exports an MCP skill definition that can be loaded by `@h4shed/mcp-core` via the workspace skill registry. Use with Claude or other AI systems to guide narrative development across both fiction and true crime domains.

### Fiction Workflow Example

```markdown
1. Use Phase 1 to establish character foundation
2. Use Phase 2 to integrate into underworld hierarchy
3. Use Phase 3 to connect to larger mythology
4. Reference shared/ resources for narrative structure
5. Use editorial-checklist before finalizing
```

### True Crime Workflow Example

```markdown
1. Classify claim using verification-engine.md
2. Construct search queries per query-construction-guide.md
3. Reconcile conflicts using cross-source-reconciliation.md
4. Escalate gaps through escalation-protocols.md
5. Structure narrative with shared resources
6. Run editorial-checklist before submission
```

## Development

```bash
# from repository root
npm run build --workspace=packages/skills/underworld-writer-skill
npm run test --workspace=packages/skills/underworld-writer-skill
```

## Examples & Learning

See the `./examples/` directory for:
- **chapter-source-audit.md** - Worked true crime example (Brett Johnson case)
- **claim-verification-walkthrough.md** - Step-by-step tier classification
- **gap-escalation-case-study.md** - How to resolve unverified claims

## Contributing

Issues, improvements, and case studies are welcome. Open a PR with:
- New verification workflows or search patterns
- Additional character development examples
- Refined editorial templates
- Case studies demonstrating either methodology
- Improvements to narrative architecture guidance

## License

Apache-2.0

---

**Version:** 2.0.0  
**Last updated:** August 2026  
**Methodology:** Fiction (3-phase) + True Crime (6-step verification)  
**Status:** Stable, actively maintained, dual-path support
