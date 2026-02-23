<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');
$userId = require_auth();

if (!two_factor_storage_available()) {
    json_response([
        'ok' => true,
        'enabled' => false,
        'recovery_codes_remaining' => 0,
        'available' => false,
        'warning' => 'Two-factor storage is unavailable. Run migration 004.',
    ]);
}

$record = get_user_two_factor($userId);

json_response([
    'ok' => true,
    'enabled' => $record !== null,
    'recovery_codes_remaining' => $record ? recovery_codes_remaining($record['recovery_hashes']) : 0,
    'available' => true,
]);
