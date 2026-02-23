# Support Workflow

Owner: VaultPass support + engineering  
Last updated: 2026-02-23

## Intake Channels
- In-app/contact form (future)
- Support email
- GitHub issues (public bugs only, no account data)

## Ticket Triage
1. Categorize:
   - Account/Auth
   - Vault data
   - Import/Export
   - Billing
   - UI/Accessibility
2. Assign severity:
   - P0: Security/account lockout/data loss risk
   - P1: Feature blocked for many users
   - P2: Partial issue with workaround
   - P3: Minor/cosmetic
3. Target first response:
   - P0/P1: < 1 hour
   - P2: < 1 business day
   - P3: < 2 business days

## Escalation Rules
- Escalate immediately to engineering for:
  - login failures across users
  - 2FA failures with correct codes
  - vault write failures or missing entries
  - suspected unauthorized account access

## Standard Operating Procedures
- Account recovery:
  - verify identity through registered email flow
  - never request plaintext password
- 2FA lockout:
  - prioritize recovery-code flow
  - require secure identity verification for manual reset
- Data migration:
  - collect sanitized sample CSV/backup when needed
  - never request production `.env` or secrets from user

## Closure
1. Confirm user can reproduce issue no longer.
2. Link root cause or workaround in ticket.
3. Add to internal FAQ if issue pattern repeats.
