# Magic Link Email Authentication

## Overview

SyncPulse supports passwordless authentication using magic links sent via email. Users receive a secure, time-limited link that automatically authenticates them without needing to enter a password.

## Features

- **Passwordless Authentication**: No need to remember or manage passwords
- **Secure Tokens**: Cryptographically secure random tokens with 32-byte entropy
- **Time-Limited Links**: Links expire after 15 minutes for security
- **Rate Limiting**: Maximum 5 requests per email per hour
- **Single-Use Links**: Once used, links cannot be reused
- **Attempt Tracking**: Links become invalid after 5 failed validation attempts
- **Email Integration**: Uses nodemailer to send emails with styled HTML templates

## Authentication Flow

### Step 1: Request Magic Link
User provides email address and optional name on the magic link request page.

```
GET /auth/magic-link-request
```

The page displays:
- Email input field
- Optional name field
- How magic links work explanation
- Link to traditional password login

### Step 2: Email Sent
System generates secure token and sends email with:
- Formatted email with HTML and plain text versions
- Magic link URL valid for 15 minutes
- Clear expiration notice
- SyncPulse branding

**API Endpoint:**
```bash
POST /api/auth/magic-link/request
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Magic link sent to your email",
  "email": "user@example.com"
}
```

### Step 3: User Clicks Link
Magic link URL includes secure token as query parameter:
```
https://your-domain.com/auth/magic-link?token=SECURE_TOKEN
```

The page:
- Validates token on load
- Shows "Authenticating..." message with spinner
- Automatically creates session on success
- Redirects to dashboard after 1.5 seconds

### Step 4: Token Validation
Server validates token:
- Token exists and hasn't expired (15-minute window)
- Token hasn't been used before
- Validation attempts < 5
- Generates session token on success

**API Endpoint:**
```bash
POST /api/auth/magic-link/validate
Content-Type: application/json

{
  "token": "SECURE_TOKEN"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Magic link validated successfully",
  "email": "user@example.com",
  "sessionToken": "session-token-hex",
  "expiresAt": 1715817600000
}
```

**Response (Error):**
```json
{
  "error": "Magic link has expired. Please request a new one."
}
```

## File Structure

```
packages/web/
├── app/
│   └── auth/
│       ├── magic-link-request/
│       │   └── page.tsx              # Magic link request UI
│       └── magic-link/
│           └── page.tsx              # Magic link callback/validation
│   └── api/
│       └── auth/
│           └── magic-link/
│               ├── request/
│               │   └── route.ts      # Request endpoint
│               └── validate/
│                   └── route.ts      # Validation endpoint
├── MAGIC_LINK_EMAIL_AUTH.md          # This file
```

```
packages/skills/syncpulse/src/
├── services/
│   ├── EmailService.ts               # Email sending service
│   └── MagicLinkService.ts           # Magic link generation and validation
```

## Components

### MagicLinkRequestPage (`packages/web/app/auth/magic-link-request/page.tsx`)

UI for requesting a magic link with:
- Email input (required)
- Name input (optional)
- Form submission handling
- "Link sent" confirmation screen
- Error handling and retry functionality
- Link to traditional login

**States:**
- `request`: Initial form
- `sent`: Confirmation after sending
- `error`: Error message with retry option

### MagicLinkPage (`packages/web/app/auth/magic-link/page.tsx`)

Callback page that validates token and authenticates user:
- Extracts token from URL query parameter
- Shows "Authenticating..." with spinner during validation
- Displays success screen on valid token
- Shows error options if validation fails
- Automatically redirects to dashboard on success

**States:**
- `validating`: Token validation in progress
- `success`: Token valid, redirecting
- `error`: Token invalid or expired

### MagicLinkService (`packages/skills/syncpulse/src/services/MagicLinkService.ts`)

Core service for magic link operations:

**Methods:**

```typescript
// Request and send magic link
generateAndSendMagicLink(
  email: string,
  recipientName?: string
): Promise<{ success: boolean; error?: string; tokenLength?: number }>

// Validate token
validateMagicLink(token: string): MagicLinkValidation

// Remove token after successful authentication
consumeMagicLink(token: string): boolean

// Get token information (admin/debugging)
getTokenInfo(token: string): MagicLinkToken | null

// Clean up expired tokens
cleanupExpiredTokens(): number

// Get service statistics
getStats(): { activeTokens: number; trackedEmails: number; ... }
```

## API Routes

### Request Magic Link (`POST /api/auth/magic-link/request`)

Generates secure token and queues email for sending.

**Request:**
```json
{
  "email": "user@example.com",
  "name": "Optional Name"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Magic link sent to your email",
  "email": "user@example.com"
}
```

**Response (400):**
```json
{
  "error": "Invalid email address"
}
```

**Response (429):**
```json
{
  "error": "Too many magic link requests. Please try again in 45 minutes."
}
```

### Validate Magic Link (`POST /api/auth/magic-link/validate`)

Validates token and creates authenticated session.

**Request:**
```json
{
  "token": "64-character-hex-string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Magic link validated successfully",
  "email": "user@example.com",
  "sessionToken": "session-token-hex",
  "expiresAt": 1715817600000
}
```

**Response (401):**
```json
{
  "error": "Invalid or expired magic link"
}
```

## Email Template

The magic link email includes:

**HTML Template:**
- Styled header with SyncPulse branding
- Greeting with recipient name
- Clear call-to-action button
- Fallback link text
- Expiration notice
- Footer with privacy notice

**Text Template:**
- Plain text version for email clients that don't support HTML
- All information preserved
- Link included in plain text format

**Template Variables:**
- `{{recipientName}}`: User's name or "User" if not provided
- `{{expiryTime}}`: Time until link expires (15 minutes)
- `{magicLinkUrl}`: Full URL to authentication link

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MAIL_HOST` | No | SMTP server hostname |
| `MAIL_PORT` | No | SMTP server port (default: 587) |
| `MAIL_SECURE` | No | Use TLS/SSL (default: false) |
| `MAIL_USER` | No | SMTP authentication username |
| `MAIL_PASS` | No | SMTP authentication password |
| `MAIL_FROM` | No | Sender email address |
| `NEXTAUTH_URL` | No | Base URL for magic links (default: http://localhost:3000) |

**Example .env.local:**
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
MAIL_FROM=noreply@fused-gaming.io
NEXTAUTH_URL=https://your-domain.com
```

## Security Features

### Token Generation
- 32 bytes of cryptographic randomness (256 bits)
- Hex-encoded to 64 character string
- Unique token for each request
- Server-side only - never exposed to client in storage

### Token Storage
- Tokens hashed before storage (SHA-256)
- Hash stored in memory or database
- Original token only in email
- Token never logged or exposed in error messages

### Expiration
- 15-minute validity window
- Automatic cleanup of expired tokens
- No recovery or extension of expired links

### Rate Limiting
- Maximum 5 magic link requests per email per hour
- Tracking by email address
- Prevents brute force attacks
- Returns helpful "try again in X minutes" message

### Single Use
- Tokens marked as used after validation
- Cannot be reused even with correct value
- Attempt tracking prevents repeated validation
- After 5 validation attempts, token destroyed

### Email Security
- Tokens included in URLs only (not email body)
- Plain text fallback prevents HTML-only attacks
- No sensitive data in email preview text
- Footer includes privacy notice and unsubscribe option

## Usage

### 1. Request Magic Link

User navigates to `/auth/magic-link-request` and:
1. Enters email address
2. Optionally enters name
3. Clicks "Send Magic Link"
4. Receives confirmation message

### 2. Check Email

User receives email with:
1. Styled HTML message
2. "Authenticate Now" button
3. Plain text fallback link
4. Expiration notice

### 3. Click Link

User clicks link in email, which:
1. Navigates to `/auth/magic-link?token=SECURE_TOKEN`
2. Page validates token automatically
3. Creates authenticated session
4. Redirects to dashboard
5. Session lasts 24 hours

## Testing

### Local Testing

For development without email setup:

1. Check console output for generated token
2. Manually navigate to: `http://localhost:3000/auth/magic-link?token=TOKEN`
3. Session will be created on success

### Request Test Link

```bash
curl -X POST http://localhost:3000/api/auth/magic-link/request \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

### Validate Test Token

```bash
curl -X POST http://localhost:3000/api/auth/magic-link/validate \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_FROM_REQUEST"
  }'
```

## Production Setup

### Email Configuration

Set environment variables for your email provider:

**Gmail:**
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-16-digit-app-password
MAIL_FROM=noreply@your-domain.com
```

**AWS SES:**
```env
MAIL_HOST=email-smtp.region.amazonaws.com
MAIL_PORT=587
MAIL_USER=AKIA...
MAIL_PASS=your-ses-password
MAIL_FROM=noreply@verified-domain.com
```

**SendGrid:**
```env
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USER=apikey
MAIL_PASS=SG.your-sendgrid-api-key
MAIL_FROM=noreply@your-domain.com
```

### Database Integration

In production, replace in-memory storage with database:

1. Create `MagicLinks` table with fields:
   - `id` (primary key)
   - `token_hash` (unique)
   - `email` (indexed)
   - `expires_at` (indexed)
   - `attempts` (integer)
   - `created_at` (timestamp)

2. Create `Sessions` table with fields:
   - `id` (primary key)
   - `session_token_hash` (unique)
   - `email` (indexed)
   - `expires_at` (indexed)
   - `created_at` (timestamp)

3. Implement cleanup jobs:
   - Run hourly to delete expired magic links
   - Run daily to delete expired sessions

### HTTPS Requirement

Magic links must be sent over HTTPS in production:
- Email links will include `https://` scheme
- Cookies will have `secure` flag set
- HSTS headers will enforce HTTPS

## Troubleshooting

### "Too many magic link requests"
- User exceeded 5 requests per hour
- Wait time shown in error message
- Check email spam folder for previous links

### "Magic link has expired"
- Link older than 15 minutes
- Request a new link from `/auth/magic-link-request`
- Links cannot be extended

### "Magic link has already been used"
- Token was already validated once
- Request a new link
- Used tokens are deleted after validation

### Email Not Received
1. Check spam/junk folder
2. Verify email address is correct
3. Check email server logs
4. Verify `MAIL_FROM` is authorized to send

### Email Service Not Configured
- `EmailService` logs warning if environment variables missing
- Set required `MAIL_*` environment variables
- Or initialize explicitly: `emailService.initializeWithConfig(config)`

## Future Enhancements

Potential improvements:

1. **Email Template Customization**
   - Branded HTML templates
   - Custom sender name and address
   - Localization support

2. **Enhanced Analytics**
   - Track magic link request trends
   - Monitor authentication success rates
   - Identify suspicious patterns

3. **Backup Codes**
   - Generate backup codes for account recovery
   - Use when email is unavailable
   - One-time use like magic links

4. **Link Preview Text**
   - Personalized email preview
   - Custom action descriptions
   - Multi-language support

5. **Scheduled Cleanup**
   - Automatic cleanup job for expired tokens
   - Configurable retention policies
   - Database optimization

6. **WebAuthn Integration**
   - FIDO2/WebAuthn as primary auth
   - Fallback to magic links
   - Passwordless + device-bound authentication

## API Integration

### Using MagicLinkService in Your Code

```typescript
import MagicLinkService from '@h4shed/skill-syncpulse/services/MagicLinkService';
import EmailService from '@h4shed/skill-syncpulse/services/EmailService';

// Initialize services
const emailService = new EmailService();
const magicLinkService = new MagicLinkService({
  emailService,
  baseUrl: 'https://your-domain.com',
  tokenExpiryMinutes: 15,
  maxAttemptsPerHour: 5
});

// Generate and send magic link
const result = await magicLinkService.generateAndSendMagicLink(
  'user@example.com',
  'John Doe'
);

if (result.success) {
  console.log('Magic link sent successfully');
} else {
  console.error('Failed to send magic link:', result.error);
}

// Validate magic link
const validation = magicLinkService.validateMagicLink(token);
if (validation.valid) {
  console.log('Authenticated as:', validation.email);
  magicLinkService.consumeMagicLink(token); // Remove token after use
} else {
  console.error('Invalid link:', validation.error);
}
```

---

**Version:** 1.0.0  
**Last Updated:** 2026-05-15  
**Status:** Production Ready ✅
