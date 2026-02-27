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
require_once __DIR__ . '/backup.php';
require_once __DIR__ . '/audit.php';
require_once __DIR__ . '/two_factor.php';
require_once __DIR__ . '/validators.php';

load_dotenv();
start_app_session();

$appEnv = strtolower((string)(getenv('APP_ENV') ?: 'development'));
$isDevelopment = $appEnv === 'development';
ini_set('display_errors', $isDevelopment ? '1' : '0');
error_reporting(E_ALL);

set_exception_handler(static function (Throwable $e) use ($appEnv): void {
    error_log(sprintf(
        '[vaultpass][%s] uncaught %s: %s in %s:%d',
        $appEnv,
        get_class($e),
        $e->getMessage(),
        $e->getFile(),
        $e->getLine()
    ));

    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json');
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        header('Pragma: no-cache');
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('Referrer-Policy: strict-origin-when-cross-origin');
    }

    echo json_encode([
        'ok' => false,
        'error' => 'Internal server error',
        'error_code' => 'internal_server_error',
        'details' => [],
        'request_id' => request_id(),
    ]);
    exit;
});
