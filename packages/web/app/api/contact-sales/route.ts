import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, RATE_LIMIT_CONFIGS, getClientIdentifier } from '@/lib/rate-limiter';

interface ContactData {
  name: string;
  email: string;
  company: string;
  agents: string;
  message: string;
}

// In-memory storage for demo (replace with database in production)
const submissions: Array<ContactData & { submittedAt: string }> = [];

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
    const clientId = getClientIdentifier(clientIp);
    const rateLimitCheck = checkRateLimit(clientId, RATE_LIMIT_CONFIGS.contactForm);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Too many submissions. Please try again later.',
          retryAfter: rateLimitCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitCheck.retryAfterSeconds),
          },
        }
      );
    }

    const data: ContactData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.company || !data.agents || !data.message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Store submission
    submissions.push({
      ...data,
      submittedAt: new Date().toISOString(),
    });

    // TODO: In production, send email notification to sales team
    // TODO: Store in database instead of memory

    return NextResponse.json(
      { success: true, message: 'Thank you for your inquiry. We will be in touch soon.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact sales submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // For development/testing: retrieve submissions
  // Remove in production or add authentication
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.json(submissions);
  }

  return NextResponse.json(
    { error: 'Not found' },
    { status: 404 }
  );
}
