<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();
$versionId = (int)($body['version_id'] ?? 0);

if ($versionId <= 0) {
    json_response(['ok' => false, 'error' => 'Invalid version id'], 422);
}

$pdo = db();
$supportsItemType = db_column_exists('vault_items', 'item_type');
$supportsVersionItemType = db_column_exists('vault_item_versions', 'item_type');
$supportsSharedVaultId = db_column_exists('vault_items', 'shared_vault_id');
if ($supportsSharedVaultId && !shared_vaults_available()) {
    $supportsSharedVaultId = false;
}

try {
    $pdo->beginTransaction();

    $versionItemTypeSelect = $supportsVersionItemType ? 'vv.item_type AS version_item_type,' : '';
    $currentItemTypeSelect = $supportsItemType ? 'vi.item_type AS current_item_type,' : '';
    $sharedSelect = $supportsSharedVaultId ? 'vi.shared_vault_id AS current_shared_vault_id,' : '';
    $permissionClause = 'vi.user_id = :user_id';
    $params = [
        'version_id' => $versionId,
        'user_id' => $userId,
    ];
    if ($supportsSharedVaultId) {
        $permissionClause = '(vi.shared_vault_id IS NULL AND vi.user_id = :user_id_personal)
           OR (
             vi.shared_vault_id IS NOT NULL
             AND EXISTS (
               SELECT 1
               FROM shared_vault_members svm
               WHERE svm.shared_vault_id = vi.shared_vault_id
                 AND svm.user_id = :user_id_shared
                 AND svm.invitation_status = \'accepted\'
                 AND svm.role IN (\'owner\', \'editor\')
             )
           )';
        $params = [
            'version_id' => $versionId,
            'user_id_personal' => $userId,
            'user_id_shared' => $userId,
        ];
    }

    $stmt = $pdo->prepare(
        'SELECT
            vv.id AS version_id,
            vv.vault_item_id,
            vv.site AS version_site,
            ' . $versionItemTypeSelect . '
            vv.folder AS version_folder,
            vv.tags_json AS version_tags_json,
            vv.is_favorite AS version_is_favorite,
            vv.username_enc AS version_username_enc,
            vv.password_enc AS version_password_enc,
            vv.notes_enc AS version_notes_enc,
            ' . $sharedSelect . '
            vi.site AS current_site,
            ' . $currentItemTypeSelect . '
            vi.folder AS current_folder,
            vi.tags_json AS current_tags_json,
            vi.is_favorite AS current_is_favorite,
            vi.username_enc AS current_username_enc,
            vi.password_enc AS current_password_enc,
            vi.notes_enc AS current_notes_enc
         FROM vault_item_versions vv
         INNER JOIN vault_items vi ON vi.id = vv.vault_item_id
         WHERE vv.id = :version_id
           AND (' . $permissionClause . ')
         LIMIT 1
         FOR UPDATE'
    );
    $stmt->execute($params);
    $row = $stmt->fetch();

    if (!$row) {
        $pdo->rollBack();
        json_response(['ok' => false, 'error' => 'Version not found'], 404);
    }

    if ($supportsVersionItemType && $supportsItemType) {
        $snapshotStmt = $pdo->prepare(
            'INSERT INTO vault_item_versions (vault_item_id, user_id, site, item_type, folder, tags_json, is_favorite, username_enc, password_enc, notes_enc, source)
             VALUES (:vault_item_id, :user_id, :site, :item_type, :folder, :tags_json, :is_favorite, :username_enc, :password_enc, :notes_enc, :source)'
        );
        $snapshotStmt->execute([
            'vault_item_id' => (int)$row['vault_item_id'],
            'user_id' => $userId,
            'site' => (string)$row['current_site'],
            'item_type' => (string)($row['current_item_type'] ?? 'login'),
            'folder' => (string)($row['current_folder'] ?? ''),
            'tags_json' => ($row['current_tags_json'] ?? null),
            'is_favorite' => (int)($row['current_is_favorite'] ?? 0),
            'username_enc' => (string)$row['current_username_enc'],
            'password_enc' => (string)$row['current_password_enc'],
            'notes_enc' => (string)$row['current_notes_enc'],
            'source' => 'restore_backup',
        ]);
    } else {
        $snapshotStmt = $pdo->prepare(
            'INSERT INTO vault_item_versions (vault_item_id, user_id, site, folder, tags_json, is_favorite, username_enc, password_enc, notes_enc, source)
             VALUES (:vault_item_id, :user_id, :site, :folder, :tags_json, :is_favorite, :username_enc, :password_enc, :notes_enc, :source)'
        );
        $snapshotStmt->execute([
            'vault_item_id' => (int)$row['vault_item_id'],
            'user_id' => $userId,
            'site' => (string)$row['current_site'],
            'folder' => (string)($row['current_folder'] ?? ''),
            'tags_json' => ($row['current_tags_json'] ?? null),
            'is_favorite' => (int)($row['current_is_favorite'] ?? 0),
            'username_enc' => (string)$row['current_username_enc'],
            'password_enc' => (string)$row['current_password_enc'],
            'notes_enc' => (string)$row['current_notes_enc'],
            'source' => 'restore_backup',
        ]);
    }

    if ($supportsItemType && $supportsVersionItemType) {
        $updateStmt = $pdo->prepare(
            'UPDATE vault_items
             SET site = :site,
                 item_type = :item_type,
                 folder = :folder,
                 tags_json = :tags_json,
                 is_favorite = :is_favorite,
                 username_enc = :username_enc,
                 password_enc = :password_enc,
                 notes_enc = :notes_enc,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = :vault_item_id'
        );
        $updateStmt->execute([
            'site' => (string)$row['version_site'],
            'item_type' => (string)($row['version_item_type'] ?? 'login'),
            'folder' => (string)($row['version_folder'] ?? ''),
            'tags_json' => ($row['version_tags_json'] ?? null),
            'is_favorite' => (int)($row['version_is_favorite'] ?? 0),
            'username_enc' => (string)$row['version_username_enc'],
            'password_enc' => (string)$row['version_password_enc'],
            'notes_enc' => (string)$row['version_notes_enc'],
            'vault_item_id' => (int)$row['vault_item_id'],
        ]);
    } else {
        $updateStmt = $pdo->prepare(
            'UPDATE vault_items
             SET site = :site,
                 folder = :folder,
                 tags_json = :tags_json,
                 is_favorite = :is_favorite,
                 username_enc = :username_enc,
                 password_enc = :password_enc,
                 notes_enc = :notes_enc,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = :vault_item_id'
        );
        $updateStmt->execute([
            'site' => (string)$row['version_site'],
            'folder' => (string)($row['version_folder'] ?? ''),
            'tags_json' => ($row['version_tags_json'] ?? null),
            'is_favorite' => (int)($row['version_is_favorite'] ?? 0),
            'username_enc' => (string)$row['version_username_enc'],
            'password_enc' => (string)$row['version_password_enc'],
            'notes_enc' => (string)$row['version_notes_enc'],
            'vault_item_id' => (int)$row['vault_item_id'],
        ]);
    }

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    json_response(['ok' => false, 'error' => 'Unable to restore version'], 500);
}

audit_log('vault.restore_version', $userId, [
    'vault_item_id' => (int)$row['vault_item_id'],
    'version_id' => $versionId,
    'shared_vault_id' => isset($row['current_shared_vault_id']) && $row['current_shared_vault_id'] !== null ? (int)$row['current_shared_vault_id'] : null,
]);

json_response(['ok' => true]);
