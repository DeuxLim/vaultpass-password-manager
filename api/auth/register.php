<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();

$body = request_body();
$email = strtolower(trim((string)($body['email'] ?? '')));
$password = (string)($body['password'] ?? '');
$name = trim((string)($body['name'] ?? ''));

$ipWindow = rate_limit_int_env('REGISTER_RATE_LIMIT_WINDOW', 300);
$ipMax = rate_limit_int_env('REGISTER_RATE_LIMIT_MAX', 10);
$emailWindow = rate_limit_int_env('REGISTER_EMAIL_RATE_LIMIT_WINDOW', 900);
$emailMax = rate_limit_int_env('REGISTER_EMAIL_RATE_LIMIT_MAX', 3);

enforce_rate_limit('auth:register:ip:' . request_ip(), $ipMax, $ipWindow);
enforce_rate_limit('auth:register:email:' . $email, $emailMax, $emailWindow);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['ok' => false, 'error' => 'Invalid email'], 422);
}

if (strlen($password) < 8) {
    json_response(['ok' => false, 'error' => 'Password must be at least 8 characters'], 422);
}

if ($name === '') {
    json_response(['ok' => false, 'error' => 'Name is required'], 422);
}

$pdo = db();

$existsStmt = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
$existsStmt->execute(['email' => $email]);
if ($existsStmt->fetch()) {
    json_response(['ok' => false, 'error' => 'Email already registered'], 409);
}

$hash = password_hash($password, PASSWORD_BCRYPT);
$insertStmt = $pdo->prepare('INSERT INTO users (name, email, password_hash) VALUES (:name, :email, :password_hash)');
$insertStmt->execute([
    'name' => $name,
    'email' => $email,
    'password_hash' => $hash,
]);

$userId = (int)$pdo->lastInsertId();
session_regenerate_id(true);
csrf_token();
$_SESSION['user_id'] = $userId;
$_SESSION['user_name'] = $name;
register_user_session($userId);
audit_log('auth.register.success', $userId, ['email_sha256' => hash('sha256', $email)]);

json_response([
    'ok' => true,
    'user' => [
        'id' => $userId,
        'name' => $name,
        'email' => $email,
    ],
]);
