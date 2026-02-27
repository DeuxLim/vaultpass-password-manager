<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();

if (!key_material_storage_available()) {
    json_response(['ok' => false, 'error' => 'Key material storage unavailable. Run migration 007.'], 503);
}

$body = request_body();
$encryptedDekBlob = trim((string)($body['encrypted_dek_blob'] ?? ''));
$kdfAlgorithm = strtoupper(trim((string)($body['kdf_algorithm'] ?? 'PBKDF2')));
$kdfSaltB64 = trim((string)($body['kdf_salt_b64'] ?? ''));
$kdfIterations = (int)($body['kdf_iterations'] ?? 0);
$keyVersion = (int)($body['key_version'] ?? 1);

if ($encryptedDekBlob === '' || strlen($encryptedDekBlob) > 16000) {
    json_response(['ok' => false, 'error' => 'Invalid encrypted DEK blob'], 422);
}

if (!in_array($kdfAlgorithm, ['PBKDF2', 'ARGON2ID'], true)) {
    json_response(['ok' => false, 'error' => 'Unsupported KDF algorithm'], 422);
}

if ($kdfSaltB64 === '' || strlen($kdfSaltB64) > 255 || base64_decode($kdfSaltB64, true) === false) {
    json_response(['ok' => false, 'error' => 'Invalid KDF salt'], 422);
}

if ($kdfIterations < 10000 || $kdfIterations > 10000000) {
    json_response(['ok' => false, 'error' => 'Invalid KDF iterations'], 422);
}

if ($keyVersion < 1 || $keyVersion > 1000) {
    json_response(['ok' => false, 'error' => 'Invalid key version'], 422);
}

save_user_key_material(
    $userId,
    $encryptedDekBlob,
    $kdfAlgorithm,
    $kdfSaltB64,
    $kdfIterations,
    $keyVersion
);

audit_log('auth.key_material.saved', $userId, [
    'kdf_algorithm' => $kdfAlgorithm,
    'kdf_iterations' => $kdfIterations,
    'key_version' => $keyVersion,
]);

json_response([
    'ok' => true,
    'saved' => true,
    'key_version' => $keyVersion,
]);
