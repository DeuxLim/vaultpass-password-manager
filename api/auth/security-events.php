<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');
$userId = require_auth();

$limitRaw = (int)($_GET['limit'] ?? 50);
$limit = max(1, min($limitRaw, 200));

$pdo = db();
$stmt = $pdo->prepare(
    'SELECT id, event_type, ip_address, user_agent, created_at, meta_json
     FROM audit_logs
     WHERE user_id = :user_id
     ORDER BY id DESC
     LIMIT ' . $limit
);
$stmt->execute(['user_id' => $userId]);
$rows = $stmt->fetchAll();

$events = array_map(static function (array $row): array {
    $meta = json_decode((string)($row['meta_json'] ?? ''), true);
    return [
        'id' => (int)$row['id'],
        'event_type' => (string)$row['event_type'],
        'ip_address' => (string)$row['ip_address'],
        'user_agent' => (string)$row['user_agent'],
        'created_at' => (string)$row['created_at'],
        'meta' => is_array($meta) ? $meta : [],
    ];
}, $rows);

json_response([
    'ok' => true,
    'events' => $events,
]);
