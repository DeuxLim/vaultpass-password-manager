<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');

$userId = current_user_id();

if (!$userId) {
    json_response(['ok' => true, 'authenticated' => false]);
}

if (current_session_revoked($userId)) {
    $_SESSION = [];
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }
    json_response(['ok' => true, 'authenticated' => false]);
}

touch_user_session($userId);

json_response([
    'ok' => true,
    'authenticated' => true,
    'user' => [
        'id' => $userId,
        'name' => (string)($_SESSION['user_name'] ?? ''),
    ],
]);
