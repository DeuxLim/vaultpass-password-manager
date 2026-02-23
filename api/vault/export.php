<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();
$passphrase = (string)($body['passphrase'] ?? '');

if (trim($passphrase) === '') {
    json_response(['ok' => false, 'error' => 'Passphrase is required'], 422);
}

$pdo = db();
$stmt = $pdo->prepare('SELECT id, site, username_enc, password_enc, notes_enc, created_at, updated_at FROM vault_items WHERE user_id = :user_id ORDER BY created_at DESC');
$stmt->execute(['user_id' => $userId]);
$rows = $stmt->fetchAll();

$items = array_map(static function (array $row): array {
    return [
        'site' => (string)$row['site'],
        'username' => decrypt_value((string)$row['username_enc']),
        'password' => decrypt_value((string)$row['password_enc']),
        'notes' => decrypt_value((string)$row['notes_enc']),
        'created_at' => (string)$row['created_at'],
        'updated_at' => (string)$row['updated_at'],
    ];
}, $rows);

$payload = [
    'format' => 'vaultpass-backup-plain-v1',
    'exported_at' => gmdate('c'),
    'item_count' => count($items),
    'items' => $items,
];

$backup = backup_encrypt_payload($payload, $passphrase);
audit_log('vault.export', $userId, ['item_count' => count($items)]);

json_response([
    'ok' => true,
    'item_count' => count($items),
    'backup' => $backup,
]);
