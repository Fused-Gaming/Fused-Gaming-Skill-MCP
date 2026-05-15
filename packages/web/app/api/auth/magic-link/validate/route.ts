import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface ValidateMagicLinkBody {
  token: string;
}

// In-memory store for magic links
const magicLinks = new Map<string, {
  email: string;
  token: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
}>();

const activeSessions = new Map<string, {
  email: string;
  sessionToken: string;
  createdAt: number;
  expiresAt: number;
}>();

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

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ValidateMagicLinkBody;
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Magic link token is required' },
        { status: 400 }
      );
    }

    const tokenHash = hashToken(token);
    const magicLink = magicLinks.get(tokenHash);

    if (!magicLink) {
      return NextResponse.json(
        { error: 'Invalid or expired magic link' },
        { status: 401 }
      );
    }

    const now = Date.now();

    // Check if token has expired
    if (now > magicLink.expiresAt) {
      magicLinks.delete(tokenHash);
      return NextResponse.json(
        { error: 'Magic link has expired. Please request a new one.' },
        { status: 401 }
      );
    }

    // Check attempt limit
    if (magicLink.attempts >= 5) {
      magicLinks.delete(tokenHash);
      return NextResponse.json(
        { error: 'Too many validation attempts. Please request a new link.' },
        { status: 401 }
      );
    }

    // Update attempt count
    magicLink.attempts++;

    // Check if this is a successful validation (attempt will be exactly 1 after update)
    if (magicLink.attempts > 1) {
      return NextResponse.json(
        { error: 'Magic link has already been used' },
        { status: 401 }
      );
    }

    // Generate session token
    const sessionToken = generateSessionToken();
    const sessionExpiresAt = now + 24 * 60 * 60 * 1000; // 24 hours

    // Store session
    activeSessions.set(sessionToken, {
      email: magicLink.email,
      sessionToken,
      createdAt: now,
      expiresAt: sessionExpiresAt
    });

    // Remove magic link after successful use
    magicLinks.delete(tokenHash);

    // Log successful authentication
    console.log(`✅ Magic link authenticated for ${magicLink.email}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Magic link validated successfully',
        email: magicLink.email,
        sessionToken,
        expiresAt: sessionExpiresAt
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Magic link validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
