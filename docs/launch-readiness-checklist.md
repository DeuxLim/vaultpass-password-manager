# Launch Readiness Checklist

Owner: VaultPass core team  
Last updated: 2026-02-23

## Product Readiness
- [ ] Registration, login, logout, and 2FA verified on staging.
- [ ] Vault CRUD, history restore, import/export, and sessions verified on staging.
- [ ] Mobile breakpoints validated: 320, 375, 768, 1024.
- [ ] PWA install flow validated on iOS Safari and Android Chrome.

## Security Readiness
- [ ] `.env` values set for production and not committed.
- [ ] `APP_KEY` rotated and stored in secret manager.
- [ ] HTTPS enforced at edge/reverse proxy.
- [ ] Session cookie security flags validated in production.
- [ ] OWASP ASVS checklist reviewed and signed off.
- [ ] Backup and restore test completed with production-like dataset.

## Database & Operations
- [ ] All SQL migrations applied (001-005).
- [ ] Daily backup schedule configured and test restore successful.
- [ ] Error log rotation configured and retention policy documented.
- [ ] Incident contacts and on-call rotation documented.

## Support Readiness
- [ ] Support triage workflow active (P0-P3).
- [ ] User-facing status/maintenance message template prepared.
- [ ] Account recovery and 2FA lockout SOP approved.

## Release Management
- [ ] Versioning/changelog process defined.
- [ ] Release candidate smoke test passed.
- [ ] Rollback plan tested.
- [ ] Launch go/no-go signoff captured.
