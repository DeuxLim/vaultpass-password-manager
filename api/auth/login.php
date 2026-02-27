<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();

$body = request_body();
$email = normalize_email_input($body['email'] ?? '');
$password = (string)($body['password'] ?? '');

if (!is_valid_email_format($email) || $password === '') {
    json_response(['ok' => false, 'error' => 'Invalid credentials'], 422);
}

$ipWindow = rate_limit_int_env('LOGIN_RATE_LIMIT_WINDOW', 60);
$ipMax = rate_limit_int_env('LOGIN_RATE_LIMIT_MAX', 20);
$emailWindow = rate_limit_int_env('LOGIN_EMAIL_RATE_LIMIT_WINDOW', 300);
$emailMax = rate_limit_int_env('LOGIN_EMAIL_RATE_LIMIT_MAX', 8);
$lockoutWindow = rate_limit_int_env('ACCOUNT_LOCKOUT_WINDOW', 900);
$lockoutMax = rate_limit_int_env('ACCOUNT_LOCKOUT_MAX', 8);
$lockoutDuration = rate_limit_int_env('ACCOUNT_LOCKOUT_DURATION', 900);
$lockoutKey = account_lockout_key_for_email($email);

enforce_account_lockout($lockoutKey, $lockoutMax, $lockoutWindow, $lockoutDuration);
enforce_rate_limit('auth:login:ip:' . request_ip(), $ipMax, $ipWindow);
enforce_rate_limit('auth:login:email:' . $email, $emailMax, $emailWindow);

$pdo = db();
$stmt = $pdo->prepare(
    'SELECT
        u.id,
        u.name,
        u.email,
        u.password_hash,
        utf.user_id AS two_factor_user_id
     FROM users u
     LEFT JOIN user_two_factor utf ON utf.user_id = u.id
     WHERE u.email = :email
     LIMIT 1'
);
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, (string)$user['password_hash'])) {
    $lockoutState = record_account_lockout_failure($lockoutKey, $lockoutMax, $lockoutWindow, $lockoutDuration);
    audit_log('auth.login.failed', null, [
        'email_sha256' => hash('sha256', $email),
        'account_locked' => (bool)($lockoutState['locked'] ?? false),
    ]);
    json_response(['ok' => false, 'error' => 'Invalid credentials'], 401);
}

clear_account_lockout($lockoutKey);

if (!empty($user['two_factor_user_id'])) {
    session_regenerate_id(true);
    csrf_token();

    $_SESSION['pending_2fa_user_id'] = (int)$user['id'];
    $_SESSION['pending_2fa_user_name'] = (string)$user['name'];
    $_SESSION['pending_2fa_user_email'] = (string)$user['email'];
    $_SESSION['pending_2fa_started_at'] = time();

    unset($_SESSION['user_id'], $_SESSION['user_name']);

    audit_log('auth.login.challenge', (int)$user['id']);

    json_response([
        'ok' => true,
        'requires_2fa' => true,
    ]);
}

session_regenerate_id(true);
csrf_token();
$_SESSION['user_id'] = (int)$user['id'];
$_SESSION['user_name'] = (string)$user['name'];
mark_session_authenticated();
register_user_session((int)$user['id']);
audit_log('auth.login.success', (int)$user['id']);

json_response([
    'ok' => true,
    'user' => [
        'id' => (int)$user['id'],
        'name' => (string)$user['name'],
        'email' => (string)$user['email'],
    ],
]);
