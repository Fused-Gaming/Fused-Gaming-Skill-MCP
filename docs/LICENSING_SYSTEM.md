# 🔐 SYNCPULSE LICENSING & SALES SYSTEM
## Free Trial, Payment Integration & License Management
**Version**: 1.0.0  
**Status**: Implementation Ready  
**Reference Issue**: #179  
**Breadcrumb Tag**: `licensing-system-phase-2`

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Free Trial System](#free-trial-system)
3. [License Key Format](#license-key-format)
4. [Payment Integration](#payment-integration)
5. [Customer Portal](#customer-portal)
6. [Renewal & Expiration](#renewal--expiration)
7. [API Reference](#api-reference)
8. [Implementation Checklist](#implementation-checklist)

---

## 🎯 OVERVIEW

### System Goals
1. **Zero friction**: Install with `npm install -g @h4shed/mcp-cli`
2. **Free trial**: 14-day default, no credit card required
3. **Flexible licensing**: Monthly, annual, or perpetual options
4. **Offline capable**: Validate licenses without internet
5. **Enterprise ready**: Team licensing, SSO support

### Core Components
```
┌─────────────────────────────────────────────────┐
│         SYNCPULSE LICENSING ARCHITECTURE       │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐   ┌──────────────┐           │
│  │   CLI Tool   │   │   Browser    │           │
│  │ (license cmd)│   │   Portal     │           │
│  └──────┬───────┘   └──────┬───────┘           │
│         │                  │                    │
│         └──────────────────┘                    │
│                  ↓                               │
│         ┌────────────────────┐                 │
│         │  License Manager   │                 │
│         │  (validation, gen) │                 │
│         └──────────┬─────────┘                 │
│                    ↓                            │
│    ┌───────────────┬───────────────┐          │
│    ↓               ↓               ↓           │
│ Storage      License Server   Stripe API     │
│ (local)      (validation)     (payments)     │
│                                              │
└──────────────────────────────────────────────┘
```

---

## ✨ FREE TRIAL SYSTEM

### Trial Period
- **Duration**: 14 days (configurable)
- **Start**: First install date
- **Grace Period**: 7 days after expiration (remains usable with warnings)
- **Cost**: FREE - No credit card required

### Trial License Generation

#### Step 1: Install Detection
```typescript
// When user runs: npm install -g @h4shed/mcp-cli (or skill-syncpulse)
// On first run, generate trial license

const licenseDir = path.join(os.homedir(), '.syncpulse');
const licenseFile = path.join(licenseDir, 'license.jwt');

if (!fs.existsSync(licenseFile)) {
  // First install - generate trial license
  generateTrialLicense(14); // days
}
```

#### Step 2: Trial License Structure
```json
{
  "type": "trial",
  "issued_at": "2026-05-16T10:00:00Z",
  "expires_at": "2026-05-30T10:00:00Z",
  "machine_id": "unique-device-identifier",
  "trial_days": 14,
  "product": "syncpulse-cli",
  "version": "1.2.0"
}
```

#### Step 3: Trial Status Display
```bash
$ syncpulse --version
SyncPulse v1.2.0
License: TRIAL (12 days remaining)

$ syncpulse license:status
┌─────────────────────────────────────┐
│ License Status                      │
├─────────────────────────────────────┤
│ Type:     Trial                      │
│ Expires:  2026-05-30 10:00 UTC       │
│ Days Left: 12                        │
│ Status:   ✅ Valid                   │
└─────────────────────────────────────┘
```

### Trial Expiration Warnings

#### Warning Timeline
```
Day 12 (2 days from end): Show once on startup
Day 11-10 (remind daily)
Day 7 (AGGRESSIVE WARNING):
  ✓ Show on every command
  ✓ Include pricing link
  ✓ Offer 1-click upgrade

Day 1 (FINAL WARNING):
  ✓ Show BEFORE each command
  ✓ Block non-essential commands
  ✓ Strong CTA

Day 0 (EXPIRED):
  ✓ Block all commands
  ✓ Force license activation
  ✓ Show 7-day grace period message

Day -7 (GRACE EXPIRED):
  ✓ Application unusable
  ✓ Must purchase to continue
```

#### Warning Message Example
```
⚠️  TRIAL EXPIRING IN 7 DAYS

Your SyncPulse trial expires on May 30, 2026.

Upgrade now for:
  • Unlimited agent swarms
  • Priority support
  • Team collaboration
  • Enterprise features

👉 https://syncpulse.io/upgrade
```

---

## 🔑 LICENSE KEY FORMAT

### JWT Token Structure
```
Header:
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "syncpulse-2026"
}

Payload:
{
  "iss": "syncpulse.io",
  "sub": "user@example.com",
  "type": "commercial|team|enterprise",
  "issued_at": "2026-05-16T00:00:00Z",
  "expires_at": "2027-05-16T00:00:00Z",
  "product": "syncpulse-cli",
  "version": "1.2.0",
  "features": {
    "concurrent_agents": 5,
    "storage_gb": 100,
    "team_members": 3,
    "priority_support": false,
    "custom_branding": false
  },
  "activation": {
    "activated_at": "2026-05-16T10:00:00Z",
    "machine_id": "unique-machine-identifier",
    "license_key": "syncpulse_1a2b3c4d5e6f7g8h"
  }
}

Signature: RS256(header.payload, private_key)
```

### License Key Validation
```typescript
interface LicensePayload {
  type: 'trial' | 'commercial' | 'team' | 'enterprise';
  issued_at: string;
  expires_at: string;
  product: string;
  version: string;
  features: LicenseFeatures;
  activation?: {
    activated_at: string;
    machine_id: string;
    license_key: string;
  };
}

function validateLicense(token: string): {
  valid: boolean;
  payload?: LicensePayload;
  error?: string;
} {
  try {
    // 1. Verify JWT signature
    const payload = jwt.verify(token, PUBLIC_KEY);
    
    // 2. Check expiration
    const now = Date.now();
    if (new Date(payload.expires_at).getTime() < now) {
      return { valid: false, error: 'License expired' };
    }
    
    // 3. Check machine_id (if present)
    if (payload.activation?.machine_id) {
      if (payload.activation.machine_id !== getCurrentMachineId()) {
        return { valid: false, error: 'License bound to different machine' };
      }
    }
    
    return { valid: true, payload };
  } catch (e) {
    return { valid: false, error: 'Invalid license format' };
  }
}
```

### License Storage
```bash
~/.syncpulse/
├── license.jwt              # Main license file
├── license.json             # Cached parsed license
├── license-history.json     # Activation history
└── machine-id               # Device identifier
```

---

## 💳 PAYMENT INTEGRATION

### Stripe Integration

#### Setup
```bash
# 1. Create Stripe account
https://stripe.com

# 2. Get API keys
STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx

# 3. Create products
Products:
  - SyncPulse Monthly ($29/month)
  - SyncPulse Annual ($290/year, 16% savings)
  - SyncPulse Team ($99/month, up to 5 team members)
  - SyncPulse Enterprise (Custom pricing)
```

#### Subscription Plans
```json
{
  "plans": [
    {
      "id": "plan_monthly",
      "name": "Professional",
      "price": 2900,
      "currency": "usd",
      "interval": "month",
      "features": {
        "concurrent_agents": 5,
        "storage_gb": 100,
        "team_members": 1,
        "priority_support": true,
        "custom_branding": false
      }
    },
    {
      "id": "plan_annual",
      "name": "Professional Annual",
      "price": 29000,
      "currency": "usd",
      "interval": "year",
      "features": {
        "concurrent_agents": 5,
        "storage_gb": 100,
        "team_members": 1,
        "priority_support": true,
        "custom_branding": false
      },
      "discount_percent": 16
    },
    {
      "id": "plan_team",
      "name": "Team",
      "price": 9900,
      "currency": "usd",
      "interval": "month",
      "features": {
        "concurrent_agents": 10,
        "storage_gb": 500,
        "team_members": 5,
        "priority_support": true,
        "custom_branding": false
      }
    }
  ]
}
```

#### Checkout Flow
```typescript
// 1. Create Stripe session
const session = await stripe.checkout.sessions.create({
  customer_email: user.email,
  line_items: [{
    price: plan.stripe_price_id,
    quantity: 1,
  }],
  mode: 'subscription',
  success_url: 'https://syncpulse.io/success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://syncpulse.io/pricing',
});

// 2. Redirect to Stripe checkout
res.json({ url: session.url });

// 3. User completes payment
// 4. Webhook: customer.subscription.created
// 5. Generate license key
// 6. Email license to user
// 7. User activates: syncpulse license:activate <key>
```

#### Webhook Handler
```typescript
app.post('/webhooks/stripe', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  switch (event.type) {
    case 'customer.subscription.created':
      // Generate and email license key
      break;
    case 'customer.subscription.updated':
      // Refresh license features
      break;
    case 'customer.subscription.deleted':
      // Revoke license
      break;
  }

  res.json({received: true});
});
```

---

## 🌐 CUSTOMER PORTAL

### Dashboard Features
```
https://dashboard.syncpulse.io

├── License Management
│   ├── Current license status
│   ├── Activation history
│   ├── Machine bindings
│   └── Renewal date
│
├── Billing & Subscriptions
│   ├── Current plan
│   ├── Upgrade/downgrade
│   ├── Billing history
│   ├── Invoices (PDF download)
│   └── Payment methods
│
├── Team Management (Team plans)
│   ├── Team members
│   ├── Roles & permissions
│   ├── Seat management
│   └── Usage analytics
│
└── Account Settings
    ├── Profile
    ├── Email preferences
    ├── Security
    └── API keys
```

### Portal Authentication
```typescript
// OAuth2 + JWT
// Users can login via:
// - GitHub
// - Google
// - Email/Password

// After auth: JWT token stored in browser
// Token includes: user_id, email, subscriptions, features
```

---

## 🔄 RENEWAL & EXPIRATION

### Auto-Renewal
```typescript
// Subscription auto-renews on:
// - Monthly: Same day each month
// - Annual: Same day each year

// Automatic license generation:
// 1. Subscription renewed on Stripe
// 2. webhook: customer.subscription.updated
// 3. Generate new license key (7 days before expiry)
// 4. Email new key to user
// 5. User can activate immediately via:
//    syncpulse license:refresh
```

### Expiration Handling
```
Day -30 (30 days before): Email reminder
Day -7 (7 days before): Dashboard notification + email
Day -1 (1 day before): Final reminder

Day 0 (TRIAL EXPIRES):
  ✓ Grace period begins (7 days)
  ✓ App continues to work
  ✓ Strong warning on every command
  ✓ Renewal button in CLI & dashboard
  ✓ Email reminder sent

Day 7 (GRACE PERIOD EXPIRES):
  ✗ Application becomes unusable
  ✗ User must renew or license expires
  ✗ One-click renewal from CLI:
    syncpulse license:renew
```

### CLI Commands
```bash
# Check license status
$ syncpulse license:status

# Activate license
$ syncpulse license:activate <license-key>

# Refresh license (requires internet)
$ syncpulse license:refresh

# Renew subscription
$ syncpulse license:renew
# Opens: https://dashboard.syncpulse.io/renew

# View renewal dates
$ syncpulse license:info

# Offline mode (when internet unavailable)
# App continues with last known license state
$ syncpulse --offline-mode
```

---

## 📡 API REFERENCE

### License Validation API
```
GET /api/v1/license/validate
Header: Authorization: Bearer <license_key>

Response:
{
  "valid": true,
  "type": "commercial",
  "expires_at": "2027-05-16T00:00:00Z",
  "features": { ... },
  "machine_id": "current-machine-hash"
}
```

### License Activation API
```
POST /api/v1/license/activate
{
  "license_key": "syncpulse_1a2b3c4d...",
  "machine_id": "device-hash",
  "timestamp": "2026-05-16T10:00:00Z"
}

Response:
{
  "success": true,
  "activated_at": "2026-05-16T10:00:00Z",
  "expires_at": "2027-05-16T10:00:00Z"
}
```

### Subscription API
```
GET /api/v1/subscriptions
GET /api/v1/subscriptions/{id}
POST /api/v1/subscriptions
PATCH /api/v1/subscriptions/{id}
DELETE /api/v1/subscriptions/{id}
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: License System (Week 1-2)
- [ ] Define JWT license format
- [ ] Build license validation library
- [ ] Implement trial license generation
- [ ] Create license storage mechanism
- [ ] Add CLI commands: `license:status`, `license:activate`
- [ ] Build offline validation
- [ ] Write unit tests

### Phase 2: Expiration Logic (Week 2-3)
- [ ] Implement expiration warning system
- [ ] Add grace period logic
- [ ] Create notification system
- [ ] Test all warning timelines
- [ ] Add CLI reminders

### Phase 3: Payment Integration (Week 3-4)
- [ ] Setup Stripe account
- [ ] Create subscription products
- [ ] Build checkout flow
- [ ] Implement webhook handlers
- [ ] Add license generation on payment
- [ ] Email license delivery

### Phase 4: Customer Portal (Week 4-5)
- [ ] Design portal UI
- [ ] Build authentication (OAuth2)
- [ ] Implement license management
- [ ] Add billing history
- [ ] Create renewal interface
- [ ] Build team management (for team plans)

### Phase 5: Testing & QA (Week 5-6)
- [ ] End-to-end license flow tests
- [ ] Payment flow testing
- [ ] Offline validation tests
- [ ] Expiration timeline tests
- [ ] Portal functionality tests
- [ ] Security audit

### Phase 6: Documentation & Launch (Week 6-7)
- [ ] Write user documentation
- [ ] Create API documentation
- [ ] Build FAQ & troubleshooting
- [ ] Create video tutorials
- [ ] Prepare launch announcement
- [ ] Deploy to production

---

## 🔒 SECURITY CONSIDERATIONS

### License Protection
- [ ] JWT signed with RS256
- [ ] License stored with restricted permissions (0600)
- [ ] No license keys in logs or error messages
- [ ] Regular key rotation (annually)
- [ ] Machine ID hash prevents copying across devices

### Payment Security
- [ ] PCI DSS compliance (via Stripe)
- [ ] All payment data goes directly to Stripe
- [ ] HTTPS enforced
- [ ] Rate limiting on API endpoints
- [ ] Webhook signature verification

### Privacy
- [ ] GDPR compliance
- [ ] Minimal telemetry (opt-in only)
- [ ] Clear data retention policies
- [ ] User consent for analytics
- [ ] Right to data deletion

---

## 📊 SUCCESS METRICS

| Metric | Target | Status |
|--------|--------|--------|
| Install time | <5 min | - |
| Trial to paid conversion | >5% | - |
| License validation latency | <100ms | - |
| Offline validation success | 100% | - |
| Payment success rate | >98% | - |
| Customer support response | <4hr | - |

---

**Reference Issue**: https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP/issues/179  
**Breadcrumb Tag**: `#licensing-system-phase-2`  
**Last Updated**: 2026-05-16  
**Version**: 1.0.0
