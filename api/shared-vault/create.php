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

$name = normalize_shared_vault_name_input($body['name'] ?? '');
$validationError = validate_shared_vault_name($name);
if ($validationError !== null) {
    json_response(['ok' => false, 'error' => $validationError], 422);
}

$pdo = db();
$pdo->beginTransaction();
try {
    $createStmt = $pdo->prepare(
        'INSERT INTO shared_vaults (owner_user_id, name)
         VALUES (:owner_user_id, :name)'
    );
    $createStmt->execute([
        'owner_user_id' => $userId,
        'name' => $name,
    ]);

    $vaultId = (int)$pdo->lastInsertId();

    $memberStmt = $pdo->prepare(
        'INSERT INTO shared_vault_members (shared_vault_id, user_id, role, invitation_status, invited_by_user_id)
         VALUES (:shared_vault_id, :user_id, :role, :invitation_status, :invited_by_user_id)'
    );
    $memberStmt->execute([
        'shared_vault_id' => $vaultId,
        'user_id' => $userId,
        'role' => 'owner',
        'invitation_status' => 'accepted',
        'invited_by_user_id' => $userId,
    ]);

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    throw $e;
}

audit_log('shared_vault.create', $userId, [
    'shared_vault_id' => $vaultId,
    'name' => $name,
]);

json_response([
    'ok' => true,
    'shared_vault' => [
        'id' => $vaultId,
        'name' => $name,
        'role' => 'owner',
        'owner_user_id' => $userId,
    ],
], 201);
