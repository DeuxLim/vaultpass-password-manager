<?php

declare(strict_types=1);

function request_id(): string
{
    static $requestId = null;
    if (is_string($requestId)) {
        return $requestId;
    }

    $requestId = bin2hex(random_bytes(8));
    return $requestId;
}

function json_response(array $payload, int $status = 200): void
{
    if (!array_key_exists('ok', $payload)) {
        $payload['ok'] = $status < 400;
    }

    if ($payload['ok'] === false) {
        $message = $payload['error'] ?? 'Request failed';
        $payload['error'] = is_string($message) && $message !== '' ? $message : 'Request failed';
        $payload['error_code'] = isset($payload['error_code']) && is_string($payload['error_code']) && $payload['error_code'] !== ''
            ? $payload['error_code']
            : 'request_error';
        if (!array_key_exists('details', $payload)) {
            $payload['details'] = [];
        }
    }

    $payload['request_id'] = request_id();

    http_response_code($status);
    header('Content-Type: application/json');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    echo json_encode($payload);
    exit;
}

function api_success(array $data = [], int $status = 200): void
{
    json_response(array_merge(['ok' => true], $data), $status);
}

function api_error(string $message, int $status = 400, string $errorCode = 'request_error', array $details = []): void
{
    json_response([
        'ok' => false,
        'error' => $message,
        'error_code' => $errorCode,
        'details' => $details,
    ], $status);
}

function request_body(): array
{
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function require_method(string $method): void
{
    if ($_SERVER['REQUEST_METHOD'] !== strtoupper($method)) {
        api_error('Method not allowed', 405, 'method_not_allowed');
    }
}
