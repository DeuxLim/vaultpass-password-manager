<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');

if (!analytics_enabled() || !analytics_available()) {
    json_response([
        'ok' => false,
        'error' => 'Analytics disabled',
        'error_code' => 'analytics_disabled',
        'details' => [],
    ], 404);
}

$bucket = 'analytics:' . request_ip();
$window = rate_limit_int_env('ANALYTICS_RATE_LIMIT_WINDOW', 60);
$max = rate_limit_int_env('ANALYTICS_RATE_LIMIT_MAX', 120);
enforce_rate_limit($bucket, $max, $window);

$body = request_body();
$event = trim((string)($body['event'] ?? ''));
$props = $body['props'] ?? [];
if (!is_array($props)) {
    $props = [];
}

if ($event === '' || strlen($event) > 120) {
    json_response(['ok' => false, 'error' => 'Valid event is required'], 422);
}

$maybeUserId = current_user_id();
$userId = is_int($maybeUserId) && $maybeUserId > 0 ? $maybeUserId : null;

record_analytics_event($userId, $event, $props);
json_response(['ok' => true], 201);
