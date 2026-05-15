import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/session';

/**
 * GET /api/auth/session
 * Validates and returns current session information
 */
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;
    const validation = validateSession(sessionToken);

    if (!validation.isValid) {
      return NextResponse.json(
        { isValid: false, error: validation.error },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        isValid: true,
        sessionToken: validation.token?.value,
        user: {
          id: 'user_demo',
          email: 'demo@example.com',
          name: 'Demo User',
        },
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
