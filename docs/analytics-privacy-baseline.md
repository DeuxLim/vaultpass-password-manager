# Analytics Privacy Baseline

Owner: VaultPass product + security  
Last updated: 2026-02-23

## Principles
- Collect minimum data required for product decisions.
- Do not collect vault secrets or plaintext credential fields.
- Prefer aggregate metrics over user-level event detail.
- Provide transparent disclosure in privacy policy.

## Allowed Event Classes
- Authentication funnel events:
  - login_attempted
  - login_succeeded
  - login_failed
  - two_factor_challenge_shown
  - two_factor_succeeded
- Product usage events (metadata only):
  - vault_item_created
  - vault_item_updated
  - vault_item_deleted
  - import_started / import_completed
  - export_started / export_completed

## Forbidden Fields
- Plaintext passwords, usernames, notes, site URLs.
- Raw IP address in analytics payloads.
- Full user agent strings (only coarse device class allowed).

## Data Handling
- Retention target: 90 days for granular events.
- Use pseudonymous user id for analytics.
- Apply sampling for high-volume events if needed.
- Restrict analytics access to least privilege.

## Implementation Notes
- Reuse existing audit log events for internal security operations.
- Keep analytics pipeline separate from security audit logs.
- Add opt-out/consent control before production rollout where required.
