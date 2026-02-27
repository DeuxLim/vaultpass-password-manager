# VaultPass Log Retention and Rotation Policy

Last updated: 2026-02-27
Owner: VaultPass core team

## Scope

- Application runtime logs (PHP/web server)
- Security and audit event logs (database `audit_logs`)
- Access logs (reverse proxy / web server)

## Retention Targets

- Error/runtime logs:
  - Hot retention: 14 days on host
  - Archive retention: 90 days in object storage
- Access logs:
  - Hot retention: 30 days
  - Archive retention: 90 days
- `audit_logs` table:
  - Operational retention: 365 days
  - If legal/compliance requirements apply, keep longer per policy override

## Rotation Policy

- Rotate file logs daily or at 100 MB (whichever comes first).
- Keep up to 14 compressed rotations locally.
- Compress rotated logs (`gzip` or equivalent).
- Prevent log growth from blocking disk:
  - Alert at 70% disk usage
  - Critical alert at 85% disk usage

## Redaction and Sensitive Data

- Never log plaintext vault secrets, encryption keys, or backup passphrases.
- Do not log full credentials in access/error logs.
- Prefer hashed/derived identifiers in security events (`email_sha256` pattern).

## Operational Checks

- Verify rotation is active in each environment before release.
- Perform monthly restore/readability check of archived logs.
- Confirm incident responders can query recent logs within 15 minutes.

## Incident Handling

- During active incidents, temporary retention extension is allowed.
- Any extension beyond default retention must be recorded in incident notes.
