import { useStore, formatINR } from '../store'
import DonutChart from '../components/DonutChart'
import BarChart from '../components/BarChart'
import { categoryColor } from '../components/CategoryPill'
import type { Category, Transaction } from '../types'

const categoryLabel: Record<Category, string> = {
  food: 'Food',
  transport: 'Transport',
  shopping: 'Shopping',
  bills: 'Bills',
  entertainment: 'Entertainment',
  salary: 'Salary',
  transfer: 'Transfer',
  other: 'Other',
}

export default function Insights() {
  const transactions = useStore((s) => s.transactions)
  const debits = transactions.filter((t) => t.type === 'debit' && t.category !== 'transfer')
  const credits = transactions.filter((t) => t.type === 'credit')

  const totalSpend = debits.reduce((s, t) => s + t.amount, 0)
  const totalIncome = credits.reduce((s, t) => s + t.amount, 0)
  const savings = totalIncome - totalSpend
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0

  // Donut: spend by category
  const byCategory = new Map<Category, number>()
  for (const t of debits) {
    byCategory.set(t.category, (byCategory.get(t.category) || 0) + t.amount)
  }
  const donutData = Array.from(byCategory.entries())
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => ({ label: categoryLabel[k], value: v, color: categoryColor[k] }))

  // Bar: weekly spend over last 4 weeks
  const weeks = weeklySpend(debits)

  // Top merchants
  const merchantMap = new Map<string, number>()
  for (const t of debits) {
    merchantMap.set(t.merchant, (merchantMap.get(t.merchant) || 0) + t.amount)
  }
  const topMerchants = Array.from(merchantMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Insights</h1>
        <p className="text-sm text-slate-400 mt-1">Your spending patterns over the last 30 days</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Income" value={formatINR(totalIncome)} tone="emerald" />
        <Stat label="Spending" value={formatINR(totalSpend)} tone="amber" />
        <Stat label="Net Savings" value={formatINR(savings)} tone={savings >= 0 ? 'blue' : 'red'} />
        <Stat label="Savings Rate" value={`${savingsRate.toFixed(1)}%`} tone="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Spend by Category</h2>
          <DonutChart
            data={donutData}
            centerValue={formatINR(totalSpend)}
            centerLabel="30-day total"
            size={220}
          />
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Weekly Spending</h2>
          <BarChart data={weeks} color="#3b82f6" />
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
        <h2 className="text-base font-semibold text-white mb-4">Top Merchants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {topMerchants.map(([name, amt], i) => (
            <div key={name} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5">
              <div className="w-7 h-7 rounded-full bg-blue-500/15 text-blue-300 flex items-center justify-center text-xs font-bold font-mono">
                {i + 1}
              </div>
              <div className="flex-1 text-sm text-white truncate">{name}</div>
              <div className="text-sm font-semibold font-mono text-white">{formatINR(amt)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function weeklySpend(txs: Transaction[]): { label: string; value: number }[] {
  const now = new Date('2026-05-25T10:30:00+05:30')
  const buckets: { label: string; from: Date; to: Date; value: number }[] = []
  for (let i = 3; i >= 0; i--) {
    const to = new Date(now)
    to.setDate(to.getDate() - i * 7)
    const from = new Date(to)
    from.setDate(from.getDate() - 6)
    buckets.push({ label: `W-${i}`, from, to, value: 0 })
  }
  for (const t of txs) {
    const td = new Date(t.date)
    for (const b of buckets) {
      if (td >= b.from && td <= b.to) {
        b.value += t.amount
        break
      }
    }
  }
  return buckets.map((b) => ({ label: b.label, value: b.value }))
}

interface StatProps {
  label: string
  value: string
  tone: 'emerald' | 'amber' | 'blue' | 'red' | 'purple'
}

function Stat({ label, value, tone }: StatProps) {
  const cls = {
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    blue: 'bg-blue-500/10 text-blue-400',
    red: 'bg-red-500/10 text-red-400',
    purple: 'bg-purple-500/10 text-purple-400',
  }[tone]
  return (
    <div className={`${cls} rounded-xl p-4`}>
      <div className="text-[11px] uppercase tracking-wider opacity-80 mb-1">{label}</div>
      <div className="text-xl font-bold font-mono">{value}</div>
    </div>
  )
}
