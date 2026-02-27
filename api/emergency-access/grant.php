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

$email = normalize_email_input($body['email'] ?? '');
$waitPeriodHours = (int)($body['wait_period_hours'] ?? 24);
$waitPeriodHours = max(1, min($waitPeriodHours, 336));

if (!is_valid_email_format($email)) {
    json_response(['ok' => false, 'error' => 'Valid email is required'], 422);
}

$pdo = db();
$targetStmt = $pdo->prepare('SELECT id, name, email FROM users WHERE email = :email LIMIT 1');
$targetStmt->execute(['email' => $email]);
$targetUser = $targetStmt->fetch();
if (!$targetUser) {
    json_response(['ok' => false, 'error' => 'User account for emergency contact was not found'], 404);
}

$targetUserId = (int)$targetUser['id'];
if ($targetUserId === $userId) {
    json_response(['ok' => false, 'error' => 'You cannot grant emergency access to yourself'], 422);
}

$upsertStmt = $pdo->prepare(
    'INSERT INTO emergency_access_grants (owner_user_id, grantee_user_id, wait_period_hours, is_enabled)
     VALUES (:owner_user_id, :grantee_user_id, :wait_period_hours, 1)
     ON DUPLICATE KEY UPDATE
       wait_period_hours = VALUES(wait_period_hours),
       is_enabled = 1,
       updated_at = CURRENT_TIMESTAMP'
);
$upsertStmt->execute([
    'owner_user_id' => $userId,
    'grantee_user_id' => $targetUserId,
    'wait_period_hours' => $waitPeriodHours,
]);

$grantIdStmt = $pdo->prepare(
    'SELECT id
     FROM emergency_access_grants
     WHERE owner_user_id = :owner_user_id
       AND grantee_user_id = :grantee_user_id
     LIMIT 1'
);
$grantIdStmt->execute([
    'owner_user_id' => $userId,
    'grantee_user_id' => $targetUserId,
]);
$grantId = (int)($grantIdStmt->fetchColumn() ?: 0);

audit_log('emergency_access.grant', $userId, [
    'grant_id' => $grantId,
    'grantee_user_id' => $targetUserId,
    'grantee_email' => $email,
    'wait_period_hours' => $waitPeriodHours,
]);

json_response([
    'ok' => true,
    'grant' => [
        'id' => $grantId,
        'owner_user_id' => $userId,
        'grantee_user_id' => $targetUserId,
        'grantee_name' => (string)$targetUser['name'],
        'grantee_email' => (string)$targetUser['email'],
        'wait_period_hours' => $waitPeriodHours,
        'is_enabled' => true,
    ],
], 201);
