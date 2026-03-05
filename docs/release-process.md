# Release Process

Status: Working process (Phase 6 scope)
Owner: VaultPass core team

This repo does not currently ship an automated release pipeline. This document defines a manual-but-repeatable release discipline.

## Versioning

- Use SemVer-ish versions (pre-1.0 uses `0.x.y`).
- Bump versions for:
  - web app deploys (VaultPass)
  - extension package releases (separately tracked in `extension/manifest.json`)

## Changelog Discipline

- Keep all changes under `CHANGELOG.md` → **Unreleased** while developing.
- Before release:
  - create a new version section (`0.x.y - YYYY-MM-DD`)
  - move relevant entries from **Unreleased** into the new section
  - leave **Unreleased** empty (or with placeholders) for the next cycle

## Pre-Release Checklist (Minimal)

1. Ensure config is production-appropriate (see `docs/production-readiness-checklist.md`).
2. Apply DB migrations in order (see `sql/migrations/`).
3. Run static checks:
   - `./scripts/lint.sh`
   - `./scripts/smoke.sh` (if available/appropriate for your environment)
4. Manual sanity flows:
   - register/login/logout
   - vault list/add/edit/delete
   - 2FA (if enabled)
   - shared vault + emergency access (if used)
5. (If releasing the extension) Run the fixture matrix:
   - `docs/extension-autofill-test-matrix.md`

## Tagging / Record Keeping (Optional)

If you use git tags:
- Tag the release commit (e.g. `v0.2.0`).
- Record the deploy date/time and environment in your ops notes.

## Rollback Notes

- Always keep the previous deploy artifact (or commit reference) readily available.
- Confirm database migrations are backwards-compatible before rolling out.

