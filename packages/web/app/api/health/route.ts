import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch {
    return NextResponse.json(
      { status: 'unhealthy', error: 'Health check failed' },
      { status: 500 }
    );
  }
}
