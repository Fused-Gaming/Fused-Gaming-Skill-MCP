# Queen (queen-vln-gg) — Handoff & Context

Hand this file to whatever Claude session next has write access to
`fused-gaming/queen-vln-gg`. It explains why the repo exists, what's already
been scaffolded here (staged, not yet migrated), and what's left.

## What Queen is

**Queen** is the **ecosystem control and record platform** for the Fused Gaming platform.
It is not an alternative to SyncPulse, nor a "commercial edition"—it is the authoritative
backend system governing identity, licensing, package publishing, authorized distribution,
usage reporting, and persistent ecosystem records.

Queen powers:
1. **Identity & access control** — user and organization identity, operator/admin auth
2. **License & entitlement engine** — free and commercial license issuance and validation
3. **Package publishing & distribution** — publisher authorization, package metadata, release channels
4. **Usage telemetry & reporting** — aggregated metrics from every SyncPulse instance
5. **Audit & compliance** — durable audit logs, usage history, governance records
6. **Persistent platform records** — system-of-record for users, orgs, agents, packages, licenses

Queen is hosted at `queen.vln.gg` behind Cloudflare authentication (Access policy / WAF).

## SyncPulse vs Queen — the architectural split

- **SyncPulse** = free adoption engine (what users interact with)
  - Local dashboard and runtime
  - Agent and skill execution
  - Workflow orchestration
  - Package discovery and installation
  - Caches entitlements locally; gracefully offline where permitted
  - Initiates free license activation with Queen at first run
  - Reports permitted usage/telemetry events to Queen

- **Queen** = ecosystem governance and monetization platform (what governs SyncPulse)
  - Central identity and authentication
  - Authoritative license and entitlement system
  - Package publishing and version control
  - Download authorization (free and paid)
  - Usage reporting and dashboards for operators
  - Audit logs and compliance records
  - System-of-record persistence

Both are essential; neither is subordinate to the other. SyncPulse drives adoption;
Queen enables sustainable revenue through a portfolio of commercial licenses, paid packages,
bundles, and subscriptions—not by restricting SyncPulse itself.

## Why this is staged here instead of in queen-vln-gg directly

The session that did this work did not have `queen-vln-gg` in its GitHub tool
scope (only `fused-gaming/fused-gaming-skill-mcp` was allowed), so the scaffold
below was written into this repo under
`docs/architecture/queen-vln-gg/scaffold/` instead of pushed directly. **A
session with `queen-vln-gg` in scope needs to copy `scaffold/*` into the root
of that repo** (drop the `docs/architecture/queen-vln-gg/scaffold/` prefix),
then continue from "Next steps" below.

## Reused patterns from this repo (don't reinvent these)

- `src/orchestration-api/passport-auth-strategy.ts` /
  `docs/PASSPORT_INTEGRATION_GUIDE.md` — JWT + local Passport strategy shape,
  `requireRole`/`requirePermission` middleware, fail-closed `JWT_SECRET` check.
  Queen's `src/auth/passport-strategies.ts` is a direct port plus an added
  `passport-custom` API-key strategy for agents and a `passport-github2`
  strategy for human login.
- `packages/license-client/src/types.ts` — **this is the canonical
  `LicensePayload`/`LicenseFeatures` shape**, already published and consumed
  by the CLI (`@h4shed/license-client`). Queen's `licenses` table and ingest
  endpoint must match this shape exactly (it does, see
  `supabase/migrations/0001_init.sql` in the scaffold) so license JWTs Queen
  issues validate correctly against the existing client-side validator
  (`packages/license-client/src/validator.ts`).
- `docs/architecture/ORCHESTRATION_PANEL.md` — first-login one-time-password
  + mandatory strong-password-change flow. Not ported (Queen uses GitHub
  OAuth instead since it's for Fused Gaming staff, not end users), but worth
  knowing it exists if a non-GitHub admin login path is ever needed.
- `docs/LICENSING_SYSTEM.md` — Stripe webhook → license generation flow.
  Queen's license issuance should eventually hook into this, not duplicate it.

## What's scaffolded (in `scaffold/`)

- Express + TS API: Passport JWT (dashboard sessions), GitHub OAuth (human
  login mapped to org via an `operators` table), API-key strategy (agents).
- Supabase migration: `operators`, `agents`, `usage_events`, `licenses`
  (matches `LicensePayload` shape), `audit_log`, with RLS policies.
- Routes: `GET /api/health`, `GET/POST /api/auth/github*`,
  `POST /api/v1/ingest/usage`, `GET /api/v1/agents/heartbeats`.
- Minimal Next.js dashboard: GitHub login → agent heartbeat table.

## Next steps (in priority order)

1. **Get repo access**: add `fused-gaming/queen-vln-gg` to the working
   session's repo scope, then copy `scaffold/*` into its root and push.
2. **Cloudflare in front of `queen.vln.gg`**: this needs to be done with
   Cloudflare account access (DNS + Access policy or at minimum WAF rules
   restricting `/api/*` to expected traffic). Not something doable blind —
   needs the account owner or Cloudflare API token with appropriate scope.
3. **License issuance endpoint**: add `POST /api/v1/licenses/issue` (admin
   JWT only) that signs a `LicensePayload` JWT with the same private key the
   CLI's `packages/license-client/src/generator.ts` / `validator.ts` expect,
   so issued licenses validate offline in the CLI.
4. **Wire Stripe**: per `docs/LICENSING_SYSTEM.md`, the
   `customer.subscription.created/updated/deleted` webhook should call the
   license-issue endpoint above instead of a separate ad hoc flow.
5. **`@vln/hive-agent` client lib**: thin wrapper packages can `npm install`
   to auto-report usage events to Queen's ingest endpoint — not started.
6. **GitHub Actions hourly orchestration**: deferred, no work started.

## Explicitly out of scope (confirmed with user earlier in this thread)

- Brett Johnson booking/content sync data
- Blockchain forensics / law-enforcement pipeline findings

Both were excluded from Queen's data feeds because they involve third-party
client data / sensitive investigative data needing a separate authorization
and access-control review before going anywhere near a shared telemetry store.
