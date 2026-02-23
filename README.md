# VaultPass (Vanilla MVP)

VaultPass is a vanilla stack MVP:
- Frontend: HTML, CSS, JavaScript
- Backend: PHP (no framework)
- Database: MySQL

## Secure Before Pushing to GitHub

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

## Environment Setup

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
SESSION_COOKIE_SECURE=false
SESSION_SAMESITE=Lax

# Optional rate-limit tuning
LOGIN_RATE_LIMIT_WINDOW=60
LOGIN_RATE_LIMIT_MAX=20
LOGIN_EMAIL_RATE_LIMIT_WINDOW=300
LOGIN_EMAIL_RATE_LIMIT_MAX=8
REGISTER_RATE_LIMIT_WINDOW=300
REGISTER_RATE_LIMIT_MAX=10
REGISTER_EMAIL_RATE_LIMIT_WINDOW=900
REGISTER_EMAIL_RATE_LIMIT_MAX=3
LOGIN_2FA_RATE_LIMIT_WINDOW=300
LOGIN_2FA_RATE_LIMIT_MAX=12

# Optional 2FA tuning
TOTP_ISSUER=VaultPass
TOTP_WINDOW=1
```

`APP_KEY` must be a long random value.

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

2. Run app:

```bash
php -S localhost:8000 -t public
```

3. Open:

- `http://localhost:8000/`
- `http://localhost:8000/pages/login.html`

## Security Notes

- User login passwords are hashed with `password_hash()` (bcrypt).
- Vault fields are encrypted at rest with AES-256-GCM using `APP_KEY`.
- App fails fast if `APP_KEY` is left as default placeholder.
- Session cookie settings are configurable via env vars.
- Authentication and vault mutations are written to `audit_logs`.
