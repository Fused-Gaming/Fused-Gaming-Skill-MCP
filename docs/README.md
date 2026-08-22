# Documentation Structure

Professional organization of documentation across multiple subdirectories for clarity and maintainability.

## Essential Root Documentation

Start here for core project information:
- [`../README.md`](../README.md) — Project overview & feature list
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — Contributor guidelines & workflow
- [`../CHANGELOG.md`](../CHANGELOG.md) — Version history & release notes
- [`../SECURITY.md`](../SECURITY.md) — Security policies & reporting
- [`../CLAUDE.md`](../CLAUDE.md) — Agent-specific instructions & constraints
- [`./reference/STATUS.md`](./reference/STATUS.md) — Project status & milestones

## Documentation by Category

### 📐 Architecture [`architecture/`](./architecture/)

System design, orchestration, and implementation details:
- `ARCHITECTURE.md` — Core system design and principles
- `ORCHESTRATION_SETUP.md` — Agent orchestration configuration
- `BENCHMARK_SUITE_README.md` — Performance validation framework
- `SYNCPULSE_*.md` — SyncPulse implementation details

### 📖 Guides [`guides/`](./guides/)

Setup instructions, development guides, and troubleshooting:
- `QUICKSTART.md` — 5-minute setup guide
- `SKILLS_GUIDE.md` — Step-by-step skill development
- `NPM_PUBLISHING.md` — Package publication workflow
- `TROUBLESHOOTING.md` — Common issues & solutions

### 📝 Root Guides (Core Documentation)

Foundation documentation remaining in root:
- `SKILLS_GUIDE.md` — Comprehensive skill development guide
- `API_REFERENCE.md` — Complete API documentation
- `ARCHITECTURE.md` — High-level system architecture
- `EXAMPLES.md` — Usage examples & patterns
- `SCALING_GUIDE.md` — Performance optimization

### 🏷️ Releases [`releases/`](./releases/)

Release notes, version management, and publication:
- `RELEASE_NOTES_v*.md` — Version-specific release documentation
- `NPM_PUBLICATION_CHECKLIST.md` — Pre-publish validation steps
- `RELEASE_COMMUNICATION.md` — Announcement templates

### 📊 Analysis [`analysis/`](./analysis/)

Performance reports, benchmarks, and security audits:
- `syncpulse-performance-analysis.md` — Performance metrics
- Security audit reports and validation results
- Benchmark analysis and optimization studies

### 📦 Archive [`archive/`](./archive/)

Historical documentation and session artifacts:
- `session-artifacts/` — Previous session notes and learnings
- `project-seed/` — Project initialization templates
- Deprecated documentation maintained for reference

---

## Where to Find What

| Looking For... | Location |
|---|---|
| How to get started quickly | Root `README.md` or `docs/getting-started/QUICKSTART.md` |
| How to build a new skill | `docs/SKILLS_GUIDE.md` |
| API documentation | `docs/API_REFERENCE.md` |
| Release procedures | `docs/releases/NPM_PUBLICATION_CHECKLIST.md` |
| System architecture | `docs/ARCHITECTURE.md` |
| Performance optimization | `docs/SCALING_GUIDE.md` |
| Contribution rules | Root `CONTRIBUTING.md` |
| Security policies | Root `SECURITY.md` |

---

## Adding New Documentation

When creating new documentation, use these guidelines:

### Files Staying in Root (`docs/` root level)
- **Foundational guides**: SKILLS_GUIDE.md, API_REFERENCE.md, ARCHITECTURE.md
- **Core references**: EXAMPLES.md, SCALING_GUIDE.md
- **User-facing**: ROADMAP.md, getting-started/ guides

*Rationale*: These are high-traffic, foundational documents that developers reference frequently.

### Files Moving to Subdirectories

**`docs/architecture/`** — System design (add here if it's about internal implementation)
- System orchestration details
- Implementation guides
- Design decisions & patterns
- Performance architecture

**`docs/guides/`** — Step-by-step instructions (add here if it's a process or setup)
- Setup instructions
- Configuration guides
- Troubleshooting procedures
- Integration guides

**`docs/releases/`** — Version management (add here if it's about releases or publishing)
- Release notes for specific versions
- Publication checklists
- Deployment procedures
- Version migration guides

**`docs/analysis/`** — Research & reports (add here if it's analysis or data)
- Performance metrics & benchmarks
- Security audit reports
- Validation results
- Research findings

**`docs/archive/`** — Historical content (move here when documents become outdated)
- Previous session notes
- Deprecated implementation guides
- Historical release notes (>2 versions old)
- Project seed/template archives

---

## Maintaining Documentation Links

When documentation files are moved between directories:

1. Update all internal references in the moved file to reflect new location
2. Search for external references using: `grep -r "old-file-name" .`
3. Update references in `CONTRIBUTING.md`, root README, and related guides
4. Verify all links are valid: relative paths should be `../` or `../../` depending on depth
5. Test locally: click through all markdown links to confirm they resolve

---

## Questions or Suggestions?

- See [`../CONTRIBUTING.md`](../CONTRIBUTING.md) for contribution guidelines
- Check [`../CLAUDE.md`](../CLAUDE.md) for agent-specific documentation context
- Open an issue on GitHub for feedback on documentation organization
