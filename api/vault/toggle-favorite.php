<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

$id = (int)($body['id'] ?? 0);
$isFavorite = ((int)($body['is_favorite'] ?? 0)) === 1;

if ($id <= 0) {
    json_response(['ok' => false, 'error' => 'Invalid record id'], 422);
}

$pdo = db();
$supportsSharedVaultId = db_column_exists('vault_items', 'shared_vault_id');
if ($supportsSharedVaultId && !shared_vaults_available()) {
    $supportsSharedVaultId = false;
}

if ($supportsSharedVaultId) {
    $stmt = $pdo->prepare(
        'UPDATE vault_items
         SET is_favorite = :is_favorite,
             updated_at = CURRENT_TIMESTAMP
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
                   AND svm.invitation_status = \'accepted\'
                   AND svm.role IN (\'owner\', \'editor\')
               )
             )
           )'
    );
    $stmt->execute([
        'id' => $id,
        'user_id_personal' => $userId,
        'user_id_shared' => $userId,
        'is_favorite' => $isFavorite ? 1 : 0,
    ]);
} else {
    $stmt = $pdo->prepare(
        'UPDATE vault_items
         SET is_favorite = :is_favorite,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = :id
           AND user_id = :user_id'
    );
    $stmt->execute([
        'id' => $id,
        'user_id' => $userId,
        'is_favorite' => $isFavorite ? 1 : 0,
    ]);
}

if ($stmt->rowCount() < 1) {
    json_response(['ok' => false, 'error' => 'Record not found'], 404);
}

audit_log('vault.favorite_toggle', $userId, [
    'vault_item_id' => $id,
    'is_favorite' => $isFavorite,
]);

json_response(['ok' => true, 'id' => $id, 'is_favorite' => $isFavorite]);
