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
$name = normalize_shared_vault_name_input($body['name'] ?? '');
if ($vaultId <= 0) {
    json_response(['ok' => false, 'error' => 'Valid vault_id is required'], 422);
}
$validationError = validate_shared_vault_name($name);
if ($validationError !== null) {
    json_response(['ok' => false, 'error' => $validationError], 422);
}

$membership = find_shared_vault_membership($vaultId, $userId, true);
if (!$membership || (string)$membership['role'] !== 'owner') {
    json_response(['ok' => false, 'error' => 'Only owner can update shared vault details'], 403);
}

$pdo = db();
$stmt = $pdo->prepare(
    'UPDATE shared_vaults
     SET name = :name,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :id'
);
$stmt->execute([
    'name' => $name,
    'id' => $vaultId,
]);

if ($stmt->rowCount() < 1) {
    json_response(['ok' => false, 'error' => 'Shared vault not found'], 404);
}

audit_log('shared_vault.update', $userId, [
    'shared_vault_id' => $vaultId,
    'name' => $name,
]);

json_response([
    'ok' => true,
    'vault_id' => $vaultId,
    'name' => $name,
]);
