<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();
$id = (int)($body['id'] ?? 0);

if ($id <= 0) {
    json_response(['ok' => false, 'error' => 'Invalid id'], 422);
}

$pdo = db();
$stmt = $pdo->prepare('DELETE FROM vault_items WHERE id = :id AND user_id = :user_id');
$stmt->execute([
    'id' => $id,
    'user_id' => $userId,
]);

if ($stmt->rowCount() === 0) {
    json_response(['ok' => false, 'error' => 'Record not found'], 404);
}

audit_log('vault.delete', $userId, ['vault_item_id' => $id]);

json_response(['ok' => true]);
