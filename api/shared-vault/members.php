<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');
$userId = require_auth();
$vaultId = (int)($_GET['vault_id'] ?? 0);

if ($vaultId <= 0) {
    json_response(['ok' => false, 'error' => 'Valid vault_id is required'], 422);
}

if (!db_table_exists('shared_vaults') || !db_table_exists('shared_vault_members')) {
    json_response([
        'ok' => false,
        'error' => 'Shared vaults require migration 008',
        'error_code' => 'shared_vaults_unavailable',
        'details' => [],
    ], 409);
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
if (!$access) {
    json_response(['ok' => false, 'error' => 'Access denied'], 403);
}

$membersStmt = $pdo->prepare(
    'SELECT
        svm.id,
        svm.user_id,
        svm.role,
        svm.invitation_status,
        svm.created_at,
        u.name,
        u.email
     FROM shared_vault_members svm
     INNER JOIN users u ON u.id = svm.user_id
     WHERE svm.shared_vault_id = :shared_vault_id
     ORDER BY svm.created_at ASC'
);
$membersStmt->execute(['shared_vault_id' => $vaultId]);
$rows = $membersStmt->fetchAll();

$members = array_map(static function (array $row): array {
    return [
        'id' => (int)$row['id'],
        'user_id' => (int)$row['user_id'],
        'name' => (string)$row['name'],
        'email' => (string)$row['email'],
        'role' => (string)$row['role'],
        'invitation_status' => (string)$row['invitation_status'],
        'created_at' => (string)$row['created_at'],
    ];
}, $rows);

json_response([
    'ok' => true,
    'vault_id' => $vaultId,
    'members' => $members,
]);
