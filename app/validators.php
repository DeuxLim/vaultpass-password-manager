<?php

declare(strict_types=1);

function normalize_item_type(mixed $value): string
{
    $raw = strtolower(trim((string)$value));
    return $raw === 'secure_note' ? 'secure_note' : 'login';
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
