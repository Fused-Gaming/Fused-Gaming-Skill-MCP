# SyncPulse Email Workflows - Templated Email Automation

Production-ready email templates and workflows for common use cases: authentication, security, billing, operations, and support.

## 📋 Overview

SyncPulse now includes **9 pre-built email workflows** with professional HTML/text templates. Each workflow:

- ✅ Has professionally designed HTML and plain text templates
- ✅ Includes template variables for customization
- ✅ Returns structured response data for tracking
- ✅ Integrates seamlessly with agents and MCP
- ✅ Follows security best practices
- ✅ Supports branding customization

## 🔐 Authentication & Security Workflows

### 1. **Magic Link Login** (`send_magic_link_login`)

Passwordless authentication via email link.

**Parameters:**
```typescript
{
  email: "user@example.com",           // Required
  name: "John Doe",                   // Optional
  magicLink: "https://app.com/auth/...",  // Required
  expiryMinutes: "30",                // Optional (default: 30)
  companyName: "Acme Corp",           // Optional (default: "Our")
  supportEmail: "support@example.com", // Optional
  dashboardUrl: "https://app.com"     // Optional
}
```

**Example:**
```typescript
await skill.tools.find(t => t.name === 'send_magic_link_login')?.handler({
  email: 'john@example.com',
  name: 'John Doe',
  magicLink: 'https://app.example.com/auth/magic/abc123xyz',
  expiryMinutes: '30',
  companyName: 'Acme Corp'
});
```

**Response:**
```typescript
{
  success: true,
  messageId: '...',
  email: 'john@example.com',
  type: 'magic_link_login',
  timestamp: '2024-04-30T...'
}
```

---

### 2. **MFA Verification Code** (`send_mfa_code`)

Send multi-factor authentication code.

**Parameters:**
```typescript
{
  email: "user@example.com",           // Required
  name: "Jane Doe",                   // Optional
  mfaCode: "123456",                  // Required
  expiryMinutes: "10",                // Optional (default: 10)
  companyName: "Acme Corp",           // Optional
  supportEmail: "support@example.com", // Optional
  dashboardUrl: "https://app.com"     // Optional
}
```

**Features:**
- Large, easy-to-read code display
- Security warnings if code not requested
- Quick link to security settings
- Automatic expiration notice

**Example:**
```typescript
await skill.tools.find(t => t.name === 'send_mfa_code')?.handler({
  email: 'jane@example.com',
  name: 'Jane Smith',
  mfaCode: '482957',
  expiryMinutes: '10'
});
```

---

### 3. **Password Reset** (`send_password_reset`)

Secure password recovery email.

**Parameters:**
```typescript
{
  email: "user@example.com",           // Required
  name: "Bob Wilson",                 // Optional
  resetLink: "https://app.com/reset/...",  // Required
  expiryHours: "24",                  // Optional (default: 24)
  companyName: "Acme Corp",           // Optional
  supportEmail: "support@example.com", // Optional
  dashboardUrl: "https://app.com"     // Optional
}
```

**Example:**
```typescript
await skill.tools.find(t => t.name === 'send_password_reset')?.handler({
  email: 'bob@example.com',
  name: 'Bob Wilson',
  resetLink: 'https://app.example.com/password-reset/token123',
  expiryHours: '24'
});
```

---

### 4. **Security Alert** (`send_security_alert`)

Notify users of suspicious account activity.

**Parameters:**
```typescript
{
  email: "user@example.com",           // Required
  name: "Alice Brown",                // Optional
  alertType: "Unusual login attempt", // Required - describe the event
  timestamp: "2024-04-30T12:34:56Z", // Optional
  location: "New York, US",           // Optional
  companyName: "Acme Corp",           // Optional
  supportEmail: "support@example.com", // Optional
  dashboardUrl: "https://app.com"     // Optional
}
```

**Alert Types:**
- "Unusual login attempt"
- "Password changed"
- "Email address changed"
- "Payment method added"
- "New device connected"
- "Account locked"

**Example:**
```typescript
await skill.tools.find(t => t.name === 'send_security_alert')?.handler({
  email: 'alice@example.com',
  name: 'Alice Brown',
  alertType: 'Unusual login attempt',
  timestamp: new Date().toISOString(),
  location: 'Singapore'
});
```

---

## 💼 Business Workflows

### 5. **Invoice** (`send_invoice`)

Send billing invoices to customers.

**Parameters:**
```typescript
{
  email: "customer@example.com",       // Required
  name: "Acme Inc",                   // Optional
  invoiceNumber: "INV-2024-001",      // Required
  amount: "$1,234.56",                // Required
  dueDate: "2024-05-30",              // Required
  invoiceLink: "https://app.com/invoices/inv001",  // Required
  companyName: "Acme Corp",           // Optional
  supportEmail: "billing@example.com"  // Optional
}
```

**Features:**
- Clean invoice table layout
- Amount clearly highlighted
- Direct link to full invoice
- Billing support contact

**Example:**
```typescript
await skill.tools.find(t => t.name === 'send_invoice')?.handler({
  email: 'customer@acme.com',
  name: 'Acme Inc',
  invoiceNumber: 'INV-2024-001',
  amount: '$1,234.56',
  dueDate: '2024-05-30',
  invoiceLink: 'https://billing.example.com/invoices/inv001'
});
```

---

### 6. **Newsletter** (`send_newsletter`)

Send bulk newsletters to subscribers.

**Parameters:**
```typescript
{
  recipients: [
    { email: "sub1@example.com", name: "Subscriber 1" },
    { email: "sub2@example.com", name: "Subscriber 2" }
  ],
  title: "April Updates",               // Required
  contentHtml: "<h3>What's New</h3>...", // Required
  unsubscribeLink: "https://...",       // Required
  companyName: "Acme Corp",             // Optional
  dashboardUrl: "https://app.com"       // Optional
}
```

**Features:**
- Per-recipient customization
- Unsubscribe link with legal compliance
- Preferences/settings link
- Bulk send with error tracking

**Example:**
```typescript
await skill.tools.find(t => t.name === 'send_newsletter')?.handler({
  recipients: [
    { email: 'john@example.com', name: 'John' },
    { email: 'jane@example.com', name: 'Jane' }
  ],
  title: 'April Product Updates',
  contentHtml: `
    <h3>What's New</h3>
    <p>We've shipped these features:</p>
    <ul>
      <li>Dark mode support</li>
      <li>Advanced search</li>
      <li>API improvements</li>
    </ul>
  `,
  unsubscribeLink: 'https://app.example.com/unsubscribe/xyz'
});
```

**Response:**
```typescript
{
  success: true,
  summary: {
    total: 2,
    successful: 2,
    failed: 0
  },
  type: 'newsletter',
  title: 'April Product Updates',
  messageIds: ['msg1', 'msg2'],
  timestamp: '2024-04-30T...'
}
```

---

## 🔧 Operational Workflows

### 7. **Outage Notice** (`send_outage_notice`)

Notify users of service outages.

**Parameters:**
```typescript
{
  recipientEmails: ["team@example.com", "support@example.com"],  // Required
  service: "API Service",             // Required
  status: "Investigating",            // Required - current status
  startTime: "2024-04-30T12:00:00Z",  // Required
  estimatedResolution: "15:00 UTC",   // Optional
  companyName: "Acme Corp",           // Optional
  supportEmail: "status@example.com",  // Optional
  dashboardUrl: "https://status.acme.com"  // Optional
}
```

**Status Examples:**
- "Investigating"
- "Identified"
- "Partial Outage"
- "Major Outage"
- "Degraded Performance"
- "Major Incident"

**Example:**
```typescript
await skill.tools.find(t => t.name === 'send_outage_notice')?.handler({
  recipientEmails: ['team@example.com'],
  service: 'Database',
  status: 'Investigating',
  startTime: '2024-04-30T12:30:00Z',
  estimatedResolution: '13:00 UTC',
  dashboardUrl: 'https://status.example.com'
});
```

**Response:**
```typescript
{
  success: true,
  summary: {
    total: 1,
    successful: 1,
    failed: 0
  },
  type: 'outage_notice',
  service: 'Database',
  status: 'Investigating',
  timestamp: '2024-04-30T...'
}
```

---

### 8. **Maintenance Notice** (`send_maintenance_notice`)

Announce scheduled maintenance windows.

**Parameters:**
```typescript
{
  recipientEmails: ["team@example.com"],  // Required
  service: "Web Platform",            // Required
  startTime: "2024-05-01T02:00:00Z",  // Required
  endTime: "2024-05-01T04:00:00Z",    // Required
  impact: "Service will be unavailable",  // Required
  companyName: "Acme Corp",           // Optional
  supportEmail: "status@example.com",  // Optional
  dashboardUrl: "https://status.example.com"  // Optional
}
```

**Impact Descriptions:**
- "Service will be unavailable"
- "Users may experience slow performance"
- "API requests will be rate limited"
- "Partial service interruption expected"

**Example:**
```typescript
await skill.tools.find(t => t.name === 'send_maintenance_notice')?.handler({
  recipientEmails: ['customers@acme.com'],
  service: 'Web Platform',
  startTime: '2024-05-01T02:00:00Z',
  endTime: '2024-05-01T04:00:00Z',
  impact: 'Service will be unavailable for maintenance'
});
```

---

### 9. **Ticket Update** (`send_ticket_update`)

Notify users of support ticket progress.

**Parameters:**
```typescript
{
  email: "customer@example.com",       // Required
  name: "John Doe",                   // Optional
  ticketId: "TICKET-12345",           // Required
  ticketTitle: "Login issues",        // Required
  status: "In Progress",              // Required
  updateMessage: "We've identified the issue and are working on a fix.",  // Required
  ticketLink: "https://support.example.com/tickets/12345",  // Required
  supportEmail: "support@example.com"  // Optional
}
```

**Status Examples:**
- "New"
- "In Progress"
- "Waiting for Customer"
- "Pending Review"
- "Resolved"
- "Closed"

**Example:**
```typescript
await skill.tools.find(t => t.name === 'send_ticket_update')?.handler({
  email: 'john@example.com',
  name: 'John Doe',
  ticketId: 'TICKET-001',
  ticketTitle: 'Password reset not working',
  status: 'In Progress',
  updateMessage: 'We\'ve identified the issue. A fix is being deployed.',
  ticketLink: 'https://support.example.com/tickets/001'
});
```

**Response:**
```typescript
{
  success: true,
  messageId: '...',
  email: 'john@example.com',
  ticketId: 'TICKET-001',
  type: 'ticket_update',
  status: 'In Progress',
  timestamp: '2024-04-30T...'
}
```

---

## 🤖 Agent Integration Examples

### Example 1: Authentication Flow in Agent

```typescript
// In a Claude agent handling user signup
const result = await skill.tools.find(t => t.name === 'send_magic_link_login')?.handler({
  email: newUser.email,
  name: newUser.fullName,
  magicLink: `${appUrl}/auth/magic/${token}`,
  expiryMinutes: '30',
  companyName: 'Acme Corp'
});

if (!result.success) {
  agent.log(`Failed to send magic link: ${result.error}`);
}
```

### Example 2: Support Ticket Workflow

```typescript
// Multi-agent workflow: ticket created, updates sent
const agents = [
  {
    name: 'ticket-creator',
    task: async () => {
      return await createTicket(...);
    }
  },
  {
    name: 'notifier',
    task: async (ticketId) => {
      return await skill.tools
        .find(t => t.name === 'send_ticket_update')
        ?.handler({
          email: customer.email,
          ticketId,
          ticketTitle: issueTitle,
          status: 'New',
          updateMessage: 'Your ticket has been received and is in our queue.',
          ticketLink: `https://support.example.com/tickets/${ticketId}`
        });
    }
  }
];

// Coordinate through SyncPulse
const result = await skill.tools.find(t => t.name === 'coordinate_agents')?.handler({
  workflowId: 'support-workflow-1',
  topology: 'hierarchical',
  tasks: agents
});
```

### Example 3: Incident Response

```typescript
// Send outage notification to all subscribed users
const outageStarted = true;

if (outageStarted) {
  await skill.tools.find(t => t.name === 'send_outage_notice')?.handler({
    recipientEmails: subscribedEmails,
    service: 'API Service',
    status: 'Investigating',
    startTime: new Date().toISOString(),
    estimatedResolution: 'Within 1 hour',
    dashboardUrl: 'https://status.example.com'
  });
}
```

---

## 📊 Response Patterns

All workflows return structured responses with consistent patterns:

**Single Email Responses:**
```typescript
{
  success: boolean,              // true only if all succeed
  messageId?: string,            // SMTP message ID
  email: string,
  type: string,                  // workflow type (e.g., 'magic_link_login')
  timestamp: string,             // ISO timestamp
  error?: string                 // error message if failed
}
```

**Bulk Email Responses:**
```typescript
{
  success: boolean,              // true only if all succeed (failed === 0)
  summary: {
    total: number,
    successful: number,
    failed: number
  },
  type: string,
  messageIds?: string[],
  errors?: Array<{                // only included if errors exist
    email: string,
    error: string
  }>,
  timestamp: string
}
```

---

## 🎨 Template Customization

All templates support variable interpolation. Customize templates by passing context:

```typescript
// The template system automatically interpolates these variables:
// {{recipientName}}  - Recipient's name
// {{companyName}}    - Your company name
// {{supportEmail}}   - Support contact
// {{dashboardUrl}}   - Your app URL
```

To use custom values:

```typescript
await skill.tools.find(t => t.name === 'send_magic_link_login')?.handler({
  email: 'user@example.com',
  magicLink: 'https://myapp.com/login/abc123',
  companyName: 'My Awesome Company',
  supportEmail: 'help@mycompany.com',
  dashboardUrl: 'https://myapp.com'
});
```

---

## 🔒 Security Notes

1. **Passwords Never in Email** - Magic links and codes only, never send passwords
2. **Link Expiration** - All links have automatic expiration (30 min to 24 hours)
3. **Rate Limiting** - Implement rate limiting for auth emails to prevent abuse
4. **HTTPS Only** - All template links assume HTTPS URLs
5. **Email Validation** - Validate email formats before sending
6. **Error Handling** - Log failures without exposing credentials

---

## 📈 Monitoring & Metrics

Track workflow performance:

```typescript
// Check for failed sends
if (!result.success) {
  // Alert team
  console.error(`Email failed for ${result.email}: ${result.error}`);
}

// Track bulk send success rate
const successRate = (result.summary.successful / result.summary.total) * 100;
console.log(`Newsletter: ${successRate.toFixed(1)}% delivered`);
```

---

## 🚀 Production Checklist

- [ ] Set `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM` environment variables
- [ ] Test each workflow type in staging
- [ ] Implement rate limiting for bulk sends
- [ ] Set up error alerting and monitoring
- [ ] Customize `companyName`, `supportEmail`, `dashboardUrl` for your brand
- [ ] Test email deliverability (check spam folder)
- [ ] Verify unsubscribe links work for newsletters
- [ ] Set up SPF/DKIM/DMARC for domain

---

## 📞 Support

For issues or questions:
1. Check [SECURE_EMAIL_SETUP.md](./SECURE_EMAIL_SETUP.md) for configuration help
2. Review [AGENT_INTEGRATION.md](./AGENT_INTEGRATION.md) for agent patterns
3. Contact your support team

---

**Happy emailing!** 🎉
