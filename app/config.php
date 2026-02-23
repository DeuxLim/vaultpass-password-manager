<?php

declare(strict_types=1);

function app_config(): array
{
    static $config = null;

    if (is_array($config)) {
        return $config;
    }

    $config = require __DIR__ . '/../config/app.php';

    if (($config['app_key'] ?? '') === 'change-this-dev-key-to-a-long-random-secret') {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['ok' => false, 'error' => 'APP_KEY must be set']);
        exit;
    }

    return $config;
}
