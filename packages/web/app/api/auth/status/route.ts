import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          authenticated: false,
          passwordChanged: false,
          message: 'Not authenticated'
        },
        { status: 200 }
      );
    }

    const sessionToken = authHeader.substring(7);

    // In a real app, this would check against a database/store
    // For now, we return a basic response
    return NextResponse.json(
      {
        authenticated: true,
        passwordChanged: false,
        sessionToken: sessionToken.substring(0, 8) + '****'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth status error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
