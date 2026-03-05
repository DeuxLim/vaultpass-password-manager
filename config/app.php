<?php

declare(strict_types=1);

return [
    'db_host' => getenv('DB_HOST') ?: '127.0.0.1',
    'db_port' => getenv('DB_PORT') ?: '3306',
    'db_name' => getenv('DB_NAME') ?: 'vaultpass',
    'db_user' => getenv('DB_USER') ?: 'root',
    'db_pass' => getenv('DB_PASS') ?: '',
    'app_key' => getenv('APP_KEY') ?: 'change-this-dev-key-to-a-long-random-secret',
    'breach_monitor_enabled' => in_array(strtolower(trim((string)(getenv('BREACH_MONITOR_ENABLED') ?: 'false'))), ['1', 'true', 'yes', 'y'], true),
    'hibp_user_agent' => getenv('HIBP_USER_AGENT') ?: 'VaultPass (local dev)',
    'push_notifications_enabled' => in_array(strtolower(trim((string)(getenv('PUSH_NOTIFICATIONS_ENABLED') ?: 'false'))), ['1', 'true', 'yes', 'y'], true),
    'vapid_public_key' => getenv('VAPID_PUBLIC_KEY') ?: '',
    'vapid_private_key' => getenv('VAPID_PRIVATE_KEY') ?: '',
];
