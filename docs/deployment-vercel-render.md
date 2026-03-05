# Deployment Guide (Vercel + Render)

Goal: Deploy VaultPass with a user-friendly production experience.

Recommended topology:
- Vercel: serves the web UI (static assets from `public/`) and proxies `/api/*` to the backend
- Render: runs the PHP backend (and optionally MySQL)
- Resend: transactional email (optional)

Why this split:
- Vercel gives fast global static delivery and a clean primary origin for users.
- Render runs PHP predictably via Docker.
- Vercel rewrites keep requests same-origin for cookies/CSRF.

## 1) Choose Origins

Pick the primary user-facing origin (recommended):
- `https://vaultpass.yourdomain.com` (Vercel)

Backend origin (Render):
- `https://vaultpass-api.onrender.com` (example)

## 2) Database

VaultPass requires MySQL.

Options:
1) Managed MySQL elsewhere (recommended for production): PlanetScale / RDS / etc.
2) Self-host MySQL on Render as a private service with a persistent disk (acceptable for small deployments; treat as ops burden).

You must provide:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`

## 3) Render: Deploy Backend (Docker)

Create a Render Web Service from this repo using the included `Dockerfile`.

Required env vars on Render:
- `APP_ENV=production`
- `APP_KEY=<long random secret>`
- `SESSION_COOKIE_SECURE=true`
- `SESSION_SAMESITE=Lax` (or stricter if compatible)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`

Optional env vars:
- Breach monitoring: see `.env.example`
- Push notifications: see `.env.example`
- Email (Resend): see `docs/email-resend.md`

After deploy, apply schema/migrations to the production database:
- `sql/schema.sql` for fresh install
- `sql/migrations/*` in numeric order for upgrades

## 4) Vercel: Deploy Frontend + Proxy `/api/*`

In Vercel:
1. Import this repo
2. Set **Output Directory** to `public`
3. Add a rewrite so `/api/*` is proxied to the Render backend:

Example rewrite rule:
- Source: `/api/:path*`
- Destination: `https://vaultpass-api.onrender.com/api/:path*`

This keeps cookies and CSRF on the Vercel origin, improving user experience.

Also ensure the Vercel origin is the one you share with users.

## 5) Production UX & Security Checklist (High Impact)

- Use HTTPS everywhere (required for secure cookies and most PWA features).
- Set `APP_ENV=production` so PHP errors are not displayed to users.
- Set `SESSION_COOKIE_SECURE=true`.
- Verify session revoke + 2FA flows on production-like data.
- Run the launch checklist: `docs/launch-readiness-checklist.md`.
- Run a restore drill: `docs/backup-restore-runbook.md`.

