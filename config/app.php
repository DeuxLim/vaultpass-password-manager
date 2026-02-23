<?php

declare(strict_types=1);

return [
    'db_host' => getenv('DB_HOST') ?: '127.0.0.1',
    'db_port' => getenv('DB_PORT') ?: '3306',
    'db_name' => getenv('DB_NAME') ?: 'vaultpass',
    'db_user' => getenv('DB_USER') ?: 'root',
    'db_pass' => getenv('DB_PASS') ?: '',
    'app_key' => getenv('APP_KEY') ?: 'change-this-dev-key-to-a-long-random-secret',
];
