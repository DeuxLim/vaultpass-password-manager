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
if ($vaultId <= 0) {
    json_response(['ok' => false, 'error' => 'Valid vault_id is required'], 422);
}
if ($memberUserId <= 0) {
    json_response(['ok' => false, 'error' => 'Valid member_user_id is required'], 422);
}

$actorMembership = find_shared_vault_membership($vaultId, $userId, true);
if (!$actorMembership) {
    json_response(['ok' => false, 'error' => 'Access denied'], 403);
}

$targetMembership = find_shared_vault_membership($vaultId, $memberUserId, false);
if (!$targetMembership) {
    json_response(['ok' => false, 'error' => 'Target member not found for this shared vault'], 404);
}

$isSelfRemoval = $memberUserId === $userId;
$actorRole = (string)$actorMembership['role'];
$targetRole = (string)$targetMembership['role'];
if ($isSelfRemoval) {
    if ($targetRole === 'owner') {
        json_response(['ok' => false, 'error' => 'Owner cannot leave shared vault without transferring ownership'], 409);
    }
} elseif ($actorRole !== 'owner') {
    json_response(['ok' => false, 'error' => 'Only owner can remove other members'], 403);
}

if (!$isSelfRemoval && $targetRole === 'owner') {
    json_response(['ok' => false, 'error' => 'Owner cannot be removed'], 409);
}

$pdo = db();
$deleteStmt = $pdo->prepare(
    'DELETE FROM shared_vault_members
     WHERE id = :id'
);
$deleteStmt->execute(['id' => (int)$targetMembership['id']]);

audit_log('shared_vault.remove_member', $userId, [
    'shared_vault_id' => $vaultId,
    'member_user_id' => $memberUserId,
    'self_removal' => $isSelfRemoval,
]);

json_response([
    'ok' => true,
    'vault_id' => $vaultId,
    'member_user_id' => $memberUserId,
    'self_removal' => $isSelfRemoval,
]);
