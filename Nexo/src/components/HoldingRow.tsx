import { Link } from 'react-router-dom'
import { formatINR } from '../store'
import type { Holding } from '../types'

const assetClassLabel: Record<string, string> = {
  equity: 'Equity',
  mutual_fund: 'Mutual Fund',
  gold: 'Gold',
  fd: 'FD',
  ppf: 'EPF / PPF',
}

const assetClassColor: Record<string, string> = {
  equity: 'text-blue-400 bg-blue-500/10',
  mutual_fund: 'text-purple-400 bg-purple-500/10',
  gold: 'text-amber-400 bg-amber-500/10',
  fd: 'text-teal-400 bg-teal-500/10',
  ppf: 'text-emerald-400 bg-emerald-500/10',
}

export interface HoldingRowProps {
  holding: Holding
}

export default function HoldingRow({ holding }: HoldingRowProps) {
  const isPositive = holding.totalGainLoss >= 0
  const isDayPositive = holding.dayChange >= 0

  return (
    <Link
      to={`/investments/${holding.id}`}
      className="flex items-center gap-4 px-4 py-3 bg-white/5 hover:bg-white/[0.08] rounded-xl border border-white/5 transition-colors cursor-pointer"
    >
      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sm text-white shrink-0">
        {holding.symbol ? holding.symbol.slice(0, 2) : holding.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">{holding.name}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${assetClassColor[holding.assetClass]}`}
          >
            {assetClassLabel[holding.assetClass]}
          </span>
          {holding.units > 1 && (
            <span className="text-[11px] text-slate-500 font-mono">
              {holding.units.toLocaleString('en-IN')} units
            </span>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-mono font-semibold text-white">{formatINR(holding.currentValue)}</div>
        <div className="flex items-center gap-2 justify-end mt-0.5">
          <span className={`text-xs font-mono ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{holding.totalGainLossPct.toFixed(2)}%
          </span>
          {holding.dayChange !== 0 && (
            <span className={`text-[10px] font-mono ${isDayPositive ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
              ({isDayPositive ? '+' : ''}{formatINR(Math.abs(holding.dayChange))} today)
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
