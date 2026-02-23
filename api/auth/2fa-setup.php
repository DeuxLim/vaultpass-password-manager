<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();

if (!two_factor_storage_available()) {
    json_response(['ok' => false, 'error' => 'Two-factor storage unavailable. Run migration 004.'], 503);
}

if (is_two_factor_enabled($userId)) {
    json_response(['ok' => false, 'error' => 'Two-factor authentication is already enabled'], 409);
}

$userStmt = db()->prepare('SELECT email FROM users WHERE id = :id LIMIT 1');
$userStmt->execute(['id' => $userId]);
$user = $userStmt->fetch();
if (!$user) {
    json_response(['ok' => false, 'error' => 'User not found'], 404);
}

$secret = generate_totp_secret();
$recoveryCodes = generate_recovery_codes(8);
$recoveryHashes = hash_recovery_codes($recoveryCodes);

$_SESSION['two_factor_setup_secret'] = $secret;
$_SESSION['two_factor_setup_recovery_hashes'] = $recoveryHashes;
$_SESSION['two_factor_setup_started_at'] = time();

$email = (string)$user['email'];
$uri = two_factor_provisioning_uri($secret, $email);

audit_log('auth.2fa.setup_started', $userId);

json_response([
    'ok' => true,
    'secret' => $secret,
    'otpauth_uri' => $uri,
    'recovery_codes' => $recoveryCodes,
]);
