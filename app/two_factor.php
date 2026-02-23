<?php

declare(strict_types=1);

function two_factor_issuer(): string
{
    $issuer = getenv('TOTP_ISSUER');
    return is_string($issuer) && $issuer !== '' ? $issuer : 'VaultPass';
}

function two_factor_window(): int
{
    $raw = getenv('TOTP_WINDOW');
    $value = is_numeric($raw) ? (int)$raw : 1;
    return max(0, min($value, 5));
}

function base32_encode_bytes(string $bytes): string
{
    $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    $bits = '';
    $len = strlen($bytes);

    for ($i = 0; $i < $len; $i++) {
        $bits .= str_pad(decbin(ord($bytes[$i])), 8, '0', STR_PAD_LEFT);
    }

    $encoded = '';
    $bitsLen = strlen($bits);
    for ($i = 0; $i < $bitsLen; $i += 5) {
        $chunk = substr($bits, $i, 5);
        if (strlen($chunk) < 5) {
            $chunk = str_pad($chunk, 5, '0', STR_PAD_RIGHT);
        }
        $encoded .= $alphabet[bindec($chunk)];
    }

    return $encoded;
}

function base32_decode_string(string $base32): string
{
    $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    $clean = strtoupper(preg_replace('/[^A-Z2-7]/', '', $base32) ?? '');
    if ($clean === '') {
        return '';
    }

    $bits = '';
    $len = strlen($clean);
    for ($i = 0; $i < $len; $i++) {
        $char = $clean[$i];
        $pos = strpos($alphabet, $char);
        if ($pos === false) {
            return '';
        }
        $bits .= str_pad(decbin($pos), 5, '0', STR_PAD_LEFT);
    }

    $output = '';
    $bitsLen = strlen($bits);
    for ($i = 0; $i + 8 <= $bitsLen; $i += 8) {
        $output .= chr(bindec(substr($bits, $i, 8)));
    }

    return $output;
}

function generate_totp_secret(): string
{
    return base32_encode_bytes(random_bytes(20));
}

function normalize_totp_token(string $token): string
{
    return preg_replace('/\s+/', '', trim($token)) ?? '';
}

function generate_recovery_codes(int $count = 8): array
{
    $codes = [];
    for ($i = 0; $i < $count; $i++) {
        $partA = strtoupper(bin2hex(random_bytes(2)));
        $partB = strtoupper(bin2hex(random_bytes(2)));
        $codes[] = $partA . '-' . $partB;
    }

    return $codes;
}

function hash_recovery_codes(array $codes): array
{
    $hashes = [];
    foreach ($codes as $code) {
        $hashes[] = password_hash($code, PASSWORD_BCRYPT);
    }
    return $hashes;
}

function build_totp_counter(int $counter): string
{
    $high = ($counter >> 32) & 0xffffffff;
    $low = $counter & 0xffffffff;
    return pack('N2', $high, $low);
}

function generate_totp_code(string $secret, ?int $timestamp = null): string
{
    $timestamp = $timestamp ?? time();
    $counter = (int)floor($timestamp / 30);
    $key = base32_decode_string($secret);
    if ($key === '') {
        return '';
    }

    $hmac = hash_hmac('sha1', build_totp_counter($counter), $key, true);
    $offset = ord(substr($hmac, -1)) & 0x0f;
    $chunk = substr($hmac, $offset, 4);
    $value = unpack('N', $chunk);
    $codeInt = ($value[1] & 0x7fffffff) % 1000000;

    return str_pad((string)$codeInt, 6, '0', STR_PAD_LEFT);
}

function verify_totp_code(string $secret, string $code, ?int $window = null): bool
{
    $normalized = preg_replace('/\D/', '', trim($code)) ?? '';
    if (strlen($normalized) !== 6) {
        return false;
    }

    $window = $window ?? two_factor_window();
    $now = time();

    for ($offset = -$window; $offset <= $window; $offset++) {
        $candidate = generate_totp_code($secret, $now + ($offset * 30));
        if ($candidate !== '' && hash_equals($candidate, $normalized)) {
            return true;
        }
    }

    return false;
}

function recovery_codes_remaining(array $hashes): int
{
    return count(array_filter($hashes, static fn ($hash): bool => is_string($hash) && $hash !== ''));
}

function consume_recovery_code(string $input, array $hashes, ?array &$updated = null): bool
{
    $normalized = strtoupper(normalize_totp_token($input));
    if ($normalized === '') {
        return false;
    }

    foreach ($hashes as $index => $hash) {
        if (!is_string($hash) || $hash === '') {
            continue;
        }
        if (password_verify($normalized, $hash)) {
            $hashes[$index] = '';
            $updated = array_values($hashes);
            return true;
        }
    }

    return false;
}

function two_factor_provisioning_uri(string $secret, string $accountLabel): string
{
    $issuer = two_factor_issuer();
    $label = rawurlencode($issuer . ':' . $accountLabel);
    return sprintf(
        'otpauth://totp/%s?secret=%s&issuer=%s&algorithm=SHA1&digits=6&period=30',
        $label,
        rawurlencode($secret),
        rawurlencode($issuer)
    );
}

function get_user_two_factor(int $userId): ?array
{
    if (!two_factor_storage_available()) {
        return null;
    }

    $pdo = db();
    $stmt = $pdo->prepare(
        'SELECT user_id, secret_enc, recovery_codes_json, enabled_at, updated_at
         FROM user_two_factor
         WHERE user_id = :user_id
         LIMIT 1'
    );
    $stmt->execute(['user_id' => $userId]);
    $row = $stmt->fetch();
    if (!$row) {
        return null;
    }

    $decoded = json_decode((string)$row['recovery_codes_json'], true);
    $hashes = is_array($decoded) ? $decoded : [];

    return [
        'user_id' => (int)$row['user_id'],
        'secret' => decrypt_value((string)$row['secret_enc']),
        'recovery_hashes' => $hashes,
        'enabled_at' => (string)$row['enabled_at'],
        'updated_at' => (string)$row['updated_at'],
    ];
}

function is_two_factor_enabled(int $userId): bool
{
    return get_user_two_factor($userId) !== null;
}

function save_user_two_factor(int $userId, string $secret, array $recoveryHashes): void
{
    if (!two_factor_storage_available()) {
        throw new RuntimeException('Two-factor storage unavailable');
    }

    $pdo = db();
    $stmt = $pdo->prepare(
        'INSERT INTO user_two_factor (user_id, secret_enc, recovery_codes_json, enabled_at)
         VALUES (:user_id, :secret_enc, :recovery_codes_json, CURRENT_TIMESTAMP)
         ON DUPLICATE KEY UPDATE
           secret_enc = VALUES(secret_enc),
           recovery_codes_json = VALUES(recovery_codes_json),
           enabled_at = CURRENT_TIMESTAMP'
    );
    $stmt->execute([
        'user_id' => $userId,
        'secret_enc' => encrypt_value($secret),
        'recovery_codes_json' => json_encode(array_values($recoveryHashes), JSON_UNESCAPED_UNICODE),
    ]);
}

function update_user_recovery_hashes(int $userId, array $recoveryHashes): void
{
    if (!two_factor_storage_available()) {
        throw new RuntimeException('Two-factor storage unavailable');
    }

    $pdo = db();
    $stmt = $pdo->prepare(
        'UPDATE user_two_factor
         SET recovery_codes_json = :recovery_codes_json,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = :user_id
         LIMIT 1'
    );
    $stmt->execute([
        'user_id' => $userId,
        'recovery_codes_json' => json_encode(array_values($recoveryHashes), JSON_UNESCAPED_UNICODE),
    ]);
}

function disable_user_two_factor(int $userId): void
{
    if (!two_factor_storage_available()) {
        throw new RuntimeException('Two-factor storage unavailable');
    }

    $pdo = db();
    $stmt = $pdo->prepare('DELETE FROM user_two_factor WHERE user_id = :user_id LIMIT 1');
    $stmt->execute(['user_id' => $userId]);
}

function two_factor_storage_available(): bool
{
    static $available = null;
    if (is_bool($available)) {
        return $available;
    }

    try {
        $pdo = db();
        $stmt = $pdo->query('SELECT 1 FROM user_two_factor LIMIT 1');
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
