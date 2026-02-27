USE vaultpass;

CREATE TABLE IF NOT EXISTS shared_vaults (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_user_id INT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_shared_vaults_owner (owner_user_id),
  CONSTRAINT fk_shared_vaults_owner FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shared_vault_members (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  shared_vault_id BIGINT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'viewer',
  invitation_status VARCHAR(20) NOT NULL DEFAULT 'accepted',
  invited_by_user_id INT UNSIGNED NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_shared_vault_member (shared_vault_id, user_id),
  INDEX idx_shared_vault_members_user (user_id),
  INDEX idx_shared_vault_members_status (invitation_status),
  CONSTRAINT fk_shared_vault_members_vault FOREIGN KEY (shared_vault_id) REFERENCES shared_vaults(id) ON DELETE CASCADE,
  CONSTRAINT fk_shared_vault_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_shared_vault_members_inviter FOREIGN KEY (invited_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);
