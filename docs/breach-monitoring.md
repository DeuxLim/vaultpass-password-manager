# Breach Monitoring (Optional)

VaultPass supports an optional breach monitoring feature for **login passwords** using the Have I Been Pwned (HIBP) **Pwned Passwords** API range model (k-anonymity).

## What It Does

- Adds a per-login “Breach” check action in the dashboard.
- The backend computes a SHA-1 hash of the password and sends only the first 5 characters (prefix) to HIBP.
- HIBP returns suffixes and counts for the prefix range; VaultPass matches locally and returns the breach count.

## Enable

Set in `.env`:

- `BREACH_MONITOR_ENABLED=true`
- `HIBP_USER_AGENT=VaultPass (your email or site)`

## Endpoint

- `POST /api/breach/check-password.php` (CSRF + auth required)

## Notes

- This checks *password reuse in known breaches*, not site breach status.
- External network access is required when enabled.
- Results are audit logged (`breach.check_password`).

