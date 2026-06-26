import { Router, type Request, type Response } from 'express';
import passport from 'passport';
import { supabase } from '../db/supabase.js';
import { type AuthUser, generateSessionToken, requireRole } from '../auth/passport-strategies.js';

export function createApiRoutes(): Router {
  const router = Router();

  // ─── Public ──────────────────────────────────────────────────

  router.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'queen-vln-gg', timestamp: new Date().toISOString() });
  });

  // ─── Human auth (GitHub OAuth) ──────────────────────────────

  router.get('/auth/github', passport.authenticate('github', { session: false }));

  router.get(
    '/auth/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: '/login?error=1' }),
    (req: Request, res: Response) => {
      const token = generateSessionToken(req.user as AuthUser);
      res.redirect(`/dashboard#token=${token}`);
    }
  );

  // ─── Agent ingest (API key) ─────────────────────────────────

  router.post(
    '/v1/ingest/usage',
    passport.authenticate('api-key', { session: false }),
    async (req: Request, res: Response) => {
      const user = req.user as AuthUser;
      const { package_name, package_version, event_type, metadata } = req.body ?? {};

      if (!package_name || !event_type) {
        return res.status(400).json({ error: 'package_name and event_type are required' });
      }

      const { data, error } = await supabase
        .from('usage_events')
        .insert({
          agent_id: user.id,
          package_name,
          package_version: package_version ?? null,
          event_type,
          metadata: metadata ?? {},
        })
        .select('id')
        .single();

      if (error) {
        return res.status(500).json({ error: 'Failed to record usage event', details: error.message });
      }
      res.status(201).json({ success: true, id: data.id });
    }
  );

  /**
   * Agents report their currently-activated license (shape matches
   * @h4shed/license-client's LicensePayload) so Queen can track fleet-wide
   * license status without agents exposing the raw signed JWT.
   */
  router.post(
    '/v1/ingest/license',
    passport.authenticate('api-key', { session: false }),
    async (req: Request, res: Response) => {
      const user = req.user as AuthUser;
      const { type, issued_at, expires_at, product, version, features, machine_id, license_key } = req.body ?? {};

      if (!type || !issued_at || !expires_at || !product) {
        return res.status(400).json({ error: 'type, issued_at, expires_at, product are required' });
      }

      const { error } = await supabase.from('licenses').upsert(
        {
          agent_id: user.id,
          license_type: type,
          product,
          version: version ?? null,
          features: features ?? {},
          machine_id: machine_id ?? null,
          license_key: license_key ?? null,
          issued_at,
          expires_at,
        },
        { onConflict: 'agent_id' }
      );

      if (error) {
        return res.status(500).json({ error: 'Failed to record license', details: error.message });
      }
      res.status(201).json({ success: true });
    }
  );

  // ─── Dashboard reads (JWT, admin/operator) ──────────────────

  router.get(
    '/v1/agents/heartbeats',
    passport.authenticate('jwt', { session: false }),
    requireRole('admin', 'operator'),
    async (req: Request, res: Response) => {
      const user = req.user as AuthUser;
      const { data, error } = await supabase
        .from('agents')
        .select('id, name, org, role, last_heartbeat, is_active')
        .eq('org', user.org)
        .order('last_heartbeat', { ascending: false });

      if (error) {
        return res.status(500).json({ error: 'Failed to list agent heartbeats', details: error.message });
      }
      res.status(200).json({ org: user.org, agents: data });
    }
  );

  router.get(
    '/v1/licenses',
    passport.authenticate('jwt', { session: false }),
    requireRole('admin', 'operator'),
    async (req: Request, res: Response) => {
      const user = req.user as AuthUser;
      const { data, error } = await supabase
        .from('licenses')
        .select('agent_id, license_type, product, version, features, expires_at, agents!inner(org, name)')
        .eq('agents.org', user.org);

      if (error) {
        return res.status(500).json({ error: 'Failed to list licenses', details: error.message });
      }
      res.status(200).json({ org: user.org, licenses: data });
    }
  );

  return router;
}

export default createApiRoutes;
