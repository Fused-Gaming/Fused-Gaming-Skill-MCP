# Vercel Project Setup for `skills.vln.gg` and `sync.vln.gg`

_Date: 2026-04-17_

This repository currently contains a serverless MCP endpoint (`api/index.ts`) and workspace packages. It does **not** yet contain a dedicated frontend app directory for `sync.vln.gg`.

## 1) `skills.vln.gg` (Skills API / MCP endpoint)

Use this project for deploying the MCP/skills server from this repository.

### Recommended Vercel settings
- **Project name:** `skills-vln-gg`
- **Domain:** `skills.vln.gg`
- **Framework Preset:** `Other`
- **Root Directory:** `.` (repository root)
- **Install Command:** `npm ci --include=dev`
- **Build Command:** `npm run build --workspace=packages/core`
- **Output Directory:** _(leave empty)_
- **Node.js Version:** `22.x`

### Why this configuration
- `vercel.json` already routes all requests to `api/index.ts` via `@vercel/node`.
- The core workspace build ensures runtime artifacts are prepared for the server-side endpoint.

## 2) `sync.vln.gg` (Augmented Agents App)

Use a **separate Vercel project** for the app so API and UI deploy lifecycles are isolated.

### Recommended project structure
- If this app will live in this monorepo, place it at: `apps/sync`
- Add it to root workspaces before wiring CI/CD.

### Recommended Vercel settings
- **Project name:** `sync-vln-gg`
- **Domain:** `sync.vln.gg`
- **Framework Preset:** `Next.js` (recommended for an augmented agents web app)
- **Root Directory:** `apps/sync`
- **Install Command:** `npm ci --include=dev`
- **Build Command:** `npm run build`
- **Output Directory:** `.next` (default for Next.js)
- **Node.js Version:** `22.x`

## Environment Variable Split

Set separate environment variables per Vercel project:

- **skills.vln.gg** (API): MCP/runtime secrets only.
- **sync.vln.gg** (frontend/app): public app config + server-side app secrets.

Do not reuse one project's secrets in the other project.

## Deploy/Ownership Model

1. `skills.vln.gg` deploys from this repo root with `vercel.json` routing.
2. `sync.vln.gg` deploys from `apps/sync` (or a dedicated repo if preferred).
3. Keep build failures isolated by project to avoid blocking API releases when app-only changes fail (and vice versa).

## Validation Checklist

- Confirm `skills.vln.gg` responds successfully from `api/index.ts` routes.
- Confirm `sync.vln.gg` preview and production builds complete with the selected framework preset.
- Confirm each project uses the correct root directory and does not cross-load unrelated environment variables.
