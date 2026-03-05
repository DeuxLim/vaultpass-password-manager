# Email (Resend) Setup

VaultPass supports optional transactional email via Resend.

Current notifications (best-effort, non-blocking):
- Shared vault invitation created
- Emergency access request created

If email sending fails, the core API request still succeeds; failures are logged server-side.

## 1) Resend Requirements

- A Resend account
- A verified domain (recommended for production)
- A sender address on that domain (example: `no-reply@yourdomain.com`)

## 2) Environment Variables

Set these in your production environment (Render):

- `EMAIL_ENABLED=true`
- `EMAIL_PROVIDER=resend`
- `RESEND_API_KEY=<your resend api key>`
- `EMAIL_FROM=no-reply@yourdomain.com`
- `EMAIL_FROM_NAME=VaultPass`
- `APP_PUBLIC_URL=https://vaultpass.yourdomain.com` (your Vercel origin)

## 3) Notes

- Resend API calls require outbound HTTPS from your backend.
- Keep `APP_PUBLIC_URL` pointing at the **user-facing** origin so email links open the correct site.

