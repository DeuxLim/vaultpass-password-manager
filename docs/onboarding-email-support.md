# Onboarding + Email + Support (Phase 6)

Status: Implementation notes / operating assumptions
Owner: VaultPass core team

## Onboarding (Current)

VaultPass currently uses a simple email+password registration and optional 2FA.

Recommended minimum onboarding steps for production:
- Encourage enabling 2FA after first login.
- Encourage saving recovery codes.
- Add/import 1–2 credentials to validate core flow.

## Email Lifecycle (Current + Optional)

VaultPass email is optional and is intended for transactional notifications only.

Implemented notifications (when enabled):
- Shared vault invitations
- Emergency access requests

Provider:
- Resend (`docs/email-resend.md`)

Non-goals (current):
- Marketing email campaigns
- Automated onboarding drip sequences
- Password-reset email flow (separate design needed with zero-knowledge implications)

## Support Workflow

Support operations checklist:
- `docs/support-workflow.md`

Production recommendation:
- Publish a support email and response-time expectation.
- Treat account access issues (2FA lockouts) as highest priority.

