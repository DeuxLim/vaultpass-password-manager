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

if ($stmt->rowCount() < 1) {
    json_response(['ok' => false, 'error' => 'Record not found'], 404);
}

audit_log('vault.favorite_toggle', $userId, [
    'vault_item_id' => $id,
    'is_favorite' => $isFavorite,
]);

json_response(['ok' => true, 'id' => $id, 'is_favorite' => $isFavorite]);
