<?php

declare(strict_types=1);

function breach_monitor_enabled(): bool
{
    $config = app_config();
    return (bool)($config['breach_monitor_enabled'] ?? false);
}

function hibp_user_agent(): string
{
    $config = app_config();
    $agent = trim((string)($config['hibp_user_agent'] ?? 'VaultPass'));
    return $agent !== '' ? $agent : 'VaultPass';
}

function hibp_pwned_password_count(string $password): int
{
    $value = (string)$password;
    if ($value === '') {
        return 0;
    }

    $hash = strtoupper(sha1($value));
    $prefix = substr($hash, 0, 5);
    $suffix = substr($hash, 5);

    $url = "https://api.pwnedpasswords.com/range/{$prefix}";

    $headers = [
        'User-Agent: ' . hibp_user_agent(),
        'Accept: text/plain',
        'Add-Padding: true',
    ];

    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => implode("\r\n", $headers) . "\r\n",
            'timeout' => 6,
        ],
    ]);

    $body = @file_get_contents($url, false, $context);
    if ($body === false) {
        throw new RuntimeException('Unable to reach breach monitoring provider');
    }

    $lines = preg_split("/\r\n|\n|\r/", (string)$body);
    foreach ($lines as $line) {
        $line = trim((string)$line);
        if ($line === '' || !str_contains($line, ':')) {
            continue;
        }

        [$remoteSuffix, $count] = explode(':', $line, 2);
        if (strtoupper(trim($remoteSuffix)) !== $suffix) {
            continue;
        }

        return max(0, (int)trim($count));
    }

    return 0;
}

