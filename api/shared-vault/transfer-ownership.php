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
$newOwnerUserId = (int)($body['new_owner_user_id'] ?? 0);
if ($vaultId <= 0) {
    json_response(['ok' => false, 'error' => 'Valid vault_id is required'], 422);
}
if ($newOwnerUserId <= 0) {
    json_response(['ok' => false, 'error' => 'Valid new_owner_user_id is required'], 422);
}
if ($newOwnerUserId === $userId) {
    json_response(['ok' => false, 'error' => 'New owner must be a different member'], 422);
}

$actorMembership = find_shared_vault_membership($vaultId, $userId, true);
if (!$actorMembership || (string)$actorMembership['role'] !== 'owner') {
    json_response(['ok' => false, 'error' => 'Only current owner can transfer ownership'], 403);
}

$targetMembership = find_shared_vault_membership($vaultId, $newOwnerUserId, true);
if (!$targetMembership) {
    json_response(['ok' => false, 'error' => 'New owner must be an accepted member'], 409);
}

$pdo = db();
$pdo->beginTransaction();
try {
    $ownerStmt = $pdo->prepare(
        'UPDATE shared_vaults
         SET owner_user_id = :owner_user_id,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = :id'
    );
    $ownerStmt->execute([
        'owner_user_id' => $newOwnerUserId,
        'id' => $vaultId,
    ]);

    $actorRoleStmt = $pdo->prepare(
        'UPDATE shared_vault_members
         SET role = :role,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = :id'
    );
    $actorRoleStmt->execute([
        'role' => 'editor',
        'id' => (int)$actorMembership['id'],
    ]);

    $targetRoleStmt = $pdo->prepare(
        'UPDATE shared_vault_members
         SET role = :role,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = :id'
    );
    $targetRoleStmt->execute([
        'role' => 'owner',
        'id' => (int)$targetMembership['id'],
    ]);

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    throw $e;
}

audit_log('shared_vault.transfer_ownership', $userId, [
    'shared_vault_id' => $vaultId,
    'from_user_id' => $userId,
    'to_user_id' => $newOwnerUserId,
]);

json_response([
    'ok' => true,
    'vault_id' => $vaultId,
    'new_owner_user_id' => $newOwnerUserId,
]);
