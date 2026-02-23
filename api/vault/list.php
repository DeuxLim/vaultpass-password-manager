<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');
$userId = require_auth();

$pdo = db();
$stmt = $pdo->prepare('SELECT id, site, username_enc, password_enc, notes_enc, created_at, updated_at FROM vault_items WHERE user_id = :user_id ORDER BY created_at DESC');
$stmt->execute(['user_id' => $userId]);
$rows = $stmt->fetchAll();

$items = array_map(static function (array $row): array {
    return [
        'id' => (int)$row['id'],
        'site' => (string)$row['site'],
        'username' => decrypt_value((string)$row['username_enc']),
        'password' => decrypt_value((string)$row['password_enc']),
        'notes' => decrypt_value((string)$row['notes_enc']),
        'created_at' => (string)$row['created_at'],
        'updated_at' => (string)$row['updated_at'],
    ];
}, $rows);

json_response(['ok' => true, 'items' => $items]);
