import { useNavigate } from 'react-router-dom'
import type { Account } from '../types'
import { formatINR } from '../store'

interface AccountCardProps {
  account: Account
  compact?: boolean
}

const typeLabel: Record<Account['type'], string> = {
  savings: 'Savings',
  current: 'Current',
  credit_card: 'Credit Card',
}

export default function AccountCard({ account, compact = false }: AccountCardProps) {
  const navigate = useNavigate()
  const isCredit = account.type === 'credit_card'
  return (
    <button
      onClick={() => navigate(`/accounts/${account.id}`)}
      className={[
        'group relative text-left rounded-xl bg-gradient-to-br',
        account.gradient,
        'border border-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5',
        compact ? 'min-w-[260px] p-4' : 'p-5',
      ].join(' ')}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-white/60">{typeLabel[account.type]}</div>
          <div className="text-sm font-semibold text-white mt-0.5">{account.name}</div>
        </div>
        <div className="text-[11px] font-mono text-white/70">{account.accountNumber}</div>
      </div>

      <div className="mt-6">
        <div className="text-[10px] uppercase tracking-wider text-white/60">
          {isCredit ? 'Outstanding' : 'Available Balance'}
        </div>
        <div className="text-2xl font-bold font-mono text-white mt-1">
          {formatINR(account.balance)}
        </div>
        {isCredit && account.creditLimit && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-[11px] text-white/70">
              <span>Used</span>
              <span className="font-mono">
                {Math.round((account.balance / account.creditLimit) * 100)}% of {formatINR(account.creditLimit)}
              </span>
            </div>
            <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-white/70"
                style={{ width: `${(account.balance / account.creditLimit) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-[11px] text-white/60">{account.bankName}</div>
    </button>
  )
}
