<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();

$revokedCount = revoke_other_user_sessions($userId);
audit_log('auth.session.revoke_others', $userId, ['revoked_count' => $revokedCount]);

json_response([
    'ok' => true,
    'revoked_count' => $revokedCount,
]);
