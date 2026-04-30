# SyncPulse Secure Email Configuration Guide

SyncPulse includes **secure, production-ready email capabilities** using nodemailer with environment-based secret management. This guide covers setup, best practices, and usage for marketing automation.

## 🔐 Security Best Practices

### 1. Environment Variable Management

**Never** commit credentials to version control. Use environment variables exclusively:

```bash
# .env.local (git-ignored)
MAIL_HOST=smtp.vln.gg
MAIL_PORT=587
MAIL_USER=test@mail.vln.gg
MAIL_PASS=your-app-specific-password
MAIL_FROM=noreply@vln.gg
MAIL_SECURE=false
```

### 2. Add to `.gitignore`

```bash
# Email configuration
.env
.env.local
.env.*.local
.env.production.local
```

### 3. Secret Management Strategies

#### Development: Local `.env.local`
```bash
npm install dotenv
```

Create `.env.local`:
```
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=dev-user@example.com
MAIL_PASS=dev-password
MAIL_FROM=dev@example.com
MAIL_SECURE=false
```

Load in your application:
```typescript
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
```

#### Production: Environment Service

For production deployments, use your platform's secret management:

**Vercel:**
```bash
vercel env add MAIL_HOST
vercel env add MAIL_PORT
vercel env add MAIL_USER
vercel env add MAIL_PASS
vercel env add MAIL_FROM
vercel env add MAIL_SECURE
```

**Docker:**
```dockerfile
ENV MAIL_HOST=${MAIL_HOST}
ENV MAIL_PORT=${MAIL_PORT}
ENV MAIL_USER=${MAIL_USER}
ENV MAIL_PASS=${MAIL_PASS}
ENV MAIL_FROM=${MAIL_FROM}
ENV MAIL_SECURE=${MAIL_SECURE}
```

**GitHub Actions:**
```yaml
env:
  MAIL_HOST: ${{ secrets.MAIL_HOST }}
  MAIL_PORT: ${{ secrets.MAIL_PORT }}
  MAIL_USER: ${{ secrets.MAIL_USER }}
  MAIL_PASS: ${{ secrets.MAIL_PASS }}
  MAIL_FROM: ${{ secrets.MAIL_FROM }}
```

## ⚙️ Configuration

### SMTP Configuration for test@mail.vln.gg

```typescript
import { EmailService } from '@h4shed/skill-syncpulse';

const emailService = new EmailService();

// Automatically loads from environment variables:
// MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_FROM

// Or configure explicitly:
emailService.initializeWithConfig({
  host: 'smtp.vln.gg',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: 'test@mail.vln.gg',
    pass: process.env.MAIL_PASS!, // Keep password in env vars
  },
  from: 'noreply@vln.gg',
});

// Verify connection
const isConnected = await emailService.verifyConnection();
console.log('Email service ready:', isConnected);
```

## 📧 Usage Examples

### 1. Send Single Email

```typescript
import { createSyncPulseSkill } from '@h4shed/skill-syncpulse';

const skill = createSyncPulseSkill();
const emailService = skill.services.email;

const result = await skill.tools.find(t => t.name === 'send_email')?.handler({
  recipients: [
    { email: 'user@example.com', name: 'John Doe' }
  ],
  subject: 'Welcome to {{company}}!',
  htmlBody: `
    <h1>Hello {{name}},</h1>
    <p>Welcome to {{company}}!</p>
    <p>We're excited to have you on board.</p>
  `,
  variables: {
    company: 'Fused Gaming',
    name: 'John'
  }
});

console.log(result);
// { success: true, messageId: '...', recipientCount: 1, timestamp: '...' }
```

### 2. Send Bulk Campaign Email

```typescript
const result = await skill.tools.find(t => t.name === 'send_bulk_email')?.handler({
  recipients: [
    {
      email: 'john@example.com',
      name: 'John',
      variables: { tier: 'Gold' }
    },
    {
      email: 'jane@example.com',
      name: 'Jane',
      variables: { tier: 'Silver' }
    }
  ],
  subject: '{{tier}} Member Exclusive Offer',
  htmlBody: `
    <h2>Hello {{name}},</h2>
    <p>As a {{tier}} member, you get 20% off!</p>
  `,
  globalVariables: {
    offerCode: 'SAVE20'
  }
});

console.log(result);
// {
//   success: true,
//   summary: { total: 2, successful: 2, failed: 0 },
//   timestamp: '...'
// }
```

### 3. Send Marketing Campaign with Tracking

```typescript
const result = await skill.tools.find(t => t.name === 'send_marketing_campaign')?.handler({
  campaignName: 'Q2-Product-Launch-2024',
  recipients: [
    { email: 'team@company.com', name: 'Product Team' },
    { email: 'marketing@company.com', name: 'Marketing Team' }
  ],
  subject: 'New Product Launch - Q2 2024',
  htmlBody: `
    <h1>Introducing Our New Product</h1>
    <p>Launching this quarter with exciting features...</p>
    <a href="https://vln.gg/product">Learn More</a>
  `,
  trackingPixel: true // Enable open tracking
});

console.log(result);
// {
//   success: true,
//   campaign: {
//     name: 'Q2-Product-Launch-2024',
//     total: 2,
//     successful: 2,
//     failed: 0,
//     trackingEnabled: true
//   },
//   timestamp: '...'
// }
```

### 4. Verify Email Configuration

```typescript
const status = await skill.tools.find(t => t.name === 'verify_email_configuration')?.handler();

console.log(status);
// {
//   configured: true,
//   connected: true,
//   config: {
//     host: 'smtp.vln.gg',
//     port: 587,
//     secure: false,
//     from: 'noreply@vln.gg',
//     user: 'tes***'
//   },
//   status: 'ready',
//   message: 'Email service is ready to send messages',
//   timestamp: '...'
// }
```

## 🎯 Template Variables

SyncPulse supports Mustache-style variable interpolation:

```typescript
const template = {
  subject: 'Hello {{firstName}}!',
  htmlBody: `
    <p>Dear {{firstName}} {{lastName}},</p>
    <p>Your order #{{orderId}} is ready.</p>
    <p>Total: ${{amount}}</p>
  `
};

const variables = {
  firstName: 'John',
  lastName: 'Doe',
  orderId: '12345',
  amount: '99.99'
};
```

## 📊 Tracking & Analytics

### Enable Email Open Tracking

```typescript
{
  campaignName: 'my-campaign',
  recipients: [...],
  subject: '...',
  htmlBody: '...',
  trackingPixel: true  // Adds tracking pixel to emails
}
```

The tracking pixel URL format:
```
https://mail.vln.gg/track/{campaignName}
```

Track opens server-side by monitoring requests to this endpoint.

## 🛡️ Security Checklist

- [ ] Never commit `.env` files
- [ ] Use app-specific passwords (not primary account passwords)
- [ ] Enable 2FA on email accounts
- [ ] Rotate SMTP passwords quarterly
- [ ] Use TLS/SSL for SMTP connections (`secure: true` or STARTTLS on port 587)
- [ ] Validate recipient emails before sending
- [ ] Rate limit bulk email sends
- [ ] Log email attempts (without logging passwords)
- [ ] Monitor email delivery failures
- [ ] Implement unsubscribe mechanisms for marketing emails

## 🚀 Production Deployment

### Error Handling

```typescript
try {
  const result = await sendEmail({
    recipients: [...],
    subject: 'Test',
    htmlBody: '<p>Test</p>'
  });

  if (!result.success) {
    console.error('Email failed:', result.error);
    // Implement retry logic or alerting
  }
} catch (error) {
  console.error('Email service error:', error);
  // Implement fallback notification
}
```

### Rate Limiting

For bulk campaigns, implement rate limiting:

```typescript
async function sendWithRateLimit(emails, ratePerSecond = 10) {
  const delayMs = 1000 / ratePerSecond;

  for (const email of emails) {
    await sendEmail(email);
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
}
```

### Monitoring & Logging

```typescript
const result = await sendEmail({...});

// Log to your monitoring service
if (result.success) {
  console.log(`✉️ Email sent: ${result.messageId}`);
} else {
  console.error(`❌ Email failed: ${result.error}`);
  // Alert team if critical email fails
}
```

## 🔗 Integration with SyncPulse Agents

Use email within multi-agent workflows:

```typescript
// Marketing automation agent
const task = {
  id: 'marketing-campaign-send',
  name: 'Send Q2 Marketing Campaign',
  priority: 5,
  handler: async () => {
    return await skill.tools.find(t => t.name === 'send_marketing_campaign')?.handler({
      campaignName: 'Q2-Launch',
      recipients: marketingList,
      subject: 'Q2 Product Launch',
      htmlBody: campaignTemplate,
      trackingPixel: true
    });
  }
};

// Execute through SyncPulse orchestration
const result = await skill.tools.find(t => t.name === 'coordinate_agents')?.handler({
  workflowId: 'marketing-workflow-1',
  topology: 'hierarchical',
  tasks: [task]
});
```

## 📞 Support & Troubleshooting

### Configuration Issues

```typescript
const emailService = new EmailService();
const status = await emailService.verifyConnection();

if (!status) {
  // Check environment variables
  console.log('Missing config:', process.env);
}
```

### SMTP Connection Errors

- **Port 587 (STARTTLS)**: Use `secure: false`
- **Port 465 (SSL)**: Use `secure: true`
- **Port 25 (Unencrypted)**: Use `secure: false` (not recommended)

### Email Delivery Issues

1. Verify sender address is authorized
2. Check SPF/DKIM/DMARC records
3. Test with `verifyConnection()`
4. Check recipient email validation
5. Review SMTP server logs

## 📚 Additional Resources

- [nodemailer Documentation](https://nodemailer.com/)
- [SMTP Configuration Guide](https://nodemailer.com/smtp/)
- [Email Security Best Practices](https://owasp.org/www-community/attacks/Email_Injection)
- [SyncPulse Documentation](./README.md)
