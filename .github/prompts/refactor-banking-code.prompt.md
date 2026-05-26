---
description: "Refactor selected banking app code — extract components, enforce naming conventions, harden security, improve error handling, optimize performance, and replace magic values"
agent: "agent"
argument-hint: "Optional: describe what aspect to prioritize"
---

# Banking App Code Refactor

Refactor the selected code from this banking prototype. Apply ALL of the following improvements in order.

## 1. Extract Reusable Functions/Components

- Identify any logic or JSX that is repeated more than once; extract into a named utility function or React component
- Place extracted components in `src/components/` and utility functions in `src/utils/`
- Every extracted unit must have a TypeScript interface for its props or parameters
- Do not extract code that is only used in one place unless it exceeds 30 lines

## 2. Enforce Banking Naming Conventions

- Rename variables and functions to use domain-accurate terms:
  - Entities: `account`, `transaction`, `ledger`, `balance`, `statement`, `beneficiary`, `payee`
  - Actions: `debit`, `credit`, `transfer`, `settle`, `reconcile`
  - Identifiers: `accountNumber`, `ifscCode`, `upiId`, `transactionId`, `referenceNumber`
- Boolean flags: `isActive`, `isPending`, `isVerified`, `hasKyc`, `isRecurring`
- Event handlers: `onTransactionSelect`, `onAccountSwitch`, `onPaymentSubmit`, `onFilterChange`
- Avoid generic names: `data`, `item`, `obj`, `temp`, `val`, `res`

## 3. Security Hardening ⚠️

- Add input validation at ALL form boundaries:
  - Amounts: must be numeric, positive, and within allowed limits
  - Account/IFSC/UPI fields: validate format before submission
  - Required fields: reject empty or whitespace-only values
- Never log, render, or store raw PII — mask card numbers (`**** **** **** 4321`), Aadhaar, and PAN in display
- Remove any `dangerouslySetInnerHTML` usage — replace with safe text rendering
- Remove any `eval()` or `new Function()` calls
- Flag every security issue found with ⚠️ in the Refactor Summary

## 4. Error Handling & Logging

- Wrap all async operations (`fetch`, `Promise`, store actions) in `try/catch` with typed error objects
- Surface user-facing errors via the zustand store (e.g., `set({ error: message })`) — never use `console.error` as the only error path
- Add fallback/default values so the UI never crashes on `null` or `undefined` data (e.g., `balance ?? 0`, `transactions ?? []`)
- Use `instanceof Error` checks before accessing `.message`

## 5. Performance Optimization

- Wrap expensive computations (sorting, filtering, aggregating transactions) in `useMemo` with correct dependency arrays
- Wrap callback props passed to child components in `useCallback`
- Replace inline `.find()` or `.filter()` loops that run on every render with precomputed maps or memoized values
- Avoid creating new object/array literals inside JSX props (causes unnecessary re-renders)

## 6. Replace Magic Values

- Extract all hardcoded numbers (transaction limits, timeout durations, max retries, pagination sizes) into named constants at the top of the file:
  ```ts
  const MAX_TRANSFER_AMOUNT = 200000;
  const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
  ```
- Extract hardcoded strings (status codes, route paths, category labels) into constants or enums in `src/types.ts`
- Currency formatting: always use `toLocaleString('en-IN', { style: 'currency', currency: 'INR' })` — never hardcode `₹` with string concatenation

---

## Output Format

1. Return the **complete refactored code** in a single code block — do not omit unchanged sections
2. Follow with a **Refactor Summary** as a bullet list:
   - One bullet per change made
   - State what changed and why
   - Prefix security issues with ⚠️
3. If no changes were needed for a section, note it as "No changes needed — already compliant"
