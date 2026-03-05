USE vaultpass;

CREATE TABLE IF NOT EXISTS user_entitlements (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  plan VARCHAR(32) NOT NULL DEFAULT 'free',
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  provider VARCHAR(32) NOT NULL DEFAULT 'stripe',
  provider_customer_id VARCHAR(120) NOT NULL DEFAULT '',
  provider_subscription_id VARCHAR(120) NOT NULL DEFAULT '',
  current_period_end TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_entitlement_user (user_id),
  INDEX idx_entitlement_plan (plan),
  CONSTRAINT fk_entitlement_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

