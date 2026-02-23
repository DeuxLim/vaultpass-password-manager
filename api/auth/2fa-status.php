<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');
$userId = require_auth();

$record = get_user_two_factor($userId);

json_response([
    'ok' => true,
    'enabled' => $record !== null,
    'recovery_codes_remaining' => $record ? recovery_codes_remaining($record['recovery_hashes']) : 0,
]);
