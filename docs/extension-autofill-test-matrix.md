# Extension Autofill Test Matrix (Sprint 12)

Purpose: validate Sprint 12 acceptance criteria for extension save + autofill.

## Preconditions

1. VaultPass app running at `http://localhost:8000`.
2. Extension loaded from `extension/` in Chrome dev mode.
3. Extension popup connected to the same backend URL.
4. Signed in through extension `Open Login` flow.
5. At least one credential exists for `localhost`.
6. Extension reloaded after updates (`chrome://extensions` -> `Reload`).

## Test Fixture Page

Use:

`http://localhost:8000/pages/extension-fixtures.html`

## Matrix (20 Cases)

| ID | Scenario | Expected Result |
|---|---|---|
| 1 | Basic email + password form | Autofill prompt appears, fills both fields |
| 2 | Text username + password | Autofill works |
| 3 | Username with `autocomplete="username"` | Autofill works |
| 4 | Password with `autocomplete="current-password"` | Autofill works |
| 5 | Nested inputs in wrappers | Autofill works |
| 6 | Form with hidden CSRF input | Hidden field ignored, autofill works |
| 7 | Extra OTP field present | Username/password filled; OTP unchanged |
| 8 | Two forms on one page | Correct target form can be filled |
| 9 | Unusual input names (`account_id`) | Autofill still maps username/password |
| 10 | Readonly decoy input + editable login input | Editable login fields filled |
| 11 | Dynamic form injected after load | Autofill prompt still appears and fills |
| 12 | Subdomain simulation label (`app.localhost`) | Domain match still returns localhost creds |
| 13 | Popup manual Fill action | Active tab receives fill and updates fields |
| 13a | Popup Fill when receiver missing | Extension injects content script and retries successfully |
| 14 | Submit populated form for existing credential | Save confirm prompt appears; confirming updates existing vault entry |
| 15 | Submit populated form for new username | Save confirm prompt appears; confirming creates new entry or updates match; rapid duplicate submits are deduped |
| 16 | Submit with empty username | No save call performed |
| 17 | Submit with empty password | No save call performed |
| 18 | Reload page after save | Prompt still appears with credentials |
| 19 | Dismiss prompt then refresh | Prompt can be shown again |
| 20 | Multiple matching credentials | Prompt dropdown lists multiple entries |

## Execution Log Template

Copy this section per test run and mark outcomes.

Date:
Tester:
Extension version:
Backend URL:

- [ ] 1
- [ ] 2
- [ ] 3
- [ ] 4
- [ ] 5
- [ ] 6
- [ ] 7
- [ ] 8
- [ ] 9
- [ ] 10
- [ ] 11
- [ ] 12
- [ ] 13
- [ ] 14
- [ ] 15
- [ ] 16
- [ ] 17
- [ ] 18
- [ ] 19
- [ ] 20

Notes:

Implementation note:
- For pages with multiple login forms, extension fill prioritizes the currently focused/last-interacted form.
- Save prompt deduplication: repeated/near-simultaneous submit events for the same form payload are collapsed into a single confirm/save attempt.
- Background save API deduplication: repeated identical save messages inside a short window are ignored server-call side.
- Fixture support: Case 15 includes a `Submit Twice Quickly` helper button for dedupe-path checks.
