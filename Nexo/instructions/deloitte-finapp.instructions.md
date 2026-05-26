---
description: "Use when building, extending, or modifying the Deloitte Financial Services prototype — a unified personal finance app covering banking, investments, loans, insurance, and goals. Apply for new screens, new components, data models, store actions, charts, or UX copy in this project."
applyTo: "src/**/*.{ts,tsx}"
---

# Deloitte Financial Services Prototype — Instruction Set

## Project Brief

This prototype is built for Deloitte's Financial Services practice to demonstrate to banks, insurers, wealth managers, and fintech clients. It must look like a **shipped, production-grade product** — not a consulting slide or a wireframe. Every screen must build trust at a glance.

The app helps a financially confused urban professional consolidate their banking accounts, track investments, manage EMIs/loans, review insurance coverage, and set savings goals — all in one place.

---

## User Persona

**Arjun Sharma, 31 — Senior Software Engineer, Bengaluru**

- Earns ₹18L/year; has accounts across 3 banks (HDFC, SBI, Kotak)
- Invests in mutual funds via Groww but forgets to review them
- Has a home loan EMI, a car loan, and one credit card with ₹40K outstanding
- Has a LIC policy but doesn't know if it's adequate
- Saves inconsistently — no clear goal tracking
- Pain points: **scattered data, no single view of net worth, anxiety about EMIs, no insurance clarity**

### Design mandate derived from persona
- Lead with **net worth and financial health score** — give Arjun one number to feel in control
- Show **upcoming EMIs and bill due dates** prominently — reduce anxiety through visibility
- Summarize **investments in plain language** — don't show raw NAV; show gain/loss in ₹ and %
- Surface **insurance gaps** — show coverage vs. recommended coverage
- Make **goal progress visceral** — progress bars, ₹ remaining, months to go

---

## Domain Modules

Every screen belongs to one of these modules. Implement only modules listed here unless the user explicitly adds new ones.

| Module | Screen | Key Data |
|--------|--------|----------|
| **Dashboard** | Overview / Home | Net worth, financial health score, alerts, quick actions |
| **Banking** | Accounts, Transactions | Account balances, recent transactions, spending by category |
| **Investments** | Portfolio, Holdings | MF units, current value, XIRR, gain/loss |
| **Loans & EMIs** | Loans, EMI calendar | Outstanding principal, EMI amount, tenure remaining |
| **Insurance** | Policies, Coverage gaps | Policy type, sum assured, premium due, coverage adequacy |
| **Goals** | Goals list, Goal detail | Target amount, saved so far, monthly SIP required, deadline |
| **Cards** | Cards list, Spend analysis | Credit limit, outstanding, statement date, spend by category |
| **Profile** | Settings, KYC status | User info, linked accounts, notification preferences |

---

## Currency & Locale — Non-Negotiable

- **Always use ₹ INR** — this is an Indian persona app
- Format with `toLocaleString('en-IN')` → ₹24,75,000 (NOT ₹2,475,000)
- NEVER use `$` or any other currency symbol
- Lakhs notation: use "₹12.4L" for compact display in KPI cards; full notation in detail views
- Loan tenure: always in months or years (e.g., "18 months remaining")
- Investment returns: show both absolute (₹ gain) and percentage (XIRR %)

---

## Visual Design — Financial Trust Palette

This is a **dark-theme** app. The color palette signals trust, clarity, and sophistication — appropriate for a Deloitte client demo.

### Colors
- App background: `bg-slate-950`
- Card base: `bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl`
- Primary accent: `emerald-500` (#10B981) — net worth positive, active nav, CTA buttons
- Investment accent: `blue-400` — holdings, portfolio screens
- Loan/debt accent: `amber-400` — EMIs, credit card outstanding, warnings
- Insurance accent: `purple-400` — policies, coverage status
- Goals accent: `teal-400` — savings goals, progress bars
- Danger/overdue: `red-400` — overdue bills, coverage gaps, failed transactions

### Typography
- Body font: **Plus Jakarta Sans** (import from Google Fonts in `index.html`)
- Number/amount font: **JetBrains Mono** (all ₹ values, percentages, account numbers)
- Hero number: `text-3xl font-bold font-mono`
- Section heading: `text-lg font-semibold`
- Card label: `text-xs text-slate-400 uppercase tracking-wide`

### KPI Card Pattern (use for all summary metrics)
```tsx
<div className="bg-white/5 border border-white/10 rounded-xl p-4">
  <p className="text-xs text-slate-400 uppercase tracking-wide">{label}</p>
  <p className="text-2xl font-bold font-mono text-white mt-1">{value}</p>
  <p className="text-xs text-emerald-400 mt-1">{delta}</p>  {/* or red-400 for negative */}
</div>
```

---

## Data Architecture

### Type Conventions
Define all types in `src/types.ts` first. Required interfaces for new modules:

```ts
// Investments
interface MutualFund {
  id: string
  name: string
  category: 'equity' | 'debt' | 'hybrid' | 'liquid'
  investedAmount: number
  currentValue: number
  units: number
  nav: number
  xirr: number       // annualized return %
  sipAmount?: number // monthly SIP if active
}

// Loans
interface Loan {
  id: string
  type: 'home' | 'car' | 'personal' | 'education'
  lenderName: string
  principalAmount: number
  outstandingAmount: number
  emiAmount: number
  interestRate: number   // annual %
  tenureMonths: number
  remainingMonths: number
  nextDueDate: string    // ISO date
}

// Insurance
interface InsurancePolicy {
  id: string
  type: 'term' | 'health' | 'vehicle' | 'ulip' | 'endowment'
  insurer: string
  policyNumber: string
  sumAssured: number
  annualPremium: number
  nextPremiumDue: string  // ISO date
  status: 'active' | 'lapsed' | 'expired'
  coverageAdequacy: 'adequate' | 'underinsured' | 'critical'
}

// Goals
interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  savedAmount: number
  targetDate: string    // ISO date
  monthlyContribution: number
  category: 'emergency' | 'vacation' | 'home' | 'education' | 'retirement' | 'other'
  color: string         // Tailwind color name for the progress bar
}
```

### Mock Data Rules
- All mock data goes in `src/mockData.ts` — components NEVER import it directly
- Use realistic Indian names, banks (HDFC, SBI, ICICI, Kotak, Axis), insurers (LIC, HDFC Life, Star Health), AMCs (Mirae, Axis MF, Parag Parikh)
- Balances, investments, and EMIs must be internally consistent — net worth = assets − liabilities
- At least 3 accounts, 4 mutual funds, 2 loans, 2 insurance policies, 3 goals in seed data

---

## Screen-Level Requirements

### Dashboard (Home)
- **Financial Health Score** (0–100) displayed as a circular SVG arc — the hero element
- Net worth with month-over-month change
- Alerts section: overdue EMIs, upcoming premiums, underinsured gaps — each as a tappable card
- Quick actions: Pay Bill, Transfer, Add Goal, View Portfolio
- Spending donut chart (last 30 days by category)

### Investments Screen
- Portfolio summary: total invested, current value, overall gain/loss (₹ + %)
- Holdings list: each fund as a card with name, category pill, current value, XIRR badge
- XIRR color rule: ≥12% → emerald, 6–12% → blue, <6% → amber, negative → red
- No external chart libraries — build allocation donut with inline SVG

### Loans & EMIs Screen
- EMI calendar strip showing next 3 due dates with amounts
- Each loan card: type icon, lender, outstanding amount, EMI, tenure remaining
- Progress bar showing % of loan repaid (use teal fill on slate track)
- Total monthly EMI obligation shown as a KPI

### Insurance Screen
- Coverage adequacy indicator per policy: "adequate / underinsured / critical" as colored pills
- Recommended vs. actual sum assured for term and health — show the gap in ₹
- Next premium due within 30 days → amber badge "Due Soon"
- Overdue premiums → red badge "Action Required"

### Goals Screen
- Each goal has a horizontal progress bar (filled with goal's color, track in `bg-white/10`)
- Show: ₹ saved of ₹ target, % complete, months remaining, monthly contribution required
- "On track / Behind / At risk" status derived from current pace vs. target date

---

## Chart Rules (SVG Only)

- All charts are hand-built inline SVG — no Recharts, Chart.js, D3, Plotly, or any chart library
- Donut chart: use `<circle>` with `stroke-dasharray` and `stroke-dashoffset`
- Bar chart: use `<rect>` elements, derive height from `(value / maxValue) * chartHeight`
- Sparkline: use `<polyline>` with calculated points
- Always include a legend below the chart using colored `<span>` dots + labels
- Charts must be responsive — use `viewBox` and percentage widths

---

## Navigation & Layout

- **Mobile shell** (`w-[390px] h-[844px]`): bottom nav with 5 tabs — Home, Accounts, Invest, Goals, More
- **Web layout** (`lg:`): left sidebar, 240px wide, with grouped nav sections
- Active tab: filled icon + accent color text (`text-emerald-400`)
- Inactive tab: outline icon + `text-slate-500`
- Bottom nav must be `sticky bottom-0 bg-slate-900/90 backdrop-blur-sm`

---

## UX Copy & Tone

- Write for a financially anxious user — be reassuring, not alarming
- Labels should be plain English: "What you owe" not "Total Liabilities"
- Use action-oriented CTAs: "Pay ₹4,200 now" not just "Pay"
- Empty states must have a helpful prompt: "No investments yet — start your first SIP in 2 minutes"
- Avoid jargon on summary screens; use jargon only in detail/drill-down views where users opt in

---

## What NOT to Build

- Do NOT use any external UI library (no shadcn, MUI, Chakra, Ant Design)
- Do NOT use any chart library (no Recharts, Chart.js, D3)
- Do NOT use `$` for any amount
- Do NOT use white app backgrounds — dark theme only
- Do NOT leave placeholder text ("Lorem ipsum", "Coming soon", "Sample data")
- Do NOT build a single scrolling page — use React Router routes per module
- Do NOT add features beyond the 8 modules listed unless explicitly requested
