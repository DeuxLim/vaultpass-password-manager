# Emergency Access

This document defines the initial Emergency Access workflow implemented in Phase 4.

## Purpose

Emergency Access allows a user (owner) to designate a trusted contact (grantee) who can request time-delayed access in an account-recovery scenario.

## Current Capabilities

- Owner can create/update an emergency grant to a registered user by email.
- Owner can revoke a grant.
- Grantee can request emergency access against an enabled grant.
- Grantee can cancel their own pending emergency request.
- Owner can approve or deny a pending request.
- Approval records an expiration timestamp based on the configured wait period.

## API Endpoints

- `GET /api/emergency-access/list.php`
- `POST /api/emergency-access/grant.php`
- `POST /api/emergency-access/revoke.php`
- `POST /api/emergency-access/request.php`
- `POST /api/emergency-access/cancel-request.php`
- `POST /api/emergency-access/decide.php`

All mutating endpoints require:

- active authenticated session
- CSRF token

## Data Model

Migration: `sql/migrations/010_add_emergency_access.sql`

Tables:

- `emergency_access_grants`
- `emergency_access_requests`

## Security Notes

- Requests and decisions are audit logged.
- Duplicate pending requests on the same grant are blocked.
- Only owner can decide request outcomes.
- Only the designated grantee can request access.

## Known Limitations (Current Phase)

- No automated unlock/exposure of vault items yet after approval.
- No email/push notification delivery yet.
- No owner-side emergency access policy UI beyond dashboard actions.

These are planned follow-up slices for Phase 4 polish.
