USE vaultpass;

CREATE TABLE IF NOT EXISTS vault_item_versions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  vault_item_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  site VARCHAR(191) NOT NULL,
  username_enc TEXT NOT NULL,
  password_enc TEXT NOT NULL,
  notes_enc TEXT NOT NULL,
  source VARCHAR(40) NOT NULL DEFAULT 'update',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_versions_item (vault_item_id),
  INDEX idx_versions_user (user_id),
  INDEX idx_versions_created_at (created_at),
  CONSTRAINT fk_versions_item FOREIGN KEY (vault_item_id) REFERENCES vault_items(id) ON DELETE CASCADE,
  CONSTRAINT fk_versions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
