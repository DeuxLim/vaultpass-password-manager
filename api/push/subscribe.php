<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

if (!push_notifications_enabled()) {
    json_response(['ok' => false, 'error' => 'Push notifications are disabled'], 409);
}
if (!push_subscriptions_available()) {
    json_response(['ok' => false, 'error' => 'Push subscriptions require migration 011'], 409);
}
if (vapid_public_key() === '') {
    json_response(['ok' => false, 'error' => 'VAPID_PUBLIC_KEY is not configured'], 409);
}

$subscription = is_array($body['subscription'] ?? null) ? (array)$body['subscription'] : [];
$normalized = normalize_push_subscription($subscription);
$validationError = validate_push_subscription($normalized);
if ($validationError !== null) {
    json_response(['ok' => false, 'error' => $validationError], 422);
}

$userAgent = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');
store_push_subscription($userId, $normalized, $userAgent);

audit_log('push.subscribe', $userId, [
    'endpoint_hash' => (string)$normalized['endpoint_hash'],
]);

json_response(['ok' => true]);

