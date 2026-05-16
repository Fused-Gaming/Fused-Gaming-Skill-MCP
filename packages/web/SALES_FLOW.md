# Sales Flow & Customer Onboarding Journey

**Document Version**: 1.0  
**Last Updated**: May 2026  
**Owner**: Sales & Customer Success Teams

---

## 🎯 Executive Summary

The sales flow encompasses three distinct customer acquisition and onboarding pathways:
- **Free Tier**: Self-service, low-friction signup to dashboard activation
- **Pro Tier**: Trial-driven with guided onboarding and support
- **Enterprise**: Sales-led with custom negotiation and dedicated account management

**Target KPIs:**
- Free → Dashboard activation: 90% same-session
- Pro trial → subscription: 25-30% conversion (14-day trial)
- Enterprise sales cycle: 30-60 days, 70%+ close rate

---

## 📊 Sales Funnel Overview

```
Entry Point: Landing Page Signup
    │
    ├─────────────────┬─────────────────┬──────────────────┐
    │                 │                 │                  │
    ▼                 ▼                 ▼                  ▼
  FREE TIER        PRO TRIAL        ENTERPRISE      SALES INQUIRY
  Self-Service    Email Support     Sales-Led       Contact Form
  100% → 100%     100% → 30%        100% → 70%      100% → 40%
  ↓               ↓                 ↓               ↓
  Dashboard       Free trial        Discovery       Lead
  Onboarding      period            call            qualification
  ↓               ↓                 ↓               ↓
  5 swarms        14-day           Custom           Sales
  + monitoring    limited trial     proposal         meeting
  ↓               ↓                 ↓               ↓
  Community       Email             Negotiation     Contract
  support         nurture           + SLA           + onboarding
  ↓               ↓                 ↓               ↓
  Retention       Pro purchase      Enterprise      Dedicated
  loop            (goal: 30%)       contract        account mgmt
                  ↓
                  Pro onboarding
                  setup call
                  ↓
                  Advanced features
                  + integrations
```

---

## 🔵 Free Tier Flow

### Objective
Rapid activation → onboarding → retention in free tier  
Target: 40% of signups remain active in free tier after 30 days

### Customer Journey Map

```
STEP 1: EMAIL VERIFICATION
═════════════════════════════════════════════════════════════

Signup completion
    │
    ▼
┌────────────────────────────────────────┐
│ Trigger: User clicked [Get Started]    │
│                                        │
│ Email sent: Verification link          │  T+0 min
│ Subject: "Verify your SyncPulse email" │
│                                        │
│ Template: Clean, branded, 1 CTA        │
│ Include: Magic link + expires in 24h   │
│                                        │
│ User action: Click link in email       │
│ Auto-login initiated                   │
│                                        │
└────────────────────────────────────────┘
         ↓
    Account verified
    Token generated
    Session established


STEP 2: DASHBOARD FIRST LOGIN
═════════════════════════════════════════════════════════════

Auto-login completed
    │
    ▼
┌────────────────────────────────────────┐
│ Landing: Dashboard home page           │
│                                        │
│ Welcome message:                       │  T+2-5 min
│ "Welcome, [Name]! You're all set."    │
│                                        │
│ Visible elements:                      │
│ ├─ Status: "Free tier active"          │
│ ├─ Metrics: "5 swarms available"       │
│ ├─ Onboarding tooltip: Next steps      │
│ ├─ Quick-start guide: "Create first    │
│ │  swarm in 2 minutes"                 │
│ └─ Help sidebar: Documentation links   │
│                                        │
│ CTA Buttons:                           │  Primary actions
│ ├─ [Create Your First Swarm]           │
│ ├─ [Watch Quick Start Video]           │
│ ├─ [View Sample Swarms]                │
│ └─ [Browse Skill Marketplace]          │
│                                        │
└────────────────────────────────────────┘
         ↓
    (User choice: Create or explore)


STEP 3: FIRST SWARM CREATION
═════════════════════════════════════════════════════════════

User initiates swarm creation
    │
    ▼
┌────────────────────────────────────────┐
│ Modal: Create New Swarm                │
│                                        │
│ Form fields:                           │  T+5-10 min
│ ├─ Swarm name (text input)             │
│ ├─ Description (optional)              │
│ ├─ Agent count (slider: 1-5)           │  FREE: max 5
│ ├─ Select template:                    │
│ │  • Empty swarm                       │
│ │  • Researcher (pre-configured)       │
│ │  • Content creator (pre-configured)  │
│ │  • Data analyst (pre-configured)     │
│ └─ [Create Swarm]                      │
│                                        │
│ Context help:                          │
│ ├─ What is a swarm?                    │
│ ├─ How many agents do I need?          │
│ └─ Can I delete this later?            │
│                                        │
└────────────────────────────────────────┘
         ↓
    Swarm created
    Template initialized
    Ready for execution


STEP 4: SKILLS & INTEGRATION
═════════════════════════════════════════════════════════════

Swarm created, now configure
    │
    ▼
┌────────────────────────────────────────┐
│ Skill Marketplace                      │
│                                        │
│ Discovery:                             │  T+10-15 min
│ ├─ Browse by category (Design, Dev)    │
│ ├─ Search skills (full text)           │
│ ├─ Filter by "Free tier compatible"    │
│ └─ Sort by popularity                  │
│                                        │
│ Skill cards show:                      │
│ ├─ Name + description                  │
│ ├─ Rating (stars)                      │
│ ├─ Tier requirement (Free/Pro/Ent)     │
│ ├─ Quick stats (uses, rating)          │
│ └─ [Add to swarm]                      │
│                                        │
│ Messaging:                             │
│ • "10 Free-tier skills available"      │
│ • "Upgrade to Pro for 50+ more"        │
│                                        │
└────────────────────────────────────────┘
         ↓
    Skills added to swarm
    Basic integrations active


STEP 5: EXECUTION & MONITORING
═════════════════════════════════════════════════════════════

Swarm configured with skills
    │
    ▼
┌────────────────────────────────────────┐
│ Dashboard: Swarm Control               │
│                                        │
│ Now user can:                          │  T+15-20 min
│ ├─ [Play/Pause] execution              │
│ ├─ [Monitor] agent status              │
│ ├─ [View] task results                 │
│ └─ [Settings] adjust parameters        │
│                                        │
│ Free tier limitations displayed:       │
│ • Max 5 concurrent agents              │
│ • Basic monitoring only                │
│ • Community support via Discord        │
│ • Upgrade to Pro for advanced features │
│ └─ [Try Pro Free for 14 Days]          │
│                                        │
└────────────────────────────────────────┘
         ↓
    First swarm execution
    Success creates confidence


STEP 6: FEATURE DISCOVERY & UPGRADES
═════════════════════════════════════════════════════════════

User exploring free tier features
    │
    ▼
┌────────────────────────────────────────┐
│ Sidebar: Upgrade Prompts               │
│                                        │
│ Strategic friction points:             │ T+20-30 min
│                                        │
│ When user tries to:                    │
│ ├─ Create 6th swarm:                   │
│ │  → "Upgrade to Pro for unlimited"    │
│ ├─ Access advanced monitoring:         │
│ │  → "Pro includes real-time analytics"│
│ ├─ Add premium integrations:           │
│ │  → "40+ skills in Pro tier"          │
│ └─ Request priority support:           │
│    → "Email support with Pro"          │
│                                        │
│ CTAs:                                  │
│ ├─ [Try Pro Free (14 days)]            │ Primary
│ ├─ [See Pro Features]                  │
│ ├─ [Compare Plans]                     │
│ └─ [Pricing]                           │
│                                        │
└────────────────────────────────────────┘
         ↓
    User behavior tracked
    Upgrade signals captured


STEP 7: RETENTION & RE-ENGAGEMENT
═════════════════════════════════════════════════════════════

After first week (T+7 days)
    │
    ▼
┌────────────────────────────────────────┐
│ Retention Email: Success Celebration   │
│                                        │
│ Subject: "Your first swarm is running" │
│ Personalized: Show their swarm name    │
│                                        │
│ Content:                               │
│ ├─ Congratulations on first execution  │
│ ├─ Here's what you've accomplished     │
│ │  • X tasks completed                 │
│ │  • Y agent hours saved               │
│ ├─ Next steps to deepen learning       │
│ │  • Create multi-agent workflows      │
│ │  • Add custom integrations           │
│ │  • Join community Discord            │
│ └─ CTA: [Explore Advanced Features]    │
│                                        │
│ Segment: Active free users only        │
│                                        │
└────────────────────────────────────────┘
         ↓
    Re-engagement campaign starts
    Weekly tips + Pro benefits
```

### Free Tier Success Criteria

```
Goal: 40% active retention after 30 days

Activation metrics (T+0 to T+1 day):
├─ Email verification: 95% within 24h
├─ Dashboard login: 90% after verification
├─ Swarm creation: 65% create first swarm
├─ Skill selection: 50% add skills
└─ First execution: 45% run first task

Engagement metrics (T+1 to T+7 days):
├─ Daily active users: 25% of signups
├─ Swarm executions: avg 3+ per user
├─ Dashboard logins: 3+ per week
├─ Help article views: 40% access docs
└─ Community join: 15% join Discord

Retention metrics (T+7 to T+30 days):
├─ Weekly active: 40% of signups
├─ Multiple swarms: 20% create 2+
├─ Skill exploration: 30% add different skills
├─ Upgrade interest: 10-15% visit Pro page
└─ Churn rate: <40% (target: <35%)

Quality signals (ongoing):
├─ Session duration: >5 min avg
├─ Feature depth: >3 unique features used
├─ Task success rate: >80% execution success
└─ Satisfaction: >4.0 / 5.0 (NPS)
```

---

## 🟢 Pro Tier Trial Flow

### Objective
Convert Pro trial users to paying customers through guided onboarding  
Target: 25-30% trial-to-paid conversion

### Customer Journey Map

```
TRIGGER: PRO TRIAL INITIATED
═════════════════════════════════════════════════════════════

User clicks [Try Pro Free] or [Start 14-Day Trial]
    │
    ▼
┌────────────────────────────────────────┐
│ Trial start: Verification             │
│                                        │
│ Tier upgrade: Free → Pro (trial)       │  T+0 min
│                                        │
│ Trial parameters:                      │
│ ├─ Duration: 14 days                   │
│ ├─ Auto-renewal: Disabled (no charge)  │
│ ├─ Features: Full Pro access           │
│ └─ Limits: Unlimited agents, swarms    │
│                                        │
│ Account updated:                       │
│ ├─ Billing email: Sent confirmation    │
│ ├─ Feature flags: Pro enabled          │
│ ├─ Dashboard: Tier badge updated       │
│ └─ Trial countdown: 14d timer shown    │
│                                        │
└────────────────────────────────────────┘
         ▼
    Trial activated
    Email: Welcome to Pro


STEP 1: PRO WELCOME SEQUENCE (T+0 to T+2 hours)
═════════════════════════════════════════════════════════════

Email 1 (T+0): Trial activation
    ├─ Subject: "Welcome to SyncPulse Pro! 14 free days, no credit card"
    ├─ Content:
    │  ├─ Trial terms (14 days, no charge, free cancellation)
    │  ├─ Pro features you now have access to:
    │  │  • Unlimited agents & swarms
    │  │  • Advanced analytics dashboard
    │  │  • 50+ skill integrations
    │  │  • Email support (48h response)
    │  │  • Custom integrations via API
    │  ├─ Quick start guide: 3-step onboarding
    │  └─ CTA: [Go to Dashboard]
    ├─ Segment: Trial starters
    └─ Send: Immediately


STEP 2: DASHBOARD ONBOARDING (T+2 to T+24 hours)
═════════════════════════════════════════════════════════════

First login with Pro tier
    │
    ▼
┌────────────────────────────────────────┐
│ Trial Onboarding Wizard                │
│                                        │
│ Modal: "Unlock Pro Features"           │  T+2-4 hours
│ Progressive disclosure: 3-step wizard  │
│                                        │
│ Step 1: Tier comparison                │
│ ├─ What's new in Pro?                  │
│ ├─ 3-4 key capability highlights       │
│ │  • Unlimited swarms                  │
│ │  • Real-time analytics               │
│ │  • Priority support                  │
│ └─ [Next →]                            │
│                                        │
│ Step 2: API access setup               │
│ ├─ Generate API key for integrations   │
│ ├─ Show copy-to-clipboard interface    │
│ ├─ Link to API docs                    │
│ └─ [Next →]                            │
│                                        │
│ Step 3: Analytics dashboard tour       │
│ ├─ Show new analytics panel            │
│ ├─ Highlight key metrics:              │
│ │  • Agent performance graphs          │
│ │  • Success rate trending             │
│ │  • Execution time analytics          │
│ └─ [Start exploring →]                 │
│                                        │
│ Can skip: [Skip wizard] (not recommended)
│                                        │
└────────────────────────────────────────┘
         ▼
    Wizard completed
    Pro features unlocked
    Analytics visible


STEP 3: SETUP CALL SCHEDULING (T+4 to T+12 hours)
═════════════════════════════════════════════════════════════

In-app notification: Setup call available
    │
    ▼
┌────────────────────────────────────────┐
│ In-app: Schedule Success Call          │
│                                        │
│ Notification banner:                   │  T+4-6 hours
│ "Get the most from Pro: 15-min        │
│  setup call with our team (free)"     │
│                                        │
│ CTA options:                           │
│ ├─ [Schedule Call] → Calendly embed    │
│ ├─ [Learn More] → help article         │
│ └─ [Dismiss]                           │
│                                        │
│ If clicked [Schedule Call]:            │
│ ├─ Calendly modal appears              │
│ ├─ Availability: 24h-7 days out        │
│ ├─ Slots: 15-min meetings              │
│ ├─ Timezone detection: User's local    │
│ └─ After booking:                      │
│    • Confirmation email sent           │
│    • Zoom link provided                │
│    • Calendar invite sent              │
│                                        │
└────────────────────────────────────────┘
         ▼
    Optional but encouraged
    Target: 30% book call


STEP 4: EMAIL NURTURE (T+24 to T+7 days)
═════════════════════════════════════════════════════════════

Daily/every-2-day email sequence for trial users

Email 2 (T+24h): Advanced features deep-dive
├─ Subject: "3 Pro features that will save you hours"
├─ Content:
│  ├─ Feature 1: Real-time analytics dashboard
│  │  └─ "Track agent performance in real-time"
│  ├─ Feature 2: Premium skill integrations
│  │  └─ "Connect to 50+ enterprise services"
│  ├─ Feature 3: API access & custom workflows
│  │  └─ "Build custom integrations in minutes"
│  └─ Suggested action: Video tour (2-min)
├─ CTA: [Watch Feature Tour]
└─ Segment: Trial users who haven't used advanced features

Email 3 (T+48h): Success story from similar user
├─ Subject: "How [Company] used Pro to cut swarm setup time by 75%"
├─ Content:
│  ├─ Customer quote
│  ├─ Specific use case narrative
│  ├─ Results achieved
│  └─ Key feature that enabled it
├─ CTA: [Read Full Case Study]
└─ Segment: Trial users from similar company size/industry

Email 4 (T+72h): Common setup mistakes
├─ Subject: "3 mistakes new Pro users make (and how to avoid them)"
├─ Content:
│  ├─ Mistake 1: Not setting up API integrations
│  │  └─ "You're missing automated workflows"
│  ├─ Mistake 2: Ignoring analytics dashboard
│  │  └─ "Here's where to find insights"
│  ├─ Mistake 3: Not joining community
│  │  └─ "Learn from 10K+ other builders"
│  └─ Quick fix guide
├─ CTA: [View Setup Guide]
└─ Segment: Trial users <40% feature engagement

Email 5 (T+5d): Pro subscriber testimonial
├─ Subject: "Why [Person] upgraded from free to Pro"
├─ Content:
│  ├─ Direct quote from happy Pro customer
│  ├─ What changed after upgrade
│  ├─ ROI/results achieved
│  └─ Pricing transparency ("It's $99/month")
├─ CTA: [Upgrade to Pro Now]
└─ Segment: Highly engaged trial users (purchase intent signal)

Email 6 (T+7d): Mid-trial check-in
├─ Subject: "[Name], are you getting value from Pro?"
├─ Content:
│  ├─ Progress summary: "You've run 23 swarms"
│  ├─ Next steps based on usage:
│  │  ├─ If power user: "Advanced integrations guide"
│  │  ├─ If casual user: "Starter workflows"
│  │  └─ If inactive: "1-on-1 setup call available"
│  ├─ Trial status: "7 days remaining"
│  └─ Conversion CTA: "Ready to upgrade?"
├─ CTA: [Continue as Pro] or [Upgrade Now]
└─ Segment: All active trial users

Email 7 (T+10d): Limited-time incentive (optional)
├─ Subject: "Upgrade now, save 20% on annual Pro plan"
├─ Content:
│  ├─ Urgency: "Offer expires when your trial ends"
│  ├─ Value math: "Save $238/year with annual billing"
│  ├─ Breakdown: "$99/mo → $79/mo if you commit"
│  └─ Risk reversal: "30-day money-back guarantee"
├─ CTA: [Get Annual Discount]
└─ Segment: Trial users with medium engagement (conversion target)

Email 8 (T+12d): Final conversion push
├─ Subject: "[Name], 2 days left in your Pro trial"
├─ Content:
│  ├─ Urgency framing: Trial ends [date]
│  ├─ What you'd lose: List Pro features
│  ├─ Upgrade path: Simple 1-click process
│  ├─ Support option: "Questions? We're here to help"
│  └─ CTA emphasis: Prominent upgrade button
├─ CTA: [Upgrade to Pro] | [Schedule Call First]
└─ Segment: All trial users with <48h remaining


STEP 5: DECISION POINT - DAY 14 (T+14 days)
═════════════════════════════════════════════════════════════

Trial expiration approaching
    │
    ├─────────────────┬──────────────────┐
    ▼                 ▼                  ▼
┌──────────────┐  ┌─────────────┐  ┌─────────────┐
│ UPGRADE TO   │  │  DOWNGRADE  │  │  CHURN      │
│ PRO PAID     │  │  TO FREE    │  │  (Inactive) │
│              │  │             │  │             │
│ Goal: 25-30% │  │ Goal: 50%   │  │ Goal: 20%   │
│ conversion   │  │ retention   │  │ minimize    │
│              │  │             │  │             │
└──────────────┘  └─────────────┘  └─────────────┘
    │                  │                  │
    ▼                  ▼                  ▼
Email: Upgrade    Email: Downgrade   Email: Win-back
Confirmation      confirmation       campaign
    │                  │                  │
    ▼                  ▼                  ▼
Account status:   Account status:    Re-engagement
Pro (paid)        Free (limited)      sequence


OUTCOME PATHWAYS:

Path A: Upgrade to Pro (Success)
├─ Payment processed: Credit card charged $99
├─ Confirmation email sent
├─ Account status: Pro (active subscription)
├─ Trial end date: Converted to billing date
├─ Next step: Onboarding call (if not done during trial)
└─ Goal: Minimize churn, maximize LTV through features

Path B: Downgrade to Free (Partial Success)
├─ Trial expires naturally
├─ Automatic downgrade to Free tier
├─ Confirmation email: "Welcome back to Free"
├─ Feature access: Reduced to 5 swarms, basic monitoring
├─ Re-engagement: Weekly tips email + upgrade reminders
└─ Goal: Keep engaged, nurture for future upgrade

Path C: Churn (Inactive)
├─ User never logs in during trial period
├─ Trial expires, account downgrades
├─ Win-back email: "We'd love to have you back"
├─ Content: Case study + 1-week re-trial offer
├─ Segment: Check-in 30 days later if inactive
└─ Goal: Recover 10-15% for second trial

```

### Pro Trial Success Metrics

```
Activation (T+0 to T+2 days):
├─ Trial start rate: 100% of clicks
├─ Email open rate: 40-50%
├─ Dashboard login: 80-85% of trial starters
├─ Feature exploration: 60% interact with Pro UI
└─ Setup call booked: 25-30% target

Engagement (T+3 to T+10 days):
├─ Email sequence completion: 50% read 4+ emails
├─ Feature usage: 65% use advanced analytics
├─ API integrations created: 20% set up API
├─ Swarm creation rate: 2x free tier (unlimited)
├─ Execution success: >85% task completion
└─ Support tickets: <5% need help (strong satisfaction)

Conversion (T+11 to T+14 days):
├─ Upgrade rate: 25-30% → paid Pro
├─ Upgrade sources:
│  ├─ Email CTA: 40% of conversions
│  ├─ In-app CTA: 35%
│  ├─ Setup call: 15%
│  └─ Chat support: 10%
├─ Payment success: 98% (minimal failed charges)
├─ Downgrade rate: 50% → Free tier
├─ Churn rate: 20% (inactive)
└─ Upgrade timing: 70% upgrade in final 48h (scarcity effect)

Quality signals:
├─ Trial satisfaction: 4.2/5.0 NPS target
├─ Feature adoption: 3+ distinct features used
├─ First month retention: 90% of paid (target: 95%)
└─ Cost of trial acquisition: <$15 (email only)
```

---

## 🟣 Enterprise Sales Flow

### Objective
Convert high-value prospects to Enterprise contracts through sales-led process  
Target: 70%+ close rate, $5K-50K+ ACV

### Customer Journey Map

```
TRIGGER: ENTERPRISE INQUIRY
═════════════════════════════════════════════════════════════

Entry point: [Contact Sales] button on pricing page
    │
    ▼
┌────────────────────────────────────────┐
│ Contact Form: Lead Qualification       │
│                                        │
│ Form fields:                           │  T+0
│ ├─ Company name (text)                 │
│ ├─ Your name (text)                    │
│ ├─ Work email (email)                  │
│ ├─ Phone number (phone)                │
│ ├─ Company size (dropdown):            │
│ │  • 1-50 people                       │
│ │  • 51-500 people                     │
│ │  • 501-5K people                     │
│ │  • 5K+ people                        │
│ ├─ Primary use case (select):          │
│ │  • Research & development            │
│ │  • Customer support automation       │
│ │  • Content generation                │
│ │  • Data analysis                     │
│ │  • Other (text field)                │
│ ├─ Budget range (optional):            │
│ │  • $5K-25K/year                      │
│ │  • $25K-100K/year                    │
│ │  • $100K+/year                       │
│ │  • TBD                               │
│ ├─ Timeline (dropdown):                │
│ │  • Immediate (30 days)               │
│ │  • Short-term (30-90 days)           │
│ │  • Long-term (3-6 months)            │
│ │  • Evaluating                        │
│ ├─ Message (textarea):                 │
│ │  "Tell us about your needs"          │
│ │                                      │
│ └─ [Submit Inquiry]                    │
│                                        │
│ Form UX:                               │
│ ├─ Clear field labels                  │
│ ├─ Progressive disclosure (advanced?)  │
│ ├─ Mobile optimized                    │
│ └─ Reassurance: "We'll respond within  │
│    24 hours"                           │
│                                        │
└────────────────────────────────────────┘
         ▼
    Lead captured
    Qualification signals extracted


STEP 1: LEAD ROUTING & QUALIFICATION (T+0 to T+2 hours)
═════════════════════════════════════════════════════════════

Form submission received
    │
    ▼
┌────────────────────────────────────────┐
│ Automated lead scoring                 │
│                                        │
│ Qualification criteria (MQL threshold):│  T+5-30 min
│ ├─ Company size: 500+ = +30 points    │
│ ├─ Use case relevance: +20 points     │
│ ├─ Budget: $25K+ = +25 points         │
│ ├─ Timeline: Immediate = +20 points   │
│ ├─ Email domain (enterprise) = +15    │
│ └─ MQL threshold: 70+ points          │
│                                        │
│ Routing logic:                         │
│ ├─ Score ≥ 100: Route to AE (immediate)
│ ├─ Score 70-99: Route to SDR (follow-up)
│ ├─ Score < 70: Auto-nurture (email seq.)
│ └─ All: Add to CRM system              │
│                                        │
│ CRM action:                            │
│ ├─ Create contact record               │
│ ├─ Tag: Enterprise, Use-case           │
│ ├─ Assign: AE or SDR based on score    │
│ ├─ Workflow: Initiate email sequence   │
│ └─ Notification: Route to sales team   │
│                                        │
└────────────────────────────────────────┘
         ▼
    Lead routed to sales


STEP 2: INITIAL OUTREACH (T+2 hours to T+24 hours)
═════════════════════════════════════════════════════════════

High-quality lead (MQL)
    │
    ▼
┌────────────────────────────────────────┐
│ SDR/AE: First contact                  │
│                                        │
│ Outreach method:                       │  T+2-12 hours
│ ├─ Primary: Email (personalized)       │
│ ├─ Secondary: LinkedIn message         │
│ ├─ Tertiary: Phone call (if available) │
│ └─ Send: Within business hours of form │
│                                        │
│ Email template:                        │
│ ├─ Subject: "Quick question about     │
│ │  agent orchestration for [use case]"│
│ ├─ Body:                               │
│ │  ├─ Personal greeting (use name)     │
│ │  ├─ Reference their inquiry          │
│ │  ├─ Specific question about use case │
│ │  ├─ Relevant social proof            │
│ │  │  (customer story, case study)     │
│ │  ├─ Calendar link for call           │
│ │  └─ Non-salesy closing               │
│ ├─ Tone: Consultative, not pushy       │
│ └─ Goal: Qualify + schedule call       │
│                                        │
│ Follow-up sequence (if no response):   │
│ ├─ Email 1 (T+2h): Initial outreach   │
│ ├─ Email 2 (T+3d): Follow-up          │
│ ├─ Email 3 (T+7d): Last attempt       │
│ └─ Email 4 (T+14d): Reposition offer  │
│                                        │
└────────────────────────────────────────┘
         ▼
    Response rate target: 20-30%
    Calendar acceptance: 30-40% of responses


STEP 3: DISCOVERY CALL (T+3 to T+7 days)
═════════════════════════════════════════════════════════════

Calendar link accepted, call scheduled
    │
    ▼
┌────────────────────────────────────────┐
│ Sales Call: Discovery (30-45 minutes) │
│                                        │
│ Pre-call prep (SDR):                   │
│ ├─ Research company website            │  T+1-2 days
│ ├─ Check LinkedIn profiles             │  before call
│ ├─ Review recent news/funding          │
│ ├─ Prepare company-specific talking    │
│ │  points + case studies               │
│ └─ Create call agenda                  │
│                                        │
│ Call structure (AE-led):                │ During call
│ │                                      │
│ ├─ Intro (2 min):                      │
│ │  "Thanks for meeting. Briefly we     │
│ │   help enterprises orchestrate       │
│ │   AI agents at scale. I'm curious    │
│ │   about your use case..."            │
│ │                                      │
│ ├─ Discovery questions (15 min):       │
│ │  1. "Walk me through your current    │
│ │     workflow"                        │
│ │  2. "What are the biggest challenges?"
│ │  3. "Have you tried other solutions? │
│ │     What was missing?"               │
│ │  4. "What would success look like?"  │
│ │  5. "Who else needs to be involved?" │
│ │  6. "What's your timeline?"          │
│ │  7. "What's your budget range?"      │
│ │                                      │
│ ├─ Demo / Feature walkthrough (10 min):│
│ │  - Show demo relevant to their use   │
│ │    case                              │
│ │  - Highlight 2-3 key differentiators │
│ │  - Don't over-feature (stay focused) │
│ │  - Ask for feedback on features      │
│ │                                      │
│ ├─ Solution architecture (5 min):      │
│ │  - How we'd solve their problem      │
│ │  - Integration approach              │
│ │  - Timeline to deployment            │
│ │                                      │
│ └─ Next steps (3 min):                 │
│    "Here's what I'm thinking... [next  │
│     action]. Does that make sense?"    │
│                                        │
│ Post-call (AE):                        │
│ ├─ Send meeting notes within 2 hours   │
│ ├─ Highlight action items + owners     │
│ ├─ Share any relevant case studies     │
│ ├─ Add to nurture sequence if not MQL  │
│ └─ Log call details in CRM             │
│                                        │
└────────────────────────────────────────┘
         ▼
    Call outcome: 3 paths


OUTCOME 1: Good fit → Advance to proposal
    │
    ▼
STEP 4A: PROPOSAL & NEGOTIATION (T+10 to T+30 days)
═════════════════════════════════════════════════════════════

Call confirmed good fit
    │
    ▼
┌────────────────────────────────────────┐
│ Proposal Preparation                   │
│                                        │
│ AE creates custom proposal:            │  T+2-5 days
│ ├─ Company name & branding             │  after call
│ ├─ Executive summary (1 page):         │
│ │  ├─ Problem statement                │
│ │  ├─ Proposed solution                │
│ │  └─ Expected outcomes                │
│ ├─ Solution architecture:              │
│ │  ├─ Integration points               │
│ │  ├─ Deployment timeline              │
│ │  └─ Scalability notes                │
│ ├─ Pricing section:                    │
│ │  ├─ Annual subscription fee          │
│ │  ├─ Implementation/setup fee (opt.)   │
│ │  ├─ Optional: Volume discounts       │
│ │  ├─ Payment terms (NET 30, etc.)     │
│ │  └─ Renewal terms                    │
│ ├─ SLA & support:                      │
│ │  ├─ Uptime SLA (e.g., 99.95%)        │
│ │  ├─ Support response times           │
│ │  ├─ Dedicated CSM assignment         │
│ │  └─ Training/onboarding hours        │
│ ├─ Security & compliance:              │
│ │  ├─ SOC2 Type II certifications      │
│ │  ├─ GDPR/CCPA compliance             │
│ │  ├─ Data residency options           │
│ │  └─ Encryption standards             │
│ ├─ Legal terms (referenced):           │
│ │  ├─ Link to MSA                      │
│ │  ├─ Link to DPA (if needed)          │
│ │  └─ Link to SLA                      │
│ └─ Call to action:                     │
│    "Let's discuss next steps on       │
│     [date/time]. Any questions?"      │
│                                        │
│ Delivery:                              │
│ ├─ Email with PDF attached             │
│ ├─ Proposal request signature (e-sig) │
│ ├─ Link to proposal portal (track      │
│ │  opens, edits)                       │
│ └─ Timeline: "Looking to close by     │
│    [date, typically 30d]"              │
│                                        │
└────────────────────────────────────────┘
         ▼
    Proposal sent
    Waiting for stakeholder review


STEP 4B: NEGOTIATION (T+10 to T+30 days)
═════════════════════════════════════════════════════════════

Customer reviews proposal
    │
    ├───────────────────┬──────────────┐
    ▼                   ▼              ▼
    Approved        Questions       Negotiations
    (40%)          (40%)           (20%)
    │               │               │
    │               ▼               ▼
    │        AE responds         Back-and-forth
    │        via email           Typically:
    │        or call             ├─ Pricing
    │               │            ├─ Terms
    │               ▼            ├─ Support SLA
    │        Resolved            └─ Custom features
    │               │                 │
    └───────────────┼─────────────────┤
                    │                 │
                    ▼                 ▼
                Customer            Customer
                ready to           signs off
                sign (80%)         (70-80%)


Negotiation tactics (AE toolkit):
├─ Price negotiation:
│  ├─ Bundled vs. tiered discounting
│  ├─ Multi-year commitment discounts (10-15%)
│  ├─ Volume incentives (add-on modules)
│  └─ Implementation fee trade-offs
├─ Terms negotiation:
│  ├─ Auto-renewal terms (1-year standard)
│  ├─ Termination clauses
│  ├─ Amendment flexibility
│  └─ Escalation protocols
├─ Support negotiation:
│  ├─ Response time SLAs
│  ├─ Dedicated vs. shared CSM
│  ├─ Training hours included
│  └─ Named contacts for escalation
└─ Feature requests:
    ├─ Evaluate feasibility
    ├─ Quote custom development (if needed)
    ├─ Position standard features as alternatives
    └─ Defer to roadmap for future items

Success rate: 70-80% of proposals → signed
Cycle time: 2-4 weeks typical


OUTCOME 2: Not yet qualified → nurture
    │
    ▼
    Auto-nurture sequence
    └─ Monthly check-in emails
    └─ Quarterly calls
    └─ Product updates + ROI content
    └─ Target: Convert to MQL within 6 months


OUTCOME 3: Not a fit → decline + alumni
    │
    ▼
    Polite close-out
    Add to alumni list for future outreach
    Referral request: "Know anyone who'd benefit?"

```

### Enterprise Success Metrics

```
Lead generation:
├─ Form submissions: [TBD per month]
├─ Lead quality (MQL score ≥70): 40-60% of forms
├─ Average lead quality: 60+ points
└─ Lead value: Correlate to close rate

Sales productivity:
├─ First response time: <2 hours (24/7)
├─ Call booking rate: 35-40% of SQLs
├─ Call-to-proposal rate: 60-70%
├─ Proposal-to-signature: 70-80%
├─ Overall win rate: 50-60%
└─ Sales cycle: 30-60 days average

Deal economics:
├─ ACV (Annual Contract Value): $5K-50K+
├─ New bookings per month: [TBD]
├─ Deal size distribution:
│  ├─ <$10K: 30%
│  ├─ $10K-25K: 40%
│  ├─ >$25K: 30%
├─ Expansion revenue: 20%+ year-over-year
└─ Retention rate: 90%+ (target: 95%)

Customer quality:
├─ Time to initial ROI: <30 days
├─ Onboarding success: 95%+ complete
├─ Feature adoption: >5 distinct features
├─ Support satisfaction: 4.5+/5.0 NPS
└─ Churn rate: <5% annually
```

---

## 📧 Communication Templates

### Welcome Email (All Tiers)

```
Subject: Welcome to SyncPulse, [Name]! 🚀

Hi [Name],

Your account is live, and we're excited to have you on board!

You're all set with a [Free/Pro/Enterprise] account. Here's what's next:

1. [Get your first swarm running] (5 minutes)
   ✓ Choose a template or start from scratch
   ✓ Add agents and skills
   ✓ Watch your swarm execute

2. [Explore the skill marketplace] (3 minutes)
   ✓ 50+ integrations available
   ✓ Add new capabilities to your swarms
   ✓ Custom skill support (Pro/Enterprise)

3. [Join our community] (2 minutes)
   ✓ Discord: 10K+ builders
   ✓ Weekly office hours
   ✓ Share what you're building

[Go to Dashboard]

Questions? We're here to help:
├─ Help docs: https://docs.syncpulse.io
├─ Chat support: [Link]
└─ Email: support@syncpulse.io

Let's build something amazing together.

Best,
The SyncPulse Team
```

### Upgrade Prompt (Free → Pro)

```
Subject: Unlock unlimited swarms and 50+ integrations

Hey [Name],

You've been crushing it on SyncPulse! You've run [N] swarms and [X] tasks.

Ready for more? Pro gives you:
✓ Unlimited agents and swarms
✓ 50+ premium integrations (vs 10 free)
✓ Real-time analytics dashboard
✓ Email support with 48h SLA
✓ API access for custom workflows

[Try Pro Free (14 days)] - No credit card needed

The best part? You keep all your current swarms. Upgrade anytime.

Have questions? [Schedule a call with our team]

–The SyncPulse Team
```

---

## 🔗 Related Documentation

- [LANDING_PAGE_FLOW.md](./LANDING_PAGE_FLOW.md) - Landing page customer journey
- [SUBSCRIPTION_TIERS.md](./SUBSCRIPTION_TIERS.md) - Pricing strategy & feature matrix
- [../README.md](../README.md) - Product overview
- [../DEPLOYMENT.md](./DEPLOYMENT.md) - Technical deployment details

---

**Last Reviewed**: May 2026  
**Next Review**: August 2026  
**Owner**: VP Sales, Sales Operations
