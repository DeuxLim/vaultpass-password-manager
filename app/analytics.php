<?php

declare(strict_types=1);

function analytics_enabled(): bool
{
    $enabled = strtolower(trim((string)(getenv('ANALYTICS_ENABLED') ?: 'false')));
    return in_array($enabled, ['1', 'true', 'yes', 'y'], true);
}

function analytics_available(): bool
{
    return db_table_exists('analytics_events');
}

function record_analytics_event(?int $userId, string $eventName, array $props = []): void
{
    if (!analytics_enabled() || !analytics_available()) {
        return;
    }

    $eventName = trim($eventName);
    if ($eventName === '' || strlen($eventName) > 120) {
        return;
    }

    $path = (string)($_SERVER['HTTP_X_VAULTPASS_PATH'] ?? ($_SERVER['REQUEST_URI'] ?? ''));
    $path = substr($path, 0, 255);
    $referrer = (string)($_SERVER['HTTP_REFERER'] ?? '');
    $referrer = substr($referrer, 0, 255);
    $ip = request_ip();
    $ua = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');
    $ua = substr($ua, 0, 255);

    $propsJson = null;
    if (!empty($props)) {
        $encoded = json_encode($props);
        if (is_string($encoded)) {
            $propsJson = $encoded;
        }
    }

    $pdo = db();
    $stmt = $pdo->prepare(
        'INSERT INTO analytics_events (user_id, event_name, path, referrer, ip_address, user_agent, props_json)
         VALUES (:user_id, :event_name, :path, :referrer, :ip_address, :user_agent, :props_json)'
    );
    $stmt->execute([
        'user_id' => $userId,
        'event_name' => $eventName,
        'path' => $path,
        'referrer' => $referrer,
        'ip_address' => $ip,
        'user_agent' => $ua,
        'props_json' => $propsJson,
    ]);
}

