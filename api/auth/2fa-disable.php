<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();

$record = get_user_two_factor($userId);
if (!$record) {
    json_response(['ok' => false, 'error' => 'Two-factor authentication is not enabled'], 409);
}

$body = request_body();
$password = (string)($body['password'] ?? '');
$token = (string)($body['token'] ?? '');

if ($password === '' || $token === '') {
    json_response(['ok' => false, 'error' => 'Password and verification token are required'], 422);
}

$userStmt = db()->prepare('SELECT password_hash FROM users WHERE id = :id LIMIT 1');
$userStmt->execute(['id' => $userId]);
$user = $userStmt->fetch();
if (!$user || !password_verify($password, (string)$user['password_hash'])) {
    json_response(['ok' => false, 'error' => 'Invalid password'], 401);
}

$verified = verify_totp_code($record['secret'], $token);
if (!$verified) {
    $updated = null;
    $verified = consume_recovery_code($token, $record['recovery_hashes'], $updated);
    if ($verified && is_array($updated)) {
        update_user_recovery_hashes($userId, $updated);
    }
}

if (!$verified) {
    json_response(['ok' => false, 'error' => 'Invalid verification token'], 401);
}

disable_user_two_factor($userId);
audit_log('auth.2fa.disabled', $userId);

json_response(['ok' => true, 'enabled' => false]);
