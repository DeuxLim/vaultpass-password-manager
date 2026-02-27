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

$vaultId = (int)($body['vault_id'] ?? 0);
$memberUserId = (int)($body['member_user_id'] ?? 0);
$role = normalize_shared_vault_role($body['role'] ?? 'viewer');

if ($vaultId <= 0) {
    json_response(['ok' => false, 'error' => 'Valid vault_id is required'], 422);
}
if ($memberUserId <= 0) {
    json_response(['ok' => false, 'error' => 'Valid member_user_id is required'], 422);
}
if (!in_array($role, ['editor', 'viewer'], true)) {
    json_response(['ok' => false, 'error' => 'Role must be editor or viewer'], 422);
}

$actorMembership = find_shared_vault_membership($vaultId, $userId, true);
if (!$actorMembership || (string)$actorMembership['role'] !== 'owner') {
    json_response(['ok' => false, 'error' => 'Only shared vault owners can update member roles'], 403);
}

$targetMembership = find_shared_vault_membership($vaultId, $memberUserId, false);
if (!$targetMembership) {
    json_response(['ok' => false, 'error' => 'Target member not found for this shared vault'], 404);
}
if ((string)$targetMembership['role'] === 'owner') {
    json_response(['ok' => false, 'error' => 'Owner role cannot be changed'], 409);
}
if ((string)$targetMembership['invitation_status'] !== 'accepted') {
    json_response(['ok' => false, 'error' => 'Only accepted members can have roles updated'], 409);
}

$pdo = db();
$updateStmt = $pdo->prepare(
    'UPDATE shared_vault_members
     SET role = :role,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :id'
);
$updateStmt->execute([
    'role' => $role,
    'id' => (int)$targetMembership['id'],
]);

audit_log('shared_vault.update_member_role', $userId, [
    'shared_vault_id' => $vaultId,
    'member_user_id' => $memberUserId,
    'role' => $role,
]);

json_response([
    'ok' => true,
    'vault_id' => $vaultId,
    'member_user_id' => $memberUserId,
    'role' => $role,
]);
