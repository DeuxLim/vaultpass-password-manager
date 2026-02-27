<?php

declare(strict_types=1);

function shared_vaults_available(): bool
{
    return db_table_exists('shared_vaults') && db_table_exists('shared_vault_members');
}

function find_shared_vault_membership(int $vaultId, int $userId, bool $acceptedOnly = true): ?array
{
    $pdo = db();
    $sql = 'SELECT id, shared_vault_id, user_id, role, invitation_status
            FROM shared_vault_members
            WHERE shared_vault_id = :shared_vault_id
              AND user_id = :user_id';
    if ($acceptedOnly) {
        $sql .= ' AND invitation_status = \'accepted\'';
    }
    $sql .= ' LIMIT 1';

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'shared_vault_id' => $vaultId,
        'user_id' => $userId,
    ]);

    $row = $stmt->fetch();
    return is_array($row) ? $row : null;
}

function shared_vault_user_role(int $vaultId, int $userId): ?string
{
    $membership = find_shared_vault_membership($vaultId, $userId, true);
    if (!$membership) {
        return null;
    }

    return (string)($membership['role'] ?? '');
}

function shared_vault_can_write(int $vaultId, int $userId): bool
{
    $role = shared_vault_user_role($vaultId, $userId);
    return in_array($role, ['owner', 'editor'], true);
}

function shared_vault_can_invite_role(string $actorRole, string $targetRole): bool
{
    $actor = strtolower(trim($actorRole));
    $target = strtolower(trim($targetRole));

    if (!in_array($target, ['viewer', 'editor'], true)) {
        return false;
    }

    if ($actor === 'owner') {
        return true;
    }

    if ($actor === 'editor') {
        return $target === 'viewer';
    }

    return false;
}
