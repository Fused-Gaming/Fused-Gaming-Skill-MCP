# 🔐 Smart Contract Tools Skill

**Status**: 📋 Scaffolding (v1.0.0)

Smart contract development tools for Hardhat, Truffle, and Foundry ecosystems.

## Overview

This skill provides tools for:
- ✅ Smart contract compilation
- ✅ Test suite generation
- ✅ Security analysis (Slither)
- ✅ Gas optimization
- ✅ Deployment automation

## Installation

```bash
npm install @h4shed/skill-smart-contract-tools
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Tests
npm run test
```

## Usage

[Integration documentation coming soon]

## Security Considerations

- **CRITICAL**: Never use mainnet by default
- Require explicit network selection
- Implement multi-sig approvals for deployments
- Run Slither security analysis
- Maintain complete deployment audit trail
- Validate contract code before compilation
- Use testnet for all non-production work
- Monitor for reentrancy patterns
- Check access control mechanisms

## License

Apache 2.0
