import { NextRequest, NextResponse } from 'next/server';
import { createSessionTokenCookie } from '@/lib/session';
import { SessionStore } from '@/lib/session-store';
import { checkRateLimit, RATE_LIMIT_CONFIGS, getClientIdentifier } from '@/lib/rate-limiter';

/**
 * POST /api/auth/magic-link/verify
 * Verifies a magic link token and creates a session
 * Protected by rate limiting to prevent brute force attacks
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
    const clientId = getClientIdentifier(clientIp);
    const rateLimitCheck = checkRateLimit(clientId, RATE_LIMIT_CONFIGS.magicLink);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Too many verification attempts. Please try again later.',
          retryAfter: rateLimitCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitCheck.retryAfterSeconds),
          },
        }
      );
    }

    const body = await request.json();
    const { token } = body;

    // Validate input
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify the magic link token
    const { email, isValid } = SessionStore.verifyMagicLinkToken(token);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired magic link' },
        { status: 401 }
      );
    }

    // Get or create user
    let user = SessionStore.getUserByEmail(email);
    if (!user) {
      // This shouldn't happen, but handle gracefully
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create a session for the user
    const userId = user.userId;
    const { token: sessionToken, expiresIn } = SessionStore.createSession(
      userId,
      email,
      false // Magic link auth doesn't mark password as changed initially
    );

    const response = NextResponse.json(
      {
        success: true,
        sessionToken,
        expiresIn,
        user: {
          id: userId,
          email,
          name: email.split('@')[0],
        },
      },
      { status: 200 }
    );

    // Set session cookie
    response.headers.set(
      'Set-Cookie',
      createSessionTokenCookie(sessionToken, expiresIn)
    );

    return response;
  } catch (error) {
    console.error('Magic link verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/magic-link/verify
 * Alternative verification via query parameters (for email client links)
 * Protected by rate limiting to prevent brute force attacks
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
    const clientId = getClientIdentifier(clientIp);
    const rateLimitCheck = checkRateLimit(clientId, RATE_LIMIT_CONFIGS.magicLink);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Too many verification attempts. Please try again later.',
          retryAfter: rateLimitCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitCheck.retryAfterSeconds),
          },
        }
      );
    }

    const { searchParams } = request.nextUrl;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify the magic link token
    const { email, isValid } = SessionStore.verifyMagicLinkToken(token);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired magic link' },
        { status: 401 }
      );
    }

    // Get user
    const user = SessionStore.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create a session for the user
    const userId = user.userId;
    const { token: sessionToken, expiresIn } = SessionStore.createSession(
      userId,
      email,
      false
    );

    const response = NextResponse.json(
      {
        success: true,
        sessionToken,
        expiresIn,
        user: {
          id: userId,
          email,
          name: email.split('@')[0],
        },
      },
      { status: 200 }
    );

    // Set session cookie
    response.headers.set(
      'Set-Cookie',
      createSessionTokenCookie(sessionToken, expiresIn)
    );

    return response;
  } catch (error) {
    console.error('Magic link verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/auth/magic-link/verify
 * CORS preflight handler
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
