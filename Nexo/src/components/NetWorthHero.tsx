import { useStore, formatINR } from '../store'
import Sparkline from './Sparkline'

interface MetricProps {
  label: string
  value: string
  tone: 'emerald' | 'amber' | 'blue' | 'purple'
}

function Metric({ label, value, tone }: MetricProps) {
  const toneClass = {
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
  }[tone]
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">{label}</div>
      <div className={`text-lg font-semibold font-mono ${toneClass}`}>{value}</div>
    </div>
  )
}

export default function NetWorthHero() {
  const accounts = useStore((s) => s.accounts)
  const holdings = useStore((s) => s.holdings)
  const loans = useStore((s) => s.loans)
  const propertyAssets = useStore((s) => s.propertyAssets)

  const bankingTotal = accounts
    .filter((a) => a.type !== 'credit_card')
    .reduce((sum, a) => sum + a.balance, 0)
  const creditOutstanding = accounts
    .filter((a) => a.type === 'credit_card')
    .reduce((sum, a) => sum + a.balance, 0)
  const investmentTotal = holdings.reduce((sum, h) => sum + h.currentValue, 0)
  const loanOutstanding = loans
    .filter((l) => l.status === 'active')
    .reduce((sum, l) => sum + l.outstandingBalance, 0)
  const propertyTotal = propertyAssets.reduce((sum, p) => sum + p.estimatedValue, 0)

  const totalAssets = bankingTotal + investmentTotal + propertyTotal
  const totalLiabilities = creditOutstanding + loanOutstanding
  const netWorth = totalAssets - totalLiabilities

  // Synthetic 30-point sparkline
  const base = netWorth * 0.82
  const sparkData = Array.from({ length: 30 }, (_, i) => {
    const t = i / 29
    const trend = base + (netWorth - base) * t
    const noise = (Math.sin(i * 2.1) + Math.cos(i * 1.5)) * (netWorth * 0.008)
    return Math.max(0.01, (trend + noise) / 1000)
  })
  sparkData[29] = netWorth / 1000

  const deltaAmt = netWorth - base
  const deltaPct = base > 0 ? (deltaAmt / base) * 100 : 0
  const positive = deltaPct >= 0

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-slate-900/40 border border-white/10 p-8">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      <div className="relative flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Total Net Worth</div>
          <div className="text-5xl font-bold font-mono text-white tracking-tight">
            {formatINR(netWorth)}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span
              className={[
                'inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full',
                positive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400',
              ].join(' ')}
            >
              {positive ? '▲' : '▼'} {positive ? '+' : ''}{deltaPct.toFixed(2)}%
            </span>
            <span className="text-xs text-slate-400">vs last month</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-[11px] uppercase tracking-wider text-slate-500">30-day trend</div>
          <Sparkline data={sparkData} width={320} height={90} />
        </div>
      </div>

      <div className="relative mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
        <Metric label="Total Assets" value={formatINR(totalAssets)} tone="emerald" />
        <Metric label="Investments" value={formatINR(investmentTotal)} tone="purple" />
        <Metric label="Real Estate" value={formatINR(propertyTotal)} tone="blue" />
        <Metric label="Total Debt" value={formatINR(totalLiabilities)} tone="amber" />
      </div>
    </div>
  )
}
