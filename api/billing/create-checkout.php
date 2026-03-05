<?php

declare(strict_types=1);

require __DIR__ . '/../bootstrap.php';

require_method('POST');
require_csrf();
$userId = require_auth();
$body = request_body();

if (!billing_enabled() || !billing_available()) {
    json_response([
        'ok' => false,
        'error' => 'Billing is not enabled',
        'error_code' => 'billing_disabled',
        'details' => [],
    ], 404);
}

$plan = strtolower(trim((string)($body['plan'] ?? '')));
if (!in_array($plan, ['plus', 'family'], true)) {
    json_response(['ok' => false, 'error' => 'Valid plan is required'], 422);
}

$priceId = stripe_price_id_for_plan($plan);
if ($priceId === '') {
    json_response(['ok' => false, 'error' => 'Stripe price not configured for plan'], 409);
}

$publicUrl = app_public_url();
$successUrl = $publicUrl . '/dashboard/dashboard.html?billing=success';
$cancelUrl = $publicUrl . '/dashboard/dashboard.html?billing=cancel';

$session = stripe_api_request('POST', '/v1/checkout/sessions', [
    'mode' => 'subscription',
    'success_url' => $successUrl,
    'cancel_url' => $cancelUrl,
    'line_items[0][price]' => $priceId,
    'line_items[0][quantity]' => 1,
    'metadata[user_id]' => (string)$userId,
    'metadata[plan]' => $plan,
]);

$url = (string)($session['url'] ?? '');
if ($url === '') {
    json_response(['ok' => false, 'error' => 'Stripe did not return checkout URL'], 500);
}

audit_log('billing.checkout_created', $userId, [
    'plan' => $plan,
    'checkout_session_id' => (string)($session['id'] ?? ''),
]);

json_response([
    'ok' => true,
    'checkout_url' => $url,
]);

