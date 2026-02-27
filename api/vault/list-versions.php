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
$supportsItemType = db_column_exists('vault_items', 'item_type');
$supportsVersionItemType = db_column_exists('vault_item_versions', 'item_type');
$supportsSharedVaultId = db_column_exists('vault_items', 'shared_vault_id');
if ($supportsSharedVaultId && !shared_vaults_available()) {
    $supportsSharedVaultId = false;
}

$itemColumns = $supportsItemType ? 'id, site, item_type' : 'id, site';
if ($supportsSharedVaultId) {
    $itemColumns = 'id, shared_vault_id, site, ' . ($supportsItemType ? 'item_type' : '\'login\' AS item_type');
}

if ($supportsSharedVaultId) {
    $itemStmt = $pdo->prepare(
        "SELECT {$itemColumns}
         FROM vault_items
         WHERE id = :id
           AND (
             (shared_vault_id IS NULL AND user_id = :user_id_personal)
             OR (
               shared_vault_id IS NOT NULL
               AND EXISTS (
                 SELECT 1
                 FROM shared_vault_members svm
                 WHERE svm.shared_vault_id = vault_items.shared_vault_id
                   AND svm.user_id = :user_id_shared
                   AND svm.invitation_status = 'accepted'
               )
             )
           )
         LIMIT 1"
    );
    $itemStmt->execute([
        'id' => $itemId,
        'user_id_personal' => $userId,
        'user_id_shared' => $userId,
    ]);
} else {
    $itemStmt = $pdo->prepare("SELECT {$itemColumns} FROM vault_items WHERE id = :id AND user_id = :user_id LIMIT 1");
    $itemStmt->execute([
        'id' => $itemId,
        'user_id' => $userId,
    ]);
}
$item = $itemStmt->fetch();

if (!$item) {
    json_response(['ok' => false, 'error' => 'Record not found'], 404);
}

try {
    $versionColumns = 'id, vault_item_id, site, folder, tags_json, is_favorite, username_enc, password_enc, notes_enc, source, created_at';
    if ($supportsVersionItemType) {
        $versionColumns = 'id, vault_item_id, site, item_type, folder, tags_json, is_favorite, username_enc, password_enc, notes_enc, source, created_at';
    }
    $stmt = $pdo->prepare(
        "SELECT {$versionColumns}
         FROM vault_item_versions
         WHERE vault_item_id = :item_id
         ORDER BY created_at DESC, id DESC"
    );
    $stmt->execute([
        'item_id' => $itemId,
    ]);
    $rows = $stmt->fetchAll();
} catch (PDOException $e) {
    if ((string)$e->getCode() === '42S22') {
        $legacyStmt = $pdo->prepare(
            'SELECT id, vault_item_id, site, username_enc, password_enc, notes_enc, source, created_at
             FROM vault_item_versions
             WHERE vault_item_id = :item_id
             ORDER BY created_at DESC, id DESC'
        );
        $legacyStmt->execute([
            'item_id' => $itemId,
        ]);
        $rows = $legacyStmt->fetchAll();
    } elseif ((string)$e->getCode() === '42S02') {
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
    } else {
        throw $e;
    }
}

$versions = array_map(static function (array $row): array {
    $tags = json_decode((string)($row['tags_json'] ?? ''), true);
    return [
        'id' => (int)$row['id'],
        'vault_item_id' => (int)$row['vault_item_id'],
        'site' => (string)$row['site'],
        'item_type' => (string)($row['item_type'] ?? 'login'),
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
        'item_type' => (string)($item['item_type'] ?? 'login'),
        'shared_vault_id' => isset($item['shared_vault_id']) && $item['shared_vault_id'] !== null ? (int)$item['shared_vault_id'] : null,
    ],
    'versions' => $versions,
    'history_available' => true,
]);
