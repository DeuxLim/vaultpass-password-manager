# VaultPass Product Roadmap

Last updated: 2026-02-23
Owner: VaultPass core team
Status: Active working plan

## 1. Vision
VaultPass will evolve from a web MVP into a RoboForm-class password manager with:
- secure credential storage
- excellent autofill/generation experience
- browser extension support
- polished mobile-friendly UX
- trust-focused security posture

## 2. Product Goals
1. Build a reliable, secure core before adding advanced features.
2. Deliver a premium, minimal UI/UX across desktop and mobile.
3. Ship browser extension MVP early enough to validate autofill workflow.
4. Move toward zero-knowledge architecture as a strategic security milestone.
5. Reach launch readiness with support, billing, and operational maturity.

## 3. Guiding Principles
- Security-first: no convenience feature should weaken core protections.
- Scope discipline: each phase has clear done criteria.
- Mobile-first responsive design on every feature.
- API-first architecture so web app and extension reuse the same backend.
- Observability and reliability matter as much as feature velocity.

## 4. Current Baseline (as of this update)
- Vanilla stack in place: PHP + MySQL + HTML/CSS/JS.
- Public/private directory split completed (`public/` web root).
- Core auth + vault CRUD endpoints implemented.
- CSRF protection + auth rate limiting implemented.
- Audit logging implemented for auth and vault mutations.
- Vault item version history + restore flow implemented (web dashboard + API).
- Landing/login/dashboard visual redesign in progress.
- Not yet complete: extension codebase, advanced security controls (2FA/session UI).

---

## 5. Phase Plan

Status marker:
- `✅` done
- `⬜` pending

### Phase 1: Foundation Hardening (Web Core)
Objective: Stabilize and secure the current MVP architecture.

Scope:
- ✅ CSRF token flow for all mutating requests.
- ✅ Session hardening (secure cookie settings, timeout policy, rotation policy).
- ✅ Rate limiting for auth endpoints.
- ⬜ Input validation normalization and centralized error contracts.
- ✅ Shared frontend API utility and request error handling standards.
- ⬜ Baseline automated checks (lint/static checks + smoke test script).

Mobile requirements:
- ✅ Fully responsive login + dashboard.
- ✅ Touch targets >= 44px.
- ✅ Table usability fallback on narrow screens.

Exit criteria:
- ✅ All mutating endpoints protected by CSRF.
- ✅ Auth endpoints rate-limited.
- ✅ Mobile QA pass on key views (320/375/768 widths).
- ⬜ No critical security findings in internal checklist.

---

### Phase 2: Password Manager Essentials
Objective: Reach daily-use viability for solo users.

Scope:
- ⬜ Password generator with policy options.
- ⬜ Strength meter for stored/generated passwords.
- ✅ Vault item history/versioning and restore.
- ⬜ Secure notes item type.
- ⬜ Favorites and foldering/tags.
- ⬜ Search enhancements (site, username, tags, notes).
- ⬜ Import/export:
  - CSV import (common manager formats)
  - encrypted backup export/import

Mobile requirements:
- Card/list view alternative to dense tables.
- Modal -> bottom sheet pattern on mobile.
- Sticky key actions (Add, Search) in thumb-friendly zones.

Exit criteria:
- ⬜ Users can generate/store/manage credentials end-to-end.
- ✅ Users can restore previous versions of an edited vault item.
- ⬜ Import/export roundtrip tested.
- ⬜ Mobile flows complete without desktop dependency.

---

### Phase 3: Browser Extension MVP (Chrome)
Objective: Ship first extension with credential save/fill loop.

Scope:
- Manifest V3 extension scaffold.
- Popup vault UI with search + quick copy.
- Content script form detection + autofill.
- Save/update prompt when login forms submit.
- Password generator within extension popup.
- Session integration with existing web auth.

Technical targets:
- Shared API client module between web and extension where possible.
- Domain matching v1: eTLD+1 + subdomain handling.

Exit criteria:
- Install extension in Chrome dev mode.
- Save + autofill works on top 20 test sites/forms.
- Critical flows documented and reproducible.

---

### Phase 4: Extension Maturity + Cross-Browser
Objective: Improve autofill reliability and expand browser support.

Scope:
- Autofill heuristic improvements for dynamic forms.
- Inline in-page suggestion UI.
- Firefox + Edge compatibility layer.
- Keyboard shortcuts and context menu actions.
- Better conflict handling (multiple credentials per site).

Exit criteria:
- Cross-browser build available.
- Autofill pass rate target >= 90% on internal test corpus.

---

### Phase 5: Security & Trust Upgrade
Objective: Elevate security posture to market-competitive standards.

Scope:
- Zero-knowledge migration plan and implementation steps.
- Optional TOTP 2FA (enroll, verify, recovery codes, disable flow).
- Device/session management UI with remote logout of other sessions.
- Security events and login alerting.
- Security review checklist aligned to OWASP ASVS subset.

Exit criteria:
- Client-side encryption key flow defined and implemented for new vault records.
- 2FA available for user accounts.
- Users can view active sessions and revoke any session except current one.
- Security checklist completed and signed off.

---

### Phase 6: Competitive Features (RoboForm-Class)
Objective: Add collaboration and power-user capabilities.

Scope:
- Shared vaults (family/team), invitations, permissions.
- Emergency access workflow.
- Password health dashboard (weak/reused/old).
- Breach monitoring integration (optional external API).
- Identity and payment profile autofill.
- Passkeys/WebAuthn support roadmap kickoff.

Exit criteria:
- Team/family sharing flow fully functional.
- Health dashboard actionable with remediation suggestions.

---

### Phase 7: Mobile Product Expansion
Objective: Deliver premium mobile usage experience.

Scope:
- Progressive Web App enhancements.
- Offline-friendly encrypted cache strategy.
- Push notifications for security events (if infra supports it).
- Native wrapper feasibility (future autofill API support).

Exit criteria:
- PWA install and core flows validated on iOS/Android browsers.
- Mobile performance and accessibility targets met.

---

### Phase 8: Launch Readiness & Growth
Objective: Commercial readiness and operational maturity.

Scope:
- Pricing tiers and billing integration.
- Onboarding, email lifecycle, support workflows.
- Product analytics (privacy-preserving).
- Incident response runbooks and backups.
- Release management and changelog discipline.

Exit criteria:
- Launch checklist complete.
- Support and reliability SLAs defined.

---

## 6. Sprint Roadmap (Detailed, 2-week sprints)

### Sprint 1
Theme: Security baseline + architecture hygiene
Tasks:
- ✅ Implement CSRF token generation endpoint + validation middleware.
- ✅ Add rate limiter for `/api/auth/login.php` and `/api/auth/register.php`.
- ⬜ Centralize API error response schema.
- ✅ Add session expiration strategy and regenerate on privilege changes.
- ⬜ Add `docs/security-checklist.md` initial draft.
Acceptance:
- ✅ CSRF validated on create/update/delete/logout/register/login.
- ✅ Repeated failed login attempts throttle as expected.

### Sprint 2
Theme: Dashboard UX robustness
Tasks:
- ✅ Mobile card view for vault entries.
- ✅ Inline validation and form state messages.
- ✅ Better empty states and success toasts.
- ✅ Accessibility pass: keyboard nav + focus rings + ARIA labels.
Acceptance:
- ✅ Dashboard usable at 375px width without horizontal scroll.
- ✅ Keyboard-only path works for add/edit/delete.

### Sprint 3
Theme: Generator + health primitives
Tasks:
- Password generator UI component and API/storage integration.
- Strength scoring utility.
- Add "Generate and save" flow in modal.
Acceptance:
- Generated passwords can be saved in one flow.
- Strength shown for generated and stored items.

### Sprint 4
Theme: Import/export and backup
Tasks:
- CSV import parser and mapping UI.
- Encrypted export format v1.
- Import validation/error reporting.
Acceptance:
- Successful export/import roundtrip on test fixtures.

### Sprint 5
Theme: Extension scaffold
Tasks:
- Setup extension repo/folder (`extension/`).
- MV3 manifest + popup shell.
- Auth/session handshake with backend.
Acceptance:
- Extension popup can list vault entries for logged-in user.

### Sprint 6
Theme: Extension fill/save loop
Tasks:
- Content script form detection and autofill.
- Save prompt after login submission.
- Domain matching v1.
Acceptance:
- Save + autofill works on defined test matrix.

### Sprint 7+
Continue with Phase 4 onward (cross-browser, security upgrade, sharing, launch work).

### Sprint 7
Theme: Vault history + restore
Tasks:
- ✅ Add `vault_item_versions` schema and write-on-update strategy.
- ✅ Build history API (`list versions`, `restore version`) with audit events.
- ✅ Add history drawer/modal in dashboard item details.
Acceptance:
- ✅ A user can view prior versions and restore one with confirmation.
- ✅ Restore action is logged and visible in audit trail.

### Sprint 8
Theme: Account security controls
Tasks:
- Add TOTP 2FA setup/verification/recovery-code flows.
- Add active session list API and UI.
- Add remote logout endpoint for selected session(s).
Acceptance:
- 2FA-protected login works end-to-end.
- User can revoke other sessions from account security settings.

---

## 7. Technical Architecture Targets

Backend target structure:
- `app/`
  - `http/`
  - `auth/`
  - `security/`
  - `vault/`
  - `db/`
- `api/` (thin controllers)
- `public/` (only public assets)
- `config/`
- `sql/`
- `tests/`

Frontend target structure:
- `public/script/`
  - `api.js`
  - `auth/`
  - `dashboard/`
  - `components/`
  - `utils/`
- `public/styles/`
  - `tokens.css`
  - `base.css`
  - `components/`
  - `pages/`

Extension target structure:
- `extension/`
  - `manifest.json`
  - `popup/`
  - `content/`
  - `background/`
  - `shared/`

---

## 8. Mobile UX Standards Checklist
Every phase must validate:
- Breakpoints: 320, 375, 768, 1024.
- Touch targets >= 44x44.
- Avoid fixed pixel heights on critical containers.
- No horizontal scrolling on primary screens.
- Form fields and CTAs usable one-handed.
- Contrast and readability checks pass.

---

## 9. Browser Extension Milestones
1. MVP Chrome extension (save/fill/generate).
2. Stabilize heuristic autofill.
3. Multi-account support in popup.
4. Edge + Firefox support.
5. Store packaging and compliance review.

---

## 10. Risk Register
- Security risk: server-side plaintext exposure during processing.
  Mitigation: plan zero-knowledge migration in Phase 5.
- UX risk: desktop-centric table UI harms mobile adoption.
  Mitigation: mobile card view by Sprint 2.
- Autofill complexity risk across websites.
  Mitigation: explicit test matrix + heuristic iteration loop.
- Scope creep risk.
  Mitigation: strict phase exit criteria and backlog triage.

---

## 11. Working Cadence
- Planning review: weekly.
- Sprint review/demo: biweekly.
- Security review checkpoint: once per phase.
- This file is the source of truth for product phases.
