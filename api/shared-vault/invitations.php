<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');
$userId = require_auth();

if (!shared_vaults_available()) {
    json_response([
        'ok' => true,
        'available' => false,
        'invitations' => [],
    ]);
}

$pdo = db();
$stmt = $pdo->prepare(
    'SELECT
        svm.id AS membership_id,
        svm.shared_vault_id,
        svm.role,
        svm.invitation_status,
        svm.created_at,
        svm.updated_at,
        sv.name AS vault_name,
        inviter.email AS invited_by_email,
        inviter.name AS invited_by_name
     FROM shared_vault_members svm
     INNER JOIN shared_vaults sv ON sv.id = svm.shared_vault_id
     LEFT JOIN users inviter ON inviter.id = svm.invited_by_user_id
     WHERE svm.user_id = :user_id
       AND svm.invitation_status = \'pending\'
     ORDER BY svm.updated_at DESC'
);
$stmt->execute(['user_id' => $userId]);
$rows = $stmt->fetchAll();

$invitations = array_map(static function (array $row): array {
    return [
        'membership_id' => (int)$row['membership_id'],
        'vault_id' => (int)$row['shared_vault_id'],
        'vault_name' => (string)$row['vault_name'],
        'role' => (string)$row['role'],
        'invitation_status' => (string)$row['invitation_status'],
        'invited_by_name' => (string)($row['invited_by_name'] ?? ''),
        'invited_by_email' => (string)($row['invited_by_email'] ?? ''),
        'created_at' => (string)$row['created_at'],
        'updated_at' => (string)$row['updated_at'],
    ];
}, $rows);

json_response([
    'ok' => true,
    'available' => true,
    'invitations' => $invitations,
]);
