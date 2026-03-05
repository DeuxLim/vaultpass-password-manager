# Backup & Restore Runbook

Status: Runbook (Phase 6 scope)
Owner: VaultPass core team

This runbook defines a minimal, repeatable database backup/restore procedure for VaultPass.

Notes:
- New installs can bootstrap from `sql/schema.sql`.
- Existing installs should apply migrations in order from `sql/migrations/`.

## Backup Strategy (Recommended)

- Frequency: daily (minimum); consider hourly for active environments.
- Retention: keep at least 7 daily backups + 4 weekly backups (adjust to your needs).
- Storage: store encrypted backups off-host (object storage, encrypted volume, etc.).
- Restore drills: perform at least one restore drill before launch and quarterly thereafter.

## Create a Backup (CLI)

Prereqs:
- `mysqldump` available on the host.
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS` set (see `.env.example`).

Command:
- `./scripts/backup-db.sh backups/vaultpass-$(date +%F).sql`

Output:
- A SQL dump file suitable for restoring into MySQL.

## Restore a Backup (CLI)

Prereqs:
- `mysql` client available.
- Target database exists and is empty (or you understand overwrite implications).

Command:
- `./scripts/restore-db.sh backups/vaultpass-YYYY-MM-DD.sql`

Important:
- Restores are destructive if you restore into a non-empty database. Always restore into a fresh database for drills.

## Restore Drill (Recommended Steps)

1. Create a fresh database (e.g. `vaultpass_restore_drill`).
2. Restore the latest backup into the fresh database.
3. Point a staging VaultPass instance at the restored DB.
4. Validate:
   - login works (including 2FA if enabled)
   - vault list/add/edit/delete works
   - history restore works
   - shared vault + emergency access flows work (if used)
5. Record the drill date and any issues.

## Security

- Treat backups as highly sensitive.
- Prefer encrypting backups at rest and in transit.
- Restrict access (least privilege) and audit who can fetch/restore backups.

