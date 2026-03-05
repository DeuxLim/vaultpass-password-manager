USE vaultpass;

CREATE TABLE IF NOT EXISTS user_push_subscriptions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  endpoint TEXT NOT NULL,
  endpoint_hash CHAR(40) NOT NULL,
  keys_json JSON NULL,
  user_agent VARCHAR(255) NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP NULL DEFAULT NULL,
  UNIQUE KEY uniq_push_endpoint_hash (endpoint_hash),
  INDEX idx_push_user (user_id),
  CONSTRAINT fk_push_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

