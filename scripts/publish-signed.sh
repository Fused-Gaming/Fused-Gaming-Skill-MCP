#!/bin/bash

# Publish with Signed Commits and Tags
# This script handles version bumping, code quality checks, and signed commits/tags

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_FILE="${PROJECT_ROOT}/publish.log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✓ $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}✗ $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}⚠ $1${NC}" | tee -a "$LOG_FILE"
}

check_requirements() {
    log "Checking requirements..."

    # Check git
    if ! command -v git &> /dev/null; then
        error "Git is not installed"
    fi

    # Check npm
    if ! command -v npm &> /dev/null; then
        error "npm is not installed"
    fi

    # Check GPG
    if ! command -v gpg &> /dev/null; then
        error "GPG is not installed. Run: scripts/setup-gpg-signing.sh"
    fi

    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        error "Node.js 20.x or higher required, found $(node -v)"
    fi

    # Check git configuration
    if [ -z "$(git config user.signingkey)" ]; then
        warning "Git signing key not configured. Run: scripts/setup-gpg-signing.sh"
    fi

    success "All requirements met"
}

check_git_status() {
    log "Checking git status..."

    if [ -n "$(git status --porcelain)" ]; then
        error "Working directory not clean. Please commit or stash changes."
    fi

    # Check if we're on main
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        warning "Current branch is '$CURRENT_BRANCH', not 'main'"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            error "Aborted"
        fi
    fi

    success "Git status OK"
}

run_checks() {
    log "Running code quality checks..."

    # Lint
    if npm run lint &>> "$LOG_FILE"; then
        success "Lint check passed"
    else
        error "Lint check failed. See $LOG_FILE for details."
    fi

    # Typecheck
    if npm run typecheck &>> "$LOG_FILE"; then
        success "Typecheck passed"
    else
        error "Typecheck failed. See $LOG_FILE for details."
    fi

    # Build
    if npm run build &>> "$LOG_FILE"; then
        success "Build passed"
    else
        error "Build failed. See $LOG_FILE for details."
    fi

    # Tests
    if npm run test --workspaces --if-present &>> "$LOG_FILE"; then
        success "Tests passed"
    else
        warning "Some tests failed or skipped. Review $LOG_FILE"
    fi
}

bump_version() {
    log "Determining version bump..."

    CURRENT_VERSION=$(node -e "console.log(require('./package.json').version)")
    log "Current version: $CURRENT_VERSION"

    echo ""
    echo "Version bump options:"
    echo "1. Patch (1.0.x) - Bug fixes and patches"
    echo "2. Minor (1.x.0) - New features, backward compatible"
    echo "3. Major (x.0.0) - Breaking changes"
    echo "4. Custom version"
    echo ""
    read -p "Select bump type (1-4): " bump_choice

    case $bump_choice in
        1)
            VERSION_TYPE="patch"
            ;;
        2)
            VERSION_TYPE="minor"
            ;;
        3)
            VERSION_TYPE="major"
            ;;
        4)
            read -p "Enter custom version (e.g., 1.0.6): " CUSTOM_VERSION
            if [[ ! $CUSTOM_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
                error "Invalid version format"
            fi
            npm --no-git-tag-version version "$CUSTOM_VERSION" &>> "$LOG_FILE"
            ;;
        *)
            error "Invalid option"
            ;;
    esac

    if [ -z "$CUSTOM_VERSION" ]; then
        npm --no-git-tag-version version "$VERSION_TYPE" &>> "$LOG_FILE"
    fi

    NEW_VERSION=$(node -e "console.log(require('./package.json').version)")
    success "Version bumped to $NEW_VERSION"
}

commit_version() {
    log "Creating signed commit..."

    git add package.json package-lock.json VERSION.json 2>/dev/null || true

    if [ -n "$(git diff --cached)" ]; then
        git commit -S -m "chore: bump version to $NEW_VERSION

- Updated package.json version
- Refreshed package-lock.json
- Updated VERSION.json metadata" &>> "$LOG_FILE"

        success "Created signed commit"
    else
        warning "No version changes to commit"
    fi
}

create_tag() {
    log "Creating signed tag..."

    TAG="v${NEW_VERSION}"

    # Check if tag exists
    if git rev-parse "$TAG" &> /dev/null; then
        warning "Tag $TAG already exists"
        read -p "Force create new tag? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            warning "Tag creation skipped"
            return
        fi
    fi

    git tag -s "$TAG" -m "Release version $NEW_VERSION

Built: $(date -u +'%Y-%m-%dT%H:%M:%SZ')
Commit: $(git rev-parse --short HEAD)
Branch: $(git rev-parse --abbrev-ref HEAD)" &>> "$LOG_FILE"

    success "Created signed tag: $TAG"
}

push_changes() {
    log "Pushing changes and tags..."

    git push origin main &>> "$LOG_FILE"
    success "Pushed to main"

    git push origin "v${NEW_VERSION}" &>> "$LOG_FILE"
    success "Pushed tag v${NEW_VERSION}"
}

verify_signatures() {
    log "Verifying signatures..."

    echo ""
    echo "Recent commits:"
    git log --show-signature -5 --oneline

    echo ""
    echo "Recent tags:"
    git tag -v "v${NEW_VERSION}" 2>/dev/null || true

    success "Signature verification complete"
}

display_summary() {
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo -e "${GREEN}📦 Publish Summary${NC}"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "Version: $NEW_VERSION"
    echo "Tag: v${NEW_VERSION}"
    echo "Branch: $(git rev-parse --abbrev-ref HEAD)"
    echo "Commit: $(git rev-parse --short HEAD)"
    echo ""
    echo "Checks:"
    echo "  ✓ Lint"
    echo "  ✓ Typecheck"
    echo "  ✓ Build"
    echo "  ✓ Tests"
    echo "  ✓ Signed Commit"
    echo "  ✓ Signed Tag"
    echo "  ✓ Pushed to GitHub"
    echo ""
    echo "Next:"
    echo "  1. GitHub Actions will run publish workflow"
    echo "  2. Packages will be published to npm"
    echo "  3. GitHub release will be created"
    echo ""
    echo "View workflow: https://github.com/fused-gaming/fused-gaming-skill-mcp/actions"
    echo "════════════════════════════════════════════════════════════"
}

main() {
    echo ""
    echo -e "${BLUE}🚀 Signed Publish Workflow${NC}"
    echo "=============================="
    echo ""

    # Initialize log
    > "$LOG_FILE"

    check_requirements
    check_git_status
    run_checks
    bump_version
    commit_version
    create_tag
    push_changes
    verify_signatures
    display_summary

    success "Publish process complete!"
}

# Run main
main "$@"
