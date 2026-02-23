<?php

declare(strict_types=1);

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token']) || !is_string($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function verify_csrf_token(?string $token): bool
{
    $current = $_SESSION['csrf_token'] ?? '';
    return is_string($token) && is_string($current) && $token !== '' && hash_equals($current, $token);
}

function require_csrf(): void
{
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;

    if (!verify_csrf_token(is_string($token) ? $token : null)) {
        json_response(['ok' => false, 'error' => 'Invalid CSRF token'], 419);
    }
}
