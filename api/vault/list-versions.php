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
    'SELECT id, vault_item_id, site, folder, tags_json, is_favorite, username_enc, password_enc, notes_enc, source, created_at
     FROM vault_item_versions
     WHERE vault_item_id = :item_id AND user_id = :user_id
     ORDER BY created_at DESC, id DESC'
);
try {
    $stmt->execute([
        'item_id' => $itemId,
        'user_id' => $userId,
    ]);
    $rows = $stmt->fetchAll();
} catch (PDOException $e) {
    if ((string)$e->getCode() === '42S02') {
        json_response([
            'ok' => true,
            'item' => [
                'id' => (int)$item['id'],
                'site' => (string)$item['site'],
            ],
            'versions' => [],
            'history_available' => false,
            'warning' => 'Vault history table is not available. Run migration 002.',
        ]);
    }

    throw $e;
}

$versions = array_map(static function (array $row): array {
    $tags = json_decode((string)($row['tags_json'] ?? ''), true);
    return [
        'id' => (int)$row['id'],
        'vault_item_id' => (int)$row['vault_item_id'],
        'site' => (string)$row['site'],
        'folder' => (string)($row['folder'] ?? ''),
        'tags' => is_array($tags) ? array_values(array_filter($tags, static fn ($tag): bool => is_string($tag) && trim($tag) !== '')) : [],
        'is_favorite' => ((int)($row['is_favorite'] ?? 0)) === 1,
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
    'history_available' => true,
]);
