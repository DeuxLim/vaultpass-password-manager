# VaultPass Zero-Knowledge Architecture Decision (Phase 3)

Last updated: 2026-02-27
Status: Phase B initial implementation shipped (feature-flagged)

## Decision Summary
- Adopt a zero-knowledge model for **new vault records**.
- The server stores only ciphertext for vault content and metadata needed for app operation.
- User master secret is never sent to the backend in plaintext.

## Key Management Flow (Target)
1. User logs in with account password (server-auth remains).
2. Client derives a Key Encryption Key (KEK) from a user passphrase using Argon2id (WebAssembly-compatible implementation).
3. Client generates a random Data Encryption Key (DEK) for vault encryption.
4. Client encrypts DEK with KEK and stores encrypted DEK blob server-side.
5. Client encrypts vault fields locally with DEK before API submission.
6. Backend stores encrypted payload as opaque ciphertext.

## Transitional Plan
- Phase A: server-side encryption at rest (implemented).
- Phase B: optional client-side encryption for new records behind feature flag (implemented for web dashboard).
- Phase C: migrate existing records lazily on edit/read-write (pending).

## Data Model Additions (Planned)
- `user_key_material`:
  - encrypted DEK blob
  - KDF params (algorithm, memory, iterations, salt)
  - key version
- `vault_items` add:
  - ciphertext blob
  - encryption version marker

## Security Properties
- Backend compromise should not reveal vault plaintext without client secret.
- Account password reset should not automatically recover vault data without recovery path.
- Recovery should rely on user-held recovery key package.

## Open Decisions
- Dedicated vault passphrase vs reuse login password.
- Recovery UX (recovery key file + printable backup).
- WebCrypto-only implementation vs crypto library dependency.

## Implementation Milestones
1. Add `user_key_material` schema and API. (pending)
2. Introduce client crypto module + envelope format. (done)
3. Add feature flag for zero-knowledge vault writes. (done)
4. Add migration telemetry and user progress tracking. (pending)
