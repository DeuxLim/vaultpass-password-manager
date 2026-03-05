<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

if (!push_subscriptions_available()) {
    json_response(['ok' => false, 'error' => 'Push subscriptions require migration 011'], 409);
}

$endpoint = trim((string)($body['endpoint'] ?? ''));
if ($endpoint === '') {
    json_response(['ok' => false, 'error' => 'Endpoint is required'], 422);
}

revoke_push_subscription($userId, $endpoint);

audit_log('push.unsubscribe', $userId, [
    'endpoint_hash' => sha1($endpoint),
]);

json_response(['ok' => true]);

