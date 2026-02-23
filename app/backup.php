<?php

declare(strict_types=1);

function backup_pbkdf2_iterations(): int
{
    $raw = getenv('BACKUP_KDF_ITERATIONS');
    $value = is_numeric($raw) ? (int)$raw : 210000;
    return max(100000, min($value, 1000000));
}

function backup_encrypt_payload(array $payload, string $passphrase): array
{
    $passphrase = trim($passphrase);
    if ($passphrase === '' || strlen($passphrase) < 10) {
        json_response(['ok' => false, 'error' => 'Passphrase must be at least 10 characters'], 422);
    }

    $json = json_encode($payload, JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        json_response(['ok' => false, 'error' => 'Unable to serialize backup payload'], 500);
    }

    $salt = random_bytes(16);
    $iv = random_bytes(12);
    $iterations = backup_pbkdf2_iterations();
    $key = hash_pbkdf2('sha256', $passphrase, $salt, $iterations, 32, true);
    $tag = '';
    $ciphertext = openssl_encrypt($json, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag);
    if ($ciphertext === false) {
        json_response(['ok' => false, 'error' => 'Unable to encrypt backup'], 500);
    }

    return [
        'format' => 'vaultpass-encrypted-backup-v1',
        'kdf' => 'pbkdf2-sha256',
        'iterations' => $iterations,
        'salt_b64' => base64_encode($salt),
        'iv_b64' => base64_encode($iv),
        'tag_b64' => base64_encode($tag),
        'ciphertext_b64' => base64_encode($ciphertext),
    ];
}

function backup_decrypt_payload(array $envelope, string $passphrase): array
{
    $passphrase = trim($passphrase);
    if ($passphrase === '') {
        json_response(['ok' => false, 'error' => 'Passphrase is required'], 422);
    }

    if (($envelope['format'] ?? '') !== 'vaultpass-encrypted-backup-v1') {
        json_response(['ok' => false, 'error' => 'Unsupported backup format'], 422);
    }

    $iterations = (int)($envelope['iterations'] ?? 0);
    if ($iterations <= 0) {
        json_response(['ok' => false, 'error' => 'Invalid backup metadata'], 422);
    }

    $salt = base64_decode((string)($envelope['salt_b64'] ?? ''), true);
    $iv = base64_decode((string)($envelope['iv_b64'] ?? ''), true);
    $tag = base64_decode((string)($envelope['tag_b64'] ?? ''), true);
    $ciphertext = base64_decode((string)($envelope['ciphertext_b64'] ?? ''), true);

    if ($salt === false || $iv === false || $tag === false || $ciphertext === false) {
        json_response(['ok' => false, 'error' => 'Invalid backup payload encoding'], 422);
    }

    $key = hash_pbkdf2('sha256', $passphrase, $salt, $iterations, 32, true);
    $json = openssl_decrypt($ciphertext, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag);
    if ($json === false) {
        json_response(['ok' => false, 'error' => 'Unable to decrypt backup. Check passphrase.'], 401);
    }

    $decoded = json_decode($json, true);
    if (!is_array($decoded)) {
        json_response(['ok' => false, 'error' => 'Corrupt backup payload'], 422);
    }

    return $decoded;
}
