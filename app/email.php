<?php

declare(strict_types=1);

function email_enabled(): bool
{
    $enabled = strtolower(trim((string)(getenv('EMAIL_ENABLED') ?: 'false')));
    return in_array($enabled, ['1', 'true', 'yes', 'y'], true);
}

function email_provider(): string
{
    return strtolower(trim((string)(getenv('EMAIL_PROVIDER') ?: 'resend')));
}

function app_public_url(): string
{
    $url = trim((string)(getenv('APP_PUBLIC_URL') ?: 'http://localhost:8000'));
    return rtrim($url, '/');
}

function email_from_address(): string
{
    return trim((string)(getenv('EMAIL_FROM') ?: 'no-reply@example.com'));
}

function email_from_name(): string
{
    return trim((string)(getenv('EMAIL_FROM_NAME') ?: 'VaultPass'));
}

function resend_api_key(): string
{
    return trim((string)(getenv('RESEND_API_KEY') ?: ''));
}

function send_email_best_effort(string $to, string $subject, string $html, string $text = ''): void
{
    if (!email_enabled()) {
        return;
    }

    try {
        $provider = email_provider();
        if ($provider === 'resend') {
            send_email_resend($to, $subject, $html, $text);
            return;
        }

        error_log('[vaultpass] email provider not supported: ' . $provider);
    } catch (Throwable $e) {
        error_log('[vaultpass] email send failed: ' . $e->getMessage());
    }
}

function send_email_resend(string $to, string $subject, string $html, string $text = ''): void
{
    $apiKey = resend_api_key();
    if ($apiKey === '') {
        throw new RuntimeException('RESEND_API_KEY missing');
    }

    $payload = [
        'from' => sprintf('%s <%s>', email_from_name(), email_from_address()),
        'to' => [$to],
        'subject' => $subject,
        'html' => $html,
    ];

    if ($text !== '') {
        $payload['text'] = $text;
    }

    $json = json_encode($payload);
    if (!is_string($json)) {
        throw new RuntimeException('Unable to encode email payload');
    }

    $ctx = stream_context_create([
        'http' => [
            'method' => 'POST',
            'timeout' => 10,
            'header' => implode("\r\n", [
                'Authorization: Bearer ' . $apiKey,
                'Content-Type: application/json',
                'Accept: application/json',
            ]),
            'content' => $json,
            'ignore_errors' => true,
        ],
    ]);

    $resp = @file_get_contents('https://api.resend.com/emails', false, $ctx);
    $status = 0;
    if (isset($http_response_header) && is_array($http_response_header)) {
        foreach ($http_response_header as $headerLine) {
            if (preg_match('/^HTTP\\/\\S+\\s+(\\d+)/', $headerLine, $m) === 1) {
                $status = (int)$m[1];
                break;
            }
        }
    }

    if (!is_string($resp)) {
        throw new RuntimeException('Resend request failed');
    }

    if ($status < 200 || $status >= 300) {
        throw new RuntimeException('Resend returned HTTP ' . $status . ': ' . $resp);
    }
}
