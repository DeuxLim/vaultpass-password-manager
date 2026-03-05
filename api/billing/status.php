<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');
$userId = require_auth();

if (!billing_enabled() || !billing_available()) {
    json_response([
        'ok' => true,
        'enabled' => false,
        'entitlement' => [
            'plan' => 'free',
            'status' => 'active',
            'provider' => '',
            'current_period_end' => null,
        ],
    ]);
}

$ent = user_entitlement($userId);
json_response([
    'ok' => true,
    'enabled' => true,
    'entitlement' => $ent,
]);

