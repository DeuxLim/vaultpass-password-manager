<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');
$userId = require_auth();

$grantsAvailable = db_table_exists('emergency_access_grants');
$requestsAvailable = db_table_exists('emergency_access_requests');
if (!$grantsAvailable || !$requestsAvailable) {
    json_response([
        'ok' => true,
        'available' => false,
        'grants_given' => [],
        'grants_received' => [],
        'requests' => [],
    ]);
}

$pdo = db();

$givenStmt = $pdo->prepare(
    'SELECT
        g.id,
        g.owner_user_id,
        g.grantee_user_id,
        g.wait_period_hours,
        g.is_enabled,
        g.created_at,
        g.updated_at,
        u.email AS grantee_email,
        u.name AS grantee_name
     FROM emergency_access_grants g
     INNER JOIN users u ON u.id = g.grantee_user_id
     WHERE g.owner_user_id = :user_id
     ORDER BY g.updated_at DESC'
);
$givenStmt->execute(['user_id' => $userId]);
$givenRows = $givenStmt->fetchAll();

$receivedStmt = $pdo->prepare(
    'SELECT
        g.id,
        g.owner_user_id,
        g.grantee_user_id,
        g.wait_period_hours,
        g.is_enabled,
        g.created_at,
        g.updated_at,
        u.email AS owner_email,
        u.name AS owner_name
     FROM emergency_access_grants g
     INNER JOIN users u ON u.id = g.owner_user_id
     WHERE g.grantee_user_id = :user_id
     ORDER BY g.updated_at DESC'
);
$receivedStmt->execute(['user_id' => $userId]);
$receivedRows = $receivedStmt->fetchAll();

$requestsStmt = $pdo->prepare(
    'SELECT
        r.id,
        r.grant_id,
        r.requester_user_id,
        r.status,
        r.requested_at,
        r.decided_at,
        r.expires_at,
        g.owner_user_id,
        g.grantee_user_id,
        owner.email AS owner_email,
        owner.name AS owner_name,
        requester.email AS requester_email,
        requester.name AS requester_name
     FROM emergency_access_requests r
     INNER JOIN emergency_access_grants g ON g.id = r.grant_id
     INNER JOIN users owner ON owner.id = g.owner_user_id
     INNER JOIN users requester ON requester.id = r.requester_user_id
     WHERE g.owner_user_id = :user_id_owner
        OR g.grantee_user_id = :user_id_grantee
     ORDER BY r.requested_at DESC'
);
$requestsStmt->execute([
    'user_id_owner' => $userId,
    'user_id_grantee' => $userId,
]);
$requestRows = $requestsStmt->fetchAll();

$grantsGiven = array_map(static function (array $row): array {
    return [
        'id' => (int)$row['id'],
        'owner_user_id' => (int)$row['owner_user_id'],
        'grantee_user_id' => (int)$row['grantee_user_id'],
        'grantee_name' => (string)$row['grantee_name'],
        'grantee_email' => (string)$row['grantee_email'],
        'wait_period_hours' => (int)$row['wait_period_hours'],
        'is_enabled' => ((int)$row['is_enabled']) === 1,
        'created_at' => (string)$row['created_at'],
        'updated_at' => (string)$row['updated_at'],
    ];
}, $givenRows);

$grantsReceived = array_map(static function (array $row): array {
    return [
        'id' => (int)$row['id'],
        'owner_user_id' => (int)$row['owner_user_id'],
        'grantee_user_id' => (int)$row['grantee_user_id'],
        'owner_name' => (string)$row['owner_name'],
        'owner_email' => (string)$row['owner_email'],
        'wait_period_hours' => (int)$row['wait_period_hours'],
        'is_enabled' => ((int)$row['is_enabled']) === 1,
        'created_at' => (string)$row['created_at'],
        'updated_at' => (string)$row['updated_at'],
    ];
}, $receivedRows);

$requests = array_map(static function (array $row) use ($userId): array {
    $ownerId = (int)$row['owner_user_id'];
    $requesterId = (int)$row['requester_user_id'];
    return [
        'id' => (int)$row['id'],
        'grant_id' => (int)$row['grant_id'],
        'requester_user_id' => $requesterId,
        'status' => (string)$row['status'],
        'requested_at' => (string)$row['requested_at'],
        'decided_at' => $row['decided_at'] ? (string)$row['decided_at'] : null,
        'expires_at' => $row['expires_at'] ? (string)$row['expires_at'] : null,
        'owner_user_id' => $ownerId,
        'grantee_user_id' => (int)$row['grantee_user_id'],
        'owner_name' => (string)$row['owner_name'],
        'owner_email' => (string)$row['owner_email'],
        'requester_name' => (string)$row['requester_name'],
        'requester_email' => (string)$row['requester_email'],
        'is_incoming_for_owner' => $ownerId === $userId,
        'is_outgoing_for_requester' => $requesterId === $userId,
    ];
}, $requestRows);

json_response([
    'ok' => true,
    'available' => true,
    'grants_given' => $grantsGiven,
    'grants_received' => $grantsReceived,
    'requests' => $requests,
]);
