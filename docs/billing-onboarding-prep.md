# Billing and Onboarding Prep

Owner: VaultPass product + engineering  
Last updated: 2026-02-23

## Billing Preparation
- Define plans:
  - Free: core vault + generator
  - Pro: advanced security features + future sharing
  - Team/Family: shared vault roles and management
- Required integration decisions:
  - payment provider
  - subscription lifecycle webhooks
  - tax/VAT handling approach
- Backend tasks:
  - user billing profile table
  - subscription state machine
  - webhook signature validation

## Onboarding Preparation
- First-run setup flow:
  - create first vault item
  - enable 2FA prompt
  - import from CSV/backup prompt
- In-product education:
  - empty-state guidance
  - security settings checklist
  - backup reminder cadence

## MVP Definition for Commercial Launch
- Account registration/login/2FA stable.
- Vault CRUD/import/export/session controls stable.
- Pricing page and account billing section linked.
- Support and incident workflows active.
