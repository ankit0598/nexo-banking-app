import { useStore, formatINR } from '../store'

interface PaymentItem {
  id: string
  label: string
  amount: number
  dueDate: string
  type: 'bill' | 'emi' | 'insurance'
  daysLeft: number
}

const typeColor: Record<string, string> = {
  bill: 'text-blue-400 bg-blue-500/10',
  emi: 'text-orange-400 bg-orange-500/10',
  insurance: 'text-purple-400 bg-purple-500/10',
}

const typeLabel: Record<string, string> = {
  bill: 'Bill',
  emi: 'EMI',
  insurance: 'Insurance',
}

const TODAY = new Date('2026-05-25T00:00:00+05:30')

function daysLeft(dateStr: string): number {
  return Math.round((new Date(dateStr).getTime() - TODAY.getTime()) / 86400000)
}

export default function UpcomingPayments() {
  const bills = useStore((s) => s.bills)
  const loans = useStore((s) => s.loans)
  const policies = useStore((s) => s.policies)

  const items: PaymentItem[] = [
    ...bills
      .filter((b) => b.status !== 'paid')
      .map((b) => ({
        id: `bill-${b.id}`,
        label: b.biller,
        amount: b.amount,
        dueDate: b.dueDate,
        type: 'bill' as const,
        daysLeft: daysLeft(b.dueDate),
      })),
    ...loans
      .filter((l) => l.status === 'active')
      .map((l) => ({
        id: `loan-${l.id}`,
        label: `${l.lender} EMI`,
        amount: l.emiAmount,
        dueDate: l.nextEmiDate,
        type: 'emi' as const,
        daysLeft: daysLeft(l.nextEmiDate),
      })),
    ...policies
      .filter((p) => p.status === 'active')
      .map((p) => ({
        id: `ins-${p.id}`,
        label: p.insurer,
        amount: p.premiumAmount,
        dueDate: p.nextPremiumDate,
        type: 'insurance' as const,
        daysLeft: daysLeft(p.nextPremiumDate),
      })),
  ]
    .filter((item) => item.daysLeft >= 0 && item.daysLeft <= 60)
    .sort((a, b) => a.daysLeft - b.daysLeft)

  const totalDue = items.reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-semibold text-white">Upcoming Payments</div>
          <div className="text-xs text-slate-500 mt-0.5">
            Next 60 days · {items.length} payments
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Total Due</div>
          <div className="text-base font-mono font-bold text-amber-400">{formatINR(totalDue)}</div>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-none w-44 bg-white/5 rounded-xl p-3 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${typeColor[item.type]}`}>
                {typeLabel[item.type]}
              </span>
              <span
                className={`text-[10px] font-mono ${
                  item.daysLeft === 0
                    ? 'text-red-400'
                    : item.daysLeft <= 7
                    ? 'text-red-400'
                    : item.daysLeft <= 14
                    ? 'text-amber-400'
                    : 'text-slate-500'
                }`}
              >
                {item.daysLeft === 0 ? 'Today' : `${item.daysLeft}d`}
              </span>
            </div>
            <div className="text-xs text-slate-300 font-medium truncate mb-1">{item.label}</div>
            <div className="text-sm font-mono font-bold text-white">{formatINR(item.amount)}</div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-slate-500 py-4 px-2">No upcoming payments in 60 days.</div>
        )}
      </div>
    </div>
  )
}
