<?php

declare(strict_types=1);

function normalize_item_type(mixed $value): string
{
    $raw = strtolower(trim((string)$value));
    if (in_array($raw, ['login', 'secure_note', 'identity', 'payment_card'], true)) {
        return $raw;
    }
    return 'login';
}

function normalize_email_input(mixed $value): string
{
    return strtolower(trim((string)$value));
}

function is_valid_email_format(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function is_valid_password_length(string $password, int $minLength = 8): bool
{
    return strlen($password) >= $minLength;
}

function normalize_name_input(mixed $value): string
{
    return trim((string)$value);
}

function is_valid_totp_code_format(string $token): bool
{
    return (bool)preg_match('/^\d{6}$/', trim($token));
}

function normalize_tags_input(mixed $tagsInput, int $maxTags = 20, int $maxTagLength = 40): array
{
    if (!is_array($tagsInput)) {
        return [];
    }

    $normalizedTags = [];
    foreach ($tagsInput as $tag) {
        if (!is_string($tag)) {
            continue;
        }

        $value = trim($tag);
        if ($value === '') {
            continue;
        }

        $value = mb_substr($value, 0, $maxTagLength);
        $normalizedTags[$value] = true;

        if (count($normalizedTags) >= $maxTags) {
            break;
        }
    }

    return array_keys($normalizedTags);
}

function normalize_is_favorite_input(mixed $value): bool
{
    if (is_bool($value)) {
        return $value;
    }

    if (is_int($value) || is_float($value)) {
        return (int)$value === 1;
    }

    $raw = strtolower(trim((string)$value));
    return in_array($raw, ['1', 'true', 'yes', 'y'], true);
}

function normalize_vault_item_payload(array $input): array
{
    $sharedVaultId = (int)($input['shared_vault_id'] ?? 0);
    if ($sharedVaultId < 0) {
        $sharedVaultId = 0;
    }

    return [
        'site' => mb_substr(trim((string)($input['site'] ?? '')), 0, 191),
        'item_type' => normalize_item_type($input['item_type'] ?? 'login'),
        'username' => trim((string)($input['username'] ?? '')),
        'password' => (string)($input['password'] ?? ''),
        'notes' => trim((string)($input['notes'] ?? '')),
        'folder' => mb_substr(trim((string)($input['folder'] ?? '')), 0, 120),
        'is_favorite' => normalize_is_favorite_input($input['is_favorite'] ?? 0),
        'tags' => normalize_tags_input($input['tags'] ?? []),
        'shared_vault_id' => $sharedVaultId,
    ];
}

function validate_vault_item_payload(array $item): ?string
{
    $site = trim((string)($item['site'] ?? ''));
    $itemType = normalize_item_type($item['item_type'] ?? 'login');
    $username = trim((string)($item['username'] ?? ''));
    $password = (string)($item['password'] ?? '');
    $notes = trim((string)($item['notes'] ?? ''));

    if ($site === '') {
        return 'Site is required';
    }

    if ($itemType === 'login' && ($username === '' || $password === '')) {
        return 'Site, username, and password are required';
    }

    if ($itemType === 'secure_note' && $notes === '') {
        return 'Secure note content is required';
    }

    if (in_array($itemType, ['identity', 'payment_card'], true) && $notes === '') {
        return 'Profile details are required';
    }

    return null;
}

function normalize_shared_vault_name_input(mixed $value): string
{
    return mb_substr(trim((string)$value), 0, 120);
}

function validate_shared_vault_name(string $name): ?string
{
    if ($name === '') {
        return 'Shared vault name is required';
    }

    return null;
}

function normalize_shared_vault_role(mixed $value): string
{
    $role = strtolower(trim((string)$value));
    return in_array($role, ['owner', 'editor', 'viewer'], true) ? $role : 'viewer';
}
