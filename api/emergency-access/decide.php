<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

if (!db_table_exists('emergency_access_grants') || !db_table_exists('emergency_access_requests')) {
    json_response([
        'ok' => false,
        'error' => 'Emergency access requires migration 010',
        'error_code' => 'emergency_access_unavailable',
        'details' => [],
    ], 409);
}

$requestId = (int)($body['request_id'] ?? 0);
$action = strtolower(trim((string)($body['action'] ?? '')));
if ($requestId <= 0) {
    json_response(['ok' => false, 'error' => 'Valid request_id is required'], 422);
}
if (!in_array($action, ['approve', 'deny'], true)) {
    json_response(['ok' => false, 'error' => 'Action must be approve or deny'], 422);
}

$ACCESS_WINDOW_HOURS = 24;

$pdo = db();
$stmt = $pdo->prepare(
    'SELECT
        r.id,
        r.grant_id,
        r.status,
        g.owner_user_id,
        g.grantee_user_id,
        g.wait_period_hours
     FROM emergency_access_requests r
     INNER JOIN emergency_access_grants g ON g.id = r.grant_id
     WHERE r.id = :id
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
    if ((int)$request['owner_user_id'] !== $userId) {
        $pdo->rollBack();
        json_response(['ok' => false, 'error' => 'Only grant owner can decide emergency request'], 403);
    }
    if ((string)$request['status'] !== 'pending') {
        $pdo->rollBack();
        json_response(['ok' => false, 'error' => 'Request is no longer pending'], 409);
    }

    $nextStatus = $action === 'approve' ? 'approved' : 'denied';
    $expiresAt = null;
    if ($action === 'approve') {
        $waitHours = max(1, (int)$request['wait_period_hours']);
        $availableAt = time() + ($waitHours * 3600);
        $expiresAt = gmdate('Y-m-d H:i:s', $availableAt + ($ACCESS_WINDOW_HOURS * 3600));
    }

    $updateStmt = $pdo->prepare(
        'UPDATE emergency_access_requests
        SET status = :status,
             decided_at = CURRENT_TIMESTAMP,
             decision_by_user_id = :decision_by_user_id,
             expires_at = :expires_at
         WHERE id = :id'
    );
    $updateStmt->execute([
        'status' => $nextStatus,
        'decision_by_user_id' => $userId,
        'expires_at' => $expiresAt,
        'id' => $requestId,
    ]);

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    throw $e;
}

audit_log('emergency_access.decide', $userId, [
    'request_id' => $requestId,
    'grant_id' => (int)$request['grant_id'],
    'action' => $action,
    'status' => $nextStatus,
    'expires_at' => $expiresAt,
    'access_window_hours' => $ACCESS_WINDOW_HOURS,
]);

json_response([
    'ok' => true,
    'request_id' => $requestId,
    'status' => $nextStatus,
    'expires_at' => $expiresAt,
]);
