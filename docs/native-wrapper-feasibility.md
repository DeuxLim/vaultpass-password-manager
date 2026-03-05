# Native Wrapper Feasibility (Mobile Autofill Track)

Status: Feasibility summary (Phase 5 scope)
Owner: VaultPass core team

## Why a Native Wrapper?

VaultPass is currently a web app / PWA. That’s a strong baseline for:
- installability (home screen)
- offline UX (within defined boundaries)
- a consistent UI across platforms

However, “true” system-level autofill (like 1Password/Bitwarden) requires native OS hooks that PWAs cannot access.

## What “Native Autofill” Means

### iOS
- Implement an **AutoFill Credential Provider Extension** (AuthenticationServices).
- The extension can surface credentials to Safari / apps via the system AutoFill UI.
- Requires an iOS app target + extension target, entitlements, and strict App Store review compliance.

### Android
- Implement an **AutofillService**.
- The service provides datasets (username/password) to apps that request autofill.
- Requires an Android app with a foreground unlock UX and careful lifecycle handling.

## Wrapper Options (High-Level)

### Option A: Capacitor (recommended for feasibility)
Pros:
- Uses a WebView wrapper around the existing web UI with minimal rewrite.
- Supports native plugins for secure storage, biometrics, file system, etc.
- Maintains a single UI codepath (web) while enabling native modules.

Cons:
- Still requires native work for iOS extension + Android AutofillService.
- WebView security hardening and deep-link/session handling add complexity.

### Option B: Cordova
Pros:
- Similar to Capacitor; mature ecosystem.

Cons:
- Generally less modern DX than Capacitor; plugin ecosystem quality varies.

### Option C: React Native / Flutter rewrite
Pros:
- Best long-term native UX potential.

Cons:
- Large rewrite; higher maintenance; delays autofill shipping.

### Option D: Android TWA (Trusted Web Activity)
Pros:
- Near-zero wrapper work on Android for a PWA-like experience.

Cons:
- Does **not** solve autofill needs (AutofillService still required).
- iOS has no equivalent.

## Security Model Constraints (Non-Negotiables)

1. **Zero-knowledge posture must not regress.**
   - Any offline or at-rest vault snapshot must remain encrypted with user-controlled keys.
2. **Do not persist plaintext credentials at rest.**
   - OS autofill APIs need plaintext at the moment of filling; this must be unlocked and held only transiently in memory.
3. **Require explicit user presence for unlock.**
   - Biometric / device PIN unlock gating before autofill dataset exposure.
4. **Least privilege and strict auditability.**
   - Log “autofill unlock” and “autofill provided” events locally (and optionally server-side as metadata), without leaking secrets.

## Practical Architecture Proposal (v0 → v1)

### v0: “Wrapper-only” app (no native autofill yet)
Goal: validate packaging and secure session handling.
- Capacitor app wraps the existing VaultPass UI.
- Add native secure storage for:
  - session tokens (if used)
  - device binding identifier (optional)
- Add biometric gate to open the app (not to reveal vault contents automatically).

Deliverable: builds installed on device; login + vault browse flows work.

### v1: Add native autofill integration
Goal: ship system autofill in a secure, minimal feature set.

iOS:
- Credential Provider Extension:
  - unlock flow (biometric/PIN)
  - list/search credentials
  - return one credential set (username/password) to the OS

Android:
- AutofillService:
  - unlock flow
  - dataset generation + domain matching rules aligned with extension/web

Shared requirements:
- A lightweight, encrypted local index for fast search while locked (optional), or require unlock before search.
- A strict “lock timer” and background/foreground handling.

## Engineering Effort and Risks

Effort drivers:
- Two platform-specific implementations (iOS extension + Android service).
- Secure local crypto storage and key lifecycle decisions.
- UX/security edge cases: re-lock, background timeouts, multiple accounts, domain matching.

Key risks:
- OS review/compliance constraints (iOS in particular).
- WebView attack surface if the wrapper is used beyond “shell”.
- Data leakage risk if encryption boundaries are not enforced under pressure.

## Recommendation

- Keep PWA as the near-term mobile product.
- Treat native wrapper + autofill as a **separate phase** after:
  - the zero-knowledge flow is stable,
  - domain matching is proven (web/extension),
  - and operational security posture is mature.
- Start with **Capacitor** for the feasibility track to minimize UI duplication.

## Next Concrete Steps (If Approved)

1. Create `mobile/` workspace with Capacitor bootstrap.
2. Define shared “credential selection” UI contract reused by:
   - iOS extension UI (SwiftUI)
   - Android service UI (Compose)
3. Define encrypted local storage format and key derivation strategy (leveraging the existing client-encryption primitives).
4. Add a minimal “unlock then fill” flow on each platform behind a feature flag.

