# Version Tags & Branch Tracking

## Current Version: v1.1.2 (Stable)

All feature branches are tagged with pre-release versions for v1.2.0 release.

## Tagged Feature Branches (v1.2.0 Pre-Release)

### v1.2.0-design.1
- **Branch**: `claude/design-system-orchestration-kLw4W`
- **Commit**: `6787532`
- **Description**: Design System Orchestration Phase 1 & 2 Implementation
- **Changes**: 
  - Complete design tools and license system integration
  - Design system orchestration infrastructure
- **Status**: In Development
- **Target Release**: v1.2.0 (June 2026)

### v1.2.0-limj.1
- **Branch**: `claude/implement-limj-package-6WZpc`
- **Commit**: `d9e7d22`
- **Description**: LIMJ Package Implementation and Ecosystem Infrastructure
- **Changes**:
  - Consolidate ecosystem infrastructure changes from main into development
  - LIMJ package implementation
  - Cross-ecosystem integration patterns
- **Status**: In Development
- **Target Release**: v1.2.0 (June 2026)

### v1.2.0-swarm.1
- **Branch**: `claude/setup-swarm-session-98Rwz`
- **Commit**: `b4f17ee`
- **Description**: Swarm Session Initialization and Startup Integration
- **Changes**:
  - Auto-initialize swarm on session startup
  - Rename RuFlo to syncpulse throughout codebase
  - Add comprehensive skills checklist documentation
  - Integrate swarm hooks into session startup
- **Status**: In Development (Active)
- **Target Release**: v1.2.0 (June 2026)

## Release Timeline

- **v1.2.0** (June 2026): Release all tagged features
- **v1.3.0** (July 2026): Wave 1 implementation (15 planned skills)
- **v1.4.0** (August 2026): Wave 2 implementation (15 planned skills)
- **v2.0.0** (September 2026): Complete backlog + major features

## Tag Management Commands

```bash
# List all version tags
git tag -l "v1.2.0-*" -n2

# Show specific tag details
git show v1.2.0-swarm.1

# Tag current branch
git tag -a "vX.Y.Z-feature.N" -m "Description"

# Push tags to remote
git push origin vX.Y.Z-feature.N
```

## Notes

- All v1.2.0 pre-release tags are for features targeted in the June 2026 release
- Tag format: `vMAJOR.MINOR.PATCH-feature.increment`
- Each feature branch receives a unique pre-release identifier
- See `docs/ROADMAP.md` for full release planning
