<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('GET');

json_response([
    'ok' => true,
    'csrf_token' => csrf_token(),
]);
