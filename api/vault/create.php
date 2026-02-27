<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

$payload = normalize_vault_item_payload($body);
$validationError = validate_vault_item_payload($payload);
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

if ($itemType === 'secure_note' && !$supportsItemType) {
    json_response(['ok' => false, 'error' => 'Secure notes require migration 006 (item type support)'], 409);
}

if ($supportsItemType) {
    $stmt = $pdo->prepare(
        'INSERT INTO vault_items (user_id, site, item_type, folder, tags_json, is_favorite, username_enc, password_enc, notes_enc)
         VALUES (:user_id, :site, :item_type, :folder, :tags_json, :is_favorite, :username_enc, :password_enc, :notes_enc)'
    );
    $stmt->execute([
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
    $stmt = $pdo->prepare(
        'INSERT INTO vault_items (user_id, site, folder, tags_json, is_favorite, username_enc, password_enc, notes_enc)
         VALUES (:user_id, :site, :folder, :tags_json, :is_favorite, :username_enc, :password_enc, :notes_enc)'
    );
    $stmt->execute([
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

$newId = (int)$pdo->lastInsertId();
audit_log('vault.create', $userId, [
    'vault_item_id' => $newId,
    'site' => $site,
    'item_type' => $itemType,
    'folder' => $folder,
    'tag_count' => count($tags),
    'is_favorite' => $isFavorite,
]);

json_response(['ok' => true, 'id' => $newId], 201);
