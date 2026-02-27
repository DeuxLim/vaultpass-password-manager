# Production Readiness Checklist

Use this checklist before making VaultPass available to real users.

## Infrastructure

- [ ] HTTPS enabled end-to-end (no mixed-content API requests).
- [ ] Database uses dedicated non-root app user with least privilege.
- [ ] Backups tested: schema + data restore drill completed.
- [ ] Server logs, rotation, and alerting configured.

## App Configuration

- [ ] `APP_ENV=production`
- [ ] `SESSION_COOKIE_SECURE=true`
- [ ] `SESSION_SAMESITE=Lax` (or stricter if your flow supports it)
- [ ] Strong `APP_KEY` generated and stored securely.
- [ ] No secrets committed to git (`.env` is untracked).

## Security Validation

- [ ] OWASP checklist reviewed: `docs/security-checklist.md`
- [ ] ASVS baseline reviewed: `docs/asvs-checklist.md`
- [ ] 2FA setup/disable/recovery tested.
- [ ] Session revoke and remote logout tested.
- [ ] Audit log entries verified for auth + vault mutations.

## Extension Release

- [ ] `extension/manifest.json` `homepage_url` points to production app origin.
- [ ] `host_permissions` include production API origin.
- [ ] Manual fill + prompt save tested on fixture matrix.
- [ ] Extension package version incremented for release.

## Launch Operations

- [ ] Incident runbook reviewed: `docs/incident-response-runbook.md`
- [ ] Support workflow reviewed: `docs/support-workflow.md`
- [ ] Launch checklist reviewed: `docs/launch-readiness-checklist.md`
