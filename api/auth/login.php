<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');

$body = request_body();
$email = strtolower(trim((string)($body['email'] ?? '')));
$password = (string)($body['password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
    json_response(['ok' => false, 'error' => 'Invalid credentials'], 422);
}

$pdo = db();
$stmt = $pdo->prepare('SELECT id, name, email, password_hash FROM users WHERE email = :email LIMIT 1');
$stmt->execute(['email' => $email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, (string)$user['password_hash'])) {
    json_response(['ok' => false, 'error' => 'Invalid credentials'], 401);
}

session_regenerate_id(true);
$_SESSION['user_id'] = (int)$user['id'];
$_SESSION['user_name'] = (string)$user['name'];

json_response([
    'ok' => true,
    'user' => [
        'id' => (int)$user['id'],
        'name' => (string)$user['name'],
        'email' => (string)$user['email'],
    ],
]);
