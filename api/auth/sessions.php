<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');
$userId = require_auth();

$sessions = list_user_sessions($userId);

json_response([
    'ok' => true,
    'sessions' => $sessions,
]);
