<?php

declare(strict_types=1);

function app_key_bytes(): string
{
    $config = app_config();
    return hash('sha256', (string)$config['app_key'], true);
}

function encrypt_value(?string $value): string
{
    $value = (string)($value ?? '');
    $iv = random_bytes(12);
    $tag = '';
    $ciphertext = openssl_encrypt($value, 'aes-256-gcm', app_key_bytes(), OPENSSL_RAW_DATA, $iv, $tag);

    if ($ciphertext === false) {
        json_response(['ok' => false, 'error' => 'Encryption failed'], 500);
    }

    return base64_encode($iv . $tag . $ciphertext);
}

function decrypt_value(string $encoded): string
{
    $raw = base64_decode($encoded, true);
    if ($raw === false || strlen($raw) < 28) {
        return '';
    }

    $iv = substr($raw, 0, 12);
    $tag = substr($raw, 12, 16);
    $ciphertext = substr($raw, 28);

    $plain = openssl_decrypt($ciphertext, 'aes-256-gcm', app_key_bytes(), OPENSSL_RAW_DATA, $iv, $tag);

    return $plain === false ? '' : $plain;
}
