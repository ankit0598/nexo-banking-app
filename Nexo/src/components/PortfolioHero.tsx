import { useStore, formatINR } from '../store'

interface MetricProps {
  label: string
  value: string
  tone: 'emerald' | 'blue' | 'red' | 'purple'
  mono?: boolean
}

function Metric({ label, value, tone, mono = true }: MetricProps) {
  const toneClass = {
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
  }[tone]
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{label}</div>
      <div className={`text-base font-semibold ${mono ? 'font-mono' : ''} ${toneClass}`}>{value}</div>
    </div>
  )
}

export default function PortfolioHero() {
  const holdings = useStore((s) => s.holdings)

  const totalInvested = holdings.reduce((sum, h) => sum + h.investedAmount, 0)
  const totalCurrent = holdings.reduce((sum, h) => sum + h.currentValue, 0)
  const totalGainLoss = totalCurrent - totalInvested
  const totalGainLossPct = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0
  const totalDayChange = holdings.reduce((sum, h) => sum + h.dayChange, 0)

  const isPositive = totalGainLoss >= 0
  const isDayPositive = totalDayChange >= 0

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 via-indigo-600/10 to-slate-900/40 border border-white/10 p-6">
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />
      <div className="relative">
        <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Total Portfolio Value</div>
        <div className="text-4xl font-bold font-mono text-white tracking-tight mb-2">
          {formatINR(totalCurrent)}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full ${
              isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
            }`}
          >
            {isPositive ? '▲ +' : '▼ '}
            {formatINR(Math.abs(totalGainLoss))} ({totalGainLossPct.toFixed(2)}%)
          </span>
          <span className="text-xs text-slate-500">all-time returns</span>
          <span
            className={`inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full ${
              isDayPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}
          >
            {isDayPositive ? '▲ +' : '▼ '}
            {formatINR(Math.abs(totalDayChange))} today
          </span>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 border-t border-white/10">
        <Metric label="Amount Invested" value={formatINR(totalInvested)} tone="blue" />
        <Metric
          label="Total P&L"
          value={`${isPositive ? '+' : ''}${formatINR(Math.abs(totalGainLoss))}`}
          tone={isPositive ? 'emerald' : 'red'}
        />
        <Metric
          label="Day Change"
          value={`${isDayPositive ? '+' : ''}${formatINR(Math.abs(totalDayChange))}`}
          tone={isDayPositive ? 'emerald' : 'red'}
        />
        <Metric label="Holdings" value={String(holdings.length)} tone="purple" mono={false} />
      </div>
    </div>
  )
}
