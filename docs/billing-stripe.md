# Stripe Billing Setup

Status: Setup guide (Phase 6)
Owner: VaultPass core team

VaultPass includes an optional Stripe subscription scaffold:
- Checkout session creation (authenticated + CSRF)
- Webhook handler (signature verified)
- Entitlement storage in MySQL

## 1) Apply Migration

- `sql/migrations/013_add_user_entitlements.sql`

## 2) Create Stripe Products/Prices

Create recurring prices (subscriptions), then copy the Price IDs.

Recommended:
- Plus plan price ID → `STRIPE_PRICE_ID_PLUS`
- Family plan price ID → `STRIPE_PRICE_ID_FAMILY`

## 3) Configure Environment Variables (Render)

- `BILLING_ENABLED=true`
- `APP_PUBLIC_URL=https://vaultpass.yourdomain.com` (your Vercel origin)
- `STRIPE_SECRET_KEY=sk_live_...`
- `STRIPE_WEBHOOK_SECRET=whsec_...`
- `STRIPE_PRICE_ID_PLUS=price_...`
- `STRIPE_PRICE_ID_FAMILY=price_...`

## 4) Configure Webhook in Stripe

Webhook URL (backend / Render origin):
- `https://your-render-origin.onrender.com/api/billing/webhook.php`

Events:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## 5) User Flow

1. User opens Dashboard → Plan
2. Clicks upgrade (Plus/Family)
3. Completes Stripe Checkout
4. Webhook updates `user_entitlements`

Notes:
- Plan updates can take a short time after payment (webhook delivery).
- Billing is optional; if disabled, users stay on Free and the UI indicates billing is unavailable.

