<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');

$zeroKnowledgeEnabled = filter_var(getenv('ZERO_KNOWLEDGE_CLIENT_ENCRYPTION') ?: 'false', FILTER_VALIDATE_BOOLEAN);
$rawSessionUserId = $_SESSION['user_id'] ?? null;
$userId = current_user_id();

if (!$userId) {
    if (is_numeric($rawSessionUserId) && session_status() === PHP_SESSION_ACTIVE) {
        $_SESSION = [];
        session_destroy();
    }

    json_response([
        'ok' => true,
        'authenticated' => false,
        'session_policy' => session_timeout_policy(),
        'feature_flags' => [
            'zero_knowledge_client_encryption' => $zeroKnowledgeEnabled,
        ],
    ]);
}

if (current_session_revoked($userId)) {
    $_SESSION = [];
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }
    json_response(['ok' => true, 'authenticated' => false]);
}

touch_user_session($userId);
touch_session_activity();

json_response([
    'ok' => true,
    'authenticated' => true,
    'session_policy' => session_timeout_policy(),
    'feature_flags' => [
        'zero_knowledge_client_encryption' => $zeroKnowledgeEnabled,
    ],
    'user' => [
        'id' => $userId,
        'name' => (string)($_SESSION['user_name'] ?? ''),
    ],
]);
