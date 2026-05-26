import type { Transaction } from '../types'
import { formatINR } from '../store'
import CategoryPill, { categoryColor } from './CategoryPill'

interface TransactionRowProps {
  tx: Transaction
}

const formatDate = (iso: string): string => {
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) +
    ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export default function TransactionRow({ tx }: TransactionRowProps) {
  const isCredit = tx.type === 'credit'
  const initial = tx.merchant.charAt(0).toUpperCase()
  const color = categoryColor[tx.category]

  return (
    <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0"
        style={{ backgroundColor: `${color}22`, color }}
      >
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white truncate">{tx.merchant}</span>
          <CategoryPill category={tx.category} />
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5 truncate">
          {tx.mode} · {formatDate(tx.date)}
          {tx.description ? ` · ${tx.description}` : ''}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className={`text-sm font-semibold font-mono ${isCredit ? 'text-emerald-400' : 'text-white'}`}>
          {isCredit ? '+' : '−'} {formatINR(tx.amount)}
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 capitalize">{tx.status}</div>
      </div>
    </div>
  )
}
