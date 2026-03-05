# Support & Reliability SLAs (Draft)

Status: Draft (Phase 6 exit criteria)
Owner: VaultPass core team

This document defines user-facing reliability targets and support response expectations for production.

## Reliability Targets

### Availability
- Target uptime: **99.9% monthly** for the user-facing app.
- Planned maintenance may impact availability; communicate ahead of time where possible.

### Backups / Recovery
- RPO (data loss window target): **24 hours** (daily backups minimum).
- RTO (restore time target): **4 hours** for P0 incidents affecting most users.
- Restore drills: at least quarterly.

### Security Incidents
- Credential exposure or auth bypass is treated as **P0**.
- Communicate quickly and conservatively; rotate secrets and force session resets where needed.

## Support SLAs

Support severity is based on user impact.

### P0 — Critical
Examples: cannot sign in for many users, data loss, security incident.
- First response: **within 2 hours**
- Updates: **every 2–4 hours** until stabilized

### P1 — High
Examples: billing issues, emergency access broken, widespread feature outage.
- First response: **within 1 business day**
- Updates: **daily** until resolved

### P2 — Normal
Examples: feature bugs with workarounds, UI issues, minor performance problems.
- First response: **within 3 business days**

### P3 — Low
Examples: feature requests, cosmetic improvements.
- First response: **within 10 business days**

## User Communication

Recommended minimum:
- A public status page link (even a simple static page is fine).
- A support contact channel (email) visible on sign-in and dashboard pages.

## Notes

- These are targets, not guarantees.
- Adjust for your team size and operational maturity before public launch.

