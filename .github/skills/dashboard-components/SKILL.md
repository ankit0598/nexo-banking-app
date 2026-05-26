# Dashboard Components

Reusable patterns for building data-rich screens. Read this skill before building any screen that has KPI cards, charts, data tables, metric breakdowns, or analytics views.

These patterns assume a dark theme (bg-slate-950) as defined in the project instructions. All Tailwind classes shown here are the default — adapt colors to match the domain's palette.

---

## KPI Cards

A KPI card shows one key metric with supporting context. This is the most common component — get it right.

**Structure (top to bottom):**
1. Label — muted, small, uppercase
2. Value — large, monospace, bold
3. Delta indicator — directional arrow + change amount or percentage
4. Sparkline or mini visual (optional)

**Tailwind implementation:**
```jsx
<div className="bg-emerald-500/10 rounded-xl p-4">
  <p className="text-xs text-slate-400 uppercase tracking-wide">Revenue</p>
  <p className="text-2xl font-bold font-mono text-white mt-1">₹24,75,000</p>
  <p className="text-xs text-emerald-400 mt-1">▲ 12.4% vs last month</p>
</div>
```

**Delta color logic:**
- ▲ green (`text-emerald-400`) when up is good: revenue, net worth, engagement, OEE
- ▼ red (`text-red-400`) when down is bad: same metrics declining
- ▲ red (`text-red-400`) when up is bad: expenses, downtime, debt, churn
- ▼ green (`text-emerald-400`) when down is good: costs, defects, wait times

**Layout:** `grid grid-cols-2 gap-3` for 2-column, `grid grid-cols-4 gap-3` for 4-column on wider screens.

**Each KPI card gets its own tint color:**
```
bg-emerald-500/10  — positive metric
bg-blue-500/10     — neutral/info metric  
bg-amber-500/10    — warning metric
bg-red-500/10      — negative metric
bg-purple-500/10   — category metric
bg-cyan-500/10     — secondary metric
```

Never make all KPI cards the same color. Each card should be visually distinct.

---

## Stacked Bar Chart

A horizontal bar showing proportional breakdown of a total.

**Structure:**
```jsx
<div className="flex h-2 rounded-full overflow-hidden gap-0.5">
  <div className="bg-blue-500" style={{ width: '34%' }} />
  <div className="bg-emerald-500" style={{ width: '28%' }} />
  <div className="bg-amber-500" style={{ width: '22%' }} />
  <div className="bg-purple-500" style={{ width: '16%' }} />
</div>
```

**Rules:**
- Height: `h-2` or `h-3` — thin and sleek, not chunky
- Each segment gets a fixed color that NEVER changes across the app
- First segment: `rounded-l-full`, last: `rounded-r-full` (or use `rounded-full overflow-hidden` on parent)
- Always pair with a legend below

**Legend:**
```jsx
<div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
  <div className="flex items-center gap-1.5">
    <div className="w-2 h-2 rounded-full bg-blue-500" />
    <span className="text-xs text-slate-400">Bank — ₹42L</span>
  </div>
  {/* repeat for each category */}
</div>
```

---

## SVG Donut Chart

A circular chart showing proportional breakdown. Build with SVG — no chart libraries.

**SVG construction:**
```jsx
<svg viewBox="0 0 100 100" className="w-32 h-32">
  {/* Background circle */}
  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" 
    className="text-slate-800" strokeWidth="12" />
  {/* Data segment — calculate strokeDasharray and strokeDashoffset */}
  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor"
    className="text-emerald-500" strokeWidth="12" strokeLinecap="round"
    strokeDasharray={`${percentage * 2.51} ${251 - percentage * 2.51}`}
    transform="rotate(-90 50 50)" />
  {/* Center label */}
  <text x="50" y="48" textAnchor="middle" className="fill-white text-lg font-bold font-mono">₹24.7L</text>
  <text x="50" y="60" textAnchor="middle" className="fill-slate-400 text-[8px]">Total</text>
</svg>
```

**Layout:** Donut on left, legend list on right. Use `flex items-center gap-6`.

---

## Data Table

A styled table showing records with status indicators. Never use plain HTML `<table>` — use div-based grid.

**Structure:**
```jsx
<div className="bg-white/5 rounded-xl overflow-hidden">
  {/* Header */}
  <div className="grid grid-cols-4 gap-4 px-4 py-3 text-xs text-slate-400 uppercase tracking-wide border-b border-white/10">
    <span>Name</span><span>Status</span><span>Score</span><span>Trend</span>
  </div>
  {/* Rows */}
  <div className="grid grid-cols-4 gap-4 px-4 py-3 text-sm text-white border-b border-white/5">
    <span>Press Line 1</span>
    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 w-fit">Active</span>
    <span className="font-mono">82%</span>
    <div className="flex items-end gap-0.5 h-4">{/* sparkline bars */}</div>
  </div>
</div>
```

**Status badges — always use pill badges, never plain text:**
```
Active/Good:   bg-emerald-500/10 text-emerald-400
Warning/Fair:  bg-amber-500/10 text-amber-400  
Critical/Bad:  bg-red-500/10 text-red-400
Pending/Info:  bg-blue-500/10 text-blue-400
```

**Inline progress bars in table cells:**
```jsx
<div className="w-full bg-slate-800 rounded-full h-1.5">
  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '72%' }} />
</div>
```

---

## Metric Comparison Cards

Two cards side by side comparing related values (income vs expenses, assets vs liabilities).

```jsx
<div className="grid grid-cols-2 gap-3">
  <div className="bg-emerald-500/10 rounded-xl p-4">
    <p className="text-xs text-emerald-400 uppercase tracking-wide">Assets</p>
    <p className="text-xl font-bold font-mono text-white mt-1">₹1.32Cr</p>
    <p className="text-xs text-emerald-400 mt-1">▲ ₹3.2L</p>
  </div>
  <div className="bg-red-500/10 rounded-xl p-4">
    <p className="text-xs text-red-400 uppercase tracking-wide">Liabilities</p>
    <p className="text-xl font-bold font-mono text-white mt-1">₹7.5L</p>
    <p className="text-xs text-red-400 mt-1">Home loan EMI</p>
  </div>
</div>
```

Use complementary semantic colors — green vs red, blue vs amber. Never make both the same color.

---

## Alert / Insight / Nudge Card

A callout card for smart insights, warnings, reminders, or AI-driven nudges.

```jsx
<div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
    <span className="text-amber-400 text-sm">!</span>
  </div>
  <div>
    <p className="text-sm font-medium text-amber-300">SIP due in 3 days</p>
    <p className="text-xs text-slate-400 mt-0.5">₹12,000 HDFC Mid-Cap · Tap to review</p>
  </div>
</div>
```

**Severity colors:**
- Insight/suggestion: `amber-500/10` border `amber-500/20` text `amber-300`
- Warning/urgent: `red-500/10` border `red-500/20` text `red-300`
- Info/neutral: `blue-500/10` border `blue-500/20` text `blue-300`
- Success/positive: `emerald-500/10` border `emerald-500/20` text `emerald-300`

---

## Sparkline / Mini Bar Chart

A small inline chart used inside KPI cards or table cells. No axes, no labels — just the data shape.

```jsx
<div className="flex items-end gap-0.5 h-8">
  {data.map((value, i) => (
    <div
      key={i}
      className={`flex-1 rounded-t-sm ${i === data.length - 1 ? 'bg-emerald-500' : 'bg-emerald-500/30'}`}
      style={{ height: `${(value / maxValue) * 100}%` }}
    />
  ))}
</div>
```

**Rules:**
- 10–12 data points (bars or line segments)
- Latest/current bar: full accent color
- Historical bars: same color at 30% opacity
- Height: `h-6` to `h-10` depending on context

---

## Period Selector

Toggle for time ranges at the top of a section.

```jsx
<div className="flex gap-1 bg-white/5 rounded-lg p-1">
  <button className="text-xs px-3 py-1 rounded-md bg-emerald-500 text-white">7 days</button>
  <button className="text-xs px-3 py-1 rounded-md text-slate-400 hover:text-white">30 days</button>
  <button className="text-xs px-3 py-1 rounded-md text-slate-400 hover:text-white">All time</button>
</div>
```

---

## Section Headers

Every data section needs a header with title and optional action.

```jsx
<div className="flex items-center justify-between mb-3">
  <h3 className="text-sm font-semibold text-white">Asset Health</h3>
  <button className="text-xs text-emerald-400 hover:text-emerald-300">View all →</button>
</div>
```
