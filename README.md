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
