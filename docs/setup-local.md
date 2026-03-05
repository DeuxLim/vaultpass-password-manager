# Local Setup Guide

This guide is for running VaultPass locally for development/testing.

VaultPass stack:
- PHP (no framework) backend
- MySQL database
- Static frontend in `public/`

## Option A: Quick Start (PHP built-in server)

Prereqs:
- PHP 8.2+
- MySQL 8+

1) Create `.env`:

- `cp .env.example .env`

2) Create the database + schema:

- `mysql -u root -p < sql/schema.sql`

If you are upgrading an existing DB, apply any missing migrations in `sql/migrations/` in numeric order.

3) Run the server:

- `php -S localhost:8000 -t public`

4) Open:

- `http://localhost:8000/`
- `http://localhost:8000/pages/login.html`

## Option B: Docker Compose (Recommended if you want fewer host deps)

Prereqs:
- Docker Desktop (or Docker Engine)

1) Create `.env`:

- `cp .env.example .env`

2) Start services:

- `docker compose up --build`

3) In a second terminal, initialize schema (first run only):

- `docker compose exec -T db mysql -uroot -proot vaultpass < sql/schema.sql`

4) Open:

- `http://localhost:8000/`

Notes:
- Compose uses a local MySQL container with a persisted volume.
- Update DB credentials in `.env` if you change the compose defaults.

