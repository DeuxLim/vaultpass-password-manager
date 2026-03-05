# Changelog

All notable changes to VaultPass are documented in this file.

Format:
- Keep entries under **Unreleased** until a release is tagged/deployed.
- Use SemVer-ish versions (`0.x.y` while pre-1.0).
- Group by: Added / Changed / Fixed / Security.

## Unreleased

### Added
- PWA offline UX improvements, opt-in encrypted offline snapshot cache, and push notification scaffolding.
- Optional breach monitoring (HIBP range checks).
- Identity/payment profile item types (structured) with copy-to-clipboard helpers.

### Changed
- Emergency access approval now enforces wait periods and active window semantics.

### Fixed
- Extension fixture coverage and autofill heuristics for multi-form and dynamic injection cases.

## 0.1.0 - Initial baseline

- Web MVP: auth, vault CRUD, CSRF, audit logs, import/export, 2FA, sessions, and PWA installability foundations.

