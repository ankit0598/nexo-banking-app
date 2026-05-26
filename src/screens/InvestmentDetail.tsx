import { useParams, Link } from 'react-router-dom'
import { useStore, formatINR } from '../store'
import Sparkline from '../components/Sparkline'

interface StatCardProps {
  label: string
  value: string
  tone: 'emerald' | 'blue' | 'red' | 'white'
}

function StatCard({ label, value, tone }: StatCardProps) {
  const toneClass = {
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    red: 'text-red-400',
    white: 'text-white',
  }[tone]
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">{label}</div>
      <div className={`text-lg font-mono font-semibold ${toneClass}`}>{value}</div>
    </div>
  )
}

export default function InvestmentDetail() {
  const { id } = useParams<{ id: string }>()
  const holding = useStore((s) => s.holdings.find((h) => h.id === id))
  const sips = useStore((s) => s.sips.filter((s) => s.holdingId === id))

  if (!holding) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-slate-400 mb-2">Holding not found</div>
        <Link to="/investments" className="text-blue-400 text-sm hover:underline">
          ← Back to Investments
        </Link>
      </div>
    )
  }

  const isPositive = holding.totalGainLoss >= 0
  const isDayPositive = holding.dayChange >= 0

  // Synthetic 30-point sparkline
  const baseVal = holding.investedAmount / 1000
  const currentVal = holding.currentValue / 1000
  const sparkData = Array.from({ length: 30 }, (_, i) => {
    const t = i / 29
    const trend = baseVal + (currentVal - baseVal) * t
    const noise = (Math.sin(i * 2.4) + Math.cos(i * 1.7)) * (currentVal * 0.02)
    return Math.max(0.01, trend + noise)
  })
  sparkData[29] = currentVal

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/investments" className="text-slate-400 hover:text-white transition-colors">
          ← Investments
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-white">{holding.name}</span>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 via-indigo-600/10 to-slate-900/40 border border-white/10 p-6">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {holding.symbol && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                  {holding.symbol}
                </span>
              )}
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400">
                {holding.assetClass.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">{holding.name}</h1>
            <div className="text-4xl font-mono font-bold text-white mt-2">
              {formatINR(holding.currentValue)}
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className={`text-sm font-mono px-2 py-0.5 rounded-full ${
                  isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                }`}
              >
                {isPositive ? '▲ +' : '▼ '}
                {formatINR(Math.abs(holding.totalGainLoss))} ({isPositive ? '+' : ''}
                {holding.totalGainLossPct.toFixed(2)}%)
              </span>
              {holding.dayChange !== 0 && (
                <span
                  className={`text-xs font-mono ${
                    isDayPositive ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {isDayPositive ? '▲ +' : '▼ '}
                  {formatINR(Math.abs(holding.dayChange))} today
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">
              30-day trend
            </div>
            <Sparkline
              data={sparkData}
              width={280}
              height={80}
              stroke={isPositive ? '#10b981' : '#ef4444'}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Amount Invested" value={formatINR(holding.investedAmount)} tone="blue" />
        <StatCard label="Current Value" value={formatINR(holding.currentValue)} tone="white" />
        <StatCard
          label="Total P&L"
          value={`${isPositive ? '+' : ''}${formatINR(Math.abs(holding.totalGainLoss))}`}
          tone={isPositive ? 'emerald' : 'red'}
        />
        <StatCard
          label="Day Change"
          value={holding.dayChange === 0 ? '—' : `${isDayPositive ? '+' : ''}${formatINR(Math.abs(holding.dayChange))}`}
          tone={holding.dayChange === 0 ? 'white' : isDayPositive ? 'emerald' : 'red'}
        />
      </div>

      {/* Price / Units */}
      {holding.units > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Units Held" value={holding.units.toLocaleString('en-IN')} tone="white" />
          <StatCard label="Avg Buy Price" value={formatINR(holding.avgBuyPrice)} tone="blue" />
          <StatCard label="Current Price" value={formatINR(holding.currentPrice)} tone="white" />
        </div>
      )}

      {/* SIP details */}
      {sips.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="text-sm font-semibold text-white mb-4">SIP Details</div>
          <div className="space-y-3">
            {sips.map((sip) => (
              <div
                key={sip.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
              >
                <div>
                  <div className="text-sm font-medium text-white">
                    {sip.frequency === 'monthly' ? 'Monthly SIP' : 'Quarterly SIP'}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Next:{' '}
                    {new Date(sip.nextDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-mono font-bold text-emerald-400">
                    {formatINR(sip.amount)}
                  </div>
                  <div
                    className={`text-[10px] px-1.5 py-0.5 rounded-full mt-1 ${
                      sip.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {sip.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
