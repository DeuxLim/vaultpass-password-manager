<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

if (!db_table_exists('emergency_access_grants')) {
    json_response([
        'ok' => false,
        'error' => 'Emergency access requires migration 010',
        'error_code' => 'emergency_access_unavailable',
        'details' => [],
    ], 409);
}

$grantId = (int)($body['grant_id'] ?? 0);
if ($grantId <= 0) {
    json_response(['ok' => false, 'error' => 'Valid grant_id is required'], 422);
}

$pdo = db();
$stmt = $pdo->prepare(
    'UPDATE emergency_access_grants
     SET is_enabled = 0,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :id
       AND owner_user_id = :owner_user_id'
);
$stmt->execute([
    'id' => $grantId,
    'owner_user_id' => $userId,
]);
if ($stmt->rowCount() < 1) {
    json_response(['ok' => false, 'error' => 'Grant not found or not owned by current user'], 404);
}

audit_log('emergency_access.revoke', $userId, [
    'grant_id' => $grantId,
]);

json_response([
    'ok' => true,
    'grant_id' => $grantId,
]);
