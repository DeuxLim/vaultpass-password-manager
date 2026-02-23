<?php

declare(strict_types=1);

function start_app_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $sessionCookieSecure = getenv('SESSION_COOKIE_SECURE');
    $secure = $sessionCookieSecure === false
        ? !empty($_SERVER['HTTPS'])
        : filter_var($sessionCookieSecure, FILTER_VALIDATE_BOOLEAN);

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => getenv('SESSION_SAMESITE') ?: 'Lax',
    ]);

    session_start();
}

function current_user_id(): ?int
{
    $id = $_SESSION['user_id'] ?? null;
    return is_numeric($id) ? (int)$id : null;
}

function require_auth(): int
{
    $userId = current_user_id();
    if (!$userId) {
        json_response(['ok' => false, 'error' => 'Unauthorized'], 401);
    }

    return $userId;
}
