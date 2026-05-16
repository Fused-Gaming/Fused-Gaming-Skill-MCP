import { NextRequest, NextResponse } from 'next/server';
import { createSessionTokenCookie } from '@/lib/session';
import { SessionStore } from '@/lib/session-store';

/**
 * POST /api/auth/login
 * Handles user login and session token creation
 * Validates credentials against stored passwords (one-time or changed)
 */
export async function POST(request: NextRequest) {
  try {
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
