<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');
$userId = require_auth();

if (!db_table_exists('shared_vaults') || !db_table_exists('shared_vault_members')) {
    json_response([
        'ok' => true,
        'available' => false,
        'shared_vaults' => [],
    ]);
}

$pdo = db();
$stmt = $pdo->prepare(
    'SELECT
        sv.id,
        sv.name,
        sv.owner_user_id,
        sv.created_at,
        sv.updated_at,
        svm.role,
        svm.invitation_status,
        (
            SELECT COUNT(*)
            FROM shared_vault_members svm_count
            WHERE svm_count.shared_vault_id = sv.id
              AND svm_count.invitation_status = \'accepted\'
        ) AS member_count
     FROM shared_vault_members svm
     INNER JOIN shared_vaults sv ON sv.id = svm.shared_vault_id
     WHERE svm.user_id = :user_id
       AND svm.invitation_status = \'accepted\'
     ORDER BY sv.updated_at DESC'
);
$stmt->execute(['user_id' => $userId]);
$rows = $stmt->fetchAll();

$vaults = array_map(static function (array $row): array {
    return [
        'id' => (int)$row['id'],
        'name' => (string)$row['name'],
        'owner_user_id' => (int)$row['owner_user_id'],
        'role' => (string)$row['role'],
        'invitation_status' => (string)$row['invitation_status'],
        'member_count' => (int)$row['member_count'],
        'created_at' => (string)$row['created_at'],
        'updated_at' => (string)$row['updated_at'],
    ];
}, $rows);

json_response([
    'ok' => true,
    'available' => true,
    'shared_vaults' => $vaults,
]);
