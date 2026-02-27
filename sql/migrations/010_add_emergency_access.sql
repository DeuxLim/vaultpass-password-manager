USE vaultpass;

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
