# Passkeys / WebAuthn Roadmap (Kickoff)

Status: Draft kickoff document
Owner: VaultPass core team

## Goals

- Add phishing-resistant sign-in via passkeys (WebAuthn).
- Support multi-device passkeys (platform + cross-device) where available.
- Preserve VaultPass security posture (rate limits, audit logs, session hardening).
- Keep UX simple: progressive enhancement over password + optional TOTP.

Non-goals (v1):
- Passwordless-only accounts for every user on day one.
- Full device-bound “secure enclave key wrapping” for vault encryption keys (separate track).

## Product UX (Proposed)

### Enrollment
- Security page: “Add passkey”
- User confirms via platform prompt.
- Store a display name (optional) + created timestamp.
- Allow multiple passkeys per account.

### Login
- Login page: “Sign in with passkey”
- Prefer conditional UI where supported.
- Fall back to password login if passkeys not available or user cancels.

### Management
- List registered passkeys (name, created, last used).
- Rename and revoke passkeys.
- Audit log: enroll, use, revoke.

## Backend API Surface (Proposed)

- `GET /api/auth/webauthn/options-register.php`
- `POST /api/auth/webauthn/verify-register.php`
- `GET /api/auth/webauthn/options-login.php`
- `POST /api/auth/webauthn/verify-login.php`
- `GET /api/auth/webauthn/list.php`
- `POST /api/auth/webauthn/revoke.php`

All mutating endpoints require CSRF + authenticated session, except verify-login.

## Data Model (Proposed Migration)

Table: `user_webauthn_credentials`

Fields:
- `id` (PK)
- `user_id` (FK)
- `credential_id` (unique binary/base64url)
- `public_key` (COSE key bytes or base64)
- `sign_count` (int)
- `transports` (json)
- `aaguid` (nullable)
- `name` (varchar)
- `created_at`, `updated_at`, `last_used_at`
- `revoked_at` (nullable)

Indexes:
- `user_id`
- `credential_id` unique

## Security Considerations

- Verify RP ID and origin strictly (`https://` in production; allow `http://localhost` only in dev).
- Bind challenges to a short TTL and to session / nonce storage.
- Enforce user verification (`uv`) where feasible.
- Rate-limit login verification endpoint separately.
- Audit log:
  - `webauthn.register_options`
  - `webauthn.register_verify`
  - `webauthn.login_options`
  - `webauthn.login_verify`
  - `webauthn.revoke`

## Rollout Plan

1. v0 (Dev-only): implement endpoints + minimal UI; feature flag gate.
2. v1: ship account management + login button; add internal test checklist.
3. v1.1: conditional UI / autofill improvements and better error messaging.
4. v2: revisit passwordless-first onboarding + recovery flows.

