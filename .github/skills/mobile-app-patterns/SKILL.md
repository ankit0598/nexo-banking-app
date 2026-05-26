# Mobile App Patterns

Reusable patterns for building mobile-first app screens. Read this skill before building any screen that looks like a native mobile app — home screens, profiles, list screens, detail pages.

These patterns assume a dark theme (bg-slate-950) as defined in the project instructions. All Tailwind classes shown here are the default.

---

## Phone Shell Wrapper — MANDATORY

Every prototype MUST render inside a phone shell. This is the single most important thing that makes a prototype look like a real app instead of a web page.

The outer page is a neutral dark background. The phone shell sits centered on it at fixed iPhone dimensions. The app renders inside the shell.

```jsx
// App.tsx or main layout wrapper
export default function App() {
  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-8">
      {/* Phone shell */}
      <div className="relative w-[390px] h-[844px] bg-slate-950 rounded-[44px] overflow-hidden shadow-[0_0_0_12px_#1e293b,0_0_0_14px_#334155,0_32px_80px_rgba(0,0,0,0.6)]">

        {/* Dynamic island / notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-700" />
          <div className="w-10 h-3 rounded-full bg-slate-700" />
        </div>

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 h-12 flex items-start justify-between px-8 pt-2 z-10">
          <span className="text-[11px] text-white font-semibold mt-1">9:41</span>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[11px] text-white">●●●</span>
            <span className="text-[11px] text-white">WiFi</span>
            <span className="text-[11px] text-white">100%</span>
          </div>
        </div>

        {/* App content — scrollable, starts below status bar */}
        <div className="absolute inset-0 top-12 overflow-y-auto overflow-x-hidden scrollbar-none">
          {/* Router / screens render here */}
          <RouterContent />
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
      </div>
    </div>
  )
}
```

**Rules:**
- Phone dimensions: exactly `w-[390px] h-[844px]` — standard iPhone 14 size. Never use percentages or `max-w-md` for the phone shell itself.
- Outer background: `bg-slate-800` — provides contrast so the phone frame is visible
- `overflow-hidden` on the phone shell clips everything to the phone boundary
- `overflow-y-auto` on the content div allows scrolling within the phone
- `scrollbar-none` hides the browser scrollbar inside the phone
- All app screens render INSIDE this shell — they should fill 390px width naturally
- The phone shell is the layout root — screens themselves do NOT need their own `max-w` constraints

**For multi-screen apps with React Router:**
```jsx
// The RouterContent inside the shell
function RouterContent() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/accounts" element={<AccountsScreen />} />
      <Route path="/goals" element={<GoalsScreen />} />
    </Routes>
  )
}
```

---

## Screen Layout

Every screen renders inside the phone shell above. Each screen is a flex column filling the available space.

```jsx
// Individual screen component — no max-w needed, shell handles that
export default function HomeScreen() {
  return (
    <div className="flex flex-col min-h-full bg-slate-950">
      {/* Header */}
      <header className="px-4 pt-4 pb-3">
        {/* greeting or page title */}
      </header>

      {/* Scrollable content */}
      <main className="flex-1 px-4 pb-24 space-y-4">
        {/* sections */}
      </main>

      {/* Bottom nav — sticky at bottom of screen */}
      <BottomNav activeTab="home" />
    </div>
  )
}
```

**Key dimensions:**
- Content padding: `px-4`
- Bottom padding: `pb-24` to clear the nav
- Section spacing: `space-y-4` or `space-y-6`
- Card gap: `gap-3`

---

## Bottom Navigation

Sits at the bottom of the screen flex column. 4–5 items maximum. Do NOT use `fixed` positioning — the phone shell's `overflow-hidden` breaks fixed elements. Use `sticky bottom-0` instead.

**ALWAYS use Lucide React icons — never emoji or unicode characters.** Emoji render inconsistently across OS and look unprofessional. Lucide icons have consistent stroke weight and size.

```jsx
// BottomNav.tsx — reusable across all screens
import { Home, CreditCard, Target, TrendingUp, User, 
         LayoutDashboard, Users, Bell, FileText, Settings,
         ShoppingCart, Search, Package, Plane, Wallet,
         Compass, Ticket, Gift, Car, Receipt, FolderOpen,
         Factory, AlertTriangle, BarChart3, MapPin } from 'lucide-react'

interface BottomNavProps {
  activeTab: string
}

export default function BottomNav({ activeTab }: BottomNavProps) {
  const navigate = useNavigate()

  // Adapt these tabs to match the app's actual screens and domain
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'accounts', label: 'Accounts', icon: CreditCard, path: '/accounts' },
    { id: 'goals', label: 'Goals', icon: Target, path: '/goals' },
    { id: 'invest', label: 'Invest', icon: TrendingUp, path: '/invest' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ]

  return (
    <nav className="sticky bottom-0 bg-slate-900/90 backdrop-blur-lg border-t border-white/10 pb-6">
      <div className="flex justify-around pt-2">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1"
            >
              <Icon
                size={20}
                className={isActive ? 'text-emerald-400' : 'text-slate-500'}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className={`text-[10px] ${isActive ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
```

**Critical rules:**
- Use `sticky bottom-0` NOT `fixed bottom-0` — fixed breaks inside the phone shell
- `pb-6` on the nav provides space for the home indicator at the very bottom
- ALWAYS import and use Lucide React icons — NEVER use emoji or unicode characters
- Active icon: `strokeWidth={2}`, accent color
- Inactive icon: `strokeWidth={1.5}`, `text-slate-500`
- Icon size: `size={20}` — consistent across all nav items
- Adapt tab labels, icons, and paths to the app's actual domain

**Lucide icon suggestions by domain:**

Finance: `Home, CreditCard, Target, TrendingUp, User`
Healthcare: `LayoutDashboard, Users, Bell, FileText, Settings`
Grocery: `Home, Search, ShoppingCart, Package, User`
Travel: `Home, Plane, Wallet, Compass, User`
Sports: `Home, Ticket, Gift, BarChart3, User`
Automotive: `Home, Car, Receipt, FolderOpen, User`
Manufacturing: `LayoutDashboard, Factory, AlertTriangle, BarChart3, Settings`
Tax/Compliance: `LayoutDashboard, FileText, AlertTriangle, BarChart3, Settings`
Audit/Risk: `LayoutDashboard, Receipt, Bell, FileText, Settings`

**Nav item suggestions by domain:**
- Finance: Home, Accounts, Goals, Insights, Profile
- Healthcare: Dashboard, Patients, Alerts, Reports, Settings
- Grocery/Consumer: Home, Search, Cart, Orders, Profile
- Travel: Home, Trips, Wallet, Explore, Profile
- Sports: Home, Tickets, Rewards, Fantasy, More
- Automotive: Home, Vehicles, Expenses, Docs, More
- Manufacturing: Overview, Assets, Alerts, Reports, Settings
- Tax/Compliance: Dashboard, Filings, Risks, Scenarios, Settings
- Audit/Risk: Overview, Transactions, Anomalies, Reviews, Settings

Adapt these to what makes sense for the user's app — these are suggestions, not mandates.

---

## Greeting Header

Top of the home screen. Creates the personalized feel.

```jsx
<header className="px-4 pt-6 pb-2 flex items-start justify-between">
  <div>
    <p className="text-sm text-slate-400">Good morning,</p>
    <h1 className="text-xl font-semibold text-white">{userName}</h1>
  </div>
  <div className="flex gap-2">
    <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
      <span className="text-slate-400">🔔</span>
    </button>
  </div>
</header>
```

For non-home screens, replace the greeting with a page title:
```jsx
<header className="px-4 pt-6 pb-2">
  <h1 className="text-lg font-semibold text-white">Goals</h1>
  <p className="text-sm text-slate-400 mt-0.5">Track your progress</p>
</header>
```

---

## Entity Cards

Cards representing a person, vehicle, account, patient, inventory item, or any domain object.

```jsx
<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center gap-4">
  {/* Left: icon or avatar */}
  <div className="w-11 h-11 rounded-full bg-blue-500/15 flex items-center justify-center flex-shrink-0">
    <span className="text-blue-400 text-lg">🏦</span>
  </div>
  {/* Middle: name + details */}
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium text-white truncate">HDFC Savings</p>
    <p className="text-xs text-slate-400 mt-0.5">Primary account</p>
    <div className="flex gap-1.5 mt-1.5">
      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400">Savings</span>
      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Active</span>
    </div>
  </div>
  {/* Right: value */}
  <div className="text-right flex-shrink-0">
    <p className="text-sm font-bold font-mono text-white">₹6,45,000</p>
    <p className="text-[10px] text-emerald-400 mt-0.5">▲ 2.1%</p>
  </div>
</div>
```

**Tag pills (the tiny rounded badges):**
```
className="text-[10px] px-1.5 py-0.5 rounded-full bg-{color}-500/10 text-{color}-400"
```

Use different colors for different categories — type, status, priority, risk level.

---

## List Sections

A section within a screen containing a titled list of items.

```jsx
<section>
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-sm font-semibold text-white">Recent Transactions</h3>
    <button className="text-xs text-emerald-400">View all →</button>
  </div>
  <div className="space-y-2">
    {/* Entity cards or list rows here */}
  </div>
</section>
```

For simpler rows without the full entity card treatment:
```jsx
<div className="flex items-center justify-between py-3 border-b border-white/5">
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center">
      <span className="text-sm">☕</span>
    </div>
    <div>
      <p className="text-sm text-white">Coffee Shop</p>
      <p className="text-[10px] text-slate-500">Today, 9:15 AM</p>
    </div>
  </div>
  <p className="text-sm font-mono text-red-400">-₹350</p>
</div>
```

---

## Hero Metric

The big featured number at the top of a home screen (net worth, total points, OEE score, etc.).

```jsx
<section className="bg-gradient-to-br from-emerald-500/15 to-teal-500/10 rounded-2xl p-5 border border-emerald-500/20">
  <p className="text-xs text-slate-400 uppercase tracking-wide">Net Worth</p>
  <p className="text-3xl font-bold font-mono text-white mt-2">₹24,75,000</p>
  <p className="text-sm text-emerald-400 mt-1">▲ 8.7% vs last month</p>
  {/* Optional: stacked bar or sparkline below */}
</section>
```

This section should feel like the anchor of the screen — slightly larger, with a gradient tint or subtle border that distinguishes it from regular cards.

---

## Empty States

When a section has no data. Never leave a blank white space.

```jsx
<div className="flex flex-col items-center justify-center py-8 text-center">
  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
    <span className="text-2xl opacity-30">📄</span>
  </div>
  <p className="text-sm text-slate-400">No documents yet</p>
  <p className="text-xs text-slate-600 mt-1">Upload your first document to get started</p>
  <button className="mt-3 text-xs px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
    Upload
  </button>
</div>
```

Never use: "Coming soon", "TBD", "Lorem ipsum", or blank white space.

---

## Loading Skeleton

Pulsing placeholder shapes that match the layout of what will load.

```jsx
<div className="animate-pulse space-y-3">
  <div className="h-4 w-24 bg-slate-800 rounded" />
  <div className="h-8 w-40 bg-slate-800 rounded" />
  <div className="grid grid-cols-2 gap-3">
    <div className="h-20 bg-slate-800 rounded-xl" />
    <div className="h-20 bg-slate-800 rounded-xl" />
  </div>
</div>
```

Use `animate-pulse` from Tailwind. Match the skeleton shapes to the actual component dimensions.

---

## Color Strategy by Domain

Pick one primary accent color and apply it to: active nav, hero metric delta, primary buttons, chart highlights, positive badges.

Pick one danger color for: negative deltas, critical alerts, overdue badges.

The rest comes from the palette — muted (`text-slate-400`), surface (`bg-white/5`), borders (`border-white/10`).

Suggested primary accents:
- Finance: emerald-500
- Healthcare: teal-500
- Grocery: green-600
- Travel: amber-500
- Sports: purple-500
- Automotive: cyan-500
- Manufacturing: orange-500
- Tax/Compliance: indigo-500
- Audit/Risk: sky-500

These are starting points. The user's preference overrides any suggestion.
