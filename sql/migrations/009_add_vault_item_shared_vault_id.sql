USE vaultpass;

ALTER TABLE vault_items
  ADD COLUMN shared_vault_id BIGINT UNSIGNED NULL DEFAULT NULL AFTER user_id,
  ADD INDEX idx_vault_shared_vault (shared_vault_id),
  ADD CONSTRAINT fk_vault_shared_vault FOREIGN KEY (shared_vault_id) REFERENCES shared_vaults(id) ON DELETE SET NULL;
