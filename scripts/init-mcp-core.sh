#!/bin/bash

###############################################################################
# Fused Gaming MCP Core Initialization Script
# Initializes the MCP core instance and sets up proper gitignore files
###############################################################################

set -euo pipefail

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly NC='\033[0m' # No Color

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
readonly REGISTRY_DIR="${PROJECT_ROOT}/registry"
readonly CONFIG_DIR="${PROJECT_ROOT}/.mcp"
readonly MCP_CACHE_DIR="${CONFIG_DIR}/cache"
readonly MCP_STATE_DIR="${CONFIG_DIR}/state"

###############################################################################
# Helper Functions
###############################################################################

log_info() {
  echo -e "${BLUE}ℹ ${NC}$*"
}

log_success() {
  echo -e "${GREEN}✅ ${NC}$*"
}

log_warning() {
  echo -e "${YELLOW}⚠️  ${NC}$*"
}

log_error() {
  echo -e "${RED}❌ ${NC}$*"
}

log_section() {
  echo -e "\n${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${PURPLE}$*${NC}"
  echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

###############################################################################
# Initialization Functions
###############################################################################

init_directories() {
  log_section "Initializing Directories"

  local dirs=(
    "${CONFIG_DIR}"
    "${MCP_CACHE_DIR}"
    "${MCP_STATE_DIR}"
    "${REGISTRY_DIR}"
  )

  for dir in "${dirs[@]}"; do
    if [[ ! -d "$dir" ]]; then
      mkdir -p "$dir"
      log_success "Created directory: $dir"
    else
      log_info "Directory already exists: $dir"
    fi
  done
}

setup_gitignores() {
  log_section "Setting Up .gitignore Files"

  # Root .gitignore additions
  local root_gitignore="${PROJECT_ROOT}/.gitignore"

  # Ensure MCP-specific entries are in root .gitignore
  local mcp_ignore_entries=(
    "# MCP Core Runtime & Cache"
    ".mcp/cache/**"
    ".mcp/logs/**"
    ".mcp/state/**"
    "*.mcp-state"
    ""
    "# MCP Tool Registry"
    "registry/*.tmp"
    "registry/*.log"
  )

  log_info "Checking root .gitignore..."
  for entry in "${mcp_ignore_entries[@]}"; do
    if [[ -n "$entry" ]]; then
      if ! grep -Fxq "$entry" "$root_gitignore" 2>/dev/null; then
        echo "$entry" >> "$root_gitignore"
        log_success "Added to .gitignore: $entry"
      fi
    fi
  done

  # Create .gitkeep files in important directories
  touch "${MCP_CACHE_DIR}/.gitkeep"
  touch "${MCP_STATE_DIR}/.gitkeep"
  log_success "Created .gitkeep files in MCP directories"
}

create_mcp_config() {
  log_section "Creating MCP Configuration"

  local config_file="${CONFIG_DIR}/config.json"

  if [[ ! -f "$config_file" ]]; then
    cat > "$config_file" << 'EOF'
{
  "version": "1.0.0",
  "server": {
    "name": "Fused Gaming MCP",
    "description": "Modular MCP server with scalable Claude skills",
    "version": "1.0.4",
    "environment": "development",
    "debug": false
  },
  "skills": {
    "enabled": [],
    "disabled": [],
    "auto_discover": true
  },
  "registry": {
    "auto_generate": true,
    "path": "./registry"
  },
  "logging": {
    "level": "info",
    "format": "json",
    "file": ".mcp/logs/mcp.log",
    "max_size": "10MB",
    "max_files": 5
  },
  "performance": {
    "cache_enabled": true,
    "cache_ttl": 3600,
    "max_workers": 4
  }
}
EOF
    log_success "Created MCP config: $config_file"
  else
    log_info "MCP config already exists: $config_file"
  fi
}

generate_skill_registry() {
  log_section "Generating Skill Registry"

  cd "$PROJECT_ROOT"

  if command -v node &> /dev/null; then
    if [[ -f "${SCRIPT_DIR}/generate-skill-registry.js" ]]; then
      log_info "Running skill registry generator..."
      node "${SCRIPT_DIR}/generate-skill-registry.js"
      log_success "Skill registry generated successfully"
    else
      log_warning "Registry generator script not found"
    fi
  else
    log_warning "Node.js not found, skipping registry generation"
  fi
}

create_initialization_state() {
  log_section "Creating Initialization State"

  local state_file="${MCP_STATE_DIR}/init.state"

  cat > "$state_file" << EOF
{
  "initialized_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "initialized_by": "${USER:-unknown}",
  "node_version": "$(node -v 2>/dev/null || echo 'unknown')",
  "npm_version": "$(npm -v 2>/dev/null || echo 'unknown')",
  "project_root": "${PROJECT_ROOT}",
  "config_version": "1.0.0"
}
EOF
  log_success "Created initialization state: $state_file"
}

create_readme_mcp() {
  log_section "Creating MCP Documentation"

  local mcp_readme="${CONFIG_DIR}/README.md"

  cat > "$mcp_readme" << 'EOF'
# MCP Core Configuration

This directory contains the Fused Gaming MCP core initialization and runtime configuration.

## Structure

- **config.json** - Main MCP configuration file
- **cache/** - Runtime cache (git-ignored)
- **logs/** - Log files (git-ignored)
- **state/** - Initialization and state files

## Configuration

Edit `config.json` to customize:
- Enabled/disabled skills
- Logging levels
- Performance settings
- Registry paths

## Runtime

Generated files and caches are automatically git-ignored.

See the main README.md for usage instructions.
EOF

  log_success "Created MCP documentation: $mcp_readme"
}

validate_installation() {
  log_section "Validating Installation"

  local errors=0

  # Check directories
  local required_dirs=("${CONFIG_DIR}" "${REGISTRY_DIR}")
  for dir in "${required_dirs[@]}"; do
    if [[ ! -d "$dir" ]]; then
      log_error "Missing directory: $dir"
      ((errors++))
    else
      log_success "Directory exists: $dir"
    fi
  done

  # Check key files
  local required_files=("${CONFIG_DIR}/config.json" "${CONFIG_DIR}/README.md")
  for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
      log_error "Missing file: $file"
      ((errors++))
    else
      log_success "File exists: $file"
    fi
  done

  # Check registry files
  if ls "${REGISTRY_DIR}"/skills.* &> /dev/null; then
    log_success "Skill registry files exist"
  else
    log_warning "Skill registry files not yet generated"
  fi

  if [[ $errors -eq 0 ]]; then
    log_success "Installation validation passed!"
    return 0
  else
    log_error "Installation validation failed with $errors error(s)"
    return 1
  fi
}

###############################################################################
# Main Execution
###############################################################################

main() {
  echo -e "\n${PURPLE}"
  echo "╔═══════════════════════════════════════════════════════════════╗"
  echo "║   🎮 Fused Gaming MCP Core Initialization                    ║"
  echo "║                                                               ║"
  echo "║   Initializing the Fused Gaming MCP core framework...        ║"
  echo "╚═══════════════════════════════════════════════════════════════╝"
  echo -e "${NC}\n"

  log_info "Project root: ${PROJECT_ROOT}"
  log_info "Configuration directory: ${CONFIG_DIR}\n"

  # Run initialization steps
  init_directories
  setup_gitignores
  create_mcp_config
  create_readme_mcp
  create_initialization_state
  generate_skill_registry

  # Validate
  if validate_installation; then
    log_section "✨ Initialization Complete!"
    echo -e "${GREEN}MCP core has been successfully initialized!${NC}\n"
    echo -e "Next steps:"
    echo -e "  1. Review configuration: ${BLUE}cat ${CONFIG_DIR}/config.json${NC}"
    echo -e "  2. View skill registry: ${BLUE}cat ${REGISTRY_DIR}/REGISTRY.md${NC}"
    echo -e "  3. Start development: ${BLUE}npm run dev${NC}"
    echo -e "\nFor more information, see: ${BLUE}${CONFIG_DIR}/README.md${NC}\n"
  else
    log_error "Initialization completed with validation errors"
    exit 1
  fi
}

# Run main function
main "$@"
