CREATE DATABASE IF NOT EXISTS vaultpass CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vaultpass;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  session_id_hash CHAR(64) NOT NULL UNIQUE,
  ip_address VARCHAR(45) NOT NULL,
  user_agent VARCHAR(500) NOT NULL,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_user_sessions_user (user_id),
  INDEX idx_user_sessions_last_activity (last_activity),
  INDEX idx_user_sessions_revoked_at (revoked_at),
  CONSTRAINT fk_user_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_two_factor (
  user_id INT UNSIGNED PRIMARY KEY,
  secret_enc TEXT NOT NULL,
  recovery_codes_json JSON NOT NULL,
  enabled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_two_factor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_key_material (
  user_id INT UNSIGNED PRIMARY KEY,
  encrypted_dek_blob TEXT NOT NULL,
  kdf_algorithm VARCHAR(40) NOT NULL DEFAULT 'PBKDF2',
  kdf_salt_b64 VARCHAR(255) NOT NULL,
  kdf_iterations INT UNSIGNED NOT NULL,
  key_version INT UNSIGNED NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_key_material_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vault_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  shared_vault_id BIGINT UNSIGNED NULL DEFAULT NULL,
  site VARCHAR(191) NOT NULL,
  item_type VARCHAR(20) NOT NULL DEFAULT 'login',
  folder VARCHAR(120) NOT NULL DEFAULT '',
  tags_json JSON NULL,
  is_favorite TINYINT(1) NOT NULL DEFAULT 0,
  username_enc TEXT NOT NULL,
  password_enc TEXT NOT NULL,
  notes_enc TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_vault_user (user_id),
  INDEX idx_vault_shared_vault (shared_vault_id),
  CONSTRAINT fk_vault_shared_vault FOREIGN KEY (shared_vault_id) REFERENCES shared_vaults(id) ON DELETE SET NULL,
  CONSTRAINT fk_vault_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vault_item_versions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  vault_item_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  site VARCHAR(191) NOT NULL,
  item_type VARCHAR(20) NOT NULL DEFAULT 'login',
  folder VARCHAR(120) NOT NULL DEFAULT '',
  tags_json JSON NULL,
  is_favorite TINYINT(1) NOT NULL DEFAULT 0,
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

CREATE TABLE IF NOT EXISTS emergency_access_grants (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_user_id INT UNSIGNED NOT NULL,
  grantee_user_id INT UNSIGNED NOT NULL,
  wait_period_hours INT UNSIGNED NOT NULL DEFAULT 24,
  is_enabled TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_emergency_grant (owner_user_id, grantee_user_id),
  INDEX idx_emergency_owner (owner_user_id),
  INDEX idx_emergency_grantee (grantee_user_id),
  CONSTRAINT fk_emergency_owner FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_emergency_grantee FOREIGN KEY (grantee_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS emergency_access_requests (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  grant_id BIGINT UNSIGNED NOT NULL,
  requester_user_id INT UNSIGNED NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  decided_at TIMESTAMP NULL DEFAULT NULL,
  decision_by_user_id INT UNSIGNED NULL,
  expires_at TIMESTAMP NULL DEFAULT NULL,
  INDEX idx_emergency_requests_grant (grant_id),
  INDEX idx_emergency_requests_requester (requester_user_id),
  INDEX idx_emergency_requests_status (status),
  CONSTRAINT fk_emergency_requests_grant FOREIGN KEY (grant_id) REFERENCES emergency_access_grants(id) ON DELETE CASCADE,
  CONSTRAINT fk_emergency_requests_requester FOREIGN KEY (requester_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_emergency_requests_decider FOREIGN KEY (decision_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

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

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  event_type VARCHAR(120) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent VARCHAR(500) NOT NULL,
  meta_json JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_event (event_type),
  INDEX idx_audit_created_at (created_at),
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NULL,
  event_name VARCHAR(120) NOT NULL,
  path VARCHAR(255) NOT NULL DEFAULT '',
  referrer VARCHAR(255) NOT NULL DEFAULT '',
  ip_address VARCHAR(45) NOT NULL,
  user_agent VARCHAR(255) NOT NULL DEFAULT '',
  props_json JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_analytics_user (user_id),
  INDEX idx_analytics_event (event_name),
  INDEX idx_analytics_created_at (created_at),
  CONSTRAINT fk_analytics_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
