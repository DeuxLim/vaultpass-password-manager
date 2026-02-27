<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');
$userId = require_auth();

if (!db_table_exists('emergency_access_requests') || !db_table_exists('emergency_access_grants')) {
    json_response([
        'ok' => true,
        'available' => false,
        'approved_access' => [],
    ]);
}

$pdo = db();
$stmt = $pdo->prepare(
    'SELECT
        r.id AS request_id,
        r.grant_id,
        r.requested_at,
        r.decided_at,
        r.expires_at,
        g.owner_user_id,
        owner.name AS owner_name,
        owner.email AS owner_email
     FROM emergency_access_requests r
     INNER JOIN emergency_access_grants g ON g.id = r.grant_id
     INNER JOIN users owner ON owner.id = g.owner_user_id
     WHERE r.requester_user_id = :user_id
       AND r.status = \'approved\'
       AND (r.expires_at IS NULL OR r.expires_at > CURRENT_TIMESTAMP)
     ORDER BY r.decided_at DESC, r.id DESC'
);
$stmt->execute(['user_id' => $userId]);
$rows = $stmt->fetchAll();

$approved = array_map(static function (array $row): array {
    return [
        'request_id' => (int)$row['request_id'],
        'grant_id' => (int)$row['grant_id'],
        'owner_user_id' => (int)$row['owner_user_id'],
        'owner_name' => (string)$row['owner_name'],
        'owner_email' => (string)$row['owner_email'],
        'requested_at' => (string)$row['requested_at'],
        'decided_at' => (string)($row['decided_at'] ?? ''),
        'expires_at' => $row['expires_at'] ? (string)$row['expires_at'] : null,
    ];
}, $rows);

json_response([
    'ok' => true,
    'available' => true,
    'approved_access' => $approved,
]);
