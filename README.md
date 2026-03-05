# VaultPass

VaultPass is a lightweight password manager built on a vanilla stack:
- Frontend: HTML, CSS, JavaScript
- Backend: PHP (no framework)
- Database: MySQL

## Quick Links

- Local setup: `docs/setup-local.md`
- Production deployment (Vercel + Render): `docs/deployment-vercel-render.md`
- Email (Resend): `docs/email-resend.md`
- Analytics: `docs/analytics.md`
- Pricing & billing: `docs/pricing-tiers.md`, `docs/billing-integration.md`
- Production readiness: `docs/production-readiness-checklist.md`
- Launch checklist: `docs/launch-readiness-checklist.md`

## Production (Vercel + Render)

Recommended setup for a user-friendly production experience:
- Vercel serves the web UI (`public/`)
- Vercel proxies `/api/*` to a Render backend (same-origin UX for cookies/CSRF)
- MySQL hosted separately (managed preferred) or self-hosted (ops burden)

Details: `docs/deployment-vercel-render.md`

## Secure Before Sharing/Deploying

Do this before your first push:

1. Never commit secrets.
   - Keep credentials in `.env` (ignored by git).
2. Use `.env.example` as the only committed env template.
3. Rotate keys/passwords if they were ever exposed.
4. Verify with:

```bash
git status
rg -n "APP_KEY|DB_PASS|password|secret|token" .
```

Expected: no real secrets in tracked files.

## Project Layout

- `public/` - web root (browser-served files)
- `api/` - real API handlers (outside web root)
- `app/` - shared backend modules
- `config/` - app config
- `sql/` - schema

## Environment Setup (Local)

Copy and edit:

```bash
cp .env.example .env
```

Set values in `.env`:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=vaultpass
DB_USER=root
DB_PASS=your_mysql_password
APP_KEY=your_long_random_secret
APP_ENV=development
SESSION_COOKIE_SECURE=false
SESSION_SAMESITE=Lax
SESSION_IDLE_TIMEOUT=1800
SESSION_ABSOLUTE_TIMEOUT=2592000
ZERO_KNOWLEDGE_CLIENT_ENCRYPTION=false

# Optional rate-limit tuning
LOGIN_RATE_LIMIT_WINDOW=60
LOGIN_RATE_LIMIT_MAX=20
LOGIN_EMAIL_RATE_LIMIT_WINDOW=300
LOGIN_EMAIL_RATE_LIMIT_MAX=8
ACCOUNT_LOCKOUT_WINDOW=900
ACCOUNT_LOCKOUT_MAX=8
ACCOUNT_LOCKOUT_DURATION=900
REGISTER_RATE_LIMIT_WINDOW=300
REGISTER_RATE_LIMIT_MAX=10
REGISTER_EMAIL_RATE_LIMIT_WINDOW=900
REGISTER_EMAIL_RATE_LIMIT_MAX=3
LOGIN_2FA_RATE_LIMIT_WINDOW=300
LOGIN_2FA_RATE_LIMIT_MAX=12

# Optional 2FA tuning
TOTP_ISSUER=VaultPass
TOTP_WINDOW=1

# Optional encrypted backup tuning
BACKUP_KDF_ITERATIONS=210000
```

`SESSION_IDLE_TIMEOUT` and `SESSION_ABSOLUTE_TIMEOUT` are in seconds.
`ACCOUNT_LOCKOUT_WINDOW`, `ACCOUNT_LOCKOUT_MAX`, and `ACCOUNT_LOCKOUT_DURATION` control temporary account lockouts after repeated failed logins.
`ZERO_KNOWLEDGE_CLIENT_ENCRYPTION=true` enables optional client-side field encryption for new vault writes in the web dashboard.

If you need to clear a lockout manually (admin operation), run:

```bash
./scripts/unlock-account.sh user@example.com
```

`APP_KEY` must be a long random value.

For production deployments:
- set `APP_ENV=production`
- set `SESSION_COOKIE_SECURE=true`
- use HTTPS only for app traffic

Generate one with:

```bash
openssl rand -base64 48
```

## Setup

1. Create schema:

```bash
mysql -u root -p < sql/schema.sql
```

If you already created the database before audit logging was added, run:

```bash
mysql -u root -p < sql/migrations/001_add_audit_logs.sql
```

If you already created the database before vault history/versioning was added, run:

```bash
mysql -u root -p < sql/migrations/002_add_vault_item_versions.sql
```

If you already created the database before session tracking was added, run:

```bash
mysql -u root -p < sql/migrations/003_add_user_sessions.sql
```

If you already created the database before two-factor auth was added, run:

```bash
mysql -u root -p < sql/migrations/004_add_user_two_factor.sql
```

If you already created the database before vault metadata (folders/tags/favorites) was added, run:

```bash
mysql -u root -p < sql/migrations/005_add_vault_metadata.sql
```

If you already created the database before vault item types (login/secure note) were added, run:

```bash
mysql -u root -p < sql/migrations/006_add_vault_item_type.sql
```

If you already created the database before zero-knowledge key material storage was added, run:

```bash
mysql -u root -p < sql/migrations/007_add_user_key_material.sql
```

If you already created the database before push subscription storage was added, run:

```bash
mysql -u root -p < sql/migrations/011_add_push_subscriptions.sql
```

If you already created the database before analytics event storage was added, run:

```bash
mysql -u root -p < sql/migrations/012_add_analytics_events.sql
```

2. Run app:

```bash
php -S localhost:8000 -t public
```

3. Open:

- `http://localhost:8000/`
- `http://localhost:8000/pages/login.html`

PWA support is enabled with:

- `public/manifest.webmanifest`
- `public/sw.js`
- `public/script/pwa-init.js`

Security boundary: service worker does not cache `/api/*` responses and does not cache dashboard data pages.

## Automated Checks

Run lint/static syntax checks:

```bash
./scripts/lint.sh
```

Run a basic smoke test (server must be running):

```bash
./scripts/smoke.sh http://localhost:8000
```

Run unauthenticated authorization coverage checks (server must be running):

```bash
./scripts/authz.sh http://localhost:8000
```

Security checklist is tracked in:

```text
docs/security-checklist.md
```

Production release checklist:

```text
docs/production-readiness-checklist.md
```

## Chrome Extension MVP (Sprint 11)

Extension source is in:

```text
extension/
```

Load it in Chrome:

1. Open `chrome://extensions`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select the `extension/` folder

Run web app first (example):

```bash
php -S localhost:8000 -t public
```

In extension popup, open `Settings` and confirm `Backend base URL` matches your running app URL.
Then sign in via `Open Login`, return to popup, and click `Refresh`.
On supported login forms, the extension can autofill and will prompt to save credentials after submit.
The popup also includes a local password generator with length and character-set controls.
If manual `Fill` is clicked before a page script is ready, the extension now auto-injects and retries fill.
For production users, extension default backend is derived from the extension `homepage_url` origin (no manual setup required).

### Extension Autofill Validation (Sprint 12)

Use the manual matrix:

```text
docs/extension-autofill-test-matrix.md
```

Open local fixture forms page:

```text
http://localhost:8000/pages/extension-fixtures.html
```

This page provides 20 form patterns to validate detection, autofill, and save-on-submit behavior.

## Emergency Access (Phase 4 Foundation)

Emergency access foundations are implemented and available from the dashboard section:

- create/revoke grants
- request access as grantee
- approve/deny requests as owner

Technical details and current limitations:

```text
docs/emergency-access.md
```

## Security Notes

- User login passwords are hashed with `password_hash()` (bcrypt).
- Vault fields are encrypted at rest with AES-256-GCM using `APP_KEY`.
- App fails fast if `APP_KEY` is left as default placeholder.
- Session cookie settings are configurable via env vars.
- Authentication and vault mutations are written to `audit_logs`.
