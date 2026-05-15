import { NextRequest, NextResponse } from 'next/server';
import { createSessionTokenCookie } from '@/lib/session';

/**
 * POST /api/auth/login
 * Handles user login and session token creation
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

    // TODO: Implement actual authentication logic
    // This is a placeholder implementation
    if (email === 'demo@example.com' && password === 'demo') {
      // Generate a mock session token
      const sessionToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiresIn = 24 * 60 * 60 * 1000; // 24 hours

      const response = NextResponse.json(
        {
          success: true,
          sessionToken,
          expiresIn,
          user: {
            id: 'user_demo',
            email: 'demo@example.com',
            name: 'Demo User',
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
    }

    // Invalid credentials
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
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
