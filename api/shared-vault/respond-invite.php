<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

if (!shared_vaults_available()) {
    json_response([
        'ok' => false,
        'error' => 'Shared vaults require migration 008',
        'error_code' => 'shared_vaults_unavailable',
        'details' => [],
    ], 409);
}

$membershipId = (int)($body['membership_id'] ?? 0);
$action = strtolower(trim((string)($body['action'] ?? '')));
if ($membershipId <= 0) {
    json_response(['ok' => false, 'error' => 'Valid membership_id is required'], 422);
}
if (!in_array($action, ['accept', 'reject'], true)) {
    json_response(['ok' => false, 'error' => 'Action must be accept or reject'], 422);
}

$pdo = db();
$selectStmt = $pdo->prepare(
    'SELECT id, shared_vault_id, role, invitation_status
     FROM shared_vault_members
     WHERE id = :id
       AND user_id = :user_id
     LIMIT 1'
);
$selectStmt->execute([
    'id' => $membershipId,
    'user_id' => $userId,
]);
$membership = $selectStmt->fetch();
if (!$membership) {
    json_response(['ok' => false, 'error' => 'Invitation not found'], 404);
}
if ((string)$membership['invitation_status'] !== 'pending') {
    json_response(['ok' => false, 'error' => 'Invitation is no longer pending'], 409);
}

$nextStatus = $action === 'accept' ? 'accepted' : 'rejected';
$updateStmt = $pdo->prepare(
    'UPDATE shared_vault_members
     SET invitation_status = :invitation_status,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :id'
);
$updateStmt->execute([
    'invitation_status' => $nextStatus,
    'id' => $membershipId,
]);

audit_log('shared_vault.respond_invite', $userId, [
    'membership_id' => $membershipId,
    'shared_vault_id' => (int)$membership['shared_vault_id'],
    'action' => $action,
    'next_status' => $nextStatus,
]);

json_response([
    'ok' => true,
    'membership_id' => $membershipId,
    'vault_id' => (int)$membership['shared_vault_id'],
    'role' => (string)$membership['role'],
    'invitation_status' => $nextStatus,
]);
