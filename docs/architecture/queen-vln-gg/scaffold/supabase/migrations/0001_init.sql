-- Queen control plane initial schema
-- Agents/clones report usage + license telemetry; operators (humans) read
-- their own org's data only.
--
-- `licenses` mirrors the LicensePayload/LicenseFeatures shape from
-- @h4shed/license-client (packages/license-client/src/types.ts in
-- fused-gaming-skill-mcp) so license JWTs Queen issues validate correctly
-- against the existing client-side validator.

create extension if not exists pgcrypto;

create table operators (
  id uuid primary key default gen_random_uuid(),
  github_id text unique not null,
  email text,
  org text not null,
  role text not null check (role in ('admin', 'operator', 'viewer')),
  created_at timestamptz not null default now()
);

create table agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  org text not null,
  api_key_hash text unique not null,
  role text not null default 'agent',
  last_heartbeat timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table usage_events (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references agents(id) on delete cascade,
  package_name text not null,
  package_version text,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- One row per agent's currently-reported license (upserted on report).
-- Columns map 1:1 to LicensePayload: type, issued_at, expires_at, product,
-- version, features (LicenseFeatures jsonb), activation.machine_id/license_key.
create table licenses (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null unique references agents(id) on delete cascade,
  license_type text not null check (license_type in ('trial', 'commercial', 'team', 'enterprise')),
  product text not null,
  version text,
  features jsonb not null default '{}'::jsonb,
  machine_id text,
  license_key text,
  issued_at timestamptz not null,
  expires_at timestamptz not null
);

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null,
  resource text not null,
  created_at timestamptz not null default now()
);

create index idx_usage_events_agent on usage_events(agent_id, created_at desc);
create index idx_agents_org on agents(org);
create index idx_licenses_agent on licenses(agent_id);

-- RLS: the API server uses the service-role key (bypasses RLS) and enforces
-- org scoping in application code (see src/routes/api.ts). These policies
-- are a defense-in-depth backstop for any future client that connects with
-- the anon/authenticated key directly.

alter table agents enable row level security;
alter table usage_events enable row level security;
alter table licenses enable row level security;
alter table audit_log enable row level security;
alter table operators enable row level security;

create policy "agents read own org" on agents
  for select using (org = current_setting('request.jwt.claims', true)::jsonb ->> 'org');

create policy "usage_events insert own agent" on usage_events
  for insert with check (agent_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'id')::uuid);

create policy "usage_events read own org" on usage_events
  for select using (
    agent_id in (select id from agents where org = current_setting('request.jwt.claims', true)::jsonb ->> 'org')
  );

create policy "licenses read own agent" on licenses
  for select using (agent_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'id')::uuid);

create policy "licenses read own org" on licenses
  for select using (
    agent_id in (select id from agents where org = current_setting('request.jwt.claims', true)::jsonb ->> 'org')
  );

create policy "audit_log admin read own org" on audit_log
  for select using (current_setting('request.jwt.claims', true)::jsonb ->> 'role' = 'admin');
