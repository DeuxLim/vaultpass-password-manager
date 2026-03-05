<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');

if (!billing_enabled() || !billing_available()) {
    http_response_code(404);
    exit;
}

$secret = stripe_webhook_secret();
if ($secret === '') {
    http_response_code(500);
    exit;
}

$payload = file_get_contents('php://input');
if (!is_string($payload) || $payload === '') {
    http_response_code(400);
    exit;
}

$sigHeader = (string)($_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '');
if ($sigHeader === '') {
    http_response_code(400);
    exit;
}

$parts = [];
foreach (explode(',', $sigHeader) as $piece) {
    $kv = explode('=', trim($piece), 2);
    if (count($kv) === 2) {
        $parts[$kv[0]] = $kv[1];
    }
}

$timestamp = isset($parts['t']) ? (int)$parts['t'] : 0;
$sig = $parts['v1'] ?? '';
if ($timestamp <= 0 || $sig === '') {
    http_response_code(400);
    exit;
}

$signedPayload = $timestamp . '.' . $payload;
$expected = hash_hmac('sha256', $signedPayload, $secret);
if (!hash_equals($expected, $sig)) {
    http_response_code(400);
    exit;
}

$event = json_decode($payload, true);
if (!is_array($event)) {
    http_response_code(400);
    exit;
}

$type = (string)($event['type'] ?? '');
$data = $event['data']['object'] ?? null;
if (!is_array($data)) {
    http_response_code(200);
    exit;
}

try {
    if ($type === 'checkout.session.completed') {
        $metadata = $data['metadata'] ?? [];
        if (!is_array($metadata)) {
            $metadata = [];
        }
        $userId = (int)($metadata['user_id'] ?? 0);
        $plan = (string)($metadata['plan'] ?? 'free');
        $customerId = (string)($data['customer'] ?? '');
        $subscriptionId = (string)($data['subscription'] ?? '');
        if ($userId > 0 && $subscriptionId !== '') {
            $sub = stripe_api_request('GET', '/v1/subscriptions/' . rawurlencode($subscriptionId), []);
            $status = (string)($sub['status'] ?? 'active');
            $periodEnd = isset($sub['current_period_end']) ? (int)$sub['current_period_end'] : null;
            update_user_entitlement_from_stripe($userId, $plan, $status, $customerId, $subscriptionId, $periodEnd);
        }
    }

    if ($type === 'customer.subscription.updated' || $type === 'customer.subscription.deleted') {
        $subscriptionId = (string)($data['id'] ?? '');
        if ($subscriptionId !== '') {
            $status = (string)($data['status'] ?? ($type === 'customer.subscription.deleted' ? 'canceled' : 'active'));
            $periodEnd = isset($data['current_period_end']) ? (int)$data['current_period_end'] : null;
            update_entitlement_status_by_subscription_id($subscriptionId, $status, $periodEnd);
        }
    }
} catch (Throwable $e) {
    error_log('[vaultpass] billing webhook handler error: ' . $e->getMessage());
}

http_response_code(200);
echo 'ok';

