# Push Notifications (PWA) — Scaffold

VaultPass includes an optional push notification scaffold intended for future delivery of security-event alerts.

## What’s Implemented

- Dashboard UI to request permission + subscribe/unsubscribe.
- Backend endpoints to store/revoke the push subscription.
- Service worker push handler for displaying notifications (delivery not wired yet).

## Enable

1. Apply migration:

```bash
mysql -u root -p < sql/migrations/011_add_push_subscriptions.sql
```

2. Set env vars:

- `PUSH_NOTIFICATIONS_ENABLED=true`
- `VAPID_PUBLIC_KEY=...`
- `VAPID_PRIVATE_KEY=...` (reserved for future delivery worker)

3. Use HTTPS in production (push requires secure context).

## Endpoints

- `GET /api/push/status.php`
- `POST /api/push/subscribe.php`
- `POST /api/push/unsubscribe.php`

## Notes

- Storing subscriptions does not send notifications yet.
- Delivery requires a server-side web-push sender and background job/trigger on security events.

