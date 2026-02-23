# Incident Response Runbook

Owner: VaultPass core team  
Last updated: 2026-02-23

## Severity Levels
- P0: Active security breach/data integrity compromise.
- P1: Core auth/vault functionality unavailable for most users.
- P2: Partial degradation with workaround.
- P3: Minor issue/no major user impact.

## Immediate Actions
1. Declare incident and set severity.
2. Assign Incident Commander (IC) and Communications owner.
3. Freeze non-essential deployments.
4. Capture timestamp, affected services, blast radius.

## Technical Containment
1. For auth abuse, tighten rate limits and revoke suspicious sessions.
2. For API instability, isolate failing endpoint and deploy hotfix/rollback.
3. For DB corruption risk, move app to read-only mode and verify backups.
4. Preserve logs and evidence before cleanup.

## Communication
1. Internal update cadence:
   - P0/P1: every 30 minutes
   - P2/P3: every 2 hours
2. External user message includes:
   - impact summary
   - current mitigation
   - next update time

## Recovery
1. Validate fix in staging and production.
2. Run smoke checklist (auth, vault list/create/update/delete, sessions, 2FA).
3. Confirm monitoring/logs return to normal.
4. Close incident only after 24h no-regression window for P0/P1.

## Postmortem (within 48h)
1. Timeline with exact UTC timestamps.
2. Root cause and contributing factors.
3. Corrective actions with owners and due dates.
4. Security/compliance review if user data risk existed.
