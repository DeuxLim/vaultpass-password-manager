# Billing Integration Plan (Vercel + Render)

Status: Plan (Phase 6 scope)
Owner: VaultPass core team

VaultPass does not yet include billing enforcement in code. This document describes a safe path to add it without harming user experience.

## Provider Recommendation

- Stripe is a strong default for subscriptions and webhooks.
- Alternative providers (Paddle/Lemon Squeezy) are also viable; keep the internal model provider-agnostic.
  - Stripe setup: `docs/billing-stripe.md`

## Architecture

Backend (Render):
- Creates checkout sessions
- Receives webhooks
- Stores subscription state and entitlements in MySQL

Frontend (Vercel):
- Links users to checkout portal hosted by the provider
- Shows plan status and upgrade CTA in the dashboard

## Minimal Data Model (Proposed)

Table: `user_entitlements`
- `user_id`
- `plan` (`free`, `plus`, `family`)
- `status` (`active`, `past_due`, `canceled`)
- `provider` (`stripe`, ...)
- `provider_customer_id`
- `provider_subscription_id`
- `current_period_end`
- timestamps

## UX Principles (Important)

- Never lock users out of their own vault due to billing issues.
- If a subscription lapses:
  - keep vault read/write access
  - disable paid-only features (collaboration, notifications, breach monitoring) as needed
- Provide clear, non-technical messaging on what changed and how to fix it.

## Implementation Steps (Suggested)

1. Add entitlement tables + migration.
2. Add server-side plan checks where relevant (shared vault limits, breach monitor, push/email notifications).
3. Add upgrade flow:
   - “Manage Plan” button in dashboard
   - create checkout session endpoint (auth + CSRF)
4. Add webhook handler:
   - verify signatures
   - update `user_entitlements`
5. Add a “Billing portal” link for self-serve changes/cancellation.
6. Add support playbooks for failed payments and refunds.
