USE vaultpass;

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
