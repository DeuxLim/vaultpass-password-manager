<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

$id = (int)($body['id'] ?? 0);
$payload = normalize_vault_item_payload($body);
$validationError = validate_vault_item_payload($payload);
if ($id <= 0) {
    json_response(['ok' => false, 'error' => 'Invalid request'], 422);
}
if ($validationError !== null) {
    json_response(['ok' => false, 'error' => $validationError], 422);
}

$site = $payload['site'];
$itemType = $payload['item_type'];
$username = $payload['username'];
$password = $payload['password'];
$notes = $payload['notes'];
$folder = $payload['folder'];
$isFavorite = $payload['is_favorite'];
$tags = $payload['tags'];

$pdo = db();
$supportsItemType = db_column_exists('vault_items', 'item_type');
$supportsVersionItemType = db_column_exists('vault_item_versions', 'item_type');

if ($itemType === 'secure_note' && !$supportsItemType) {
    json_response(['ok' => false, 'error' => 'Secure notes require migration 006 (item type support)'], 409);
}

$snapshotId = 0;
$legacySchema = false;
try {
    $pdo->beginTransaction();

    try {
        $currentColumns = 'id, site, folder, tags_json, is_favorite, username_enc, password_enc, notes_enc';
        if ($supportsItemType) {
            $currentColumns = 'id, site, item_type, folder, tags_json, is_favorite, username_enc, password_enc, notes_enc';
        }
        $selectStmt = $pdo->prepare(
            "SELECT {$currentColumns}
             FROM vault_items
             WHERE id = :id AND user_id = :user_id
             LIMIT 1
             FOR UPDATE"
        );
        $selectStmt->execute([
            'id' => $id,
            'user_id' => $userId,
        ]);
        $current = $selectStmt->fetch();
    } catch (PDOException $e) {
        if ((string)$e->getCode() !== '42S22') {
            throw $e;
        }

        $legacySchema = true;
        $selectStmt = $pdo->prepare(
            'SELECT id, site, username_enc, password_enc, notes_enc
             FROM vault_items
             WHERE id = :id AND user_id = :user_id
             LIMIT 1
             FOR UPDATE'
        );
        $selectStmt->execute([
            'id' => $id,
            'user_id' => $userId,
        ]);
        $current = $selectStmt->fetch();
    }

    if (!$current) {
        $pdo->rollBack();
        json_response(['ok' => false, 'error' => 'Record not found'], 404);
    }

    try {
        if ($supportsVersionItemType && $supportsItemType && !$legacySchema) {
            $versionStmt = $pdo->prepare(
                'INSERT INTO vault_item_versions (vault_item_id, user_id, site, item_type, folder, tags_json, is_favorite, username_enc, password_enc, notes_enc, source)
                 VALUES (:vault_item_id, :user_id, :site, :item_type, :folder, :tags_json, :is_favorite, :username_enc, :password_enc, :notes_enc, :source)'
            );
            $versionStmt->execute([
                'vault_item_id' => (int)$current['id'],
                'user_id' => $userId,
                'site' => (string)$current['site'],
                'item_type' => (string)($current['item_type'] ?? 'login'),
                'folder' => (string)($current['folder'] ?? ''),
                'tags_json' => ($current['tags_json'] ?? null),
                'is_favorite' => (int)($current['is_favorite'] ?? 0),
                'username_enc' => (string)$current['username_enc'],
                'password_enc' => (string)$current['password_enc'],
                'notes_enc' => (string)$current['notes_enc'],
                'source' => 'update',
            ]);
            $snapshotId = (int)$pdo->lastInsertId();
        } else {
            $versionStmt = $pdo->prepare(
                'INSERT INTO vault_item_versions (vault_item_id, user_id, site, folder, tags_json, is_favorite, username_enc, password_enc, notes_enc, source)
                 VALUES (:vault_item_id, :user_id, :site, :folder, :tags_json, :is_favorite, :username_enc, :password_enc, :notes_enc, :source)'
            );
            $versionStmt->execute([
                'vault_item_id' => (int)$current['id'],
                'user_id' => $userId,
                'site' => (string)$current['site'],
                'folder' => (string)($current['folder'] ?? ''),
                'tags_json' => ($current['tags_json'] ?? null),
                'is_favorite' => (int)($current['is_favorite'] ?? 0),
                'username_enc' => (string)$current['username_enc'],
                'password_enc' => (string)$current['password_enc'],
                'notes_enc' => (string)$current['notes_enc'],
                'source' => 'update',
            ]);
            $snapshotId = (int)$pdo->lastInsertId();
        }
    } catch (PDOException $e) {
        if ((string)$e->getCode() === '42S22') {
            $legacyVersionStmt = $pdo->prepare(
                'INSERT INTO vault_item_versions (vault_item_id, user_id, site, username_enc, password_enc, notes_enc, source)
                 VALUES (:vault_item_id, :user_id, :site, :username_enc, :password_enc, :notes_enc, :source)'
            );
            $legacyVersionStmt->execute([
                'vault_item_id' => (int)$current['id'],
                'user_id' => $userId,
                'site' => (string)$current['site'],
                'username_enc' => (string)$current['username_enc'],
                'password_enc' => (string)$current['password_enc'],
                'notes_enc' => (string)$current['notes_enc'],
                'source' => 'update',
            ]);
            $snapshotId = (int)$pdo->lastInsertId();
        } elseif ((string)$e->getCode() !== '42S02') {
            throw $e;
        } else {
            $snapshotId = 0;
        }
    }

    if ($legacySchema) {
        $updateStmt = $pdo->prepare(
            'UPDATE vault_items
             SET site = :site,
                 username_enc = :username_enc,
                 password_enc = :password_enc,
                 notes_enc = :notes_enc,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = :id AND user_id = :user_id'
        );
        $updateStmt->execute([
            'id' => $id,
            'user_id' => $userId,
            'site' => $site,
            'username_enc' => encrypt_value($username),
            'password_enc' => encrypt_value($password),
            'notes_enc' => encrypt_value($notes),
        ]);
    } else {
        if ($supportsItemType) {
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
                 WHERE id = :id AND user_id = :user_id'
            );
            $updateStmt->execute([
                'id' => $id,
                'user_id' => $userId,
                'site' => $site,
                'item_type' => $itemType,
                'folder' => $folder,
                'tags_json' => count($tags) > 0 ? json_encode($tags, JSON_UNESCAPED_UNICODE) : null,
                'is_favorite' => $isFavorite ? 1 : 0,
                'username_enc' => encrypt_value($username),
                'password_enc' => encrypt_value($password),
                'notes_enc' => encrypt_value($notes),
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
                 WHERE id = :id AND user_id = :user_id'
            );
            $updateStmt->execute([
                'id' => $id,
                'user_id' => $userId,
                'site' => $site,
                'folder' => $folder,
                'tags_json' => count($tags) > 0 ? json_encode($tags, JSON_UNESCAPED_UNICODE) : null,
                'is_favorite' => $isFavorite ? 1 : 0,
                'username_enc' => encrypt_value($username),
                'password_enc' => encrypt_value($password),
                'notes_enc' => encrypt_value($notes),
            ]);
        }
    }

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    json_response(['ok' => false, 'error' => 'Unable to update record'], 500);
}

audit_log('vault.update', $userId, [
    'vault_item_id' => $id,
    'site' => $site,
    'item_type' => $itemType,
    'folder' => $folder,
    'tag_count' => count($tags),
    'is_favorite' => $isFavorite,
    'legacy_schema' => $legacySchema,
    'version_snapshot_id' => $snapshotId,
]);

json_response(['ok' => true]);
