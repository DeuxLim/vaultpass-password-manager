<?php

declare(strict_types=1);

function push_notifications_enabled(): bool
{
    $config = app_config();
    return (bool)($config['push_notifications_enabled'] ?? false);
}

function vapid_public_key(): string
{
    $config = app_config();
    return trim((string)($config['vapid_public_key'] ?? ''));
}

function push_subscriptions_available(): bool
{
    return db_table_exists('user_push_subscriptions');
}

function normalize_push_subscription(array $input): array
{
    $endpoint = trim((string)($input['endpoint'] ?? ''));
    $keys = $input['keys'] ?? null;
    $keysArr = is_array($keys) ? $keys : [];

    $p256dh = trim((string)($keysArr['p256dh'] ?? ''));
    $auth = trim((string)($keysArr['auth'] ?? ''));

    return [
        'endpoint' => $endpoint,
        'endpoint_hash' => sha1($endpoint),
        'keys_json' => json_encode([
            'p256dh' => $p256dh,
            'auth' => $auth,
        ], JSON_UNESCAPED_UNICODE),
    ];
}

function validate_push_subscription(array $normalized): ?string
{
    if (($normalized['endpoint'] ?? '') === '') {
        return 'Endpoint is required';
    }
    if (($normalized['endpoint_hash'] ?? '') === '' || strlen((string)$normalized['endpoint_hash']) !== 40) {
        return 'Invalid endpoint hash';
    }
    return null;
}

function store_push_subscription(int $userId, array $normalized, string $userAgent = ''): void
{
    $pdo = db();
    $stmt = $pdo->prepare(
        'INSERT INTO user_push_subscriptions (user_id, endpoint, endpoint_hash, keys_json, user_agent, revoked_at)
         VALUES (:user_id, :endpoint, :endpoint_hash, :keys_json, :user_agent, NULL)
         ON DUPLICATE KEY UPDATE
            user_id = VALUES(user_id),
            endpoint = VALUES(endpoint),
            keys_json = VALUES(keys_json),
            user_agent = VALUES(user_agent),
            revoked_at = NULL,
            updated_at = CURRENT_TIMESTAMP'
    );
    $stmt->execute([
        'user_id' => $userId,
        'endpoint' => (string)$normalized['endpoint'],
        'endpoint_hash' => (string)$normalized['endpoint_hash'],
        'keys_json' => (string)($normalized['keys_json'] ?? ''),
        'user_agent' => mb_substr(trim($userAgent), 0, 255),
    ]);
}

function revoke_push_subscription(int $userId, string $endpoint): void
{
    $hash = sha1($endpoint);
    $pdo = db();
    $stmt = $pdo->prepare(
        'UPDATE user_push_subscriptions
         SET revoked_at = CURRENT_TIMESTAMP
         WHERE endpoint_hash = :endpoint_hash
           AND user_id = :user_id'
    );
    $stmt->execute([
        'endpoint_hash' => $hash,
        'user_id' => $userId,
    ]);
}

