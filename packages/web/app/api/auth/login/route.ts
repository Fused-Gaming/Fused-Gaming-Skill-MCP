import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface LoginRequest {
  password: string;
}

interface StoredSession {
  sessionToken: string;
  timestamp: number;
  authenticated: boolean;
  passwordChanged: boolean;
  attempts: number;
  lastAttempt: number;
}

const SESSIONS_MAP = new Map<string, StoredSession>();
const ACCOUNT_LOCK_DURATION = 3600000; // 1 hour
const MAX_ATTEMPTS = 5;
const ONE_TIME_PASSWORD = process.env.SYNCPULSE_ONE_TIME_PASSWORD || 'Quantum-Phoenix-Stellar-Cascade';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LoginRequest;
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { message: 'Password is required' },
        { status: 400 }
      );
    }

    // Check account lockout (in a real app, this would be in a database)
    const accountKey = 'admin-account';
    const session = SESSIONS_MAP.get(accountKey);

    if (session && session.attempts >= MAX_ATTEMPTS) {
      const timeSinceLock = Date.now() - session.lastAttempt;
      if (timeSinceLock < ACCOUNT_LOCK_DURATION) {
        const minutesLeft = Math.ceil((ACCOUNT_LOCK_DURATION - timeSinceLock) / 60000);
        return NextResponse.json(
          { message: `Account locked. Try again in ${minutesLeft} minutes.` },
          { status: 429 }
        );
      } else {
        // Unlock after timeout
        SESSIONS_MAP.delete(accountKey);
      }
    }

    // Verify one-time password
    if (password !== ONE_TIME_PASSWORD) {
      const newSession = session ? { ...session, attempts: session.attempts + 1, lastAttempt: Date.now() } : {
        sessionToken: '',
        timestamp: Date.now(),
        authenticated: false,
        passwordChanged: false,
        attempts: 1,
        lastAttempt: Date.now()
      };
      SESSIONS_MAP.set(accountKey, newSession);

      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 401 }
      );
    }

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const newSession: StoredSession = {
      sessionToken,
      timestamp: Date.now(),
      authenticated: true,
      passwordChanged: false,
      attempts: 0,
      lastAttempt: Date.now()
    };

    SESSIONS_MAP.set(accountKey, newSession);

    return NextResponse.json(
      {
        message: 'Login successful',
        sessionToken,
        requiresPasswordChange: true
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
