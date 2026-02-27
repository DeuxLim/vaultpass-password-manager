# VaultPass ASVS Subset Checklist (Draft)

Last updated: 2026-02-23
Scope: Practical subset for current architecture

## V2 Authentication
- [x] Password hashing with modern algorithm (`password_hash` / bcrypt)
- [x] Optional MFA (TOTP + recovery codes)
- [x] Rate limiting for login/register/2FA
- [x] Session revocation and active session management
- [x] Account lockout policy with admin-visible unlock flow (`ACCOUNT_LOCKOUT_*` + `scripts/unlock-account.sh`)

## V3 Session Management
- [x] Session cookie `HttpOnly`
- [x] Configurable `Secure` + `SameSite`
- [x] Session ID regeneration on login/2FA
- [x] Revoke current/other sessions
- [x] Absolute + idle session timeout policy surfaced to user

## V4 Access Control
- [x] Per-user scoping on vault CRUD
- [x] Access check on session-protected endpoints
- [x] Authorization tests for every endpoint path (`scripts/authz.sh`, unauthenticated baseline)

## V5 Validation & Encoding
- [x] Server-side required field checks on critical flows
- [x] JSON error envelope with stable keys
- [x] Escaping for user-displayed dynamic data in dashboard
- [x] Centralized reusable validators for all domain entities (`app/validators.php`)

## V7 Error Handling & Logging
- [x] Structured API error envelope with request id
- [x] Audit events for auth and vault mutations
- [x] Security events can be viewed by user (dashboard security modal)
- [x] Log retention/rotation policy documented (`docs/log-retention-policy.md`)

## V9 Data Protection
- [x] Vault data encryption at rest
- [x] Encrypted backup export/import
- [ ] Zero-knowledge client-side encryption for new records

## Gap Closure Plan (Current Sprint Focus)
1. Done: 2FA + session controls + audit visibility.
2. Done: timeout policy surfaced + endpoint authorization coverage (`scripts/authz.sh`).
3. Next: zero-knowledge key material model + feature-flagged client encryption.
