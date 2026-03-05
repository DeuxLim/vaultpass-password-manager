# Privacy-Preserving Analytics (First-Party)

VaultPass includes an optional, first-party analytics collector intended for basic product health metrics.

Principles:
- Off by default
- No third-party trackers
- Minimal event payloads (avoid sensitive fields)
- User-controlled toggle in the dashboard

## Enable

1) Apply migration:
- `sql/migrations/012_add_analytics_events.sql`

2) Set env vars:
- `ANALYTICS_ENABLED=true`
- Optional tuning:
  - `ANALYTICS_RATE_LIMIT_WINDOW=60`
  - `ANALYTICS_RATE_LIMIT_MAX=120`

## Dashboard Toggle

Users can enable/disable analytics from:
- Dashboard sidebar → “Usage Analytics: On/Off”

When disabled, the client does not send events.

## Events (Current)

- `dashboard_view`
- `analytics_enabled`

## Data Stored

Table: `analytics_events`
- `event_name`
- `path`, `referrer`
- `ip_address`, `user_agent`
- `user_id` (nullable)
- `props_json` (optional JSON)

Recommendation:
- Keep retention limited and documented.
- Do not store vault content or secrets in `props_json`.

