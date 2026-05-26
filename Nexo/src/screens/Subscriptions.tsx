import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore, formatINR } from '../store'
import SubscriptionCard from '../components/SubscriptionCard'
import type { SubscriptionCategory } from '../types'

type FilterTab = 'all' | SubscriptionCategory

const tabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'productivity', label: 'Productivity' },
  { key: 'health', label: 'Health' },
  { key: 'cloud', label: 'Cloud' },
]

const categoryColors: Record<SubscriptionCategory, string> = {
  entertainment: '#a855f7',
  productivity: '#3b82f6',
  health: '#10b981',
  cloud: '#06b6d4',
  utilities: '#f59e0b',
  other: '#64748b',
}

export default function Subscriptions() {
  const subscriptions = useStore((s) => s.subscriptions)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const active = subscriptions.filter((s) => s.status === 'active')
  const cancelled = subscriptions.filter((s) => s.status === 'cancelled')

  const totalMonthly = active.reduce((sum, s) => {
    return sum + (s.frequency === 'annual' ? Math.round(s.amount / 12) : s.amount)
  }, 0)
  const totalAnnual = active.reduce((sum, s) => {
    return sum + (s.frequency === 'annual' ? s.amount : s.amount * 12)
  }, 0)
  const pctOfIncome = ((totalMonthly / 185000) * 100).toFixed(1)

  const filtered = subscriptions.filter(
    (s) => activeTab === 'all' || s.category === activeTab,
  )

  // Bar chart data by category (monthly equivalent, active only)
  const categoryTotals = new Map<SubscriptionCategory, number>()
  for (const s of active) {
    const monthly = s.frequency === 'annual' ? Math.round(s.amount / 12) : s.amount
    categoryTotals.set(s.category, (categoryTotals.get(s.category) || 0) + monthly)
  }
  const barData = Array.from(categoryTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([cat, val]) => ({ cat, val }))
  const maxBar = Math.max(...barData.map((b) => b.val), 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
          <p className="text-sm text-slate-400 mt-1">Track and manage recurring charges</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Monthly Cost" value={formatINR(totalMonthly)} tone="purple" />
        <KpiCard label="Annual Cost" value={formatINR(totalAnnual)} tone="amber" />
        <KpiCard label="Active Subs" value={String(active.length)} tone="blue" />
        <KpiCard label="% of Income" value={`${pctOfIncome}%`} tone={parseFloat(pctOfIncome) > 5 ? 'red' : 'emerald'} />
      </div>

      {/* Category bar chart */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
        <h2 className="text-base font-semibold text-white mb-4">Monthly Spend by Category</h2>
        <div className="space-y-3">
          {barData.map(({ cat, val }) => (
            <div key={cat} className="flex items-center gap-3">
              <span className="text-xs text-slate-400 w-28 shrink-0 capitalize">{cat}</span>
              <div className="flex-1 h-6 bg-white/5 rounded-md overflow-hidden">
                <div
                  className="h-full rounded-md flex items-center justify-end pr-2 transition-all"
                  style={{
                    width: `${(val / maxBar) * 100}%`,
                    backgroundColor: categoryColors[cat],
                  }}
                >
                  <span className="text-xs font-mono font-semibold text-white">{formatINR(val)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-emerald-500 text-white'
                : 'bg-white/8 text-slate-400 hover:text-white hover:bg-white/12'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active subscriptions */}
      <div className="space-y-3">
        {filtered.filter((s) => s.status === 'active').map((sub) => (
          <SubscriptionCard key={sub.id} subscription={sub} />
        ))}
        {filtered.filter((s) => s.status === 'active').length === 0 && (
          <p className="text-sm text-slate-500 text-center py-6">No active subscriptions in this category.</p>
        )}
      </div>

      {/* Cancelled */}
      {cancelled.length > 0 && activeTab === 'all' && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-3">Cancelled</h3>
          <div className="space-y-3">
            {cancelled.map((sub) => (
              <SubscriptionCard key={sub.id} subscription={sub} />
            ))}
          </div>
        </div>
      )}

      {/* Tip */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
        <span className="text-xl">💡</span>
        <div>
          <p className="text-sm font-semibold text-amber-300">Spending Insight</p>
          <p className="text-xs text-slate-400 mt-1">
            You're spending {formatINR(totalMonthly)}/month ({pctOfIncome}% of income) on subscriptions.
            Annual cost: {formatINR(totalAnnual)}. Review unused ones to free up savings capacity.
          </p>
          <Link to="/scenarios" className="text-xs text-amber-400 underline mt-2 block">
            Model your savings potential →
          </Link>
        </div>
      </div>
    </div>
  )
}

interface KpiCardProps {
  label: string
  value: string
  tone: 'purple' | 'amber' | 'blue' | 'red' | 'emerald'
}

function KpiCard({ label, value, tone }: KpiCardProps) {
  const toneMap = {
    purple: 'bg-purple-500/10 text-purple-300',
    amber: 'bg-amber-500/10 text-amber-300',
    blue: 'bg-blue-500/10 text-blue-300',
    red: 'bg-red-500/10 text-red-300',
    emerald: 'bg-emerald-500/10 text-emerald-300',
  }
  return (
    <div className={`rounded-xl p-4 ${toneMap[tone]}`}>
      <p className="text-xs opacity-75">{label}</p>
      <p className="text-xl font-bold font-mono mt-1">{value}</p>
    </div>
  )
}
