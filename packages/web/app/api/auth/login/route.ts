import { NextRequest, NextResponse } from 'next/server';
import { createSessionTokenCookie } from '@/lib/session';
import { SessionStore } from '@/lib/session-store';
import { checkRateLimit, RATE_LIMIT_CONFIGS, getClientIdentifier } from '@/lib/rate-limiter';

/**
 * POST /api/auth/login
 * Handles user login and session token creation
 * Validates credentials against stored passwords (one-time or changed)
 * Protected by rate limiting to prevent brute force attacks
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
    const clientId = getClientIdentifier(clientIp);
    const rateLimitCheck = checkRateLimit(clientId, RATE_LIMIT_CONFIGS.login);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Too many login attempts. Please try again later.',
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
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate credentials using unified session store
    // Accepts BOTH initial one-time password AND changed password
    if (!SessionStore.validatePassword(email, password)) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user has changed their password in a previous session
    const passwordChanged = SessionStore.hasChangedPassword(email);

    // Create session in the unified store
    const userId = `user_${email.split('@')[0]}`;
    const { token: sessionToken, expiresIn } = SessionStore.createSession(
      userId,
      email,
      passwordChanged
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

    // Set session cookie with proper expiration
    response.headers.set(
      'Set-Cookie',
      createSessionTokenCookie(sessionToken, expiresIn)
    );

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/auth/login
 * CORS preflight handler
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
