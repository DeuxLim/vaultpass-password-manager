<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

$rows = $body['rows'] ?? null;
$mode = strtolower(trim((string)($body['mode'] ?? 'append')));

if (!is_array($rows)) {
    json_response(['ok' => false, 'error' => 'rows array is required'], 422);
}

if (count($rows) === 0) {
    json_response(['ok' => false, 'error' => 'No rows to import'], 422);
}

if (count($rows) > 5000) {
    json_response(['ok' => false, 'error' => 'CSV import row limit exceeded (5000)'], 422);
}

if ($mode !== 'append' && $mode !== 'replace') {
    json_response(['ok' => false, 'error' => 'Invalid import mode'], 422);
}

$imported = 0;
$errors = [];
$pdo = db();

try {
    $pdo->beginTransaction();

    if ($mode === 'replace') {
        $deleteStmt = $pdo->prepare('DELETE FROM vault_items WHERE user_id = :user_id');
        $deleteStmt->execute(['user_id' => $userId]);
    }

    $insertStmt = $pdo->prepare(
        'INSERT INTO vault_items (user_id, site, username_enc, password_enc, notes_enc)
         VALUES (:user_id, :site, :username_enc, :password_enc, :notes_enc)'
    );

    foreach ($rows as $index => $row) {
        if (!is_array($row)) {
            $errors[] = ['row' => $index + 1, 'error' => 'Invalid row format'];
            continue;
        }

        $site = trim((string)($row['site'] ?? ''));
        $username = trim((string)($row['username'] ?? ''));
        $password = (string)($row['password'] ?? '');
        $notes = trim((string)($row['notes'] ?? ''));

        if ($site === '' || $username === '' || $password === '') {
            $errors[] = ['row' => $index + 1, 'error' => 'Site, username, and password are required'];
            continue;
        }

        $insertStmt->execute([
            'user_id' => $userId,
            'site' => mb_substr($site, 0, 191),
            'username_enc' => encrypt_value($username),
            'password_enc' => encrypt_value($password),
            'notes_enc' => encrypt_value($notes),
        ]);
        $imported++;
    }

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    json_response(['ok' => false, 'error' => 'Unable to import CSV'], 500);
}

audit_log('vault.import_csv', $userId, ['mode' => $mode, 'imported_count' => $imported, 'error_count' => count($errors)]);

json_response([
    'ok' => true,
    'mode' => $mode,
    'imported_count' => $imported,
    'error_count' => count($errors),
    'errors' => array_slice($errors, 0, 100),
]);
