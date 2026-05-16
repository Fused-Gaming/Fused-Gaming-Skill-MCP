import { NextRequest, NextResponse } from 'next/server';
import { SessionStore } from '@/lib/session-store';

/**
 * GET /api/auth/session
 * Validates and returns current session information
 * Uses unified session store for token validation
 */
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;

    // Validate session using the unified store
    const session = SessionStore.getSession(sessionToken || '');

    if (!session) {
      return NextResponse.json(
        { isValid: false, error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        isValid: true,
        sessionToken: session.token,
        user: {
          id: session.userId,
          email: session.email,
          name: session.email.split('@')[0],
        },
        passwordChanged: session.passwordChanged,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/auth/session
 * CORS preflight handler
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
