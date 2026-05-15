import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface RequestMagicLinkBody {
  email: string;
  name?: string;
}

// In-memory store for magic links (in production, use a database)
const magicLinks = new Map<string, {
  email: string;
  token: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
}>();

const rateLimitMap = new Map<string, Array<number>>();

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function hashToken(token: string): string {
  // Simple hash for demonstration - in production, use crypto.subtle
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RequestMagicLinkBody;
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Rate limiting: max 5 requests per email per hour
    const now = Date.now();
    const attempts = rateLimitMap.get(email) || [];
    const recentAttempts = attempts.filter(t => now - t < 3600000); // 1 hour

    if (recentAttempts.length >= 5) {
      const oldestAttempt = Math.min(...recentAttempts);
      const waitMinutes = Math.ceil((oldestAttempt + 3600000 - now) / 60000);
      return NextResponse.json(
        { error: `Too many magic link requests. Please try again in ${waitMinutes} minutes.` },
        { status: 429 }
      );
    }

    // Update rate limit tracking
    recentAttempts.push(now);
    rateLimitMap.set(email, recentAttempts);

    // Generate token
    const token = generateSecureToken();
    const tokenHash = hashToken(token);
    const expiresAt = now + 15 * 60 * 1000; // 15 minutes

    // Store magic link
    magicLinks.set(tokenHash, {
      email,
      token,
      expiresAt,
      attempts: 0,
      createdAt: now
    });

    // In production, send email using EmailService
    // For now, log the token for testing
    console.log(`🔐 Magic link generated for ${email}`);
    console.log(`Token: ${token}`);
    console.log(`Valid for 15 minutes`);

    // Construct magic link URL (in production, use environment variable)
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const magicLinkUrl = `${baseUrl}/auth/magic-link?token=${token}`;

    // TODO: Send email with nodemailer
    // const emailService = new EmailService();
    // const result = await emailService.sendEmail(
    //   { email, name },
    //   magicLinkTemplate,
    //   { magicLinkUrl, expiryTime: '15' }
    // );

    return NextResponse.json(
      {
        success: true,
        message: 'Magic link sent to your email',
        email: email,
        // For testing only - remove in production
        _testToken: token
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Magic link request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
