<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();

$body = request_body();
$sessionRecordId = (int)($body['session_id'] ?? 0);

if ($sessionRecordId <= 0) {
    json_response(['ok' => false, 'error' => 'Invalid session id'], 422);
}

$revoked = revoke_user_session_by_id($userId, $sessionRecordId);
if (!$revoked) {
    json_response(['ok' => false, 'error' => 'Session not found, already revoked, or current session'], 404);
}

audit_log('auth.session.revoked', $userId, ['session_record_id' => $sessionRecordId]);

json_response(['ok' => true]);
