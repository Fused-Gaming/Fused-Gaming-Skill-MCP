import { NextRequest, NextResponse } from 'next/server';
import { createLogoutCookie } from '@/lib/session';
import { SessionStore } from '@/lib/session-store';

/**
 * POST /api/auth/logout
 * Handles user logout and session token clearing
 * Destroys the session in the unified store
 */
export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('sessionToken')?.value;

    // Destroy the session in the store if it exists
    if (sessionToken) {
      SessionStore.deleteSession(sessionToken);
    }

    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear session cookie
    response.headers.set('Set-Cookie', createLogoutCookie());

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/auth/logout
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
