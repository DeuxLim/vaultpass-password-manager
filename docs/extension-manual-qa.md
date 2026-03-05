# Extension Manual QA Guide (Sprint 12 Acceptance)

Status: Checklist / runbook
Owner: VaultPass core team

This checklist is the required manual step to close the Sprint 12 acceptance item in `ROADMAP.md`.

## 1) Setup (Chrome)

1. Open `chrome://extensions`
2. Enable “Developer mode”
3. “Load unpacked” → select the repo’s `extension/` directory
4. Ensure you are logged into VaultPass in a normal tab (same browser profile)

## 2) Fixtures Page

Use the local fixtures page to test predictable form patterns:
- Extension popup → “Open Fixtures” (shortcut)
- Or open: `public/pages/extension-fixtures.html` directly from a local dev server

Notes:
- Some flows need a real origin. Prefer running a local server (e.g. `php -S`) instead of opening files via `file://`.
- If you test on real sites, use non-production accounts.

## 3) Execute the Acceptance Matrix

Source of truth: `docs/extension-autofill-test-matrix.md`

For each case:
- Confirm the form is detected.
- Trigger autofill and verify fields populate correctly.
- Submit login forms and verify:
  - save prompt appears once (no duplicates),
  - save/update behavior is correct,
  - no repeated prompts after navigation or SPA re-render.

Record results:
- Pass/Fail
- Notes (site/form specifics)
- Screenshots for failures (include console logs where possible)

## 4) Regression Checks (Quick)

- Popup search works and remains responsive after multiple fills.
- Domain matching v1 behaves as expected across subdomains (where applicable).
- Unsupported tabs show a clear error message (no silent failures).

## 5) Exit Criteria (When You Can Mark ROADMAP ✅)

You can mark Sprint 12 acceptance as complete only when:
- Save + autofill works across the defined matrix (20 cases) with acceptable reliability.
- No critical data-loss or wrong-credential fill issues are observed.
- Known failures (if any) are documented with reproducible steps and triaged.

## 6) Optional: How to File Findings

When reporting a failure, include:
- Case ID from `docs/extension-autofill-test-matrix.md`
- Browser version + OS
- Steps to reproduce
- Expected vs actual
- Console logs (background + content script where relevant)

