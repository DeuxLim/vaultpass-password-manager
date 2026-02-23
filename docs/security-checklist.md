# VaultPass Security Checklist

Last reviewed: 2026-02-23
Reviewer: Codex + project owner
Status: Initial baseline review complete

## Critical Controls
- [x] Secrets are not committed (`.env` ignored, `.env.example` used)
- [x] APP_KEY required and validated at runtime
- [x] Passwords hashed with `password_hash` (bcrypt)
- [x] Vault fields encrypted at rest (AES-256-GCM)
- [x] CSRF enforced on mutating endpoints
- [x] Session cookie has `HttpOnly` and configurable `Secure` / `SameSite`
- [x] Session revocation support implemented (current + other sessions)
- [x] Auth rate limiting enabled (login/register/2FA)
- [x] Audit logs for auth and vault mutations
- [x] 2FA support with recovery codes

## API Contract & Error Handling
- [x] Standard JSON envelope includes `ok` and `request_id`
- [x] Error envelope includes `error`, `error_code`, and `details`
- [x] Non-cache headers set for API responses

## Data Portability
- [x] Encrypted backup export/import implemented
- [x] CSV import validation + error reporting implemented

## Checklist Result
- Critical findings: 0
- High findings: 0
- Medium findings: 2 (tracked in roadmap)

## Medium Findings (Tracked)
1. Zero-knowledge client-side encryption for new records is not yet implemented.
2. Security events/history page for end users is not yet implemented.

## Next Review Trigger
- Before public launch
- After zero-knowledge implementation
- After extension phase starts
