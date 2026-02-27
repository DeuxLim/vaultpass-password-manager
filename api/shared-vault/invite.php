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
$email = normalize_email_input($body['email'] ?? '');
$role = normalize_shared_vault_role($body['role'] ?? 'viewer');

if ($vaultId <= 0) {
    json_response(['ok' => false, 'error' => 'Valid vault_id is required'], 422);
}

if (!is_valid_email_format($email)) {
    json_response(['ok' => false, 'error' => 'Valid email is required'], 422);
}

if ($role === 'owner') {
    json_response(['ok' => false, 'error' => 'Owner role cannot be assigned through invite'], 422);
}

$pdo = db();
$access = find_shared_vault_membership($vaultId, $userId, true);
if (!$access || !in_array((string)$access['role'], ['owner', 'editor'], true)) {
    json_response(['ok' => false, 'error' => 'Insufficient shared vault permissions'], 403);
}
$actorRole = (string)($access['role'] ?? '');
if (!shared_vault_can_invite_role($actorRole, $role)) {
    json_response(['ok' => false, 'error' => 'Insufficient permission to invite selected role'], 403);
}

$targetUserStmt = $pdo->prepare('SELECT id, name, email FROM users WHERE email = :email LIMIT 1');
$targetUserStmt->execute(['email' => $email]);
$targetUser = $targetUserStmt->fetch();
if (!$targetUser) {
    json_response(['ok' => false, 'error' => 'User account for invite email was not found'], 404);
}

$targetUserId = (int)$targetUser['id'];
if ($targetUserId === $userId) {
    json_response(['ok' => false, 'error' => 'You cannot invite yourself'], 422);
}

$existingStmt = $pdo->prepare(
    'SELECT id, role, invitation_status
     FROM shared_vault_members
     WHERE shared_vault_id = :shared_vault_id
       AND user_id = :user_id
     LIMIT 1'
);
$existingStmt->execute([
    'shared_vault_id' => $vaultId,
    'user_id' => $targetUserId,
]);
$existing = $existingStmt->fetch();
if ($existing && (string)$existing['invitation_status'] === 'accepted') {
    json_response(['ok' => false, 'error' => 'User is already an active shared vault member'], 409);
}

$status = 'pending';
if ($existing) {
    $updateStmt = $pdo->prepare(
        'UPDATE shared_vault_members
         SET role = :role,
             invitation_status = :invitation_status,
             invited_by_user_id = :invited_by_user_id,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = :id'
    );
    $updateStmt->execute([
        'role' => $role,
        'invitation_status' => $status,
        'invited_by_user_id' => $userId,
        'id' => (int)$existing['id'],
    ]);
} else {
    $insertStmt = $pdo->prepare(
        'INSERT INTO shared_vault_members (shared_vault_id, user_id, role, invitation_status, invited_by_user_id)
         VALUES (:shared_vault_id, :user_id, :role, :invitation_status, :invited_by_user_id)'
    );
    $insertStmt->execute([
        'shared_vault_id' => $vaultId,
        'user_id' => $targetUserId,
        'role' => $role,
        'invitation_status' => $status,
        'invited_by_user_id' => $userId,
    ]);
}

audit_log('shared_vault.invite', $userId, [
    'shared_vault_id' => $vaultId,
    'target_user_id' => $targetUserId,
    'target_email' => $email,
    'role' => $role,
]);

json_response([
    'ok' => true,
    'member' => [
        'user_id' => $targetUserId,
        'name' => (string)$targetUser['name'],
        'email' => (string)$targetUser['email'],
        'role' => $role,
        'invitation_status' => $status,
    ],
], 201);
