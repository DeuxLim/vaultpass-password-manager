<?php

declare(strict_types=1);

require_once __DIR__ . '/http.php';
require_once __DIR__ . '/env.php';
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/session.php';
require_once __DIR__ . '/csrf.php';
require_once __DIR__ . '/rate_limit.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/crypto.php';
require_once __DIR__ . '/audit.php';

load_dotenv();
start_app_session();
