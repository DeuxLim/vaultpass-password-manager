<?php

declare(strict_types=1);

function key_material_storage_available(): bool
{
    static $available = null;
    if (is_bool($available)) {
        return $available;
    }

    try {
        $pdo = db();
        $stmt = $pdo->query('SELECT 1 FROM user_key_material LIMIT 1');
        if ($stmt !== false) {
            $stmt->fetch();
        }
        $available = true;
    } catch (PDOException $e) {
        if ((string)$e->getCode() === '42S02') {
            $available = false;
        } else {
            throw $e;
        }
    }

    return $available;
}

function get_user_key_material(int $userId): ?array
{
    if (!key_material_storage_available()) {
        return null;
    }

    $pdo = db();
    $stmt = $pdo->prepare(
        'SELECT user_id, encrypted_dek_blob, kdf_algorithm, kdf_salt_b64, kdf_iterations, key_version, created_at, updated_at
         FROM user_key_material
         WHERE user_id = :user_id
         LIMIT 1'
    );
    $stmt->execute(['user_id' => $userId]);
    $row = $stmt->fetch();
    if (!$row) {
        return null;
    }

    return [
        'user_id' => (int)$row['user_id'],
        'encrypted_dek_blob' => (string)$row['encrypted_dek_blob'],
        'kdf_algorithm' => (string)$row['kdf_algorithm'],
        'kdf_salt_b64' => (string)$row['kdf_salt_b64'],
        'kdf_iterations' => (int)$row['kdf_iterations'],
        'key_version' => (int)$row['key_version'],
        'created_at' => (string)$row['created_at'],
        'updated_at' => (string)$row['updated_at'],
    ];
}

function save_user_key_material(
    int $userId,
    string $encryptedDekBlob,
    string $kdfAlgorithm,
    string $kdfSaltB64,
    int $kdfIterations,
    int $keyVersion
): void {
    if (!key_material_storage_available()) {
        throw new RuntimeException('Key material storage unavailable');
    }

    $pdo = db();
    $stmt = $pdo->prepare(
        'INSERT INTO user_key_material (user_id, encrypted_dek_blob, kdf_algorithm, kdf_salt_b64, kdf_iterations, key_version)
         VALUES (:user_id, :encrypted_dek_blob, :kdf_algorithm, :kdf_salt_b64, :kdf_iterations, :key_version)
         ON DUPLICATE KEY UPDATE
           encrypted_dek_blob = VALUES(encrypted_dek_blob),
           kdf_algorithm = VALUES(kdf_algorithm),
           kdf_salt_b64 = VALUES(kdf_salt_b64),
           kdf_iterations = VALUES(kdf_iterations),
           key_version = VALUES(key_version),
           updated_at = CURRENT_TIMESTAMP'
    );
    $stmt->execute([
        'user_id' => $userId,
        'encrypted_dek_blob' => $encryptedDekBlob,
        'kdf_algorithm' => $kdfAlgorithm,
        'kdf_salt_b64' => $kdfSaltB64,
        'kdf_iterations' => $kdfIterations,
        'key_version' => $keyVersion,
    ]);
}
