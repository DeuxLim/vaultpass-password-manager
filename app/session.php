<?php

declare(strict_types=1);

function start_app_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $sessionCookieSecure = getenv('SESSION_COOKIE_SECURE');
    $secure = $sessionCookieSecure === false
        ? !empty($_SERVER['HTTPS'])
        : filter_var($sessionCookieSecure, FILTER_VALIDATE_BOOLEAN);

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => getenv('SESSION_SAMESITE') ?: 'Lax',
    ]);

    session_start();
}

function request_user_agent_header(): string
{
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    if (!is_string($ua) || $ua === '') {
        return 'unknown';
    }

    return mb_substr($ua, 0, 500);
}

function request_ip_header(): string
{
    $remote = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    return is_string($remote) && $remote !== '' ? mb_substr($remote, 0, 45) : 'unknown';
}

function session_id_hash(): string
{
    $id = session_id();
    return hash('sha256', $id === '' ? 'no-session' : $id);
}

function register_user_session(int $userId): void
{
    try {
        $pdo = db();
        $stmt = $pdo->prepare(
            'INSERT INTO user_sessions (user_id, session_id_hash, ip_address, user_agent, last_activity)
             VALUES (:user_id, :session_id_hash, :ip_address, :user_agent, CURRENT_TIMESTAMP)
             ON DUPLICATE KEY UPDATE
               user_id = VALUES(user_id),
               ip_address = VALUES(ip_address),
               user_agent = VALUES(user_agent),
               last_activity = CURRENT_TIMESTAMP,
               revoked_at = NULL'
        );

        $stmt->execute([
            'user_id' => $userId,
            'session_id_hash' => session_id_hash(),
            'ip_address' => request_ip_header(),
            'user_agent' => request_user_agent_header(),
        ]);
        $_SESSION['session_touched_at'] = time();
    } catch (Throwable $_e) {
        // Best effort tracking.
    }
}

function touch_user_session(int $userId): void
{
    $lastTouched = (int)($_SESSION['session_touched_at'] ?? 0);
    if ($lastTouched > 0 && (time() - $lastTouched) < 60) {
        return;
    }

    try {
        $pdo = db();
        $stmt = $pdo->prepare(
            'UPDATE user_sessions
             SET last_activity = CURRENT_TIMESTAMP,
                 ip_address = :ip_address,
                 user_agent = :user_agent
             WHERE user_id = :user_id
               AND session_id_hash = :session_id_hash
               AND revoked_at IS NULL
             LIMIT 1'
        );
        $stmt->execute([
            'user_id' => $userId,
            'session_id_hash' => session_id_hash(),
            'ip_address' => request_ip_header(),
            'user_agent' => request_user_agent_header(),
        ]);

        $_SESSION['session_touched_at'] = time();
    } catch (Throwable $_e) {
        // Best effort tracking.
    }
}

function current_session_revoked(int $userId): bool
{
    try {
        $pdo = db();
        $stmt = $pdo->prepare(
            'SELECT revoked_at
             FROM user_sessions
             WHERE user_id = :user_id AND session_id_hash = :session_id_hash
             LIMIT 1'
        );
        $stmt->execute([
            'user_id' => $userId,
            'session_id_hash' => session_id_hash(),
        ]);
        $row = $stmt->fetch();

        if (!$row) {
            return false;
        }

        return !empty($row['revoked_at']);
    } catch (Throwable $_e) {
        return false;
    }
}

function revoke_current_user_session(?int $userId = null): void
{
    $effectiveUserId = $userId ?? current_user_id();
    if (!$effectiveUserId) {
        return;
    }

    try {
        $pdo = db();
        $stmt = $pdo->prepare(
            'UPDATE user_sessions
             SET revoked_at = CURRENT_TIMESTAMP
             WHERE user_id = :user_id
               AND session_id_hash = :session_id_hash
               AND revoked_at IS NULL
             LIMIT 1'
        );
        $stmt->execute([
            'user_id' => $effectiveUserId,
            'session_id_hash' => session_id_hash(),
        ]);
    } catch (Throwable $_e) {
        // Best effort tracking.
    }
}

function list_user_sessions(int $userId): array
{
    try {
        $pdo = db();
        $currentHash = session_id_hash();
        $stmt = $pdo->prepare(
            'SELECT id, session_id_hash, ip_address, user_agent, last_activity, created_at, revoked_at
             FROM user_sessions
             WHERE user_id = :user_id
             ORDER BY last_activity DESC, id DESC'
        );
        $stmt->execute(['user_id' => $userId]);
        $rows = $stmt->fetchAll();

        return array_map(static function (array $row) use ($currentHash): array {
            $hash = (string)$row['session_id_hash'];
            return [
                'id' => (int)$row['id'],
                'ip_address' => (string)$row['ip_address'],
                'user_agent' => (string)$row['user_agent'],
                'last_activity' => (string)$row['last_activity'],
                'created_at' => (string)$row['created_at'],
                'revoked_at' => $row['revoked_at'] !== null ? (string)$row['revoked_at'] : null,
                'is_current' => hash_equals($currentHash, $hash),
            ];
        }, $rows);
    } catch (Throwable $_e) {
        return [];
    }
}

function revoke_user_session_by_id(int $userId, int $sessionRecordId): bool
{
    if ($sessionRecordId <= 0) {
        return false;
    }

    try {
        $pdo = db();
        $stmt = $pdo->prepare(
            'UPDATE user_sessions
             SET revoked_at = CURRENT_TIMESTAMP
             WHERE id = :id
               AND user_id = :user_id
               AND session_id_hash <> :session_id_hash
               AND revoked_at IS NULL
             LIMIT 1'
        );
        $stmt->execute([
            'id' => $sessionRecordId,
            'user_id' => $userId,
            'session_id_hash' => session_id_hash(),
        ]);

        return $stmt->rowCount() > 0;
    } catch (Throwable $_e) {
        return false;
    }
}

function revoke_other_user_sessions(int $userId): int
{
    try {
        $pdo = db();
        $stmt = $pdo->prepare(
            'UPDATE user_sessions
             SET revoked_at = CURRENT_TIMESTAMP
             WHERE user_id = :user_id
               AND session_id_hash <> :session_id_hash
               AND revoked_at IS NULL'
        );
        $stmt->execute([
            'user_id' => $userId,
            'session_id_hash' => session_id_hash(),
        ]);

        return $stmt->rowCount();
    } catch (Throwable $_e) {
        return 0;
    }
}

function current_user_id(): ?int
{
    $id = $_SESSION['user_id'] ?? null;
    return is_numeric($id) ? (int)$id : null;
}

function require_auth(): int
{
    $userId = current_user_id();
    if (!$userId) {
        json_response(['ok' => false, 'error' => 'Unauthorized'], 401);
    }

    if (current_session_revoked($userId)) {
        $_SESSION = [];
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_destroy();
        }
        json_response(['ok' => false, 'error' => 'Session revoked. Please sign in again.'], 401);
    }

    touch_user_session($userId);

    return $userId;
}
