<?php

declare(strict_types=1);

function request_user_agent(): string
{
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    if (!is_string($ua) || $ua === '') {
        return 'unknown';
    }

    return mb_substr($ua, 0, 500);
}

function safe_request_ip(): string
{
    if (function_exists('request_ip')) {
        return request_ip();
    }

    $remote = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    return is_string($remote) && $remote !== '' ? $remote : 'unknown';
}

function audit_log(string $eventType, ?int $userId = null, array $meta = []): void
{
    try {
        $pdo = db();
        $stmt = $pdo->prepare(
            'INSERT INTO audit_logs (user_id, event_type, ip_address, user_agent, meta_json)
             VALUES (:user_id, :event_type, :ip_address, :user_agent, :meta_json)'
        );

        $stmt->execute([
            'user_id' => $userId,
            'event_type' => mb_substr($eventType, 0, 120),
            'ip_address' => mb_substr(safe_request_ip(), 0, 45),
            'user_agent' => request_user_agent(),
            'meta_json' => json_encode($meta, JSON_UNESCAPED_UNICODE),
        ]);
    } catch (Throwable $_e) {
        // Best-effort logging only; never break core request flow.
    }
}
