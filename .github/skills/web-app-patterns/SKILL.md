# Web App Patterns

Reusable patterns for building browser-based web app screens. Read this skill when the platform is **Web** or **Web + Mobile**. For mobile-only builds, read `mobile-app-patterns.md` instead.

These patterns assume a dark theme (bg-slate-950) as defined in the project instructions.

---

## App Shell — Sidebar Layout

The standard web app shell: fixed sidebar on the left, main content area on the right.

```jsx
// App.tsx
export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardScreen />} />
          <Route path="/patients" element={<PatientsScreen />} />
        </Routes>
      </main>
    </div>
  )
}
```

**Sidebar width:** `w-64` (256px) — fixed, never collapses for prototypes.
**Main area:** `flex-1 overflow-y-auto` — fills remaining width, scrolls independently.

---

## Sidebar

Left-hand navigation. Groups related items with section headers.

```jsx
export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-white/10 flex flex-col">
      {/* Logo / app name */}
      <div className="px-5 py-5 border-b border-white/10">
        <h1 className="text-base font-semibold text-white">AppName</h1>
        <p className="text-xs text-slate-500 mt-0.5">Dashboard</p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {/* Section header */}
        <p className="text-[10px] text-slate-500 uppercase tracking-widest px-2 mb-2">Overview</p>

        {/* Import icons from lucide-react — adapt to the app's domain */}
        {/* import { LayoutDashboard, BarChart3, Users, Bell } from 'lucide-react' */}
        <NavItem icon={LayoutDashboard} label="Dashboard" path="/" active={location.pathname === '/'} />
        <NavItem icon={BarChart3} label="Analytics" path="/analytics" active={location.pathname === '/analytics'} />

        <p className="text-[10px] text-slate-500 uppercase tracking-widest px-2 mt-4 mb-2">Management</p>
        <NavItem icon={Users} label="Patients" path="/patients" active={location.pathname.startsWith('/patients')} />
        <NavItem icon={Bell} label="Alerts" path="/alerts" active={location.pathname === '/alerts'} />
      </nav>

      {/* Bottom: user profile */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5">
          {/* import { User } from 'lucide-react' */}
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <User size={15} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">Neha Sharma</p>
            <p className="text-[10px] text-slate-500 truncate">Care Coordinator</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

// NavItem component — ALWAYS use Lucide React icons, never emoji or unicode
import { LucideIcon } from 'lucide-react'

interface NavItemProps {
  icon: LucideIcon
  label: string
  path: string
  active: boolean
}

function NavItem({ icon: Icon, label, path, active }: NavItemProps) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(path)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? 'bg-emerald-500/15 text-emerald-400'
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={16} strokeWidth={active ? 2 : 1.5} />
      <span>{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />}
    </button>
  )
}
```

---

## Page Layout

Each page/screen inside the main content area.

```jsx
export default function DashboardScreen() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Dashboard</h2>
          <p className="text-sm text-slate-400 mt-0.5">Week of 14 April 2025</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period selector or action buttons */}
          <button className="text-sm px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium">
            Export
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        {/* KPI cards */}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          {/* Primary chart or table */}
        </div>
        <div>
          {/* Secondary panel */}
        </div>
      </div>
    </div>
  )
}
```

**Layout grid options:**
- KPI row: `grid grid-cols-4 gap-4` (4 equal KPI cards)
- Two-thirds + one-third split: `grid grid-cols-3 gap-4` with `col-span-2` and `col-span-1`
- Half + half: `grid grid-cols-2 gap-4`
- Full width table or chart: no grid, just `w-full`
- Max content width: `max-w-7xl mx-auto` — keeps wide screens readable

---

## Top Navigation (alternative to sidebar)

Use when the app has fewer sections or a cleaner horizontal layout is preferred.

```jsx
export default function TopNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const tabs = [
    { label: 'Overview', path: '/' },
    { label: 'Assets', path: '/assets' },
    { label: 'Alerts', path: '/alerts' },
    { label: 'Reports', path: '/reports' },
  ]

  return (
    <header className="bg-slate-900 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            {/* Replace with your app's logo or a Lucide icon e.g. <Zap size={14} className="text-emerald-400" /> */}
            <span className="text-emerald-400 text-sm font-bold">A</span>
          </div>
          <span className="text-sm font-semibold text-white">AppName</span>
        </div>

        {/* Nav tabs */}
        <nav className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                location.pathname === tab.path
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right: user / actions */}
        <div className="flex items-center gap-3">
          {/* import { Bell, User } from 'lucide-react' */}
          <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <Bell size={15} />
          </button>
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <User size={15} />
          </div>
        </div>
      </div>
    </header>
  )
}
```

---

## Data Table (Web)

Web tables can show more columns and denser data than mobile.

```jsx
<div className="bg-white/5 rounded-xl overflow-hidden">
  {/* Table header */}
  <div className="grid grid-cols-5 gap-4 px-5 py-3 text-xs text-slate-400 uppercase tracking-wide border-b border-white/10 bg-white/3">
    <span>Patient</span>
    <span>Status</span>
    <span>Risk Score</span>
    <span>Last Visit</span>
    <span>Next Action</span>
  </div>

  {/* Rows */}
  {patients.map(p => (
    <div key={p.id} className="grid grid-cols-5 gap-4 px-5 py-3.5 border-b border-white/5 hover:bg-white/3 cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-white">
          {p.initials}
        </div>
        <div>
          <p className="text-sm text-white font-medium">{p.name}</p>
          <p className="text-xs text-slate-500">{p.id}</p>
        </div>
      </div>
      <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 self-center w-fit">{p.status}</span>
      <div className="self-center">
        <p className="text-sm font-mono text-white">{p.riskScore}</p>
        <div className="w-full bg-slate-800 rounded-full h-1 mt-1">
          <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${p.riskScore}%` }} />
        </div>
      </div>
      <span className="text-sm text-slate-400 self-center">{p.lastVisit}</span>
      <span className="text-sm text-slate-300 self-center">{p.nextAction}</span>
    </div>
  ))}
</div>
```

---

## Detail Panel / Drawer

A right-side panel that slides in when a row or card is clicked. Avoids full page navigations for quick-view flows.

```jsx
{selectedItem && (
  <div className="fixed inset-y-0 right-0 w-96 bg-slate-900 border-l border-white/10 overflow-y-auto z-30">
    <div className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-white">{selectedItem.name}</h3>
        <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-white">✕</button>
      </div>
      {/* Detail content */}
    </div>
  </div>
)}
```

---

## Responsive — Web + Mobile

When building for both platforms, the layout switches at the `lg` breakpoint.

```jsx
<div className="flex min-h-screen bg-slate-950">
  {/* Sidebar — desktop only */}
  <aside className="hidden lg:flex w-64 ...">
    <Sidebar />
  </aside>

  <main className="flex-1 flex flex-col">
    {/* Top bar — mobile only */}
    <header className="lg:hidden ...">
      <MobileTopBar />
    </header>

    {/* Content */}
    <div className="flex-1 p-4 lg:p-6">
      <Routes>...</Routes>
    </div>

    {/* Bottom nav — mobile only */}
    <nav className="lg:hidden sticky bottom-0 ...">
      <BottomNav />
    </nav>
  </main>
</div>
```

- Mobile: top bar + bottom nav, single-column layout, `px-4`
- Desktop: sidebar, multi-column grid, `max-w-7xl px-6`
- Breakpoint: `lg` (1024px)
- Cards: `grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4`
