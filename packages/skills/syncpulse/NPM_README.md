# SyncPulse Skill for Fused Gaming MCP

[![npm version](https://img.shields.io/npm/v/@h4shed/skill-syncpulse.svg)](https://www.npmjs.com/package/@h4shed/skill-syncpulse)
[![npm downloads](https://img.shields.io/npm/dm/@h4shed/skill-syncpulse.svg)](https://www.npmjs.com/package/@h4shed/skill-syncpulse)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/fused-gaming/fused-gaming-skill-mcp/blob/main/LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.3%2B-blue)](https://www.typescriptlang.org/)

> **Production-ready multi-agent coordination, project state caching, and secure email automation with 9 templated workflows**

SyncPulse powers intelligent project synchronization across distributed teams while enabling sophisticated email automation for authentication, business operations, and incident management.

## ✨ Features

### 🔄 Multi-Agent Coordination
- **Swarm Orchestration** — Hierarchical, mesh, adaptive, ring, and star topologies
- **Dynamic Task Routing** — Intelligent agent assignment based on load and capacity
- **Distributed Execution** — Run tasks across multiple agents with result tracking
- **Fault Tolerance** — Automatic failover and health monitoring
- **Real-Time Metrics** — Monitor swarm health, throughput, and performance

### 💾 Project State Caching
- **Hybrid Memory Backend** — Disk and in-memory caching with automatic cleanup
- **Vector Search** — Fast similarity-based cache queries for intelligent retrieval
- **TTL Support** — Configurable expiration and automatic cache invalidation
- **Git Integration** — Optional project state synchronization with version control
- **Performance Tracking** — Hit rates, miss rates, and latency metrics

### 📧 Secure Email Automation (9 Templated Workflows)

#### Authentication & Security
- **Magic Link Login** — Passwordless email-based authentication
- **MFA Verification** — Multi-factor authentication via email code
- **Password Reset** — Secure account recovery workflow
- **Security Alert** — Suspicious activity notifications

#### Business Operations
- **Invoice** — Professional billing email delivery
- **Newsletter** — Bulk subscription-based marketing

#### System Operations
- **Outage Notice** — Service incident notifications
- **Maintenance Notice** — Scheduled downtime announcements
- **Ticket Update** — Support ticket status notifications

**All templates feature:**
- ✅ Professional HTML and plain text versions
- ✅ Variable interpolation for dynamic content
- ✅ Mobile-responsive design
- ✅ Security best practices (no hardcoded secrets)
- ✅ Customizable branding (company name, logos, colors)

### 📊 Analytics & Monitoring
- **Real-Time Metrics** — Monitor swarm health and cache performance
- **Agent Analytics** — Per-agent success rates and efficiency
- **Performance Analysis** — Throughput and latency tracking
- **Message ID Tracking** — Audit trails for email delivery

## 🚀 Quick Start

### Installation

```bash
npm install @h4shed/skill-syncpulse
```

### Basic Usage

```typescript
import { createSyncPulseSkill } from '@h4shed/skill-syncpulse';

// Initialize the skill
const skill = createSyncPulseSkill();

// Access services
const { swarm, memory, tasks, cache, email } = skill.services;

// Use tools through MCP
const result = await skill.tools
  .find(t => t.name === 'send_magic_link_login')
  ?.handler({
    email: 'user@example.com',
    name: 'John Doe',
    magicLink: 'https://app.example.com/auth/magic/token123'
  });
```

### Environment Setup

```bash
# Create .env.local
cp .env.example .env.local

# Edit with your SMTP configuration
MAIL_HOST=smtp.vln.gg
MAIL_PORT=587
MAIL_USER=test@mail.vln.gg
MAIL_PASS=your-app-password
MAIL_FROM=noreply@vln.gg
```

## 📚 Documentation

- **[README.md](./README.md)** — Complete feature overview
- **[SECURE_EMAIL_SETUP.md](./SECURE_EMAIL_SETUP.md)** — Security configuration and best practices
- **[AGENT_INTEGRATION.md](./AGENT_INTEGRATION.md)** — Claude agent integration patterns
- **[EMAIL_WORKFLOWS.md](./EMAIL_WORKFLOWS.md)** — Complete workflow reference (9 workflows with examples)

## 🎯 Use Cases

### User Authentication
```typescript
// Send magic link for passwordless signup
await skill.tools.find(t => t.name === 'send_magic_link_login')?.handler({
  email: newUser.email,
  name: newUser.fullName,
  magicLink: `${appUrl}/auth/magic/${token}`,
  expiryMinutes: '30'
});
```

### Multi-Factor Authentication
```typescript
// Send MFA code for account security
await skill.tools.find(t => t.name === 'send_mfa_code')?.handler({
  email: user.email,
  mfaCode: '482957',
  expiryMinutes: '10'
});
```

### Security Incident Notification
```typescript
// Alert users of suspicious activity
await skill.tools.find(t => t.name === 'send_security_alert')?.handler({
  email: user.email,
  alertType: 'Unusual login attempt',
  location: 'Singapore',
  timestamp: new Date().toISOString()
});
```

### Bulk Marketing Campaign
```typescript
// Send newsletter to subscribers
await skill.tools.find(t => t.name === 'send_newsletter')?.handler({
  recipients: subscribers.map(s => ({
    email: s.email,
    name: s.firstName
  })),
  title: 'April Newsletter - Product Updates',
  contentHtml: '<h2>What\'s New</h2>...',
  unsubscribeLink: 'https://app.example.com/unsubscribe'
});
```

### Service Outage Response
```typescript
// Notify team and customers of outage
await skill.tools.find(t => t.name === 'send_outage_notice')?.handler({
  recipientEmails: ['team@example.com', ...customerEmails],
  service: 'API Service',
  status: 'Investigating',
  startTime: new Date().toISOString(),
  estimatedResolution: '2 hours from now'
});
```

## 🔐 Security

SyncPulse prioritizes security:

- **Environment-Based Secrets** — No hardcoded credentials
- **TLS/SSL SMTP** — Encrypted email transmission
- **Link Expiration** — All auth links expire (30 min to 24 hours)
- **Rate Limiting** — Built-in support for abuse prevention
- **Credential Masking** — Passwords never logged or exposed
- **Audit Trails** — Message IDs for email tracking and compliance

See [SECURE_EMAIL_SETUP.md](./SECURE_EMAIL_SETUP.md) for detailed security guidelines.

## 🤖 Claude Agent Integration

SyncPulse is fully compatible with Claude agents and multi-agent orchestration:

```typescript
// Use in Claude API messages
const response = await client.messages.create({
  model: 'claude-opus-4-7',
  tools: skill.tools.map(t => ({
    name: t.name,
    description: t.description,
    input_schema: t.inputSchema
  })),
  messages: [{ role: 'user', content: '...' }]
});

// Coordinate multi-agent workflows
const result = await skill.tools
  .find(t => t.name === 'coordinate_agents')
  ?.handler({
    workflowId: 'auth-flow-1',
    topology: 'hierarchical',
    tasks: [
      { id: 'task-1', name: 'Send Magic Link', priority: 10 },
      { id: 'task-2', name: 'Log Audit Trail', priority: 5 }
    ]
  });
```

See [AGENT_INTEGRATION.md](./AGENT_INTEGRATION.md) for complete integration guide.

## 📊 API Overview

### Core Tools (14 Total)

**Coordination & Caching:**
- `synchronize_project_state` — Cache project state across agents
- `query_cache` — Vector-based cache search
- `coordinate_agents` — Multi-agent task orchestration
- `analyze_performance` — Performance metrics and analytics

**Email Tools (5 generic + 9 workflows = 14 total):**
- `send_email` — Send individual emails with variables
- `send_bulk_email` — Batch send to multiple recipients
- `send_marketing_campaign` — Campaign-aware email with tracking
- `verify_email_configuration` — Test SMTP connection
- `send_magic_link_login` — Magic link authentication
- `send_mfa_code` — MFA verification codes
- `send_password_reset` — Password recovery
- `send_security_alert` — Security event notifications
- `send_invoice` — Professional billing emails
- `send_newsletter` — Bulk newsletters
- `send_outage_notice` — Service incident notifications
- `send_maintenance_notice` — Maintenance announcements
- `send_ticket_update` — Support ticket updates

All tools have full TypeScript types and MCP schemas.

## 🧪 Testing

Run tests with:

```bash
npm test --workspace=@h4shed/skill-syncpulse
```

Build and verify types:

```bash
npm run build --workspace=@h4shed/skill-syncpulse
npm run typecheck
```

## 📈 Performance

- **Cache Hit Rate:** 70-90% typical
- **Task Latency:** <100ms for simple tasks
- **Agent Utilization:** Dynamic based on load
- **Email Throughput:** 10-100 emails/second (configurable rate limiting)
- **Memory:** Hybrid disk/in-memory with auto-cleanup

## 🚀 Production Deployment

### Prerequisites
- Node.js >=20.0.0
- npm >=8.0.0
- SMTP server credentials

### Environment Variables
```bash
MAIL_HOST=smtp.vln.gg
MAIL_PORT=587
MAIL_USER=test@mail.vln.gg
MAIL_PASS=your-password
MAIL_FROM=noreply@vln.gg
```

### Deployment Checklist
- [ ] Configure SMTP in environment
- [ ] Run `verify_email_configuration` to test connection
- [ ] Test each workflow type in staging
- [ ] Implement rate limiting for bulk sends
- [ ] Set up error alerting and monitoring
- [ ] Verify email deliverability (check spam filters)
- [ ] Configure SPF/DKIM/DMARC for your domain
- [ ] Test all unsubscribe links
- [ ] Document your customizations

## 🤝 Contributing

Contributions welcome! Please:

1. Read [CONTRIBUTING.md](../../CONTRIBUTING.md)
2. Fork the repository
3. Create a feature branch
4. Submit a pull request

## 📞 Support

- 📖 [Full Documentation](./README.md)
- 🔐 [Security Guide](./SECURE_EMAIL_SETUP.md)
- 🤖 [Agent Integration](./AGENT_INTEGRATION.md)
- 📧 [Email Workflows](./EMAIL_WORKFLOWS.md)
- 🐛 [Issues](https://github.com/fused-gaming/fused-gaming-skill-mcp/issues)

## 📄 License

Apache License 2.0 — See [LICENSE](../../LICENSE) for details.

## 🎉 What's Next?

SyncPulse continues to evolve:

- **Email Template Library** — Reusable template management
- **Delivery Analytics** — Open/click tracking and reporting
- **Advanced Scheduling** — Timezone-aware send optimization
- **Compliance Tools** — GDPR/CCPA/CAN-SPAM helpers
- **AI-Powered Personalization** — Content generation for templates

---

**Built with ❤️ by [Fused Gaming](https://github.com/fused-gaming) for the AI community**

[![npm package](https://img.shields.io/npm/v/@h4shed/skill-syncpulse?style=flat-square)](https://www.npmjs.com/package/@h4shed/skill-syncpulse)
[![GitHub](https://img.shields.io/badge/github-fused--gaming-brightgreen?style=flat-square)](https://github.com/fused-gaming/fused-gaming-skill-mcp)
[![TypeScript](https://img.shields.io/badge/typescript-5.3%2B-blue?style=flat-square)](https://www.typescriptlang.org/)
