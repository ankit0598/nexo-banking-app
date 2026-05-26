import { Link, useParams } from 'react-router-dom'
import { useStore, formatINR } from '../store'
import RecentTransactions from '../components/RecentTransactions'

export default function AccountDetail() {
  const { id } = useParams<{ id: string }>()
  const account = useStore((s) => s.accounts.find((a) => a.id === id))
  const txCount = useStore((s) => s.transactions.filter((t) => t.accountId === id).length)

  if (!account) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Account not found.</p>
        <Link to="/accounts" className="text-blue-400 hover:text-blue-300 text-sm mt-3 inline-block">
          ← Back to Accounts
        </Link>
      </div>
    )
  }

  const isCredit = account.type === 'credit_card'

  return (
    <div className="space-y-6">
      <Link to="/accounts" className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
        ← Back to Accounts
      </Link>

      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${account.gradient} border border-white/10 p-8`}>
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-white/70">{account.bankName}</div>
            <h1 className="text-2xl font-bold text-white mt-1">{account.name}</h1>
            <div className="text-sm font-mono text-white/80 mt-1">{account.accountNumber}</div>
            {account.ifsc && <div className="text-xs font-mono text-white/60 mt-0.5">IFSC: {account.ifsc}</div>}
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-white/70">
              {isCredit ? 'Outstanding' : 'Available'}
            </div>
            <div className="text-4xl font-bold font-mono text-white mt-1">{formatINR(account.balance)}</div>
            {isCredit && account.creditLimit && (
              <div className="text-xs font-mono text-white/70 mt-1">
                Limit: {formatINR(account.creditLimit)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Transactions" value={String(txCount)} mono={false} />
        <Stat label="Balance" value={formatINR(account.balance)} />
        {isCredit && account.creditLimit ? (
          <>
            <Stat label="Credit Limit" value={formatINR(account.creditLimit)} />
            <Stat label="Available" value={formatINR(account.availableBalance || 0)} />
          </>
        ) : (
          <>
            <Stat label="Account Type" value={account.type === 'savings' ? 'Savings' : 'Current'} mono={false} />
            <Stat label="Status" value="Active" mono={false} tone="emerald" />
          </>
        )}
      </div>

      <RecentTransactions accountId={account.id} limit={50} title="All Transactions" showViewAll={false} />
    </div>
  )
}

interface StatProps {
  label: string
  value: string
  mono?: boolean
  tone?: 'emerald'
}

function Stat({ label, value, mono = true, tone }: StatProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
      <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">{label}</div>
      <div className={`text-base font-semibold ${mono ? 'font-mono' : ''} ${tone === 'emerald' ? 'text-emerald-400' : 'text-white'}`}>
        {value}
      </div>
    </div>
  )
}
