<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');
$userId = require_auth();
$itemId = (int)($_GET['item_id'] ?? 0);

if ($itemId <= 0) {
    json_response(['ok' => false, 'error' => 'Invalid item id'], 422);
}

$pdo = db();

$itemStmt = $pdo->prepare('SELECT id, site FROM vault_items WHERE id = :id AND user_id = :user_id LIMIT 1');
$itemStmt->execute([
    'id' => $itemId,
    'user_id' => $userId,
]);
$item = $itemStmt->fetch();

if (!$item) {
    json_response(['ok' => false, 'error' => 'Record not found'], 404);
}

$stmt = $pdo->prepare(
    'SELECT id, vault_item_id, site, username_enc, password_enc, notes_enc, source, created_at
     FROM vault_item_versions
     WHERE vault_item_id = :item_id AND user_id = :user_id
     ORDER BY created_at DESC, id DESC'
);
$stmt->execute([
    'item_id' => $itemId,
    'user_id' => $userId,
]);
$rows = $stmt->fetchAll();

$versions = array_map(static function (array $row): array {
    return [
        'id' => (int)$row['id'],
        'vault_item_id' => (int)$row['vault_item_id'],
        'site' => (string)$row['site'],
        'username' => decrypt_value((string)$row['username_enc']),
        'password' => decrypt_value((string)$row['password_enc']),
        'notes' => decrypt_value((string)$row['notes_enc']),
        'source' => (string)$row['source'],
        'created_at' => (string)$row['created_at'],
    ];
}, $rows);

json_response([
    'ok' => true,
    'item' => [
        'id' => (int)$item['id'],
        'site' => (string)$item['site'],
    ],
    'versions' => $versions,
]);
