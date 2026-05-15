import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface ChangePasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

interface StoredPassword {
  hash: string;
  salt: string;
  timestamp: number;
}

const PASSWORDS_MAP = new Map<string, StoredPassword>();
const SESSION_TOKENS = new Map<string, { authenticated: boolean; passwordChanged: boolean; timestamp: number }>();

function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return { hash, salt };
}

function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 16) {
    errors.push('Password must be at least 16 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain repeated characters (e.g., aaa)');
  }
  if (/123|456|789|qwerty|password|abc/i.test(password)) {
    errors.push('Password contains common patterns that are not allowed');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const sessionToken = authHeader.substring(7);
    const sessionInfo = SESSION_TOKENS.get(sessionToken);

    if (!sessionInfo || !sessionInfo.authenticated || sessionInfo.passwordChanged) {
      return NextResponse.json(
        { message: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const body = await request.json() as ChangePasswordRequest;
    const { newPassword, confirmPassword } = body;

    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        { message: 'Both password fields are required' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    const validation = validatePasswordStrength(newPassword);
    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Password does not meet strength requirements', errors: validation.errors },
        { status: 400 }
      );
    }

    // Hash and store password
    const { hash, salt } = hashPassword(newPassword);
    PASSWORDS_MAP.set('admin-password', {
      hash,
      salt,
      timestamp: Date.now()
    });

    // Mark session as having changed password
    const updatedSession = { ...sessionInfo, passwordChanged: true };
    SESSION_TOKENS.set(sessionToken, updatedSession);

    return NextResponse.json(
      {
        message: 'Password changed successfully',
        success: true
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
