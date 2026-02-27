<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

$rows = $body['rows'] ?? null;
$mode = strtolower(trim((string)($body['mode'] ?? 'append')));

if (!is_array($rows)) {
    json_response(['ok' => false, 'error' => 'rows array is required'], 422);
}

if (count($rows) === 0) {
    json_response(['ok' => false, 'error' => 'No rows to import'], 422);
}

if (count($rows) > 5000) {
    json_response(['ok' => false, 'error' => 'CSV import row limit exceeded (5000)'], 422);
}

if ($mode !== 'append' && $mode !== 'replace') {
    json_response(['ok' => false, 'error' => 'Invalid import mode'], 422);
}

$imported = 0;
$errors = [];
$pdo = db();
$supportsItemType = db_column_exists('vault_items', 'item_type');

try {
    $pdo->beginTransaction();

    if ($mode === 'replace') {
        $deleteStmt = $pdo->prepare('DELETE FROM vault_items WHERE user_id = :user_id');
        $deleteStmt->execute(['user_id' => $userId]);
    }

    if ($supportsItemType) {
        $insertStmt = $pdo->prepare(
            'INSERT INTO vault_items (user_id, site, item_type, folder, tags_json, is_favorite, username_enc, password_enc, notes_enc)
             VALUES (:user_id, :site, :item_type, :folder, :tags_json, :is_favorite, :username_enc, :password_enc, :notes_enc)'
        );
    } else {
        $insertStmt = $pdo->prepare(
            'INSERT INTO vault_items (user_id, site, folder, tags_json, is_favorite, username_enc, password_enc, notes_enc)
             VALUES (:user_id, :site, :folder, :tags_json, :is_favorite, :username_enc, :password_enc, :notes_enc)'
        );
    }

    foreach ($rows as $index => $row) {
        if (!is_array($row)) {
            $errors[] = ['row' => $index + 1, 'error' => 'Invalid row format'];
            continue;
        }

        $tagsInput = $row['tags'] ?? [];

        if (is_string($tagsInput)) {
            $tagsInput = array_map('trim', explode(',', $tagsInput));
        }
        $normalized = normalize_vault_item_payload([
            'site' => $row['site'] ?? '',
            'item_type' => $row['item_type'] ?? 'login',
            'folder' => $row['folder'] ?? '',
            'is_favorite' => $row['is_favorite'] ?? 0,
            'tags' => $tagsInput,
            'username' => $row['username'] ?? '',
            'password' => $row['password'] ?? '',
            'notes' => $row['notes'] ?? '',
        ]);
        $validationError = validate_vault_item_payload($normalized);
        if ($validationError !== null) {
            $errors[] = ['row' => $index + 1, 'error' => $validationError];
            continue;
        }

        $site = $normalized['site'];
        $itemType = $normalized['item_type'];
        $folder = $normalized['folder'];
        $isFavorite = $normalized['is_favorite'];
        $username = $normalized['username'];
        $password = $normalized['password'];
        $notes = $normalized['notes'];
        $tags = $normalized['tags'];

        $params = [
            'user_id' => $userId,
            'site' => $site,
            'folder' => $folder,
            'tags_json' => count($tags) > 0 ? json_encode($tags, JSON_UNESCAPED_UNICODE) : null,
            'is_favorite' => $isFavorite ? 1 : 0,
            'username_enc' => encrypt_value($username),
            'password_enc' => encrypt_value($password),
            'notes_enc' => encrypt_value($notes),
        ];
        if ($supportsItemType) {
            $params['item_type'] = $itemType;
        } elseif ($itemType === 'secure_note') {
            $errors[] = ['row' => $index + 1, 'error' => 'Secure notes require migration 006 (item type support)'];
            continue;
        }

        $insertStmt->execute($params);
        $imported++;
    }

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    json_response(['ok' => false, 'error' => 'Unable to import CSV'], 500);
}

audit_log('vault.import_csv', $userId, ['mode' => $mode, 'imported_count' => $imported, 'error_count' => count($errors)]);

json_response([
    'ok' => true,
    'mode' => $mode,
    'imported_count' => $imported,
    'error_count' => count($errors),
    'errors' => array_slice($errors, 0, 100),
]);
