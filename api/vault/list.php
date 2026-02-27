<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');
$userId = require_auth();

$pdo = db();
$supportsItemType = db_column_exists('vault_items', 'item_type');
$supportsSharedVaultId = db_column_exists('vault_items', 'shared_vault_id');
if ($supportsSharedVaultId && !shared_vaults_available()) {
    $supportsSharedVaultId = false;
}
try {
    $columns = 'id, site, folder, tags_json, is_favorite, username_enc, password_enc, notes_enc, created_at, updated_at';
    if ($supportsItemType) {
        $columns = 'id, site, item_type, folder, tags_json, is_favorite, username_enc, password_enc, notes_enc, created_at, updated_at';
    }
    if ($supportsSharedVaultId) {
        $columns = 'id, shared_vault_id, site, ' . ($supportsItemType ? 'item_type, ' : '') . 'folder, tags_json, is_favorite, username_enc, password_enc, notes_enc, created_at, updated_at';
    }

    $whereClause = 'user_id = :user_id';
    if ($supportsSharedVaultId) {
        $whereClause = '(vault_items.user_id = :user_id_personal AND vault_items.shared_vault_id IS NULL)
            OR (
                vault_items.shared_vault_id IS NOT NULL
                AND EXISTS (
                    SELECT 1
                    FROM shared_vault_members svm
                    WHERE svm.shared_vault_id = vault_items.shared_vault_id
                      AND svm.user_id = :user_id_shared
                      AND svm.invitation_status = \'accepted\'
                )
            )';
    }

    $stmt = $pdo->prepare(
        "SELECT {$columns}
         FROM vault_items
         WHERE {$whereClause}
         ORDER BY created_at DESC"
    );
    if ($supportsSharedVaultId) {
        $stmt->execute([
            'user_id_personal' => $userId,
            'user_id_shared' => $userId,
        ]);
    } else {
        $stmt->execute(['user_id' => $userId]);
    }
    $rows = $stmt->fetchAll();
} catch (PDOException $e) {
    if ((string)$e->getCode() === '42S22') {
        // Backward-compatible fallback for databases that have not run migration 005 yet.
        $legacyStmt = $pdo->prepare(
            'SELECT id, site, username_enc, password_enc, notes_enc, created_at, updated_at
             FROM vault_items
             WHERE user_id = :user_id
             ORDER BY created_at DESC'
        );
        $legacyStmt->execute(['user_id' => $userId]);
        $rows = $legacyStmt->fetchAll();
    } else {
        throw $e;
    }
}

$items = array_map(static function (array $row): array {
    $tags = json_decode((string)($row['tags_json'] ?? ''), true);
    return [
        'id' => (int)$row['id'],
        'site' => (string)$row['site'],
        'shared_vault_id' => isset($row['shared_vault_id']) && $row['shared_vault_id'] !== null ? (int)$row['shared_vault_id'] : null,
        'item_type' => (string)($row['item_type'] ?? 'login'),
        'folder' => (string)($row['folder'] ?? ''),
        'tags' => is_array($tags) ? array_values(array_filter($tags, static fn ($tag): bool => is_string($tag) && trim($tag) !== '')) : [],
        'is_favorite' => ((int)($row['is_favorite'] ?? 0)) === 1,
        'username' => decrypt_value((string)$row['username_enc']),
        'password' => decrypt_value((string)$row['password_enc']),
        'notes' => decrypt_value((string)$row['notes_enc']),
        'created_at' => (string)$row['created_at'],
        'updated_at' => (string)$row['updated_at'],
    ];
}, $rows);

json_response(['ok' => true, 'items' => $items]);
