<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

if (!db_table_exists('emergency_access_requests')) {
    json_response([
        'ok' => false,
        'error' => 'Emergency access requires migration 010',
        'error_code' => 'emergency_access_unavailable',
        'details' => [],
    ], 409);
}

$requestId = (int)($body['request_id'] ?? 0);
if ($requestId <= 0) {
    json_response(['ok' => false, 'error' => 'Valid request_id is required'], 422);
}

$pdo = db();
$stmt = $pdo->prepare(
    'SELECT id, requester_user_id, status, grant_id
     FROM emergency_access_requests
     WHERE id = :id
     LIMIT 1
     FOR UPDATE'
);

$pdo->beginTransaction();
try {
    $stmt->execute(['id' => $requestId]);
    $request = $stmt->fetch();
    if (!$request) {
        $pdo->rollBack();
        json_response(['ok' => false, 'error' => 'Request not found'], 404);
    }
    if ((int)$request['requester_user_id'] !== $userId) {
        $pdo->rollBack();
        json_response(['ok' => false, 'error' => 'Only requester can cancel this emergency request'], 403);
    }
    if ((string)$request['status'] !== 'pending') {
        $pdo->rollBack();
        json_response(['ok' => false, 'error' => 'Only pending requests can be cancelled'], 409);
    }

    $updateStmt = $pdo->prepare(
        'UPDATE emergency_access_requests
         SET status = :status,
             decided_at = CURRENT_TIMESTAMP,
             decision_by_user_id = NULL,
             expires_at = NULL
         WHERE id = :id'
    );
    $updateStmt->execute([
        'status' => 'cancelled',
        'id' => $requestId,
    ]);

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    throw $e;
}

audit_log('emergency_access.cancel_request', $userId, [
    'request_id' => $requestId,
    'grant_id' => (int)$request['grant_id'],
]);

json_response([
    'ok' => true,
    'request_id' => $requestId,
    'status' => 'cancelled',
]);
