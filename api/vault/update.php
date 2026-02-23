<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
$userId = require_auth();
$body = request_body();

$id = (int)($body['id'] ?? 0);
$site = trim((string)($body['site'] ?? ''));
$username = trim((string)($body['username'] ?? ''));
$password = (string)($body['password'] ?? '');
$notes = trim((string)($body['notes'] ?? ''));

if ($id <= 0 || $site === '' || $username === '' || $password === '') {
    json_response(['ok' => false, 'error' => 'Invalid request'], 422);
}

$pdo = db();
$stmt = $pdo->prepare('UPDATE vault_items
SET site = :site,
    username_enc = :username_enc,
    password_enc = :password_enc,
    notes_enc = :notes_enc,
    updated_at = CURRENT_TIMESTAMP
WHERE id = :id AND user_id = :user_id');
$stmt->execute([
    'id' => $id,
    'user_id' => $userId,
    'site' => $site,
    'username_enc' => encrypt_value($username),
    'password_enc' => encrypt_value($password),
    'notes_enc' => encrypt_value($notes),
]);

if ($stmt->rowCount() === 0) {
    json_response(['ok' => false, 'error' => 'Record not found'], 404);
}

json_response(['ok' => true]);
