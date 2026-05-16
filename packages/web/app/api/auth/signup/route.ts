import { NextRequest, NextResponse } from 'next/server';
import { SessionStore } from '@/lib/session-store';

/**
 * POST /api/auth/signup
 * Creates a new user account with email and password
 * Stores credentials in SessionStore and returns a session token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate input
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      );
    }

    // Create new user with password
    const userResult = SessionStore.createUser(email, password);
    if (!userResult) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create session for the new user
    const { token, expiresIn } = SessionStore.createSession(userResult.userId, email, false);

    // Return success with session token
    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        sessionToken: token,
        expiresIn,
        email,
        name: name.trim(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/auth/signup
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
