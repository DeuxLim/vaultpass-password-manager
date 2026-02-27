<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

$passphrase = (string)($body['passphrase'] ?? '');
$envelopeInput = $body['backup'] ?? null;

if (trim($passphrase) === '') {
    json_response(['ok' => false, 'error' => 'Passphrase is required'], 422);
}

if (is_string($envelopeInput)) {
    $decoded = json_decode($envelopeInput, true);
    $envelope = is_array($decoded) ? $decoded : null;
} elseif (is_array($envelopeInput)) {
    $envelope = $envelopeInput;
} else {
    $envelope = null;
}

if (!is_array($envelope)) {
    json_response(['ok' => false, 'error' => 'Backup payload is required'], 422);
}

$decrypted = backup_decrypt_payload($envelope, $passphrase);
if (($decrypted['format'] ?? '') !== 'vaultpass-backup-plain-v1') {
    json_response(['ok' => false, 'error' => 'Unsupported decrypted backup format'], 422);
}

$items = $decrypted['items'] ?? null;
if (!is_array($items)) {
    json_response(['ok' => false, 'error' => 'Backup has no items'], 422);
}

if (count($items) > 5000) {
    json_response(['ok' => false, 'error' => 'Backup item limit exceeded (5000)'], 422);
}

$imported = 0;
$errors = [];
$pdo = db();
$supportsItemType = db_column_exists('vault_items', 'item_type');

try {
    $pdo->beginTransaction();

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

    foreach ($items as $index => $item) {
        if (!is_array($item)) {
            $errors[] = ['row' => $index + 1, 'error' => 'Invalid item format'];
            continue;
        }

        $normalized = normalize_vault_item_payload($item);
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
    json_response(['ok' => false, 'error' => 'Unable to import backup'], 500);
}

audit_log('vault.import_backup', $userId, ['imported_count' => $imported, 'error_count' => count($errors)]);

json_response([
    'ok' => true,
    'imported_count' => $imported,
    'error_count' => count($errors),
    'errors' => array_slice($errors, 0, 50),
]);
