---
description: "Use when debugging errors, blank screens, broken state, stale UI, TypeScript failures, chart rendering issues, routing problems, or localStorage corruption in the banking prototype."
applyTo: "src/**/*.{ts,tsx}"
---

# Debugging Guide — Banking Prototype

## 1. Blank Screen / Nothing Renders

**Check first:**
- Open the browser console. A React render error silently clears the screen.
- Confirm `App.tsx` has a valid `<Routes>` wrapper and at least one `<Route path="/" ...>`.
- Confirm `index.html` has `<script type="module" src="/src/main.tsx">` — Vite requires this exact path.
- If using React Router v7, `<BrowserRouter>` must wrap `<App />` in `main.tsx`, not inside `App.tsx`.

**Common cause — missing route:**
```tsx
// ✗ Navigating to /cards but no route defined
// ✓ Add to App.tsx:
<Route path="/cards" element={<CardsScreen />} />
```

## 2. Zustand State Not Updating / Stale UI

- Confirm the component calls `useStore()` directly — do NOT destructure outside the component (loses reactivity).
- For arrays, always return a **new array** in the setter — mutating in place won't trigger a re-render:
  ```ts
  // ✗ Mutates in place — no re-render
  set((s) => { s.transactions.push(t); return s; })
  // ✓ Returns new array
  set((s) => ({ transactions: [...s.transactions, t] }))
  ```
- Check selector stability: inline selectors like `useStore(s => s.accounts.filter(...))` run on every render. Memoize with `useMemo` or move the filter outside the selector.

## 3. `persist` Middleware / localStorage Issues

- **Hydration mismatch** — if the store shape changes after data was written, old localStorage data will be partially applied. Fix: bump the `version` in `persist` options or add a `migrate` function.
- **Stale data after schema change** — open DevTools → Application → Local Storage → delete the `app-store` key, then refresh.
- **Key collision** — if two stores share the same `name`, they overwrite each other. Each store must have a unique `name`.
- **SSR / Vite HMR flicker** — wrap persistent store reads with `useEffect` if values appear wrong on first render.

## 4. TypeScript Errors

- **`any` in event handlers** — always type the event:
  ```ts
  // ✗
  const handleChange = (e: any) => ...
  // ✓
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => ...
  ```
- **Union type narrowing** — when switching on `TransactionStatus`, `AccountType`, or `BillStatus`, add an `exhaustive default`:
  ```ts
  default:
    const _: never = status; // TypeScript will error if a case is missing
  ```
- **Optional chaining for nullable fields** — `Account.availableBalance`, `Account.creditLimit`, `Transaction.description`, and `Card.spendLimit` are optional. Always use `??` or optional chaining:
  ```ts
  account.availableBalance ?? account.balance
  ```
- **Date fields are `string` (ISO)** — never compare with `>` directly. Parse first:
  ```ts
  new Date(transaction.date) > new Date(bill.dueDate)
  ```

## 5. SVG Chart Rendering Issues

- **NaN / zero-size bars** — always guard against empty arrays and zero totals before calculating percentages:
  ```ts
  const total = values.reduce((a, b) => a + b, 0);
  const pct = total === 0 ? 0 : (value / total) * 100;
  ```
- **Chart overflows its container** — set explicit `width` and `height` on the `<svg>` element; use `viewBox` for responsive scaling:
  ```tsx
  <svg viewBox="0 0 300 150" className="w-full h-auto">
  ```
- **Text cut off at edges** — add padding via `viewBox` margins rather than CSS padding (CSS does not affect SVG coordinate space).

## 6. Currency & Locale Formatting

- Always use `toLocaleString('en-IN', { style: 'currency', currency: 'INR' })` for ₹ values — never `'₹' + amount`.
- Guard against `NaN` before formatting:
  ```ts
  const fmt = (n: number) =>
    isNaN(n) ? '₹0' : n.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  ```
- **Credit card balances** — `creditLimit - currentSpend` can be negative; display as "Over limit" rather than a negative ₹ value.

## 7. Tailwind v4 Specifics

- Tailwind v4 uses `@import "tailwindcss"` in CSS — **do NOT use** `@tailwind base/components/utilities` directives (v3 syntax).
- Arbitrary values require no space: `bg-[#020617]` not `bg-[ #020617 ]`.
- `backdrop-blur-sm` requires a non-opaque background to be visible — pair with `bg-white/5` or similar.
- If classes are not applied, check that the file is included in Vite's module graph (imported somewhere in the `src/` tree).

## 8. React Router v7 Navigation

- Use `useNavigate()` for programmatic navigation — do NOT use `window.location.href` (breaks SPA routing).
- `useParams()` returns `string | undefined` for all params — always narrow before use:
  ```ts
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  ```
- Detail screens (e.g., transaction detail, card detail) must be registered as nested or sibling routes in `App.tsx`, not just rendered conditionally.

## 9. Mock Data Integrity

- All `accountId` references in `Transaction`, `Card` must match an `id` in the `accounts` array — mismatches silently produce `undefined` lookups.
- `Bill.dueDate` and `Transaction.date` must be valid ISO strings. Invalid dates produce `NaN` in `new Date()` comparisons.
- After editing `mockData.ts`, clear localStorage (`app-store` key) so the persist middleware picks up the new seed data.

## 10. General Checklist

- [ ] Browser console is clear of React errors and TypeScript build warnings
- [ ] No `undefined` or `null` rendered directly in JSX (causes "Objects are not valid as React child")
- [ ] Every `useEffect` with async work has a cleanup or is guarded with an `isMounted` flag
- [ ] No array index used as React `key` for lists that can be reordered or filtered — use `item.id`
- [ ] `npm run build` passes with zero TypeScript errors before considering the fix complete
