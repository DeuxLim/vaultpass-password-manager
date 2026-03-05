<?php

declare(strict_types=1);

function billing_enabled(): bool
{
    $enabled = strtolower(trim((string)(getenv('BILLING_ENABLED') ?: 'false')));
    return in_array($enabled, ['1', 'true', 'yes', 'y'], true);
}

function billing_available(): bool
{
    return db_table_exists('user_entitlements');
}

function stripe_secret_key(): string
{
    return trim((string)(getenv('STRIPE_SECRET_KEY') ?: ''));
}

function stripe_webhook_secret(): string
{
    return trim((string)(getenv('STRIPE_WEBHOOK_SECRET') ?: ''));
}

function stripe_price_id_for_plan(string $plan): string
{
    $plan = strtolower(trim($plan));
    if ($plan === 'plus') {
        return trim((string)(getenv('STRIPE_PRICE_ID_PLUS') ?: ''));
    }
    if ($plan === 'family') {
        return trim((string)(getenv('STRIPE_PRICE_ID_FAMILY') ?: ''));
    }
    return '';
}

function ensure_user_entitlement_row(int $userId): void
{
    if (!billing_available()) {
        return;
    }

    $pdo = db();
    $stmt = $pdo->prepare(
        'INSERT INTO user_entitlements (user_id, plan, status, provider)
         VALUES (:user_id, :plan, :status, :provider)
         ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)'
    );
    $stmt->execute([
        'user_id' => $userId,
        'plan' => 'free',
        'status' => 'active',
        'provider' => 'stripe',
    ]);
}

function user_entitlement(int $userId): array
{
    if (!billing_available()) {
        return [
            'plan' => 'free',
            'status' => 'active',
            'provider' => '',
            'current_period_end' => null,
        ];
    }

    ensure_user_entitlement_row($userId);
    $pdo = db();
    $stmt = $pdo->prepare(
        'SELECT plan, status, provider, current_period_end
         FROM user_entitlements
         WHERE user_id = :user_id
         LIMIT 1'
    );
    $stmt->execute(['user_id' => $userId]);
    $row = $stmt->fetch();
    if (!$row) {
        return [
            'plan' => 'free',
            'status' => 'active',
            'provider' => '',
            'current_period_end' => null,
        ];
    }

    return [
        'plan' => (string)($row['plan'] ?? 'free'),
        'status' => (string)($row['status'] ?? 'active'),
        'provider' => (string)($row['provider'] ?? ''),
        'current_period_end' => $row['current_period_end'] ?? null,
    ];
}

function update_user_entitlement_from_stripe(int $userId, string $plan, string $status, string $customerId, string $subscriptionId, ?int $periodEndUnix): void
{
    if (!billing_available()) {
        return;
    }

    $plan = strtolower(trim($plan));
    if (!in_array($plan, ['free', 'plus', 'family'], true)) {
        $plan = 'free';
    }

    $status = strtolower(trim($status));
    if ($status === '') {
        $status = 'active';
    }

    $periodEnd = null;
    if (is_int($periodEndUnix) && $periodEndUnix > 0) {
        $periodEnd = gmdate('Y-m-d H:i:s', $periodEndUnix);
    }

    $pdo = db();
    $stmt = $pdo->prepare(
        'INSERT INTO user_entitlements (user_id, plan, status, provider, provider_customer_id, provider_subscription_id, current_period_end)
         VALUES (:user_id, :plan, :status, :provider, :customer_id, :subscription_id, :current_period_end)
         ON DUPLICATE KEY UPDATE
           plan = VALUES(plan),
           status = VALUES(status),
           provider = VALUES(provider),
           provider_customer_id = VALUES(provider_customer_id),
           provider_subscription_id = VALUES(provider_subscription_id),
           current_period_end = VALUES(current_period_end),
           updated_at = CURRENT_TIMESTAMP'
    );
    $stmt->execute([
        'user_id' => $userId,
        'plan' => $plan,
        'status' => $status,
        'provider' => 'stripe',
        'customer_id' => substr($customerId, 0, 120),
        'subscription_id' => substr($subscriptionId, 0, 120),
        'current_period_end' => $periodEnd,
    ]);
}

function find_user_id_by_stripe_subscription_id(string $subscriptionId): ?int
{
    if (!billing_available()) {
        return null;
    }

    $subscriptionId = trim($subscriptionId);
    if ($subscriptionId === '') {
        return null;
    }

    $pdo = db();
    $stmt = $pdo->prepare(
        'SELECT user_id
         FROM user_entitlements
         WHERE provider_subscription_id = :sub_id
         LIMIT 1'
    );
    $stmt->execute(['sub_id' => substr($subscriptionId, 0, 120)]);
    $userId = $stmt->fetchColumn();
    if (!is_numeric($userId)) {
        return null;
    }
    return (int)$userId;
}

function update_entitlement_status_by_subscription_id(string $subscriptionId, string $status, ?int $periodEndUnix = null): void
{
    if (!billing_available()) {
        return;
    }

    $subscriptionId = trim($subscriptionId);
    if ($subscriptionId === '') {
        return;
    }

    $periodEnd = null;
    if (is_int($periodEndUnix) && $periodEndUnix > 0) {
        $periodEnd = gmdate('Y-m-d H:i:s', $periodEndUnix);
    }

    $pdo = db();
    $stmt = $pdo->prepare(
        'UPDATE user_entitlements
         SET status = :status,
             current_period_end = COALESCE(:current_period_end, current_period_end),
             updated_at = CURRENT_TIMESTAMP
         WHERE provider_subscription_id = :sub_id'
    );
    $stmt->execute([
        'status' => strtolower(trim($status)) ?: 'active',
        'current_period_end' => $periodEnd,
        'sub_id' => substr($subscriptionId, 0, 120),
    ]);
}

function stripe_api_request(string $method, string $path, array $params): array
{
    $secret = stripe_secret_key();
    if ($secret === '') {
        throw new RuntimeException('STRIPE_SECRET_KEY missing');
    }

    $body = http_build_query($params);
    $ctx = stream_context_create([
        'http' => [
            'method' => strtoupper($method),
            'timeout' => 10,
            'header' => implode("\r\n", [
                'Authorization: Bearer ' . $secret,
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
            ]),
            'content' => $body,
            'ignore_errors' => true,
        ],
    ]);

    $url = 'https://api.stripe.com' . $path;
    $resp = @file_get_contents($url, false, $ctx);
    if (!is_string($resp)) {
        throw new RuntimeException('Stripe request failed');
    }

    $status = 0;
    if (isset($http_response_header) && is_array($http_response_header)) {
        foreach ($http_response_header as $headerLine) {
            if (preg_match('/^HTTP\\/\\S+\\s+(\\d+)/', $headerLine, $m) === 1) {
                $status = (int)$m[1];
                break;
            }
        }
    }

    $decoded = json_decode($resp, true);
    if (!is_array($decoded)) {
        $decoded = ['raw' => $resp];
    }

    if ($status < 200 || $status >= 300) {
        throw new RuntimeException('Stripe returned HTTP ' . $status);
    }

    return $decoded;
}
