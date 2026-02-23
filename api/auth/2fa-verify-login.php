<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();

$pendingUserId = (int)($_SESSION['pending_2fa_user_id'] ?? 0);
$pendingUserName = (string)($_SESSION['pending_2fa_user_name'] ?? '');
$pendingUserEmail = (string)($_SESSION['pending_2fa_user_email'] ?? '');
$startedAt = (int)($_SESSION['pending_2fa_started_at'] ?? 0);

if ($pendingUserId <= 0 || $startedAt <= 0) {
    json_response(['ok' => false, 'error' => 'No pending login challenge'], 401);
}

if ((time() - $startedAt) > 600) {
    unset(
        $_SESSION['pending_2fa_user_id'],
        $_SESSION['pending_2fa_user_name'],
        $_SESSION['pending_2fa_user_email'],
        $_SESSION['pending_2fa_started_at']
    );
    json_response(['ok' => false, 'error' => 'Login challenge expired. Please sign in again.'], 401);
}

$ipWindow = rate_limit_int_env('LOGIN_2FA_RATE_LIMIT_WINDOW', 300);
$ipMax = rate_limit_int_env('LOGIN_2FA_RATE_LIMIT_MAX', 12);
enforce_rate_limit('auth:login:2fa:ip:' . request_ip(), $ipMax, $ipWindow);
enforce_rate_limit('auth:login:2fa:user:' . $pendingUserId, $ipMax, $ipWindow);

if (!two_factor_storage_available()) {
    unset(
        $_SESSION['pending_2fa_user_id'],
        $_SESSION['pending_2fa_user_name'],
        $_SESSION['pending_2fa_user_email'],
        $_SESSION['pending_2fa_started_at']
    );
    json_response(['ok' => false, 'error' => 'Two-factor storage unavailable. Please sign in again after database migration.'], 503);
}

$record = get_user_two_factor($pendingUserId);
if (!$record) {
    unset(
        $_SESSION['pending_2fa_user_id'],
        $_SESSION['pending_2fa_user_name'],
        $_SESSION['pending_2fa_user_email'],
        $_SESSION['pending_2fa_started_at']
    );
    json_response(['ok' => false, 'error' => 'Two-factor authentication is no longer enabled. Please sign in again.'], 401);
}

$body = request_body();
$token = (string)($body['token'] ?? '');
if ($token === '') {
    json_response(['ok' => false, 'error' => 'Verification token is required'], 422);
}

$usedRecoveryCode = false;
$verified = verify_totp_code($record['secret'], $token);
if (!$verified) {
    $updated = null;
    $verified = consume_recovery_code($token, $record['recovery_hashes'], $updated);
    if ($verified && is_array($updated)) {
        update_user_recovery_hashes($pendingUserId, $updated);
        $usedRecoveryCode = true;
    }
}

if (!$verified) {
    audit_log('auth.login.2fa.failed', $pendingUserId);
    json_response(['ok' => false, 'error' => 'Invalid verification token'], 401);
}

session_regenerate_id(true);
csrf_token();
$_SESSION['user_id'] = $pendingUserId;
$_SESSION['user_name'] = $pendingUserName;
register_user_session($pendingUserId);

unset(
    $_SESSION['pending_2fa_user_id'],
    $_SESSION['pending_2fa_user_name'],
    $_SESSION['pending_2fa_user_email'],
    $_SESSION['pending_2fa_started_at']
);

audit_log('auth.login.2fa.success', $pendingUserId, ['used_recovery_code' => $usedRecoveryCode]);

json_response([
    'ok' => true,
    'user' => [
        'id' => $pendingUserId,
        'name' => $pendingUserName,
        'email' => $pendingUserEmail,
    ],
]);
