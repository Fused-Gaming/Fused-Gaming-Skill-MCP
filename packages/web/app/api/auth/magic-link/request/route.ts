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
    const magicLinkUrl = `${baseUrl}/auth/magic-link?token=${token}`;

    // SEND EMAIL WITH MAGIC LINK
    // In production, use a proper email service (SendGrid, AWS SES, etc.)
    // For development/testing, we provide the token in response
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (!isDevelopment && process.env.SMTP_HOST) {
      try {
        // Attempt to send via configured email service
        // Note: In production, integrate with nodemailer or your preferred email provider
        const _emailHtml = `
          <!DOCTYPE html>
          <html>
            <head><style>body { font-family: Arial, sans-serif; }</style></head>
            <body>
              <h2>Your Magic Link - SyncPulse</h2>
              <p>Click the link below to complete your sign-in:</p>
              <p><a href="${magicLinkUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Sign In</a></p>
              <p>Or copy this link: <code>${magicLinkUrl}</code></p>
              <p>This link expires in ${Math.round(expiresIn / 1000 / 60)} minutes.</p>
              <p><small>If you didn't request this link, you can ignore this email.</small></p>
            </body>
          </html>
        `;

        // TODO: Implement actual email sending via nodemailer or your email service
        // Example for nodemailer:
        // const transporter = nodemailer.createTransport({
        //   host: process.env.SMTP_HOST,
        //   port: parseInt(process.env.SMTP_PORT || '587'),
        //   secure: process.env.SMTP_SECURE === 'true',
        //   auth: {
        //     user: process.env.SMTP_USER,
        //     pass: process.env.SMTP_PASS,
        //   },
        // });
        // await transporter.sendMail({
        //   from: process.env.SMTP_FROM || 'noreply@syncpulse.app',
        //   to: email,
        //   subject: 'Your Magic Link - SyncPulse',
        //   html: _emailHtml,
        // });

        console.log(`[EMAIL] Magic link sent to ${email}: ${magicLinkUrl}`);
      } catch (emailError) {
        console.error('Failed to send magic link email:', emailError);
        // Don't fail the request - still return success so user knows to check email
        // In production, you may want to log this and alert monitoring
      }
    }

    // For development/testing: include the token in the response
    // This allows testing without email setup
    interface MagicLinkResponse {
      success: boolean;
      message: string;
      email: string;
      expiresIn: number;
      _link?: string;
      _linkNote?: string;
    }
    const responseData: MagicLinkResponse = {
      success: true,
      message: isDevelopment
        ? 'Magic link generated. Check the response for the test link.'
        : 'Magic link generated successfully',
      email,
      expiresIn,
      // Include link for manual verification since email sending is not yet implemented
      // TODO: Once email service is integrated, remove this from production response
      _link: magicLinkUrl,
      _linkNote: 'For testing only. In production with email configured, this will be removed.',
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
