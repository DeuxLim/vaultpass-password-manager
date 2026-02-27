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

CREATE TABLE IF NOT EXISTS vault_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
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
