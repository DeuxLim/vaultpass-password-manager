<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

$grantsAvailable = db_table_exists('emergency_access_grants');
$requestsAvailable = db_table_exists('emergency_access_requests');
if (!$grantsAvailable || !$requestsAvailable) {
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
$grantStmt = $pdo->prepare(
    'SELECT id, owner_user_id, grantee_user_id, wait_period_hours, is_enabled
     FROM emergency_access_grants
     WHERE id = :id
     LIMIT 1'
);
$grantStmt->execute(['id' => $grantId]);
$grant = $grantStmt->fetch();
if (!$grant) {
    json_response(['ok' => false, 'error' => 'Grant not found'], 404);
}
if ((int)$grant['grantee_user_id'] !== $userId) {
    json_response(['ok' => false, 'error' => 'Only designated grantee can request emergency access'], 403);
}
if (((int)$grant['is_enabled']) !== 1) {
    json_response(['ok' => false, 'error' => 'Emergency access grant is disabled'], 409);
}

$pendingStmt = $pdo->prepare(
    'SELECT id
     FROM emergency_access_requests
     WHERE grant_id = :grant_id
       AND status = \'pending\'
     LIMIT 1'
);
$pendingStmt->execute(['grant_id' => $grantId]);
$pendingId = (int)($pendingStmt->fetchColumn() ?: 0);
if ($pendingId > 0) {
    json_response(['ok' => false, 'error' => 'A pending request already exists for this grant'], 409);
}

$requestStmt = $pdo->prepare(
    'INSERT INTO emergency_access_requests (grant_id, requester_user_id, status)
     VALUES (:grant_id, :requester_user_id, :status)'
);
$requestStmt->execute([
    'grant_id' => $grantId,
    'requester_user_id' => $userId,
    'status' => 'pending',
]);
$requestId = (int)$pdo->lastInsertId();

audit_log('emergency_access.request', $userId, [
    'request_id' => $requestId,
    'grant_id' => $grantId,
    'owner_user_id' => (int)$grant['owner_user_id'],
]);

json_response([
    'ok' => true,
    'request' => [
        'id' => $requestId,
        'grant_id' => $grantId,
        'status' => 'pending',
    ],
], 201);
