<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

$site = trim((string)($body['site'] ?? ''));
$username = trim((string)($body['username'] ?? ''));
$password = (string)($body['password'] ?? '');
$notes = trim((string)($body['notes'] ?? ''));

if ($site === '' || $username === '' || $password === '') {
    json_response(['ok' => false, 'error' => 'Site, username, and password are required'], 422);
}

$pdo = db();
$stmt = $pdo->prepare('INSERT INTO vault_items (user_id, site, username_enc, password_enc, notes_enc) VALUES (:user_id, :site, :username_enc, :password_enc, :notes_enc)');
$stmt->execute([
    'user_id' => $userId,
    'site' => $site,
    'username_enc' => encrypt_value($username),
    'password_enc' => encrypt_value($password),
    'notes_enc' => encrypt_value($notes),
]);

$newId = (int)$pdo->lastInsertId();
audit_log('vault.create', $userId, ['vault_item_id' => $newId, 'site' => $site]);

json_response(['ok' => true, 'id' => $newId], 201);
