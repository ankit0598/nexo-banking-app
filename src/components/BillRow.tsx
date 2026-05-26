import type { Bill } from '../types'
import { formatINR } from '../store'
import StatusBadge from './StatusBadge'

interface BillRowProps {
  bill: Bill
  onPay?: (bill: Bill) => void
}

const categoryStyle: Record<Bill['category'], { color: string; icon: JSX.Element }> = {
  electricity: { color: '#f59e0b', icon: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /> },
  mobile: { color: '#22d3ee', icon: <rect x="6" y="3" width="12" height="18" rx="2" /> },
  internet: { color: '#3b82f6', icon: <path d="M2 8a14 14 0 0 1 20 0M5 12a10 10 0 0 1 14 0M9 16a5 5 0 0 1 6 0M12 20h.01" /> },
  credit_card: { color: '#a855f7', icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></> },
  rent: { color: '#10b981', icon: <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z" /> },
  insurance: { color: '#ec4899', icon: <path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3Z" /> },
}

const daysUntil = (iso: string): number => {
  const d = new Date(iso)
  const now = new Date('2026-05-25T10:30:00+05:30')
  return Math.ceil((+d - +now) / (1000 * 60 * 60 * 24))
}

export default function BillRow({ bill, onPay }: BillRowProps) {
  const s = categoryStyle[bill.category]
  const days = daysUntil(bill.dueDate)
  const isPaid = bill.status === 'paid'
  const isOverdue = bill.status === 'overdue' || (!isPaid && days < 0)

  return (
    <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${s.color}22`, color: s.color }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {s.icon}
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white truncate">{bill.biller}</span>
          {bill.autopay && <StatusBadge tone="blue">Autopay</StatusBadge>}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">
          {isPaid
            ? 'Paid'
            : isOverdue
            ? `Overdue by ${Math.abs(days)} days`
            : days === 0
            ? 'Due today'
            : `Due in ${days} days`}{' '}
          · {new Date(bill.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
        </div>
      </div>
      <div className="text-right shrink-0 flex items-center gap-3">
        <div>
          <div className="text-sm font-semibold font-mono text-white">{formatINR(bill.amount)}</div>
          <div className="mt-0.5">
            {isPaid ? (
              <StatusBadge tone="emerald">Paid</StatusBadge>
            ) : isOverdue ? (
              <StatusBadge tone="red">Overdue</StatusBadge>
            ) : (
              <StatusBadge tone="amber">Upcoming</StatusBadge>
            )}
          </div>
        </div>
        {!isPaid && onPay && (
          <button
            onClick={() => onPay(bill)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 transition-colors"
          >
            Pay
          </button>
        )}
      </div>
    </div>
  )
}
