USE vaultpass;

ALTER TABLE vault_items
  ADD COLUMN item_type VARCHAR(20) NOT NULL DEFAULT 'login' AFTER site;

ALTER TABLE vault_item_versions
  ADD COLUMN item_type VARCHAR(20) NOT NULL DEFAULT 'login' AFTER site;
