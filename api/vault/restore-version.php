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

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare(
        'SELECT
            vv.id AS version_id,
            vv.vault_item_id,
            vv.site AS version_site,
            vv.folder AS version_folder,
            vv.tags_json AS version_tags_json,
            vv.is_favorite AS version_is_favorite,
            vv.username_enc AS version_username_enc,
            vv.password_enc AS version_password_enc,
            vv.notes_enc AS version_notes_enc,
            vi.site AS current_site,
            vi.folder AS current_folder,
            vi.tags_json AS current_tags_json,
            vi.is_favorite AS current_is_favorite,
            vi.username_enc AS current_username_enc,
            vi.password_enc AS current_password_enc,
            vi.notes_enc AS current_notes_enc
         FROM vault_item_versions vv
         INNER JOIN vault_items vi ON vi.id = vv.vault_item_id
         WHERE vv.id = :version_id
           AND vv.user_id = :user_id
           AND vi.user_id = :user_id
         LIMIT 1
         FOR UPDATE'
    );
    $stmt->execute([
        'version_id' => $versionId,
        'user_id' => $userId,
    ]);
    $row = $stmt->fetch();

    if (!$row) {
        $pdo->rollBack();
        json_response(['ok' => false, 'error' => 'Version not found'], 404);
    }

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
         WHERE id = :vault_item_id AND user_id = :user_id'
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
        'user_id' => $userId,
    ]);

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
]);

json_response(['ok' => true]);
