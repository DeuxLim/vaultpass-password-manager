<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

if (!breach_monitor_enabled()) {
    json_response([
        'ok' => false,
        'error' => 'Breach monitoring is disabled. Set BREACH_MONITOR_ENABLED=true to enable.',
    ], 409);
}

$id = (int)($body['id'] ?? 0);
if ($id <= 0) {
    json_response(['ok' => false, 'error' => 'Valid id is required'], 422);
}

$pdo = db();
$supportsSharedVaultId = db_column_exists('vault_items', 'shared_vault_id');
if ($supportsSharedVaultId && !shared_vaults_available()) {
    $supportsSharedVaultId = false;
}

$whereClause = 'id = :id AND user_id = :user_id';
$params = [
    'id' => $id,
    'user_id' => $userId,
];
if ($supportsSharedVaultId) {
    $whereClause = 'id = :id AND (
        (shared_vault_id IS NULL AND user_id = :user_id_personal)
        OR (
            shared_vault_id IS NOT NULL
            AND EXISTS (
                SELECT 1
                FROM shared_vault_members svm
                WHERE svm.shared_vault_id = vault_items.shared_vault_id
                  AND svm.user_id = :user_id_shared
                  AND svm.invitation_status = \'accepted\'
                  AND svm.role IN (\'owner\', \'editor\', \'viewer\')
            )
        )
    )';
    $params = [
        'id' => $id,
        'user_id_personal' => $userId,
        'user_id_shared' => $userId,
    ];
}

$supportsItemType = db_column_exists('vault_items', 'item_type');
$columns = 'id, site, username_enc, password_enc';
if ($supportsItemType) {
    $columns = 'id, site, item_type, username_enc, password_enc';
}

$stmt = $pdo->prepare(
    "SELECT {$columns}
     FROM vault_items
     WHERE {$whereClause}
     LIMIT 1"
);
$stmt->execute($params);
$row = $stmt->fetch();
if (!$row) {
    json_response(['ok' => false, 'error' => 'Vault item not found'], 404);
}

$itemType = normalize_item_type($row['item_type'] ?? 'login');
if ($itemType !== 'login') {
    json_response(['ok' => false, 'error' => 'Breach monitoring is only available for login entries'], 422);
}

$password = decrypt_value((string)$row['password_enc']);
if (trim($password) === '') {
    json_response(['ok' => false, 'error' => 'Password is empty'], 422);
}

try {
    $count = hibp_pwned_password_count($password);
} catch (Throwable $e) {
    json_response(['ok' => false, 'error' => $e->getMessage() ?: 'Breach provider request failed'], 502);
}

audit_log('breach.check_password', $userId, [
    'vault_item_id' => (int)$row['id'],
    'site' => (string)$row['site'],
    'pwned_count' => $count,
]);

json_response([
    'ok' => true,
    'id' => (int)$row['id'],
    'site' => (string)$row['site'],
    'pwned_count' => $count,
]);

