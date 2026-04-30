# SyncPulse Email Tools - Agent Integration Guide

This guide explains how to integrate and use SyncPulse email tools within Claude agents and multi-agent orchestration systems.

## 🤖 Agent Tool Definitions

SyncPulse exposes 5 email-related tools through the MCP protocol:

### 1. `send_email` - Send Single Email

**Purpose:** Send individual emails with template variable support.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "recipients": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "email": { "type": "string" },
          "name": { "type": "string" }
        },
        "required": ["email"]
      }
    },
    "subject": { "type": "string" },
    "htmlBody": { "type": "string" },
    "textBody": { "type": "string" },
    "variables": { "type": "object" }
  },
  "required": ["recipients", "subject", "htmlBody"]
}
```

**Example Request:**
```json
{
  "recipients": [
    { "email": "user@example.com", "name": "John Doe" }
  ],
  "subject": "Welcome {{firstName}}!",
  "htmlBody": "<h1>Hello {{firstName}}</h1><p>Welcome aboard!</p>",
  "variables": {
    "firstName": "John"
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "messageId": "CADc-_xYvMc7...",
  "recipientCount": 1,
  "timestamp": "2024-04-30T12:34:56.789Z"
}
```

---

### 2. `send_bulk_email` - Send Bulk Campaign

**Purpose:** Send emails to multiple recipients with per-recipient customization.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "recipients": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "email": { "type": "string" },
          "name": { "type": "string" },
          "variables": { "type": "object" }
        },
        "required": ["email"]
      }
    },
    "subject": { "type": "string" },
    "htmlBody": { "type": "string" },
    "textBody": { "type": "string" },
    "globalVariables": { "type": "object" }
  },
  "required": ["recipients", "subject", "htmlBody"]
}
```

**Example Request:**
```json
{
  "recipients": [
    {
      "email": "gold@example.com",
      "name": "Gold Member",
      "variables": { "tier": "Gold" }
    },
    {
      "email": "silver@example.com",
      "name": "Silver Member",
      "variables": { "tier": "Silver" }
    }
  ],
  "subject": "{{tier}} Member Exclusive Offer!",
  "htmlBody": "<h1>Hello {{name}}</h1><p>As a {{tier}} member, enjoy {{discount}}% off</p>",
  "globalVariables": {
    "discount": "25"
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "summary": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "timestamp": "2024-04-30T12:34:56.789Z"
}
```

---

### 3. `send_marketing_campaign` - Send Marketing Campaign

**Purpose:** Send marketing emails with optional open tracking for analytics.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "campaignName": { "type": "string" },
    "recipients": { "type": "array" },
    "subject": { "type": "string" },
    "htmlBody": { "type": "string" },
    "textBody": { "type": "string" },
    "trackingPixel": { "type": "boolean" }
  },
  "required": ["campaignName", "recipients", "subject", "htmlBody"]
}
```

**Example Request:**
```json
{
  "campaignName": "Q2-Product-Launch-2024",
  "recipients": [
    { "email": "user1@example.com", "name": "User 1" },
    { "email": "user2@example.com", "name": "User 2" }
  ],
  "subject": "🚀 Introducing Our New Product",
  "htmlBody": "<h1>New Product Launch</h1><p>Exciting features await...</p>",
  "trackingPixel": true
}
```

**Example Response:**
```json
{
  "success": true,
  "campaign": {
    "name": "Q2-Product-Launch-2024",
    "total": 2,
    "successful": 2,
    "failed": 0,
    "trackingEnabled": true
  },
  "timestamp": "2024-04-30T12:34:56.789Z"
}
```

---

### 4. `verify_email_configuration` - Check Email Setup

**Purpose:** Verify email service is properly configured and connected.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {}
}
```

**Example Response:**
```json
{
  "configured": true,
  "connected": true,
  "config": {
    "host": "smtp.vln.gg",
    "port": 587,
    "secure": false,
    "from": "noreply@vln.gg",
    "user": "tes***"
  },
  "status": "ready",
  "message": "Email service is ready to send messages",
  "timestamp": "2024-04-30T12:34:56.789Z"
}
```

---

## 🤝 Integration Patterns

### Pattern 1: Email Verification in Workflow

Before sending bulk emails, verify configuration:

```typescript
// Check email service readiness
const configStatus = await agent.useTool('verify_email_configuration', {});

if (configStatus.status !== 'ready') {
  agent.log('Email service not ready:', configStatus.message);
  return { success: false, error: configStatus.message };
}

// Proceed with sending
const result = await agent.useTool('send_bulk_email', { ... });
```

### Pattern 2: Marketing Campaign Workflow

Multi-agent orchestration for marketing:

```typescript
// Agent 1: Prepare recipient list
const recipients = await agent.useTool('query_cache', {
  query: 'marketing list Q2 2024'
});

// Agent 2: Verify configuration
const config = await agent.useTool('verify_email_configuration', {});

// Agent 3: Send campaign
if (config.connected) {
  const campaign = await agent.useTool('send_marketing_campaign', {
    campaignName: 'Q2-Launch-2024',
    recipients: recipients,
    subject: 'New Opportunities',
    htmlBody: template,
    trackingPixel: true
  });
}

// Agent 4: Analyze results
const analysis = await agent.useTool('analyze_performance', {
  timeRange: '24h',
  metrics: ['emailsSent', 'emailsOpened', 'emailsClicked']
});
```

### Pattern 3: Error Recovery

Handle failures gracefully:

```typescript
const result = await agent.useTool('send_bulk_email', {
  recipients: largeList,
  subject: '...',
  htmlBody: '...'
});

if (result.summary.failed > 0) {
  // Log failures
  agent.log(`Failed to send ${result.summary.failed} emails`);

  // Retry failed recipients
  const failedEmails = extractFailedEmails(result.errors);
  
  // Implement exponential backoff
  await sleep(2000);
  
  const retryResult = await agent.useTool('send_bulk_email', {
    recipients: failedEmails,
    subject: '...',
    htmlBody: '...'
  });
}
```

---

## 🔧 Agent Implementation Examples

### Example 1: Claude Agent with SyncPulse Email

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { createSyncPulseSkill } from '@h4shed/skill-syncpulse';

const client = new Anthropic();
const skill = createSyncPulseSkill();

const tools = [
  {
    name: 'send_email',
    description: skill.tools.find(t => t.name === 'send_email')?.description,
    input_schema: skill.tools.find(t => t.name === 'send_email')?.inputSchema
  },
  // ... other email tools
];

const response = await client.messages.create({
  model: 'claude-opus-4-7',
  max_tokens: 4096,
  tools: tools,
  messages: [
    {
      role: 'user',
      content: 'Send a welcome email to john@example.com'
    }
  ]
});

// Process tool calls
for (const block of response.content) {
  if (block.type === 'tool_use') {
    const result = await useTool(block.name, block.input);
    // Send result back to Claude
  }
}
```

### Example 2: Multi-Agent Swarm for Marketing

```typescript
// Coordinator agent
const coordinator = {
  name: 'marketing-coordinator',
  task: async () => {
    // Verify email setup
    const emailReady = await emailAgent.use('verify_email_configuration');
    
    // Get recipients from cache
    const recipients = await cacheAgent.use('query_cache', {
      query: 'marketing_contacts_2024'
    });
    
    // Send campaign through dedicated agent
    return await emailAgent.use('send_marketing_campaign', {
      campaignName: 'Q2-2024',
      recipients: recipients,
      subject: 'New Opportunities',
      htmlBody: await templateAgent.render('campaign-2024'),
      trackingPixel: true
    });
  }
};

// Execute through SyncPulse orchestration
const result = await syncpulse.coordinateAgents({
  workflowId: 'marketing-q2-2024',
  topology: 'hierarchical',
  tasks: [coordinator]
});
```

---

## 📋 Common Use Cases

### Use Case 1: Welcome Email Campaign

```typescript
const newUsers = await database.getNewUsers({ since: '7d' });

await agent.useTool('send_bulk_email', {
  recipients: newUsers.map(u => ({
    email: u.email,
    name: u.firstName,
    variables: { joinDate: u.createdAt }
  })),
  subject: 'Welcome to {{company}}, {{name}}!',
  htmlBody: `
    <h1>Welcome {{name}}!</h1>
    <p>You joined on {{joinDate}}</p>
    <p>Explore our features and connect with the community.</p>
  `
});
```

### Use Case 2: Transactional Email

```typescript
await agent.useTool('send_email', {
  recipients: [{ email: order.customerEmail, name: order.customerName }],
  subject: 'Order #{{orderId}} Confirmed',
  htmlBody: `
    <h2>Thank you for your order!</h2>
    <p>Order ID: {{orderId}}</p>
    <p>Total: ${{total}}</p>
    <p>Estimated Delivery: {{deliveryDate}}</p>
  `,
  variables: {
    orderId: order.id,
    total: order.total,
    deliveryDate: order.estimatedDelivery
  }
});
```

### Use Case 3: Newsletter with Analytics

```typescript
await agent.useTool('send_marketing_campaign', {
  campaignName: 'April-Newsletter-2024',
  recipients: newsletter.subscribers,
  subject: '{{month}} Newsletter - {{year}}',
  htmlBody: newsletterContent,
  trackingPixel: true
});

// Later: analyze opens and clicks
const analytics = await agent.useTool('analyze_performance', {
  timeRange: '7d',
  metrics: ['emailOpens', 'emailClicks', 'emailBounces']
});
```

---

## 🔐 Security Notes for Agents

1. **Never expose credentials** - Always use environment variables
2. **Validate recipients** - Check email format before sending
3. **Rate limiting** - Implement delays for bulk sends
4. **Error handling** - Log failures without logging passwords
5. **Audit trails** - Track who sent what emails and when

---

## 📞 Troubleshooting

### Email Service Not Ready

```typescript
const status = await agent.useTool('verify_email_configuration', {});

if (status.status === 'not_configured') {
  // Set environment variables:
  // MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_FROM
}
```

### Bulk Email Failures

Check response for errors:
```typescript
if (result.errors && result.errors.length > 0) {
  result.errors.forEach(err => {
    console.log(`Failed: ${err.email} - ${err.error}`);
  });
}
```

### Connection Timeout

Verify SMTP server credentials and network:
```typescript
const isConnected = await emailService.verifyConnection();
if (!isConnected) {
  // Check MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS
}
```

---

## 📚 Related Documentation

- [Secure Email Setup](./SECURE_EMAIL_SETUP.md)
- [SyncPulse README](./README.md)
- [nodemailer Docs](https://nodemailer.com/)
