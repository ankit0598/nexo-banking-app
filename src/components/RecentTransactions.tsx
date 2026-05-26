import { Link } from 'react-router-dom'
import { useStore } from '../store'
import TransactionRow from './TransactionRow'

interface RecentTransactionsProps {
  limit?: number
  accountId?: string
  title?: string
  showViewAll?: boolean
}

export default function RecentTransactions({
  limit = 5,
  accountId,
  title = 'Recent Transactions',
  showViewAll = true,
}: RecentTransactionsProps) {
  const transactions = useStore((s) => s.transactions)
  const filtered = accountId ? transactions.filter((t) => t.accountId === accountId) : transactions
  const sorted = [...filtered].sort((a, b) => +new Date(b.date) - +new Date(a.date))
  const shown = sorted.slice(0, limit)

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {showViewAll && (
          <Link to="/accounts" className="text-xs text-blue-400 hover:text-blue-300">
            View all →
          </Link>
        )}
      </div>
      <div className="divide-y divide-white/5">
        {shown.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-slate-500">No transactions yet</div>
        ) : (
          shown.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
        )}
      </div>
    </div>
  )
}
