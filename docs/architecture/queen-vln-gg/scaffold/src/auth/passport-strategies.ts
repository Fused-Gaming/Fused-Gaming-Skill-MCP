/**
 * Passport strategies for the Queen control plane.
 *
 * - jwtStrategy: validates dashboard session tokens issued after GitHub OAuth.
 * - githubStrategy: human login, maps GitHub identity to {org, role} via the
 *   `operators` table.
 * - apiKeyStrategy: agents/clones authenticate with a long-lived API key
 *   (looked up by hash against the `agents` table) for telemetry ingest.
 *
 * Ported from src/orchestration-api/passport-auth-strategy.ts in
 * Fused-Gaming-Skill-MCP - keeps the same fail-closed JWT_SECRET check and
 * requireRole/requirePermission middleware shape.
 */
import { createHash } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as CustomStrategy } from 'passport-custom';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { supabase } from '../db/supabase.js';

export interface AuthUser {
  id: string;
  org: string;
  role: 'admin' | 'operator' | 'viewer' | 'agent';
  permissions: string[];
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET environment variable is not set. ' +
      'Set JWT_SECRET to a secure random string before running the application. ' +
      'Example: JWT_SECRET=$(openssl rand -base64 32) npm run dev'
  );
}

const JWT_EXPIRY = '24h';

export const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  (payload: AuthUser, done) => {
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return done(null, false, { message: 'Token expired' });
    }
    done(null, payload);
  }
);

export const githubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/api/auth/github/callback',
  },
  async (
    _accessToken: string,
    _refreshToken: string,
    profile: { id: string; username?: string },
    done: (err: Error | null, user?: AuthUser) => void
  ) => {
    // Org/role assignment is a manual allowlist lookup for now - replace with
    // a real org-membership table once multi-org onboarding is needed.
    const { data } = await supabase
      .from('operators')
      .select('org, role')
      .eq('github_id', profile.id)
      .maybeSingle();

    if (!data) {
      return done(new Error(`GitHub user ${profile.username ?? profile.id} is not registered as an operator`));
    }

    done(null, {
      id: profile.id,
      org: data.org,
      role: data.role,
      permissions: [],
    });
  }
);

/**
 * API key strategy for agents/clones reporting usage telemetry.
 * Key is hashed (sha256) before lookup; raw keys are never stored.
 */
export const apiKeyStrategy = new CustomStrategy(async (req: Request, done) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return done(null, false, { message: 'Missing API key' });
  }
  const rawKey = header.slice('Bearer '.length);
  const keyHash = createHash('sha256').update(rawKey).digest('hex');

  const { data: agent } = await supabase
    .from('agents')
    .select('id, org, is_active')
    .eq('api_key_hash', keyHash)
    .maybeSingle();

  if (!agent || !agent.is_active) {
    return done(null, false, { message: 'Invalid or inactive API key' });
  }

  await supabase.from('agents').update({ last_heartbeat: new Date().toISOString() }).eq('id', agent.id);

  const user: AuthUser = {
    id: agent.id,
    org: agent.org,
    role: 'agent',
    permissions: ['write:usage_events', 'read:own_license'],
  };
  done(null, user);
});

export function requireRole(...allowedRoles: AuthUser['role'][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as AuthUser | undefined;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `This endpoint requires one of: ${allowedRoles.join(', ')}`,
      });
    }
    next();
  };
}

export function requirePermission(...permissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as AuthUser | undefined;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const hasPermission = permissions.some((p) => user.permissions.includes(p));
    if (!hasPermission) {
      return res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions for this action' });
    }
    next();
  };
}

export function generateSessionToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function registerStrategies(): void {
  passport.use('jwt', jwtStrategy);
  passport.use('github', githubStrategy);
  passport.use('api-key', apiKeyStrategy);
}
