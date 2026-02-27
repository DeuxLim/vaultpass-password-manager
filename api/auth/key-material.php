<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');
$userId = require_auth();

if (!key_material_storage_available()) {
    json_response([
        'ok' => true,
        'available' => false,
        'has_key_material' => false,
        'warning' => 'Key material storage unavailable. Run migration 007.',
    ]);
}

$record = get_user_key_material($userId);

json_response([
    'ok' => true,
    'available' => true,
    'has_key_material' => $record !== null,
    'key_material' => $record ? [
        'kdf_algorithm' => $record['kdf_algorithm'],
        'kdf_salt_b64' => $record['kdf_salt_b64'],
        'kdf_iterations' => $record['kdf_iterations'],
        'key_version' => $record['key_version'],
        'encrypted_dek_blob' => $record['encrypted_dek_blob'],
        'created_at' => $record['created_at'],
        'updated_at' => $record['updated_at'],
    ] : null,
]);
