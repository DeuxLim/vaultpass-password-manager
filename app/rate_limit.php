<?php

declare(strict_types=1);

function request_ip(): string
{
    $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if (is_string($forwarded) && $forwarded !== '') {
        $parts = explode(',', $forwarded);
        $ip = trim($parts[0]);
        if ($ip !== '') {
            return $ip;
        }
    }

    $remote = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    return is_string($remote) && $remote !== '' ? $remote : 'unknown';
}

function rate_limit_int_env(string $name, int $default): int
{
    $raw = getenv($name);
    if ($raw === false) {
        return $default;
    }

    $value = filter_var($raw, FILTER_VALIDATE_INT);
    if ($value === false || $value <= 0) {
        return $default;
    }

    return (int)$value;
}

function rate_limit_store_dir(): string
{
    $custom = getenv('RATE_LIMIT_STORE');
    $dir = (is_string($custom) && $custom !== '')
        ? $custom
        : sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'vaultpass_rate_limits';

    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }

    return $dir;
}

function rate_limit_bucket_path(string $bucket): string
{
    $safe = hash('sha256', $bucket);
    return rate_limit_store_dir() . DIRECTORY_SEPARATOR . $safe . '.json';
}

function account_lockout_bucket_path(string $bucket): string
{
    $safe = hash('sha256', 'lockout:' . $bucket);
    return rate_limit_store_dir() . DIRECTORY_SEPARATOR . $safe . '.json';
}

function account_lockout_key_for_email(string $email): string
{
    return 'email:' . hash('sha256', strtolower(trim($email)));
}

function enforce_account_lockout(string $bucket, int $maxAttempts, int $windowSeconds, int $lockoutSeconds): void
{
    if ($maxAttempts <= 0 || $windowSeconds <= 0 || $lockoutSeconds <= 0) {
        return;
    }

    $file = account_lockout_bucket_path($bucket);
    $handle = fopen($file, 'c+');

    if ($handle === false) {
        return;
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            return;
        }

        $now = time();
        $raw = stream_get_contents($handle);
        $state = ['failures' => [], 'locked_until' => 0];

        if (is_string($raw) && trim($raw) !== '') {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                $state['locked_until'] = (int)($decoded['locked_until'] ?? 0);
                $history = $decoded['failures'] ?? [];
                if (is_array($history)) {
                    $state['failures'] = array_values(array_map('intval', array_filter(
                        $history,
                        static fn($v) => is_int($v) || ctype_digit((string)$v)
                    )));
                }
            }
        }

        $state['failures'] = array_values(array_filter(
            $state['failures'],
            static fn(int $ts): bool => ($now - $ts) < $windowSeconds
        ));

        if ($state['locked_until'] > $now) {
            $retryAfter = $state['locked_until'] - $now;
            header('Retry-After: ' . $retryAfter);
            json_response([
                'ok' => false,
                'error' => 'Account temporarily locked. Try again in ' . $retryAfter . ' seconds.',
                'retry_after' => $retryAfter,
            ], 429);
        }

        if ($state['locked_until'] <= $now) {
            $state['locked_until'] = 0;
        }

        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($state));
        fflush($handle);
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function record_account_lockout_failure(string $bucket, int $maxAttempts, int $windowSeconds, int $lockoutSeconds): array
{
    if ($maxAttempts <= 0 || $windowSeconds <= 0 || $lockoutSeconds <= 0) {
        return ['locked' => false, 'retry_after' => 0];
    }

    $file = account_lockout_bucket_path($bucket);
    $handle = fopen($file, 'c+');

    if ($handle === false) {
        return ['locked' => false, 'retry_after' => 0];
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            return ['locked' => false, 'retry_after' => 0];
        }

        $now = time();
        $raw = stream_get_contents($handle);
        $state = ['failures' => [], 'locked_until' => 0];

        if (is_string($raw) && trim($raw) !== '') {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                $state['locked_until'] = (int)($decoded['locked_until'] ?? 0);
                $history = $decoded['failures'] ?? [];
                if (is_array($history)) {
                    $state['failures'] = array_values(array_map('intval', array_filter(
                        $history,
                        static fn($v) => is_int($v) || ctype_digit((string)$v)
                    )));
                }
            }
        }

        $state['failures'] = array_values(array_filter(
            $state['failures'],
            static fn(int $ts): bool => ($now - $ts) < $windowSeconds
        ));
        $state['failures'][] = $now;

        $locked = false;
        $retryAfter = 0;
        if (count($state['failures']) >= $maxAttempts) {
            $state['failures'] = [];
            $state['locked_until'] = $now + $lockoutSeconds;
            $locked = true;
            $retryAfter = $lockoutSeconds;
        }

        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($state));
        fflush($handle);

        return ['locked' => $locked, 'retry_after' => $retryAfter];
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function clear_account_lockout(string $bucket): void
{
    $file = account_lockout_bucket_path($bucket);
    if (is_file($file)) {
        @unlink($file);
    }
}

function enforce_rate_limit(string $bucket, int $maxAttempts, int $windowSeconds): void
{
    if ($maxAttempts <= 0 || $windowSeconds <= 0) {
        return;
    }

    $file = rate_limit_bucket_path($bucket);
    $handle = fopen($file, 'c+');

    if ($handle === false) {
        return;
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            return;
        }

        $now = time();
        $raw = stream_get_contents($handle);
        $history = [];

        if (is_string($raw) && trim($raw) !== '') {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                $history = array_values(array_filter($decoded, static fn($v) => is_int($v) || ctype_digit((string)$v)));
                $history = array_map(static fn($v) => (int)$v, $history);
            }
        }

        $history = array_values(array_filter(
            $history,
            static fn(int $ts): bool => ($now - $ts) < $windowSeconds
        ));

        if (count($history) >= $maxAttempts) {
            $oldest = min($history);
            $retryAfter = max(1, $windowSeconds - ($now - $oldest));
            header('Retry-After: ' . $retryAfter);
            json_response([
                'ok' => false,
                'error' => 'Too many attempts. Try again in ' . $retryAfter . ' seconds.',
                'retry_after' => $retryAfter,
            ], 429);
        }

        $history[] = $now;

        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($history));
        fflush($handle);
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}
