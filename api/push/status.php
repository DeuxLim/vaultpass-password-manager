<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');
require_auth();

$enabled = push_notifications_enabled();
$available = push_subscriptions_available();
$publicKey = vapid_public_key();

json_response([
    'ok' => true,
    'enabled' => $enabled,
    'available' => $available,
    'vapid_public_key' => $enabled ? $publicKey : '',
]);

