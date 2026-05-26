# Project Instructions

These rules apply to ALL code generated in this project. Follow them on every request without exception.

## Tech Stack

- React 18+ with TypeScript (strict mode)
- Tailwind CSS for all styling — no inline style objects, no CSS modules, no styled-components
- Vite as the build tool
- No external UI component libraries (no Material UI, no Chakra, no shadcn, no Ant Design)
- No external chart libraries (no Chart.js, no Recharts, no D3, no Plotly)
- All charts and data visualizations must be hand-built using inline SVG elements
- Use React Router for navigation between screens
- Use zustand for client-side state management — lightweight, no boilerplate
- localStorage for data persistence across page refreshes
- Platform determines layout — mobile uses phone shell + bottom nav, web uses sidebar or top nav, web+mobile uses responsive breakpoints

## Frontend Data Layer

The prototype should feel interactive — not just static renders of mock data. Users should be able to add, edit, filter, and see changes reflected.

**Architecture:**
```
mockData.ts          ← seed data (realistic, domain-correct)
     ↓
zustand store        ← runtime state (initialized from mockData, mutable)
     ↓
localStorage         ← persistence (auto-save on every state change)
     ↓
components           ← read from store, dispatch actions to update
```

**Setup pattern:**
1. `mockData.ts` — contains the initial seed data with correct types
2. `store.ts` — zustand store initialized from mockData, with actions for CRUD operations
3. Components import from the store using `useStore()` — never import mockData directly into components
4. Store auto-syncs to localStorage so page refreshes don't lose changes
5. Include a "Reset to defaults" action that re-seeds from mockData

**Zustand store example:**
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { initialAccounts, initialGoals } from './mockData'

interface AppStore {
  accounts: Account[]
  goals: Goal[]
  addGoal: (goal: Goal) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  reset: () => void
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      accounts: initialAccounts,
      goals: initialGoals,
      addGoal: (goal) => set((s) => ({ goals: [...s.goals, goal] })),
      updateGoal: (id, updates) => set((s) => ({
        goals: s.goals.map(g => g.id === id ? { ...g, ...updates } : g)
      })),
      reset: () => set({ accounts: initialAccounts, goals: initialGoals }),
    }),
    { name: 'app-store' }
  )
)
```

**Build order update:** `types.ts` → `mockData.ts` → `store.ts` → components → screens → `App.tsx`

## Visual Design — This Is Not Optional

The prototype must look like a real, shipped product. Not a wireframe. Not a skeleton. Not a homework assignment. Every screen must feel designed, not generated.

### Theme and Background

- Default to a DARK theme — dark backgrounds with light text
- App background: `bg-slate-950` (#020617) or `bg-gray-950` (#030712)
- Card backgrounds: use glass-morphism — `bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl`
- Alternative card style: tinted backgrounds — `bg-emerald-500/10` or `bg-blue-500/10` with no border
- NEVER use plain white backgrounds (`bg-white`) as the app background — this is the single biggest reason prototypes look bland
- If the user explicitly requests a light theme, use `bg-slate-50` with `bg-white rounded-xl shadow-sm border border-slate-200` for cards

### Color System

Pick a primary accent color that matches the domain. Apply it consistently across the ENTIRE app — header accents, active nav items, positive indicators, primary buttons, chart highlights.

Suggested palettes (adapt to user's domain):
- Finance/Banking: primary `emerald-500` (#10B981), surface `slate-800`, accent `blue-500`
- Healthcare: primary `teal-500` (#14B8A6), surface `slate-800`, accent `rose-500` for alerts
- Retail/Consumer: primary `green-600` (#16A34A), surface `slate-900`, accent `amber-500`
- Travel/Hospitality: primary `amber-500` (#F59E0B), surface `slate-950`, accent `blue-400`
- Sports/Entertainment: primary `purple-500` (#8B5CF6), surface `slate-900`, accent `amber-400`
- Automotive: primary `cyan-500` (#06B6D4), surface `slate-950`, accent `orange-500`
- Manufacturing/Industrial: primary `orange-500` (#F97316), surface `slate-900`, accent `green-500`
- Tax/Compliance: primary `indigo-500` (#6366F1), surface `slate-900`, accent `amber-500` for risk flags
- Audit/Risk Management: primary `sky-500` (#0EA5E9), surface `slate-950`, accent `red-500` for anomalies

### Typography

- Import a distinctive sans-serif from Google Fonts CDN — NEVER default to Arial, Helvetica, or system-ui
- Recommended: Plus Jakarta Sans, Inter, DM Sans, Outfit, Geist Sans
- Use a monospace font for ALL numbers, amounts, percentages, and data values: JetBrains Mono, Fira Code, or IBM Plex Mono
- Font loading: add `<link>` in `index.html` `<head>`, then set in Tailwind config or global CSS
- Heading sizes: `text-2xl font-bold` hero → `text-lg font-semibold` section → `text-sm font-medium` card → `text-xs` label
- Text colors: `text-white` for primary, `text-slate-400` for secondary/muted, `text-slate-600` for tertiary

### Cards and Containers

Every data section lives inside a card. No floating text, no unstyled divs.

Standard card:
```
className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
```

Tinted card (for KPIs, categories):
```
className="bg-emerald-500/10 rounded-xl p-4"
```

Elevated card (for CTAs, alerts):
```
className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl p-4"
```

### Spacing System

- Use consistent Tailwind spacing: `gap-3` between cards in a grid, `gap-4` between sections, `p-4` inside cards
- Screen padding: `px-4 py-6` for content area
- Section spacing: `space-y-6` between major sections
- Card grid: `grid grid-cols-2 gap-3` for KPI cards, `grid grid-cols-1 gap-3` for list items

### Status and Category Colors

Differentiate everything. Nothing should be one flat color.

- Positive/success: `text-emerald-400 bg-emerald-500/10`
- Negative/danger: `text-red-400 bg-red-500/10`
- Warning/caution: `text-amber-400 bg-amber-500/10`
- Info/neutral: `text-blue-400 bg-blue-500/10`
- Purple category: `text-purple-400 bg-purple-500/10`
- Cyan category: `text-cyan-400 bg-cyan-500/10`

Status badges:
```
className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400"
```

## Currency & Locale

- Ask the user what currency to use if not obvious from context
- If the persona has an Indian name or Indian context: ALWAYS use ₹ INR formatted with `toLocaleString('en-IN')` → ₹24,75,000 (NOT ₹2,475,000)
- NEVER use $ for Indian personas — this is the most common and most visible mistake
- For non-Indian contexts, use the appropriate local currency
- Healthcare apps: use medical units correctly (mg/dL, mmHg, bpm, kg)
- Manufacturing apps: use operational units (kWh, units/hr, OEE %)
- Tax apps: use currency amounts for deductions/exposure, percentages for rates, compliance status labels
- Audit apps: use transaction counts, anomaly scores (0–100), risk tiers, currency amounts for balances
- Always show units alongside values — never a naked number

## File Structure

- **ALL source files MUST be inside the `src/` directory.** Vite only processes files inside `src/`. Files placed outside `src/` cause blank screens and broken imports.
- One component per file — never put multiple components in the same file
- Every component must have an exported TypeScript interface for its props
- Shared types in `src/types.ts` — create this FIRST before anything else
- Seed data in `src/mockData.ts` with typed constants — used to initialize the store
- State management in `src/store.ts` — zustand store with persist middleware
- Components in `src/components/` — read from the store (`useStore()`), never import mockData directly
- Screens in `src/screens/` — each screen composes components
- File naming: PascalCase matching the component name (e.g., `src/components/NetWorthHero.tsx`)
- Keep components under 150 lines — extract sub-components if longer
- Build order: `src/types.ts` → `src/mockData.ts` → `src/store.ts` → `src/components/` → `src/screens/` → `src/App.tsx`
- Config files (`package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`) go at project ROOT, not inside `src/`

## Code Style

- Functional components with hooks only — no class components
- Destructure props in function signature
- `const` by default, `let` only when reassignment is needed
- Name types/interfaces in PascalCase with descriptive names (e.g., `AccountSummary`)
- Use early returns to reduce nesting
- Extract repeated Tailwind class strings into variables if used more than twice

## Self-Review Before Presenting

Before showing any output to the user, verify ALL of these. If any fail, fix before presenting.

### Visual check
- [ ] Background is dark (slate-950 or similar) — NOT white
- [ ] Cards have glass or tinted styling — NOT plain white boxes
- [ ] Colors are differentiated — categories, statuses, and types each have their own color
- [ ] Font is imported from Google Fonts — NOT Arial or system default
- [ ] Numbers use monospace font — NOT the same font as text labels
- [ ] Heading hierarchy is visible — hero numbers are large, labels are small

### Data check
- [ ] Currency symbol is correct (₹ for Indian, appropriate symbol for others)
- [ ] Currency formatting matches locale (₹24,75,000 not ₹2,475,000)
- [ ] No placeholder text — "Lorem ipsum", "Coming soon", "TBD", "Sample data" are failures
- [ ] Mock data uses real-sounding names, plausible numbers, and correct units

### Component check
- [ ] Every screen has navigation appropriate to the platform:
  - Mobile: phone shell (`w-[390px] h-[844px]`) + bottom nav with `sticky bottom-0`
  - Web: sidebar with grouped items OR top nav
  - Web + Mobile: sidebar on `lg:`, bottom nav on mobile via `lg:hidden`
- [ ] Active nav state is visually distinct (accent color, filled icon, or active indicator)
- [ ] Charts are SVG — no external chart library imports
- [ ] Status indicators use color-coded pill badges, not plain text
- [ ] KPI cards show: label + large value + delta indicator — not just a number

### Code check
- [ ] TypeScript interfaces on every component's props
- [ ] No `any` types
- [ ] Each component in its own file
- [ ] Mock data in mockData.ts, not scattered in components
- [ ] No external UI or chart library imports
- [ ] `npm run dev` passes without TypeScript errors

## What NOT To Do

- Do NOT use white/light backgrounds unless explicitly asked — dark theme is the default
- Do NOT use placeholder text ("Lorem ipsum", "Coming soon", "TBD", "Sample data")
- Do NOT leave sections unstyled or half-implemented
- Do NOT mix font families within a screen
- Do NOT use the same color for every item — differentiate categories, statuses, urgencies
- Do NOT create a single scrollable page with everything — use routing and navigation
- Do NOT install packages beyond what is defined in the project's package.json
- Do NOT use HTML tables for data — use styled div grids with proper card styling
- Do NOT render charts as text lists — if data has a visual shape, build an SVG chart
- Do NOT use browser default form styles — style all inputs, selects, and buttons
