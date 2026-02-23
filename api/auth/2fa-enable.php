<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();

if (is_two_factor_enabled($userId)) {
    json_response(['ok' => false, 'error' => 'Two-factor authentication is already enabled'], 409);
}

$secret = (string)($_SESSION['two_factor_setup_secret'] ?? '');
$recoveryHashes = $_SESSION['two_factor_setup_recovery_hashes'] ?? null;
$setupStartedAt = (int)($_SESSION['two_factor_setup_started_at'] ?? 0);

if ($secret === '' || !is_array($recoveryHashes) || $setupStartedAt <= 0) {
    json_response(['ok' => false, 'error' => 'Setup not initialized. Start setup again.'], 400);
}

if ((time() - $setupStartedAt) > 1800) {
    unset($_SESSION['two_factor_setup_secret'], $_SESSION['two_factor_setup_recovery_hashes'], $_SESSION['two_factor_setup_started_at']);
    json_response(['ok' => false, 'error' => 'Setup expired. Start setup again.'], 400);
}

$body = request_body();
$code = (string)($body['code'] ?? '');

if (!verify_totp_code($secret, $code)) {
    json_response(['ok' => false, 'error' => 'Invalid verification code'], 422);
}

save_user_two_factor($userId, $secret, $recoveryHashes);

unset($_SESSION['two_factor_setup_secret'], $_SESSION['two_factor_setup_recovery_hashes'], $_SESSION['two_factor_setup_started_at']);

audit_log('auth.2fa.enabled', $userId);

json_response([
    'ok' => true,
    'enabled' => true,
    'recovery_codes_remaining' => recovery_codes_remaining($recoveryHashes),
]);
