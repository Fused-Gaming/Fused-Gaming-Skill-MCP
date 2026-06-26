# queen-vln-gg

Authenticated "Queen" control plane for the VLN.gg Hive Mind, deployed at
`queen.vln.gg` behind Cloudflare and a Passport.js auth wall. Ingests usage
and license telemetry reported by deployed instances of the `@h4shed`
packages, authenticates human operators (GitHub OAuth) and reporting agents
(API key), and gives Fused Gaming staff one place to manage licenses and
project status.

See `../HANDOFF.md` (in the staging location,
`docs/architecture/queen-vln-gg/HANDOFF.md` of `Fused-Gaming-Skill-MCP`) for
full context on why this exists and what's deferred.

## Queen vs SyncPulse

SyncPulse is the bundled first-run onboarding dashboard shipped with every
`@h4shed` install (signup/login, setup guide, per-instance dashboard). Queen
is the single shared backend all of those instances report to. Don't
duplicate SyncPulse's onboarding UI here.

## What's here

- `src/server.ts` - Express app entrypoint, Passport initialization.
- `src/auth/passport-strategies.ts` - JWT strategy (dashboard sessions),
  GitHub OAuth strategy (human login), API-key (`passport-custom`) strategy
  (agents/clones).
- `src/routes/api.ts` - `/api/health`, `/api/v1/ingest/usage`,
  `/api/v1/agents/heartbeats`.
- `src/db/supabase.ts` - Supabase service-role client.
- `supabase/migrations/0001_init.sql` - `operators`, `agents`,
  `usage_events`, `licenses` (matches `@h4shed/license-client`'s
  `LicensePayload`/`LicenseFeatures` shape), `audit_log`, with RLS.
- `web/` - single-page Next.js dashboard stub (GitHub login + heartbeat
  table).

## Local development

```bash
npm install
cp .env.example .env   # fill in JWT_SECRET, GITHUB_CLIENT_ID/SECRET, SUPABASE_URL/SERVICE_ROLE_KEY
npm run dev
curl http://localhost:3000/api/health
```

`JWT_SECRET` is required — the server fails closed (refuses to start) if
unset, matching the pattern in `fused-gaming-skill-mcp`'s orchestration API.

## Deploying behind Cloudflare

1. Point `queen.vln.gg` DNS at the deployment target (Vercel, per the
   existing `skill.vln.gg` pattern, or wherever this is hosted) via
   Cloudflare nameservers.
2. Put a Cloudflare Access application in front of `queen.vln.gg/*` (or at
   minimum WAF rate-limiting on `/api/auth/*` and `/api/v1/ingest/*`) so the
   Passport wall isn't the only line of defense.
3. If using Cloudflare Access, validate the `Cf-Access-Jwt-Assertion` header
   server-side in addition to (or instead of) the GitHub OAuth flow for the
   human dashboard routes.

## Registering an agent (manual, for now)

No CLI yet (`@vln/hive-agent` is a planned follow-up). To register an
agent/clone manually:

1. Insert a row into `agents` with `name`, `org`, and a freshly generated API
   key (store only `api_key_hash = sha256(key)`; hand the raw key to the
   operator once).
2. The agent calls `POST /api/v1/ingest/usage` with
   `Authorization: Bearer <api_key>`.

## Reporting usage/license events

```bash
curl -X POST https://queen.vln.gg/api/v1/ingest/usage \
  -H "Authorization: Bearer <api_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "package_name": "@h4shed/mcp-cli",
    "package_version": "1.2.0",
    "event_type": "command_run",
    "metadata": {"command": "license:status"}
  }'
```

## Deferred (not in this scaffold)

- `@vln/hive-agent` client lib + clone registration CLI
- License issuance endpoint wired to Stripe webhooks
- GitHub Actions hourly orchestration workflow
- Full audit-trail UI, manual task-trigger UI
- Any partner-booking or investigative-data feeds (explicitly out of scope)

## License

Private — Fused Gaming internal use.
