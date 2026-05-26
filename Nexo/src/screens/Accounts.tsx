import { useState } from 'react'
import { useStore, formatINR } from '../store'
import AccountCard from '../components/AccountCard'
import type { AccountType } from '../types'

type Filter = 'all' | AccountType

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'savings', label: 'Savings' },
  { value: 'current', label: 'Current' },
  { value: 'credit_card', label: 'Credit Cards' },
]

export default function Accounts() {
  const accounts = useStore((s) => s.accounts)
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = filter === 'all' ? accounts : accounts.filter((a) => a.type === filter)
  const totalAssets = accounts.filter((a) => a.type !== 'credit_card').reduce((s, a) => s + a.balance, 0)
  const totalCredit = accounts.filter((a) => a.type === 'credit_card').reduce((s, a) => s + a.balance, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Accounts</h1>
        <p className="text-sm text-slate-400 mt-1">Manage all your bank accounts and cards</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <SummaryCard label="Total Assets" value={formatINR(totalAssets)} tone="emerald" />
        <SummaryCard label="Credit Outstanding" value={formatINR(totalCredit)} tone="amber" />
        <SummaryCard label="Net Position" value={formatINR(totalAssets - totalCredit)} tone="blue" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={[
              'text-xs font-medium px-3 py-1.5 rounded-full transition-colors',
              filter === f.value
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((a) => (
          <AccountCard key={a.id} account={a} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 text-sm">No accounts match this filter</div>
        )}
      </div>
    </div>
  )
}

interface SummaryCardProps {
  label: string
  value: string
  tone: 'emerald' | 'amber' | 'blue'
}

function SummaryCard({ label, value, tone }: SummaryCardProps) {
  const cls = {
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    blue: 'bg-blue-500/10 text-blue-400',
  }[tone]
  return (
    <div className={`${cls} rounded-xl p-4`}>
      <div className="text-[11px] uppercase tracking-wider opacity-80 mb-1">{label}</div>
      <div className="text-xl font-bold font-mono">{value}</div>
    </div>
  )
}
