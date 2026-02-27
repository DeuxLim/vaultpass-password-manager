<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

if (!db_table_exists('shared_vaults') || !db_table_exists('shared_vault_members')) {
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

$accessStmt = $pdo->prepare(
    'SELECT role
     FROM shared_vault_members
     WHERE shared_vault_id = :shared_vault_id
       AND user_id = :user_id
       AND invitation_status = \'accepted\'
     LIMIT 1'
);
$accessStmt->execute([
    'shared_vault_id' => $vaultId,
    'user_id' => $userId,
]);
$access = $accessStmt->fetch();
if (!$access || !in_array((string)$access['role'], ['owner', 'editor'], true)) {
    json_response(['ok' => false, 'error' => 'Insufficient shared vault permissions'], 403);
}

$targetUserStmt = $pdo->prepare('SELECT id, name, email FROM users WHERE email = :email LIMIT 1');
$targetUserStmt->execute(['email' => $email]);
$targetUser = $targetUserStmt->fetch();
if (!$targetUser) {
    json_response(['ok' => false, 'error' => 'User account for invite email was not found'], 404);
}

$targetUserId = (int)$targetUser['id'];
$status = 'accepted';
$upsert = $pdo->prepare(
    'INSERT INTO shared_vault_members (shared_vault_id, user_id, role, invitation_status, invited_by_user_id)
     VALUES (:shared_vault_id, :user_id, :role, :invitation_status, :invited_by_user_id)
     ON DUPLICATE KEY UPDATE
       role = VALUES(role),
       invitation_status = VALUES(invitation_status),
       invited_by_user_id = VALUES(invited_by_user_id),
       updated_at = CURRENT_TIMESTAMP'
);
$upsert->execute([
    'shared_vault_id' => $vaultId,
    'user_id' => $targetUserId,
    'role' => $role,
    'invitation_status' => $status,
    'invited_by_user_id' => $userId,
]);

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
