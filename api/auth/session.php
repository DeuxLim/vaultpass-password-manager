<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');

$userId = current_user_id();

if (!$userId) {
    json_response(['ok' => true, 'authenticated' => false]);
}

json_response([
    'ok' => true,
    'authenticated' => true,
    'user' => [
        'id' => $userId,
        'name' => (string)($_SESSION['user_name'] ?? ''),
    ],
]);
