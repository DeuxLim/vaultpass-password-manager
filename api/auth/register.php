<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');

$body = request_body();
$email = strtolower(trim((string)($body['email'] ?? '')));
$password = (string)($body['password'] ?? '');
$name = trim((string)($body['name'] ?? ''));

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
$_SESSION['user_id'] = $userId;
$_SESSION['user_name'] = $name;

json_response([
    'ok' => true,
    'user' => [
        'id' => $userId,
        'name' => $name,
        'email' => $email,
    ],
]);
