import { NextRequest, NextResponse } from 'next/server';
import { SessionStore } from '@/lib/session-store';

/**
 * POST /api/auth/magic-link/request
 * Generates a magic link token and sends it via email
 *
 * In production, this would integrate with nodemailer or other email service.
 * For development/testing, the token is included in response for testing.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Create magic link token
    const { token, expiresIn } = SessionStore.createMagicLinkToken(email);

    // Build the magic link URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const magicLinkUrl = `${baseUrl}/auth/magic-link/verify?token=${token}`;

    // IMPLEMENT EMAIL SENDING (currently commented out for dev)
    // In production, uncomment and configure your email service:
    /*
    try {
      await emailService.send({
        to: email,
        subject: 'Your Magic Link - SyncPulse',
        template: 'magic-link',
        data: {
          magicLink: magicLinkUrl,
          expiresIn: Math.round(expiresIn / 1000 / 60), // Convert to minutes
        },
      });
    } catch (emailError) {
      console.error('Failed to send magic link email:', emailError);
      // Don't fail the request - still return success so user knows to check email
    }
    */

    // For development/testing: include the token in the response
    // This allows testing without email setup
    const isDevelopment = process.env.NODE_ENV === 'development';
    const responseData: any = {
      success: true,
      message: 'Magic link generated successfully',
      email,
      expiresIn,
      // Include test token link in development for manual testing
      ...(isDevelopment && {
        _testToken: token,
        _testLink: magicLinkUrl,
        _testLinkNote: 'Available in development only. Use /auth/magic-link/verify?token=<token>',
      }),
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Magic link request error:', error);
    return NextResponse.json(
      { error: 'Failed to generate magic link' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/auth/magic-link/request
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
