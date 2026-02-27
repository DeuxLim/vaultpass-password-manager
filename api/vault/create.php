<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

$site = trim((string)($body['site'] ?? ''));
$itemType = normalize_item_type($body['item_type'] ?? 'login');
$username = trim((string)($body['username'] ?? ''));
$password = (string)($body['password'] ?? '');
$notes = trim((string)($body['notes'] ?? ''));
$folder = trim((string)($body['folder'] ?? ''));
$isFavorite = ((int)($body['is_favorite'] ?? 0)) === 1;
$tags = normalize_tags_input($body['tags'] ?? []);

if ($site === '') {
    json_response(['ok' => false, 'error' => 'Site is required'], 422);
}

if ($itemType === 'login' && ($username === '' || $password === '')) {
    json_response(['ok' => false, 'error' => 'Site, username, and password are required'], 422);
}

if ($itemType === 'secure_note' && $notes === '') {
    json_response(['ok' => false, 'error' => 'Secure note content is required'], 422);
}

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
        'folder' => mb_substr($folder, 0, 120),
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
        'folder' => mb_substr($folder, 0, 120),
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
