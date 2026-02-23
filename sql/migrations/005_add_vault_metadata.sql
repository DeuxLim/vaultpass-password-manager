USE vaultpass;

ALTER TABLE vault_items
  ADD COLUMN folder VARCHAR(120) NOT NULL DEFAULT '' AFTER site,
  ADD COLUMN tags_json JSON NULL AFTER folder,
  ADD COLUMN is_favorite TINYINT(1) NOT NULL DEFAULT 0 AFTER tags_json;

ALTER TABLE vault_item_versions
  ADD COLUMN folder VARCHAR(120) NOT NULL DEFAULT '' AFTER site,
  ADD COLUMN tags_json JSON NULL AFTER folder,
  ADD COLUMN is_favorite TINYINT(1) NOT NULL DEFAULT 0 AFTER tags_json;
