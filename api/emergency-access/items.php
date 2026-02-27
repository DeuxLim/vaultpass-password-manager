<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');
$userId = require_auth();
$requestId = (int)($_GET['request_id'] ?? 0);

if ($requestId <= 0) {
    json_response(['ok' => false, 'error' => 'Valid request_id is required'], 422);
}

if (!db_table_exists('emergency_access_requests') || !db_table_exists('emergency_access_grants')) {
    json_response([
        'ok' => false,
        'error' => 'Emergency access requires migration 010',
        'error_code' => 'emergency_access_unavailable',
        'details' => [],
    ], 409);
}

$pdo = db();
$requestStmt = $pdo->prepare(
    'SELECT
        r.id,
        r.grant_id,
        r.requester_user_id,
        r.status,
        r.expires_at,
        g.owner_user_id,
        owner.name AS owner_name,
        owner.email AS owner_email
     FROM emergency_access_requests r
     INNER JOIN emergency_access_grants g ON g.id = r.grant_id
     INNER JOIN users owner ON owner.id = g.owner_user_id
     WHERE r.id = :id
     LIMIT 1'
);
$requestStmt->execute(['id' => $requestId]);
$request = $requestStmt->fetch();

if (!$request) {
    json_response(['ok' => false, 'error' => 'Emergency request not found'], 404);
}
if ((int)$request['requester_user_id'] !== $userId) {
    json_response(['ok' => false, 'error' => 'Access denied'], 403);
}
if ((string)$request['status'] !== 'approved') {
    json_response(['ok' => false, 'error' => 'Emergency request is not approved'], 409);
}
if ($request['expires_at'] !== null && strtotime((string)$request['expires_at']) <= time()) {
    json_response(['ok' => false, 'error' => 'Emergency access window has expired'], 410);
}

$ownerUserId = (int)$request['owner_user_id'];
$supportsItemType = db_column_exists('vault_items', 'item_type');
$supportsSharedVaultId = db_column_exists('vault_items', 'shared_vault_id');

$columns = 'id, site, folder, tags_json, is_favorite, username_enc, password_enc, notes_enc, created_at, updated_at';
if ($supportsItemType) {
    $columns = 'id, site, item_type, folder, tags_json, is_favorite, username_enc, password_enc, notes_enc, created_at, updated_at';
}
if ($supportsSharedVaultId) {
    $columns = 'id, shared_vault_id, site, ' . ($supportsItemType ? 'item_type, ' : '') . 'folder, tags_json, is_favorite, username_enc, password_enc, notes_enc, created_at, updated_at';
}

$itemsStmt = $pdo->prepare(
    "SELECT {$columns}
     FROM vault_items
     WHERE user_id = :owner_user_id
     ORDER BY created_at DESC"
);
$itemsStmt->execute(['owner_user_id' => $ownerUserId]);
$rows = $itemsStmt->fetchAll();

$items = array_map(static function (array $row): array {
    $tags = json_decode((string)($row['tags_json'] ?? ''), true);
    return [
        'id' => (int)$row['id'],
        'shared_vault_id' => isset($row['shared_vault_id']) && $row['shared_vault_id'] !== null ? (int)$row['shared_vault_id'] : null,
        'site' => (string)$row['site'],
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

audit_log('emergency_access.view_items', $userId, [
    'request_id' => $requestId,
    'owner_user_id' => $ownerUserId,
    'item_count' => count($items),
]);

json_response([
    'ok' => true,
    'request' => [
        'id' => (int)$request['id'],
        'owner_user_id' => $ownerUserId,
        'owner_name' => (string)$request['owner_name'],
        'owner_email' => (string)$request['owner_email'],
        'expires_at' => $request['expires_at'] ? (string)$request['expires_at'] : null,
    ],
    'items' => $items,
]);
