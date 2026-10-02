# Recura - Onboarding Authentication & Database Bypass Guide

This guide documents the temporary authentication and database bypass implemented for the **Recura Onboarding Flow**.

---

## 1. Purpose

The product design team needs to review, demonstrate, and test all onboarding steps live online (from Sign-Up through Niche Selection, Business Details, Payment & Integrations, to Completion Summary and Dashboard) without:
- Requiring a live PostgreSQL database connection
- Requiring real email verification OTP deliveries (SendGrid/Resend)
- Storing temporary designer test data in the production database

This bypass allows a seamless, pure UI/UX demonstration of the complete product experience.

---

## 2. How to Revert to Normal State (Instant 1-Line Switch)

To switch the application back to its normal production authentication state at any time:

1. Open [src/config/auth-bypass.ts](file:///c:/FRONT-END/REACT/recura_flute/src/config/auth-bypass.ts)
2. Change line 16 from `true` to `false`:

```typescript
// Set to false to revert back to normal backend authentication
export const AUTH_BYPASS_ENABLED = false;
```

**That's it!** All components, API endpoints, session utilities, and Edge middleware will immediately revert to standard production database authentication.

---

## 3. End-to-End Onboarding Flow in Preview Mode

| Step | Route | Normal Behavior | Preview Mode (Bypass Active) |
| :--- | :--- | :--- | :--- |
| **Step 1** | [`/sign-up`](file:///c:/FRONT-END/REACT/recura_flute/src/app/(auth)/sign-up/page.tsx) | Validates fields, creates user in DB, sends email OTP | Saves demo session in cookies & storage; advances directly to Step 3 (`/choose-business`). Includes a 1-click **Fast Track** button. |
| **Step 2** | [`/verify-email`](file:///c:/FRONT-END/REACT/recura_flute/src/app/(auth)/verify-email/page.tsx) | Validates 6-digit OTP against database token | Any 6-digit code or clicking **Skip to onboarding (Preview) →** advances to Step 3 (`/choose-business`). |
| **Step 3** | [`/choose-business`](file:///c:/FRONT-END/REACT/recura_flute/src/app/(auth)/choose-business/page.tsx) | Selects 1 of 6 business niches | Selected niche is saved in client storage (`localStorage`). Advances to `/business-details?type=<niche>`. |
| **Step 4** | [`/business-details`](file:///c:/FRONT-END/REACT/recura_flute/src/app/(auth)/business-details/page.tsx) | Multi-phase dynamic business input form | Inputs saved in client storage (`recura_step4_formdata`). Advances to `/connect-payment`. |
| **Step 5** | [`/connect-payment`](file:///c:/FRONT-END/REACT/recura_flute/src/app/connect-payment/page.tsx) | Connects payment gateways (Paystack, Stripe, etc.) | Gateway choice saved in client storage. Advances to `/connect-integrations`. |
| **Step 6** | [`/connect-integrations`](file:///c:/FRONT-END/REACT/recura_flute/src/app/connect-integrations/page.tsx) | Connects tools (Slack, Gmail, Notion, etc.) | Tool choices saved in client storage. Advances to `/completion-summary`. |
| **Step 7** | [`/completion-summary`](file:///c:/FRONT-END/REACT/recura_flute/src/app/completion-summary/page.tsx) | Displays animated beam convergence and summary recap | Clicking **Go to dashboard** bypasses database write and safely transitions to `/dashboard`. |
| **Step 8** | [`/dashboard`](file:///c:/FRONT-END/REACT/recura_flute/src/app/dashboard/page.tsx) | Authenticated workspace dashboard | Edge middleware permits access; UserProvider dynamically reads user's niche and details from client storage to render that niche's customized dashboard! |

---

## 4. Architecture & Modified Files

All modifications are guarded by `AUTH_BYPASS_CONFIG.enabled` so that setting `AUTH_BYPASS_ENABLED = false` completely restores original behavior.

### 1. Central Configuration Module
- **[src/config/auth-bypass.ts](file:///c:/FRONT-END/REACT/recura_flute/src/config/auth-bypass.ts)** *(New File)*:
  - Exports `AUTH_BYPASS_ENABLED` (master toggle).
  - Exports `setupBypassSession()` to set the `recura_session` cookie and storage.
  - Exports `getBypassUserAndWorkspace()` to dynamically build user & workspace objects from onboarding answers.

### 2. Edge Middleware
- **[src/middleware.ts](file:///c:/FRONT-END/REACT/recura_flute/src/middleware.ts)**:
  - When bypass is active, allows `/dashboard/*` requests without bouncing unauthenticated users to `/sign-in`.

### 3. Session & User Context
- **[src/lib/session.ts](file:///c:/FRONT-END/REACT/recura_flute/src/lib/session.ts)**:
  - In `getSession()`, avoids querying `sessions` table in the database and preserves the demo session.
- **[src/context/user-context.tsx](file:///c:/FRONT-END/REACT/recura_flute/src/context/user-context.tsx)**:
  - When bypass is active, supplies mock user and workspace states derived from the user's onboarding choices in `localStorage`.

### 4. Authentication UI Components
- **[src/components/authentication/sign-up.tsx](file:///c:/FRONT-END/REACT/recura_flute/src/components/authentication/sign-up.tsx)**:
  - Submitting or clicking **Continue to onboarding process** calls `setupBypassSession()` and routes straight to `/choose-business`.
  - Added a visible **Designer Preview** notice with a 1-click **Fast Track →** action.
- **[src/components/authentication/verify-email.tsx](file:///c:/FRONT-END/REACT/recura_flute/src/components/authentication/verify-email.tsx)**:
  - Allows bypassing OTP verification with any code, plus a direct skip link.
- **[src/components/authentication/completion-summary.tsx](file:///c:/FRONT-END/REACT/recura_flute/src/components/authentication/completion-summary.tsx)**:
  - In `handleGoToDashboard`, avoids database POST to `/api/v1/onboarding` and navigates smoothly to `/dashboard`.
- **[src/components/authentication/sign-in.tsx](file:///c:/FRONT-END/REACT/recura_flute/src/components/authentication/sign-in.tsx)**:
  - Added preview mode support so testing sign-in also grants immediate access.

### 5. Backend API Routes (Safety Fallbacks)
The following routes return clean mock success responses instead of throwing database connection errors if accessed during preview mode:
- **[src/app/api/v1/auth/signup/route.ts](file:///c:/FRONT-END/REACT/recura_flute/src/app/api/v1/auth/signup/route.ts)**
- **[src/app/api/v1/auth/verify-email/route.ts](file:///c:/FRONT-END/REACT/recura_flute/src/app/api/v1/auth/verify-email/route.ts)**
- **[src/app/api/v1/auth/signin/route.ts](file:///c:/FRONT-END/REACT/recura_flute/src/app/api/v1/auth/signin/route.ts)**
- **[src/app/api/v1/auth/me/route.ts](file:///c:/FRONT-END/REACT/recura_flute/src/app/api/v1/auth/me/route.ts)**
- **[src/app/api/v1/onboarding/route.ts](file:///c:/FRONT-END/REACT/recura_flute/src/app/api/v1/onboarding/route.ts)**

---

## 5. How to Permanently Remove Bypass Code (Future Cleanup)

If in the future you wish to completely remove the bypass code rather than toggling `AUTH_BYPASS_ENABLED = false`:

1. Delete `src/config/auth-bypass.ts`.
2. Delete `AUTH_BYPASS_GUIDE.md`.
3. In each of the modified files listed in Section 4, remove the `if (AUTH_BYPASS_CONFIG.enabled)` blocks and the imports of `@/config/auth-bypass`.
