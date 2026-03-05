USE vaultpass;

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

