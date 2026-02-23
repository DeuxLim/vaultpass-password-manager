<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

$id = (int)($body['id'] ?? 0);
$site = trim((string)($body['site'] ?? ''));
$username = trim((string)($body['username'] ?? ''));
$password = (string)($body['password'] ?? '');
$notes = trim((string)($body['notes'] ?? ''));

if ($id <= 0 || $site === '' || $username === '' || $password === '') {
    json_response(['ok' => false, 'error' => 'Invalid request'], 422);
}

$pdo = db();
try {
    $pdo->beginTransaction();

    $selectStmt = $pdo->prepare(
        'SELECT id, site, username_enc, password_enc, notes_enc
         FROM vault_items
         WHERE id = :id AND user_id = :user_id
         LIMIT 1
         FOR UPDATE'
    );
    $selectStmt->execute([
        'id' => $id,
        'user_id' => $userId,
    ]);
    $current = $selectStmt->fetch();

    if (!$current) {
        $pdo->rollBack();
        json_response(['ok' => false, 'error' => 'Record not found'], 404);
    }

    $versionStmt = $pdo->prepare(
        'INSERT INTO vault_item_versions (vault_item_id, user_id, site, username_enc, password_enc, notes_enc, source)
         VALUES (:vault_item_id, :user_id, :site, :username_enc, :password_enc, :notes_enc, :source)'
    );
    $versionStmt->execute([
        'vault_item_id' => (int)$current['id'],
        'user_id' => $userId,
        'site' => (string)$current['site'],
        'username_enc' => (string)$current['username_enc'],
        'password_enc' => (string)$current['password_enc'],
        'notes_enc' => (string)$current['notes_enc'],
        'source' => 'update',
    ]);
    $snapshotId = (int)$pdo->lastInsertId();

    $updateStmt = $pdo->prepare(
        'UPDATE vault_items
         SET site = :site,
             username_enc = :username_enc,
             password_enc = :password_enc,
             notes_enc = :notes_enc,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = :id AND user_id = :user_id'
    );
    $updateStmt->execute([
        'id' => $id,
        'user_id' => $userId,
        'site' => $site,
        'username_enc' => encrypt_value($username),
        'password_enc' => encrypt_value($password),
        'notes_enc' => encrypt_value($notes),
    ]);

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    json_response(['ok' => false, 'error' => 'Unable to update record'], 500);
}

audit_log('vault.update', $userId, ['vault_item_id' => $id, 'site' => $site, 'version_snapshot_id' => $snapshotId]);

json_response(['ok' => true]);
