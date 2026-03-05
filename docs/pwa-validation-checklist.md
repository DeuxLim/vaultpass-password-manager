# PWA Validation Checklist (iOS / Android)

Status: Checklist (Phase 5 exit-criteria support)
Owner: VaultPass core team

This project cannot claim Phase 5 “validated on iOS/Android” without executing these checks on real devices/browsers.

## 1) Devices / Browsers to Cover (Minimum)

iOS:
- Safari (primary)
- Chrome (WebKit wrapper; still worth sanity check)

Android:
- Chrome (primary)
- Firefox (secondary)

## 2) Install / Launch

- Add to Home Screen / Install succeeds.
- Launch from home screen opens in standalone/app mode where applicable.
- App icon + name correct.
- No unexpected URL bar overlays primary UI.

## 3) Auth + Session

- Register + login works.
- Logout works and clears sensitive UI.
- Session expiry behaves as expected (idle timeout / re-login).
- 2FA flows (if enabled): enroll, challenge, recovery codes.

## 4) Vault Core Flows

- List items loads quickly and scroll is smooth.
- Add item (login/secure note/identity/payment card) works end-to-end.
- Edit item, confirm history/versioning is recorded.
- Delete item works with confirmation.
- Search + filters work.
- Copy actions work (username/password/notes/identity/payment “Copy Details”).

## 5) Offline Boundaries (Sensitive UX)

With airplane mode / no network:
- Offline banner appears and is readable.
- App remains usable for non-sensitive UI states (no infinite spinners).
- If the encrypted offline snapshot feature is enabled:
  - Only client-encrypted items are accessible offline.
  - Snapshot can be cleared locally.
  - Lock/unlock boundaries behave correctly (no surprise plaintext persistence).
- If the encrypted offline snapshot feature is disabled:
  - Vault content is not displayed offline.
  - UI clearly indicates why (and how to enable, if desired).

## 6) PWA Caching / Updates

- After first load, reload while offline uses cached shell successfully.
- Service worker update does not break the app (existing sessions handled safely).
- Cached assets do not grow unbounded (check storage size over time).

## 7) Performance + Accessibility Targets

Performance (repeat on “cold” and “warm” loads):
- Dashboard time-to-interactive acceptable on mid-range phone.
- No major scroll jank in vault list.

Accessibility:
- Visible focus indicators with keyboard (where supported).
- Buttons and form labels are announced properly by screen readers.
- Contrast meets baseline (WCAG AA where feasible).

Recommended tools:
- Lighthouse (mobile)
- WebPageTest (optional)
- Manual VoiceOver (iOS) / TalkBack (Android) pass on core flows

## 8) Results Log (Fill In)

Date:
Tester:
Devices:

Notes / bugs:
- 

Sign-off:
- [ ] Phase 5 “mobile validation” exit criteria met

